import express from 'express';
import { GoogleGenAI, Modality } from '@google/genai';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
app.use(express.json({ limit: '64kb' }));

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY ?? '' });

const SYSTEM_INSTRUCTION = `You are an AI receptionist for Ammie's Auto Repair.
Your goal is to collect the following information from the user:
1. Wrecked car information (Make, Model, Year, and description of damage).
2. Whether they have insurance.
3. When they would like to come in for an estimate.

Contact Information:
- Phone: 720-676-5646

Business Hours:
- Monday - Saturday: 9:00 AM to 5:00 PM
- Sunday: Closed

Be professional, empathetic, and helpful.
Always provide the correct business hours and phone number if asked.
If the user provides all info, thank them and let them know someone will reach out to confirm.
Keep responses concise and friendly.`;

app.post('/api/chat', async (req, res) => {
  const { history, userMessage } = req.body ?? {};
  if (typeof userMessage !== 'string' || !userMessage.trim()) {
    return res.status(400).json({ error: 'userMessage is required' });
  }
  try {
    const safeHistory = Array.isArray(history) ? history.slice(-10) : [];
    const result = await ai.models.generateContent({
      model: 'gemini-2.0-flash',
      contents: [...safeHistory, { role: 'user', parts: [{ text: userMessage }] }],
      config: { systemInstruction: SYSTEM_INSTRUCTION },
    });
    res.json({ text: result.text ?? '' });
  } catch (err) {
    console.error('[/api/chat]', err);
    res.status(500).json({ error: 'Chat service unavailable' });
  }
});

app.post('/api/tts', async (req, res) => {
  const { text } = req.body ?? {};
  if (typeof text !== 'string' || !text.trim()) {
    return res.status(400).json({ error: 'text is required' });
  }
  try {
    const result = await ai.models.generateContent({
      model: 'gemini-2.5-flash-preview-tts',
      contents: [{ parts: [{ text }] }],
      config: {
        responseModalities: [Modality.AUDIO],
        speechConfig: { voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Kore' } } },
      },
    });
    const audio = result.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
    if (!audio) return res.status(500).json({ error: 'No audio generated' });
    res.json({ audio });
  } catch (err) {
    console.error('[/api/tts]', err);
    res.status(500).json({ error: 'TTS service unavailable' });
  }
});

// Serve built frontend in production
if (process.env.NODE_ENV === 'production') {
  const dist = path.join(__dirname, 'dist');
  app.use(express.static(dist));
  app.get('*', (_req, res) => res.sendFile(path.join(dist, 'index.html')));
}

// In dev, Express listens on 3001; Vite (3000) proxies /api/* here.
// In production, PORT is provided by the host (Replit uses 3000).
const PORT = Number(process.env.PORT ?? (process.env.NODE_ENV === 'production' ? 3000 : 3001));
app.listen(PORT, '0.0.0.0', () => console.log(`Server on :${PORT}`));

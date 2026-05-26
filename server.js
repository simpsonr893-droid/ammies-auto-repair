import express from 'express';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { GoogleGenAI, Modality } from '@google/genai';

const __dirname = dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = parseInt(process.env.PORT ?? '3001', 10);

app.use(express.json({ limit: '10kb' }));

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY ?? '' });

const SYSTEM_INSTRUCTION = `You are an AI receptionist for Sammie's Autobody Shop.
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
  const { history, userMessage } = req.body;
  if (!userMessage || typeof userMessage !== 'string' || userMessage.length > 2000) {
    return res.status(400).json({ error: 'Invalid request' });
  }
  try {
    const safeHistory = Array.isArray(history)
      ? history.slice(-20).filter(
          (m) =>
            m &&
            typeof m.role === 'string' &&
            Array.isArray(m.parts) &&
            m.parts.every((p) => typeof p?.text === 'string')
        )
      : [];
    const contents = [...safeHistory, { role: 'user', parts: [{ text: userMessage }] }];
    const response = await ai.models.generateContent({
      model: 'gemini-2.0-flash',
      contents,
      config: { systemInstruction: SYSTEM_INSTRUCTION },
    });
    res.json({ text: response.text ?? '' });
  } catch (err) {
    console.error('Chat error:', err);
    res.status(500).json({ error: 'Failed to generate response' });
  }
});

app.post('/api/tts', async (req, res) => {
  const { text } = req.body;
  if (!text || typeof text !== 'string' || text.length > 1000) {
    return res.status(400).json({ error: 'Invalid request' });
  }
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-preview-tts',
      contents: [{ parts: [{ text }] }],
      config: {
        responseModalities: [Modality.AUDIO],
        speechConfig: { voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Kore' } } },
      },
    });
    const audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data ?? null;
    res.json({ audio });
  } catch (err) {
    console.error('TTS error:', err);
    res.status(500).json({ error: 'Failed to generate speech' });
  }
});

// Serve Vite build in production; in dev the Vite dev server handles static files
app.use(express.static(join(__dirname, 'dist')));
app.get('*', (_req, res) => {
  res.sendFile(join(__dirname, 'dist', 'index.html'));
});

app.listen(PORT, '0.0.0.0', () => console.log(`Server running on :${PORT}`));

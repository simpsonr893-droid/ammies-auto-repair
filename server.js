import express from 'express';
import { GoogleGenAI, Modality } from '@google/genai';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const app = express();
app.use(express.json({ limit: '20kb' }));

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || '' });

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

function isValidHistory(history) {
  if (!Array.isArray(history) || history.length > 20) return false;
  return history.every(item =>
    (item.role === 'user' || item.role === 'model') &&
    Array.isArray(item.parts) &&
    item.parts.length === 1 &&
    typeof item.parts[0]?.text === 'string' &&
    item.parts[0].text.length <= 2000
  );
}

app.post('/api/chat', async (req, res) => {
  const { history = [], message } = req.body;
  if (!message || typeof message !== 'string' || message.trim().length === 0 || message.length > 1000) {
    return res.status(400).json({ error: 'Invalid message' });
  }
  if (!isValidHistory(history)) {
    return res.status(400).json({ error: 'Invalid history' });
  }
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.0-flash',
      contents: [...history, { role: 'user', parts: [{ text: message.trim() }] }],
      config: { systemInstruction: SYSTEM_INSTRUCTION },
    });
    const text = response.text?.trim() ||
      "I'm having trouble connecting right now. Please try again or call us at 720-676-5646.";
    res.json({ text });
  } catch (err) {
    console.error('Gemini chat error:', err);
    res.status(500).json({ error: 'Service unavailable' });
  }
});

app.post('/api/tts', async (req, res) => {
  const { text } = req.body;
  if (!text || typeof text !== 'string' || text.length > 2000) {
    return res.status(400).json({ error: 'Invalid text' });
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
    const audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
    if (!audio) return res.status(500).json({ error: 'No audio generated' });
    res.json({ audio });
  } catch (err) {
    console.error('Gemini TTS error:', err);
    res.status(500).json({ error: 'Service unavailable' });
  }
});

app.use(express.static(join(__dirname, 'dist')));
app.get('*', (_, res) => res.sendFile(join(__dirname, 'dist', 'index.html')));

const PORT = process.env.PORT || 3001;
app.listen(PORT, '0.0.0.0', () => console.log(`Server running on port ${PORT}`));

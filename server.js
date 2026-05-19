import express from 'express';
import rateLimit from 'express-rate-limit';
import { GoogleGenAI, Modality } from '@google/genai';
import { config } from 'dotenv';

config();

const app = express();
app.use(express.json());

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 20,
  message: { error: 'Too many requests. Please try again later.' },
});

app.use('/api/', limiter);

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

app.post('/api/chat', async (req, res) => {
  const { message, history } = req.body;

  if (!message || typeof message !== 'string') {
    return res.status(400).json({ error: 'Invalid message.' });
  }

  const sanitized = message.trim().slice(0, 500);
  if (!sanitized) {
    return res.status(400).json({ error: 'Message cannot be empty.' });
  }

  try {
    const contents = [
      ...(history || []).map(h => ({ role: h.role, parts: [{ text: h.content }] })),
      { role: 'user', parts: [{ text: sanitized }] },
    ];

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-preview',
      contents,
      config: { systemInstruction: SYSTEM_INSTRUCTION },
    });

    res.json({ text: response.text });
  } catch (err) {
    console.error('Chat error:', err);
    res.status(500).json({ error: 'AI service unavailable. Please call us at (720) 676-5646.' });
  }
});

app.post('/api/tts', async (req, res) => {
  const { text } = req.body;

  if (!text || typeof text !== 'string') {
    return res.status(400).json({ error: 'Invalid text.' });
  }

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-preview-tts',
      contents: [{ parts: [{ text: text.slice(0, 300) }] }],
      config: {
        responseModalities: [Modality.AUDIO],
        speechConfig: {
          voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Kore' } },
        },
      },
    });

    const audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
    if (!audio) return res.status(500).json({ error: 'No audio generated.' });

    res.json({ audio });
  } catch (err) {
    console.error('TTS error:', err);
    res.status(500).json({ error: 'TTS unavailable.' });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`API server running on port ${PORT}`));

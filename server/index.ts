import express, { Request, Response } from 'express';
import { GoogleGenAI, Modality } from '@google/genai';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const apiKey = process.env.GEMINI_API_KEY;
if (!apiKey) {
  console.warn('[server] GEMINI_API_KEY is not set — /api/chat and /api/tts will return 503.');
}
const ai = apiKey ? new GoogleGenAI({ apiKey }) : null;

const isProd = process.env.NODE_ENV === 'production';
const PORT = Number(process.env.PORT) || 3000;

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

const MAX_MESSAGE_CHARS = 4000;
const MAX_TTS_CHARS = 2000;
const MAX_HISTORY_TURNS = 10;

interface HistoryItem {
  role: 'user' | 'model';
  text: string;
}

async function main() {
  const app = express();
  app.use(express.json({ limit: '32kb' }));

  app.post('/api/chat', async (req: Request, res: Response) => {
    if (!ai) return res.status(503).json({ error: 'AI service unavailable.' });
    try {
      const { history, message } = req.body ?? {};
      if (typeof message !== 'string' || !message.trim()) {
        return res.status(400).json({ error: 'Message required.' });
      }
      const safeHistory = Array.isArray(history)
        ? (history as HistoryItem[])
            .slice(-MAX_HISTORY_TURNS)
            .filter(m => (m?.role === 'user' || m?.role === 'model') && typeof m?.text === 'string')
            .map(m => ({ role: m.role, parts: [{ text: m.text.slice(0, MAX_MESSAGE_CHARS) }] }))
        : [];

      const response = await ai.models.generateContent({
        model: 'gemini-2.0-flash',
        contents: [
          ...safeHistory,
          { role: 'user', parts: [{ text: message.slice(0, MAX_MESSAGE_CHARS) }] },
        ],
        config: { systemInstruction: SYSTEM_INSTRUCTION },
      });
      res.json({ text: response.text ?? '' });
    } catch (err) {
      console.error('[chat]', err);
      res.status(500).json({ error: 'Generation failed.' });
    }
  });

  app.post('/api/tts', async (req: Request, res: Response) => {
    if (!ai) return res.status(503).json({ error: 'AI service unavailable.' });
    try {
      const { text } = req.body ?? {};
      if (typeof text !== 'string' || !text.trim()) {
        return res.status(400).json({ error: 'Text required.' });
      }
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash-preview-tts',
        contents: [{ parts: [{ text: text.slice(0, MAX_TTS_CHARS) }] }],
        config: {
          responseModalities: [Modality.AUDIO],
          speechConfig: { voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Kore' } } },
        },
      });
      const audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data ?? null;
      res.json({ audio });
    } catch (err) {
      console.error('[tts]', err);
      res.status(500).json({ error: 'TTS failed.' });
    }
  });

  if (isProd) {
    const distDir = path.resolve(__dirname, '../dist');
    app.use(express.static(distDir));
    app.get(/.*/, (_req, res) => {
      res.sendFile(path.join(distDir, 'index.html'));
    });
  } else {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[server] ready on http://0.0.0.0:${PORT} (${isProd ? 'prod' : 'dev'})`);
  });
}

main().catch(err => {
  console.error('[server] fatal', err);
  process.exit(1);
});

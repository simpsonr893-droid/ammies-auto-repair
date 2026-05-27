<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/44c470bb-ce73-4c15-a962-f26f709ea4f3

## Run Locally

**Prerequisites:** Node.js 20+

1. Install dependencies: `npm install`
2. Copy `.env.example` to `.env.local` and set `GEMINI_API_KEY` to your Gemini API key.
3. Run the app: `npm run dev` (starts an Express server with Vite middleware on port 3000).

## Architecture

- **Client** (`src/`): React + Vite SPA. Does not import the Gemini SDK or hold any API key.
- **Server** (`server/index.ts`): Express. Holds `GEMINI_API_KEY`, exposes `POST /api/chat` and `POST /api/tts`, and serves the SPA (via Vite middleware in dev, static `dist/` in prod).

## Deploy (Replit)

Set `GEMINI_API_KEY` in the Secrets panel. Build command: `npm run build`. Start command: `npm start`.

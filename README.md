# miniroute-example

Example project combining:
- Express backend with simple API endpoints (/api/users)
- Client-side SPA using miniroute for routing

Requirements
- Node.js 18+ (or compatible)
- npm

Quick start
1. Install:
   npm install

2. Run:
   npm start
   Open http://localhost:3000

3. Run tests:
   npm test

Notes
- The client imports miniroute from the unpkg ESM bundle for simplicity: `import Router from 'https://unpkg.com/miniroute?module';`
- The backend tests use Jest + Supertest and cover the API endpoints.

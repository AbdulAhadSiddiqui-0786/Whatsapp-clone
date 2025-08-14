# WhatsApp Web Clone - Full Project (Backend + Frontend)

This archive contains a complete starter project that satisfies the evaluation task:
- Backend: Node.js + Express + Socket.IO
- Frontend: React (Vite) + TailwindCSS
- A `process_payloads.js` script to load the uploaded sample webhook JSON payloads into MongoDB.

## Quick start (development)

Prerequisites:
- Node.js and pnpm installed
- A running MongoDB (Atlas or local). Get a connection URI.

1. Backend
```bash
cd backend
# install deps
pnpm install
# copy .env.sample to .env and set MONGO_URI
cp .env
# edit .env and set MONGO_URI (e.g., mongodb+srv://user:pass@cluster.mongodb.net)
# Run payload processor (optional, to seed DB from provided sample payloads)
pnpm run process:payloads

# start backend dev server (nodemon)
pnpm rundev
```

2. Frontend
```bash
cd frontend
pnpm install
# optionally edit .env to set VITE_API_URL/VITE_SOCKET_URL to your backend (defaults to http://localhost:4000)
pnpm run dev
```

Open frontend at http://localhost:5173 and backend at http://localhost:4000

## Notes
- The included `whatsapp_payloads_extracted` folder holds the sample JSONs you uploaded; the `process_payloads.js` will read from that folder when run from the backend directory.
- `server.js` provides endpoints:
  - POST /webhook  (simulate webhook)
  - GET /conversations
  - GET /conversations/:wa_id/messages
  - POST /conversations/:wa_id/messages  (demo send)

## Deployment
- Backend can be deployed to Render/Heroku/ Railway (ensure WebSocket support if using Socket.IO).
- Frontend can be deployed to Vercel.



## Realtime Setup (Socket.IO + Change Streams)

Backend env (`backend/.env`):
```
MONGO_URI=mongodb+srv://<user>:<pass>@<cluster>/whatsapp?retryWrites=true&w=majority
PORT=5000
```

Frontend env (`frontend/.env`):
```
VITE_BACKEND_URL=https://your-backend-host.tld
```

Install:
```
cd backend && npm i && npm i socket.io && cd ../frontend && npm i && npm i socket.io-client
```

Run:
```
# backend
node process_payloads.js
node server.js

# frontend
npm run dev
```

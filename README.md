# AI-Assisted Text Classification API (MERN)

A MERN application that classifies customer text as `Complaint`, `Query`, `Feedback`, or `Other` and returns an AI-generated confidence score. It includes a React interface, an Express REST API, optional MongoDB history, and local AI inference through Ollama.

## Live application

- Frontend: https://ai-assisted-text-classification-api.vercel.app
- Backend health: https://ai-assisted-text-classification-api-delta.vercel.app/api/health
- Classification endpoint: `POST https://ai-assisted-text-classification-api-delta.vercel.app/api/classify`

The hosted backend currently reaches Ollama through a temporary Cloudflare Quick Tunnel. The computer running Ollama and the tunnel must remain online. Quick Tunnel addresses change when restarted and are intended for demonstrations, not production.

## Technology

- MongoDB Atlas and Mongoose: classification history
- Express and Node.js: REST API
- React and Vite: frontend
- Ollama with `llama3.2:3b`: AI classification
- Vercel: frontend and serverless API hosting

```text
server/
  api/index.js                         Vercel function entry
  src/config/database.js
  src/controllers/classificationController.js
  src/models/Classification.js
  src/routes/classificationRoutes.js
  src/services/classificationService.js
client/src/
  api.js
  main.jsx
```

## API

### Classify text

```http
POST /api/classify
Content-Type: application/json
```

Request:

```json
{
  "text": "My order arrived damaged."
}
```

Response:

```json
{
  "category": "Complaint",
  "confidence": 0.96
}
```

Live curl example:

```bash
curl -X POST https://ai-assisted-text-classification-api-delta.vercel.app/api/classify \
  -H "Content-Type: application/json" \
  -d '{"text":"Can I change my delivery address?"}'
```

The API returns HTTP `400` for invalid text, `404` for unknown routes, and `500` when classification fails. Errors use `{ "error": "message" }`.

## Local setup

Requirements: Node.js 20+, [Ollama](https://ollama.com/), and optionally MongoDB.

Install the AI model and start the backend:

```bash
ollama pull llama3.2:3b
cd server
npm install
copy .env.example .env
npm start
```

Start the frontend in another terminal:

```bash
cd client
npm install
npm run dev
```

Open `http://localhost:5173`. Without `MONGODB_URI`, classification continues to work but results are not saved.

### Local backend environment

```env
PORT=3000
CORS_ORIGIN=http://localhost:5173
OLLAMA_URL=http://127.0.0.1:11434
OLLAMA_MODEL=llama3.2:3b
MONGODB_URI=mongodb://127.0.0.1:27017/text-classifier
```

## Vercel deployment

Create two Vercel projects from this repository.

### Backend project

Set the Root Directory to `server` and configure:

```env
CORS_ORIGIN=https://ai-assisted-text-classification-api.vercel.app
OLLAMA_URL=https://YOUR-TUNNEL.trycloudflare.com
OLLAMA_MODEL=llama3.2:3b
MONGODB_URI=mongodb+srv://USERNAME:PASSWORD@CLUSTER.mongodb.net/DATABASE?retryWrites=true&w=majority
NODE_ENV=production
```

Do not configure `PORT`; Vercel manages it. In MongoDB Atlas, allow connections from Vercel and never commit database credentials.

### Frontend project

Set the Root Directory to `client` and configure:

```env
VITE_API_URL=https://ai-assisted-text-classification-api-delta.vercel.app
```

Vite embeds environment variables at build time, so redeploy after changing `VITE_API_URL`.

### Temporary public Ollama tunnel

With Ollama already running, install `cloudflared`, then run:

```cmd
set OLLAMA_ORIGIN=http://127.0.0.1:11434
cloudflared tunnel --protocol http2 --url %OLLAMA_ORIGIN% --http-host-header localhost:11434
```

Copy the generated HTTPS address into the backend's `OLLAMA_URL` and redeploy. Keep the terminal open. For production, use an authenticated hosted model or a secured cloud deployment instead of an unauthenticated Quick Tunnel.

## How AI is used

The service sends category definitions and the submitted text to Ollama, requesting strict JSON. It validates the returned category against the four supported categories. Confidence is clamped between `0` and `1`; if the model omits confidence, the API maps it to `0.75`. Temperature is set to `0` for consistent output.

## Testing and Postman

Run the backend tests:

```bash
cd server
npm test
```

Import [`postman_collection.json`](./postman_collection.json) into Postman for health and classification requests.

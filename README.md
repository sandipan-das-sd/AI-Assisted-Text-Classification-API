# AI-Assisted Text Classification API (MERN)

A MERN application that sends text to a local Ollama AI model and returns one of four categories: `Complaint`, `Query`, `Feedback`, or `Other`, plus a confidence score. MongoDB is optional and stores successful classifications when configured. The React UI is a convenient API tester.

## Stack and structure

- MongoDB + Mongoose: optional classification history
- Express + Node.js: REST API, controller, route, service, and model layers
- React + Vite: test interface
- Ollama (`llama3.2:3b`): local AI classification

```text
server/src/
  config/database.js
  controllers/classificationController.js
  models/Classification.js
  routes/classificationRoutes.js
  services/classificationService.js
client/src/
  api.js
  main.jsx
```

## Setup

Requires Node.js 20+, [Ollama](https://ollama.com/), and optionally MongoDB.

```bash
ollama pull llama3.2:3b
cd server
npm install
copy .env.example .env
npm start
```

In another terminal:

```bash
cd client
npm install
npm run dev
```

Open `http://localhost:5173`. If MongoDB is unavailable, remove/comment `MONGODB_URI`; the API still works but does not save history.

## API

`POST http://localhost:3000/api/classify`

```json
{ "text": "My order arrived damaged." }
```

Example response:

```json
{ "category": "Complaint", "confidence": 0.96 }
```

curl example:

```bash
curl -X POST http://localhost:3000/api/classify -H "Content-Type: application/json" -d "{\"text\":\"Can I change my delivery address?\"}"
```

Errors use `{ "error": "message" }` with HTTP 400 for invalid input, 404 for unknown routes, or 500 when classification fails. Run server tests with `npm test`.

## How AI was used

The service gives Ollama category definitions and requests strict JSON. The returned category is validated case-insensitively against the four allowed values. Confidence is clamped to `0–1`; if the model omits it, the API maps it to `0.75`. Temperature is `0` for consistent classifications.

Import [`postman_collection.json`](./postman_collection.json) into Postman for ready-to-run health and classification requests.

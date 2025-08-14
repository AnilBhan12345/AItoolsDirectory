
# AI Tools Backend (Node.js)

This simple backend serves an AI tools list at `/tools`. By default it serves `tools.json` (a static file).

## How it works
- `GET /tools` returns JSON:
  - If `GEMINI_API_KEY` and `GEMINI_ENDPOINT` environment variables are set, the server will attempt to fetch live data from the Gemini endpoint you provide.
  - Otherwise, it returns the static `tools.json` file (included).

## Setup (locally)
1. Install Node.js (v18+ recommended).
2. In this folder, run:
   ```bash
   npm install
   node server.js
   ```
3. Visit `http://localhost:3000/tools` to see the list.

## Deploy (recommended platforms)
- **Render**, **Vercel (Serverless functions)**, **Railway**, **Heroku**, etc.
- Set the environment variables (`GEMINI_API_KEY`, `GEMINI_ENDPOINT`) in your platform's dashboard if you want Gemini-powered live results.

## Gemini integration
- The server contains a flexible placeholder to POST to `GEMINI_ENDPOINT` with `{ prompt, max_output_tokens }`.
- For Vertex AI / Gemini Pro you'll need to provide a correct REST endpoint URL and API key in `GEMINI_ENDPOINT` and `GEMINI_API_KEY`.
- Example Vertex.ai usage requires Google Cloud authentication; alternatively use a gateway or Cloud Function that exposes a simple REST endpoint.

## Security
- Never commit API keys to GitHub. Use your host's environment variables.
- Use HTTPS endpoints.

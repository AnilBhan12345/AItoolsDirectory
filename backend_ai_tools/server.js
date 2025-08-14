// Simple Express backend for AI Tools Directory
// - Serves /tools from tools.json by default (no API keys required)
// - If GEMINI_API_KEY and GEMINI_ENDPOINT are set, attempts to call Gemini (Vertex AI) REST API
//
// IMPORTANT: Do NOT commit your API keys to GitHub. Use environment variables on your host (Vercel/Render).

const express = require('express');
const fetch = require('node-fetch');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
app.use(cors());
app.use(express.json());

const TOOLS_FILE = path.join(__dirname, 'tools.json');
const PORT = process.env.PORT || 3000;

app.get('/tools', async (req, res) => {
  // If Gemini config exists, attempt to call Gemini to get live list
  const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
  const GEMINI_ENDPOINT = process.env.GEMINI_ENDPOINT; // Optional: a full REST endpoint URL
  try {
    if (GEMINI_API_KEY && GEMINI_ENDPOINT) {
      // Example: user must provide a valid REST endpoint for Gemini/VertexAI.
      // The exact request body depends on the endpoint format (Vertex AI, etc.).
      const prompt = `Return JSON array of AI tools with fields: name, description, website_link, category. Provide up to 100 tools.`;
      const body = {
        prompt: prompt,
        max_output_tokens: 8000
      };
      const r = await fetch(GEMINI_ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${GEMINI_API_KEY}`
        },
        body: JSON.stringify(body)
      });
      if (!r.ok) {
        const text = await r.text();
        console.error('Gemini request failed:', r.status, text);
        // Fallback to static file
        const data = JSON.parse(fs.readFileSync(TOOLS_FILE, 'utf8'));
        return res.json({ source: 'fallback', tools: data });
      }
      const json = await r.json();
      // The response parsing will depend on the model; this tries to be flexible.
      // If the model returns `{ tools: [...] }` or a raw array, handle both.
      if (Array.isArray(json)) {
        return res.json({ source: 'gemini', tools: json });
      } else if (json.tools && Array.isArray(json.tools)) {
        return res.json({ source: 'gemini', tools: json.tools });
      } else if (json.content) {
        // Some APIs return text in `content` — attempt to parse JSON from text
        try {
          const parsed = JSON.parse(json.content);
          if (Array.isArray(parsed)) return res.json({ source: 'gemini', tools: parsed });
        } catch (e) {
          console.error('Failed to parse JSON from gemini content:', e.message);
        }
      }
      // If reached here, fallback
      const data = JSON.parse(fs.readFileSync(TOOLS_FILE, 'utf8'));
      return res.json({ source: 'fallback', tools: data });
    } else {
      const data = JSON.parse(fs.readFileSync(TOOLS_FILE, 'utf8'));
      return res.json({ source: 'file', tools: data });
    }
  } catch (err) {
    console.error('Error in /tools:', err);
    const data = JSON.parse(fs.readFileSync(TOOLS_FILE, 'utf8'));
    return res.status(200).json({ source: 'error', tools: data, error: String(err) });
  }
});

app.get('/', (req, res) => {
  res.send('AI Tools backend running. GET /tools to fetch list.');
});

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});

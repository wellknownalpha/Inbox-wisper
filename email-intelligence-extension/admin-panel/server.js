const express = require('express');
const cors = require('cors');
const sqlite3 = require('sqlite3').verbose();
const OpenAI = require('openai');
const gtts = require('gtts');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());
app.use(express.static('public'));
app.use('/audio', express.static('audio'));

// Initialize OpenAI
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || 'your-api-key-here'
});

// Initialize SQLite
const db = new sqlite3.Database('admin.db');
db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS processed_emails (
    id TEXT PRIMARY KEY,
    subject TEXT,
    sender TEXT,
    content TEXT,
    summary TEXT,
    audio_path TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )`);
  
  db.run(`CREATE TABLE IF NOT EXISTS settings (
    key TEXT PRIMARY KEY,
    value TEXT
  )`);
});

// API Routes
app.post('/api/summarize', async (req, res) => {
  try {
    const { content, type = 'brief' } = req.body;
    
    const prompts = {
      headings: "Extract main topics as bullet points:",
      brief: "Summarize in 2-3 sentences:",
      detailed: "Provide detailed summary with context:"
    };
    
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: "You are an email summarization assistant." },
        { role: "user", content: `${prompts[type]}\n\n${content.substring(0, 4000)}` }
      ],
      max_tokens: type === 'detailed' ? 300 : 150
    });
    
    res.json({ summary: response.choices[0].message.content });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/tts', async (req, res) => {
  try {
    const { text } = req.body;
    const filename = `summary_${Date.now()}.mp3`;
    const filepath = path.join(__dirname, 'audio', filename);
    
    if (!fs.existsSync(path.join(__dirname, 'audio'))) {
      fs.mkdirSync(path.join(__dirname, 'audio'));
    }
    
    const tts = gtts(text, 'en');
    tts.save(filepath, (err) => {
      if (err) {
        res.status(500).json({ error: err.message });
      } else {
        res.json({ audioUrl: `/audio/${filename}` });
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/process-email', async (req, res) => {
  try {
    const { subject, sender, content } = req.body;
    const emailId = Buffer.from(`${sender}${subject}${Date.now()}`).toString('base64');
    
    // Generate summary
    const summaryResponse = await fetch('http://localhost:3000/api/summarize', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content, type: 'brief' })
    });
    const { summary } = await summaryResponse.json();
    
    // Generate audio
    const audioResponse = await fetch('http://localhost:3000/api/tts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text: summary })
    });
    const { audioUrl } = await audioResponse.json();
    
    // Save to database
    db.run(
      'INSERT OR REPLACE INTO processed_emails (id, subject, sender, content, summary, audio_path) VALUES (?, ?, ?, ?, ?, ?)',
      [emailId, subject, sender, content, summary, audioUrl]
    );
    
    res.json({ summary, audioUrl });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/emails', (req, res) => {
  db.all('SELECT * FROM processed_emails ORDER BY created_at DESC LIMIT 50', (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
    } else {
      res.json(rows);
    }
  });
});

// Admin Panel Routes
app.get('/admin', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'admin.html'));
});

app.listen(PORT, () => {
  console.log(`Admin panel running on http://localhost:${PORT}`);
});
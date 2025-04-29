import { WebSocketServer } from 'ws';
import http from 'http';
import fetch from 'node-fetch'; 

const server = http.createServer();
const wss = new WebSocketServer({ server });

let id = 1;
let generate = false; // Flag to control generation

function broadcast(data) {
  wss.clients.forEach(client => {
    if (client.readyState === 1) {
      client.send(JSON.stringify(data));
    }
  });
}
3
async function initializeId(retries = 10, delay = 1000) {
  const url = 'http://localhost:3000/api/languages?sortBy=ID';

  for (let i = 0; i < retries; i++) {
    try {
      const response = await fetch(url);
      if (!response.ok) throw new Error("API not ready yet");
      const languages = await response.json();
      const maxId = languages.reduce((max, lang) => Math.max(max, lang.id), 0);
      id = maxId + 1;
      return;
    } catch (err) {
      console.log(`🔁 Waiting for API to be ready... (${i + 1}/${retries})`);
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }

  console.error("❌ Could not fetch initial data after retries. Starting from ID 1.");
}

function startGenerator() {
  return setInterval(() => {
    if (!generate) return;

    const newEntity = {
      id: ++id,
      name: `Lang ${id}`,
      year: 1980 + Math.floor(Math.random() * 40),
      developer: "Real-Time Generator",
      description: "Auto-updated"
    };
    broadcast({ type: 'new_entity', data: newEntity });
  }, 3000);
}

let interval;
const PORT = 4000;

server.listen(PORT, async () => {
  console.log(`✅ WebSocket server running at ws://localhost:${PORT}`);
  await initializeId();
  interval = startGenerator();
});

function shutdown() {
  console.log('\n🛑 Shutting down server...');
  clearInterval(interval);
  wss.close(() => console.log('✅ WebSocket server closed'));
  server.close(() => {
    console.log('✅ HTTP server closed');
    process.exit(0);
  });
}

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);
process.on('exit', shutdown);
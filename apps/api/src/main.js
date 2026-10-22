const http = require('http');

const PORT = process.env.API_PORT || 3000;

const server = http.createServer((req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.writeHead(200);
  res.end(JSON.stringify({
    service: 'SpeakUp Backend API',
    status: 'ONLINE',
    environment: process.env.NODE_ENV || 'development',
    timestamp: new Date().toISOString(),
    path: req.url,
    message: 'Welcome to SpeakUp API! NestJS container is up and running.'
  }, null, 2));
});

server.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 [SpeakUp API] Server running on http://0.0.0.0:${PORT}`);
});

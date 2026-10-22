const http = require('http');

const PORT = process.env.WEB_PORT || 4200;

const server = http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
  res.end(`
    <!DOCTYPE html>
    <html lang="vi">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>SpeakUp - English Learning App</title>
      <style>
        * { margin: 0; padding: 0; box-sizing: border-box; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; }
        body { min-height: 100vh; background: #0f172a; color: #f8fafc; display: flex; align-items: center; justify-content: center; padding: 24px; }
        .card { max-width: 600px; width: 100%; background: #1e293b; border: 1px solid #334155; border-radius: 16px; padding: 40px; box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.5); text-align: center; }
        .badge { display: inline-block; background: rgba(56, 189, 248, 0.1); color: #38bdf8; border: 1px solid rgba(56, 189, 248, 0.2); border-radius: 9999px; padding: 6px 16px; font-size: 14px; font-weight: 600; margin-bottom: 20px; }
        h1 { font-size: 32px; font-weight: 800; margin-bottom: 12px; background: linear-gradient(135deg, #38bdf8, #818cf8); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
        p { color: #94a3b8; font-size: 16px; line-height: 1.6; margin-bottom: 28px; }
        .services { display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; margin-bottom: 28px; text-align: left; }
        .service-item { background: #0f172a; border: 1px solid #334155; border-radius: 10px; padding: 12px; font-size: 13px; }
        .status-dot { display: inline-block; width: 8px; height: 8px; border-radius: 50%; background: #10b981; margin-right: 6px; }
        .btn { display: inline-block; background: #3b82f6; color: white; padding: 12px 28px; border-radius: 8px; text-decoration: none; font-weight: 600; transition: background 0.2s; }
        .btn:hover { background: #2563eb; }
      </style>
    </head>
    <body>
      <div class="card">
        <span class="badge">🚀 Môi trường Docker Sẵn Sàng</span>
        <h1>SpeakUp English App</h1>
        <p>Hệ thống container hóa hoàn chỉnh đã khởi động thành công. Nginx Reverse Proxy đang điều phối lưu lượng mạng mượt mà!</p>
        
        <div class="services">
          <div class="service-item"><span class="status-dot"></span>Nginx: Port 80</div>
          <div class="service-item"><span class="status-dot"></span>Angular Web: 4200</div>
          <div class="service-item"><span class="status-dot"></span>NestJS API: 3000</div>
          <div class="service-item"><span class="status-dot"></span>Postgres: 5432</div>
          <div class="service-item"><span class="status-dot"></span>Redis: 6379</div>
          <div class="service-item"><span class="status-dot"></span>RabbitMQ: 5672</div>
        </div>

        <a class="btn" href="/api/health" target="_blank">Kiểm tra API (/api/health)</a>
      </div>
    </body>
    </html>
  `);
});

server.listen(PORT, '0.0.0.0', () => {
  console.log(`🌐 [SpeakUp Web] Frontend Server running on http://0.0.0.0:${PORT}`);
});

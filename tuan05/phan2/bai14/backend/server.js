const http = require('http');

const PORT = process.env.PORT || 3000;

const server = http.createServer((req, res) => {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    res.writeHead(200);
    res.end();
    return;
  }

  // Root endpoint
  if (req.url === '/' && req.method === 'GET') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
      message: 'Backend API is running',
      status: 'success',
      timestamp: new Date().toISOString()
    }));
    return;
  }

  // API endpoint
  if (req.url === '/api/data' && req.method === 'GET') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
      message: 'Data from Backend',
      status: 'success',
      data: {
        id: 1,
        name: 'Backend Service',
        description: 'Running in private-network',
        timestamp: new Date().toISOString()
      }
    }));
    return;
  }

  // API info endpoint
  if (req.url === '/api/info' && req.method === 'GET') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
      service: 'Backend API',
      version: '1.0.0',
      network: 'private-network',
      hostname: process.env.HOSTNAME || 'backend_service',
      port: PORT,
      environment: process.env.NODE_ENV,
      uptime: process.uptime()
    }));
    return;
  }

  // 404
  res.writeHead(404, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({
    message: 'Endpoint not found',
    status: 'error'
  }));
});

server.listen(PORT, () => {
  console.log(`🚀 Backend API is running on http://0.0.0.0:${PORT}`);
  console.log(`📡 Accessible from private-network as: http://backend_service:${PORT}`);
});

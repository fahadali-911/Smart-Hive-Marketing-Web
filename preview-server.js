const http = require('http');
const fs = require('fs');
const path = require('path');

const root = __dirname;
const routes = {
  '/': 'home.html',
  '/how-we-grow': 'grow.html',
  '/growth-leaks': 'growth leak.html',
  '/case-studies': 'case-studies.html',
  '/contact': 'contact.html'
};
const types = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp'
};

http.createServer((request, response) => {
  const pathname = decodeURIComponent(new URL(request.url, 'http://localhost').pathname);
  const requested = routes[pathname] || pathname.replace(/^\/+/, '');
  const filePath = path.resolve(root, requested);

  if (!filePath.startsWith(root + path.sep)) {
    response.writeHead(403).end('Forbidden');
    return;
  }

  fs.readFile(filePath, (error, content) => {
    if (error) {
      if (error.code === 'ENOENT') {
        fs.readFile(path.join(root, '404.html'), (notFoundError, notFoundPage) => {
          if (notFoundError) {
            response.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' }).end('Not found');
            return;
          }
          response.writeHead(404, {
            'Content-Type': 'text/html; charset=utf-8',
            'Cache-Control': 'no-store'
          });
          response.end(notFoundPage);
        });
        return;
      }
      response.writeHead(500, { 'Content-Type': 'text/plain; charset=utf-8' }).end('Server error');
      return;
    }
    response.writeHead(200, {
      'Content-Type': types[path.extname(filePath).toLowerCase()] || 'application/octet-stream',
      'Cache-Control': 'no-store'
    });
    response.end(content);
  });
}).listen(4173, '127.0.0.1');

// Require Core Modules
const http = require('http');
const fs = require('fs');

// Création du serveur, fonction exécutée à chaque requête
const server = http.createServer((req, res) => {
  // Parse URL
  const url = req.url;
  // Parse HTTP Method
  const method = req.method;
  // Routes
  if (url === '/') {
    res.write('<html>');
    res.write('<head><title>Enter Message</title><head>');
    res.write('<body><form action="/message" method="POST"><input type="text" name="message"><button type="submit">Send</button></form></body>');
    res.write('</html>');
    return res.end();
  }
  if (url === '/message' && method === 'POST') {
    fs.writeFileSync('message.txt', 'DUMMY');
    res.statusCode = 302;
    res.setHeader('Location', '/');
    return res.end();
  }
  res.setHeader('Content-Type', 'text/html');
  res.write('<html>');
  res.write('<head><title>My First Page</title><head>');
  res.write('<body><h1>Hello from my Node.js Server!</h1></body>');
  res.write('</html>');
  res.end();
});

// Lancement du serveur sur le port 3000
server.listen(3000);

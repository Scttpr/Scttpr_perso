// Require http
const http = require('http');
// Define server port
const port = 3000;
// Require route file
const routes = require('./routes.js');

const server = http.createServer(routes.reqHandler);

server.listen(port);
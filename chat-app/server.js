const net = require('node:net');

const PORT = 8080;
const ADDRESS = '127.0.0.1';

const server = net.createServer();

const clients = [];

server.on('connection', (socket) => {
  console.log('new connection to the server!');

  const clientId = clients.length + 1;

  socket.write(`id-${clientId}`);

  socket.on('data', (message) => {
    const id = clients.forEach((client) => {
      client.socket.write(`> User ${clientId}: ${message}`);
    });
  });

  clients.push({ socket, id: clientId.toString() });
});

server.listen(PORT, ADDRESS, () => {
  console.log('Opened server on:', server.address());
});

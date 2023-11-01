const net = require('node:net');

const PORT = 8080;
const ADDRESS = '127.0.0.1';

const server = net.createServer();

const clients = [];

server.on('connection', (socket) => {
  console.log('new connection to the server!');

  const clientId = clients.length + 1;

  clients.forEach((client) => {
    client.socket.write(`User ${clientId} joined!`);
  });

  socket.write(`id-${clientId}`);

  socket.on('data', (message) => {
    clients.forEach((client) => {
      client.socket.write(`> User ${clientId}: ${message}`);
    });
  });

  socket.on('end', () => {
    const index = clients.findIndex((client) => client.id === clientId);
    clients.splice(index, 1);
    clients.forEach((client) => {
      client.socket.write(`User ${clientId} left the room!`);
    });
  });

  socket.on('error', (error) => {
    if (error.code === 'ECONNRESET') {
      const index = clients.findIndex((client) => client.id === clientId);
      clients.splice(index, 1);
      clients.forEach((client) => {
        client.socket.write(`User ${clientId} left the room!`);
      });
    }
  });

  clients.push({ socket, id: clientId.toString() });
});

server.listen(PORT, ADDRESS, () => {
  console.log('Opened server on:', server.address());
});

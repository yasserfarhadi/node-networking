const net = require('node:net');

const PORT = 8080;
const ADDRESS = '127.0.0.1';

const server = net.createServer();

const clients = [];

server.on('connection', (socket) => {
  console.log('new connection to the server!');
  socket.on('data', (data) => {
    clients.forEach((client) => {
      client.write(data);
    });
  });

  clients.push(socket);
});

server.listen(PORT, ADDRESS, () => {
  console.log('Opened server on:', server.address());
});

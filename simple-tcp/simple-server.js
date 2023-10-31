const net = require('net');

const PORT = 8080;

const server = net.createServer((socket) => {
  socket.on('data', (data) => {
    console.log(data);
  });
});

server.listen(PORT, '127.0.0.1', () => {
  console.log('Opened server in:', server.address());
});

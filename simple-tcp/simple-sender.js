const net = require('net');

const socket = net.createConnection(
  {
    host: '127.0.0.1',
    port: '8080',
  },
  () => {
    const buf = Buffer.alloc(2);
    buf[0] = 12;
    buf[1] = 34;
    socket.write(buf);
  }
);

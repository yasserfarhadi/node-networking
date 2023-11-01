const dgram = require('node:dgram');

const reciever = dgram.createSocket('udp4');

reciever.on('message', (message, remoteInfo) => {
  console.log({ remoteInfo, message: message.toString('utf-8') });
});

reciever.bind({
  address: '127.0.0.1',
  port: 8080,
});

reciever.on('listening', () => {
  console.log('Server listening: ', reciever.address());
});

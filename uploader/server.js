const net = require('node:net');
const fs = require('node:fs/promises');

const server = net.createServer(() => {});

server.on('connection', (socket) => {
  console.log('New connection');

  let fileHandle;
  let fileStream;
  socket.on('data', async (data) => {
    if (!fileHandle) {
      socket.pause(); // pause recieve data from client

      const fileName = data.subarray(9).toString('utf-8');

      fileHandle = await fs.open(`storage/${fileName}`, 'w');
      fileStream = fileHandle.createWriteStream();
      fileStream.on('drain', () => {
        socket.resume();
      });
      socket.resume();
      return;
    }

    const shouldWrite = fileStream.write(data);
    if (!shouldWrite) {
      socket.pause();
    }
  });

  socket.on('error', () => {
    if (fileHandle) fileHandle.close();
    console.log('connection ended on error');
  });

  socket.on('end', () => {
    if (fileHandle) fileHandle.close();
    console.log('connection ended on end event');
  });
});

server.listen(8080, '::1', () => {
  console.log('Uploader server opened on', server.address());
});

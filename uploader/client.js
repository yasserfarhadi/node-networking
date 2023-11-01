const net = require('node:net');
const fs = require('node:fs/promises');
const path = require('node:path');

const socket = net.createConnection(
  {
    host: '::1',
    port: 8080,
  },
  async () => {
    const filePath = process.argv[2];
    const fileName = path.basename(filePath);
    const fileHandle = await fs.open(filePath, 'r');
    const fileStream = fileHandle.createReadStream();

    socket.write(`filename-${fileName}`);

    fileStream.on('data', (data) => {
      const shouldWrite = socket.write(data);
      if (!shouldWrite) {
        fileStream.pause();
      }
    });

    socket.on('drain', () => {
      fileStream.resume();
    });

    fileStream.on('end', () => {
      console.log('The file was successfully uploaded');
      socket.end();
    });
  }
);

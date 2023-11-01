const net = require('node:net');
const fs = require('node:fs/promises');
const path = require('node:path');

const clearLine = async (dir) => {
  return new Promise((resolve, reject) => {
    process.stdout.clearLine(dir, () => {
      resolve();
    });
  });
};

const moveCursor = async (dx, dy) => {
  return new Promise((resolve, reject) => {
    process.stdout.moveCursor(dx, dy, () => {
      resolve();
    });
  });
};

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
    const fileSize = (await fileHandle.stat()).size;

    let uploadedPercentage = 0;
    let bytesUploded = 0;

    socket.write(`filename-${fileName}`);

    fileStream.on('data', async (data) => {
      const shouldWrite = socket.write(data);
      if (!shouldWrite) {
        fileStream.pause();
      }
      bytesUploded += data.length;
      let newPercentage = Math.floor((bytesUploded / fileSize) * 100);
      if (newPercentage % 5 === 0 && uploadedPercentage !== newPercentage) {
        uploadedPercentage = newPercentage;
        const progress =
          '[--------------------]'
            .substring(0, newPercentage / 4)
            .replace(/-/g, '=') +
          '[--------------------]'.substring(newPercentage / 4);
        await moveCursor(0, -1);
        await clearLine(0);
        console.log(`Uploading ${fileName} ${progress} ${uploadedPercentage}%`);
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

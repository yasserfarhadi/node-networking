const net = require('node:net');
const readLine = require('node:readline/promises');

const rl = readLine.createInterface({
  input: process.stdin,
  output: process.stdout,
});

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

const PORT = 8080;
const ADDRESS = '127.0.0.1';

const client = net.createConnection(
  {
    port: PORT,
    host: ADDRESS,
  },
  async () => {
    console.log('connected to the server!');

    const ask = async () => {
      const message = await rl.question('Enter a message > ');
      await moveCursor(0, -1);
      await clearLine(0);
      client.write(message);
    };
    ask();
  }
);

client.on('data', (data) => {
  console.log(data.toString('utf-8'));
});

client.on('close', () => {
  console.log('closed');
});
client.on('end', () => {
  console.log('ended');
});

client.on('error', () => {
  console.log('error');
});

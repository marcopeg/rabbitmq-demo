const amqp = require('amqplib/callback_api');

const queue = 'test1';
const msg = Date.now().toString();

describe('feature-poc-delete', () => {
  it('should work', async () => {
    await new Promise((resolve, reject) => {
      amqp.connect(env.AMQPSTRING, (err, conn) => {
        if (err) {
          reject(err);
          return;
        }

        conn.createChannel(async (err, channel) => {
          if (err) {
            reject(err);
            return;
          }

          channel.assertQueue(queue, { durable: false });

          // Pushes multiple tasks with the same subject to simulate
          // high intensity data ingestion and a simple deduple mechanism
          // thanks to FetchQ
          //
          // The goal is to simulate the DDT behaviour of emitting an event
          // that target 1 single ID multiple times.
          //
          // This is the emitter. The "rabbit-ingest.handler.js" uses the
          // "upsert()" API to keep pushing the execution of the task some
          // milliseconds in the future.
          for (let i = 0; i < 10; i++) {
            channel.sendToQueue(queue, Buffer.from(msg));
            await new Promise(r => setTimeout(r, 50));
          }

          resolve();
        });
      });
    });
  });
});

const amqp = require('amqplib/callback_api');

const queue = 'test1';
const msg = '123';

describe('feature-poc-delete', () => {
  it('should work', async () => {
    await new Promise((resolve, reject) => {
      amqp.connect(env.AMQPSTRING, (err, conn) => {
        if (err) {
          reject(err);
          return;
        }

        conn.createChannel((err, channel) => {
          if (err) {
            reject(err);
            return;
          }

          channel.assertQueue(queue, { durable: false });

          // Pushes multiple tasks with the same subject to simulate
          // high intensity data ingestion and a simple deduple mechanism
          // thanks to FetchQ
          channel.sendToQueue(queue, Buffer.from(msg));
          channel.sendToQueue(queue, Buffer.from(msg));
          channel.sendToQueue(queue, Buffer.from(msg));
          channel.sendToQueue(queue, Buffer.from(msg));
          console.log('Sent: %s (4 times)', msg);

          setTimeout(function() {
            conn.close();
            resolve();
          }, 500);
        });
      });
    });
  });
});

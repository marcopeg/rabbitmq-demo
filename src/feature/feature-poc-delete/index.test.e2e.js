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
          channel.sendToQueue(queue, Buffer.from(msg));
          console.log('Sent: %s', msg);

          setTimeout(function() {
            conn.close();
            resolve();
          }, 500);
        });
      });
    });
  });
});

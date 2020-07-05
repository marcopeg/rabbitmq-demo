const envalid = require('envalid');
const amqp = require('amqplib/callback_api');
const queue = 'test1';
const msg = process.argv.slice(2).join(' ') || `Hello ${new Date()}`;

const env = envalid.cleanEnv(process.env, {
  AMQPSTRING: envalid.url(),
});

amqp.connect(env.AMQPSTRING, (err, conn) => {
  if (err) {
    throw err;
  }

  conn.createChannel((err, channel) => {
    if (err) {
      throw err;
    }

    channel.assertQueue(queue, { durable: false });
    channel.sendToQueue(queue, Buffer.from(msg));
    console.log('Sent: %s', msg);

    setTimeout(function() {
      conn.close();
      process.exit(0);
    }, 500);
  });
});

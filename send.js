const amqp = require('amqplib/callback_api');
const queue = 'test1'
const msg = process.argv.slice(2).join(' ') || `Hello ${new Date()}`

amqp.connect(process.env.AMQPSTRING, (err, conn) => {
  if (err) {
    throw err
  }

  conn.createChannel((err, channel) => {
    if (err) {
      throw err
    }

    channel.assertQueue(queue, { durable: false })
    channel.sendToQueue(queue, Buffer.from(msg))
    console.log(" [x] Sent %s", msg);

    setTimeout(function() {
      conn.close();
      process.exit(0);
    }, 500);

  })
});

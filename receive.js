const amqp = require('amqplib/callback_api');
const queue = 'test1'
const msg = `Hello ${new Date()}`

amqp.connect(process.env.AMQPSTRING, (err, conn) => {
  if (err) {
    throw err
  }

  conn.createChannel((err, channel) => {
    if (err) {
      throw err
    }

    channel.assertQueue(queue, { durable: false })

    channel.consume(queue, msg => {
      console.log(" [x] Received %s", msg.content.toString());
    }, {
      noAck: true
    })

  })
});

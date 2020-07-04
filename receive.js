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
    channel.prefetch(1)

    channel.consume(queue, msg => {
      const complexity = msg.content.toString().split('.').length - 1
      console.log(" [x] Received %s", msg.content.toString(), complexity);

      setTimeout(() => {
        console.log('done')
        channel.ack(msg)
      }, complexity * 1000)
    }, {
      noAck: false
    })

  })
});

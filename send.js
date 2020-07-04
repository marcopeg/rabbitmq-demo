const amqp = require('amqplib/callback_api');

amqp.connect(process.env.AMQPSTRING, (err, connection) => {
    console.log('ok')
});
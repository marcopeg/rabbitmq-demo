const amqp = require('amqplib/callback_api');
const { SERVICE_NAME, ...hooks } = require('./hooks');

const onInitService = async ({ getConfig, setContext, createHook }) => {
  const connStr = getConfig('rabbitmq.string', process.env.AMQPSTRING);

  if (!connStr) {
    throw new Error('[service-rabbitmq] missing connection string');
  }

  const conn = await new Promise((resolve, reject) =>
    amqp.connect(connStr, (err, conn) => {
      if (err) {
        reject(err);
        return;
      }

      resolve(conn);
    }),
  );

  setContext('rabbitmq', {
    conn,
  });
};

const makeConsumer = (conn, ctx) => ({ queue, handler, ...consumer }) =>
  new Promise((resolve, reject) => {
    if (!queue) {
      throw new Error('[service-rabbitqm] A queue must have a name');
    }

    if (!handler || typeof handler !== 'function') {
      throw new Error(
        '[service-rabbitqm] A queue must have an handler function',
      );
    }

    conn.createChannel((err, channel) => {
      if (err) {
        reject(err);
        return;
      }

      channel.prefetch(consumer.prefetch || 1);
      channel.assertQueue(queue, {
        durable: consumer.durable || false,
      });

      channel.consume(queue, async msg => {
        try {
          await handler(msg, { channel, conn, ctx });
          channel.ack(msg);
        } catch (err) {
          console.error(`[service-rabbitmq] ${queue.name} -`, err);
        }
      });

      resolve();
    });
  });

const onStartService = async ({ getConfig, getContext }, ctx) => {
  const conn = getContext('rabbitmq.conn');
  return getConfig('rabbitmq.consumers', []).map(makeConsumer(conn, ctx));
};

module.exports = ({ registerAction, registerHook }) => {
  registerHook(hooks);
  registerAction({
    hook: '$INIT_SERVICE',
    name: SERVICE_NAME,
    trace: __filename,
    handler: onInitService,
  });
  registerAction({
    hook: '$START_SERVICE',
    name: SERVICE_NAME,
    trace: __filename,
    handler: onStartService,
  });
};

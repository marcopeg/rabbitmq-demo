const { FEATURE_NAME } = require('./hooks');
const { queues } = require('./constants');
const rabbitIngestHandler = require('./handlers/rabbit-ingest.handler');
const mainIngestHandler = require('./handlers/main-ingest.handler');

const fetchqDefaultQueueSettings = {
  isActive: true,
  enableNotifications: true,
  maxAttempts: 5,
  errorsRetention: '1h',
  maintenance: {
    mnt: { delay: '500ms', duration: '5m', limit: 500 },
    sts: { delay: '1h', duration: '5m' },
    cmp: { delay: '30m', duration: '5m' },
    drp: { delay: '10m', duration: '5m' },
  },
};

const makeQueue = (name, settings = {}) => ({
  ...fetchqDefaultQueueSettings,
  ...settings,
  name,
});

module.exports = ({ registerAction }) => {
  registerAction({
    hook: '$RABBITMQ_REGISTER_WORKER',
    name: FEATURE_NAME,
    handler: () => ({
      queue: 'test1',
      handler: rabbitIngestHandler,
    }),
  });

  // Asserts all the needed queues for the task
  registerAction({
    hook: '$FETCHQ_REGISTER_QUEUE',
    name: FEATURE_NAME,
    handler: () => [
      makeQueue(queues.main),
      makeQueue(queues.d1),
      makeQueue(queues.d2),
      makeQueue(queues.d3),
      makeQueue(queues.check),
    ],
  });

  // Registers all the workers for each specific queue
  registerAction({
    hook: '$FETCHQ_REGISTER_WORKER',
    name: FEATURE_NAME,
    handler: () => [
      {
        queue: queues.main,
        handler: mainIngestHandler,
      },
    ],
  });
};

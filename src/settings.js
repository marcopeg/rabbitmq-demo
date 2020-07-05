const envalid = require('envalid');

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

const settings = ({ setConfig }) => {
  // Validate Environment Variable
  envalid.cleanEnv(process.env, {
    PGSTRING: envalid.url(),
    AMQPSTRING: envalid.url(),
  });

  // RabbitMQ service connects right away with default settings
  // from the environment variables.

  // Setup FetchQ
  setConfig('fetchq', {
    pool: {
      max: 1,
    },
    maintenance: {
      limit: 1,
      delay: 10,
      sleep: 100,
    },
    queues: [makeQueue('test1')],
  });
};

module.exports = { settings };

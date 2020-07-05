const envalid = require('envalid');

const settings = ({ setConfig }) => {
  // Validate Environment Variable
  envalid.cleanEnv(process.env, {
    PGSTRING: envalid.url(),
    AMQPSTRING: envalid.url(),
  });

  // RabbitMQ service connects right away with default settings
  // from the environment variables.

  // Setup FetchQ
  // All the queues definitions are exposed by each feature.
  setConfig('fetchq', {
    pool: {
      max: 1,
    },
    maintenance: {
      limit: 1,
      delay: 10,
      sleep: 500,
    },
  });
};

module.exports = { settings };

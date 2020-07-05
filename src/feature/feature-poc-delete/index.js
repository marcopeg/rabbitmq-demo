const { FEATURE_NAME } = require('./hooks');
const rabbitIngestHandler = require('./handlers/rabbit-ingest.handler');
const deleteIngestHandler = require('./handlers/delete-ingest.handler');

module.exports = ({ registerAction }) => {
  registerAction({
    hook: '$RABBITMQ_REGISTER_WORKER',
    name: FEATURE_NAME,
    handler: () => ({
      queue: 'test1',
      handler: rabbitIngestHandler,
    }),
  });

  registerAction({
    hook: '$FETCHQ_REGISTER_WORKER',
    name: FEATURE_NAME,
    handler: () => ({
      queue: 'test1',
      handler: deleteIngestHandler,
    }),
  });
};

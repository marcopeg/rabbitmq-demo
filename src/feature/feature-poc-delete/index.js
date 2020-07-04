const { FEATURE_NAME } = require('./hooks');
const deleteIngestHandler = require('./delete-ingest.handler');

module.exports = ({ registerAction }) => {
  registerAction({
    hook: '$RABBITMQ_REGISTER_WORKER',
    name: FEATURE_NAME,
    handler: () => ( {
      queue: 'test1',
      handler: async (msg, { ctx }) => {
        console.log('rabbit**:', msg.content.toString());
        return ctx.fetchq.doc.append('test1', msg.content.toString());
      },
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

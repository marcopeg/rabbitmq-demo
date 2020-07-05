const { queues } = require('../constants');

const rabbitIngestHandler = (msg, { ctx }) => {
  const id = msg.content.toString();
  console.log('[rabbit-ingest] %s', id);

  // The "push()" method guarantee that only one task exists in a specific queue.
  // The only way to duplicate a job, is to drop a pre-existing task,
  // or to use the "append()" method.
  //
  // The task is also postponed so to avoid an immediate execution and let
  // the deduping to act on a stream of seamless requests that may take time
  // to be produced.
  //
  // https://github.com/fetchq/node-client/blob/master/lib/functions/doc.push.js
  return ctx.fetchq.doc.push(queues.main, {
    subject: `delete-${id}`,
    payload: { id },
    nextIteration: '+500ms',
  });
};

module.exports = rabbitIngestHandler;

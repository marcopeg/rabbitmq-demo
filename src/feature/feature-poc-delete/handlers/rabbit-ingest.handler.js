const { queues } = require('../constants');

const rabbitIngestHandler = (msg, { ctx }) => {
  const id = msg.content.toString();
  console.log('[rabbit-ingest] %s', id);

  // The "upsert()" method guarantee that only one task exists in a specific queue.
  // The only way to duplicate a job, is to drop a pre-existing task,
  // or to use the "append()" method.
  //
  // The task is also postponed so to avoid an immediate execution and let
  // the deduping to act on a stream of seamless requests that may take time
  // to be produced.
  //
  // Every time that this method is called on a pending task with the same ID,
  // the nextExecution time is updated as well as the payload. It is a way to
  // keep pushing the same task in the future as long an event keeps happening.
  //
  // https://github.com/fetchq/node-client/blob/master/lib/functions/doc.upsert.js
  return ctx.fetchq.doc.upsert(queues.main, {
    subject: `delete-${id}`,
    payload: { id },
    nextIteration: '+50ms',
  });
};

module.exports = rabbitIngestHandler;

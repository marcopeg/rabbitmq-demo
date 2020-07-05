const rabbitIngestHandler = (msg, { ctx }) => {
  const id = msg.content.toString();
  console.log('[rabbit-ingest] %s', id);

  // The "push()" method guarantee that only one task exists in a specific queue.
  // The only way to duplicate a job, is to drop a pre-existing task,
  // or to use the "append()" method.
  return ctx.fetchq.doc.push('test1', {
    subject: `delete-${id}`,
    payload: { id },
  });
};

module.exports = rabbitIngestHandler;

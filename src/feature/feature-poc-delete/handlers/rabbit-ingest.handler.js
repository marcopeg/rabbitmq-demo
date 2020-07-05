const rabbitIngestHandler = (msg, { ctx }) => {
  const docId = msg.content.toString();
  console.log('[rabbit-ingest] %s', docId);
  return ctx.fetchq.doc.append('test1', { docId });
};

module.exports = rabbitIngestHandler;

const { queues } = require('../constants');

const query = `
  SELECT iterations
  FROM fetchq_catalog.fetchq__${queues.d1}__documents
  WHERE subject = $1
    AND status = 3
  LIMIT 1
`;

const d2Handler = async (doc, { client }) => {
  // Checks that a specific task in a specific queue is completed.
  // this is used as precondition to the execution of the current step.
  const ck = await client.pool.query(query, [doc.subject]);
  if (ck.rows.length < 1) {
    console.log('[d2] %s - precondition failed, reschedule...', doc.subject);
    return doc.reschedule('+250ms', {
      payload: {
        ...doc.payload,
        iterations: doc.payload.iterations ? doc.payload.iterations + 1 : 1,
      },
    });
  }

  // simulate the execution of an asynchronous task
  console.log('[d2] %s - execute task', doc.subject);
  await new Promise(r => setTimeout(r, 150));

  return doc.complete();
};

module.exports = d2Handler;

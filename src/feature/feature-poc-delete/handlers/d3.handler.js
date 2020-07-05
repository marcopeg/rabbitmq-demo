/**
 * This handler does exactly what D2 does.
 * -- it's an ugly copy --
 */

const { queues } = require('../constants');

const query = `
  SELECT iterations
  FROM fetchq_catalog.fetchq__${queues.d2}__documents
  WHERE subject = $1
    AND status = 3
  LIMIT 1
`;

const d3Handler = async (doc, { client }) => {
  // Checks that a specific task in a specific queue is completed.
  // this is used as precondition to the execution of the current step.
  const ck = await client.pool.query(query, [doc.subject]);
  if (ck.rows.length < 1) {
    console.log('[d3] %s - precondition failed, reschedule...', doc.subject);
    return doc.reschedule('+250ms', {
      payload: {
        ...doc.payload,
        iterations: doc.payload.iterations ? doc.payload.iterations + 1 : 1,
      },
    });
  }

  // simulate the execution of an asynchronous task
  console.log('[d3] %s - execute task', doc.subject);
  await new Promise(r => setTimeout(r, 100));

  return doc.complete();
};

module.exports = d3Handler;

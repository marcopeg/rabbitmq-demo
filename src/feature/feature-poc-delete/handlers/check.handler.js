const { queues } = require('../constants');

const checkQuery = `
  WITH
  d1 AS (
    SELECT iterations FROM fetchq_catalog.fetchq__${queues.d1}__documents
    WHERE subject = $1 AND status = 3 LIMIT 1
  ),
  d2 AS (
    SELECT iterations FROM fetchq_catalog.fetchq__${queues.d2}__documents
    WHERE subject = $1 AND status = 3 LIMIT 1
  ),
  d3 AS (
    SELECT iterations FROM fetchq_catalog.fetchq__${queues.d3}__documents
    WHERE subject = $1 AND status = 3 LIMIT 1
  ),
  ck AS (
    SELECT * FROM d1 UNION ALL SELECT * FROM d2 UNION ALL SELECT * FROM d3
  )
  SELECT count(*)::integer AS tot FROM ck
`;

const cleanupQuery = `
  WITH
  mn_docs AS (DELETE FROM fetchq_catalog.fetchq__${queues.main}__documents WHERE subject = $1),
  mn_errs AS (DELETE FROM fetchq_catalog.fetchq__${queues.main}__errors WHERE subject = $1),
  mn_metr AS (SELECT * FROM fetchq_metric_reset('${queues.main}')),
  d1_docs AS (DELETE FROM fetchq_catalog.fetchq__${queues.d1}__documents WHERE subject = $1),
  d1_errs AS (DELETE FROM fetchq_catalog.fetchq__${queues.d1}__errors WHERE subject = $1),
  d1_metr AS (SELECT * FROM fetchq_metric_reset('${queues.d1}')),
  d2_docs AS (DELETE FROM fetchq_catalog.fetchq__${queues.d2}__documents WHERE subject = $1),
  d2_errs AS (DELETE FROM fetchq_catalog.fetchq__${queues.d2}__errors WHERE subject = $1),
  d2_metr AS (SELECT * FROM fetchq_metric_reset('${queues.d2}')),
  d3_docs AS (DELETE FROM fetchq_catalog.fetchq__${queues.d3}__documents WHERE subject = $1),
  d3_errs AS (DELETE FROM fetchq_catalog.fetchq__${queues.d3}__errors WHERE subject = $1),
  d3_metr AS (SELECT * FROM fetchq_metric_reset('${queues.d3}')),
  ck_docs AS (DELETE FROM fetchq_catalog.fetchq__${queues.check}__documents WHERE subject = $1),
  ck_errs AS (DELETE FROM fetchq_catalog.fetchq__${queues.check}__errors WHERE subject = $1),
  ck_metr AS (SELECT * FROM fetchq_metric_reset('${queues.ck}'))
  SELECT NOW() AS now
`;

const checkHandler = async (doc, { client }) => {
  // Check that a list of tasks in different queues have been completed.
  const ck = await client.pool.query(checkQuery, [doc.subject]);
  if (!ck.rows.length || ck.rows[0].tot !== 3) {
    console.log('[ck] %s - precondition failed, reschedule...', doc.subject);
    return doc.reschedule('+100ms', {
      payload: {
        ...doc.payload,
        iterations: doc.payload.iterations ? doc.payload.iterations + 1 : 1,
      },
    });
  }

  console.log('[ck] %s - COMPLETED', doc.subject);

  // TRACE: experimental function to follow the execution of a specific
  //        document across multiple queues
  // const r = await client.pool.query('SELECT * FROM fetchq_trace($1)', [
  //   doc.subject,
  // ]);
  // console.log(r.rows);

  // DEV: cleans up all the FetchQ info for a specific document so to be
  //      able to repeat the tests with the same document id
  // await client.pool.query(cleanupQuery, [doc.subject]);
  return doc.complete();
};

module.exports = checkHandler;

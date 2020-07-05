/**
 * The goal of the "main ingest" is to distribute a complex task
 * into a list of smaller units.
 *
 * Each unit will be executed by a custom handler, just a function.
 * The big deal is that some units are dependent on others, and here
 * comes in handy the fact that FetchQ is just a set of SQL tables
 * that we can easy query at runtime.
 *
 * @param {} doc
 */

const { queues } = require('../constants');

const mainIngestHandler = async (doc, { client }) => {
  console.log('%s start', doc.subject, doc.payload);

  const f = await Promise.all([
    client.doc.push(queues.d1, {
      subject: doc.subject,
      payload: doc.payload,
    }),
    client.doc.push(queues.d2, {
      subject: doc.subject,
      payload: doc.payload,
      nextIteration: '+100ms', // postpone as depends on d1
    }),
    client.doc.push(queues.d3, {
      subject: doc.subject,
      payload: doc.payload,
      nextIteration: '+200ms', // postpone as depends on d1 and d2
    }),
    client.doc.push(queues.check, {
      subject: doc.subject,
      payload: doc.payload,
      nextIteration: '+500ms', // postpone as should check d1, d2, d3
    }),
  ]);

  // await new Promise(r => setTimeout(r, 1000));
  // console.log('%s finished', doc.subject);
  return doc.complete();
};

module.exports = mainIngestHandler;

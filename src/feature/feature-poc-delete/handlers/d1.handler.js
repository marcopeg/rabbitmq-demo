const d1Handler = async doc => {
  console.log('[d1] %s - execute task', doc.subject);

  // simulate an unhandled exception that will be logged
  if (doc.iterations < 1) {
    console.log('[d1] %s - task failed', doc.subject);
    throw new Error('bad execution');
  }

  // simulate the execution of an asynchronous task
  await new Promise(r => setTimeout(r, 150));

  // once the task is performed, we can mark as "completed" to
  // make the execution idempotent.
  // this particular subject will never be executed again, unless
  // the task is removed from the queue.
  return doc.complete();
};

module.exports = d1Handler;

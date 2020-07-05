const d1Handler = async doc => {
  console.log('[d1] %s - execute task', doc.subject);

  // simulate the execution of an asynchronous task
  await new Promise(r => setTimeout(r, 50));

  // once the task is performed, we can mark as "completed" to
  // make the execution idempotent.
  // this particular subject will never be executed again, unless
  // the task is removed from the queue.
  return doc.complete();
};

module.exports = d1Handler;

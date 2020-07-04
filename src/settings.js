const fetchqDefaultQueueSettings = {
  isActive: true,
  enableNotifications: true,
  maxAttempts: 5,
  errorsRetention: '1h',
  maintenance: {
    mnt: { delay: '500ms', duration: '5m', limit: 500 },
    sts: { delay: '1h', duration: '5m' },
    cmp: { delay: '30m', duration: '5m' },
    drp: { delay: '10m', duration: '5m' },
  },
};

const makeQueue = (name, settings = {}) => ({
  ...fetchqDefaultQueueSettings,
  ...settings,
  name,
});

const settings = ({ setConfig }) => {
  // Setup RabbitMQ
  // Pick messages from Rabbit and append it to Fetchq
  // setConfig('rabbitmq.consumers', [
  //   {
  //     queue: 'test1',
  //     handler: async (msg, { ctx }) => {
  //       console.log('rabbit:', msg.content.toString());
  //       return ctx.fetchq.doc.append('test1', msg.content.toString());
  //     },
  //   },
  // ]);

  // Setup FetchQ
  setConfig('fetchq', {
    pool: {
      max: 1,
    },
    maintenance: {
      limit: 1,
      delay: 10,
      sleep: 100,
    },
    queues: [makeQueue('test1')],
  });
};

module.exports = { settings };

const { SERVICE } = require('@forrestjs/hooks');

const SERVICE_NAME = `${SERVICE} rabbitmq`;
// const FETCHQ_REGISTER_QUEUE = `${SERVICE} fetchq/register/queue`;
const RABBITMQ_REGISTER_WORKER = `${SERVICE} rabbitmq/register/worker`;
// const FETCHQ_READY = `${SERVICE} fetchq/ready`;
// const FETCHQ_BEFORE_START = `${SERVICE} fetchq/before-start`;

module.exports = {
  SERVICE_NAME,
  // FETCHQ_REGISTER_QUEUE,
  RABBITMQ_REGISTER_WORKER,
  // FETCHQ_READY,
  // FETCHQ_BEFORE_START,
};

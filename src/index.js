const { runHookApp } = require('@forrestjs/hooks');
const { settings } = require('./settings');

const serviceFetchq = require('./service/service-fetchq');
const serviceRabbitmq = require('./service/service-rabbitmq');

const featurePocDelete = require('./feature/feature-poc-delete');

runHookApp({
  settings,
  trace: 'compact',
  services: [serviceFetchq, serviceRabbitmq],
  features: [featurePocDelete],
}).catch(err => console.error(err.message));

// Let Docker exit on Ctrl+C
process.on('SIGINT', () => process.exit());

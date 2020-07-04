const { runHookApp } = require('@forrestjs/hooks');
const { settings } = require('./settings');
const serviceFetchq = require('./service/service-fetchq');
const serviceRabbitmq = require('./service/service-rabbitmq');

runHookApp({
  settings,
  trace: 'compact',
  services: [
    serviceFetchq,
    serviceRabbitmq,
    // ...(useApi ? [serviceFastify] : []),
    // ...(useCors ? [serviceFastifyCors] : []),
    // ...(useConsole ? [serviceFastifyStatic] : []),
    // ...(useApi ? [serviceFastifyCookie] : []),
    // ...(useApi ? [serviceFastifyJwt] : []),
    // ...(useApi ? [serviceFastifyFetchq] : []),
    // serviceTdd,
  ],
  features: [
    // ...(useApi ? [featurePing] : []),
    // ...(useApi ? [featureSchemaV1] : []),
    // ...(useApi ? [featureApiV1] : []),
    // ...(useApi ? [featureAuthV1] : []),
    // ...(useWorkers ? [featureWorkersV1] : []),
  ],
}).catch(err => console.error(err.message));

// Let Docker exit on Ctrl+C
process.on('SIGINT', () => process.exit());

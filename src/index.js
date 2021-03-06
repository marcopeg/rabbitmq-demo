const { runHookApp } = require('@forrestjs/hooks');
const { settings } = require('./settings');

/**
 * Services
 */

const serviceFetchq = require('@forrestjs/service-fetchq');
const serviceFastify = require('@forrestjs/service-fastify');
const serviceRabbitmq = require('./service/service-rabbitmq');
const serviceTdd = require('./service/service-tdd');

/**
 * Features
 */

const featurePocDelete = require('./feature/feature-poc-delete');

/**
 * Feature Flags
 */

const useDev =
  ['development', 'test'].includes(process.env.NODE_ENV) ||
  Boolean(process.env.SANDBOX_URL);

runHookApp({
  settings,
  trace: 'compact',
  services: [
    serviceFetchq,
    serviceRabbitmq,
    ...(useDev ? [serviceFastify, serviceTdd] : []),
  ],
  features: [featurePocDelete],
}).catch(err => console.error(err.message));

// Let Docker exit on Ctrl+C
process.on('SIGINT', () => process.exit());

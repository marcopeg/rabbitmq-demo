# rabbitmq-demo

This demo combines RabbitMQ and FetchQ to demonstrate how it is possible
to **handle multiple repeated signals**, dedupe them, and run a complex
list of tasks that may have **multiple interdependencies** as relatively
simple and isolated functions by exploiting planned execution timing and
precondition queries.

You can find the source code in: `/src`.<br>
The real handlers are stored in: `/src/feature/feature-poc-delete/handlers`.

NOTE: The demo uses
[ForrestJS' hook](https://github.com/forrestjs/forrestjs/blob/master/packages/hooks/README.md#readme)
to coordinate services and implement **feature composition**.

## The Problem

We have a service that may emit multiple events (implemented as a
RabbitMQ queue) to perform a complex task.

Suck task is structures as:

- sub-task 1
  - sub-task 2
  - sub-task 3

Where 2 and 3 can be executed concurrently, but only if 1 had completed.
The task is "done" when all sub-tasks have been completed.

**REQUIREMENT:** the execution of the "big task" should be idempotent.
It doesn't matter how many times we receive the signal to perform the task,
it should be performed only once. On top of it, each sub-task can take
time to execute, and could fail several times before hit success.

**NOTE:** For demo pourpose, at the end of the task all the existing
informations are dropped, so the same task can be repeated.

## Enviroment Setup

In order to run this workspace you need:

- a Postgres connection string as `PGSTRING` env variable
- a RabbitMQ connection string as `AMQPSTRING` env variable

You can set up both these resources for free using free-tier services at:

- elephantsql.com
- cloudamqp.com

(you can also try `cloudkarafka.com`)

## Run it in GitPod

[![Open in GitPod](https://gitpod.io/button/open-in-gitpod.svg)](https://gitpod.io#https://github.com/marcopeg/rabbitmq-demo)

**NOTE:** Make sure you [configure your GitPod settings](https://www.gitpod.io/docs/environment-variables/)
with the proper environment variabels before you hit the button above.

## Relevant Files

### src/feature/feature-poc-delete/index.test.e2e.js

This is an automated test that gets executed usin [jest](https://jestjs.io/) which is
one of the most widely used test environment for node/react.

It simulates the asynchronous emission of a repeated message into a RabbitMQ channel.
The idea is to simulate the DDT lines get updated one by one, queuing a task (or broadcasting
a message) that refers to the same order.

**Take into account that the goal is not to touch the current DDT application.**

### src/feature/feature-poc-delete/handlers/rabbit-ingest.handler.js

This is the entry point of this service, it subscribes to the RabbitMQ channel or topic
and forwards the task/message into FetchQ that is capable of natively handling:

- message/event deduplication
- message/event throttling

The idea is to set a task some time in the future, and keep pushing it further more into
the future as long the DDT keeps emitting messages with the same DDT-ID.

### src/feature/feature-poc-delete/handlers/check.handler.js

This is the last message handler that checks whether a list of known tasks have been
completed, in order to do something.

The goal here is to simulate a **complex execution of asynchronous, distributed but
interdependent pieces of computations**. You can see those "pieces" in the
`d1, d2, d3` handlers. Simple functions that we use as placeholders for more intersting stuff.

The goal is to await an eventually consistent execution of independently executed tasks
that may fail for any possible reason and need to handle this possibility without
increasing the complexity of the system.

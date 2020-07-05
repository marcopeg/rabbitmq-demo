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

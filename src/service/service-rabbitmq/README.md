# ForrestJS RabbitMQ Service

Minimalist RabbitMQ wrapper that sets up a RabbitMQ client and injects it into
the app's context.

## Quickly setup consumers:

```
setConfig('rabbitmq.consumers', [
    {
        queue: 'test1',
        // durable: false,
        // prefetch: 1,
        handler: msg => {
        console.log(msg.content.toString());
        },
    },
]);
```

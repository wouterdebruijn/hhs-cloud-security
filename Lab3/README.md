# Lab3

# Lab 3A
Ik heb een Azure function gemaakt die via een MQTT client het eerder gemaakte alarm aanroept.

```js
const mqtt = require("mqtt");

const lamps = [
  {
    mqtt: "mqtt://broker.hivemq.com",
    topic: "wouter-test-topic/alarm-lamp",
    id: 1,
  },
];

module.exports = async function (context, req) {
  context.log("JavaScript HTTP trigger function processed a request.");

  const id = +req.params.id ?? 1;

  const lamp = lamps.find((lamp) => lamp.id == id);

  if (!lamp) {
    context.res = {
      status: 404,
      body: `Alarm lamp ${id} not found`,
    };
    return;
  }

  const client = mqtt.connect(lamp.mqtt);

  client.on("connect", () => {
    client.publish(
      lamp.topic,
      JSON.stringify(req.body),
    );
    client.end();
  });

  context.res = {
    // status: 200, /* Defaults to 200 */
    body: `Alarm lamp ${lamp.id} is ${req.body?.state}`,
  };
};
```

# Lab3B
Omdat de client dan aangepast moet worden wanneer er iets met de lamp veranderd. Je wilt de client API pretty houden.

# Lab3C
Dit kan, in de Azure function zou ik de Azure SDK toevoegen om de devices aan te sturen. Dit kan allemaal geregeld worden in de Azure function, hierdoor heeft de client geen aanpassingen nodig.
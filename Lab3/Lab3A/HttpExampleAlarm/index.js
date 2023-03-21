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

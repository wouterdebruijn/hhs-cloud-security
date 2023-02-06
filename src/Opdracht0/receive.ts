import { Client, connect } from "mqtt";
const randomTopic = "wouter-test-topic";

import { createMqttInstance } from "./send";

function receiveMqttMessage(
  client: Client,
  topic?: string,
): void {
  client.subscribe(topic ?? randomTopic);
  client.on("message", (topic, message) => {
    console.log("Received Message: " + message.toString());
  });
}

console.log("Receiving Message: Hello World");

const mqtt = createMqttInstance("mqtt://broker.mqttdashboard.com/");

receiveMqttMessage(mqtt);

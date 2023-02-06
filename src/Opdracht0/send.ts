import { Client, connect } from "mqtt";
const randomTopic = "wouter-test-topic";

/**
 * Create a new mqtt client connection
 * @param url Custom url to connect to. Defaults to 'mqtt://localhost:1883'
 * @returns Connected MQTT client
 */
export function createMqttInstance(url?: string): Client {
  return connect(url ?? "mqtt://localhost:1883");
}

function sendMqttMessage(
  client: Client,
  message: string,
  topic?: string,
): void {
  client.publish(topic ?? randomTopic, message);
}

console.log("Sending Message: Hello World");

const mqtt = createMqttInstance("mqtt://broker.mqttdashboard.com/");

sendMqttMessage(mqtt, "Hello World");

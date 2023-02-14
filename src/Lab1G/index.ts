import { connect } from "mqtt";
import { createInterface } from "readline";
import { createLamp } from "./lamp";
import { createSensor } from "./sensor";

export const rl = createInterface({
    input: process.stdin,
    output: process.stdout
});

// Create a new topic to publish to
const topic = "wouter-test-topic/motion_sensor";
const lampConfigTopic = `wouter-test-topic/lamp_config`;

// Create one motion sensor (they listen to the same terminal input)
createSensor(topic);

// Create the three lamps
createLamp(topic, lampConfigTopic);
createLamp(topic, lampConfigTopic);
createLamp(topic, lampConfigTopic);

const mqtt = connect("mqtt://broker.hivemq.com");

rl.on("line", (input) => {
    if (input !== "m") {
        console.log(`Setting timeout to: ${input}!`)
        mqtt.publish(lampConfigTopic, JSON.stringify({ timeoutTime: input}))
    }
});

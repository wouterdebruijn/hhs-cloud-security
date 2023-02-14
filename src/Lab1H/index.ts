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

// Create one motion sensor (they listen to the same terminal input)
createSensor(topic);

// Create the three lamps
createLamp(topic);
createLamp(topic);
createLamp(topic);

const mqtt = connect("mqtt://broker.hivemq.com");

rl.on("line", (input) => {
    if (input !== "m") {
        console.log(`Setting timeout to: ${input}!`)
        mqtt.publish(topic, JSON.stringify({ timeoutTime: input}))
    }
});

import { connect } from "mqtt";
import { createInterface } from "readline";
import { AlarmLightConfig, createAlarmLight } from "./alarmLight";

export const rl = createInterface({
    input: process.stdin,
    output: process.stdout
});

// Create a new topic to publish to
const topic = "wouter-test-topic/alarm-lamp";

createAlarmLight(topic);

const mqtt = connect("mqtt://broker.hivemq.com");

rl.on("line", (input) => {
    if (input === "on") {
        const config: Partial<AlarmLightConfig> = {
            state: true,
        }
        mqtt.publish(topic, JSON.stringify(config));
    }
    else if (input === "off") {
        const config: Partial<AlarmLightConfig> = {
            state: false,
        }
        mqtt.publish(topic, JSON.stringify(config));
    }
});

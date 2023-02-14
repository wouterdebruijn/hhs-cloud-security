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
    } else if (input == "blue") {
        const config: Partial<AlarmLightConfig> = {
            color: {
                red: 0,
                green: 0,
                blue: 255,
            }
        }
        mqtt.publish(topic, JSON.stringify(config));
    } else if (input == "red") {
        const config: Partial<AlarmLightConfig> = {
            color: {
                red: 255,
                green: 0,
                blue: 0,
            }
        }
        mqtt.publish(topic, JSON.stringify(config));
    } else {
        const config: Partial<AlarmLightConfig> = {
            interval: parseInt(input),
        }
        mqtt.publish(topic, JSON.stringify(config));
    }
});

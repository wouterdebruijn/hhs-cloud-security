/**
 * A example of a simulated IoT lamp and motion sensor communicating over MQTT.
 * 
 * Lamp automatically turns off after 5 seconds, functionality is build into the motion sensor.
 * 
 * Wouter de Bruijn, The Hague University of Applied Sciences, 02/06/2023
 */

import { connect } from "mqtt";

export interface AlarmLightConfig {
    color: {
        red: number;
        green: number;
        blue: number;
    },
    interval: number;
    state: boolean;
}

export function createAlarmLight(topic: string) {
    // Create new client connection to the hiveMQ broker
    const mqtt = connect("mqtt://broker.hivemq.com");

    // LAMP
    mqtt.subscribe(topic);

    let config: AlarmLightConfig = {
        color: {
            red: 255,
            green: 0,
            blue: 0,
        },
        interval: 1000,
        state: false,
    };

    let ledState = false;

    let interval = setInterval(() => { });

    // Listen for messages on the topic
    mqtt.on("message", (topic, message) => {
        // Check if the message is a config message
        const obj = JSON.parse(message.toString());

        config = { ...config, ...obj }

        if (obj.state === false) {
            clearInterval(interval);
            config.state = false;
            ledState = false;
        } else if (obj.state === true) {
            config.state = true;
            clearInterval(interval);
            interval = setInterval(() => {
                if (ledState === false) {
                    ledState = true;
                    console.log(`Turning LED to ${config.color.red}, ${config.color.green}, ${config.color.blue}`)
                }
                else {
                    ledState = false;
                    console.log(`Turning LED off`)
                }
            }, config.interval);
        }
    });
}
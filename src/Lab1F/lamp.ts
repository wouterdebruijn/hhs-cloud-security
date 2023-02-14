/**
 * A example of a simulated IoT lamp and motion sensor communicating over MQTT.
 * 
 * Lamp automatically turns off after 5 seconds, functionality is build into the motion sensor.
 * 
 * Wouter de Bruijn, The Hague University of Applied Sciences, 02/06/2023
 */

import { connect } from "mqtt";

export function createLamp(sensorTopic: string) {
    // Create new client connection to the hiveMQ broker
    const mqtt = connect("mqtt://broker.hivemq.com");

    // LAMP
    mqtt.subscribe(sensorTopic);

    let timeout = setTimeout(() => {});
    let state = 0;

    // Listen for messages on the topic
    mqtt.on("message", (_topic, message) => {
        // If the message is 255, turn the lamp on
        const newState = +message.toString();

        if (isNaN(newState)) {
            console.log("Invalid message received!");
            return;
        }

        // Reset the timeout on lamp on messages
        if (newState > 0) {
            clearTimeout(timeout);
            // Override the timeout if it exists
            timeout = setTimeout(() => {
                state = 0;
                console.log("Lamp turned off!");
            }, 5000);
        }

        // Only update the hardware if the state is different
        if (newState === state) return;

        state = newState;
        if (state !== 0) {
            console.log(`Lamp turned to a brightness of: ${newState}!`);
        }
    });
}
/**
 * Create a simulated IoT lamp controlled by MQTT messages.
 * 
 * Wouter de Bruijn, The Hague University of Applied Sciences, 02/06/2023
 */

import { connect } from "mqtt";

// Create new client connection to the hiveMQ broker
const mqtt = connect("mqtt://broker.hivemq.com");

// Create a new topic to publish to
const topicName = "wouter-test-topic";

// Subscribe to the topic
mqtt.subscribe(`${topicName}/motion_sensor`);

// Listen for messages on the topic
mqtt.on("message", (topic, message) => {
    if (topic === `${topicName}/motion_sensor`) {
        // If the message is 255, turn the lamp on
        const newState = +message.toString();

        if (isNaN(newState)) {
            console.log("Invalid message received!");
            return;
        }

        if (newState == 0) {
            console.log("Lamp turned off!");
        } else {
            console.log(`Lamp turned to a brightness of: ${newState}!`);
        }
    }
});
/**
 * A example of a simulated IoT lamp and motion sensor communicating over MQTT.
 * 
 * Lamp automatically turns off after 5 seconds, functionality is build into the motion sensor.
 * 
 * Wouter de Bruijn, The Hague University of Applied Sciences, 02/06/2023
 */

import { connect } from "mqtt";

// Create new client connection to the hiveMQ broker
const mqtt = connect("mqtt://broker.hivemq.com");

// Create a new topic to publish to
const topicName = "wouter-test-topic";
const motionSensorTopic = `${topicName}/motion_sensor`;
const lampTopic = `${topicName}/lamp`;

// LAMP
mqtt.subscribe(motionSensorTopic);

// Listen for messages on the topic
mqtt.on("message", (topic, message) => {
    if (topic === motionSensorTopic) {
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
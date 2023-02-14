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

// MOTION SENSOR
// "Read" keyboard input
process.stdin.setEncoding("utf8");
process.stdin.on("data", () => {
    // On keyboard input (pressing enter),
    console.log("Motion detected!");

    // Publish 255 to the topic
    mqtt.publish(motionSensorTopic, "255");

    setTimeout(() => {
        console.log("Motion sensor timed out!");
        mqtt.publish(motionSensorTopic, "0");
    }, 5000);
});
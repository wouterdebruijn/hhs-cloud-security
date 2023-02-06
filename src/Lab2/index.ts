/**
 * Create a simulated motion sensor sends 255 MQTT messages to the broker when "motion" is detected
 * Motion is simulated by keyboard input
 * 
 * Wouter de Bruijn, The Hague University of Applied Sciences, 02/06/2023
 */

import { connect } from "mqtt";

// Create new client connection to the hiveMQ broker
const mqtt = connect("mqtt://broker.hivemq.com");

// Create a new topic to publish to
const topic = "wouter-test-topic";

// "Read" keyboard input
process.stdin.setEncoding("utf8");
process.stdin.on("data", () => {
    // On keyboard input (pressing enter),
    console.log("Motion detected!");

    // Publish 255 to the topic
    mqtt.publish(`${topic}/motion_sensor`, "255");
});
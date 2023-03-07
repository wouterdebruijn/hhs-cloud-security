import { createLamp } from "./lamp";
import { createSensor } from "./sensor";

// Create a new topic to publish to
const topic = "wouter-test-topic/motion_sensor";

// Create one motion sensor (they listen to the same terminal input)
createSensor(topic);

// Create the three lamps
createLamp(topic);
createLamp(topic);
createLamp(topic);


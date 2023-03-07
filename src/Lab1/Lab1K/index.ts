import { connect } from "mqtt";
import { AlarmLamp } from "./Alarm";
import { IoTController } from "./IoT";
import { MotionSensor } from "./MotionSensor";

const controller = new IoTController(connect("mqtt://broker.hivemq.com"));

const alarm = new AlarmLamp("wouteriot/alarm/1");

controller.addDevice(alarm);

alarm.turnOn();
alarm.turnOff();

const motionSensors = [
    new MotionSensor("wouteriot/sensor/1"),
    new MotionSensor("wouteriot/sensor/2"),
    new MotionSensor("wouteriot/sensor/3"),
    new MotionSensor("wouteriot/sensor/4"),
];

motionSensors.forEach((sensor) => {
    controller.addDevice(sensor);

    sensor.addListener((state) => {
        console.log("Sensor state changed", state);
        if (state === true) {
            // Check if any other sensor is active
            const activeSensors = motionSensors.filter((sensor) => sensor.getState() === true);

            if (activeSensors.length === 2) {
                alarm.turnOn();
                console.log("Alarm turned on");
            }
        }
    });
});
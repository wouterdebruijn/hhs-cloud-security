import { Device } from "./Device";
import {  MqttClient } from "mqtt";

export class IoTController {
    private devices: Device[] = [];
    private mqttClient: MqttClient;

    constructor(mqttClient: MqttClient) {
        this.mqttClient = mqttClient;
        this.mqttClient.on("message", this.onMessage.bind(this));
    }

    private onMessage(topic: string, message: string) {
        this.devices.filter((device) => device.getTopic() === topic).forEach((device) => device.onMessage(message));
    }

    public addDevice(device: Device) {
        device.register(this);
        this.mqttClient.subscribe(device.getTopic());
        this.devices.push(device);
    }

    public getDevices() {
        return this.devices;
    }

    public getDevice(topic: string) {
        return this.devices.find((device) => device.getTopic() === topic);
    }

    public sendMessage(topic: string, message: string) {
        this.mqttClient.publish(topic, message);
    }
}
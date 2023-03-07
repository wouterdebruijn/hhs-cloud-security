import { IoTController } from "./IoT";

export class Device {
    private topic;
    private controller: IoTController | null = null;

    constructor(topic: string) {
        this.topic = topic;
    }

    public getTopic() {
        return this.topic;
    }

    public onMessage(message: string) {};

    public register(controller: IoTController) {
        this.controller = controller;
    }

    protected sendMessage(message: string) {
        if (!this.controller) return;
        this.controller.sendMessage(this.topic, message);
    }
}
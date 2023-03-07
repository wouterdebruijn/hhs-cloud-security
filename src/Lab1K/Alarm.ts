import { Device } from "./Device";

export class AlarmLamp extends Device {
    private state: boolean = false;

    constructor(topic: string) {
        super(topic);
    }

    public turnOn() {
        this.state = true;
        this.sendMessage(JSON.stringify({ state: this.state }));
    }

    public turnOff() {
        this.state = false;
        this.sendMessage(JSON.stringify({ state: this.state }));
    }
}
import { Device } from "./Device"

export class MotionSensor extends Device {
    private state: boolean = false;
    private listeners: ((state: boolean) => void)[] = [];
    private timeout: NodeJS.Timeout | null = null;

    constructor(topic: string) {
        super(topic);
    }

    public onMessage(message: string) {
        const parsedMessage = JSON.parse(message);

        // We invision a motion sensor that sends a message on detected motion, that doesn't reset itself.
        if (parsedMessage.state !== undefined) {
            this.state = parsedMessage.state;
            
            if (this.state === true) {
                if (this.timeout) {
                    clearTimeout(this.timeout);
                }

                this.timeout = setTimeout(() => {
                    this.sendMessage(JSON.stringify({ state: false }));
                }, 5000);
            }

            this.listeners.forEach((listener) => listener(this.state));
        }
    }

    public getState() {
        return this.state;
    }

    public addListener(listener: (state: boolean) => void) {
        this.listeners.push(listener);
    }
}
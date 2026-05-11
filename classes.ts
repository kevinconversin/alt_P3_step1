
import { timeToMinutes } from "./functions.js";
import type types = require("./types");

class Resource {

    public nextAvailableTime: number;

    constructor(startTime: string) {
        this.nextAvailableTime = timeToMinutes(startTime);
    }

    public occupyUntil(endTime: number): void {
        this.nextAvailableTime = endTime;
    }
}

export class TechnicianResource extends Resource {
    constructor(public data: types.Technician) {
        super(data.startTime);
    }
}

export class EquipmentResource extends Resource {
    constructor(public data: types.Equipment) {
        super("00:00");
    }
}
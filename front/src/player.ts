import { Item } from "./item";
import { Place } from "./place";

export class Player {
    public place: Place;
    
    public items: Item[] = [];

    constructor(place: Place) {
        this.place = place;
    }
}
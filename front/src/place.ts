export interface Place {
    id: string;
    color: string;
    title: string;
    writeup: string;
    options: Option[];
}

export interface Option {
    title: string;
    go_to: string | null;
    functions: OptFunction[];
    conditions: Condition[];
}

export interface OptFunction {
    type: string;
}

export interface Condition {
    type: string;
}

export interface FnPickUpItem extends OptFunction {
    type: "pick_up";
    item: {
        id: string;
    };
}

export interface CndItem extends Condition {
    type: "item";
    item: {
        id: string;
    };
}
import { load_place } from "./load_place";
import { CndItem, FnPickUpItem } from "./place";
import { Player } from "./player";

const place_cont = document.getElementById("place_cont") as HTMLDivElement;
const change_place_cont = document.getElementById("change_place_cont") as HTMLDivElement;

const change_place_btn = document.getElementById("change_place_btn") as HTMLButtonElement;

const player: Player = new Player({
    id: "office",
    color: "hsl(0, 0%, 96%)",
    title: "Office",
    writeup: "You're in an office, with boarded up windows on three walls. The stairway behind you leads out to the alley, and a locked door leads to a gallery.",
    options: [
        {
            title: "Alley",
            go_to: "alley",
            functions: [],
            conditions: []
        },
        {
            title: "Gallery",
            go_to: "gallery",
            functions: [],
            conditions: [
                {
                    type: "item",
                    item: {
                        id: "gallery_key"
                    }
                } as CndItem
            ]
        },
        {
            title: "Pick up shotgun",
            go_to: null,
            functions: [
                {
                    type: "pick_up",
                    item: {
                        id: "shotgun"
                    }
                } as FnPickUpItem
            ],
            conditions: [
                {
                    type: "item",
                    item: {
                        id: "coins"
                    }
                } as CndItem
            ]
        }
    ]
});

change_place_btn.addEventListener("click", function() {
    place_cont.style.display = "none";
    change_place_cont.style.display = "block";

    load_change_place(player.place);
});

load_place(player.place);

let id_ctr = 0;



document.getElementById("change_place_color").addEventListener("click", function() {
    
});
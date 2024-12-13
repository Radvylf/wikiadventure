import { Condition, Place } from "./place";

const place_color = document.getElementById("place_color") as HTMLSpanElement;
const place_title = document.getElementById("place_title") as HTMLSpanElement;
const place_id = document.getElementById("place_id") as HTMLSpanElement;
const place_writeup = document.getElementById("place_writeup") as HTMLParagraphElement;
const place_options = document.getElementById("place_options") as HTMLDivElement;

export function load_place(place: Place) {
    place_color.style.color = place.color;
    place_title.textContent = place.title;
    place_id.textContent = place.id;
    place_writeup.textContent = place.writeup;
    
    while (place_options.firstChild) place_options.removeChild(place_options.firstChild);
    
    for (const option of place.options) {
        if (option.conditions.every(run_condition)) {
            const option_btn = document.createElement("button");
            const color_span = document.createElement("span");

            color_span.className = "right_arrow";
            color_span.textContent = "\u25b6";
            color_span.style.color = "#808080"; // option.color

            option_btn.appendChild(color_span);
            option_btn.appendChild(document.createTextNode(" " + option.title));

            option_btn.addEventListener("click", function() {
                // go to option.go_to
                // run option.functions
            }, false);

            place_options.appendChild(option_btn);
        }
    }
    
    if (old_place_change_btn_listener != null) change_place_btn.removeEventListener("click", old_place_change_btn_listener);
    
    change_place_btn.addEventListener("click", old_place_change_btn_listener = function() {
        document.getElementById("place_cont").style.display = "none";
        document.getElementById("change_place_cont").style.display = "block";

        load_change_place(place);
    }, false);
}

function run_condition(condition: Condition) {
    return true;
}
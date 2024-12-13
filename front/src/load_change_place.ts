import { Option, Place } from "./place";

const change_place_id = document.getElementById("change_place_id") as HTMLInputElement;
const change_place_color = document.getElementById("change_place_color") as HTMLButtonElement;
const change_place_title = document.getElementById("change_place_title") as HTMLInputElement;
const change_place_writeup = document.getElementById("change_place_writeup") as HTMLTextAreaElement;
const change_place_options = document.getElementById("change_place_options") as HTMLDivElement;

export function load_change_place(place: Place) {
    // TODO: check for conflicts
    
    change_place_id.textContent = place.id;
    change_place_color.style.backgroundColor = place.color;
    // TODO: change_place_color.style.borderColor = 
    change_place_title.textContent = place.title;
    change_place_writeup.value = place.writeup;
    
    while (change_place_options.firstChild) change_place_options.removeChild(change_place_options.firstChild);
    
    let dragging_option: HTMLDivElement | null = null;
    let dragover_listener: Function;
    
    document.addEventListener("dragover", dragover_listener = function(event: DragEvent) {
        if (dragging_option === null) return;
        
        event.preventDefault();
        
        let offset = event.offsetY + (event.target as HTMLElement).offsetTop - change_place_options.offsetTop;
        
        let passed_dragging_option = false;
        
        for (const option of ([...change_place_options.children] as HTMLElement[]).reverse()) {
            if (offset > option.offsetTop - change_place_options.offsetTop - 6) {
                if (option == dragging_option) break;
                
                if (passed_dragging_option) {
                    change_place_options.insertBefore(dragging_option, option);
                } else {
                    option.after(dragging_option);
                }
                
                break;
            }
            
            if (option == dragging_option) passed_dragging_option = true;
        }
    }, false);
    
    change_place_options.addEventListener("drop", function(event: DragEvent) {
        if (!dragging_option) {
            let json = event.dataTransfer!.getData("text/plain");
            
            event.dataTransfer!.items[0].getAsString(console.log);
            
            let data = null;
            
            try {
                data = JSON.parse(json);
            } catch (_) {
                return;
            }
            
            if (data !== null && typeof data == "object") {
                dragging_option = build_change_option_div(data as Option, true);
            } else {
                return;
            }
        }
    }, false);
    
    for (let option of place.options) {
        change_place_options.appendChild(build_change_option_div(option));
    }
    
    let cancel_listener: Function, save_listener: Function, insert_option_listener: Function;
    
    document.getElementById("cancel_btn").addEventListener("click", cancel_listener = function() {
        document.removeEventListener("dragover", dragover_listener);
        document.getElementById("cancel_btn").removeEventListener("click", cancel_listener);
        document.getElementById("save_btn").removeEventListener("click", save_listener);
        document.getElementById("change_place_insert_option").removeEventListener("click", insert_option_listener);
        
        document.getElementById("place_cont").style.display = "block";
        document.getElementById("change_place_cont").style.display = "none";
    }, false);
    
    document.getElementById("save_btn").addEventListener("click", save_listener = function() {
        document.removeEventListener("dragover", dragover_listener);
        document.getElementById("cancel_btn").removeEventListener("click", cancel_listener);
        document.getElementById("save_btn").removeEventListener("click", save_listener);
        document.getElementById("change_place_insert_option").removeEventListener("click", insert_option_listener);
    }, false);
    
    document.getElementById("change_place_insert_option").addEventListener("click", insert_option_listener = function() {
        options_div.appendChild(build_change_option_div({
            title: "",
            action: {
                type: "go_to",
                go_to: ""
            },
            condition: {
                type: "none"
            }
        }));
    }, false);
}

function build_change_option_div(option: Option, untrusted: boolean = false) {
    let option_div = document.createElement("div");

    let drag_handle = document.createElement("div");

    drag_handle.className = "drag_handle";

    drag_handle.addEventListener("mousedown", function() {
        option_div.draggable = true;
    }, false);

    drag_handle.addEventListener("mouseup", function() {
        option_div.draggable = false;
    }, false);

    let drag_indicator = document.createElement("span");

    drag_indicator.className = "material-symbols-outlined drag_indicator";
    drag_indicator.textContent = "drag_indicator";

    drag_handle.appendChild(drag_indicator);
    option_div.appendChild(drag_handle);

    option_div.addEventListener("dragstart", function(event) {
        setTimeout(() => {
            option_div.style.visibility = "hidden";
        }, 0);

        event.dataTransfer.dropEffect = "move";
        event.dataTransfer.setData("text/plain", "miao");

        dragging_option = option_div;
    }, false);

    option_div.addEventListener("dragend", function(event) {
        option_div.draggable = false;

        option_div.style.visibility = "";

        dragging_option = null;
    }, false);

    let option_cont = document.createElement("div");

    option_cont.className = "change_place_option_cont";

    let option_cont_subdiv = document.createElement("div");

    let option_title = document.createElement("input");

    option_title.type = "text";
    option_title.className = "change_place_option_title";
    option_title.placeholder = option.title;
    option_title.value = option.title;

    option_cont_subdiv.appendChild(option_title);

    let action_cont = document.createElement("div");

    action_cont.className = "change_place_option_action";

    let action_dropdown = document.createElement("select");

    let action_dropdown_option_go_to = document.createElement("option");

    action_dropdown_option_go_to.dataset.id = "go_to";
    action_dropdown_option_go_to.textContent = "Go to";

    action_dropdown.appendChild(action_dropdown_option_go_to);

    let action_dropdown_option_pick_up_item = document.createElement("option");

    action_dropdown_option_pick_up_item.dataset.id = "pick_up_item";
    action_dropdown_option_pick_up_item.textContent = "Pick up item";

    action_dropdown.appendChild(action_dropdown_option_pick_up_item);

    action_cont.appendChild(action_dropdown);

    let action_arg = document.createElement("input");

    action_arg.type = "text";
    action_arg.className = "id_input change_place_option_action_arg";

    let old_selected_option = option.action.type;
    let saved = {
        go_to: "",
        pick_up_item: ""
    };

    switch (option.action.type) {
        case "go_to":
            action_dropdown_option_go_to.selected = true;
            action_arg.placeholder = option.action.go_to;
            action_arg.value = option.action.go_to;

            saved.go_to = option.action.go_to;

            break;
        case "pick_up_item":
            action_dropdown_option_pick_up_item.selected = true;
            action_arg.placeholder = option.action.item_id;
            action_arg.value = option.action.item_id;

            saved.pick_up_item = option.action.item_id;

            break;
    }

    action_dropdown.addEventListener("change", function() {
        saved[old_selected_option] = action_arg.value;
        action_arg.value = saved[action_dropdown.selectedOptions[0].dataset.id];
        old_selected_option = action_dropdown.selectedOptions[0].dataset.id;

        switch (action_dropdown.selectedOptions[0].dataset.id) {
            case "go_to":
                action_arg.placeholder = option.action.type == "go_to" ? option.action.go_to : "";

                break;
            case "pick_up_item":
                action_arg.placeholder = option.action.type == "pick_up_item" ? option.action.item_id : "";

                break;
        }
    });

    action_cont.appendChild(action_arg);

    option_cont_subdiv.appendChild(action_cont);

    let condition_subtitle = document.createElement("h3");

    condition_subtitle.textContent = "Condition:";

    option_cont_subdiv.appendChild(condition_subtitle);

    let condition_cont = document.createElement("div");

    condition_cont.className = "change_place_option_condition";

    let condition_dropdown = document.createElement("select");

    let condition_dropdown_option_none = document.createElement("option");

    condition_dropdown_option_none.dataset.id = "none";
    condition_dropdown_option_none.textContent = "None";

    condition_dropdown.appendChild(condition_dropdown_option_none);

    let condition_dropdown_option_item = document.createElement("option");

    condition_dropdown_option_item.dataset.id = "item";
    condition_dropdown_option_item.textContent = "Possesses item";

    condition_dropdown.appendChild(condition_dropdown_option_item);

    condition_cont.appendChild(condition_dropdown);

    let condition_arg_cont = document.createElement("div");

    let condition_arg = document.createElement("input");

    condition_arg.type = "text";
    condition_arg.className = "id_input change_place_option_condition_arg";

    let clear_item_cont = document.createElement("div");

    clear_item_cont.className = "change_place_option_condition_clear_item";

    let clear_item = document.createElement("input");
    let clear_item_label = document.createElement("label");

    clear_item.type = "checkbox";
    clear_item.id = "_" + id_ctr++;

    clear_item_label.textContent = "Clear item";
    clear_item_label.htmlFor = clear_item.id;

    clear_item_cont.appendChild(clear_item);
    clear_item_cont.appendChild(clear_item_label);

    let saved_item = "";

    switch (option.condition.type) {
        case "none":
            condition_dropdown_option_none.selected = true;
            condition_arg_cont.style.display = "none";

            break;
        case "item":
            condition_dropdown_option_item.selected = true;
            condition_arg.placeholder = option.condition.item_id;
            condition_arg.value = option.condition.item_id;
            clear_item.checked = option.condition.clear_item;

            saved_item = option.condition.item_id;

            break;
    }

    condition_dropdown.addEventListener("change", function() {
        switch (condition_dropdown.selectedOptions[0].dataset.id) {
            case "none":
                condition_arg_cont.style.display = "none";

                break;
            case "item":
                condition_arg_cont.style.display = "";

                break;
        }
    });

    condition_arg_cont.appendChild(condition_arg);
    condition_arg_cont.appendChild(clear_item_cont);

    condition_cont.appendChild(condition_arg_cont);

    option_cont_subdiv.appendChild(condition_cont);

    option_cont.appendChild(option_cont_subdiv);
    option_div.appendChild(option_cont);

    return option_div;
}
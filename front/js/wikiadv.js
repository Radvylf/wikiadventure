let old_place_change_btn_listener = null;

function load_place(place) {
    document.getElementById("place_color").style.color = place.color;
    document.getElementById("place_title").textContent = place.title;
    document.getElementById("place_id").textContent = place.id;
    document.getElementById("place_writeup").textContent = place.writeup;
    
    let options_div = document.getElementById("place_options");
    
    while (options_div.firstChild) options_div.removeChild(options_div.firstChild);
    
    for (let option of place.options) {
        // if (option.conditions.every(test_condition)) {
            let option_btn = document.createElement("button");
            let color_span = document.createElement("span");

            color_span.className = "right_arrow";
            color_span.textContent = "\u25b6";
            color_span.style.color = "#808080"; // option.color

            option_btn.appendChild(color_span);
            option_btn.appendChild(document.createTextNode(" " + option.title));

            option_btn.addEventListener("click", function() {
                // go to option.go_to
                // run option.functions
            }, false);

            options_div.appendChild(option_btn);
        // }
    }
    
    let change_place_btn = document.getElementById("change_place_btn");
    
    if (old_place_change_btn_listener != null) change_place_btn.removeEventListener("click", old_place_change_btn_listener);
    
    change_place_btn.addEventListener("click", old_place_change_btn_listener = function() {
        document.getElementById("place_cont").style.display = "none";
        document.getElementById("change_place_cont").style.display = "block";

        load_change_place(place);
    }, false);
}

let id_ctr = 0;

function load_change_place(place) {
    // TODO: check for conflicts
    
    document.getElementById("change_place_id").textContent = place.id;
    document.getElementById("change_place_color").style.background_color = place.color;
    document.getElementById("change_place_title").textContent = place.title;
    document.getElementById("change_place_writeup").textContent = place.writeup;
    
    let options_div = document.getElementById("change_place_options");
    
    let dragging_option = null;
    
    while (options_div.firstChild) options_div.removeChild(options_div.firstChild);

    function build_change_option_div(option, untrusted = false) {
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
    
    let dragover_listener;
    
    document.addEventListener("dragover", dragover_listener = function(event) {
        if (!dragging_option) return;
        
        event.preventDefault();
        
        let offset = event.offsetY + event.target.offsetTop - options_div.offsetTop;
        
        let passed_dragging_option = false;
        
        for (let option of [...options_div.childNodes].reverse()) {
            if (offset > option.offsetTop - options_div.offsetTop - 6) {
                if (option == dragging_option) break;
                
                if (passed_dragging_option) {
                    options_div.insertBefore(dragging_option, option);
                } else {
                    option.after(dragging_option);
                }
                
                break;
            }
            
            if (option == dragging_option) passed_dragging_option = true;
        }
    }, false);
    
    options_div.addEventListener("drop", function(event) {
        if (!dragging_option) {
            let json = event.dataTransfer.getData("text/plain");
            
            event.dataTransfer.items[0].getAsString(console.log);
            
            let data = null;
            
            try {
                data = JSON.parse(json);
            } catch (_) {
                return;
            }
            
            if (data != null && typeof data == "object") {
                dragging_option = build_change_option_div(data, true);
            } else {
                return;
            }
        }
    }, false);
    
    for (let option of place.options) {
        options_div.appendChild(build_change_option_div(option));
    }
    
    let cancel_listener, save_listener, insert_option_listener;
    
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

document.getElementById("change_place_color").addEventListener("click", function() {
    
});

load_place({
    id: "office",
    color: "hsl(0, 0%, 96%)",
    title: "Office",
    writeup: "You're in an office, with boarded up windows on three walls. The stairway behind you leads out to the alley, and a locked door leads to a gallery.",
    options: [
        {
            title: "Alley",
            action: {
                type: "go_to",
                go_to: "alley"
            },
            condition: {
                type: "none"
            }
        },
        {
            title: "Gallery",
            action: {
                type: "go_to",
                go_to: "gallery"
            },
            condition: {
                type: "item",
                item_id: "gallery_key",
                clear_item: false
            }
        },
        {
            title: "Pick up shotgun",
            action: {
                type: "pick_up_item",
                item_id: "shotgun"
            },
            condition: {
                type: "item",
                item_id: "coins",
                clear_item: true
            }
        }
    ]
});
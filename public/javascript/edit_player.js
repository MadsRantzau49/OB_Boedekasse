let searched_player_button = document.getElementById("search_player");

searched_player_button.addEventListener("click",() => {
    //Remove current text
    let div = document.getElementById("edit_player");
    let elementsToRemove = div.querySelectorAll(".labels_and_input, br");

    elementsToRemove.forEach(function(element) {
        element.parentNode.removeChild(element);
    });


    fetch("/database/player_finance.json")
    .then(response => {
        if (!response.ok) {
            throw new Error("Network response was not ok");
        }
        return response.json();
    })
    .then(data => {
        let searched_player = document.getElementById("player_name").value;
        let edit_div = document.getElementById("edit_player");
        data.payingPlayers.forEach(player => {
            if(player.dbu_name === searched_player){

                let labelsAndValues = [
                    {label: "DBU navn", type: "text", id: "new_dbu_name", value: player.dbu_name},
                    {label: "Mobilepay navn", type: "text", id: "new_mp_name", value: player.mobilepay_name},
                    {label: "Røde kort", type: "number", id: "new_red", value: player.extra_fines.red_card},
                    {label: "Gule kort", type: "number", id: "new_yellow", value: player.extra_fines.yellow_card},
                    {label: "Bøde Beskrivelse", type: "text", id: "new_others", value: player.extra_fines.others},
                    {label: "Kroner", type: "number", id: "new_others_price", value: player.extra_fines.others_price}
                ];
                
                labelsAndValues.forEach(item => {
                    edit_div.appendChild(document.createElement("br"));

                    let label = document.createElement("label");
                    label.textContent = item.label + ": ";
                    label.setAttribute("for", item.id);
                    label.className="labels_and_input";
                
                    let input = document.createElement("input");
                    input.type = item.type;
                    input.id = item.id;
                    input.value = item.value;
                    input.className="labels_and_input";
                
                    edit_div.appendChild(label);
                    edit_div.appendChild(input);
                });

                let save_changes_button = document.createElement("button");
                save_changes_button.id = "save_changes_button";
                save_changes_button.textContent ="Gem ændringer";
                save_changes_button.addEventListener("click", update_player);
                save_changes_button.className = "labels_and_input";

                edit_div.appendChild(save_changes_button);
                edit_div.appendChild(document.createElement("br"));


                let removal_player_button = document.createElement("button");
                removal_player_button.id = "remove_player_button";
                removal_player_button.textContent ="Slet spiller!";
                removal_player_button.addEventListener("click", remove_player);
                removal_player_button.className = "labels_and_input";


                removal_player_button.style.backgroundColor = "red";
                removal_player_button.style.marginTop = "50px";
                
                edit_div.appendChild(removal_player_button);
                

            }
        });
    })
    .catch(error => {
        console.error('There was a problem fetching the JSON file:', error);
    });
});


function update_player(){
    let old_dbu_name = document.getElementById("player_name").value;

    let dbu_name = document.getElementById("new_dbu_name").value;
    let mp_name = document.getElementById("new_mp_name").value;
    let red = document.getElementById("new_red").value;
    let yellow = document.getElementById("new_yellow").value;
    let others = document.getElementById("new_others").value;
    let others_price = document.getElementById("new_others_price").value;


    // Create an object with the data
    const data = {
        old_dbu_name: old_dbu_name,
        dbu_name: dbu_name,
        mobilepay_name: mp_name,
        yellow_card: yellow,
        red_card: red,
        others: others,
        others_price: others_price
    };
  
    // Send the data to the server-side script
    fetch('/update_player', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    })
    .then(response => response.json())
    .then(data => {
        console.log('Data has been successfully saved:', data);
    })
    .catch((error) => {
        console.error('Error:', error);
    });
    show_message("Spilleren er opdateret")

}



function remove_player(){
    let dbu_name = document.getElementById("player_name").value;

    let dobbeltcheck = confirm("Er du sikker på du vil fjerne "+dbu_name+"?");
    if(!dobbeltcheck){
        return 0;
    }

    // Create an object with the data
    const data = {
        dbu_name: dbu_name,
    };
  
    // Send the data to the server-side script
    fetch('/remove_player', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    })
    .then(response => response.json())
    .then(data => {
        console.log('Data has been successfully saved:', data);
    })
    .catch((error) => {
        console.error('Error:', error);
    });
    show_message("Spilleren er slettet")

}


function show_message(message_string){
    let message = document.getElementById("message");
    message.textContent = message_string;
    setTimeout(function() {
        location.reload();
    }, 2000);

}
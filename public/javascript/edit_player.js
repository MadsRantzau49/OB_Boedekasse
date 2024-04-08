let true_password = "kungfupanda";

let password_button = document.getElementById("submit_password");
password_button.addEventListener("click",login);

function login(){
    let admin_div = document.getElementById("admin_settings");
    let login_div = document.getElementById("password_div");
    let saved_password = localStorage.getItem("password");

    let password = document.getElementById("password").value;
    if(password === true_password || saved_password === true_password){
        admin_div.style.display ="block";
        login_div.style.display ="none";
        localStorage.setItem("password", true_password);
    }
}

login();
let searched_player_button = document.getElementById("search_player");
let select_bar= document.getElementById("player_name");

searched_player_button.addEventListener("click", change_player_data);
select_bar.addEventListener("change", change_player_data);

function change_player_data(){

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
                edit_div.appendChild(document.createElement("br"));
                
                
                // Create a table element
                let fine_table = document.createElement("table");
                fine_table.id="extra_fines_table";
                fine_table.className="labels_and_input";


                // Create a table row for the header
                var headerRow = document.createElement("tr");

                // Create table header cells
                var headerCell1 = document.createElement("th");
                headerCell1.textContent = "Beskrivelse";

                var headerCell2 = document.createElement("th");
                headerCell2.textContent = "Kroner";

                var headerCell3 = document.createElement("th");
                headerCell3.textContent = "SLET BØDE";

                // Append header cells to the header row
                headerRow.appendChild(headerCell1);
                headerRow.appendChild(headerCell2);
                headerRow.appendChild(headerCell3);

                // Append the header row to the table
                fine_table.appendChild(headerRow);

                div.appendChild(fine_table);
                player.extra_fines.others.forEach((fine_description,index) =>{
                    let row = document.createElement("tr");
                    row.id="row"+index;
                    row.className = "row_for_extra_fines";


                    let fine_price = player.extra_fines.others_price[index];
                    
                    let fine_description_element = document.createElement("td");
                    fine_description_element.textContent = fine_description;
                    row.appendChild(fine_description_element);

                    let fine_price_element = document.createElement("td");
                    fine_price_element.textContent = fine_price;
                    row.appendChild(fine_price_element);

                    let delete_fine = document.createElement("td");
                    let delete_fine_button = document.createElement("button");
                    delete_fine_button.id = "fine"+index;
                    delete_fine_button.textContent = "Fjern bøde";
                    //remove it from the table
                    delete_fine_button.addEventListener("click", () => {
                        delete_row(index)
                    }); 
                    delete_fine.appendChild(delete_fine_button);
                    row.appendChild(delete_fine);

                    fine_table.appendChild(row);
                    
                });
                let row = document.createElement("tr");

                let create_fine = document.createElement("td");
                let fine_description_input = document.createElement("input");
                fine_description_input.type = "text";
                fine_description_input.id = "fine_description";
                fine_description_input.placeholder = "Beskrivelse";
                create_fine.appendChild(fine_description_input);
                row.appendChild(create_fine);

                let create_price = document.createElement("td");
                let fine_price_input = document.createElement("input");
                fine_price_input.type = "number";
                fine_price_input.id = "fine_price";
                fine_price_input.placeholder = "pris";
                create_price.appendChild(fine_price_input);
                row.appendChild(create_price);

                let delete_fine = document.createElement("td");
                let delete_fine_button = document.createElement("button");
                delete_fine_button.id = "create_new_fine";
                delete_fine_button.textContent = "Opret bøde";
                delete_fine_button.addEventListener("click", create_fine_row);
                delete_fine.appendChild(delete_fine_button);
                row.appendChild(delete_fine);

                fine_table.appendChild(row);


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
}

function create_fine_row(){

    let fine_table = document.getElementById("extra_fines_table");
    let index = fine_table.rows[fine_table.rows.length - 2].id;
    index = index.replace("row","");
    index = parseInt(index);
    index++;


    let others = document.getElementById("fine_description").value;
    let others_price = document.getElementById("fine_price").value.trim();
    let row = document.createElement("tr");
    row.id="row"+index;
    row.className = "row_for_extra_fines";
    
    let fine_description_element = document.createElement("td");
    fine_description_element.textContent = others;
    row.appendChild(fine_description_element);

    let fine_price_element = document.createElement("td");
    fine_price_element.textContent = others_price === "" ? 0 : others_price;
    console.log(fine_price_element.textContent);

    row.appendChild(fine_price_element);

    let delete_fine = document.createElement("td");
    let delete_fine_button = document.createElement("button");
    delete_fine_button.id = "fine"+index;
    delete_fine_button.textContent = "Fjern bøde";
    //remove it from the table
    delete_fine_button.addEventListener("click", () => {
        delete_row(index)
    }); 
    delete_fine.appendChild(delete_fine_button);
    row.appendChild(delete_fine);

    fine_table.insertBefore(row, fine_table.lastElementChild);

}

function delete_row(index){
    let row = document.getElementById("row"+index);
    row.parentNode.removeChild(row);
}


function update_player(){
    let old_dbu_name = document.getElementById("player_name").value;

    let dbu_name = document.getElementById("new_dbu_name").value;
    let mp_name = document.getElementById("new_mp_name").value;
    let red = document.getElementById("new_red").value;
    let yellow = document.getElementById("new_yellow").value;
    let others = [];
    let others_price = [];

    let others_table_rows = document.querySelectorAll(".row_for_extra_fines");
    others_table_rows.forEach(fine => {
        let tds = fine.getElementsByTagName("td");
        others.push(tds[0].textContent);
        others_price.push(tds[1].textContent)
    });



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
const start_search_button = document.getElementById("searchButton");
const search_player = document.getElementById("player_name");

const latest_search_local_storage = localStorage.getItem("latest_search");

search_player.value = latest_search_local_storage;
if(latest_search_local_storage !== null){
    check_number_of_players_found(search_player)
} 

// Pass a reference to the function without invoking it
start_search_button.addEventListener("click", function() {
    document.querySelectorAll("#errorSearching").forEach(element => element.remove());
    document.querySelectorAll(".playerData").forEach(element => element.remove());

    save_latest_search(search_player);
    check_number_of_players_found(search_player);
});

search_player.addEventListener("change", function() {
    document.querySelectorAll("#errorSearching").forEach(element => element.remove());
    document.querySelectorAll(".playerData").forEach(element => element.remove());

    save_latest_search(search_player)
    check_number_of_players_found(search_player);
});

function save_latest_search(search_player){
    localStorage.setItem("latest_search", search_player.value);

}

function check_number_of_players_found(search_player) {
    let player_counter = 0;

    fetch("/database/player_finance.json")
        .then(response => {
            if (!response.ok) {
                throw new Error("Network response was not ok");
            }
            return response.json();
        })
        .then(data => {
            data.payingPlayers.forEach(player => {
                if (player.dbu_name.toLowerCase().includes(search_player.value.toLowerCase())) {
                    console.log(player.dbu_name);
                    player_counter++;
                    console.log(player_counter);
                }
            });
            let error_searching = document.createElement("h5");
            error_searching.id = "errorSearching";
            if (player_counter === 1) {
                search_player_function(search_player);
            } else if (player_counter < 1) {
                error_searching.textContent="Ingen fundet, prøv igen."
                search_player.parentNode.insertBefore(error_searching,search_player.nextSibling);
            } else {
                error_searching.textContent="For mange spillere fundet, prøv mere specifikt. f.eks Jannik L."
                search_player.parentNode.insertBefore(error_searching,search_player.nextSibling);

            }
        })
        .catch(error => {
            console.error('There was a problem fetching the JSON file:', error);
        });
}


function search_player_function(search_player){
    let matches_list = [];
    let matches_played_number = 0;
    fetch('/database/matches.json')
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            data.matches.forEach(match => {

                match.playerlist.forEach(player_name => {
                    if(player_name.toLowerCase().includes(search_player.value.toLowerCase())){
                        matches_played_number++;
                        let link = `https://www.dbu.dk/resultater/kamp/ ${match.matchID}_${match.season}/kampinfo`;
                        matches_list.push(link);
                    }
                });

            });
        })
        .catch(error => {
            console.error('There was a problem fetching the JSON file:', error);
        });

    fetch("/database/player_finance.json")
        .then(response => {
            if (!response.ok) {
                throw new Error("Network response was not ok");
            }
            return response.json();
        })
        .then(data => {
            const jsonDisplayDiv = document.getElementById("player_finance_table");
            data.payingPlayers.forEach(player => {
                if(player.dbu_name.toLowerCase().includes(search_player.value.toLowerCase())){
                    const row = document.createElement("tr");
                    row.className="playerData";

                    const dbuName = document.createElement("td");
                    dbuName.textContent = player.dbu_name;
                    row.appendChild(dbuName);
                    
                    const balance = document.createElement("td");
                    balance.textContent = player.Deposit - player.Dept;
                    row.appendChild(balance);


                    const dept = document.createElement("td");
                    dept.textContent = player.Dept;
                    row.appendChild(dept);
                
                    const deposit = document.createElement("td");
                    deposit.textContent = player.Deposit;
                    row.appendChild(deposit);

                    const extraFinesList = document.createElement("td");
                    extraFinesList.textContent = `Rødt kort: ${player.extra_fines['red card']}<br>Gult kort: ${player.extra_fines['yellow card']}<br>Andre ${player.extra_fines['others']}`;
                    row.appendChild(extraFinesList);
 
                    const match_participated_in = document.createElement("td");
            
                    const matches_total_played = document.createElement("h4");
                    matches_total_played.textContent = matches_played_number + " Kampe spillet totalt";
                    match_participated_in.appendChild(matches_total_played);

                    // Iterate through each link in matches_list
                    matches_list.forEach(link => {
                        const a = document.createElement('a');
                        a.href = link; 
                        a.textContent = link; 
                        a.target = "_blank";
                        match_participated_in.appendChild(a); 
                        match_participated_in.appendChild(document.createElement("br")); 

                    });

                    row.appendChild(match_participated_in); 


                    jsonDisplayDiv.appendChild(row);
                } 
            });
        })
        .catch(error => {
            console.error("There was a problem fetching the JSON file:", error);
        });
}

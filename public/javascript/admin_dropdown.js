// generate dropdown
fetch('/database/player_finance.json')
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(data => {
        data.payingPlayers.forEach(player => {
            add_option(player.dbu_name);
        });
    })
    .catch(error => {
        console.error('There was a problem fetching the JSON file:', error);
    });

function add_option(dbu_player_name) {
    var dropdownContent = document.getElementById("player_name");
    var player = document.createElement("option");
    player.textContent = dbu_player_name;
    dropdownContent.appendChild(player);
  }

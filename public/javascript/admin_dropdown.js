async function fetchData(file) {
    try {
      const response = await fetch("/api/"+file);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      return data;
      // Use the data to display your quiz
    } catch (error) {
      console.error("Error fetching quiz data:", error);
    }
}

async function dropdown(){
    let data = await fetchData("player-finance");
    data.payingPlayers.forEach(player => {
        add_option(player.dbu_name);
    });
}
dropdown();


function add_option(dbu_player_name) {
    var dropdownContent = document.getElementById("player_name");
    var player = document.createElement("option");
    player.textContent = dbu_player_name;
    dropdownContent.appendChild(player);
  }

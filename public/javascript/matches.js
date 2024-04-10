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


async function matches (){
    let data = await fetchData("matches");
    const jsonDisplayDiv = document.getElementById('matches_played_table');
    data.matches.forEach(match => {

        const row = document.createElement('tr');

        const oeb = document.createElement('td');
        oeb.textContent = match.match_result.oester_sundby;
        row.appendChild(oeb);
    
        const opp = document.createElement('td');
        opp.textContent = match.match_result.opponent;
        row.appendChild(opp);
    
        const fine = document.createElement('td');
        fine.textContent = match.fine;
        row.appendChild(fine);
        
        const playerList = document.createElement('td');
        playerList.textContent = match.playerlist;
        row.appendChild(playerList)


        const match_link = document.createElement("td");
        const a = document.createElement('a'); 
        const link = `https://www.dbu.dk/resultater/kamp/ ${match.matchID}_${match.season}/kampinfo`;
        a.href = link; 
        a.textContent = link; 
        a.target = "_blank"; // Open link in a new tab
        match_link.appendChild(a); 
        row.appendChild(match_link); 
    
        jsonDisplayDiv.appendChild(row);
    });
}
matches();
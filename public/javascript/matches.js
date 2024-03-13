document.addEventListener('DOMContentLoaded', function() {
    fetch('/database/matches.json')
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
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
            
                jsonDisplayDiv.appendChild(row);
            });
        })
        .catch(error => {
            console.error('There was a problem fetching the JSON file:', error);
        });
});

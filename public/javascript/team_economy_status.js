document.addEventListener('DOMContentLoaded', function() {
    fetch('/database/player_finance.json')
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            const jsonDisplayDiv = document.getElementById('player_finance_table');
            data.payingPlayers.forEach(player => {

                const row = document.createElement('tr');

                const dbuName = document.createElement('td');
                dbuName.textContent = player.dbu_name;
                row.appendChild(dbuName);
            
                const dept = document.createElement('td');
                dept.textContent = player.Dept;
                row.appendChild(dept);
            
                const deposit = document.createElement('td');
                deposit.textContent = player.Deposit;
                row.appendChild(deposit);
            

            
                const extraFinesList = document.createElement('td');
                extraFinesList.innerHTML = `Rødt kort: ${player.extra_fines['red card']}<br>Gult kort: ${player.extra_fines['yellow card']}<br>Andre ${player.extra_fines['others']}`;
                row.appendChild(extraFinesList);
            
                jsonDisplayDiv.appendChild(row);
            });
        })
        .catch(error => {
            console.error('There was a problem fetching the JSON file:', error);
        });
});

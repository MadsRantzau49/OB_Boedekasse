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
            
                const extraFinesHeading = document.createElement('td');
                extraFinesHeading.textContent = 'Extra fines:';
                row.appendChild(extraFinesHeading);
            
                const extraFinesList = document.createElement('td');
                extraFinesList.textContent = `Red Card: ${player.extra_fines['red card']} , Yellow Card: ${player.extra_fines['yellow card']}`;
                row.appendChild(extraFinesList);
            
                jsonDisplayDiv.appendChild(row);
            });
        })
        .catch(error => {
            console.error('There was a problem fetching the JSON file:', error);
        });
});




document.addEventListener('DOMContentLoaded', function() {
    fetch('/database/player_finance.json')
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            const latest_search_local_storage = localStorage.getItem("latest_search");
            console.log(latest_search_local_storage);
                
            const jsonDisplayDiv = document.getElementById('player_finance_table');
            data.payingPlayers.forEach(player => {

                const row = document.createElement('tr');

                const dbuName = document.createElement('td');
                dbuName.textContent = player.dbu_name;
                row.appendChild(dbuName);
            
                const balance = document.createElement('td');
                let calculate_balance = player.Deposit - player.Dept;
                balance.textContent = calculate_balance;
                if (calculate_balance < 0){
                    balance.style.color="red";
                } else {
                    balance.style.color="green";
                }
                row.appendChild(balance);

                if (latest_search_local_storage) {
                    if (player.dbu_name.toLowerCase().includes(latest_search_local_storage.toLowerCase())) {
                        jsonDisplayDiv.insertBefore(row, jsonDisplayDiv.getElementsByTagName('tr')[1]);
                    } else {
                        jsonDisplayDiv.appendChild(row);
                    }
                } else {
                    jsonDisplayDiv.appendChild(row);
                }                
            });
        })
        .catch(error => {
            console.error('There was a problem fetching the JSON file:', error);
        });
});

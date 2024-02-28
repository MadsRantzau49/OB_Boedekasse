document.addEventListener('DOMContentLoaded', function() {
    fetch('../javascript/player_finance.json')
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            const jsonDisplayDiv = document.getElementById('player_finance');
            const heading = document.createElement('h1');
            heading.textContent = 'JSON Data';
            jsonDisplayDiv.appendChild(heading);

            data.payingPlayers.forEach(player => {
                const playerDiv = document.createElement('div');

                const dbuName = document.createElement('p');
                dbuName.innerHTML = `<strong>DBU Name:</strong> ${player.dbu_name}`;
                playerDiv.appendChild(dbuName);

                const mobilepayName = document.createElement('p');
                mobilepayName.innerHTML = `<strong>MobilePay Name:</strong> ${player.mobilepay_name}`;
                playerDiv.appendChild(mobilepayName);

                const deposit = document.createElement('p');
                deposit.innerHTML = `<strong>Deposit:</strong> ${player.Deposit}`;
                playerDiv.appendChild(deposit);

                const dept = document.createElement('p');
                dept.innerHTML = `<strong>Dept:</strong> ${player.Dept}`;
                playerDiv.appendChild(dept);

                const extraFinesHeading = document.createElement('p');
                extraFinesHeading.textContent = 'Extra fines:';
                playerDiv.appendChild(extraFinesHeading);

                const extraFinesList = document.createElement('ul');
                const redCard = document.createElement('li');
                redCard.textContent = `Red Card: ${player.extra_fines['red card']}`;
                extraFinesList.appendChild(redCard);
                const yellowCard = document.createElement('li');
                yellowCard.textContent = `Yellow Card: ${player.extra_fines['yellow card']}`;
                extraFinesList.appendChild(yellowCard);

                playerDiv.appendChild(extraFinesList);

                jsonDisplayDiv.appendChild(playerDiv);
            });
        })
        .catch(error => {
            console.error('There was a problem fetching the JSON file:', error);
        });
});

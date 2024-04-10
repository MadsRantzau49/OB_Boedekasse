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

async function player_eco(){
    let data = await fetchData("player-finance");
    const latest_search_local_storage = localStorage.getItem("latest_search");
    console.log(latest_search_local_storage);
        
    const jsonDisplayDiv = document.getElementById('player_finance_table');
    data.payingPlayers.forEach(player => {

        const row = document.createElement('tr');

        const dbuName = document.createElement('td');
        dbuName.textContent = player.dbu_name;
        row.appendChild(dbuName);
    
        const balance = document.createElement('td');
        let calculate_balance = player.balance;
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
}
player_eco();

async function mobileData(){
    let data = await fetchData("mobile-box");
    let mp_name = document.getElementById("mp_box_name");
    mp_name.textContent = "Navn: " + data.box[0].name;

    let mp_number = document.getElementById("mp_box_number");
    mp_number.textContent = "Nummber: " + data.box[0].number;

    let mp_balance = document.getElementById("mp_box_balance");
    mp_balance.textContent = "Nuværende balance: " +data.box[0].balance;

    const table = document.getElementById('mobilepay_box_finance_table');
    data.box[0].send_money_to.forEach((name,index) => {
        let row = document.createElement("tr");

        let receiver = document.createElement("td");
        receiver.textContent = name;  
        row.appendChild(receiver);

        let amount = document.createElement("td");
        amount.textContent = data.box[0].send_money_amount[index];
        row.appendChild(amount);

        let date = document.createElement("td");
        date.textContent = data.box[0].date[index];
        row.appendChild(date);
        
        table.appendChild(row);
    });
}
mobileData();
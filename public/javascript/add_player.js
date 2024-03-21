const create_player = document.getElementById("submit_player");
create_player.addEventListener("click", () => {
    let dbu_name = document.getElementById("dbu_player_name").value;
    let mp_name = document.getElementById("mp_player_name").value;

    // Create an object with the data
    const data = {
        dbu_name: dbu_name,
        mobilepay_name: mp_name,
        Deposit: 0,
        Dept: 0,
        extra_fines: {
            red_card: 0,
            yellow_card: 0,
            others: [],
            others_price: []
        }
    };
  
    // Send the data to the server-side script
    fetch('/add_player', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    })
    .then(response => response.json())
    .then(data => {
        console.log('Data has been successfully saved:', data);
    })
    .catch((error) => {
        console.error('Error:', error);
    });

    location.reload();
    alert("DBU navn: " + dbu_name + "\nMobilepay navn: " + mp_name + "\nEr oprettet");
});
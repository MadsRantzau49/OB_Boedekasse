const express = require('express');
const { exec } = require('child_process');
const path = require('path');
const fs = require("fs");



const app = express();
const PORT = 10000;

// Serve static files from the 'public' directory
app.use(express.static('public'));

//Make the server able to receive client json data.
app.use(express.json());


// Define a route to handle GET requests to the root URL
app.get('/', (req, res) => {
    // Send the HTML file when accessing the root URL
    res.sendFile(path.join(__dirname, '..', 'public', 'index.html'));
});

// Define a route to handle POST requests to execute Python script
app.post('/execute-python', (req, res) => {
    const pythonScriptPath = path.join(__dirname,'python', 'main.py');


    exec(`python ${pythonScriptPath}`, (error, stdout, stderr) => {
        if (error) {
            console.error(`Error executing Python script: ${error}`);
            res.status(500).send('Error executing Python script');
            return;
        }
        console.log('Python script output:', stdout);
        console.error('Python script errors:', stderr);
        res.sendStatus(200);
    });
});

//Upload quiz data into the database
app.post("/add_player", (req, res) => {
    // Access the data sent from the client /the new question
    const new_player = req.body;

    // Append quiz data to the current JSON file
    fs.readFile("database/player_finance.json", "utf8", (err, data) => {
        let player_data = [];
        //Get the current data
        player_data = JSON.parse(data);
        //Insert the current/old questions
        player_data.payingPlayers.push(new_player);

        // Convert the updated data back to JSON format
        const updatedJSON = JSON.stringify(player_data, null, 4); // 2 is for indentation for readability
        console.log(updatedJSON);

        // Write the updated JSON back to the file
        fs.writeFile("database/player_finance.json", updatedJSON, (err) => {
            if (err) {
                console.error("Error writing to file:", err);
                return;
            }
            console.log("SUCCES.");
        });
    });
});

//remove_player
app.post("/remove_player", (req, res) => {
    // Access the data sent from the client /the new question
    const player_to_be_removed = req.body;

    // Append quiz data to the current JSON file
    fs.readFile("database/player_finance.json", "utf8", (err, data) => {
        let player_data = [];
        //Get the current data
        player_data = JSON.parse(data);


        player_data.payingPlayers.forEach((player, index) => {
            if(player.dbu_name === player_to_be_removed.dbu_name){
                player_data.payingPlayers.splice(index, 1)
                console.log("complete");
            }
            
        });
        // Convert the updated data back to JSON format
        const updatedJSON = JSON.stringify(player_data, null, 4); // 2 is for indentation for readability
        console.log(updatedJSON);

        // Write the updated JSON back to the file
        fs.writeFile("database/player_finance.json", updatedJSON, (err) => {
            if (err) {
                console.error("Error writing to file:", err);
                return;
            }
            console.log("SUCCES.");
        });
    });
});

//update_player
app.post("/update_player", (req, res) => {
    // Access the data sent from the client /the new question
    const player_to_be_updated = req.body;

    // Append quiz data to the current JSON file
    fs.readFile("database/player_finance.json", "utf8", (err, data) => {
        let player_data = [];
        //Get the current data
        player_data = JSON.parse(data);

        console.log("old",player_to_be_updated.old_dbu_name);
        player_data.payingPlayers.forEach((player,index) => {
            if(player.dbu_name === player_to_be_updated.old_dbu_name){
                player_data.payingPlayers[index].dbu_name = player_to_be_updated.dbu_name;
                player_data.payingPlayers[index].mobilepay_name = player_to_be_updated.mobilepay_name;
                player_data.payingPlayers[index].extra_fines.yellow_card = player_to_be_updated.yellow_card;
                player_data.payingPlayers[index].extra_fines.red_card = player_to_be_updated.red_card;
                player_data.payingPlayers[index].extra_fines.others = player_to_be_updated.others;
                player_data.payingPlayers[index].extra_fines.others_price = player_to_be_updated.others_price;

            }
            
        });
        // Convert the updated data back to JSON format
        const updatedJSON = JSON.stringify(player_data, null, 4); // 2 is for indentation for readability

        // Write the updated JSON back to the file
        fs.writeFile("database/player_finance.json", updatedJSON, (err) => {
            if (err) {
                console.error("Error writing to file:", err);
                return;
            }
            console.log("SUCCES.");
        });
    });
});



//return the json file to the client.
app.get('/api/player-finance', (req, res) => {
    try {
      const data = fs.readFileSync(path.join(__dirname, 'database/player_finance.json'), 'utf8');
      res.json(JSON.parse(data));
    } catch (error) {
      console.error('Error fetching quiz data:', error);
      res.status(500).send('Internal Server Error');
    }
  });
  

app.get('/api/matches', (req, res) => {
    try {
        const data = fs.readFileSync(path.join(__dirname, 'database/matches.json'), 'utf8');
        res.json(JSON.parse(data));
    } catch (error) {
        console.error('Error fetching quiz data:', error);
        res.status(500).send('Internal Server Error');
    }
});

app.get('/api/mobile-box', (req, res) => {
    try {
        const data = fs.readFileSync(path.join(__dirname, 'database/mobile_box_stats.json'), 'utf8');
        res.json(JSON.parse(data));
    } catch (error) {
        console.error('Error fetching quiz data:', error);
        res.status(500).send('Internal Server Error');
    }
});

// app.listen(PORT, () => {
//     console.log(`Server listening on localhost ${PORT}`);
// });
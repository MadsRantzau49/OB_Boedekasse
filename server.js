const express = require('express');
const { exec } = require('child_process');
const path = require('path');



const app = express();
const PORT = 3000;

// Serve static files from the 'public' directory
app.use(express.static('public'));

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
    fs.readFile("public/database/player_finance.json", "utf8", (err, data) => {
        let player_data = []
        //Get the current data
        player_data = JSON.parse(data);
        //Insert the current/old questions
        player_data.quiz.push(new_player);

        // Convert the updated data back to JSON format
        const updatedJSON = JSON.stringify(questionsData, null, 4); // 2 is for indentation for readability

        // Write the updated JSON back to the file
        fs.writeFile("public/database/player_finance.json", updatedJSON, (err) => {
            if (err) {
                console.error("Error writing to file:", err);
                return;
            }
            console.log("Question appended successfully.");
        });
    });
});


app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});

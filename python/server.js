const express = require('express');
const { exec } = require('child_process');

const app = express();
const PORT = 3000;

// Serve static files from the 'public' directory
app.use(express.static('public'));

// Define a route to handle GET requests to the root URL
app.get('/', (req, res) => {
    // Send the HTML file when accessing the root URL
    res.sendFile(__dirname + '/index.html');
});

// Define a route to handle POST requests to execute Python script
app.post('/execute-python', (req, res) => {
    const pythonScriptPath = 'new_main.py';

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

app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});

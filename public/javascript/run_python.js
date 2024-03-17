document.getElementById('executeButton').addEventListener('click', function() {
    loading_screen("start");
    fetch('/execute-python', { method: 'POST' })
        .then(response => {
            if (response.ok) {
                console.log('Python script executed successfully!');
                loading_screen("end");
            } else {
                console.log('Failed to execute Python script.');
            }
        })
        .catch(error => {
            console.error('Error executing Python script:', error);
            alert('Failed to execute Python script.');
        });
});


function loading_screen(status){
    if(status === "end"){
        document.getElementById("noob").remove();
        location.reload();
    } else {
        let text = document.createElement("h3");

        text.style.position = "absolute";
        text.style.textAlign = "center";
        text.style.width = "100%";
        text.style.top = "50%";
        text.textContent = "Vent Venligst, Denne kode er skrevet af en Amatør";
        text.id="noob";
        document.body.appendChild(text);
    }
    
}

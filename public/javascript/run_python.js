let execute_button = document.getElementById("executeButton");

execute_button.addEventListener('click', execute_python_script);

async function execute_python_script(){
    loading_screen("start");
    toggle_nav_bar("start");
    await fetch('/execute-python', { method: 'POST' })
    .then(response => {
        if (response.ok) {
            console.log('Python script executed successfully!');
            loading_screen("end");
            toggle_nav_bar("end");
        } else {
            console.log('Failed to execute Python script.');
            loading_screen("end");
            toggle_nav_bar("end");
            alert("FAILED");
        }
    })
    .catch(error => {
        console.error('Error executing Python script:', error);
        loading_screen("end");
        toggle_nav_bar("end");
        alert("FAILED");
    });
    loading_screen("end");
    toggle_nav_bar("end");
}

function toggle_nav_bar(status){
    let elements = document.querySelectorAll("nav, select, input, button, a");

    elements.forEach(element => {
        if (element) {
            element.style.display = (status === "end") ? "block" : "none";
        } 
    });
}


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
        text.innerHTML = "Vent Venligst, Denne kode er skrevet af en Amatør <br> Unlad at forlade siden indtil den er færdig <br> Har slettet options for at lortet ikke crasher, sry";
        text.id="noob";
        document.body.appendChild(text);
    }
    
}

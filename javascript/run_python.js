document.getElementById('executeButton').addEventListener('click', function() {
    fetch('/execute-python', { method: 'POST' })
        .then(response => {
            if (response.ok) {
                alert('Python script executed successfully!');
            } else {
                alert('Failed to execute Python script.');
            }
        })
        .catch(error => {
            console.error('Error executing Python script:', error);
            alert('Failed to execute Python script.');
        });
});
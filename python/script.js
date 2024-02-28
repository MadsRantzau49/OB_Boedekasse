document.addEventListener('DOMContentLoaded', () => {
  // Make a request to the server to execute Python script
  fetch('/execute-python')
      .then(response => response.text())
      .then(result => {
          console.log('Python script output:', result);
          // Do something with the result if needed
      })
      .catch(error => {
          console.error('Error executing Python script:', error);
      });
});

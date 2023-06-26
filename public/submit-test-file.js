const submitButton = document.querySelector('#submit-button');

submitButton.addEventListener('click', function() {

    fetch('/submit-user', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ name: 'John Doe', email: 'john@example.com' })
    })
    .then(response => response.text())
    .then(data => console.log(data))
    .catch(error => console.error(error));

});
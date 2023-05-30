// crear usuario
const userForm = document.querySelector("#userForm")

userForm.addEventListener('submit', async event => {
    event.preventDefault();

    const fileInput = document.querySelector('#profile_pic');
    console.log('fileInput', fileInput)

    const formData = new FormData(userForm);

    const response = await fetch('http://127.0.0.1:5000/users', {
    method: 'POST',
    body: formData,
    })
    .then(res => res.json())
    .catch(error => console.error('Error:', error))
    .then(response => {
        console.log(response)
    });

    window.location.href = "../templates/index.html";

});



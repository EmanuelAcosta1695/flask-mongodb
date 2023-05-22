// crear usuario
const userForm = document.querySelector("#userForm")

userForm.addEventListener('submit', async event => {
    event.preventDefault();

    const username = userForm['username'].value
    const password = userForm['password'].value
    const email = userForm['email'].value

    // Validar los datos ingresados por el usuario
	if (username === '' || email === '' || password === '') {
		alert('Por favor, complete todos los campos obligatorios.');
		return;
	}


    const response = await fetch('http://127.0.0.1:5000/users', {
        method: 'POST',
        headers: {
        'Content-Type': 'application/json'
        },
        body: JSON.stringify({
        username,
        password,
        email
        }),
    })
        .then(res => res.json())
        .catch(error => console.error('Error:', error))
        .then(response => {
            console.log('Exito:', response)
            window.location.href = "../templates/index.html";
        });

});



// ---------------------------------------------------------------------------------------

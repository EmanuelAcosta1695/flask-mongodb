
// Define una variable de control para verificar si el usuario está bloqueado
let isUserBlocked = false;

// Define una variable para almacenar el tiempo de bloqueo en segundos
const BLOCK_TIME_SECONDS = 300; // 1 minuto


// Recuperar el estado de isUserBlocked y blockStartTime del almacenamiento local
if (localStorage.getItem('isUserBlocked') === 'true') {
  isUserBlocked = true;
}

const storedBlockStartTime = localStorage.getItem('blockStartTime');
if (storedBlockStartTime) {
  blockStartTime = new Date(storedBlockStartTime);
}


let passwordAttempts = 0

function users() {
    const url = 'http://127.0.0.1:5000/mostrarUsers/';

    // Hacer una solicitud GET al endpoint
    fetch(url)
        .then(response => response.json())
        .then(data => {
            // Actualizar el HTML con los datos recibidos
            let html = '';

            console.log(data)

            data.forEach(user => {
                html += `
                    <tr>
                        <td>${user._id["$oid"]}</td>
                        <td>${user.username}</td>
                        <td>${user.email}</td>
                        <td><button class="btn" onclick="EliminarUser(this)"><i>Eliminar</i></button></td>
                        <td><button class="btn" onclick="recuperarIdUsuario('${encodeURIComponent(JSON.stringify(user._id))}')"><i>Editar</i></button></td>
                    </tr>
                `;  
            });
            document.getElementById('tbody').innerHTML = html;
        })
        .catch(error => console.error(error));
};



// --------------------------------------------------------------------------------------------
// Ejecuta funcion en base al html que se carga

if (document.getElementById('editPassword')) {

    cargarPasswordUsuario();

  } else if (document.title === 'Editar User') {

    cargarDatosUsuario();

  }

// ------------------------------------------------------------------------------------------
// Editar password usuario

function editarPasswordUsuario(id) {

    // Verificar si el usuario está bloqueado
    if (isUserBlocked) {

        const currentTime = new Date();
        const elapsedTimeSeconds = Math.floor((currentTime - blockStartTime) / 1000);

        if (elapsedTimeSeconds < BLOCK_TIME_SECONDS) {

            const remainingTimeSeconds = BLOCK_TIME_SECONDS - elapsedTimeSeconds;
            alert(`El usuario está bloqueado. Debes esperar ${(remainingTimeSeconds)} segundos antes de intentar nuevamente.`);
            return;

        } else {

            isUserBlocked = false; // Restablecer el bloqueo después de que haya pasado el tiempo
            localStorage.setItem('isUserBlocked', 'false'); // Actualizar el estado en el almacenamiento local
            localStorage.removeItem('blockStartTime'); // Eliminar el tiempo de bloqueo del almacenamiento local
            
        }

    } else {

        window.location.href = `editPassword.html?idUser=${id}`;

    }

}


        
function cargarPasswordUsuario() {

    const urlParams = new URLSearchParams(window.location.search);
    const id = urlParams.get('idUser');

    // recupero el <form> editPassword
    const editPassword = document.querySelector("#editPassword")
    
    // URL para obtener el usuario
    let urlUser = 'http://127.0.0.1:5000/users/';

    // URL para editar password
    let urlPassword = 'http://127.0.0.1:5000/usersPassword/';


    try {
        // llamo al get para obtner los datos del user, nesecito unicamente la password
        fetch(urlUser + id, {
            method: 'GET',
            })
            .then(response => response.json())
            .then(data => {

                console.log(data);

                editPassword.addEventListener('submit', async event => {

                    event.preventDefault();
                    
                    // recupero los valores que ingresa el user
                    const currentPassword = editPassword['currentPassword'].value
                    const newPassword = editPassword['newPassword'].value
                    const confirmNewPassword = editPassword['confirmNewPassword'].value
                    

                    // Validar los datos ingresados por el usuario
                    if (currentPassword === '' || newPassword === '' || confirmNewPassword === '') {
                        alert('Por favor, complete todos los campos.');
                        return;
                    }


                    if (newPassword == confirmNewPassword){
                        
                        // actualizo la password del user
                        const response = fetch(urlPassword + id, {
                            method: 'PUT',
                            headers: {
                            'Content-Type': 'application/json'
                            },
                            body: JSON.stringify({
                                currentPassword,
                                newPassword
                            }),
                        })
                        .then(res => res.json())
                        .catch((error) => {
                            console.error('Error:', error);

                            passwordAttempts++;
                            alert('Error.');

                            if (passwordAttempts === 3) {

                                alert('Se ha superado el límite de intentos de cambio de contraseña. Inténtelo más tarde.');

                                isUserBlocked = true; // Bloquear al usuario
                                localStorage.setItem('isUserBlocked', 'true'); // Almacenar el estado en el almacenamiento local

                                blockStartTime = new Date(); // Almacenar la fecha y hora de bloqueo
                                localStorage.setItem('blockStartTime', blockStartTime.toISOString()); // Almacenar el tiempo de bloqueo en el almacenamiento local

                                window.location.href = "../templates/index.html"; // Redirige a mostrar usuarios
                            }

                            return Promise.reject(error); // Rechazar la promesa para evitar la redirección
                            
                        })
                        .then((response) => {

                            console.log('Éxito:', response);

                            if (response['message'] == 'Password from user id: ' + id + ' was updated successfully') {
                            
                                window.location.href = '../templates/index.html'; // Redirige a mostrar usuarios
                                
                            } else {

                                return Promise.reject(new Error('Contraseña no actualizada')); // Rechazar la promesa para evitar la redirección
                            }

                        })
                        .catch(error => {

                            console.error(error);
                        });
                    }  
                });
            });        
        
    } catch (error) {
        console.error('Error en el metodo Fetch:', error);
    }

}  


// -----------------------------------------------------------------------------------------------

function recuperarIdUsuario(id) {

    const objectId = JSON.parse(decodeURIComponent(id));

    const encodedObjectId = encodeURIComponent(JSON.stringify(objectId));D

    window.location.href = `edit.html?id=${encodedObjectId}`;

}

function cargarDatosUsuario() {
    const urlParams = new URLSearchParams(window.location.search);
    const encodedObjectId = urlParams.get('id');

    const objectId = JSON.parse(decodeURIComponent(encodedObjectId));

    // -----------------------------------------------------

    let html = '';

    html += `
        <button class="btn btn-primary" type="button" onclick="editarPasswordUsuario('${objectId["$oid"]}')"><i>Editar Password</i></button>
    `;  


    document.getElementById('contentDivPass').innerHTML = html;

    // -----------------------------------------------------

    let url = 'http://127.0.0.1:5000/users/';

    try {

        fetch(url + objectId["$oid"], {
            method: 'GET',
            })
            .then(response => response.json())
            .then(data => {

                document.getElementById('username').placeholder = data.username;
                document.getElementById('email').placeholder = data.email;

                
                document.getElementById('username').value = data.username;
                document.getElementById('email').value = data.email;

            })
            .catch(error => {
                console.error(error);
            });


            // EDITAR USUARIO
            const editForm = document.querySelector("#editForm")

            editForm.addEventListener('submit', async event => {

            event.preventDefault();

            const username = editForm['username'].value
            const email = editForm['email'].value

            // Validar los datos ingresados por el usuario
            if (username === '' || email === '') {
                alert('Los campos vacios no estan permitidos.');
                return;
            }


            const response = await fetch(url + objectId["$oid"], {
                method: 'PUT',
                headers: {
                'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                username,
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

    } catch (error) {
        console.error('Error en el metodo Fetch:', error);
    }

}


// ------------------------------------------------------------------------------------------



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



async function EliminarUser(btn) {

    let fila = btn.parentNode.parentNode;


    let id = JSON.parse(fila.firstElementChild.innerHTML).$oid;

    let url = 'http://127.0.0.1:5000/users/';

    console.log(url + id);

    if (confirm("Se eliminara el contacto de la agenda con el id " + id + ". ¿Deseas continuar?")) {
        const response = await fetch(url + id, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .then(res => res.json())
        .then(response => {
            console.log('Exito:', response);
            location.reload();
        })
        .catch(error => console.error('Error:', error));
        alert('Borrado con exito');
    } else {
        alert('Cancelado');
    }

}


// ---------------------------------------------------------------------------------------

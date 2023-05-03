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
    console.log("Ejecutando cargarPasswordUsuario");
    cargarPasswordUsuario();
  } else 
  if (document.title === 'Editar User') {
    cargarDatosUsuario();
  }

// ------------------------------------------------------------------------------------------
// Editar password usuario

function editarPasswordUsuario(id) {

    window.location.href = `editPassword.html?idUser=${id}`;

}
        
function cargarPasswordUsuario() {

    const urlParams = new URLSearchParams(window.location.search);
    const id = urlParams.get('idUser');

    const editPassword = document.querySelector("#editPassword")

    
    let urlUser = 'http://127.0.0.1:5000/users/';
    let urlPassword = 'http://127.0.0.1:5000/usersPassword/';


    try {
        
        fetch(urlUser + id, {
            method: 'GET',
            })
            .then(response => response.json())
            .then(data => {

                editPassword.addEventListener('submit', async event => {

                    event.preventDefault();
                    
                    const currentPassword = editPassword['currentPassword'].value
                    const newPassword = editPassword['newPassword'].value
                    const confirmNewPassword = editPassword['confirmNewPassword'].value


                    if (currentPassword === '' || newPassword === '' || confirmNewPassword === '') {
                        alert('Por favor, complete todos los campos.');
                        return;
                    }


                    if (newPassword == confirmNewPassword){
                        
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
                            .catch(error => {
                                console.error('Error:', error)
                            })
                            .then(response => {
                                console.log('Exito:', response)

                                window.location.href = "../templates/index.html";
                            });

                    } else {
                        alert("Error de coincidencia entre la nueva password y su confirmacion");
                        return;
                    }

                });

            })
            .catch(error => {
                console.error(error);
        });
        
    } catch (error) {
        console.error('Error en el metodo Fetch:', error);
    }

}  


// -----------------------------------------------------------------------------------------------
// SI LO CAMBIO DE LUGAR NO FUNCIONA


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

    // Actualizar el HTML con los datos recibidos
    let html = '';

    // <td><button class="btn" onclick="recuperarIdUsuario('${encodeURIComponent(JSON.stringify(user._id))}')"><i>Editar</i></button></td>

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

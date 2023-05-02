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
                        <td>${JSON.stringify(user._id)}</td>
                        <td>${JSON.stringify(user.username)}</td>
                        <td>${JSON.stringify(user.email)}</td>
                        <td><button class="btn" onclick="EliminarUser(this)"><i>Eliminar</i></button></td>
                        <td><button class="btn" onclick="recuperarIdUsuario('${encodeURIComponent(JSON.stringify(user._id))}')"><i>Editar</i></button></td>
                    </tr>
                `;  
            });
            document.getElementById('tbody').innerHTML = html;
        })
        .catch(error => console.error(error));
};



// -----------------------------------------------------------------------------------------------


function recuperarIdUsuario(id) {

    const objectId = JSON.parse(decodeURIComponent(id));
    console.log(objectId); 

    const encodedObjectId = encodeURIComponent(JSON.stringify(objectId));
    console.log(encodedObjectId) 

    window.location.href = `edit.html?id=${encodedObjectId}`;
}



document.addEventListener('DOMContentLoaded', cargarDatosUsuario);
        
function cargarDatosUsuario() {
    const urlParams = new URLSearchParams(window.location.search);
    const encodedObjectId = urlParams.get('id');

    const objectId = JSON.parse(decodeURIComponent(encodedObjectId));

    const idUser = parseInt(objectId["$oid"])


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


            
            // *********************************************************
            // EDITAR USUARIO
            const editForm = document.querySelector("#editForm")

            editForm.addEventListener('submit', async event => {

            event.preventDefault();

            const username = editForm['username'].value
            const email = editForm['email'].value

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

                    setTimeout(() => {
                        window.location.href = "../templates/index.html";
                    }, 2000); 

                   
                });
            });

    } catch (error) {
        console.error('Error en el metodo Fetch:', error);
    }

}


// ------------------------------------------------------------------------------------------



const userForm = document.querySelector("#userForm")

userForm.addEventListener('submit', async event => {
    event.preventDefault();


    const username = userForm['username'].value
    const password = userForm['password'].value
    const email = userForm['email'].value


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

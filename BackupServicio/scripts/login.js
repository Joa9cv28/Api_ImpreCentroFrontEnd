document.getElementById('loginButton').addEventListener('click', function() {
    // Prevenir el comportamiento predeterminado del formulario
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    // Aquí puedes agregar la lógica para manejar el inicio de sesión
    console.log('Correo:', username);
    console.log('Contraseña:', password);



    // Por ejemplo, puedes hacer una solicitud AJAX aquí para autenticar al usuario
    $.ajax({
        url: 'http://127.0.0.1:8000/api/login',
        method: 'POST',
        contentType: 'application/json',
        data: JSON.stringify({ correo: username, password: password }),
        success: function(response) {
            // Manejar la respuesta
            console.log(response);
        },
        error: function(error) {
            // Manejar el error
            console.error(error);
        }
    });
});
$(document).ready( function(){
	
	function fetchFiles() {
		return $.ajax({
			url: 'http://127.0.0.1:8000/api/usuarios',
			method: 'GET'
		});
	}
	let files
	fetchFiles().then(data => {
		files = data.data;
		window.onload = renderMyFiles();
		function renderMyFiles() {
			let myFilesHTML = '';
			
			files.forEach((file) => {
				const { usu_id, usu_correo, usu_password, usu_nombre, usu_codigo } = file;
				
				myFilesHTML += `
      		<tr>
          	<td>${usu_id}</td>
          	<td>${usu_nombre}</td>
          	<td>${usu_correo}</td>
          	<td>${usu_codigo}</td>
            <td>3</td>
            <td>TRUE</td>
        	</tr>
          `;
			});
			document.querySelector('#tbody_id').innerHTML = myFilesHTML; //Se obtiene la referencia de una etiqueta en html basado en ID
			$('#table_id').DataTable(); //Se inicializa el DataTable (despues de cargar informacion)
		}
		// Esto funcionará correctamente
	}).catch(error => {
		console.error('Hubo un problema con la solicitud:', error);
	});
})

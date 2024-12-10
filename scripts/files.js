$(document).ready( function(){
	
	function fetchFiles() {
		return $.ajax({
			url: 'http://127.0.0.1:8000/api/archivos',
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
				const { arc_fecha, arc_id, arc_nombre, arc_ruta, arc_tiempo, usuario } = file;
				
				myFilesHTML += `
      		<tr>
          	<td>${arc_id}</td>
          	<td>${arc_nombre}</td>
          	<td>${arc_ruta}</td>
          	<td>${arc_tiempo}</td>
          	<td>${arc_fecha}</td>
          	<td>${usuario.usu_nombre}</td>
          	<td>Impreso</td>
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

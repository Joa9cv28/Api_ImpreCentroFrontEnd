// Descargar archivos archivos
async function fetchFiles() {
	try {
	  const response = await fetch('http://127.0.0.1:8000/api/archivos');
	  if (!response.ok) throw new Error('Error al obtener los archivos');
	  return await response.json();
	} catch (error) {
	  console.error('Error en fetchFiles:', error);
	}
  }
  document.addEventListener("DOMContentLoaded", async function () {
	try {
	  const filesData = await fetchFiles();
	  if (filesData) renderFiles(filesData.data);
  
	  await printDownloadedFilesNames(); // Llamar la función para imprimir los archivos descargados
	} catch (error) {
	  console.error('Error al cargar archivos en DOMContentLoaded:', error);
	}
  });
  
  // Imprimir archivos
  async function fetchDownloadedFiles() {
	try {
	  const response = await fetch('http://127.0.0.1:8000/api/download-all');
	  if (!response.ok) throw new Error('Error al obtener los archivos descargados');
	  return await response.json();
	} catch (error) {
	  console.error('Error en fetchDownloadedFiles:', error);
	}
  }
  async function printDownloadedFilesNames() {
	try {
	  const downloadedData = await fetchDownloadedFiles();
	  if (!downloadedData || !downloadedData.files) {
		console.error("No se encontraron archivos descargados.");
		return;
	  }
  
	  const fileContainer = document.querySelector('#tbody_id');
	  if (!fileContainer) {
		console.error("No se encontró el contenedor '#tbody_id' en el HTML.");
		return;
	  }
  
	  // Crear un bloque de HTML con los nombres de los archivos
	  let filesHTML = '';
	  downloadedData.files.forEach(fileName => {
  
		filesHTML += `
		  <tr>
			<td>1</td>
			<td>${fileName}</td>
			<td>D:\joani\batimovil.gcode</td>
			<td>156</td>
			<td>04/02/2025</td>
			<td>1</td>
			<td>En espera</td>
		  </tr>
		`;
	  });
  
	  // Insertar los nombres de los archivos dentro del contenedor
	  fileContainer.innerHTML += filesHTML;
	} catch (error) {
	  console.error("Error al imprimir los nombres de los archivos descargados:", error);
	}
  }

/*
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
*/
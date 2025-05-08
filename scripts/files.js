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
	  let countPrintTime = 0; // BORRAR - priniting time
	  downloadedData.files.forEach(fileName => {
		countPrintTime += hashNumber(fileName);

		filesHTML += `
		  <tr>
			<td><a href="documents/${fileName}" download>${fileName.split('/')[1]}</a></td>
			<td>${fileName}</td>
			<td>${hashNumber(fileName)}</td>
			<td>${calcPrintingDate(countPrintTime)}</td>
			<td>${fileName.split('/')[0]}</td>
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

  // --- BORRAR ---
  // Función para generar un número entre el 15 y el 180 con su hash
  function hashNumber(cadena, min = 15, max = 320) {
    let hash = 0;
    for (let i = 0; i < cadena.length; i++) {
        hash = cadena.charCodeAt(i) + ((hash << 5) - hash);
        hash = hash & hash; // Convertir a 32 bits
    }

    const rango = max - min + 1;
    const numeroPositivo = Math.abs(hash);
    const resultado = (numeroPositivo % rango) + min;

    return resultado;
  }

  // --- Borrar ---
  // Función para calcular la fecha de impresión según los minutos de las impresiones anteriores
  function calcPrintingDate(minutos) {
	const minutosPorDia = 360;
	const diasASumar = Math.floor(minutos / minutosPorDia) + 1;

	const fecha = new Date();
	fecha.setDate(fecha.getDate() + diasASumar);

	const dia = String(fecha.getDate()).padStart(2, '0');
	const mes = String(fecha.getMonth() + 1).padStart(2, '0'); // Los meses van de 0 a 11
	const anio = fecha.getFullYear();

	return `${dia}/${mes}/${anio}`;
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
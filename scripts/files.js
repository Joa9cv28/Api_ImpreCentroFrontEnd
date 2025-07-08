$(document).ready( function(){
	document.querySelector('.user-name').textContent = localStorage.getItem("user_name");
  });

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
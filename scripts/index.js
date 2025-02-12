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

    const fileContainer = document.querySelector('.js-show-files');
    if (!fileContainer) {
      console.error("No se encontró el contenedor '.js-show-files' en el HTML.");
      return;
    }

    // Crear un bloque de HTML con los nombres de los archivos
    let filesHTML = '';
    downloadedData.files.forEach(fileName => {

      filesHTML += `
      <div class="file">
          <a href="" class="file-info">
            <h2 class="file__name">${fileName}</h2>
            <p class="file__status">En espera</p>
            <img src="images/modelado-3d-3.png" alt="" class="file-image">
            <h2 class="file__date">Fecha: 25/01/2025</h2>
          </a>
        </div>
      `;
    });

    // Insertar los nombres de los archivos dentro del contenedor
    fileContainer.innerHTML += filesHTML;
  } catch (error) {
    console.error("Error al imprimir los nombres de los archivos descargados:", error);
  }
}

// Subir archivos
async function uploadFile(file) {
  const formData = new FormData();
  formData.append("file", file);

  try {
    const response = await fetch('http://127.0.0.1:8000/api/upload', {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) throw new Error('Error al subir el archivo');

    return await response.json();
  } catch (error) {
    console.error('Error en uploadFile:', error);
    throw error;
  }
}
document.querySelector('.upload-form')?.addEventListener('submit', async function (e) {  
  e.preventDefault();

  const fileInput = document.querySelector('#fileInput'); 
  if (!fileInput || fileInput.files.length === 0) {
    alert('Por favor, selecciona un archivo para subir.');
    return;
  }

  const file = fileInput.files[0];

  try {
    const response = await uploadFile(file);
    alert(response.message || 'Archivo subido correctamente.');

    const updatedFilesData = await fetchFiles();
    if (updatedFilesData) renderFiles(updatedFilesData.data);
  } catch (error) {
    console.error('Error al subir el archivo:', error);
    alert('Hubo un problema al subir el archivo.');
  }
});


// Formato anterior para cargar archivos
/*
function renderFiles(files) {
  let myFilesHTML = '';

  files.forEach((file) => {
    const { arc_fecha, arc_id, arc_nombre, arc_ruta, arc_tiempo } = file;

    let imagen = 'modelado-3d-1';
    if (arc_tiempo > 120) imagen = 'modelado-3d-3';
    else if (arc_tiempo > 60) imagen = 'modelado-3d-2';

    myFilesHTML += `
      <div class="file js-file-${arc_id}">
        <a href="http://127.0.0.1:8000/api/static-files/${arc_nombre}" class="file-info" download>
          <h2 class="file__name">${arc_nombre}</h2>
          <p class="file__status">Descargado</p>
          <img src="images/${imagen}.png" alt="" class="file-image">
          <h2 class="file__date">Fecha: ${arc_fecha}</h2>
        </a>
      </div>
    `;
  });

  const fileContainer = document.querySelector('.js-show-files');
  if (fileContainer) {
    fileContainer.innerHTML = myFilesHTML;
  } else {
    console.error("No se encontró el contenedor '.js-show-files' en el HTML.");
  }
}
*/

// Imprimir en consola los archivos descargados
/*
document.addEventListener("DOMContentLoaded", async function () {
  
  try {
    const filesData = await fetchFiles();
    if (filesData) renderFiles(filesData.data);

    const downloadedData = await fetchDownloadedFiles();
    if (downloadedData) {
      alert(downloadedData.message);
      console.log('Archivos descargados:', downloadedData.files);
    }
  } catch (error) {
    console.error('Error al cargar archivos en DOMContentLoaded:', error);
  }
});
*/


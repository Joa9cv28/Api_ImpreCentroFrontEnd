document.addEventListener("DOMContentLoaded", async function () {
  try {
    // const filesData = await fetchFiles();
    // if (filesData) renderFiles(filesData.data);
    await checkToken(); // Verificar el token al cargar la página
    await printDownloadedFilesNames(); // Llamar la función para imprimir los archivos descargados
  } catch (error) {
    console.error('Error al cargar archivos en DOMContentLoaded:', error);
  }
});

async function checkToken() {
  const token = localStorage.getItem('access_token');
  if (!token) {
    alert('No tienes acceso a esta página. Por favor, inicia sesión.');
    window.location.href = 'login.html';
  } else {
    const isValid = await checkTokenBack(token);
    if (!isValid) {
      alert('Token inválido. Por favor, inicia sesión nuevamente.');
      localStorage.removeItem('access_token');
      localStorage.removeItem('user_data');
      window.location.href = 'login.html';
    } else {
      console.log('Token válido:', token);
    }
  }
}

async function checkTokenBack(token) {
  try {
    const response = await fetch('http://127.0.0.1:8000/api/validate-token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ token })
    });

    if (!response.ok) {
      throw new Error('Error al validar el token');
    }

    const data = await response.json();

    if (data.valid && data.valid === true) {
      console.log('Token válido:', data );
      localStorage.setItem("user_name", data['user']['UserAttributes'][2].Value);
      document.querySelector('.user-name').textContent = localStorage.getItem("user_name");
      localStorage.setItem('user_data', JSON.stringify(data.user));
      return true;
    } else {
      console.log('Token inválido:', data.valid);
      return false;
    }

  } catch (error) {
    console.error('Error en checkTokenBack:', error);
    return false;
  }
}

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
    let countPrintTime = 0; // BORRAR - priniting time
    downloadedData.files.forEach(fileName => {
      countPrintTime += hashNumber(fileName);

      filesHTML += `
      <div class="file">
          <a href="documents/${fileName}" class="file-info" download>
            <h2 class="file__name">${fileName.split('/')[1]}</h2>
            <p class="">Usuario: ${fileName.split('/')[0]}</p>
            <p class="file__status">En espera</p>
            <img src="images/modelado-3d-3.png" alt="" class="file-image">
            <h2 class="file__date">Fecha: ${calcPrintingDate(countPrintTime)}</h2>
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

    // const updatedFilesData = await fetchFiles();
    // if (updatedFilesData) renderFiles(updatedFilesData.data);
  } catch (error) {
    console.error('Error al subir el archivo:', error);
    alert('Hubo un problema al subir el archivo.');
  }
});

// Funcion para salir de la sesion
document.querySelector('.js-logout')?.addEventListener('click', function (e) {
  e.preventDefault();
  localStorage.removeItem('access_token');
  localStorage.removeItem('user_data');
  window.location.href = 'login.html';
});


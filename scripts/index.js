// Descargar archivos archivos
// async function fetchFiles() {
//   return
//   try {
//     const response = await fetch('http://127.0.0.1:8000/api/archivos');
//     console.log(response);
//     if (!response.ok) throw new Error('Error al obtener los archivos');
//     return await response.json();
//   } catch (error) {
//     console.error('Error en fetchFiles:', error);
//   }
// }
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

function getStudentCodeFromToken() {
  const token = localStorage.getItem("access_token");
  if (!token) return null;
  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    return payload["cognito:username"] || payload["username"];  // según cómo venga en Cognito
  } catch (e) {
    console.error("Error decodificando el token:", e);
    return null;
  }
}

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
  const student_code = getStudentCodeFromToken();
  if (!student_code) {
    console.error("No se pudo obtener el student_code.");
    return;
  }

  try {
    const response = await fetch(`http://127.0.0.1:8000/api/download-all/${student_code}`);
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
    downloadedData.files
    .filter(fileName => !fileName.endsWith("/")) // 👈 filtrar carpetas
    .forEach(fileName => {
      countPrintTime += hashNumber(fileName);

      filesHTML += `
      <div class="file">
          <a href="documents/${fileName}" class="file-info" download>
            <h2 class="file__name">${fileName.split('/')[1]}</h2>
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
	const diasASumar = Math.floor(minutos / minutosPorDia) + 3;

	const fecha = new Date();
	fecha.setDate(fecha.getDate() + diasASumar);

	const dia = String(fecha.getDate()).padStart(2, '0');
	const mes = String(fecha.getMonth() + 1).padStart(2, '0'); // Los meses van de 0 a 11
	const anio = fecha.getFullYear();

	return `${dia}/${mes}/${anio}`;
  }

// Subir archivos
async function uploadFile(file) {
  const student_code = getStudentCodeFromToken();
  if (!student_code) {
    alert("No se encontró el código del estudiante. Inicia sesión nuevamente.");
    return;
  }

  const formData = new FormData();
  formData.append("file", file);

  try {
    const response = await fetch(`http://127.0.0.1:8000/api/upload/${student_code}`, {
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

// Funcion para salir de la sesion
document.querySelector('.js-logout')?.addEventListener('click', function (e) {
  e.preventDefault();
  localStorage.removeItem('access_token');
  localStorage.removeItem('user_data');
  window.location.href = 'login.html';
});


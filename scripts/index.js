function fetchFiles() {
  return $.ajax({
    url: 'http://127.0.0.1:8000/api/archivos',
    method: 'GET'
  });
}

function uploadFile(file) {
  const formData = new FormData();
  formData.append("file", file);

  return fetch('http://127.0.0.1:8000/api/upload', {
    method: 'POST',
    body: formData,
  }).then(response => {
    if (!response.ok) {
      throw new Error('Error al subir el archivo');
    }
    return response.json();
  });
}


/*

let files;
fetchFiles().then(data => {
  files = data.data;
  window.onload = renderMyFiles();

  function renderMyFiles() {
    let myFilesHTML = '';

    files.forEach((file) => {
      const { arc_fecha, arc_id, arc_nombre, arc_ruta, arc_tiempo } = file;

      let imagen = 'modelado-3d-1';

      if (arc_tiempo > 120) imagen = 'modelado-3d-3';
      else if (arc_tiempo > 60) imagen = 'modelado-3d-2';

      myFilesHTML += `
      <div class="file js-file-${arc_id}">
        <a href="" class="file-info">
          <h2 class="file__name">${arc_nombre}</h2>
          <p class="file__status">En espera</p>
          <img src="images/${imagen}.png" alt="" class="file-image">
          <h2 class="file__date">Fecha: ${arc_fecha}</h2>
        </a>
      </div>
      `;
    });
    document.querySelector('.js-show-files').innerHTML = myFilesHTML;
  }
}).catch(error => {
  console.error('Hubo un problema con la solicitud:', error);
});

*/



// Manejo del formulario para subir archivos
document.querySelector('.upload-form').addEventListener('submit', function (e) {  
  
  e.preventDefault();

  const fileInput = document.querySelector('#fileInput'); // ID del input de archivo

  if (fileInput.files.length === 0) {
    alert('Por favor, selecciona un archivo para subir.');
    return;
  }

  const file = fileInput.files[0];

  uploadFile(file)
    .then(response => {
      alert(response.message || 'Archivo subido correctamente.');
      return fetchFiles(); // Recargar la lista de archivos después de subir
    })
    .then(data => {
      let files = data.data;
      // renderMyFiles(); // Renderizar los archivos actualizados
    })
    .catch(error => {
      // console.error('Error al subir el archivo:', error);
      // alert('Hubo un problema al subir el archivo.');
    });
    
});

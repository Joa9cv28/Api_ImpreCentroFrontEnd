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
  // Esto funcionará correctamente
}).catch(error => {
  console.error('Hubo un problema con la solicitud:', error);
});

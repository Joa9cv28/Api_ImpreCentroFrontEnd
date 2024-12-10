function enviarPOST(url, objeto) {
  fetch(url, {
      method: "POST",
      headers: {
          "Content-Type": "application/json"
      },
      body: JSON.stringify(objeto) // Convertimos el objeto a JSON y lo enviamos
  })
  .then(response => response.json()) // Analizamos la respuesta como JSON
  .then(data => {
      console.log("Respuesta POST:", data);
  })
  .catch(error => {
      console.error("Error en POST:", error);
  });
};

// Método para enviar los datos usando fetch (PUT)
function enviarPUT(url, objeto) {
  fetch(url, {
      method: "PUT",
      headers: {
          "Content-Type": "application/json"
      },
      body: JSON.stringify(objeto) // Convertimos el objeto a JSON y lo enviamos
  })
  .then(response => response.json()) // Analizamos la respuesta como JSON
  .then(data => {
      console.log("Respuesta PUT:", data);
  })
  .catch(error => {
      console.error("Error en PUT:", error);
  });
};

export { enviarPUT, enviarPOST};
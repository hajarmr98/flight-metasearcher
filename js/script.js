import {comprobarDatos, recolectarDatos, pintarVuelo} from './functions.js'

document.getElementsByTagName('form')[0].addEventListener('submit', (e) => {
    e.preventDefault();
    console.log(e)
    let vuelo = recolectarDatos()
    if (!comprobarDatos(vuelo)) {
        alert('Rellena los datos')
    } else {
        new FormData(document.getElementsByTagName('form')[0])
        // buscadorAvion(vuelo)
    }
})

document.addEventListener("formdata", event => {
    const request = new XMLHttpRequest();
    request.open("GET", `http://127.0.0.1:5500/flights/from/${origen}/to/${destino}/date_1/${ida}/adults/${adultos}/date_2/${vuelta}/kids/${ninios}/babies/${bebes}`);
    request.send(vuelo);
    // get the response
    request.onload = function() {
      const jsonResponse = JSON.parse(this.response);
      jsonResponse.status
    };
});

// let buscadorAvion = async({ origen, destino, ida, vuelta, adultos, ninios, bebes }) => {
//     let res = await fetch(`http://127.0.0.1:5500/flights/from/${origen}/to/${destino}/date_1/${ida}/adults/${adultos}/date_2/${vuelta}/kids/${ninios}/babies/${bebes}`)
//     let datos = await res.json()
//     pintarVuelo(datos)
// }

import {buscadorAvion, comprobarDatos, recolectarDatos, pintarVuelo} from './functions.js'

document.getElementsByTagName('form')[0].addEventListener('submit', (e) => {
    e.preventDefault();
    let vuelo = recolectarDatos()

    if (!comprobarDatos(vuelo)) {
        alert('Rellena los datos')
    } else {
        buscadorAvion(vuelo)
    }
})

let buscadorAvion = async({ origen, destino, ida, vuelta, adultos, ninios, bebes }) => {
    let res = await fetch(`http://127.0.0.1:5500/flights/from/${origen}/to/${destino}/date_1/${ida}/adults/${adultos}/date_2/${vuelta}/kids/${ninios}/babies/${bebes}`)
    let datos = await res.json()
}



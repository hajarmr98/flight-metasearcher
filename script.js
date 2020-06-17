document.getElementsByTagName('form')[0].addEventListener('submit', (e) => {
    e.preventDefault();
    let vuelo = recolectarDatos()

    if (!comprobarDatos(vuelo)) {
        alert('Rellena los datos')
        console.log("coge el if")
    } else {
        buscadorAvion(vuelo)
        console.log("va")
    }
})

let buscadorAvion = async({ origen, destino, ida, vuelta, adultos, ninios, bebes }) => {
    let res = await fetch(`http://127.0.0.1:5500/flights/from/${origen}/to/${destino}/date_1/${ida}/adults/${adultos}/date_2/${vuelta}/kids/${ninios}/babies/${bebes}`)
    let datos = await res.json()
    pintarVuelo(datos)
}

let comprobarDatos = ({ origen, destino, ida, vuelta, adultos }) => {
    if (origen === '' || destino === '' || ida === '' || vuelta === '' || adultos === '') {
        return false
    } else {
        return true
    }
}

let recolectarDatos = () => {
    return {
        origen: document.getElementById('vuelo-origen').value,
        destino: document.getElementById('vuelo-vuelta').value,
        ida: document.getElementById('fechaida').value,
        vuelta: document.getElementById('fechavuelta').value,
        adultos: document.getElementById('adultos').value,
        ninios: document.getElementById('ninios').value,
        bebes: document.getElementById('bebes').value
    }
}

// Origen y destino son otro objeto

let pintarVuelo = ({origen, destino, horarioI, horarioV,precio}) => {
    let cajaVuelo = document.createElement('div')
    let cajaIda = document.createElement('article')
    let cajaVuelta = document.createElement('article')
    let cajaDuracion = document.createElement('article')
    let cajaPrecio = document.createElement('article')

    let aeropuertoIda = document.createElement('p')
    aeropuertoIda.innerText = origen.aeropuerto
    let origenIda = document.createElement('p')
    let horaIda = document.createElement('p')

    let aeropuertoVuelta = document.createElement('p')
    let origenVuelta = document.createElement('p')
    let horaVuelta = document.createElement('p')

}
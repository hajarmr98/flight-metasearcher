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

let pintarVuelo = ({origin,destiny,price}) => {
    const {aeropuertoSalida, origen, horarioSalida } = origin
    const {aeropuertoLlegada, destino, horarioLLegada} = origin
    console.log('Empieza pintado???')
    let $$main = document.getElementsByTagName('main')[0]
    let cajaVuelo = document.createElement('div')
    let cajaIda = document.createElement('article')
    let cajaVuelta = document.createElement('article')
    let cajaDuracion = document.createElement('article')
    let cajaPrecio = document.createElement('article')

    let aeropuertoIda = document.createElement('p')
    aeropuertoIda.innerText = aeropuertoSalida
    let origenIda = document.createElement('p')
    origenIda.innerText = origen
    let horaIda = document.createElement('p')
    horaIda.innerText = horarioSalida

    let aeropuertoDestino = document.createElement('p')
    aeropuertoDestino.innerText = aeropuertoLlegada
    let Destino = document.createElement('p')
    Destino.innerText = destino
    let horaDestino = document.createElement('p')
    horaDestino.innerText = horarioLLegada

    
    let duracion = document.createElement('p')
    duracion.innerText = '1 hora'

    let precio = document.createElement('p')
    precio.innerText = 1500


    cajaIda.appendChild(aeropuertoIda)
    cajaIda.appendChild(origenIda)
    cajaIda.appendChild(horaIda)

    cajaVuelta.appendChild(aeropuertoDestino)
    cajaVuelta.appendChild(Destino)
    cajaVuelta.appendChild(horaDestino)

    cajaDuracion.appendChild(duracion)

    cajaPrecio.appendChild(precio)


    cajaVuelo.appendChild(cajaIda)
    cajaVuelo.appendChild(cajaVuelta)
    cajaVuelo.appendChild(cajaDuracion)
    cajaVuelo.appendChild(cajaPrecio)

    $$main.appendChild(cajaVuelo)

}

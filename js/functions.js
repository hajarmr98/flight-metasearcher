export let comprobarDatos = ({ origen, destino, ida, vuelta, adultos }) => {
    if (origen === '' || destino === '' || ida === '' || vuelta === '' || adultos === '') {
        return false
    } else {
        return true
    }
}


export let recolectarDatos = () => {
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

export let pintarVuelo = ({origin,destiny,price}) => {
    const {aeropuertoSalida, origen, horarioSalida, fechaSalida } = origin
    const {aeropuertoLlegada, destino, horarioLLegada, fechaLlegada} = destiny

    let $$main = document.getElementsByTagName('main')[0]
    let cajaVuelo = document.createElement('div')
    cajaVuelo.setAttribute('class', 'caja-vuelo')
    let cajaIda = document.createElement('article')
    cajaIda.setAttribute('class', 'caja-ida')
    let cajaVuelta = document.createElement('article')
    cajaVuelta.setAttribute('class', 'caja-vuelta')
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
    precio.innerText = price


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

// module.exports = { comprobarDatos, recolectarDatos, pintarVuelo }
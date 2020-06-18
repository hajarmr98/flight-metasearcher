document.getElementsByTagName('form')[0].addEventListener('submit', (e) => {
    e.preventDefault();
    let vuelo = recolectarDatos()

    if (!comprobarDatos(vuelo)) {
        alert('Rellena los datos')
    } else {
        new FormData(document.getElementsByTagName('form')[0])
        //buscadorAvion(vuelo)
    }
})



/*let buscadorAvion = async({ origen, destino, ida, vuelta, adultos, ninios, bebes }) => {
    let res = await fetch(`http://127.0.0.1:5500/flights/from/${origen}/to/${destino}/date_1/${ida}/adults/${adultos}/date_2/${vuelta}/kids/${ninios}/babies/${bebes}`)
    let datos = await res.json()
    pintarVuelo(datos)
}*/

    document.addEventListener("formdata", event => {

        let vuelo = {
            ida : event.target[0].value,
        vuelta : event.target[1].value,
        origen : event.target[2].value,
        destino : event.target[3].value,
        adultos : event.target[4].value,
        ninios : event.target[5].value,
        bebes : event.target[6].value,

    }
    const request = new XMLHttpRequest();
    request.open("GET", `http://127.0.0.1:5500/flights/from/${vuelo.origen}/to/${vuelo.destino}/date_1/${vuelo.ida}/adults/${vuelo.adultos}/date_2/${vuelo.vuelta}/kids/${vuelo.ninios}/babies/${vuelo.bebes}`);
    request.send(vuelo);
    // get the response
    request.onload = function() {
      const jsonResponse = JSON.parse(this.response);
      pintarVuelo(jsonResponse.datosIda)
      pintarVuelo(jsonResponse.datosVuelta)
    };
  });

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

let pintarVuelo = ({origin,destiny,price}) => {

    const { aeropuertoSalida, origen, horarioSalida, fechaSalida } = origin
    const { aeropuertoLlegada, destino, horarioLlegada, fechaLlegada } = destiny
    
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
    let salidaFecha = document.createElement('p')
    salidaFecha.innerText = fechaSalida
    let horaIda = document.createElement('p')
    horaIda.innerText = horarioSalida

    let aeropuertoDestino = document.createElement('p')
    aeropuertoDestino.innerText = aeropuertoLlegada
    let Destino = document.createElement('p')
    Destino.innerText = destino
    let llegadaFecha = document.createElement('p')
    llegadaFecha.innerText = fechaLlegada
    let horaDestino = document.createElement('p')
    horaDestino.innerText = horarioLlegada


    let duracion = document.createElement('p')
    duracion.innerText = '1 hora'

    let precio = document.createElement('p')
    precio.innerText = price


    cajaIda.appendChild(aeropuertoIda)
    cajaIda.appendChild(origenIda)
    cajaIda.appendChild(salidaFecha)
    cajaIda.appendChild(horaIda)
    cajaVuelta.appendChild(aeropuertoDestino)
    cajaVuelta.appendChild(Destino)
    cajaVuelta.appendChild(llegadaFecha)
    cajaVuelta.appendChild(horaDestino)
    cajaDuracion.appendChild(duracion)
    cajaPrecio.appendChild(precio)
    cajaVuelo.appendChild(cajaIda)
    cajaVuelo.appendChild(cajaVuelta)
    cajaVuelo.appendChild(cajaDuracion)
    cajaVuelo.appendChild(cajaPrecio)
    $$main.appendChild(cajaVuelo)
}
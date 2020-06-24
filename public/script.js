document.getElementsByTagName('form')[0].addEventListener('submit', (e) => {
    e.preventDefault();
    let vuelo = recolectarDatos()

    if (!comprobarDatos(vuelo)) {
        alert('Rellena los datos')
    } else {
        // new FormData(document.getElementsByTagName('form')[0])
        buscadorAvion(vuelo)
    }
})

let buscadorAvion = async({ origen, destino, ida, vuelta, adultos, ninios, edad }) => {
let res = await fetch(`http://localhost:2424/flights/from/${origen}/to/${destino}/date_1/${ida}/adults/${adultos}/date_2/${vuelta}/kids/${ninios}/age/${edad}`)
let datos = await res.json()
borrarVuelos();
if(datos.valid){
    pintarVuelo(datos.datosIda)
    pintarVuelo(datos.datosVuelta)
}else {
    alert('No existen vuelos de esas caracteristicas')
}
}



document.getElementsByClassName('icon')[0].addEventListener('click', () => {
    console.log()
    console.log()
    let valueAntiguo = Number(document.getElementById('ninios').value)
    valueNuevo = String(valueAntiguo - 1)
    if (valueAntiguo > 0) {
        document.getElementById('ninios').value = valueNuevo
    }
    if (Number(document.getElementById('ninios').value) === 0) {
        document.getElementsByClassName('edad')[0].style.display = 'none'
        document.getElementsByClassName('edad')[1].style.display = 'none'
    }
})

document.getElementsByClassName('icon')[1].addEventListener('click', () => {
    let valueAntiguo = Number(document.getElementById('ninios').value)
    valueNuevo = String(valueAntiguo + 1)
    document.getElementById('ninios').value = valueNuevo
    if (Number(document.getElementById('ninios').value) > 0) {
        document.getElementsByClassName('edad')[0].style.display = 'block'
        document.getElementsByClassName('edad')[1].style.display = 'block'
    }
})




// document.addEventListener("formdata", event => {

//     let vuelo = {
//         ida: event.target[0].value,
//         vuelta: event.target[1].value,
//         origen: event.target[2].value,
//         destino: event.target[3].value,
//         adultos: event.target[4].value,
//         ninios: event.target[5].value,
//         bebes: event.target[6].value,

//     }

//     const request = new XMLHttpRequest();
//     request.open("GET", `http://127.0.0.1:5500/flights/from/${vuelo.origen}/to/${vuelo.destino}/date_1/${vuelo.ida}/adults/${vuelo.adultos}/date_2/${vuelo.vuelta}/kids/${vuelo.ninios}/babies/${vuelo.bebes}`);
//     request.send(vuelo);
//     // get the response
//     request.onload = function() {
//         const jsonResponse = JSON.parse(this.response);
//         pintarVuelo(jsonResponse.datosIda)
//         pintarVuelo(jsonResponse.datosVuelta)
//     };
// });


let comprobarDatos = ({ origen, destino, ida, vuelta, adultos }) => {
    if (origen === '' || destino === '' || ida === '' || vuelta === '' || adultos === '') {
        return false
    } else {
        return true
    }
}

let recolectarDatos = () => {
    return {
        origen: document.getElementById('vuelo-origen').value.charAt(0).toUpperCase() + document.getElementById('vuelo-origen').value.slice(1),
        destino: document.getElementById('vuelo-vuelta').value.charAt(0).toUpperCase() + document.getElementById('vuelo-vuelta').value.slice(1),
        ida: document.getElementById('fechaida').value.split('-').join(''),
        vuelta: document.getElementById('fechavuelta').value.split('-').join(''),
        adultos: document.getElementById('adultos').value,
        ninios: document.getElementById('ninios').value,
        edad: document.getElementById('edadNinio').value
    }
}


let borrarVuelos = () => {
    let results = Array.from(document.getElementsByClassName("caja-vuelo"));
    if (results.length) {
        results.map(el => el.parentNode.removeChild(el))
    }
}
let pintarVuelo = ({ title, empresa, origin, destiny, price,duration }) => {
    
    const { aeropuertoSalida, origen, horarioSalida, fechaSalida } = origin
    const { aeropuertoLlegada, destino, horarioLlegada} = destiny
    
    let $$main = document.getElementsByTagName('main')[0]
    let cajaVuelo = document.createElement('div')
    cajaVuelo.setAttribute('class', 'caja-vuelo')
    let cajaIda = document.createElement('article')
    cajaIda.setAttribute('class', 'caja-ida')
    let cajaDuracion = document.createElement('article')
    let cajaPrecio = document.createElement('article')
    cajaPrecio.setAttribute('class', 'caja-precio')
    let cajaVuelta = document.createElement('article')
    cajaVuelta.setAttribute('class', 'caja-vuelta')


    let salidaTitle = document.createElement('h2')
    salidaTitle.innerText = title
    salidaTitle.setAttribute('class', 'title')

    let aeropuertoIda = document.createElement('p')
    aeropuertoIda.innerText = aeropuertoSalida
    aeropuertoIda.setAttribute('class', 'aeropuerto')
    let origenIda = document.createElement('p')
    origenIda.innerText = origen
    origenIda.setAttribute('class', 'ciudad')
    let salidaFecha = document.createElement('p')
    salidaFecha.innerText = fechaSalida
    salidaFecha.setAttribute('class', 'fecha')
    let horaIda = document.createElement('p')
    horaIda.innerText = horarioSalida
    horaIda.setAttribute('class', 'hora')

    let image = document.createElement('img')
    if (title === 'Vuelo de ida') {
        image.setAttribute('src', 'img/plane.png')
    } else {
        image.setAttribute('src', 'img/plane2.png')
    }
    image.setAttribute('class', 'imagen')
    let duracion = document.createElement('p')
    duracion.innerText = duration
    duracion.setAttribute('class', 'duracion')

    let aeropuertoDestino = document.createElement('p')
    aeropuertoDestino.innerText = aeropuertoLlegada
    aeropuertoDestino.setAttribute('class', 'aeropuerto')
    let Destino = document.createElement('p')
    Destino.innerText = destino
    Destino.setAttribute('class', 'ciudad')
    let horaDestino = document.createElement('p')
    horaDestino.innerText = horarioLlegada
    horaDestino.setAttribute('class', 'hora')



    let precio = document.createElement('p')
    precio.innerText = price
    let empresaVuelo = document.createElement('p')
    empresaVuelo.innerText = empresa
    precio.setAttribute('class', 'precio')

    cajaVuelo.appendChild(salidaTitle)
    cajaIda.appendChild(aeropuertoIda)
    cajaIda.appendChild(origenIda)
    cajaIda.appendChild(salidaFecha)
    cajaIda.appendChild(horaIda)
    cajaDuracion.appendChild(image)
    cajaDuracion.appendChild(duracion)
    cajaVuelta.appendChild(aeropuertoDestino)
    cajaVuelta.appendChild(Destino)
    cajaVuelta.appendChild(horaDestino)
    cajaPrecio.appendChild(precio)
    cajaPrecio.appendChild(empresaVuelo)
    cajaVuelo.appendChild(cajaIda)
    cajaVuelo.appendChild(cajaDuracion)
    cajaVuelo.appendChild(cajaVuelta)
    cajaVuelo.appendChild(cajaPrecio)
    $$main.appendChild(cajaVuelo)
}

let comprobarDatos = ({ origen, destino, ida, vuelta, adultos }) => {
    if (origen === '' || destino === '' || ida === '' || vuelta === '' || adultos === '') {
        return false
    } else {
        return true
    }
}

let recolectarDatos = () => {
    return {
        origen: document.getElementById('vuelo-origen').value.charAt(0).toUpperCase() + document.getElementById('vuelo-origen').value.slice(1).toLowerCase(),
        destino: document.getElementById('vuelo-vuelta').value.charAt(0).toUpperCase() + document.getElementById('vuelo-vuelta').value.slice(1).toLowerCase(),
        ida: document.getElementById('fechaida').value,
        vuelta: document.getElementById('fechavuelta').value,
        adultos: document.getElementById('adultos').value,
        ninios: document.getElementById('ninios').value,
        bebes: document.getElementById('bebes').value
    }
}

let pintarLoader = () => {
    let caja = document.createElement('div')
    let caja1 = document.createElement('div')
    let $p = document.createElement('p')
    caja1.style.width = '70%'
    caja1.style.margin = '0 auto'
    caja1.style.padding = '30px, 30px'
    caja1.style.textAlign = 'center'
    caja1.style.height = '200px'
    caja1.style.backgroundColor = 'rgba(0,0,0,.5)'
    caja.className = 'loader'
    caja1.className = 'cargaI'
    caja.animate([
        { transform: 'rotate(0deg)' },
        { transform: 'rotate(360deg)' }
    ],{
        duration: 2000,
        iterations: Infinity
    })
    caja1.appendChild(caja)
    caja1.appendChild($p)
    document.getElementsByTagName('main')[0].appendChild(caja1)
}

let borrarVuelos = () => {
    let results = Array.from(document.getElementsByClassName("caja-vuelo"));
    if (results.length) {
        results.map(el => el.parentNode.removeChild(el))
    }
}

let pintarVuelo = ({ title, empresa, origin, destiny, price,duration },url) => {
     
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
    if(url.length === 1){
        cajaVuelo.addEventListener('click', (e) => {
            window.open(url[0],'_blank')
        })
    } else {
        if(title === 'Vuelo de Ida'){
            cajaVuelo.addEventListener('click', (e) => {
                window.open(url[0],'_blank')
            })
        } else {
            cajaVuelo.addEventListener('click', (e) => {
                window.open(url[1],'_blank')
            })
        }
    }
    $$main.appendChild(cajaVuelo)
}

let pintarAlert = () => {
    let $main = document.getElementsByTagName('main')[0]
    let alert = document.createElement('section');
    alert.setAttribute('class','alert')
    let $p = document.createElement('p')
    $p.innerText = 'No se han encontrado vuelos con esas características'
    let btn = document.createElement('button')
    let $img = document.createElement('img')
    $img.setAttribute('src','img/sadcat.gif')
    btn.innerText = 'Volver a buscar'
    btn.addEventListener('click', () => {
       location.reload()
    })
    alert.appendChild($p)
    alert.appendChild($img)
    alert.appendChild(btn)
    $main.appendChild(alert)

}

let pintarError = () => {
    let $main = document.getElementsByTagName('main')[0]
    let alert = document.createElement('section');
    alert.setAttribute('class','alert')
    let $p = document.createElement('p')
    $p.innerText = 'El tiempo de espera ha sido superado'
    let btn = document.createElement('button')
    let $img = document.createElement('img')
    $img.setAttribute('src','img/conex.gif')
    btn.innerText = 'Volver a buscar'
    btn.addEventListener('click', () => {
       location.reload()
    })
    alert.appendChild($p)
    alert.appendChild($img)
    alert.appendChild(btn)
    $main.appendChild(alert)

}

let buscadorAvion = async({ origen, destino, ida, vuelta, adultos, ninios, bebes }) => {
    let res = await fetch(`/flights/from/${origen}/to/${destino}/date_1/${ida}/adults/${adultos}/date_2/${vuelta}/kids/${ninios}/age/${bebes}`)
    let datos = await res.json()
    console.log(datos)
    borrarVuelos();
    if(datos.val){
        document.getElementsByClassName('cargaI')[0].remove()
        pintarVuelo(datos.objetoIda,datos.url)
        pintarVuelo(datos.objetoVuelta,datos.url)
    }else {
        document.getElementsByClassName('cargaI')[0].remove()
        pintarAlert()
    }
}

document.getElementsByTagName('form')[0].addEventListener('submit', (e) => {
    e.preventDefault();
    let vuelo = recolectarDatos()

    if (!comprobarDatos(vuelo)) {
        alert('Rellena todos los datos')
    } else {

        pintarLoader()
        setTimeout(buscadorAvion(vuelo),120000)
        if(document.getElementsByClassName('caja-vuelo').length === 0){
            pintarError()
        }
    }
})

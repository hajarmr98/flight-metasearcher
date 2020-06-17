document.getElementsByTagName('form')[0].addEventListener('submit', (e) => {
    e.preventDefault();
    
    let vuelo = recolectarDatos()

    if(comprobarDatos(vuelo)){
        buscadorAvion(vuelo)
    } else {
        alert('Hay campos vacios')
    }

})

let buscadorAvion = async ({origen, destino, ida, vuelta, adultos, ninios, bebes}) => {
    let res = await fetch(`https:/${url}/flights/from/${origen}/to/${destino}/date_1/${ida}/adults/${adultos}/date_2/${vuelta}/kids/${ninios}/babies/${bebes}`)
    let datos = await res.json()
    console.log(datos)
}

let comprobarDatos =  ({origen, destino, ida, vuelta, adultos}) => {
    if(origen === '' || destino === '' || ida === '' || vuelta === '' || adultos === ''){
    let vuelo = recolectarDatos()
    console.log(vuelo)

    if (!comprobarDatos(vuelo)) {
        alert('Rellena los datos')
        console.log("coge el if")
    } else {
        buscadorAvion(vuelo)
        console.log("va")
    }
    
}
let buscadorAvion = async({ origen, destino, ida, vuelta, adultos, ninios, bebes }) => {
    let res = await fetch(`http://127.0.0.1:5500/flights/from/${origen}/to/${destino}/date_1/${ida}/adults/${adultos}/date_2/${vuelta}/kids/${ninios}/babies/${bebes}`)
    let datos = await res.json()
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
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
        return false
    } else {
        return true
    }
}

let recolectarDatos = () => {

    return vuelo = {
        origen: document.getElementById('fechaida').value,
        destino: document.getElementById('fechavuelta').value,
        ida: document.getElementById('vuelo-origen').value,
        vuelta: document.getElementById('vuelo-vuelta').value,
        adultos: document.getElementById('adultos').value,
        ninios: document.getElementById('ninios').value,
        bebes: document.getElementById('bebes').value
    }
}

document.getElementsByTagName('form')[0].addEventListener('submit', (e) => {
    e.preventDefault();
    
    let vuelo = recolectarDatos()

    comprobarDatos(vuelo).then( data =>{
        if(data){
            buscadorAvion(vuelo)
        }else {
            alert('faltan campos')
        }
    })

})

let buscadorAvion = async ({origen, destino, ida, vuelta, adultos, ninios, bebes}) => {
    let res = await fetch(`https:/${url}/flights/from/${origen}/to/${destino}/date_1/${ida}/adults/${adultos}/date_2/${vuelta}/kids/${ninios}/babies/${bebes}`)
    let datos = await res.json()
    console.log(datos)

}


let comprobarDatos = async ({origen, destino, ida, vuelta, adultos}) => {
    if(origen === '' || destino === '' || ida === '' || vuelta === '' || adultos === ''){
        return false
    } else {
        return true
    }
}

let recolectarDatos = () => {
    let fechaIda = document.getElementById('fechaida').value
    let fechaVuelta = document.getElementById('fechavuelta').value
    let vueloIda = document.getElementById('vuelo-origen').value
    let vueloVuelta = document.getElementById('vuelo-vuelta').value
    let cantidadAdultos = document.getElementById('adultos').value
    let cantidadNiños = document.getElementById('ninios').value
    let cantidadBebes = document.getElementById('bebes').value

    let vuelo = {
        origen: vueloIda,
        destino: vueloVuelta,
        ida: fechaIda,
        vuelta: fechaVuelta,
        adultos: cantidadAdultos,
        ninios: cantidadNiños,
        bebes: cantidadBebes,
    }
    return vuelo
}
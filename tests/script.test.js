const { comprobarDatos, pintarVuelo, recolectarDatos } = require('../public/script.js')

describe('Funciones', () => {
    describe('Función comprobar datos', () => {
        test('El email cumple con los criterios', () => {
            expect(checkEmail("silvia@hotmail.com")).toBe(true)
            expect(checkEmail("si@hl.com")).toBe(true)
            expect(checkEmail("silvia-lcoeite2-23@hotmail.es")).toBe(true)
            expect(checkEmail("so.te2_23@hotmail.es")).toBe(true)
            expect(checkEmail("9soerpf@hotmail.es")).toBe(true)
            expect(checkEmail("9dsfd")).toBe(false)
        })
    })
})
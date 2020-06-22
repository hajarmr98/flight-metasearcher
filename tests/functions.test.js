const {comprobarDatos} = require('../public/script.js');

describe('----- FUNCIONES -----', () => {
    describe('---- FUNCION COMPROBARDATOS ----', () => {
        let vuelo, vuelo2,vuelo3,vuelo4,vuelo5,vuelo6,vuelo7;
        beforeEach(() => {
            vuelo = {
                origen: 'Madrid',
                destino: 'Praga',
                ida: '31-07-2020',
                vuelta: '15-08-2020',
                adultos: '3'
            };
            vuelo2 = {
                origen: 'Madrid',
                destino: 'Praga',
                ida: '31-07-2020',
                vuelta: '15-08-2020',
                adultos: '3'
            };
            vuelo3 = {
                origen: '',
                destino: 'Praga',
                ida: '31-07-2020',
                vuelta: '15-08-2020',
                adultos: '3'
            };
            vuelo4 = {
                origen: 'Madrid',
                destino: '',
                ida: '31-07-2020',
                vuelta: '15-08-2020',
                adultos: '3'
            };
            vuelo5 = {
                origen: 'Madrid',
                destino: 'Praga',
                ida: '',
                vuelta: '15-08-2020',
                adultos: '3'
            };
            vuelo6 = {
                origen: 'Madrid',
                destino: 'Praga',
                ida: '31-07-2020',
                vuelta: '',
                adultos: '3'
            };
            vuelo7 = {
                origen: 'Madrid',
                destino: 'Praga',
                ida: '31-07-2020',
                vuelta: '15-08-2020',
                adultos: ''
            };

        })
        test('Todos los valores son validos',() => {
            expect(comprobarDatos(vuelo)).toBeTruthy()
        })
        test('Todos los valores son validos',() => {
            expect(comprobarDatos(vuelo2)).toBeTruthy()
        })
        test('El valor de origen es un string vacio',() => {
            expect(comprobarDatos(vuelo3)).toBeFalsy()
        })
        test('El valor de destino es un string vacio',() => {
            expect(comprobarDatos(vuelo4)).toBeFalsy()
        })
        test('El valor de ida es un string vacio',() => {
            expect(comprobarDatos(vuelo5)).toBeFalsy()
        })
        test('El valor de vuelta es un string vacio',() => {
            expect(comprobarDatos(vuelo6)).toBeFalsy()
        })
        test('El valor de adultos es un string vacio',() => {
            expect(comprobarDatos(vuelo7)).toBeFalsy()
        })
    })
})
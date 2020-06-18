describe("Buscador", () => {
    it("Rellena, sumitea la búsqueda y muestra el resultado", () => {
        cy.visit("/");
        cy.get("form");
        cy.get('input[name="fechaida"]').type('1999-12-31');
        cy.get('input[name="fechavuelta"]').type('1508-12-31');
        cy.get('input[name="origen"]').type('France');
        cy.get('input[name="destino"]').type('Conchinchina');
        cy.get('input[name="adultos"]').type('1');
        cy.get('input[name="ninios"]').type('0');
        cy.get('input[name="bebes"]').type('2');
        
        cy.server()
        cy.route({
            url: '**/flights/from/**',
            method: "GET",
            response: { datosIda: {
                origin: {
                    aeropuertoSalida: 'BARAJAS',
                    origen: 'MADRID',
                    horarioSalida: '14:00',
                    fechaSalida: 'DATE'
                },
                destiny: {
                    aeropuertoLlegada: 'BERGAMO',
                    destino: 'MILAN',
                    horarioLlegada: '16:00',
                    fechaLlegada: 'DATE'
                },
                price: '1500$'
            }, datosVuelta: {
                origin: {
                    aeropuertoSalida: 'ulises',
                    origen: 'MADRID',
                    horarioSalida: '14:00',
                    fechaSalida: 'DATE'
                },
                destiny: {
                    aeropuertoLlegada: 'BERGAMO',
                    destino: 'MILAN',
                    horarioLlegada: '16:00',
                    fechaLlegada: 'DATE'
                },
                price: '1500$'
            }}
          });
          cy.get('form').submit();

    })
})
// Me quiero mucho
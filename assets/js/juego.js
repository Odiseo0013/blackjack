/** 
 * 2C = 2 de treboles
 * 2D = 2 de diamantes
 * 2H = 2 de corazones
 * 2S = 2 de picas
 * 
*/

const miModulo = (() => {

    'use strict'

    let deck        = [];
    const tipos     = ['C', 'D', 'H', 'S'],
          figuras   = ['A', 'J', 'Q', 'K'];

    let puntosJugadores = [];

    const   btnPedir = document.querySelector('#btnPedir'),
            btnPlantarse =  document.querySelector('#btnPlantarse'),
            btnNuevoJuego =  document.querySelector('#btnNuevoJuego');

    const   puntosHTML = document.querySelectorAll('small'),
            divCartasJugadores = document.querySelectorAll('.divCartas');

    // inicializamos el juego
    const inicializarJuego = ( numJugadores = 2 ) => {

        console.clear();
        deck = crearDeck();

        puntosJugadores = [];
        for ( let i = 0; i<numJugadores; i++) {
            puntosJugadores.push(0);
        }

        puntosHTML.forEach( elem => elem.innerText = 0);
        divCartasJugadores.forEach( elem => elem.innerHTML = '');

        btnPedir.disabled = false;
        btnPlantarse.disabled = false;
    }

    // Esta funcion me crea un mazo y la baraja aleatoriamente
    const crearDeck = () => {

        deck = [];

        for( let i = 2; i <= 10; i++ ) {
            for ( let tipo of tipos ) {
                deck.push(i+tipo);
            }
        }

        for ( let tipo of tipos ) {
            for ( let figura of figuras) {
                deck.push(figura+tipo)
            }
        }    
        
        return deck.sort( () => Math.random() - 0.5 );
    }

    // Tomar una carta del mazo
    const pedirCarta = () => {

        if ( deck.length === 0 ) { 
            throw 'no hay cartas en el deck';
        }

        return deck.pop();
    }

    const valorCarta = (nuevaCarta) => {

        const valor = nuevaCarta.substring(0, nuevaCarta.length -1 );
        // en BlackJack todos las figuras valen 10 menos el As que vale 11
        return  ( isNaN(valor)  ) ? 
                ( valor === 'A' ) ? 11 : 10 
                : valor * 1;
    }

    //  Turno: 0 = primer jugador y el ultimo la CPU
    const acumularPuntos = (turno, carta) =>{
        
        puntosJugadores[turno] = puntosJugadores[turno] + valorCarta(carta); 
        puntosHTML[turno].innerText = puntosJugadores[turno];

        return puntosJugadores[turno];
    }

    const crearCarta = (carta, turno) => {

        const imgCarta = document.createElement('img');
        imgCarta.src = `assets/cartas/${carta}.png`;
        imgCarta.classList.add('carta');
        divCartasJugadores[turno].append( imgCarta );   
    }

    const determinarGanador = () => {

        const [ puntosMinimos, puntosCPU ] = puntosJugadores;

        setTimeout(() => {
            if ( puntosCPU === puntosMinimos ) {
                alert('empate');
            } else if ( puntosMinimos > 21 ) {
                alert('CPU GANA');
            } else if ( puntosCPU > 21 ) {
                alert('jugador GANA');  
            } else if ( puntosCPU > puntosMinimos ) {
                alert('CPU GANA');
            }
        }, 150 );
    }

    // Ordenador toma una carta del mazo
    const turnoCPU = ( puntosMinimos ) => {

        let puntosCPU =  0;

        do {
            const  carta = pedirCarta();
            puntosCPU = acumularPuntos( puntosJugadores.length-1 ,carta);
            crearCarta(carta, puntosJugadores.length-1);

        } while ( (puntosCPU < puntosMinimos ) && (puntosMinimos <= 21) );

        determinarGanador();

    }

    // Eventos de click
    btnPedir.addEventListener('click', () => { 

        const  carta = pedirCarta();
        const puntosJugador = acumularPuntos(0, carta);

        crearCarta(carta, 0);

        if (puntosJugador > 21) {
            btnPedir.disabled = true;
            btnPlantarse.disabled = true;
            turnoCPU(puntosJugador);
        } else if (puntosJugador === 21) {
            btnPedir.disabled = true;
            btnPlantarse.disabled = true;
            turnoCPU(puntosJugador);
        }
    }) 

    btnPlantarse.addEventListener('click', () => {
        btnPedir.disabled = true;
        btnPlantarse.disabled = true;
        turnoCPU(puntosJugadores[0]);
    })

    return {
        nuevoJuego: inicializarJuego
    };

})();
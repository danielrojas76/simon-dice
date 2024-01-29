//////// selectores ////////

const $cuadros = document.querySelectorAll(".cuadro");
const $estado = document.querySelector("#estado");
const $puntaje = document.querySelector("#puntaje");

let sounds = {
    "cuadro-1": new Audio(
        "https://s3.amazonaws.com/freecodecamp/simonSound2.mp3"
    ),
    "cuadro-2": new Audio(
        "https://s3.amazonaws.com/freecodecamp/simonSound1.mp3"
    ),
    "cuadro-3": new Audio(
        "https://s3.amazonaws.com/freecodecamp/simonSound4.mp3"
    ),
    "cuadro-4": new Audio(
        "https://s3.amazonaws.com/freecodecamp/simonSound3.mp3"
    ),
};

// variables de rondas
let secuenciaMaquina = [];
let secuenciaUsuario = [];
let ronda = 0;

//variables de puntaje

let puntajeActual = 0;
let mejoresPuntajes = [];

document.querySelector("button[type=button]").onclick = comenzarJuego;

actualizarEstado('Tocá "Empezar" para jugar!');
actualizarNumeroRonda("-");
bloquearInputUsuario();

function comenzarJuego() {
    reiniciarEstado();
    manejarRonda();
}

function reiniciarEstado() {
    // reinicio de rondas
    secuenciaMaquina = [];
    secuenciaUsuario = [];
    ronda = 0;

    //reinicio de puntaje
    puntajeActual = 0;
    actualizarPuntaje();
}

///////// Logica de juego /////////

function manejarRonda() {
    actualizarEstado("Turno de la máquina");
    bloquearInputUsuario();

    const $nuevoCuadro = obtenerCuadroAleatorio();
    secuenciaMaquina.push($nuevoCuadro);

    const RETRASO_TURNO_JUGADOR = (secuenciaMaquina.length + 1) * 1000;

    secuenciaMaquina.forEach(($cuadro, index) => {
        const RETRASO_MS = (index + 1) * 1000;
        setTimeout(function () {
            resaltar($cuadro);
        }, RETRASO_MS);
    });

    setTimeout(function () {
        actualizarEstado("Turno del jugador");
        desbloquearInputUsuario();
    }, RETRASO_TURNO_JUGADOR);

    secuenciaUsuario = [];
    ronda++;

    actualizarNumeroRonda(ronda);
}

function manejarInputUsuario(e) {
    const $cuadro = e.target;
    resaltar($cuadro);
    secuenciaUsuario.push($cuadro);

    const $cuadroMaquina = secuenciaMaquina[secuenciaUsuario.length - 1];
    if ($cuadro.id !== $cuadroMaquina.id) {
        perder();
        return;
    }

    if (secuenciaUsuario.length === secuenciaMaquina.length) {
        bloquearInputUsuario();
        setTimeout(manejarRonda, 1000);
        // actualizacion de puntaje
        puntajeActual = puntajeActual + 100;
        actualizarPuntaje();
    }
}

function obtenerCuadroAleatorio() {
    const indice = Math.floor(Math.random() * $cuadros.length);
    return $cuadros[indice];
}

//////// actualizacion de estados ////////

function actualizarNumeroRonda(ronda) {
    document.querySelector("#ronda").textContent = ronda;
}

function actualizarEstado(estado, error = false) {
    $estado.textContent = estado;
    if (error) {
        $estado.classList.remove("alert-primary");
        $estado.classList.add("alert-danger");
    } else {
        $estado.classList.remove("alert-danger");
        $estado.classList.add("alert-primary");
    }
}

function actualizarPuntaje() {
    $puntaje.textContent = puntajeActual;
}

function actualizarPuntaje() {
    $puntaje.textContent = puntajeActual;
}

function actualizarRanking() {
    for (let i = 0; i < 5 && i < mejoresPuntajes.length; i++) {
        document.querySelector(`#nombre${i + 1}`).textContent =
            mejoresPuntajes[i].iniciales;
        document.querySelector(`#puntaje${i + 1}`).textContent =
            mejoresPuntajes[i].puntaje;
    }
}

//////// utilidad ////////

function resaltar($cuadro) {
    $cuadro.style.opacity = 1;
    const sonido = sounds[$cuadro.id];
    if (sonido) {
        sonido.play();
    }
    setTimeout(() => {
        $cuadro.style.opacity = 0.5;
    }, 500);
}

//////// control input usuario ////////

function bloquearInputUsuario() {
    $cuadros.forEach(($cuadro) => {
        $cuadro.onclick = function () { };
    });
}

function desbloquearInputUsuario() {
    $cuadros.forEach(($cuadro) => {
        $cuadro.onclick = manejarInputUsuario;
    });
}

//////// game over ////////

function perder() {
    bloquearInputUsuario();
    const iniciales = prompt("¡Perdiste! Ingresa tus iniciales (3 letras):");

    // condicional para que en caso de cumplir con la condicion se registre el nombre
    // en caso contrario el nombre del usuario queda en blanco (guiño a "No Game, No Life")

    if (iniciales && iniciales.length === 3) {
        const puntajeRegistro = {
            iniciales: iniciales.toUpperCase(),
            puntaje: puntajeActual,
        };
        mejoresPuntajes.push(puntajeRegistro);
        // ordenar los items en el array
        mejoresPuntajes.sort((a, b) => a.puntaje - b.puntaje);
        // guardar solo los 5 primeros puntajes
        mejoresPuntajes = mejoresPuntajes.slice(0, 5);
        // almacenarlo en el localStorage
        localStorage.setItem("mejoresPuntajes", JSON.stringify(mejoresPuntajes));

        actualizarRanking();
        actualizarEstado('Perdiste! Tocá "Empezar" para jugar de nuevo!', true);
    } else {
        alert("No ingesaste apodo, el puntaje se registra en blanco.");
        const puntajeRegistro = {
            iniciales: iniciales.toUpperCase(),
            puntaje: puntajeActual,
        };
        mejoresPuntajes.push(puntajeRegistro);
        mejoresPuntajes.sort((a, b) => a.puntaje - b.puntaje);
        mejoresPuntajes = mejoresPuntajes.slice(0, 5);
        localStorage.setItem("mejoresPuntajes", JSON.stringify(mejoresPuntajes));

        actualizarRanking();
        actualizarEstado('Perdiste! Tocá "Empezar" para jugar de nuevo!', true);
    }
}

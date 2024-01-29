const $cuadros = document.querySelectorAll(".cuadro");
const $estado = document.querySelector("#estado");

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

let secuenciaMaquina = [];
let secuenciaUsuario = [];
let ronda = 0;

document.querySelector("button[type=button]").onclick = comenzarJuego;

actualizarEstado('Tocá "Empezar" para jugar!');
actualizarNumeroRonda("-");
bloquearInputUsuario();

function comenzarJuego() {
  reiniciarEstado();
  manejarRonda();
}

function reiniciarEstado() {
  secuenciaMaquina = [];
  secuenciaUsuario = [];
  ronda = 0;
}

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
  }
}

function obtenerCuadroAleatorio() {
  const indice = Math.floor(Math.random() * $cuadros.length);
  return $cuadros[indice];
}

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

function bloquearInputUsuario() {
  document.querySelectorAll(".cuadro").forEach(($cuadro) => {
    $cuadro.onclick = function () {};
  });
}

function desbloquearInputUsuario() {
  document.querySelectorAll(".cuadro").forEach(($cuadro) => {
    $cuadro.onclick = manejarInputUsuario;
  });
}

function perder() {
  bloquearInputUsuario();
  actualizarEstado('Perdiste! Tocá "Empezar" para jugar de nuevo!', true);
}

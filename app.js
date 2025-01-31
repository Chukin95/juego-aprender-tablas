// Variables globales
let puntaje = 0;
let puntajeRequerido = 200;
let historial = [];
let intentosRestantes = 3;
let tablas = [1, 2];
let respuestaCorrecta;
let nivel = 1;
let tiempoRestante = 20;
let temporizador;

function verificarRespuesta(tiempoAgotado = false) {
  const respuestaUsuario = obtenerRespuestaUsuario(tiempoAgotado);
  const resultadoElement = document.querySelector(".texto__parrafo");

  if (validarEntrada(tiempoAgotado, respuestaUsuario, resultadoElement)) return;

  if (tiempoAgotado) {
    manejarTiempoAgotado(resultadoElement);
  } else if (respuestaUsuario === respuestaCorrecta) {
    manejarRespuestaCorrecta(resultadoElement);
  } else {
    manejarRespuestaIncorrecta(resultadoElement, respuestaUsuario);
  }

  verificarSubirNivel();
  actualizarHistorialRespuesta(tiempoAgotado, respuestaUsuario);
  actualizarInterfaz();
}

function obtenerRespuestaUsuario(tiempoAgotado) {
  return tiempoAgotado
    ? null
    : parseInt(document.getElementById("valorUsuario").value, 10);
}

function validarEntrada(tiempoAgotado, respuestaUsuario, resultadoElement) {
  if (!tiempoAgotado && isNaN(respuestaUsuario)) {
    resultadoElement.textContent = "Debes ingresar un número.";
    resultadoElement.style.color = "red";
    return true;
  }
  return false;
}

function manejarTiempoAgotado(resultadoElement) {
  clearInterval(temporizador);
  resultadoElement.textContent = `Tiempo agotado. La respuesta correcta era ${respuestaCorrecta}.`;
  resultadoElement.style.color = "red";
  deshabilitarControles();
  ajustarPuntaje(-10);
  mostrarHistorial();
}

function manejarRespuestaCorrecta(resultadoElement) {
  clearInterval(temporizador);
  resultadoElement.textContent = "¡Correcto! 🎉";
  resultadoElement.style.color = "green";
  deshabilitarControles();
  ajustarPuntaje(10);
  mostrarHistorial();
}

function manejarRespuestaIncorrecta(resultadoElement, respuestaUsuario) {
  intentosRestantes--;
  if (intentosRestantes > 0) {
    manejarIntentosRestantes(resultadoElement);
  } else {
    manejarSinIntentosRestantes(resultadoElement);
  }
}

function manejarIntentosRestantes(resultadoElement) {
  resultadoElement.textContent = `Incorrecto. Intentos restantes: ${intentosRestantes}`;
  resultadoElement.style.color = "red";
  ajustarPuntaje(-5);
  reiniciarTemporizador();
}

function manejarSinIntentosRestantes(resultadoElement) {
  clearInterval(temporizador);
  resultadoElement.textContent = `Incorrecto. La respuesta correcta era ${respuestaCorrecta}.`;
  deshabilitarControles();
  ajustarPuntaje(-25);
  mostrarHistorial();
}

function deshabilitarControles() {
  document.getElementById("reiniciar").disabled = false;
  document.getElementById("intentoBoton").disabled = true;
  document.getElementById("valorUsuario").disabled = true;
}

function ajustarPuntaje(puntos) {
  puntaje = Math.max(0, puntaje + puntos);
}

function actualizarHistorialRespuesta(tiempoAgotado, respuestaUsuario) {
  historial.push({
    pregunta: document.querySelector("h1").textContent,
    respuestaUsuario: tiempoAgotado ? "Tiempo agotado" : respuestaUsuario,
    correcta: respuestaUsuario === respuestaCorrecta,
  });
}

function actualizarInterfaz() {
  actualizarHistorial();
  actualizarPuntajeEnPantalla();
  document.getElementById("valorUsuario").value = "";
}

function reiniciarJuego() {
  reiniciarVariables();
  actualizarInterfazUsuario();
  reiniciarElementosJuego();
  ocultarHistorial();
  reiniciarTemporizador();
  actualizarPuntajeEnPantalla();
  enfocarInputUsuario();
}

function reiniciarVariables() {
  intentosRestantes = 3;
}

function actualizarInterfazUsuario() {
  actualizarTextoParrafo();
  actualizarEstadoBotones();
}

function actualizarTextoParrafo() {
  const parrafo = document.querySelector(".texto__parrafo");
  parrafo.textContent = "Intenta resolver la multiplicación.";
  parrafo.style.color = "white";
}

function actualizarEstadoBotones() {
  document.getElementById("reiniciar").disabled = true;
  document.getElementById("intentoBoton").disabled = false;
  document.getElementById("valorUsuario").disabled = false;
}

function reiniciarElementosJuego() {
  mostrarPregunta();
}

function ocultarHistorial() {
  document.querySelector(".container__historial").style.display = "none";
}

function enfocarInputUsuario() {
  document.getElementById("valorUsuario").focus();
}

function finalizarJuego() {
  ocultarContenedorPrincipal();
  mostrarHistorialFinal();
  mostrarMensajeFinal();
  actualizarHistorial();
  console.log("Juego finalizado, historial debería ser visible ahora");
}

function ocultarContenedorPrincipal() {
  const contenedor = document.querySelector(".container");
  if (contenedor) {
    contenedor.style.display = "none";
  } else {
    console.error("El contenedor principal no se encontró");
  }
}

function mostrarHistorialFinal() {
  const historialContainer = document.querySelector(".container__historial");
  if (historialContainer) {
    historialContainer.style.display = "block";
  } else {
    console.error("El contenedor del historial no se encontró");
  }
}

function mostrarMensajeFinal() {
  const mensajeFinal = crearElementoMensajeFinal();
  document.body.appendChild(mensajeFinal);
  console.log("¡Felicidades! Has completado todas las tablas de multiplicar!");
}

function crearElementoMensajeFinal() {
  const mensajeFinal = document.createElement("div");
  mensajeFinal.className = "mensaje-final";
  mensajeFinal.innerHTML = `
    <h1>¡Felicidades! Has completado todas las tablas de multiplicar!</h1>
    <p>Has completado todas las tablas de multiplicar.</p>
    <button onclick="location.reload()">Volver a jugar</button>
  `;
  return mensajeFinal;
}

function actualizarHistorial() {
  const historialLista = obtenerListaHistorial();
  if (!historialLista) return;
  limpiarListaHistorial(historialLista);
  agregarElementosHistorial(historialLista);
}

function obtenerListaHistorial() {
  const historialLista = document.getElementById("historial-lista");
  if (!historialLista) {
    console.error("La lista del historial no se encontró");
    return null;
  }
  return historialLista;
}

function limpiarListaHistorial(lista) {
  lista.innerHTML = "";
}

function agregarElementosHistorial(lista) {
  historial.forEach((item) => {
    const li = crearElementoHistorial(item);
    lista.appendChild(li);
  });
}

function crearElementoHistorial(item) {
  const li = document.createElement("li");
  li.textContent = formatearTextoHistorial(item);
  return li;
}

function formatearTextoHistorial(item) {
  const estadoRespuesta = item.correcta ? "✅" : "❌";
  return `${item.pregunta} = ${item.respuestaUsuario} [${estadoRespuesta}]`;
}

function verificarSubirNivel() {
  if (puntaje >= puntajeRequerido) {
    if (esNivelMaximo()) {
      finalizarJuego();
      return;
    }
    subirNivel();
    actualizarTablas();
    actualizarInterfazNuevoNivel();
  }
}

function esNivelMaximo() {
  return tablas.includes(10);
}

function subirNivel() {
  puntaje = 0;
  nivel++;
  console.log(`Has pasado al nivel ${nivel}!`);
}

function actualizarTablas() {
  tablas.push(tablas.at(-1) + 1);
  if (tablas.length > 2) {
    tablas = tablas.slice(-2);
  }
  console.log(`Tablas actuales: ${tablas.join(" y ")}`);
}

function actualizarInterfazNuevoNivel() {
  document.querySelector(".texto__parrafo").textContent =
    "¡Has superado el nivel!";
  reiniciarJuego();
  actualizarPuntajeEnPantalla();
}
function actualizarTemporizador() {
  const temporizadorElement = document.getElementById("temporizador");

  if (tiempoRestante <= 0) {
    clearInterval(temporizador);
    temporizadorElement.textContent = `Tiempo: 0s`;
    temporizadorElement.className = "tiempo-rojo";
    verificarRespuesta(true);
    return;
  }

  temporizadorElement.textContent = `Tiempo: ${tiempoRestante}s`;

  // Actualizar el color basado en el tiempo restante
  if (tiempoRestante > 15) {
    temporizadorElement.className = "tiempo-verde";
  } else if (tiempoRestante > 10) {
    temporizadorElement.className = "tiempo-amarillo";
  } else if (tiempoRestante > 5) {
    temporizadorElement.className = "tiempo-naranja";
  } else {
    temporizadorElement.className = "tiempo-rojo";
  }

  tiempoRestante--;
}

function reiniciarTemporizador() {
  clearInterval(temporizador);
  tiempoRestante = 20;
  temporizador = setInterval(actualizarTemporizador, 1000);
}

function actualizarPuntajeEnPantalla() {
  document.getElementById(
    "puntaje"
  ).textContent = `Experiencia: ${puntaje}/${puntajeRequerido} | Nivel: ${nivel} | Tablas actuales: ${tablas.join(
    " y "
  )}`;
}

// Generar una multiplicación aleatoria
function generarMultiplicacion() {
  const tabla = tablas[Math.floor(Math.random() * tablas.length)];
  const numero = Math.floor(Math.random() * 9) + 2;
  return { tabla, numero, resultado: tabla * numero };
}

// Mostrar la pregunta en la pantalla
function mostrarPregunta() {
  const { tabla, numero, resultado } = generarMultiplicacion();
  document.querySelector("h1").textContent = `${tabla} x ${numero}`;
  respuestaCorrecta = resultado;
  reiniciarTemporizador();
}

function mostrarHistorial() {
  const historialContainer = document.querySelector(".container__historial");
  if (historialContainer) {
    historialContainer.style.display = "block";
  } else {
    console.error("El contenedor del historial no se encontró");
  }
}

function configurarEventListeners() {
  document
    .querySelector(".container__boton")
    .addEventListener("click", verificarRespuesta);
  document
    .getElementById("reiniciar")
    .addEventListener("click", reiniciarJuego);
  document.addEventListener("keypress", manejarTeclaEnter);
}

function manejarTeclaEnter(e) {
  if (e.key === "Enter") {
    if (document.getElementById("reiniciar").disabled === false) {
      reiniciarJuego();
    } else {
      verificarRespuesta();
    }
  }
}

function preguntarNivelInicial() {
  const nivelInicial = parseInt(prompt("¿Qué nivel deseas jugar? (1-10)"));
  if (isNaN(nivelInicial) || nivelInicial < 1 || nivelInicial > 10) {
    alert("Por favor, introduce un número entre 1 y 10.");
    preguntarNivelInicial();
    return;
  }
  tablas = Array.from({ length: nivelInicial }, (_, i) => i);
  actualizarTablas();
  nivel = nivelInicial;
}

function inicializarJuego() {
  preguntarNivelInicial();
  document.getElementById("valorUsuario").focus();
  mostrarPregunta();
  actualizarPuntajeEnPantalla();
  reiniciarTemporizador();
  configurarEventListeners();
}

document.addEventListener("DOMContentLoaded", inicializarJuego);

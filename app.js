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
document.querySelector(".texto__parrafo").textContent =
  "Intenta resolver la multiplicación.";

// Generar una multiplicación aleatoria
function generarMultiplicacion() {
  const tabla = tablas[Math.floor(Math.random() * tablas.length)];
  const numero = Math.floor(Math.random() * 9) + 2;
  return { tabla, numero, resultado: tabla * numero };
}

// Mostrar la pregunta en la pantalla
function mostrarPregunta() {
  const { tabla, numero, resultado } = generarMultiplicacion();
  document.querySelector("h1").textContent = `${tabla} x ${numero}:`;
  respuestaCorrecta = resultado;

  // Reiniciar el temporizador
  clearInterval(temporizador);
  tiempoRestante = 20;
  temporizador = setInterval(actualizarTemporizador, 1000);
}

function mostrarHistorial() {
    const historialContainer = document.querySelector(".container__historial");
    if (historialContainer) {
        historialContainer.style.display = "block";
    } else {
        console.error("El contenedor del historial no se encontró");
    }
}

function actualizarHistorial() {
  console.log("Actualizando historial...");
  const historialLista = document.getElementById("historial-lista");
  if (!historialLista) {
    console.error("La lista del historial no se encontró");
    return;
  }
  historialLista.innerHTML = "";
  historial.forEach((item) => {
    const li = document.createElement("li");
    li.textContent = `${item.pregunta} - Tu respuesta: ${item.respuestaUsuario} (${item.correcta ? "✅ Correcto" : "❌ Incorrecto"})`;
    historialLista.appendChild(li);
  });
  console.log("Historial actualizado con " + historial.length + " elementos");
}
function verificarSubirNivel() {
  if (puntaje >= puntajeRequerido) {
    if (tablas.includes(10)) {
      finalizarJuego();
      return;
    }
    document.querySelector(".texto__parrafo").textContent =
      "¡Has superado el nivel!";
    reiniciarJuego();
    puntaje = 0;
    nivel++;
    console.log(`Has pasado al nivel ${nivel}!`);
    tablas.push(tablas.at(-1)+1);

    // Mantener solo las dos últimas tablas si hay más de dos
    if (tablas.length > 2) {
      tablas = tablas.slice(-2);
    }

    console.log(`Tablas actuales: ${tablas.join(' y ')}`);
    actualizarPuntajeEnPantalla();
  }
}

function actualizarPuntajeEnPantalla() {
  document.getElementById("puntaje").textContent = `Experiencia: ${puntaje}/${puntajeRequerido} | Nivel: ${nivel} | Tablas actuales: ${tablas.join(' y ')}`;
}
// Verificar la respuesta del usuario
function actualizarTemporizador() {
  const temporizadorElement = document.getElementById("temporizador");
  temporizadorElement.textContent = `Tiempo: ${tiempoRestante}s`;

  // Actualizar el color basado en el tiempo restante
  if (tiempoRestante > 15) {
    temporizadorElement.className = 'tiempo-verde';
  } else if (tiempoRestante > 10) {
    temporizadorElement.className = 'tiempo-amarillo';
  } else if (tiempoRestante > 5) {
    temporizadorElement.className = 'tiempo-naranja';
  } else {
    temporizadorElement.className = 'tiempo-rojo';
  }
  if (tiempoRestante === 0) {
    clearInterval(temporizador);
    verificarRespuesta(true);
  } else {
    tiempoRestante--;
  }
}
function verificarRespuesta(tiempoAgotado = false) {
  const respuestaUsuario = tiempoAgotado ? null : parseInt(
    document.getElementById("valorUsuario").value,
    10
  );
  const resultadoElement = document.querySelector(".texto__parrafo");

  if (!tiempoAgotado && isNaN(respuestaUsuario)) {
    resultadoElement.textContent = "Debes ingresar un número.";
    resultadoElement.style.color = "red";
    return;
  }

  if (tiempoAgotado) {
    clearInterval(temporizador);
    resultadoElement.textContent = `Tiempo agotado. La respuesta correcta es ${respuestaCorrecta}.`;
    resultadoElement.style.color = "red";
    document.getElementById("reiniciar").disabled = false;
    document.getElementById("intentoBoton").disabled = true;
    puntaje = Math.max(0, puntaje - 10); // Restar 10 puntos, pero no bajar de 0
    mostrarHistorial();
  } else if (respuestaUsuario === respuestaCorrecta) {
    clearInterval(temporizador);
    resultadoElement.textContent = "¡Correcto! 🎉";
    resultadoElement.style.color = "green";
    document.getElementById("reiniciar").disabled = false;
    document.getElementById("intentoBoton").disabled = true;
    puntaje += 10; // Aumentar el puntaje por acertar
    mostrarHistorial();
  } else {
    intentosRestantes--;
    resultadoElement.textContent = `Incorrecto. Intentos restantes: ${intentosRestantes}`;
    resultadoElement.style.color = "red";
    puntaje = Math.max(0, puntaje - 5); // Restar 5 puntos, pero no bajar de 0

    if (intentosRestantes === 0) {
      clearInterval(temporizador);
      resultadoElement.textContent = `Incorrecto. La respuesta correcta es ${respuestaCorrecta}.`;
      document.getElementById("reiniciar").disabled = false;
      document.getElementById("intentoBoton").disabled = true;
      puntaje = Math.max(0, puntaje - 25); // Restar 25 puntos, pero no bajar de 0
      mostrarHistorial();
    } else {
      // Reiniciar el temporizador para el siguiente intento
      clearInterval(temporizador);
      tiempoRestante = 20;
      temporizador = setInterval(actualizarTemporizador, 1000);
    }
  }

  verificarSubirNivel();

  historial.push({
    pregunta: document.querySelector("h1").textContent,
    respuestaUsuario: tiempoAgotado ? "Tiempo agotado" : respuestaUsuario,
    correcta: respuestaUsuario === respuestaCorrecta,
  });

  actualizarHistorial();
  actualizarPuntajeEnPantalla();
  document.getElementById("valorUsuario").value = "";
}

function reiniciarJuego() {
  intentosRestantes = 3;
  document.querySelector(".texto__parrafo").textContent =
    "Intenta resolver la multiplicación.";
  document.querySelector(".texto__parrafo").style.color = "white";
  document.getElementById("reiniciar").disabled = true;
  document.getElementById("intentoBoton").disabled = false;
  mostrarPregunta();
  document.querySelector(".container__historial").style.display = "none"; // Ocultar historial al reiniciar
  actualizarPuntajeEnPantalla(); // Actualizamos el puntaje en pantalla
}

function finalizarJuego() {
  // Ocultar el contenedor principal
  document.querySelector('.container').style.display = 'none';

  // Asegurarse de que el historial esté visible
  const historialContainer = document.querySelector('.container__historial');
  if (historialContainer) {
    historialContainer.style.display = 'block';
  } else {
    console.error("El contenedor del historial no se encontró");
  }

  // Crear y mostrar el mensaje final
  const mensajeFinal = document.createElement('div');
  mensajeFinal.className = 'mensaje-final';
  mensajeFinal.innerHTML = `
    <h1>¡Felicidades!</h1>
    <p>Has completado todas las tablas de multiplicar.</p>
    <button onclick="location.reload()">Volver a jugar</button>
  `;
  document.body.appendChild(mensajeFinal);

  // Actualizar y mostrar el historial
  actualizarHistorial();

  console.log("Juego finalizado, historial debería ser visible ahora");
}

document.addEventListener("DOMContentLoaded", () => {
  mostrarPregunta();
  actualizarPuntajeEnPantalla(); // Agregamos esta línea
  document
    .querySelector(".container__boton")
    .addEventListener("click", verificarRespuesta);
  document
    .getElementById("reiniciar")
    .addEventListener("click", reiniciarJuego);
  document.getElementById("valorUsuario").addEventListener("keypress", (e) => {
    if (
      e.key === "Enter" &&
      document.getElementById("reiniciar").disabled === false
    ) {
      reiniciarJuego();
    } else if (
      e.key === "Enter" &&
      document.getElementById("reiniciar").disabled === true
    ) {
      verificarRespuesta();
    }
  });
});

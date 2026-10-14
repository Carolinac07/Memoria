const productos = [
    "img/pan-hamburguesa.jpg",
    "img/pan-integral.jpg",
    "img/pan-lactal.jpg",
    "img/pan-multicereal.jpg",
    "img/pan-panchos.jpg",
    "img/pan-salvado.jpg",
    "img/pascualina.jpg",
    "img/tapas.jpg"
]

let cartas = [
    ...productos,
    ...productos
]

let primeraCarta = null
let segundaCarta = null

let bloqueado = false
let parejasEncontradas = 0

let tiempo = 60
let intervalo

let resultadoGuardado = false

function mezclar() {
    cartas.sort(() => Math.random() - 0.5)
}


function crearTablero() {
    const tablero = document.getElementById("tablero")
    tablero.innerHTML = ""
    cartas.forEach((imagen) => {

        const carta = document.createElement("button")

        carta.classList.add("carta")

        carta.dataset.imagen = imagen

        carta.innerHTML = '<img src="img/logo.png" alt="Romero Panificados" class="logo-carta">'

        carta.addEventListener("click", function () {
            mostrarCarta(carta)
        })
        tablero.appendChild(carta)
    })
}

function mostrarCarta(carta) {
    if (bloqueado) {
        return
    }
    if (primeraCarta !== null && segundaCarta !== null) {
        return
    }
    if (carta === primeraCarta) {
        return
    }
    if (carta.disabled) {
        return
    }

    carta.innerHTML = `<img src="${carta.dataset.imagen}" alt="Producto">`
    if (primeraCarta === null) {
        primeraCarta = carta
        return
    }
    segundaCarta = carta
    comprobarPareja()
}

function comprobarPareja() {
    bloqueado = true
    if (
        primeraCarta.dataset.imagen ===
        segundaCarta.dataset.imagen
    ) {
        parejasEncontradas++
        document.getElementById("parejas").textContent =
            parejasEncontradas
        primeraCarta.disabled = true
        segundaCarta.disabled = true

        primeraCarta = null
        segundaCarta = null
        bloqueado = false

        if (parejasEncontradas === 8) {
            ganar()
        }
    } else {
        setTimeout(function () {
            primeraCarta.innerHTML = '<img src="img/logo.png" alt="Romero Panificados" class="logo-carta">'
            segundaCarta.innerHTML = '<img src="img/logo.png" alt="Romero Panificados" class="logo-carta">'

            primeraCarta = null
            segundaCarta = null

            bloqueado = false
        }, 800)
    }
}

function iniciarTiempo() {
    intervalo = setInterval(function () {
        tiempo--
        document.getElementById("tiempo").textContent =
            tiempo

        if (tiempo <= 0) {
            perder()
        }
    }, 1000)
}

function ganar() {
    clearInterval(intervalo)

    document.getElementById("mensaje").textContent =
        "Ganaste! Encontraste los 8 productos."

    bloquearTablero()

    document.getElementById("formulario-ranking").style.display = "block"
}

function perder() {
    clearInterval(intervalo)
    document.getElementById("mensaje").textContent =
        "Se terminó el tiempo. Intentá nuevamente!"
    bloquearTablero()
}

function bloquearTablero() {
    const todasLasCartas =
        document.querySelectorAll(".carta")
    todasLasCartas.forEach(function (carta) {
        carta.disabled = true
    })
}

function reiniciarJuego() {
    clearInterval(intervalo)
    primeraCarta = null
    segundaCarta = null

    bloqueado = false
    parejasEncontradas = 0
    tiempo = 60

    document.getElementById("tiempo").textContent = tiempo
    document.getElementById("parejas").textContent = 0
    document.getElementById("mensaje").textContent = ""

    resultadoGuardado = false

    document.getElementById("formulario-ranking").style.display = "none"
    document.getElementById("nombre-jugador").value = ""
    mezclar()
    crearTablero()
    iniciarTiempo()
}

function guardarResultado() {
    if (resultadoGuardado) {
        return
    }

    const nombre = document.getElementById("nombre-jugador").value.trim()
    if (nombre === "") {
        alert("Ingresá tu nombre para guardar el resultado.")
        return
    }

    let ranking = JSON.parse(localStorage.getItem("rankingMemoria")) || []
    const resultado = {
        nombre: nombre,
        tiempo: tiempo
    }
    ranking.push(resultado)
    ranking.sort(function (a, b) {
        return b.tiempo - a.tiempo
    })

    ranking = ranking.slice(0, 10)
    localStorage.setItem("rankingMemoria", JSON.stringify(ranking))
    resultadoGuardado = true
    document.getElementById("formulario-ranking").style.display = "none"
    mostrarRanking()
}

function mostrarRanking() {
    const lista = document.getElementById("lista-ranking")

    lista.innerHTML = ""

    const ranking = JSON.parse(localStorage.getItem("rankingMemoria")) || []
    ranking.forEach(function (jugador) {
        const elemento = document.createElement("li")
        elemento.textContent = jugador.nombre + " - " + jugador.tiempo + " segundos restantes"
        lista.appendChild(elemento)
    })

    if (ranking.length === 0) {
        lista.innerHTML = "<li>Todavía no hay resultados.</li>"
    }
}

reiniciarJuego()


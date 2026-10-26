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

let cartas = [...productos, ...productos]
let primeraCarta = null
let segundaCarta = null
let bloqueado = false
let parejasEncontradas = 0
let tiempo = 60
let intervalo = null
let tiempoIniciado = false
let resultadoGuardado = false
let juegoTerminado = false

function mezclar() {
    for (let i = cartas.length - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i + 1))
        let temporal = cartas[i]
        cartas[i] = cartas[j]
        cartas[j] = temporal
    }
}

function crearTablero() {
    const tablero = document.getElementById("tablero")
    tablero.innerHTML = ""

    cartas.forEach(function (imagen) {
        const carta = document.createElement("button")

        carta.classList.add("carta")
        carta.dataset.imagen = imagen

        carta.innerHTML =
            '<img src="img/logo.png" alt="Romero Panificados" class="logo-carta">'

        carta.addEventListener("click", function () {
            mostrarCarta(carta)
        })

        tablero.appendChild(carta)
    })
}

function mostrarCarta(carta) {
    if (bloqueado || juegoTerminado) {
        return
    }

    if (primeraCarta !== null && segundaCarta !== null) {
        return
    }

    if (carta === primeraCarta || carta.disabled) {
        return
    }

    if (!tiempoIniciado) {
        tiempoIniciado = true
        iniciarTiempo()
    }

    carta.innerHTML = `<img src="${carta.dataset.imagen}" alt="Producto">`
    carta.classList.add("volteada")

    if (primeraCarta === null) {
        primeraCarta = carta
        return
    }

    segundaCarta = carta
    comprobarPareja()
}

function comprobarPareja() {
    bloqueado = true

    if (primeraCarta.dataset.imagen === segundaCarta.dataset.imagen) {
        parejasEncontradas++

        document.getElementById("parejas").textContent = parejasEncontradas

        primeraCarta.disabled = true
        segundaCarta.disabled = true

        primeraCarta.classList.add("encontrada")
        segundaCarta.classList.add("encontrada")

        primeraCarta = null
        segundaCarta = null
        bloqueado = false

        if (parejasEncontradas === 8) {
            ganar()
        }
    } else {
        setTimeout(function () {
            if (juegoTerminado) {
                primeraCarta = null
                segundaCarta = null
                bloqueado = false
                return
            }

            primeraCarta.innerHTML =
                '<img src="img/logo.png" alt="Romero Panificados" class="logo-carta">'

            segundaCarta.innerHTML =
                '<img src="img/logo.png" alt="Romero Panificados" class="logo-carta">'

            primeraCarta.classList.remove("volteada")
            segundaCarta.classList.remove("volteada")

            primeraCarta = null
            segundaCarta = null
            bloqueado = false
        }, 800)
    }
}

function iniciarTiempo() {
    if (intervalo !== null || juegoTerminado) {
        return
    }

    intervalo = setInterval(function () {
        tiempo--

        document.getElementById("tiempo").textContent = tiempo

        if (tiempo <= 0) {
            tiempo = 0
            document.getElementById("tiempo").textContent = tiempo
            perder()
        }
    }, 1000)
}

function ganar() {
    juegoTerminado = true

    clearInterval(intervalo)
    intervalo = null

    bloquearTablero()

    document.getElementById("mensaje").textContent = ""
    document.getElementById("formulario-ranking").style.display = "block"
    document.getElementById("resultado-ranking").style.display = "none"
    document.getElementById("pantalla-derrota").style.display = "none"

    document.getElementById("ventana-juego").style.display = "flex"
    document.getElementById("nombre-jugador").value = ""

    setTimeout(function () {
        document.getElementById("nombre-jugador").focus()
    }, 100)
}

function perder() {
    juegoTerminado = true

    clearInterval(intervalo)
    intervalo = null

    bloquearTablero()

    document.getElementById("mensaje").textContent = ""
    document.getElementById("formulario-ranking").style.display = "none"
    document.getElementById("resultado-ranking").style.display = "none"
    document.getElementById("pantalla-derrota").style.display = "block"

    document.getElementById("ventana-juego").style.display = "flex"
}

function bloquearTablero() {
    const todasLasCartas = document.querySelectorAll(".carta")

    todasLasCartas.forEach(function (carta) {
        carta.disabled = true
    })
}

function reiniciarJuego() {
    clearInterval(intervalo)
    intervalo = null

    primeraCarta = null
    segundaCarta = null
    bloqueado = false
    parejasEncontradas = 0
    tiempo = 60
    tiempoIniciado = false
    juegoTerminado = false
    resultadoGuardado = false

    document.getElementById("tiempo").textContent = tiempo
    document.getElementById("parejas").textContent = 0
    document.getElementById("mensaje").textContent = ""

    document.getElementById("ventana-juego").style.display = "none"
    document.getElementById("formulario-ranking").style.display = "none"
    document.getElementById("resultado-ranking").style.display = "none"
    document.getElementById("pantalla-derrota").style.display = "none"
    document.getElementById("nombre-jugador").value = ""
    cartas = [...productos, ...productos]
    mezclar()
    crearTablero()
}

document.getElementById("formulario-nombre").addEventListener("submit", function (evento) {
    evento.preventDefault()
    guardarResultado()
})

function guardarResultado() {
    if (resultadoGuardado || !juegoTerminado || parejasEncontradas !== 8) {
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
    mostrarRanking()
    document.getElementById("formulario-ranking").style.display = "none"
    document.getElementById("resultado-ranking").style.display = "block"
    mostrarRankingVentana()
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

function mostrarRankingVentana() {
    const lista = document.getElementById("ranking-ventana")
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
function borrarHistorial() {
    if (confirm("¿Estás seguro de que querés borrar todo el historial?")) {
        localStorage.removeItem("rankingMemoria")
        mostrarRanking()
        mostrarRankingVentana()
    }
}
mostrarRanking()
reiniciarJuego()
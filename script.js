const cartas = [
    "imagenes/pan-hamburguesa.jpg",
    "imagenes/pan-hamburguesa.jpg",
    "imagenes/pan-integral.jpg",
    "imagenes/pan-integral.jpg",
    "imagenes/pan-lactal.jpg",
    "imagenes/pann-lactal.jpg",
    "imagenes/pan-multicereal.jpg",
    "imagenes/pan-multicereal.jpg",
    "imagenes/pan-panchos.jpg",
    "imagenes/pan-panchos.jpg",
    "imagenes/pan-salvado.jpg",
    "imagenes/pan-salvado.jpg",
    "imagenes/pascualina.jpg",
    "imagenes/pascualina.jpg",
    "imagenes/tapas.jpg",
    "imagenes/tapas.jpg"
]

let primeraCarta = null
let segundaCarta = null

let bloquearCrtas= false

let parejasEncontradas = 0

let tiempo = 60

let intervalo

let nombreJugador = ""


const inicio = document.getElementById("inicio")
const juego = document.getElementById("juego")
const resultado = document.getElementById("resultado")
const tablero = document.getElementById("tablero")
const tiempoTexto = document.getElementById("tiempo")
const parejasTetp = document.getElementById("parejas")
const nombreInputut = document.getElementById("nombreJugador")
const mensajeResultado = document.getElementById("mensajeResultado")
const mensajeTiempo = document.getElementById("mensajeTiempo")
const listaGanadores = document.getElementById("listaGanadores")


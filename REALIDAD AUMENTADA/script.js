// Esperar a que todas las librerías estén cargadas
window.addEventListener("load", () => {
  console.log("Página completamente cargada")
  initializeApp()
})

function initializeApp() {
  const startScreen = document.getElementById("start-screen")
  const arScreen = document.getElementById("ar-screen")
  const startButton = document.getElementById("start-button")

  console.log("Elementos encontrados:", { startScreen, arScreen, startButton })

  if (!startButton) {
    console.error("Botón no encontrado")
    return
  }

  // Event listener para el botón de inicio
  startButton.addEventListener("click", () => {
    console.log("Botón clickeado")
    startARExperience()
  })

  function startARExperience() {
    console.log("Iniciando experiencia AR...")

    // Ocultar pantalla inicial
    startScreen.style.display = "none"

    // Mostrar pantalla AR
    arScreen.style.display = "block"

    // Inicializar componentes AR después de un pequeño delay
    setTimeout(initializeARComponents, 500)
  }

  function initializeARComponents() {
    console.log("Inicializando componentes AR...")

    // Verificar que AFRAME esté disponible
    const AFRAME = window.AFRAME // Declare the variable before using it
    if (typeof AFRAME === "undefined") {
      console.error("AFRAME no está disponible")
      return
    }

    // Registrar componente para redirección a WhatsApp
    AFRAME.registerComponent("whatsapp-redirect", {
      init: function () {
        this.el.addEventListener("click", () => {
          console.log("Botón WhatsApp clickeado")
          window.open("https://whatsapp.com/channel/0029Vb6NylYAojYrtcsdhL0C", "_blank")
        })
      },
    })

    // Obtener la escena
    const sceneEl = document.querySelector("a-scene")

    if (!sceneEl) {
      console.error("Escena no encontrada")
      return
    }

    // Event listeners para detección del marcador
    sceneEl.addEventListener("targetFound", (event) => {
      console.log("¡Marcador detectado!")

      // Ocultar instrucciones
      const instructions = document.getElementById("instructions")
      if (instructions) {
        instructions.style.display = "none"
      }

      // Mostrar mensaje con animación
      const messageContainer = document.querySelector("#message-container")
      if (messageContainer) {
        messageContainer.setAttribute("animation", {
          property: "scale",
          from: "0 0 0",
          to: "1 1 1",
          dur: 1000,
          easing: "easeOutElastic",
        })
      }

      // Reproducir audio
      playAudio()
    })

    sceneEl.addEventListener("targetLost", (event) => {
      console.log("Marcador perdido")

      // Mostrar instrucciones nuevamente
      const instructions = document.getElementById("instructions")
      if (instructions) {
        instructions.style.display = "block"
      }
    })

    console.log("Componentes AR inicializados correctamente")
  }

  function playAudio() {
    const audioEl = document.querySelector("#background-music")
    if (audioEl) {
      audioEl
        .play()
        .then(() => {
          console.log("Audio reproducido correctamente")
        })
        .catch((error) => {
          console.error("Error al reproducir audio:", error)
          // En caso de error, intentar reproducir después de interacción del usuario
          document.addEventListener(
            "click",
            () => {
              audioEl.play().catch((e) => console.error("Error en segundo intento:", e))
            },
            { once: true },
          )
        })
    }
  }
}

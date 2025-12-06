// Sound effects
const sounds = {
  click: () => playBeep(800, 0.1),
  success: () => playBeep(1200, 0.2),
  error: () => playBeep(400, 0.3),
  hover: () => playBeep(600, 0.05),
}

function playBeep(frequency, duration) {
  const audioContext = new (window.AudioContext || window.webkitAudioContext)()
  const oscillator = audioContext.createOscillator()
  const gainNode = audioContext.createGain()

  oscillator.connect(gainNode)
  gainNode.connect(audioContext.destination)

  oscillator.frequency.value = frequency
  oscillator.type = "sine"

  gainNode.gain.setValueAtTime(0.1, audioContext.currentTime)
  gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + duration)

  oscillator.start(audioContext.currentTime)
  oscillator.stop(audioContext.currentTime + duration)
}

// Canvas Background Animation
const canvas = document.getElementById("bgCanvas")
const ctx = canvas.getContext("2d")

canvas.width = window.innerWidth
canvas.height = window.innerHeight

let mouseX = 0
let mouseY = 0

window.addEventListener("resize", () => {
  canvas.width = window.innerWidth
  canvas.height = window.innerHeight
})

document.addEventListener("mousemove", (e) => {
  mouseX = e.clientX
  mouseY = e.clientY
})

// Grid lines
const gridLines = []
const gridSize = 50

for (let i = 0; i < canvas.height / gridSize + 1; i++) {
  gridLines.push({
    y: i * gridSize,
    offset: Math.random() * 100,
  })
}

function drawGrid() {
  ctx.clearRect(0, 0, canvas.width, canvas.height)

  ctx.strokeStyle = "rgba(255, 0, 128, 0.1)"
  ctx.lineWidth = 1

  // Horizontal lines
  gridLines.forEach((line, index) => {
    ctx.beginPath()
    const yPos = (line.y + line.offset) % canvas.height
    ctx.moveTo(0, yPos)
    ctx.lineTo(canvas.width, yPos)
    ctx.stroke()

    line.offset += 0.2
  })

  // Vertical lines
  for (let x = 0; x < canvas.width; x += gridSize) {
    ctx.beginPath()
    ctx.moveTo(x, 0)
    ctx.lineTo(x, canvas.height)
    ctx.stroke()
  }

  // Mouse glow effect
  const gradient = ctx.createRadialGradient(mouseX, mouseY, 0, mouseX, mouseY, 200)
  gradient.addColorStop(0, "rgba(0, 255, 255, 0.1)")
  gradient.addColorStop(1, "rgba(0, 255, 255, 0)")
  ctx.fillStyle = gradient
  ctx.fillRect(0, 0, canvas.width, canvas.height)

  requestAnimationFrame(drawGrid)
}

drawGrid()

// Floating Particles
const particlesContainer = document.getElementById("particles")

function createParticle() {
  const particle = document.createElement("div")
  particle.className = "particle"
  particle.style.left = Math.random() * 100 + "%"
  particle.style.top = Math.random() * 100 + "%"
  particle.style.animationDuration = Math.random() * 3 + 2 + "s"
  particle.style.animationDelay = Math.random() * 2 + "s"
  particlesContainer.appendChild(particle)

  setTimeout(() => {
    particle.remove()
  }, 5000)
}

// Create particles periodically
setInterval(createParticle, 500)

// Initial particles
for (let i = 0; i < 20; i++) {
  createParticle()
}

// Login System
const loginForm = document.getElementById("loginForm")
const loginScreen = document.getElementById("loginScreen")
const mainContent = document.getElementById("mainContent")
const loginError = document.getElementById("loginError")

const credentials = {
  username: "luky",
  password: "dev123",
}

loginForm.addEventListener("submit", (e) => {
  e.preventDefault()

  const username = document.getElementById("username").value
  const password = document.getElementById("password").value

  if (username === credentials.username && password === credentials.password) {
    sounds.success()
    loginError.classList.remove("show")

    setTimeout(() => {
      loginScreen.classList.add("hidden")
      mainContent.classList.remove("hidden")
      animateStats()
      animateSkills()
    }, 500)
  } else {
    sounds.error()
    loginError.textContent = "⚠ ACESSO NEGADO: Credenciais inválidas"
    loginError.classList.add("show")
  }
})

// Logout
document.getElementById("logoutBtn").addEventListener("click", () => {
  sounds.click()
  mainContent.classList.add("hidden")
  loginScreen.classList.remove("hidden")
  loginForm.reset()
  loginError.classList.remove("show")
})

// Navigation
const navItems = document.querySelectorAll(".nav-item")
const contentSections = document.querySelectorAll(".content-section")

navItems.forEach((item) => {
  item.addEventListener("click", () => {
    sounds.click()

    const targetSection = item.getAttribute("data-section")

    navItems.forEach((nav) => nav.classList.remove("active"))
    item.classList.add("active")

    contentSections.forEach((section) => {
      section.classList.remove("active")
      if (section.id === targetSection) {
        section.classList.add("active")

        if (targetSection === "skills") {
          animateSkills()
        }
      }
    })
  })

  item.addEventListener("mouseenter", () => {
    sounds.hover()
  })
})

// Animate Stats Counter
function animateStats() {
  const statNumbers = document.querySelectorAll(".stat-number")

  statNumbers.forEach((stat) => {
    const target = Number.parseInt(stat.getAttribute("data-target"))
    let current = 0
    const increment = target / 50

    const updateCounter = () => {
      if (current < target) {
        current += increment
        stat.textContent = Math.ceil(current)
        requestAnimationFrame(updateCounter)
      } else {
        stat.textContent = target
      }
    }

    updateCounter()
  })
}

// Animate Skills Progress
function animateSkills() {
  const skillProgress = document.querySelectorAll(".skill-progress")

  skillProgress.forEach((progress) => {
    const targetWidth = progress.getAttribute("data-progress")
    progress.style.width = targetWidth + "%"
  })
}

// Contact Form
document.getElementById("contactForm").addEventListener("submit", (e) => {
  e.preventDefault()
  sounds.success()
  alert("✓ MENSAGEM ENVIADA COM SUCESSO!\n\nRetornaremos em breve.")
  e.target.reset()
})

// Project and Achievement hover sounds
document
  .querySelectorAll(".project-card, .achievement-card, .stat-card, .skill-card, .contact-item")
  .forEach((card) => {
    card.addEventListener("mouseenter", () => {
      sounds.hover()
    })
  })

// Button clicks
document.querySelectorAll(".btn-project, .btn-submit").forEach((btn) => {
  btn.addEventListener("click", () => {
    sounds.click()
  })
})

// Parallax mouse effect
document.addEventListener("mousemove", (e) => {
  const cards = document.querySelectorAll(".project-card, .skill-card, .achievement-card, .stat-card")

  cards.forEach((card) => {
    const rect = card.getBoundingClientRect()
    const x = e.clientX - rect.left - rect.width / 2
    const y = e.clientY - rect.top - rect.height / 2

    const rotateX = (y / rect.height) * 5
    const rotateY = (x / rect.width) * -5

    card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`
  })
})

// Reset card transform on mouse leave
document.querySelectorAll(".project-card, .skill-card, .achievement-card, .stat-card").forEach((card) => {
  card.addEventListener("mouseleave", () => {
    card.style.transform = "perspective(1000px) rotateX(0deg) rotateY(0deg)"
  })
})

console.log("[v0] Portfolio carregado com sucesso! 🚀")

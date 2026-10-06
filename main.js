// SCRIPT DE DINAMISMO DE FONDO (PARTÍCULAS)
const canvas = document.getElementById('bgCanvas');
const ctx = canvas.getContext('2d');

let particlesArray = [];
let mouse = { x: null, y: null, radius: 120 };

// Ajustar tamaño del canvas al redimensionar la ventana
function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
window.addEventListener('resize', resizeCanvas);
resizeCanvas();

// Capturar movimiento del mouse (opcional para interactividad)
window.addEventListener('mousemove', function(event) {
    mouse.x = event.clientX;
    mouse.y = event.clientY;
});

// Clase de cada partícula/estrella flotante
class Particle {
    constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 2.5 + 1; // Tamaño sutil y elegante
        this.speedX = Math.random() * 0.6 - 0.3; // Velocidad horizontal suave
        this.speedY = Math.random() * 0.6 - 0.3; // Velocidad vertical suave
        this.opacity = Math.random() * 0.5 + 0.3;
    }

    update() {
        this.x += this.speedX;
        this.y += this.speedY;

        // Rebote en los bordes de la pantalla
        if (this.x < 0 || this.x > canvas.width) this.speedX = -this.speedX;
        if (this.y < 0 || this.y > canvas.height) this.speedY = -this.speedY;
    }

    draw() {
        ctx.fillStyle = `rgba(212, 175, 55, ${this.opacity})`; // Color dorado acorde a una graduación
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
    }
}

// Inicializar partículas
function initParticles() {
    particlesArray = [];
    let numberOfParticles = (canvas.width * canvas.height) / 9000; // Densidad adaptable a pantallas móviles y PC
    for (let i = 0; i < numberOfParticles; i++) {
        particlesArray.push(new Particle());
    }
}
initParticles();

// Animación fluida
function animateBackground() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    for (let i = 0; i < particlesArray.length; i++) {
        particlesArray[i].update();
        particlesArray[i].draw();

        // Opcional: Conectar partículas cercanas con líneas tenues para mayor dinamismo
        for (let j = i; j < particlesArray.length; j++) {
            let dx = particlesArray[i].x - particlesArray[j].x;
            let dy = particlesArray[i].y - particlesArray[j].y;
            let distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < 100) {
                ctx.strokeStyle = `rgba(212, 175, 55, ${0.12 * (1 - distance/100)})`;
                ctx.lineWidth = 0.5;
                ctx.beginPath();
                ctx.moveTo(particlesArray[i].x, particlesArray[i].y);
                ctx.lineTo(particlesArray[j].x, particlesArray[j].y);
                ctx.stroke();
            }
        }
    }
    requestAnimationFrame(animateBackground);
}
animateBackground();

// Fecha futura de ejemplo para la graduación
const eventDate = new Date("July 10, 2027 10:00:00").getTime();

function updateCountdown() {
    const now = new Date().getTime();
    const distance = eventDate - now;

    if (distance < 0) {
        document.getElementById("days").innerText = "00";
        document.getElementById("hours").innerText = "00";
        document.getElementById("minutes").innerText = "00";
        document.getElementById("seconds").innerText = "00";
        return;
    }

    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    document.getElementById("days").innerText = String(days).padStart(2, '0');
    document.getElementById("hours").innerText = String(hours).padStart(2, '0');
    document.getElementById("minutes").innerText = String(minutes).padStart(2, '0');
    document.getElementById("seconds").innerText = String(seconds).padStart(2, '0');
}

setInterval(updateCountdown, 1000);
updateCountdown();

// Sistema de Notificaciones Toast flotantes elegantes
function showToast(iconClass, message) {
    const toast = document.getElementById("toast");
    const toastText = document.getElementById("toastText");
    const toastIcon = document.getElementById("toastIcon");

    toastIcon.className = `fa-solid ${iconClass}`;
    toastText.innerText = message;

    toast.className = "show";
    setTimeout(function(){ 
        toast.className = toast.className.replace("show", ""); 
    }, 3000);
}

// Control de música ambiental
let isPlaying = false;
function toggleMusic() {
    isPlaying = !isPlaying;
    const icon = document.getElementById("musicIcon");
    if (isPlaying) {
        icon.className = "fa-solid fa-volume-high";
        showToast("fa-volume-high", "Música ambiental activada.");
    } else {
        icon.className = "fa-solid fa-music";
        showToast("fa-music", "Música ambiental pausada.");
    }
}

// Manejo del RSVP con mensaje cool y alentador
function handleRSVP(event) {
    event.preventDefault();
    
    const nombre = document.getElementById("nombre").value;
    const asistentes = document.getElementById("asistentes").value;

    // Personalizar texto con los datos ingresados
    const textElement = document.getElementById("successMessageText");
    textElement.innerHTML = `¡Excelente <strong>${nombre}</strong>! Tus <strong>${asistentes} lugares</strong> están confirmados. ¡Qué orgullo tan grande celebrar juntos el cierre de esta maravillosa etapa y el inicio de un futuro brillante!`;

    // Ocultar formulario y mostrar tarjeta de éxito con animación
    document.getElementById("rsvpForm").style.display = "none";
    document.getElementById("successCard").style.display = "block";
    
    showToast("fa-circle-check", "¡Asistencia confirmada con éxito!");
}

// Restablecer formulario por si desean cambiar algo
function resetForm() {
    document.getElementById("rsvpForm").reset();
    document.getElementById("successCard").style.display = "none";
    document.getElementById("rsvpForm").style.display = "flex";
    showToast("fa-rotate-right", "Puedes modificar tus datos.");
}
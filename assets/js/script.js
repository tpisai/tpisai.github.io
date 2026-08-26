const startButton = document.getElementById("startButton");
const secretButton = document.getElementById("secretButton");
const secretMessage = document.getElementById("secretMessage");
const letterButton = document.getElementById("letterButton");
const letterContent = document.getElementById("letterContent");
const celebrateButton = document.getElementById("celebrateButton");

const anniversaryDate = new Date("2025-08-30T16:54:00");

function updateCounter() {
    const now = new Date();
    let difference = now - anniversaryDate;

    if (difference < 0) {
        difference = 0;
    }

    const totalSeconds = Math.floor(difference / 1000);
    const days = Math.floor(totalSeconds / 86400);
    const hours = Math.floor((totalSeconds % 86400) / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    document.getElementById("days").textContent = days;
    document.getElementById("hours").textContent = String(hours).padStart(2, "0");
    document.getElementById("minutes").textContent = String(minutes).padStart(2, "0");
    document.getElementById("seconds").textContent = String(seconds).padStart(2, "0");
}

updateCounter();
setInterval(updateCounter, 1000);

startButton.addEventListener("click", () => {
    document.getElementById("historia").scrollIntoView({
        behavior: "smooth"
    });
});

secretButton.addEventListener("click", () => {
    secretMessage.classList.toggle("show");

    if (secretMessage.classList.contains("show")) {
        secretButton.textContent = "Cerrar nuestro secreto";
    } else {
        secretButton.textContent = "Abrir nuestro secreto";
    }
});

letterButton.addEventListener("click", () => {
    letterContent.classList.toggle("show");

    if (letterContent.classList.contains("show")) {
        letterButton.textContent = "Cerrar carta";
        letterContent.scrollIntoView({
            behavior: "smooth",
            block: "center"
        });
    } else {
        letterButton.textContent = "Abrir carta";
    }
});

const revealElements = document.querySelectorAll(".reveal");

const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
        if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            revealObserver.unobserve(entry.target);
        }
    });
}, {
    threshold: 0.12
});

revealElements.forEach((element) => {
    revealObserver.observe(element);
});

function createPetal() {
    const petal = document.createElement("div");
    petal.className = "petal";
    petal.textContent = Math.random() > 0.5 ? "✿" : "♡";

    petal.style.left = Math.random() * 100 + "vw";
    petal.style.animationDuration = (5 + Math.random() * 5) + "s";
    petal.style.fontSize = (0.7 + Math.random() * 1.1) + "rem";
    petal.style.opacity = 0.35 + Math.random() * 0.45;

    document.body.appendChild(petal);

    setTimeout(() => {
        petal.remove();
    }, 10000);
}

function celebration() {
    for (let i = 0; i < 35; i++) {
        setTimeout(createPetal, i * 60);
    }
}

celebrateButton.addEventListener("click", celebration);


const floralCorners = document.querySelectorAll(".floral-corner");
window.addEventListener("mousemove", (event) => {
    const x = (event.clientX / window.innerWidth - 0.5) * 8;
    const y = (event.clientY / window.innerHeight - 0.5) * 8;
    floralCorners.forEach((flower, index) => {
        flower.style.marginLeft = `${x * (index === 0 ? 1 : -1)}px`;
        flower.style.marginTop = `${y * (index === 0 ? 1 : -1)}px`;
    });
});

document.querySelectorAll("img").forEach((image) => {
    image.addEventListener("error", () => {
        if (image.src.includes("/img/")) {
            image.style.display = "none";
            image.parentElement.classList.add("missing-photo");
        }
    });
});

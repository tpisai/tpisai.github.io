const startButton = document.getElementById("startButton");
const secretButton = document.getElementById("secretButton");
const secretMessage = document.getElementById("secretMessage");
const letterButton = document.getElementById("letterButton");
const letterContent = document.getElementById("letterContent");
const celebrateButton = document.getElementById("celebrateButton");
const particleLayer = document.getElementById("particleLayer");
const scrollProgress = document.getElementById("scrollProgress");
const cursorGlow = document.getElementById("cursorGlow");
const floatingQuote = document.getElementById("floatingQuote");
const sparkleButton = document.getElementById("sparkleButton");
const midnightButton = document.getElementById("midnightButton");
const midnightReveal = document.getElementById("midnightReveal");

const anniversaryDate = new Date("2025-08-30T16:54:00");
const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/* =========================================================
   CONTADOR
   ========================================================= */
function updateCounter() {
    const now = new Date();
    let difference = now - anniversaryDate;
    if (difference < 0) difference = 0;

    const totalSeconds = Math.floor(difference / 1000);
    const days = Math.floor(totalSeconds / 86400);
    const hours = Math.floor((totalSeconds % 86400) / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    updateNumber("days", days, false);
    updateNumber("hours", hours, true);
    updateNumber("minutes", minutes, true);
    updateNumber("seconds", seconds, true);
}

function updateNumber(id, value, pad) {
    const element = document.getElementById(id);
    if (!element) return;
    const next = pad ? String(value).padStart(2, "0") : String(value);
    if (element.textContent !== next) {
        element.textContent = next;
        const parent = element.closest(".counter-item");
        if (parent && !prefersReducedMotion) {
            parent.classList.remove("tick");
            void parent.offsetWidth;
            parent.classList.add("tick");
        }
    }
}

updateCounter();
setInterval(updateCounter, 1000);

/* =========================================================
   ENTRADA + MICRO INTERACCIÓN
   ========================================================= */
startButton?.addEventListener("click", (event) => {
    createBurst(event.clientX, event.clientY, 16);
    document.getElementById("historia")?.scrollIntoView({ behavior: "smooth" });
});

/* Botón secreto */
secretButton?.addEventListener("click", (event) => {
    secretMessage.classList.toggle("show");

    if (secretMessage.classList.contains("show")) {
        secretButton.textContent = "Cerrar nuestro secreto";
        createBurst(event.clientX, event.clientY, 12);
    } else {
        secretButton.textContent = "Abrir nuestro secreto";
    }
});

/* Nuestro lado secreto */
midnightButton?.addEventListener("click", (event) => {
    if (!midnightReveal) return;
    const open = midnightReveal.classList.toggle("show");
    midnightReveal.setAttribute("aria-hidden", String(!open));
    midnightButton.querySelector("span").textContent = open
        ? "Cerrar nuestro lado secreto"
        : "Entrar en nuestro lado secreto";
    createBurst(event.clientX, event.clientY, open ? 22 : 10);
    if (open) {
        setTimeout(() => midnightReveal.scrollIntoView({ behavior: "smooth", block: "center" }), 180);
    }
});

/* Carta */
letterButton?.addEventListener("click", (event) => {
    letterContent.classList.toggle("show");

    if (letterContent.classList.contains("show")) {
        letterButton.textContent = "Cerrar carta";
        createBurst(event.clientX, event.clientY, 18);
        setTimeout(() => {
            letterContent.scrollIntoView({ behavior: "smooth", block: "center" });
        }, 120);
    } else {
        letterButton.textContent = "Abrir carta";
    }
});

/* =========================================================
   REVEAL AL HACER SCROLL
   ========================================================= */
const revealElements = document.querySelectorAll(".reveal");

const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
        if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            revealObserver.unobserve(entry.target);
        }
    });
}, {
    threshold: 0.1,
    rootMargin: "0px 0px -5% 0px"
});

revealElements.forEach((element) => revealObserver.observe(element));

// Fallback: si un navegador bloquea IntersectionObserver, la página nunca queda invisible.
setTimeout(() => {
    revealElements.forEach((element) => element.classList.add("visible"));
}, 1800);

// Marca que el motor interactivo ya está listo.
document.documentElement.classList.add("js-ready");

/* =========================================================
   PROGRESO DE LECTURA
   ========================================================= */
function updateScrollProgress() {
    const scrollTop = window.scrollY;
    const scrollable = document.documentElement.scrollHeight - window.innerHeight;
    const progress = scrollable > 0 ? (scrollTop / scrollable) * 100 : 0;
    if (scrollProgress) scrollProgress.style.width = `${progress}%`;

    if (floatingQuote) {
        floatingQuote.classList.toggle("show", scrollTop > window.innerHeight * 0.7);
    }
}

window.addEventListener("scroll", updateScrollProgress, { passive: true });
updateScrollProgress();

/* =========================================================
   LLUVIA DE FLORES / PÉTALOS
   ========================================================= */
const symbols = ["✿", "❀", "✧", "♡", "❁", "·"];
const classes = ["white", "white", "rose", "lilac", "white"];

function createParticle(options = {}) {
    if (!particleLayer) return;

    const particle = document.createElement("span");
    particle.className = `particle ${options.className || classes[Math.floor(Math.random() * classes.length)]}`;
    particle.textContent = options.symbol || symbols[Math.floor(Math.random() * symbols.length)];

    const size = options.size || (0.55 + Math.random() * 1.15);
    const duration = options.duration || (8 + Math.random() * 9);
    const drift = options.drift || `${-80 + Math.random() * 160}px`;

    particle.style.left = `${options.x ?? Math.random() * 100}vw`;
    particle.style.fontSize = `${size}rem`;
    particle.style.setProperty("--duration", `${duration}s`);
    particle.style.setProperty("--drift", drift);
    particle.style.opacity = options.opacity || (0.35 + Math.random() * 0.5);
    particle.style.animationDelay = options.delay || "0s";

    particleLayer.appendChild(particle);
    setTimeout(() => particle.remove(), (duration + 2) * 1000);
}

function startAmbientRain() {
    const reduced = prefersReducedMotion;
    const amount = reduced ? 5 : (window.innerWidth < 600 ? 12 : 20);
    for (let i = 0; i < amount; i++) {
        createParticle({ delay: `${Math.random() * -12}s` });
    }

    setInterval(() => {
        if (document.visibilityState === "visible") {
            createParticle({
                duration: reduced ? 16 + Math.random() * 5 : undefined,
                opacity: reduced ? .22 + Math.random() * .2 : undefined
            });
        }
    }, reduced ? 2800 : (window.innerWidth < 600 ? 1200 : 800));
}

startAmbientRain();

/* Lluvia especial */
function celebration() {

    for (let i = 0; i < 65; i++) {
        setTimeout(() => {
            createParticle({
                symbol: ["✿", "❀", "♡", "✧", "🌸"][Math.floor(Math.random() * 5)],
                className: Math.random() > .35 ? "white" : "rose",
                size: .7 + Math.random() * 1.4,
                duration: 5 + Math.random() * 5,
                opacity: .55 + Math.random() * .4
            });
        }, i * 45);
    }

    document.body.classList.add("celebrating");
    setTimeout(() => document.body.classList.remove("celebrating"), 2500);
}

celebrateButton?.addEventListener("click", (event) => {
    createBurst(event.clientX, event.clientY, 25);
    celebration();
});

sparkleButton?.addEventListener("click", (event) => {
    createBurst(event.clientX, event.clientY, 20);
    for (let i = 0; i < 22; i++) {
        setTimeout(() => createParticle({
            x: 30 + Math.random() * 40,
            symbol: ["✿", "❀", "♡", "✧"][Math.floor(Math.random() * 4)],
            size: .7 + Math.random() * 1.1,
            duration: 5 + Math.random() * 4
        }), i * 35);
    }
});

/* =========================================================
   EXPLOSIÓN DE ESTRELLAS AL TOCAR
   ========================================================= */
function createBurst(x, y, amount = 12) {

    const safeX = Number.isFinite(x) ? x : window.innerWidth / 2;
    const safeY = Number.isFinite(y) ? y : window.innerHeight / 2;
    const burstSymbols = ["✦", "♡", "✧", "·", "✿"];

    for (let i = 0; i < amount; i++) {
        const spark = document.createElement("span");
        spark.className = "spark-burst";
        spark.textContent = burstSymbols[Math.floor(Math.random() * burstSymbols.length)];
        spark.style.left = `${safeX}px`;
        spark.style.top = `${safeY}px`;
        spark.style.setProperty("--x", `${-90 + Math.random() * 180}px`);
        spark.style.setProperty("--y", `${-90 + Math.random() * 180}px`);
        spark.style.animationDelay = `${Math.random() * .08}s`;
        document.body.appendChild(spark);
        setTimeout(() => spark.remove(), 1100);
    }
}

/* =========================================================
   PARALLAX SUAVE DE LAS ESQUINAS FLORALES
   ========================================================= */
const floralCorners = document.querySelectorAll(".floral-corner");
window.addEventListener("mousemove", (event) => {
    if (window.matchMedia("(hover: none)").matches) return;

    const x = (event.clientX / window.innerWidth - 0.5) * 10;
    const y = (event.clientY / window.innerHeight - 0.5) * 10;

    floralCorners.forEach((flower, index) => {
        flower.style.transform = `translate(${x * (index === 0 ? 1 : -1)}px, ${y * (index === 0 ? 1 : -1)}px)`;
    });

    if (cursorGlow) {
        cursorGlow.style.left = `${event.clientX}px`;
        cursorGlow.style.top = `${event.clientY}px`;
    }
});

/* =========================================================
   BOTONES MAGNÉTICOS EN DESKTOP
   ========================================================= */
if (!prefersReducedMotion && !window.matchMedia("(hover: none)").matches) {
    document.querySelectorAll(".main-button, .final-button, .secret-button").forEach((button) => {
        button.addEventListener("mousemove", (event) => {
            const rect = button.getBoundingClientRect();
            const dx = (event.clientX - (rect.left + rect.width / 2)) * .08;
            const dy = (event.clientY - (rect.top + rect.height / 2)) * .08;
            button.style.transform = `translate(${dx}px, ${dy}px)`;
        });

        button.addEventListener("mouseleave", () => {
            button.style.transform = "";
        });
    });
}

/* =========================================================
   FOTOS FALLIDAS
   ========================================================= */
document.querySelectorAll("img").forEach((image) => {
    image.addEventListener("error", () => {
        if (image.src.includes("/img/")) {
            image.style.display = "none";
            image.parentElement?.classList.add("missing-photo");
        }
    });
});

/* =========================================================
   PEQUEÑOS DETALLES TÁCTILES
   ========================================================= */
document.querySelectorAll(".reason-card, .flower-card, .food-card, .timeline-card").forEach((card) => {
    card.addEventListener("pointerdown", (event) => {
        if (window.matchMedia("(hover: none)").matches && !prefersReducedMotion) {
            createBurst(event.clientX, event.clientY, 5);
        }
    });
});

/* =========================================================
   MICRO-MOVIMIENTO DE TARJETAS
   ========================================================= */
if (!prefersReducedMotion) {
    document.querySelectorAll(".reason-card, .flower-card, .food-card, .timeline-card").forEach((card) => {
        card.addEventListener("pointermove", (event) => {
            if (event.pointerType === "touch") return;
            const rect = card.getBoundingClientRect();
            const x = (event.clientX - rect.left) / rect.width - .5;
            const y = (event.clientY - rect.top) / rect.height - .5;
            card.style.transform = `perspective(900px) rotateX(${y * -3}deg) rotateY(${x * 3}deg) translateY(-7px)`;
        });
        card.addEventListener("pointerleave", () => { card.style.transform = ""; });
    });
}

/* =========================================================
   QUIZ — ¿CUÁNTO ME CONOCES?
   ========================================================= */
const quizCard = document.getElementById("quizCard");

if (quizCard) {
    const quizQuestions = Array.from(quizCard.querySelectorAll(".quiz-question"));
    const quizProgress = document.getElementById("quizProgress");
    const quizFeedback = document.getElementById("quizFeedback");
    const quizResult = document.getElementById("quizResult");
    const quizReplay = document.getElementById("quizReplay");
    const totalQuestions = quizQuestions.length;
    let currentQuestion = 0;
    let correctCount = 0;

    const correctFeedback = [
        "¡Exacto! Sabía que te acordarías.",
        "Sí. Ni lo dudaste, ¿no?",
        "Correcto. Presumida."
    ];
    const incorrectFeedback = [
        "Casi... pero te quiero igual.",
        "No era esa, pero linda igual.",
        "Fallaste, pero con estilo."
    ];

    function showQuestion(index) {
        quizQuestions.forEach((question, i) => {
            question.hidden = i !== index;
        });
        if (quizProgress) {
            quizProgress.textContent = `Pregunta ${index + 1} de ${totalQuestions}`;
        }
        if (quizFeedback) quizFeedback.textContent = "";
    }

    function handleAnswer(event) {
        const button = event.currentTarget;
        const questionEl = button.closest(".quiz-question");
        const options = questionEl.querySelectorAll(".quiz-option");
        const isCorrect = button.dataset.correct === "true";

        options.forEach((option) => {
            option.disabled = true;
            if (option.dataset.correct === "true") {
                option.classList.add("correct");
            } else if (option === button) {
                option.classList.add("incorrect");
            }
        });

        if (isCorrect) {
            correctCount += 1;
            if (!prefersReducedMotion) {
                const rect = button.getBoundingClientRect();
                createBurst(rect.left + rect.width / 2, rect.top, 10);
            }
        }

        if (quizFeedback) {
            const pool = isCorrect ? correctFeedback : incorrectFeedback;
            quizFeedback.textContent = pool[Math.floor(Math.random() * pool.length)];
        }

        setTimeout(() => {
            currentQuestion += 1;
            if (currentQuestion < totalQuestions) {
                showQuestion(currentQuestion);
            } else {
                quizQuestions.forEach((question) => { question.hidden = true; });
                if (quizProgress) quizProgress.textContent = "";
                if (quizFeedback) quizFeedback.textContent = "";
                if (quizResult) quizResult.hidden = false;
            }
        }, 1100);
    }

    quizQuestions.forEach((question) => {
        question.querySelectorAll(".quiz-option").forEach((option) => {
            option.addEventListener("click", handleAnswer);
        });
    });

    if (quizReplay) {
        quizReplay.addEventListener("click", () => {
            currentQuestion = 0;
            correctCount = 0;
            quizQuestions.forEach((question) => {
                question.querySelectorAll(".quiz-option").forEach((option) => {
                    option.disabled = false;
                    option.classList.remove("correct", "incorrect");
                });
            });
            if (quizResult) quizResult.hidden = true;
            showQuestion(0);
        });
    }
}

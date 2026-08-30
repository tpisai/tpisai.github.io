(() => {
  "use strict";

  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const touchDevice = "ontouchstart" in window || navigator.maxTouchPoints > 0;
  const particleLayer = $("#particleLayer");
  const cursorGlow = $("#cursorGlow");
  const scrollProgress = $("#scrollProgress");

  /* COUNTER */
  const anniversary = new Date("2025-08-30T16:54:00");
  const updateNumber = (id, value, pad = false) => {
    const el = $("#" + id);
    if (el) el.textContent = pad ? String(value).padStart(2, "0") : String(value);
  };
  function updateCounter() {
    const diff = Math.max(0, Date.now() - anniversary.getTime());
    const totalSeconds = Math.floor(diff / 1000);
    updateNumber("days", Math.floor(totalSeconds / 86400));
    updateNumber("hours", Math.floor((totalSeconds % 86400) / 3600), true);
    updateNumber("minutes", Math.floor((totalSeconds % 3600) / 60), true);
    updateNumber("seconds", totalSeconds % 60, true);
  }
  updateCounter();
  window.setInterval(updateCounter, 1000);

  /* SCROLL */
  let scrollTick = false;
  function updateScrollProgress() {
    const max = document.documentElement.scrollHeight - window.innerHeight;
    if (scrollProgress) scrollProgress.style.width = `${max > 0 ? (window.scrollY / max) * 100 : 0}%`;
    scrollTick = false;
  }
  window.addEventListener("scroll", () => {
    if (!scrollTick) {
      window.requestAnimationFrame(updateScrollProgress);
      scrollTick = true;
    }
  }, { passive: true });

  /* REVEAL */
  const revealObserver = "IntersectionObserver" in window
    ? new IntersectionObserver(entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            revealObserver.unobserve(entry.target);
          }
        });
      }, { threshold: 0.08, rootMargin: "0px 0px -5% 0px" })
    : null;
  $$(".reveal").forEach(el => revealObserver ? revealObserver.observe(el) : el.classList.add("visible"));

  /* SMALL BURST */
  function createBurst(x, y, amount = 12) {
    if (!document.body || reducedMotion) return;
    const safeX = Number.isFinite(x) ? x : innerWidth / 2;
    const safeY = Number.isFinite(y) ? y : innerHeight / 2;
    const symbols = ["✦", "♡", "✧", "✿", "❀"];
    for (let i = 0; i < amount; i++) {
      const spark = document.createElement("span");
      spark.className = "spark-burst";
      spark.textContent = symbols[Math.floor(Math.random() * symbols.length)];
      spark.style.left = `${safeX}px`;
      spark.style.top = `${safeY}px`;
      spark.style.setProperty("--x", `${-120 + Math.random() * 240}px`);
      spark.style.setProperty("--y", `${-120 + Math.random() * 240}px`);
      spark.style.animationDelay = `${Math.random() * .08}s`;
      document.body.appendChild(spark);
      window.setTimeout(() => spark.remove(), 1100);
    }
  }

  /* LIGHT AMBIENT PETALS */
  const ambientSymbols = ["✿", "❀", "♡"];
  function createAmbientParticle() {
    if (!particleLayer || reducedMotion || document.visibilityState !== "visible") return;
    const particle = document.createElement("span");
    particle.className = `particle ${Math.random() > .55 ? "rose" : "white"}`;
    particle.textContent = ambientSymbols[Math.floor(Math.random() * ambientSymbols.length)];
    const duration = 12 + Math.random() * 6;
    particle.style.left = `${Math.random() * 100}vw`;
    particle.style.fontSize = `${.5 + Math.random() * .75}rem`;
    particle.style.setProperty("--duration", `${duration}s`);
    particle.style.setProperty("--drift", `${-45 + Math.random() * 90}px`);
    particle.style.opacity = `${.18 + Math.random() * .28}`;
    particleLayer.appendChild(particle);
    window.setTimeout(() => particle.remove(), (duration + 1) * 1000);
  }
  if (!reducedMotion) {
    const initial = innerWidth < 600 ? 3 : 5;
    for (let i = 0; i < initial; i++) createAmbientParticle();
    window.setInterval(createAmbientParticle, innerWidth < 600 ? 3000 : 2600);
  }

  /* BUTTONS */
  $("#startButton")?.addEventListener("click", event => {
    createBurst(event.clientX, event.clientY, 14);
    $("#historia")?.scrollIntoView({ behavior: reducedMotion ? "auto" : "smooth" });
  });
/* =========================================================
   CELEBRACIÓN ESPECIAL — 1 AÑO
   ========================================================= */

let celebrationRunning = false;

function launchCelebration() {
console.log("LAUNCH CELEBRATION: ENTRÓ");
  if (celebrationRunning) return;

  celebrationRunning = true;

  let overlay = document.getElementById("celebrationOverlay");

  if (!overlay) {

    overlay = document.createElement("div");

    overlay.id = "celebrationOverlay";
    overlay.className = "celebration-overlay";

    overlay.innerHTML = `
      <div class="celebration-ring"></div>
      <div class="celebration-ring"></div>
      <div class="celebration-flash"></div>

      <div class="celebration-core">

        <span class="celebration-kicker">
          30.08.2025 → 30.08.2026
        </span>

        <div class="celebration-title">
          1 <span>♥</span>
        </div>

        <h3>
          año de nosotros
        </h3>

        <p>
          Y todavía siento que esto apenas comienza.
        </p>

      </div>
    `;

    document.body.appendChild(overlay);
  }

  /* Mostrar la celebración */
  requestAnimationFrame(() => {
    overlay.classList.add("show");
    console.log("LAUNCH CELEBRATION: OVERLAY MOSTRADO");
  });

  /* ---------------------------------------------------------
     EXPLOSIÓN INICIAL
     --------------------------------------------------------- */

  createBurst(
    window.innerWidth / 2,
    window.innerHeight / 2,
    35
  );

  /* ---------------------------------------------------------
     PEQUEÑOS DESTELLOS ALREDEDOR
     --------------------------------------------------------- */

  const symbols = [
    "♥",
    "♡",
    "💗",
    "🤍",
    "🌸",
    "🌷",
    "🌼",
    "🌺",
    "✦",
    "✨",
    "❀"
  ];

  for (let i = 0; i < 35; i++) {

    window.setTimeout(() => {

      const piece = document.createElement("span");

      piece.className = "celebration-piece";

      piece.textContent =
        symbols[
          Math.floor(Math.random() * symbols.length)
        ];

      piece.style.left =
        `${Math.random() * 100}vw`;

      piece.style.fontSize =
        `${0.9 + Math.random() * 1.2}rem`;

      piece.style.setProperty(
        "--duration",
        `${3 + Math.random() * 3}s`
      );

      piece.style.setProperty(
        "--drift",
        `${-160 + Math.random() * 320}px`
      );

      piece.style.setProperty(
        "--spin",
        `${-540 + Math.random() * 1080}deg`
      );

      overlay.appendChild(piece);

      window.setTimeout(() => {
        piece.remove();
      }, 7000);

    }, i * 70);
  }

  /* ---------------------------------------------------------
     SEGUNDO IMPACTO
     --------------------------------------------------------- */

  window.setTimeout(() => {

    createBurst(
      window.innerWidth / 2,
      window.innerHeight / 2,
      25
    );

    overlay.classList.add("impact");

  }, 700);

  /* ---------------------------------------------------------
     SEGUNDA OLEADA DE ELEMENTOS
     --------------------------------------------------------- */

  window.setTimeout(() => {

    for (let i = 0; i < 20; i++) {

      window.setTimeout(() => {

        const piece = document.createElement("span");

        piece.className = "celebration-piece";

        piece.textContent =
          symbols[
            Math.floor(Math.random() * symbols.length)
          ];

        piece.style.left =
          `${Math.random() * 100}vw`;

        piece.style.fontSize =
          `${0.8 + Math.random() * 1.1}rem`;

        piece.style.setProperty(
          "--duration",
          `${3.5 + Math.random() * 2.5}s`
        );

        piece.style.setProperty(
          "--drift",
          `${-200 + Math.random() * 400}px`
        );

        piece.style.setProperty(
          "--spin",
          `${-720 + Math.random() * 1440}deg`
        );

        overlay.appendChild(piece);

        window.setTimeout(() => {
          piece.remove();
        }, 7000);

      }, i * 55);
    }

  }, 1300);

  /* ---------------------------------------------------------
     CERRAR CELEBRACIÓN
     --------------------------------------------------------- */

  window.setTimeout(() => {

    overlay.classList.remove("show");
    overlay.classList.remove("impact");

    window.setTimeout(() => {

      overlay.remove();

      celebrationRunning = false;

    }, 700);

  }, 6500);
}


/* =========================================================
   BOTÓN — CELEBRAR NUESTRO AÑO
   ========================================================= */
console.log("BOTÓN DE CELEBRAR: SCRIPT CARGADO");
$("#celebrateButton")?.addEventListener(
  "click",
  event => {
    console.log("BOTÓN DE CELEBRAR: CLICK");
    if (celebrationRunning) return;
    /* Pequeña explosión desde el botón */
    createBurst(
      event.clientX,
      event.clientY,
      25
    );
    /* Lanzar celebración completa */
    launchCelebration();
  }
);


  /* BASIC SECRET */
  $("#secretButton")?.addEventListener("click", event => {
    const message = $("#secretMessage");
    const button = $("#secretButton");
    if (!message || !button) return;
    const open = message.classList.toggle("show");
    button.textContent = open ? "Cerrar recuerdos privados" : "🔐 Abrir recuerdos privados";
    if (open) {
      createBurst(event.clientX, event.clientY, 18);
    }
  });

  /* MIDNIGHT SECRET */
  $("#midnightButton")?.addEventListener("click", event => {
    const reveal = $("#midnightReveal");
    const label = $("#midnightButton span");
    if (!reveal || !label) return;
    const open = reveal.classList.toggle("show");
    reveal.setAttribute("aria-hidden", String(!open));
    label.textContent = open ? "Cerrar nuestro lado secreto" : "Abrir solo si estás lista para sonrojarte";
    createBurst(event.clientX, event.clientY, open ? 24 : 8);
    if (open) {
      window.setTimeout(() => reveal.scrollIntoView({ behavior: reducedMotion ? "auto" : "smooth", block: "center" }), 180);
    }
  });

  /* LETTER */
  $("#letterButton")?.addEventListener("click", event => {
    const content = $("#letterContent");
    const button = $("#letterButton");
    if (!content || !button) return;
    const open = content.classList.toggle("show");
    button.textContent = open ? "Cerrar carta" : "Abrir carta";
    if (open) {
      createBurst(event.clientX, event.clientY, 14);
      window.setTimeout(() => content.scrollIntoView({ behavior: reducedMotion ? "auto" : "smooth", block: "center" }), 120);
    }
  });

  /* PRIVATE GALLERY */
  $$(".private-card").forEach(card => {
    const image = $(".private-image", card);
    const source = card.dataset.src;
    if (image && source) {
      image.addEventListener("load", () => {
        image.classList.add("ready");
        card.classList.remove("no-photo");
      }, { once: true });
      image.addEventListener("error", () => card.classList.add("no-photo"), { once: true });
      image.src = source;
    }
    card.addEventListener("click", () => {
      card.classList.toggle("is-open");
      if (!reducedMotion && card.classList.contains("is-open")) {
        const rect = card.getBoundingClientRect();
        createBurst(rect.left + rect.width / 2, rect.top + 40, 10);
      }
    });
  });

  /* QUIZ */
  const quizCard = $("#quizCard");
  if (quizCard) {
    const questions = $$(".quiz-question", quizCard);
    const progress = $("#quizProgress");
    const feedback = $("#quizFeedback");
    const result = $("#quizResult");
    const replay = $("#quizReplay");
    let current = 0;
    let score = 0;
    const correctFeedback = ["¡Exacto! Sabía que te acordarías.", "Sí. Ni lo dudaste, ¿no?", "Correcto. Presumida."];
    const incorrectFeedback = ["Casi... pero te quiero igual.", "No era esa, pero linda igual.", "Fallaste, pero con estilo."];
    function showQuestion(index) {
      questions.forEach((q, i) => q.hidden = i !== index);
      if (progress) progress.textContent = `Pregunta ${index + 1} de ${questions.length}`;
      if (feedback) feedback.textContent = "";
    }
    function answer(event) {
      const button = event.currentTarget;
      const question = button.closest(".quiz-question");
      const options = $$(".quiz-option", question);
      const correct = button.dataset.correct === "true";
      options.forEach(option => {
        option.disabled = true;
        if (option.dataset.correct === "true") option.classList.add("correct");
        else if (option === button) option.classList.add("incorrect");
      });
      if (correct) {
        score++;
        const rect = button.getBoundingClientRect();
        createBurst(rect.left + rect.width / 2, rect.top, 8);
      }
      if (feedback) {
        const pool = correct ? correctFeedback : incorrectFeedback;
        feedback.textContent = pool[Math.floor(Math.random() * pool.length)];
      }
      window.setTimeout(() => {
        current++;
        if (current < questions.length) showQuestion(current);
        else {
          questions.forEach(q => q.hidden = true);
          if (progress) progress.textContent = `${score}/${questions.length} correctas`;
          if (feedback) feedback.textContent = "";
          if (result) result.hidden = false;
        }
      }, 1050);
    }
    questions.forEach(q => $$(".quiz-option", q).forEach(option => option.addEventListener("click", answer)));
    replay?.addEventListener("click", () => {
      current = 0;
      score = 0;
      questions.forEach(q => $$(".quiz-option", q).forEach(option => {
        option.disabled = false;
        option.classList.remove("correct", "incorrect");
      }));
      if (result) result.hidden = true;
      showQuestion(0);
    });
  }

  /* POINTER DETAILS */
  if (!reducedMotion && !touchDevice) {
    window.addEventListener("pointermove", event => {
      const x = (event.clientX / innerWidth - .5) * 6;
      const y = (event.clientY / innerHeight - .5) * 6;
      $$(".floral-corner-left").forEach(el => el.style.transform = `translate(${x}px,${y}px)`);
      $$(".floral-corner-right").forEach(el => el.style.transform = `translate(${-x}px,${-y}px)`);
      if (cursorGlow) {
        cursorGlow.style.left = `${event.clientX}px`;
        cursorGlow.style.top = `${event.clientY}px`;
      }
    }, { passive: true });

    $$(".memory-card,.reason-card,.flower-card,.food-card").forEach(card => {
      card.addEventListener("pointermove", event => {
        if (event.pointerType === "touch") return;
        const rect = card.getBoundingClientRect();
        const x = (event.clientX - rect.left) / rect.width - .5;
        const y = (event.clientY - rect.top) / rect.height - .5;
        card.style.transform = `perspective(900px) rotateX(${y * -2}deg) rotateY(${x * 2}deg) translateY(-4px)`;
      });
      card.addEventListener("pointerleave", () => card.style.transform = "");
    });
  }

  updateScrollProgress();
  document.documentElement.classList.add("js-ready");
})();

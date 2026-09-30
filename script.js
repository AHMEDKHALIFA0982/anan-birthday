const intro = document.getElementById("intro");
const loadingScreen = document.getElementById("loadingScreen");
const mainContent = document.getElementById("mainContent");
const openBtn = document.getElementById("openBtn");
const musicToggle = document.getElementById("musicToggle");
const progressBar = document.getElementById("progressBar");
const ageStatus = document.getElementById("ageStatus");
const maturityStatus = document.getElementById("maturityStatus");
const chaosStatus = document.getElementById("chaosStatus");
const loadingMessage = document.getElementById("loadingMessage");

let musicOn = true;

// Uses the 30-second clip from 1:50 to 2:20 of the uploaded song.
const birthdayMusic = new Audio("assets/birthday-music.mp3");
birthdayMusic.loop = true;
birthdayMusic.preload = "auto";
birthdayMusic.volume = 0.72;

async function startMusic() {
  if (!musicOn) return;
  try {
    birthdayMusic.currentTime = 0;
    await birthdayMusic.play();
  } catch (err) {
    console.log("Audio playback needs a user interaction.", err);
  }
}

function stopMusic() {
  birthdayMusic.pause();
}

musicToggle.addEventListener("click", async () => {
  musicOn = !musicOn;
  musicToggle.textContent = musicOn ? "🔊 Music ON" : "🔇 Music OFF";

  if (musicOn) {
    try {
      await birthdayMusic.play();
    } catch (err) {
      console.log("Could not resume audio.", err);
    }
  } else {
    stopMusic();
  }
});

openBtn.addEventListener("click", async () => {
  intro.classList.add("hidden");
  loadingScreen.classList.remove("hidden");
  musicToggle.classList.remove("hidden");
  startMusic();

  const steps = [
    { p: 18, age: "Scanning...", maturity: "...", chaos: "...", msg: "Please do not unplug Anan." },
    { p: 37, age: "Found ✅", maturity: "Searching...", chaos: "...", msg: "Checking cake compatibility..." },
    { p: 58, age: "Classified 😎", maturity: "ERROR ❌", chaos: "Scanning...", msg: "Maturity module could not be located." },
    { p: 79, age: "Classified 😎", maturity: "ERROR ❌", chaos: "94% ⚠️", msg: "Warning: unusually high chaos detected." },
    { p: 100, age: "+1 added ✅", maturity: "Still loading...", chaos: "MAXIMUM 😂", msg: "Upgrade successful. Welcome to Anan v2026." }
  ];

  for (const step of steps) {
    progressBar.style.width = step.p + "%";
    ageStatus.textContent = step.age;
    maturityStatus.textContent = step.maturity;
    chaosStatus.textContent = step.chaos;
    loadingMessage.textContent = step.msg;
    await sleep(720);
  }

  await sleep(500);
  loadingScreen.classList.add("hidden");
  mainContent.classList.remove("hidden");
  confettiBurst(window.innerWidth / 2, window.innerHeight * 0.3, 180);
  setupRevealAnimations();
});

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// Rotating hero jokes
const jokes = [
  "Another year older. Still no user manual.",
  "Congratulations, you survived another year 😂",
  "Level up unlocked: Anan v2026 🎮",
  "Age increased. Maturity update still pending.",
  "Birthday mode: ON. Responsibilities: OFF."
];

let jokeIndex = 0;
const rotatingText = document.getElementById("rotatingText");

setInterval(() => {
  if (!rotatingText) return;
  jokeIndex = (jokeIndex + 1) % jokes.length;
  rotatingText.animate(
    [
      { opacity: 0, transform: "translateY(8px)" },
      { opacity: 1, transform: "translateY(0)" }
    ],
    { duration: 420, easing: "ease" }
  );
  rotatingText.textContent = jokes[jokeIndex];
}, 3200);

// Reveal on scroll
function setupRevealAnimations() {
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add("visible");

      const meter = entry.target.querySelector(".meter");
      if (meter) meter.classList.add("animated");

      observer.unobserve(entry.target);
    });
  }, { threshold: 0.18 });

  document.querySelectorAll(".reveal").forEach(el => observer.observe(el));

  document.querySelectorAll(".stat-card").forEach(card => {
    const localMeter = card.querySelector(".meter");
    if (!localMeter) return;
    const meterObserver = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting) {
        localMeter.classList.add("animated");
        meterObserver.disconnect();
      }
    }, { threshold: .4 });
    meterObserver.observe(card);
  });
}

// Quiz
const quizResult = document.getElementById("quizResult");
document.querySelectorAll(".quiz-btn").forEach(btn => {
  btn.addEventListener("click", () => {
    quizResult.classList.remove("hidden");
    quizResult.textContent = "Correct! Somehow. 😂 Every answer was suspiciously acceptable.";
    confettiBurst(window.innerWidth / 2, window.innerHeight / 2, 65);
  });
});

// Don't-click button
const dontClickBtn = document.getElementById("dontClickBtn");
const dangerText = document.getElementById("dangerText");
let dangerClicks = 0;

dontClickBtn.addEventListener("click", () => {
  dangerClicks++;

  document.body.classList.remove("shake");
  void document.body.offsetWidth;
  document.body.classList.add("shake");

  const messages = [
    "🚨 ALERT: Birthday person detected!",
    "I literally said DO NOT CLICK 😭",
    "Anan.exe is ignoring instructions again.",
    "Okay... now you've activated MAXIMUM CHAOS.",
    "You know what? Keep clicking 😂"
  ];

  dangerText.textContent = messages[Math.min(dangerClicks - 1, messages.length - 1)];
  confettiBurst(
    Math.random() * window.innerWidth,
    Math.random() * window.innerHeight * .6,
    90
  );
});

// Gift
const giftBtn = document.getElementById("giftBtn");
const giftReveal = document.getElementById("giftReveal");
const finalPartyBtn = document.getElementById("finalPartyBtn");

giftBtn.addEventListener("click", () => {
  giftBtn.classList.add("open");
  setTimeout(() => {
    giftReveal.classList.remove("hidden");
    confettiBurst(window.innerWidth / 2, window.innerHeight / 2, 140);
  }, 420);
});

finalPartyBtn.addEventListener("click", () => {
  for (let i = 0; i < 6; i++) {
    setTimeout(() => {
      confettiBurst(
        Math.random() * window.innerWidth,
        Math.random() * window.innerHeight * .8,
        120
      );
    }, i * 260);
  }
});

// Confetti engine
const canvas = document.getElementById("fxCanvas");
const ctx = canvas.getContext("2d");
let particles = [];

function resizeCanvas() {
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  canvas.width = innerWidth * dpr;
  canvas.height = innerHeight * dpr;
  canvas.style.width = innerWidth + "px";
  canvas.style.height = innerHeight + "px";
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
}

window.addEventListener("resize", resizeCanvas);
resizeCanvas();

const colors = ["#9f7aea", "#56d8e4", "#ff6bb5", "#ffd166", "#ffffff"];

function confettiBurst(x, y, count = 100) {
  for (let i = 0; i < count; i++) {
    particles.push({
      x, y,
      vx: (Math.random() - .5) * 11,
      vy: -Math.random() * 8 - 2,
      g: .16 + Math.random() * .09,
      size: 5 + Math.random() * 6,
      rot: Math.random() * Math.PI,
      vr: (Math.random() - .5) * .25,
      life: 110 + Math.random() * 55,
      color: colors[Math.floor(Math.random() * colors.length)]
    });
  }
}

function animateParticles() {
  ctx.clearRect(0, 0, innerWidth, innerHeight);

  particles = particles.filter(p => p.life > 0);

  particles.forEach(p => {
    p.x += p.vx;
    p.y += p.vy;
    p.vy += p.g;
    p.vx *= .995;
    p.rot += p.vr;
    p.life--;

    ctx.save();
    ctx.translate(p.x, p.y);
    ctx.rotate(p.rot);
    ctx.globalAlpha = Math.min(1, p.life / 35);
    ctx.fillStyle = p.color;
    ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * .65);
    ctx.restore();
  });

  requestAnimationFrame(animateParticles);
}

animateParticles();

const canvas = document.getElementById("treeCanvas");
const ctx = canvas.getContext("2d");

const starCanvas = document.getElementById("starfield");
const starCtx = starCanvas.getContext("2d");

let width = 0;
let height = 0;
let particles = [];
let snowflakes = [];
let animationId = null;

let starWidth = 0;
let starHeight = 0;
let stars = [];
let starAnimationId = null;
let chapterObserver;

const STAR_POINTS = 48;
const TREE_POINTS = 620;
const TRUNK_POINTS = 70;
const SNOW_COUNT = 120;
const STARFIELD_COUNT = 180;

const resize = () => {
  width = canvas.clientWidth;
  height = canvas.clientHeight;
  const dpr = window.devicePixelRatio || 1;
  canvas.width = width * dpr;
  canvas.height = height * dpr;
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
};

const resizeStarfield = () => {
  starWidth = starCanvas.clientWidth;
  starHeight = starCanvas.clientHeight;
  const dpr = window.devicePixelRatio || 1;
  starCanvas.width = starWidth * dpr;
  starCanvas.height = starHeight * dpr;
  starCtx.setTransform(dpr, 0, 0, dpr, 0, 0);
};

const random = (min, max) => Math.random() * (max - min) + min;

const buildTreeTargets = () => {
  const targets = [];
  const centerX = width / 2;
  const baseY = height * 0.8;
  const treeHeight = Math.min(height * 0.65, width * 0.9);
  const layers = 7;
  const layerHeight = treeHeight / layers;

  // Triangle layers for the foliage
  for (let layer = 0; layer < layers; layer++) {
    const layerYTop = baseY - layer * layerHeight - layerHeight;
    const layerYBottom = baseY - layer * layerHeight;
    const layerWidth =
      treeHeight * 0.25 + (layers - layer) * (treeHeight / layers);
    for (let i = 0; i < TREE_POINTS / layers; i++) {
      const t = Math.random();
      const y = layerYTop + (layerYBottom - layerYTop) * Math.pow(t, 0.9);
      const half = (layerWidth / 2) * (1 - (layerYBottom - y) / layerHeight);
      const x = centerX + random(-half, half);
      targets.push({ x, y });
    }
  }

  // Trunk
  const trunkWidth = treeHeight * 0.09;
  const trunkHeight = treeHeight * 0.12;
  for (let i = 0; i < TRUNK_POINTS; i++) {
    targets.push({
      x: centerX + random(-trunkWidth / 2, trunkWidth / 2),
      y: baseY + random(-trunkHeight, 0),
    });
  }

  // Star on top
  const starY = baseY - treeHeight - 14;
  const starRadius = treeHeight * 0.05;
  for (let i = 0; i < STAR_POINTS; i++) {
    const angle = (i / STAR_POINTS) * Math.PI * 2;
    const radius = starRadius * (0.6 + 0.4 * Math.sin(5 * angle));
    targets.push({
      x: centerX + Math.cos(angle) * radius,
      y: starY + Math.sin(angle) * radius,
      star: true,
    });
  }

  return targets;
};

const createParticles = () => {
  const targets = buildTreeTargets();
  particles = targets.map((t) => {
    const fromEdge = Math.random();
    const startX =
      fromEdge < 0.5
        ? random(-width * 0.3, width * 1.3)
        : Math.random() < 0.5
        ? -width * 0.2
        : width * 1.2;
    const startY =
      fromEdge < 0.5
        ? Math.random() < 0.5
          ? -height * 0.2
          : height * 1.1
        : random(-height * 0.2, height * 1.1);
    return {
      x: startX,
      y: startY,
      vx: 0,
      vy: 0,
      tx: t.x,
      ty: t.y,
      alpha: t.star ? 1 : random(0.4, 0.9),
      size: t.star ? random(2.5, 3.4) : random(1.2, 2.1),
      star: Boolean(t.star),
      wobble: Math.random() * Math.PI * 2,
    };
  });
};

const createSnow = () => {
  snowflakes = new Array(SNOW_COUNT).fill(0).map(() => ({
    x: random(0, width),
    y: random(0, height),
    r: random(0.6, 2.2),
    s: random(0.5, 1.6),
    drift: random(-0.3, 0.3),
  }));
};

const drawBackground = () => {
  ctx.fillStyle = "rgba(2, 3, 8, 0.25)";
  ctx.fillRect(0, 0, width, height);
};

const createStarfield = () => {
  stars = new Array(STARFIELD_COUNT).fill(0).map(() => ({
    x: random(0, starWidth),
    y: random(0, starHeight),
    r: random(0.6, 1.8),
    s: random(0.05, 0.18),
    tw: random(0, Math.PI * 2),
  }));
};

const renderStarfield = () => {
  starCtx.clearRect(0, 0, starWidth, starHeight);
  stars.forEach((star, i) => {
    star.tw += 0.025 + Math.sin(i) * 0.0015;
    const alpha = 0.45 + Math.abs(Math.sin(star.tw)) * 0.55;
    const pulse = 1 + Math.sin(star.tw * 2) * 0.2;

    starCtx.fillStyle = `rgba(240, 248, 255, ${alpha})`;
    starCtx.shadowBlur = 10 * pulse;
    starCtx.shadowColor = `rgba(200, 220, 255, ${0.7 * alpha})`;
    starCtx.beginPath();
    starCtx.arc(star.x, star.y, star.r * pulse, 0, Math.PI * 2);
    starCtx.fill();

    star.y += star.s;
    star.x += Math.sin(star.tw * 0.6) * 0.08;
    if (star.y > starHeight + 2) star.y = -2;
    if (star.x > starWidth + 2) star.x = -2;
    if (star.x < -2) star.x = starWidth + 2;
  });
  starAnimationId = requestAnimationFrame(renderStarfield);
};

const renderSnow = () => {
  snowflakes.forEach((flake) => {
    // Create soft glow effect for snowflakes
    ctx.shadowBlur = 4;
    ctx.shadowColor = "rgba(255, 255, 255, 0.6)";
    ctx.fillStyle = `rgba(255, 255, 255, ${0.4 + Math.random() * 0.3})`;
    ctx.beginPath();
    ctx.arc(flake.x, flake.y, flake.r, 0, Math.PI * 2);
    ctx.fill();

    flake.y += flake.s;
    flake.x += Math.sin(flake.y * 0.012) * 0.5 + flake.drift;

    if (flake.y > height + 4) {
      flake.y = -4;
      flake.x = random(0, width);
    }
    if (flake.x > width + 4) flake.x = -2;
    if (flake.x < -4) flake.x = width + 2;
  });
};

const renderParticles = () => {
  particles.forEach((p, i) => {
    const ease = p.star ? 0.14 : 0.07;
    const dx = p.tx - p.x;
    const dy = p.ty - p.y;
    p.vx += dx * ease;
    p.vy += dy * ease;
    p.vx *= 0.88;
    p.vy *= 0.88;
    p.wobble += 0.04 + Math.sin(i) * 0.003;
    const wobbleMag = p.star ? 0.8 : 0.4;
    p.x += p.vx + Math.cos(p.wobble) * wobbleMag;
    p.y += p.vy + Math.sin(p.wobble) * wobbleMag;

    const baseAlpha = p.star ? 1 : p.alpha;
    const flicker = 0.6 + Math.abs(Math.sin(p.wobble * 2.5)) * 0.4;
    const alpha = Math.min(1, baseAlpha * flicker + 0.2);

    if (p.star) {
      // Enhanced star glow with multiple colors
      const glowIntensity = 0.7 + Math.sin(p.wobble * 1.5) * 0.3;
      ctx.fillStyle = `rgba(255, 220, 120, ${alpha})`;
      ctx.shadowBlur = 18 * glowIntensity;
      ctx.shadowColor = `rgba(255, 209, 102, ${0.9 * glowIntensity})`;

      // Draw outer glow
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size * 1.5, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255, 180, 80, ${alpha * 0.3})`;
      ctx.fill();

      // Draw main star
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255, 235, 150, ${alpha})`;
      ctx.fill();
    } else {
      // Enhanced tree particle colors with variety
      const greenShade = i % 3;
      const colors = [
        `rgba(150, 255, 200, ${alpha})`, // Light cyan-green
        `rgba(180, 242, 255, ${alpha})`, // Light blue
        `rgba(200, 255, 220, ${alpha})`, // Pale green
      ];
      ctx.fillStyle = colors[greenShade];
      ctx.shadowBlur = 8;
      ctx.shadowColor = `rgba(150, 233, 255, ${0.5})`;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fill();
    }
  });
};

const loop = () => {
  drawBackground();
  renderSnow();
  renderParticles();
  animationId = requestAnimationFrame(loop);
};

const start = () => {
  if (animationId) cancelAnimationFrame(animationId);
  resize();
  createParticles();
  createSnow();
  loop();
};

const startStarfield = () => {
  if (starAnimationId) cancelAnimationFrame(starAnimationId);
  resizeStarfield();
  createStarfield();
  renderStarfield();
};

const observeChapters = () => {
  const chapters = Array.from(document.querySelectorAll(".chapter"));
  if (!chapters.length) return;
  if (chapterObserver) chapterObserver.disconnect();
  chapterObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          // Add visible class with smooth transition
          requestAnimationFrame(() => {
            entry.target.classList.add("is-visible");
          });
        } else {
          // Remove immediately to prevent overlap
          entry.target.classList.remove("is-visible");
        }
      });
    },
    {
      root: null,
      threshold: 0.4, // Trigger earlier for better UX
      rootMargin: "-10% 0px -10% 0px", // Prevent overlap
    }
  );
  chapters.forEach((el) => chapterObserver.observe(el));
};

window.addEventListener("resize", () => {
  resize();
  createParticles();
  resizeStarfield();
  createStarfield();
});

window.addEventListener("load", () => {
  start();
  startStarfield();
  observeChapters();
  initGallery();
});

/* ============================================
   PHOTO GALLERY FUNCTIONALITY
   ============================================ */

function initGallery() {
  const slides = document.querySelectorAll(".gallery__slide");
  const dots = document.querySelectorAll(".gallery__dot");
  const prevBtn = document.querySelector(".gallery__nav--prev");
  const nextBtn = document.querySelector(".gallery__nav--next");

  if (!slides.length) return;

  let currentSlide = 0;

  function showSlide(index) {
    // Remove active class from all
    slides.forEach((slide) => slide.classList.remove("active"));
    dots.forEach((dot) => dot.classList.remove("active"));

    // Add active class to current
    slides[index].classList.add("active");
    dots[index].classList.add("active");
  }

  function nextSlide() {
    currentSlide = (currentSlide + 1) % slides.length;
    showSlide(currentSlide);
  }

  function prevSlide() {
    currentSlide = (currentSlide - 1 + slides.length) % slides.length;
    showSlide(currentSlide);
  }

  // Event listeners
  if (nextBtn) {
    nextBtn.addEventListener("click", nextSlide);
  }

  if (prevBtn) {
    prevBtn.addEventListener("click", prevSlide);
  }

  // Dot navigation
  dots.forEach((dot, index) => {
    dot.addEventListener("click", () => {
      currentSlide = index;
      showSlide(currentSlide);
    });
  });

  // Keyboard navigation
  document.addEventListener("keydown", (e) => {
    if (e.key === "ArrowLeft") prevSlide();
    if (e.key === "ArrowRight") nextSlide();
  });

  // Touch swipe support
  let touchStartX = 0;
  let touchEndX = 0;

  const galleryTrack = document.querySelector(".gallery__track");
  if (galleryTrack) {
    galleryTrack.addEventListener("touchstart", (e) => {
      touchStartX = e.changedTouches[0].screenX;
    });

    galleryTrack.addEventListener("touchend", (e) => {
      touchEndX = e.changedTouches[0].screenX;
      handleSwipe();
    });

    function handleSwipe() {
      const swipeThreshold = 50;
      if (touchStartX - touchEndX > swipeThreshold) {
        nextSlide();
      }
      if (touchEndX - touchStartX > swipeThreshold) {
        prevSlide();
      }
    }
  }

  // Auto-play (optional - uncomment if you want)
  // setInterval(nextSlide, 5000);
}

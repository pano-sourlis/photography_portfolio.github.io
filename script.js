// Fill in site text
document.title = `${SITE.name} — ${SITE.tagline}`;
document.getElementById("site-name").textContent = SITE.name;
document.getElementById("site-tagline").textContent = SITE.tagline;
document.getElementById("hero-name").textContent = SITE.name;
document.getElementById("hero-tagline").textContent = SITE.tagline;
document.getElementById("about-text").textContent = SITE.about;
document.getElementById("footer-name").textContent = SITE.name;
document.getElementById("year").textContent = new Date().getFullYear();
const email = document.getElementById("email-link");
email.href = `mailto:${SITE.email}`;
email.textContent = SITE.email;
const insta = document.getElementById("insta-link");
if (SITE.instagram) insta.href = SITE.instagram; else insta.remove();

// Hero uses the first photo
if (PHOTOS.length) document.getElementById("hero").style.backgroundImage = `url("${PHOTOS[0].src}")`;

// Filters
const categories = ["All", ...new Set(PHOTOS.map(p => p.category).filter(Boolean))];
const filtersEl = document.getElementById("filters");
categories.forEach((cat, i) => {
  const b = document.createElement("button");
  b.textContent = cat;
  if (i === 0) b.classList.add("active");
  b.onclick = () => {
    filtersEl.querySelectorAll("button").forEach(x => x.classList.remove("active"));
    b.classList.add("active");
    document.querySelectorAll(".tile").forEach(t => {
      t.classList.toggle("hidden", cat !== "All" && t.dataset.category !== cat);
    });
  };
  filtersEl.appendChild(b);
});
if (categories.length <= 2) filtersEl.style.display = "none";

// Gallery
const gallery = document.getElementById("gallery");
PHOTOS.forEach((p, i) => {
  const tile = document.createElement("div");
  tile.className = "tile";
  tile.dataset.category = p.category || "";
  tile.innerHTML = `<img loading="lazy" alt=""><div class="caption"></div>`;
  const img = tile.querySelector("img");
  img.alt = p.title || "";
  img.onload = () => img.classList.add("loaded");
  img.src = p.src;
  const cap = tile.querySelector(".caption");
  cap.textContent = p.title || "";
  if (p.category) { const s = document.createElement("span"); s.textContent = p.category; cap.appendChild(s); }
  tile.onclick = () => openLightbox(i);
  gallery.appendChild(tile);
});

// Lightbox
const lb = document.getElementById("lightbox");
const lbImg = document.getElementById("lb-img");
const lbCap = document.getElementById("lb-caption");
let current = 0;

function visibleIndexes() {
  return [...document.querySelectorAll(".tile")]
    .map((t, i) => (t.classList.contains("hidden") ? -1 : i))
    .filter(i => i >= 0);
}
function show(i) {
  current = i;
  lbImg.src = PHOTOS[i].src;
  lbImg.alt = PHOTOS[i].title || "";
  lbCap.textContent = [PHOTOS[i].title, PHOTOS[i].category].filter(Boolean).join("  ·  ");
}
function openLightbox(i) { show(i); lb.classList.add("open"); lb.setAttribute("aria-hidden", "false"); }
function closeLightbox() { lb.classList.remove("open"); lb.setAttribute("aria-hidden", "true"); }
function step(dir) {
  const vis = visibleIndexes();
  const pos = vis.indexOf(current);
  show(vis[(pos + dir + vis.length) % vis.length]);
}

lb.querySelector(".lb-close").onclick = closeLightbox;
lb.querySelector(".lb-prev").onclick = e => { e.stopPropagation(); step(-1); };
lb.querySelector(".lb-next").onclick = e => { e.stopPropagation(); step(1); };
lb.onclick = e => { if (e.target === lb) closeLightbox(); };
document.addEventListener("keydown", e => {
  if (!lb.classList.contains("open")) return;
  if (e.key === "Escape") closeLightbox();
  if (e.key === "ArrowRight") step(1);
  if (e.key === "ArrowLeft") step(-1);
});

// Swipe on phones
let touchX = null;
lb.addEventListener("touchstart", e => (touchX = e.touches[0].clientX));
lb.addEventListener("touchend", e => {
  if (touchX === null) return;
  const dx = e.changedTouches[0].clientX - touchX;
  if (Math.abs(dx) > 50) step(dx < 0 ? 1 : -1);
  touchX = null;
});

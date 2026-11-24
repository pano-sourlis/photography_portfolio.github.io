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

const pad = n => String(n).padStart(2, "0");
const categories = ["All", ...new Set(PHOTOS.map(p => p.category).filter(Boolean))];

// ---------- Hero ----------
document.getElementById("hero-intro").textContent = SITE.intro || "";
if (!SITE.intro) document.getElementById("hero-intro").remove();

// Collection links under the name (e.g. "Japan 13", "Camping 6")
const collectionsEl = document.getElementById("hero-collections");
categories.slice(1).forEach(cat => {
  const a = document.createElement("a");
  a.href = "#work";
  a.textContent = cat;
  const count = document.createElement("small");
  count.textContent = PHOTOS.filter(p => p.category === cat).length;
  a.appendChild(count);
  a.onclick = () => applyFilter(cat);
  collectionsEl.appendChild(a);
});

// Slideshow: photos marked `featured: true`, or else up to 5 spread across the list
let slides = PHOTOS.filter(p => p.featured);
if (slides.length < 2) {
  const n = Math.min(5, PHOTOS.length);
  slides = [...new Set(Array.from({ length: n }, (_, k) => PHOTOS[Math.floor((k * PHOTOS.length) / n)]))];
}
const SLIDE_MS = 6000;
const slidesEl = document.getElementById("hero-slides");
const caption = document.getElementById("hero-caption");
const bars = document.getElementById("hc-bars");
caption.style.setProperty("--slide-ms", SLIDE_MS + "ms");
document.getElementById("hc-total").textContent = pad(slides.length);

const slideEls = slides.map((p, i) => {
  const d = document.createElement("div");
  d.className = "slide";
  // Load the first image right away, the rest shortly after so the page opens fast
  setTimeout(() => (d.style.backgroundImage = `url("${p.src}")`), i === 0 ? 0 : 1500);
  slidesEl.appendChild(d);
  const b = document.createElement("button");
  b.setAttribute("aria-label", `Show ${p.title || "photo " + (i + 1)}`);
  b.innerHTML = "<i></i>";
  b.onclick = () => goTo(i);
  bars.appendChild(b);
  return d;
});

let slide = -1, timer;
function goTo(i) {
  if (!slides.length) return;
  slide = (i + slides.length) % slides.length;
  slideEls.forEach((el, k) => el.classList.toggle("active", k === slide));
  [...bars.children].forEach((b, k) => {
    b.classList.remove("active");
    b.classList.toggle("done", k < slide);
  });
  void bars.offsetWidth; // restart the progress animation
  bars.children[slide].classList.add("active");
  caption.classList.add("fading");
  setTimeout(() => {
    document.getElementById("hc-num").textContent = pad(slide + 1);
    document.getElementById("hc-title").textContent = slides[slide].title || "";
    document.getElementById("hc-cat").textContent = slides[slide].category || "";
    caption.classList.remove("fading");
  }, slide === 0 && !timer ? 0 : 400);
  clearTimeout(timer);
  if (slides.length > 1) timer = setTimeout(() => goTo(slide + 1), SLIDE_MS);
}
goTo(0);
if (slides.length < 2) bars.remove();

// ---------- Filters ----------
const filtersEl = document.getElementById("filters");
function applyFilter(cat) {
  filtersEl.querySelectorAll("button").forEach(x => x.classList.toggle("active", x.textContent === cat));
  document.querySelectorAll(".tile").forEach(t => {
    t.classList.toggle("hidden", cat !== "All" && t.dataset.category !== cat);
  });
}
categories.forEach(cat => {
  const b = document.createElement("button");
  b.textContent = cat;
  b.onclick = () => applyFilter(cat);
  filtersEl.appendChild(b);
});
filtersEl.firstChild?.classList.add("active");
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

// One / two column switch (remembers the visitor's choice)
const toggle = document.getElementById("layout-toggle");
function setColumns(n) {
  gallery.classList.toggle("two", n === 2);
  toggle.querySelectorAll("button").forEach(b => b.classList.toggle("active", +b.dataset.cols === n));
  try { localStorage.setItem("gallery-columns", n); } catch {}
}
toggle.querySelectorAll("button").forEach(b => (b.onclick = () => setColumns(+b.dataset.cols)));
let savedCols = 1;
try { savedCols = +localStorage.getItem("gallery-columns") || 1; } catch {}
setColumns(savedCols);

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

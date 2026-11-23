const $ = id => document.getElementById(id);
const pad = n => String(n).padStart(2, "0");

// ---------- Site text ----------
document.title = `${SITE.name} — ${SITE.tagline}`;
$("site-name").textContent = SITE.name;
$("hero-name").textContent = SITE.name;
$("hero-tagline").textContent = SITE.tagline;
$("about-text").textContent = SITE.about;
$("footer-name").textContent = SITE.name;
$("year").textContent = new Date().getFullYear();
$("photo-count").textContent = pad(PHOTOS.length);
const email = $("email-link");
email.href = `mailto:${SITE.email}`;
email.textContent = SITE.email;
const insta = $("insta-link");
if (SITE.instagram) insta.href = SITE.instagram; else insta.remove();

if (PHOTOS.length) { $("hero-img").src = PHOTOS[0].src; $("hero-img").alt = PHOTOS[0].title || ""; }

// Top bar gets a solid background once you scroll
const topbar = document.querySelector(".topbar");
addEventListener("scroll", () => topbar.classList.toggle("scrolled", scrollY > 60), { passive: true });

// ---------- Filters ----------
const categories = ["All", ...new Set(PHOTOS.map(p => p.category).filter(Boolean))];
const filtersEl = $("filters");
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

// ---------- Gallery ----------
const gallery = $("gallery");
const reveal = new IntersectionObserver(entries => {
  entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add("in"); reveal.unobserve(e.target); } });
}, { rootMargin: "0px 0px -8% 0px" });

PHOTOS.forEach((p, i) => {
  const tile = document.createElement("div");
  tile.className = "tile";
  tile.dataset.category = p.category || "";
  tile.tabIndex = 0;
  tile.innerHTML = `<span class="tag">No.${pad(i + 1)}</span><div class="frame"><img loading="lazy"></div><div class="label"></div>`;
  const img = tile.querySelector("img");
  img.src = p.src;
  img.alt = p.title || "";
  const label = tile.querySelector(".label");
  label.textContent = p.title || "";
  if (p.category) { const s = document.createElement("span"); s.textContent = p.category; label.appendChild(s); }
  tile.onclick = () => openLightbox(i);
  tile.onkeydown = e => { if (e.key === "Enter") openLightbox(i); };
  gallery.appendChild(tile);
  reveal.observe(tile);
});

// ---------- Lightbox ----------
const lb = $("lightbox");
const lbImg = $("lb-img");
let current = 0;

function visibleIndexes() {
  return [...document.querySelectorAll(".tile")]
    .map((t, i) => (t.classList.contains("hidden") ? -1 : i))
    .filter(i => i >= 0);
}
function show(i) {
  current = i;
  lbImg.classList.remove("swap"); void lbImg.offsetWidth; lbImg.classList.add("swap");
  lbImg.src = PHOTOS[i].src;
  lbImg.alt = PHOTOS[i].title || "";
  $("lb-title").textContent = PHOTOS[i].title || "";
  $("lb-cat").textContent = PHOTOS[i].category || "";
  $("lb-num").textContent = pad(i + 1);
  $("lb-total").textContent = "/ " + pad(PHOTOS.length);
}
function openLightbox(i) { show(i); lb.classList.add("open"); lb.setAttribute("aria-hidden", "false"); document.body.style.overflow = "hidden"; }
function closeLightbox() { lb.classList.remove("open"); lb.setAttribute("aria-hidden", "true"); document.body.style.overflow = ""; }
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

let touchX = null;
lb.addEventListener("touchstart", e => (touchX = e.touches[0].clientX), { passive: true });
lb.addEventListener("touchend", e => {
  if (touchX === null) return;
  const dx = e.changedTouches[0].clientX - touchX;
  if (Math.abs(dx) > 50) step(dx < 0 ? 1 : -1);
  touchX = null;
});

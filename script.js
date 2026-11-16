/* ============ EDIT YOUR CONTENT HERE ============ */
const SITE = {
  name: "Hyoeun Kelly Kang",
  contact: "hyoeunkelly@email.com\nn@kivestudio\nLos Angeles",
  about: ["Write a short bio here.", "Add a second paragraph if you like."]
};

// Add a project = copy one block. Images go in /images and are listed in order.
// `scatter` = the portrait images shown scattered below the slider.
const PROJECTS = [
  { slug: "project-one", title: "Project One", subtitle: "[Short descriptor]",
    images: ["images/p1-1.jpg", "images/p1-2.jpg", "images/p1-3.jpg"],
    text: ["Describe the project here. This column is yours to edit.", "Add a second paragraph for process, context, or outcome."],
    role: { Role: "Art Director", Year: "2026", Client: "Client name", Team: "Names" },
    scatter: ["images/p1-a.jpg", "images/p1-b.jpg", "images/p1-c.jpg", "images/p1-d.jpg"] },
  { slug: "project-two", title: "Project Two", subtitle: "[Short descriptor]",
    images: ["images/p2-1.jpg", "images/p2-2.jpg"],
    text: ["Describe the project here."],
    role: { Role: "Designer", Year: "2025", Client: "Client name" },
    scatter: ["images/p2-a.jpg", "images/p2-b.jpg"] }
];
/* ================================================= */

const $ = s => document.querySelector(s);
const el = (t, a = {}, h = "") => Object.assign(document.createElement(t), a, h ? { innerHTML: h } : {});

// top menu
$("#topnav").innerHTML = `<a href="#about">About</a><a href="#work/${PROJECTS[0].slug}">Work</a>`;
$("#homeTitle").textContent = SITE.name;
$("#sideContact").textContent = SITE.contact;

function route() {
  const [page, slug] = location.hash.slice(1).split("/");
  const isHome = !page || page === "home";
  document.body.classList.toggle("in-page", !isHome);
  $("#home").hidden = !isHome; $("#page").hidden = isHome;
  if (isHome) return;
  if (page === "about") renderAbout();
  else renderProject(PROJECTS.find(p => p.slug === slug) || PROJECTS[0]);
  buildSide(page, slug);
  window.scrollTo(0, 0);
}

function buildSide(page, slug) {
  const cur = (ok) => ok ? ' aria-current="page"' : "";
  $("#sideMenu").innerHTML = `
    <li><a href="#about"${cur(page === "about")}>About</a></li>
    <li><details ${page === "work" ? "open" : ""}><summary>Work</summary><ul>
      ${PROJECTS.map(p => `<li><a href="#work/${p.slug}"${cur(page === "work" && (slug || PROJECTS[0].slug) === p.slug)}>${p.title}</a></li>`).join("")}
    </ul></details></li>`;
}

function renderAbout() {
  $("#content").innerHTML = `<div class="about">${SITE.about.map(t => `<p>${t}</p>`).join("")}</div>`;
}

function renderProject(p) {
  const roles = Object.entries(p.role).map(([k, v]) => `<dt>${k}</dt><dd>${v}</dd>`).join("");
  $("#content").innerHTML = `
    <div class="slider" aria-roledescription="carousel" aria-label="${p.title} images">
      <div class="track">${p.images.map((s, i) => `<img src="${s}" alt="${p.title} image ${i + 1}" draggable="false">`).join("")}</div>
      <button class="zone prev" aria-label="Previous image"></button>
      <button class="zone next" aria-label="Next image"></button>
      <span class="count" aria-live="polite"></span>
    </div>
    <div class="meta">
      <div><h3>${p.title}<br>${p.subtitle}</h3>${p.text.map(t => `<p>${t}</p>`).join("")}</div>
      <dl class="role">${roles}</dl>
    </div>
    <div class="scatter">${p.scatter.map((s, i) => `<figure><img src="${s}" alt="${p.title} detail ${i + 1}" loading="lazy"></figure>`).join("")}</div>`;
  initSlider(p.images.length);
}

function initSlider(n) {
  const box = $(".slider"), track = $(".track"), count = $(".count");
  let i = 0, x0 = null;
  const go = d => { i = (i + d + n) % n; track.style.transform = `translateX(${-i * 100}%)`; count.textContent = `${i + 1}/${n}`; };
  go(0);
  $(".prev").onclick = () => go(-1); $(".next").onclick = () => go(1);
  box.addEventListener("touchstart", e => x0 = e.touches[0].clientX, { passive: true });
  box.addEventListener("touchend", e => { if (x0 === null) return; const dx = e.changedTouches[0].clientX - x0; if (Math.abs(dx) > 40) go(dx < 0 ? 1 : -1); x0 = null; });
  document.onkeydown = e => { if (e.key === "ArrowRight") go(1); if (e.key === "ArrowLeft") go(-1); };
  if (n < 2) box.querySelectorAll(".zone").forEach(z => z.hidden = true);
}

// click anywhere on the home screen to enter Work
$("#home").addEventListener("click", () => { location.hash = `#work/${PROJECTS[0].slug}`; });
$("#home").tabIndex = 0;
$("#home").addEventListener("keydown", e => { if (e.key === "Enter") location.hash = `#work/${PROJECTS[0].slug}`; });
addEventListener("hashchange", route); route();

/* ============ EDIT YOUR CONTENT HERE ============ */
const SITE = {
  name: "Hyoeun Kelly Kang",
  contact: "hyoeunkelly@gmail.com\nInstagram @kivestudio\nb. Seoul, currently resides in Los Angeles",
  about: ["a research-driven designer, creative director, and emerging curator working across art, design, and architecture. With an academic background in psychological sciences and cognitive science, my practice draws from disciplines including anthropology, philosophy, technology, and the built environment to investigate the relationship between larger systems and human experience. ", "My work spans spatial and graphic design, visual communication, creative direction, and curatorial practice. Grounded in interdisciplinary research, I approach these fields as interconnected modes of inquiry and expression, translating complex ideas into visual languages, environments, and experiences. I am particularly interested in how material, spatial, cultural, and technological systems shape human perception, cognition, and behavior."]
};

// Add a project = copy one block. Images go in /images and are listed in order.
// `scatter` = the portrait images shown scattered below the slider.
const PROJECTS = [
  { slug: "Ctrl+Save", title: "Ctrl+Save", subtitle: "[Short descriptor]",
    images: ["ctrl_save2.png", "ctrl_save_alice.png", "DSC00558.png", "DSC00787.png", "ctrl_save_romi.png", "ctrl_save_shuruq.png", "ctrl_save_devin.png", "DSC00923.png", "DSC00519.png"],
    text: ["Ctrl+Save is an interdisciplinary group exhibition curated and produced by Kive Studio, bringing together eight artists working across installation, sculpture, moving image, performance, and interactive art. Exploring the intersections of perception, memory, and systems of control, the exhibition examines how technological and cultural systems shape what is recorded, reproduced, preserved, and made visible.", "As Co-Curator and Creative Producer, I led curatorial research and conceptual development, working closely with artists and collaborators to translate the exhibition's framework into a cohesive spatial and experiential environment. My role extended across exhibition design, spatial planning, creative direction, technical coordination, partnerships, and public programming, overseeing the project from initial research through installation and realization.", "Situated within Art/Space 114, a former bank building in Downtown Los Angeles, the exhibition also engages the architectural and institutional history of its site, reframing a former infrastructure of financial exchange as a space for artistic experimentation and cultural dialogue."],
   role: { Role: "Co-curator, Exhibition Designer, Programming Director, Producer, Graphic Designer", Year: "2026", For: "Kive Studio" , Team: "Isabel Murphy"},
    scatter: ["images/p1-a.jpg", "images/p1-b.jpg", "images/p1-c.jpg", "images/p1-d.jpg"] },
  
  { slug: "Agathus Studios", title: "Agathus Studios", subtitle: "[Short descriptor]",
    images: ["images/p2-1.jpg", "images/p2-2.jpg"],
    text: ["As Artistic Director for Agathus Studios’ showroom, retail, and client projects, I developed an artist program that integrates contemporary art into the studio’s broader design practice. I curate and source artists and artworks for residential and commercial environments, develop artist collaborations and commissions, and shape the visual language of the showroom and its public-facing programming. My role spans artistic direction, creative strategy, graphic design, and creative production for the studio's showroom, retail shop, and architectural projects."],
    role: { Role: "Art & Creative Director, Graphic Designer, Producer", Year: "2024 - 2026", Client: "Agathus Studios"},
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

const $ = (s) => document.querySelector(s);
const authorById = (id) => AUTHORS.find(a => a.id === id);
// Noms de tous les auteurs d'un livre (auteur principal + co-auteurs)
const authorNames = (b) => [b.authorId, ...(b.coAuthorIds || [])]
  .map(id => (authorById(id) || {}).name).filter(Boolean).join(' & ');

/* ----- Révélation du contenu ----- */
function reveal(targetId) {
  const content = $('#contenu');
  const wasHidden = content.classList.contains('hidden');
  content.classList.remove('hidden');
  const target = $('#' + (targetId || 'presentation'));
  // petit délai pour laisser le navigateur calculer la mise en page
  setTimeout(() => target.scrollIntoView({ behavior: 'smooth', block: 'start' }), wasHidden ? 50 : 0);
}

$('#more').addEventListener('click', () => reveal('presentation'));
document.querySelectorAll('[data-go]').forEach(link => {
  link.addEventListener('click', (e) => {
    e.preventDefault();
    const id = link.dataset.go;
    if (id === 'accueil') window.scrollTo({ top: 0, behavior: 'smooth' });
    else reveal(id);
  });
});

/* ----- Auteurs ----- */
const silhouette = `<svg class="silhouette" viewBox="0 0 100 120"><circle cx="50" cy="38" r="22"/><path d="M5 120 Q5 70 50 70 Q95 70 95 120 Z"/></svg>`;
$('#authors').innerHTML = AUTHORS.map(a => `
  <article class="author">
    <div class="author-arch">${a.photo ? `<img src="${a.photo}" alt="${a.name}">` : silhouette}</div>
    <h4>${a.name}</h4>
    <p class="role">${a.role}</p>
    <p class="bio">${a.bio}</p>
  </article>`).join('');

/* ----- Livres ----- */
function coverHTML(b) {
  if (b.cover) return `<div class="cover"><img src="${b.cover}" alt="Couverture de ${b.title}"></div>`;
  return `<div class="cover generated">
    <div class="cs">☪</div>
    <div class="ct">${b.title}</div>
    <div class="ca">${authorNames(b)}</div>
  </div>`;
}

$('#books').innerHTML = BOOKS.map(b => `
  <button class="book" data-id="${b.id}" aria-label="Ouvrir la fiche de ${b.title}">
    ${coverHTML(b)}
    <h4>${b.title}</h4>
    <p class="by">${authorNames(b)}</p>
    <p class="hint">Voir la fiche</p>
  </button>`).join('');

/* ----- Fiche livre (modal) ----- */
const modal = $('#modal');
function openBook(id) {
  const b = BOOKS.find(x => x.id === id);
  if (!b) return;
  $('#m-cover').innerHTML = coverHTML(b);
  $('#m-title').textContent = b.title;
  $('#m-desc').textContent = b.description;
  $('#m-author').textContent = authorNames(b);
  $('#m-lang').textContent = b.language;
  $('#m-pages').textContent = b.pages;
  $('#m-dl').href = b.drive;
  modal.classList.remove('hidden');
  document.body.style.overflow = 'hidden';
}
function closeBook() {
  modal.classList.add('hidden');
  document.body.style.overflow = '';
}
$('#books').addEventListener('click', (e) => {
  const card = e.target.closest('.book');
  if (card) openBook(card.dataset.id);
});
$('#close').addEventListener('click', closeBook);
modal.addEventListener('click', (e) => { if (e.target === modal) closeBook(); });
document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeBook(); });

$('#year').textContent = new Date().getFullYear();

/* ----- Vidéo de soie : lecture robuste sur mobile ----- */
(function () {
  const v = document.querySelector('.satin-video');
  if (!v) return;
  v.muted = true;
  v.setAttribute('playsinline', '');
  // si la vidéo ne se charge pas, on la retire : le tissu CSS prend le relais
  const src = v.querySelector('source');
  if (src) src.addEventListener('error', () => v.remove());
  // l'utilisateur a demandé moins d'animations : on garde seulement l'image fixe
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) { v.pause(); return; }
  const tryPlay = () => { const p = v.play(); if (p && p.catch) p.catch(() => {}); };
  tryPlay();
  v.addEventListener('canplay', tryPlay);
  // si le navigateur bloque la lecture automatique (ex. économie d'énergie iPhone),
  // le premier toucher ou défilement lance la vidéo
  ['touchstart', 'click', 'scroll'].forEach(ev =>
    window.addEventListener(ev, tryPlay, { once: true, passive: true }));
})();

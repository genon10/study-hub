'use strict';
/* Inject top nav with brand, progress ring, and hamburger for mobile */

(function () {
  const pages = [
    { file: 'index.html',        label: 'סקירה' },
    { file: 'architecture.html', label: 'ארכיטקטורה' },
    { file: 'code.html',         label: 'קוד' },
    { file: 'topics.html',       label: 'נושאים' },
    { file: 'flashcards.html',   label: 'כרטיסיות' },
    { file: 'quiz.html',         label: 'חידון' },
    { file: 'exam.html',         label: 'מבחן' },
  ];

  const current = window.location.pathname.split('/').pop() || 'index.html';

  const linksHTML = pages.map(p =>
    `<a href="${p.file}" class="nav-link${current === p.file ? ' active' : ''}">${p.label}</a>`
  ).join('');

  // Progress ring — reads FC_SEEN from localStorage
  const fcSeen  = JSON.parse(localStorage.getItem('mm_fc_seen') || '[]');
  const fcTotal = 20;
  const pct     = Math.min(100, Math.round(fcSeen.length / fcTotal * 100));
  const r       = 13;
  const circ    = +(2 * Math.PI * r).toFixed(2);
  const offset  = +((1 - pct / 100) * circ).toFixed(2);

  const ringHTML = `
    <div class="progress-ring-wrap" title="${pct}% כרטיסיות נלמדו">
      <svg class="progress-ring" width="34" height="34" viewBox="0 0 34 34">
        <circle class="progress-ring-track" cx="17" cy="17" r="${r}"/>
        <circle class="progress-ring-fill"  cx="17" cy="17" r="${r}"
          stroke-dasharray="${circ}" stroke-dashoffset="${offset}"/>
      </svg>
      <span class="progress-ring-label">${pct}%</span>
    </div>
  `;

  const navHTML = `
    <nav class="top-nav">
      <div class="top-nav-inner">
        <a href="../index.html" class="nav-back" style="flex-shrink:0">🏠</a>
        <a href="index.html" class="nav-brand">💣 MineMaster</a>
        <div class="nav-divider"></div>
        <div class="nav-links" id="nav-links">${linksHTML}</div>
        ${ringHTML}
        <button class="nav-hamburger" id="nav-hamburger" aria-label="תפריט">
          <span></span><span></span><span></span>
        </button>
      </div>
    </nav>
  `;

  document.body.insertAdjacentHTML('afterbegin', navHTML);

  const ham   = document.getElementById('nav-hamburger');
  const links = document.getElementById('nav-links');

  ham.addEventListener('click', function () {
    links.classList.toggle('open');
    ham.classList.toggle('open');
  });

  document.addEventListener('click', function (e) {
    if (links.classList.contains('open') &&
        !ham.contains(e.target) && !links.contains(e.target)) {
      links.classList.remove('open');
      ham.classList.remove('open');
    }
  });
})();

'use strict';

(function () {
  const pages = [
    { file: 'index.html',  label: '🗺️ סקירה' },
    { file: 'topics.html', label: '📖 נושאים' },
    { file: 'exam.html',   label: '📝 מבחן' },
  ];

  const current = window.location.pathname.split('/').pop() || 'index.html';

  try {
    localStorage.setItem('frc_last_page', current);
    localStorage.setItem('frc_last_visit', String(Date.now()));
  } catch (_) {}

  const linksHTML = pages.map(p =>
    `<a href="${p.file}" class="nav-item${current === p.file ? ' active' : ''}">${p.label}</a>`
  ).join('');

  const fcSeen  = JSON.parse(localStorage.getItem('frc_fc_seen') || '[]');
  const fcTotal = 47;
  const pct     = Math.min(100, Math.round(fcSeen.length / fcTotal * 100));
  const r       = 13;
  const circ    = +(2 * Math.PI * r).toFixed(2);
  const offset  = +((1 - pct / 100) * circ).toFixed(2);

  const ringHTML = `
    <div class="progress-ring-wrap" title="${pct}% כרטיסיות נלמדו">
      <svg class="progress-ring" width="34" height="34" viewBox="0 0 34 34">
        <circle class="progress-ring-track" cx="17" cy="17" r="${r}"/>
        <circle class="progress-ring-fill"  cx="17" cy="17" r="${r}"
          stroke-dasharray="${circ}" stroke-dashoffset="${offset}"
          style="stroke:#22c55e"/>
      </svg>
      <span class="progress-ring-label" style="color:#22c55e">${pct}%</span>
    </div>
  `;

  const curLang = (typeof getLang === 'function') ? getLang() : 'mix';
  const navLangHTML = `<div class="lang-toggle" style="flex-shrink:0">
    <button class="lang-btn${curLang==='he'?' active':''}" data-lang="he" onclick="setLang('he')">עב</button>
    <button class="lang-btn${curLang==='en'?' active':''}" data-lang="en" onclick="setLang('en')">EN</button>
    <button class="lang-btn${curLang==='mix'?' active':''}" data-lang="mix" onclick="setLang('mix')">MIX</button>
  </div>`;

  const navHTML = `
    <nav class="section-nav">
      <a href="../index.html" class="home-btn">← Study Hub</a>
      <span class="nav-brand-section" style="background:linear-gradient(130deg,#22c55e,#4ade80);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;flex-shrink:0">🤖 FRC #5135</span>
      <div class="nav-divider"></div>
      <div class="nav-pages" id="nav-pages">${linksHTML}</div>
      <div class="nav-controls">
        ${ringHTML}
        ${navLangHTML}
        <button class="nav-hamburger" id="nav-hamburger" aria-label="תפריט">
          <span></span><span></span><span></span>
        </button>
      </div>
    </nav>
  `;

  document.body.insertAdjacentHTML('afterbegin', navHTML);

  const ham   = document.getElementById('nav-hamburger');
  const pages2 = document.getElementById('nav-pages');

  if (ham && pages2) {
    ham.addEventListener('click', function () {
      pages2.classList.toggle('open');
      ham.classList.toggle('open');
    });
    document.addEventListener('click', function (e) {
      if (pages2.classList.contains('open') &&
          !ham.contains(e.target) && !pages2.contains(e.target)) {
        pages2.classList.remove('open');
        ham.classList.remove('open');
      }
    });
  }
})();

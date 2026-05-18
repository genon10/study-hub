'use strict';
/* Search bar — works on any page that includes data.js */

(function () {
  const input   = document.getElementById('search-input');
  const results = document.getElementById('search-results');
  const clear   = document.getElementById('search-clear');
  if (!input) return;

  function search(query) {
    query = query.trim().toLowerCase();
    if (query.length < 2) {
      results.classList.remove('open');
      clear.classList.remove('visible');
      return;
    }
    clear.classList.add('visible');

    const hits = SEARCH_INDEX.filter(item => {
      const haystack = (item.title + ' ' + item.snippet).toLowerCase();
      return haystack.includes(query);
    }).slice(0, 8);

    if (!hits.length) {
      results.innerHTML = `<div class="search-no-results">לא נמצאו תוצאות עבור "${esc(query)}"</div>`;
    } else {
      results.innerHTML = hits.map(h => `
        <div class="search-result-item" onclick="window.location.href='${h.url}'">
          <span class="sri-tag">${esc(h.type)}</span>
          <div class="sri-text">
            <div class="sri-title">${esc(h.title)}</div>
            ${h.snippet ? `<div class="sri-snippet">${esc(h.snippet.substring(0,90))}…</div>` : ''}
          </div>
        </div>
      `).join('');
    }
    results.classList.add('open');
  }

  input.addEventListener('input', () => search(input.value));
  input.addEventListener('focus', () => { if (input.value.length >= 2) results.classList.add('open'); });

  clear.addEventListener('click', () => {
    input.value = '';
    results.classList.remove('open');
    clear.classList.remove('visible');
    input.focus();
  });

  document.addEventListener('click', e => {
    if (!e.target.closest('.search-wrap') && !e.target.closest('.search-results')) {
      results.classList.remove('open');
    }
  });
})();

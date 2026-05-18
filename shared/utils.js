'use strict';

/* ============================================================
   SHARED UTILITIES — MineMaster Study Hub
   ============================================================ */

// ---- localStorage wrapper ----
const Store = {
  get(key, fallback = null) {
    try {
      const v = localStorage.getItem(key);
      return v === null ? fallback : JSON.parse(v);
    } catch { return fallback; }
  },
  set(key, value) {
    try { localStorage.setItem(key, JSON.stringify(value)); } catch {}
  },
  update(key, updater, fallback = {}) {
    this.set(key, updater(this.get(key, fallback)));
  }
};

// ---- progress keys (namespaced) ----
const KEYS = {
  FC_SEEN:        'mm_fc_seen',       // Array of seen flashcard indices
  FC_IDX:         'mm_fc_idx',        // Last flashcard position
  FC_MODE:        'mm_fc_mode',       // Active study mode: flip|learn|match|tf|write
  QUIZ_HISTORY:   'mm_quiz_history',  // Array of {date, score, total}
  QUIZ_ANSWERS:   'mm_quiz_answers',  // {qIdx: chosenOpt} for current session
  EXAM_HISTORY:   'mm_exam_history',  // Array of {date, grade, timeUsed, correct, total}
  STUDY_LANG:     'study_lang',       // Active language: he|en|mix
  TF_HISTORY:     'mm_tf_history',    // Array of {date, score, total}
  WRITE_HISTORY:  'mm_write_history', // Array of {date, score, total}
  MATCH_BEST:     'mm_match_best',    // Best match time in seconds
};

// ---- language helpers ----
function getLang() {
  return Store.get(KEYS.STUDY_LANG, 'he');
}
function setLang(l) {
  Store.set(KEYS.STUDY_LANG, l);
  document.querySelectorAll('.lang-btn').forEach(b => {
    b.classList.toggle('active', b.dataset.lang === l);
  });
  if (typeof onLangChange === 'function') onLangChange(l);
}
// Translate: obj may be plain string or {he, en, mix}
function t(obj) {
  if (!obj) return '';
  if (typeof obj === 'string') return obj;
  const l = getLang();
  return obj[l] || obj.he || obj.en || '';
}
// Build language toggle bar HTML (insert anywhere)
function langToggleHTML() {
  const l = getLang();
  return `<div class="lang-toggle">
    <button class="lang-btn${l==='he'?' active':''}" data-lang="he" onclick="setLang('he')">עב</button>
    <button class="lang-btn${l==='en'?' active':''}" data-lang="en" onclick="setLang('en')">EN</button>
    <button class="lang-btn${l==='mix'?' active':''}" data-lang="mix" onclick="setLang('mix')">MIX</button>
  </div>`;
}

// ---- accordion toggle ----
function accToggle(el) {
  el.classList.toggle('open');
  el.nextElementSibling.classList.toggle('open');
}

// ---- format seconds → m:ss ----
function fmtTime(sec) {
  const m = Math.floor(sec / 60);
  const s = sec % 60;
  return `${m}:${s.toString().padStart(2, '0')}`;
}

// ---- bagrut grade: raw% → grade (55–100) ----
function bagrutGrade(correct, total) {
  if (total === 0) return 0;
  const pct = correct / total;
  if (pct < 0.55) return Math.round(pct * 100);
  return Math.round(55 + (pct - 0.55) * (100 - 55) / 0.45);
}

// ---- escape HTML ----
function esc(str) {
  return String(str).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
}

// ---- shuffle array (Fisher-Yates) ----
function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// ---- normalise answer string for Write mode comparison ----
function normaliseAnswer(s) {
  return String(s).trim().toLowerCase()
    .replace(/\(\)/g, '')   // strip ()
    .replace(/\s+/g, ' ')
    .trim();
}
function checkWriteAnswer(userInput, correct) {
  const u = normaliseAnswer(userInput);
  const c = normaliseAnswer(correct);
  if (u === c) return true;
  // Also accept partial: user typed the Java class name without .java
  if (c.endsWith('.java') && u === normaliseAnswer(c.replace('.java',''))) return true;
  return false;
}

// ---- progress bar: given pct 0-100, return width% class ----
function pctColor(pct) {
  if (pct >= 80) return 'var(--success)';
  if (pct >= 55) return 'var(--accent3)';
  return 'var(--danger)';
}

// ---- render progress bar HTML ----
function progressBarHTML(pct) {
  return `<div class="progress-bar-wrap">
    <div class="progress-bar-fill" style="width:${pct}%;background:${pctColor(pct)}"></div>
  </div>`;
}

// ---- date string → he-IL locale ----
function todayStr() {
  return new Date().toLocaleDateString('he-IL');
}

// ---- nav: mark current page active ----
function markActiveNav() {
  const file = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-link').forEach(link => {
    const href = (link.getAttribute('href') || '').split('/').pop() || 'index.html';
    link.classList.toggle('active', href === file);
  });
}

// ---- copy code block content ----
function copyCode(btn) {
  const pre = btn.closest('.code-block').querySelector('pre');
  const text = pre.innerText;
  navigator.clipboard.writeText(text).then(() => {
    btn.textContent = '✓ הועתק';
    setTimeout(() => { btn.textContent = 'העתק'; }, 1800);
  }).catch(() => {
    // fallback for older browsers
    const ta = document.createElement('textarea');
    ta.value = text;
    ta.style.position = 'fixed';
    ta.style.opacity = '0';
    document.body.appendChild(ta);
    ta.select();
    document.execCommand('copy');
    document.body.removeChild(ta);
    btn.textContent = '✓ הועתק';
    setTimeout(() => { btn.textContent = 'העתק'; }, 1800);
  });
}

// ---- back to top button (injected on all pages) ----
document.addEventListener('DOMContentLoaded', function () {
  const btn = document.createElement('button');
  btn.id = 'back-to-top';
  btn.textContent = '↑';
  btn.setAttribute('aria-label', 'חזור לראש הדף');
  btn.onclick = function () { window.scrollTo({ top: 0, behavior: 'smooth' }); };
  document.body.appendChild(btn);
  window.addEventListener('scroll', function () {
    btn.classList.toggle('visible', window.scrollY > 300);
  }, { passive: true });
});

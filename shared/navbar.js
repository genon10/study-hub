(function() {
  // Detect which section we're in
  const path = window.location.pathname;
  const inFRC = path.includes('/frc/');
  const inMM  = path.includes('/minesweeper/');
  const accent = inFRC ? 'var(--frc-accent)' : 'var(--mm-accent)';
  const root   = (inFRC || inMM) ? '../' : '';

  // FRC pages
  const frcPages = [
    { label: '🏠 סקירה',       href: 'index.html' },
    { label: '📖 נושאים',      href: 'topics.html' },
    { label: '🃏 כרטיסיות',    href: 'flashcards.html' },
    { label: '❓ חידון',        href: 'quiz.html' },
    { label: '📝 בחינה',        href: 'exam.html' },
    { label: '💻 קוד',          href: 'code.html' },
    { label: '🏗️ ארכיטקטורה', href: 'architecture.html' },
  ];

  // MineMaster pages
  const mmPages = [
    { label: '🏠 סקירה',       href: 'index.html' },
    { label: '📖 נושאים',      href: 'topics.html' },
    { label: '🃏 כרטיסיות',    href: 'flashcards.html' },
    { label: '❓ חידון',        href: 'quiz.html' },
    { label: '📝 בחינה',        href: 'exam.html' },
    { label: '💻 קוד',          href: 'code.html' },
    { label: '🏗️ ארכיטקטורה', href: 'architecture.html' },
  ];

  const pages = inFRC ? frcPages : inMM ? mmPages : [];

  // Get current filename
  const currentFile = path.split('/').pop() || 'index.html';

  // Build nav HTML
  const linksHtml = pages.map(p => {
    const isActive = currentFile === p.href ? 'active' : '';
    return `<a href="${p.href}" class="nav-link ${isActive}">${p.label}</a>`;
  }).join('');

  const sectionLabel = inFRC
    ? '<span class="nav-section-badge frc">FRC</span>'
    : inMM
    ? '<span class="nav-section-badge mm">MM</span>'
    : '';

  const navHtml = `
    <nav class="site-nav" id="site-nav">
      <a href="${root}index.html" class="nav-home">← Study Hub</a>
      ${(inFRC || inMM) ? '<div class="nav-divider"></div>' : ''}
      ${sectionLabel}
      <div class="nav-links">${linksHtml}</div>
    </nav>
  `;

  // Inject at top of body
  document.body.insertAdjacentHTML('afterbegin', navHtml);

  // Add section badge styles if not in shared css
  const style = document.createElement('style');
  style.textContent = `
    .nav-section-badge {
      flex-shrink: 0;
      font-size: 0.65rem; font-weight: 800;
      padding: 3px 8px; border-radius: var(--radius-full);
      letter-spacing: 0.08em; text-transform: uppercase;
    }
    .nav-section-badge.frc {
      background: var(--frc-dim);
      color: var(--frc-accent);
    }
    .nav-section-badge.mm {
      background: var(--mm-dim);
      color: var(--mm-accent);
    }
  `;
  document.head.appendChild(style);
})();

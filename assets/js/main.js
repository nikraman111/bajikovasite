// Инициализация иконок Lucide
lucide.createIcons();

// Навбар: на светлых секциях — тёмный текст и лёгкий фон
(function () {
  const nav = document.querySelector('.nav');
  const hero = document.querySelector('.hero');
  if (!nav || !hero) return;

  function updateNav() {
    const pastHero = hero.getBoundingClientRect().bottom < 64;
    nav.classList.toggle('nav--light', pastHero);
  }

  updateNav();
  window.addEventListener('scroll', updateNav, { passive: true });
  window.addEventListener('resize', updateNav);
})();

// Подгон шрифта hero: «БАЖИКОВА» точно до правого отступа
(function () {
  const nameEl = document.querySelector('.hero__name');
  const roleEl = document.querySelector('.hero__role');
  if (!nameEl) return;

  function measureText(text, fontFamily, weight) {
    const t = document.createElement('span');
    t.style.cssText =
      'position:absolute;top:-9999px;left:-9999px;' +
      'white-space:nowrap;visibility:hidden;pointer-events:none;' +
      'font-family:' + fontFamily + ';' +
      'font-weight:' + weight + ';text-transform:uppercase;letter-spacing:0;';
    t.textContent = text;
    document.body.appendChild(t);

    let lo = 8, hi = 300;
    for (let i = 0; i < 25; i++) {
      const mid = (lo + hi) / 2;
      t.style.fontSize = mid + 'px';
      if (t.offsetWidth <= nameEl.parentElement.clientWidth) lo = mid;
      else hi = mid;
    }
    document.body.removeChild(t);
    return lo;
  }

  function fit() {
    const cs = getComputedStyle(nameEl);
    const namePx = measureText('БАЖИКОВА', cs.fontFamily, '400');
    nameEl.style.fontSize = namePx + 'px';
    if (roleEl) roleEl.style.fontSize = (namePx * 0.46) + 'px';
  }

  document.fonts.ready.then(() => {
    fit();
    window.addEventListener('resize', fit, { passive: true });
  });
})();

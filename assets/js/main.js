// Инициализация иконок Lucide
lucide.createIcons();

// Аккордеон FAQ — один открытый, плавная анимация
(function () {
  const items = document.querySelectorAll('.accordion__item');

  function close(item) {
    const answer = item.querySelector('.accordion__answer');
    answer.style.maxHeight = answer.scrollHeight + 'px';
    requestAnimationFrame(() => { answer.style.maxHeight = '0'; });
    setTimeout(() => item.removeAttribute('open'), 400);
  }

  function open(item) {
    const answer = item.querySelector('.accordion__answer');
    item.setAttribute('open', '');
    answer.style.maxHeight = answer.scrollHeight + 'px';
    answer.addEventListener('transitionend', () => {
      answer.style.maxHeight = 'none';
    }, { once: true });
  }

  items.forEach(item => {
    item.querySelector('summary').addEventListener('click', e => {
      e.preventDefault();
      const isOpen = item.hasAttribute('open');

      // Закрываем все открытые
      items.forEach(other => { if (other.hasAttribute('open')) close(other); });

      // Открываем текущий если он был закрыт
      if (!isOpen) open(item);
    });
  });
})();

// Меню-оверлей
(function () {
  const overlay = document.getElementById('menu-overlay');
  const openBtn = document.getElementById('menu-btn');
  const closeBtn = document.getElementById('menu-close');
  if (!overlay || !openBtn) return;

  function open() {
    document.body.style.overflow = 'hidden';
    overlay.classList.add('is-open');
    lucide.createIcons();
  }

  function close() {
    overlay.classList.remove('is-open');
    document.body.style.overflow = '';
  }

  openBtn.addEventListener('click', open);
  closeBtn.addEventListener('click', close);

  overlay.querySelectorAll('[data-menu-close]').forEach(el => {
    el.addEventListener('click', close);
  });
})();

// Навбар: на светлых секциях — тёмный текст и лёгкий фон
(function () {
  const nav = document.querySelector('.nav');
  const hero = document.querySelector('.hero');
  if (!nav || !hero) return;

  const ctaFooter = document.querySelector('.cta-footer');
  const subscription = document.querySelector('.subscription');

  function updateNav() {
    const pastHero = hero.getBoundingClientRect().bottom < 64;
    const overCtaFooter = ctaFooter && ctaFooter.getBoundingClientRect().top < 64;
    const overSubscription = subscription && subscription.getBoundingClientRect().top < 64 && subscription.getBoundingClientRect().bottom > 64;
    const shouldBeLight = pastHero && !overCtaFooter && !overSubscription;
    nav.classList.toggle('nav--light', shouldBeLight);
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

// Слайдер "Работа со мной"
(function () {
  const slider = document.querySelector('.work-slider');
  if (!slider) return;

  const titleSlides = Array.from(slider.querySelectorAll('.work-slider__track--titles .work-slide'));
  const textSlides  = Array.from(slider.querySelectorAll('.work-slider__track--texts .work-slide'));
  const total = titleSlides.length;
  let current = 0;

  function animateOut(slide) {
    slide.classList.remove('work-slide--active');
    slide.classList.add('work-slide--exit');
    setTimeout(() => { slide.classList.remove('work-slide--exit'); }, 380);
  }

  function animateIn(slide) {
    slide.style.transform = 'translateX(100%)';
    slide.style.opacity = '0';
    requestAnimationFrame(() => requestAnimationFrame(() => {
      slide.classList.add('work-slide--active');
      slide.style.transform = '';
      slide.style.opacity = '';
    }));
  }

  function show(index) {
    animateOut(titleSlides[current]);
    animateOut(textSlides[current]);
    animateIn(titleSlides[index]);
    animateIn(textSlides[index]);
    current = index;
  }

  slider.addEventListener('click', e => {
    const btn = e.target.closest('.work-slider__arrow');
    if (!btn) return;
    show(btn.getAttribute('aria-label') === 'Назад'
      ? (current - 1 + total) % total
      : (current + 1) % total);
  });

  [...titleSlides, ...textSlides].forEach((s, i) => {
    if (!s.classList.contains('work-slide--active')) {
      s.style.transform = 'translateX(100%)';
      s.style.opacity = '0';
    }
  });
})();

// Подмагничивание: hero и cta-footer
(function () {
  const heroEl    = document.querySelector('.hero');
  const aboutEl   = document.querySelector('.about');
  const ctaEl     = document.querySelector('.cta-footer');
  const faqEl     = document.querySelector('.faq');
  let timer = null;
  let snapping = false;

  function snap(fn) {
    snapping = true;
    fn();
    setTimeout(() => { snapping = false; }, 1500);
  }

  function checkSnap() {
    const vp = window.innerHeight;

    // ── Hero ────────────────────────────────────
    const hr = heroEl.getBoundingClientRect();
    if (hr.top < 0 && hr.bottom > 0) {
      if (-hr.top > heroEl.offsetHeight / 2) {
        snap(() => aboutEl.scrollIntoView({ behavior: 'smooth', block: 'start' }));
      } else {
        snap(() => heroEl.scrollIntoView({ behavior: 'smooth', block: 'start' }));
      }
      return;
    }

    // ── CTA-footer ───────────────────────────────
    const cr = ctaEl.getBoundingClientRect();
    if (cr.top < vp && cr.bottom > 0) {
      const visible = Math.min(cr.bottom, vp) - Math.max(cr.top, 0);
      if (visible > vp / 2) {
        // Больше половины видно → прижать начало к верху экрана
        snap(() => ctaEl.scrollIntoView({ behavior: 'smooth', block: 'start' }));
      } else {
        // Меньше половины → низ предпоследнего блока (faq) к низу экрана
        const fr = faqEl.getBoundingClientRect();
        snap(() => window.scrollTo({ top: window.scrollY + fr.bottom - vp, behavior: 'smooth' }));
      }
    }
  }

  window.addEventListener('scroll', () => {
    if (snapping) return;
    clearTimeout(timer);
    timer = setTimeout(checkSnap, 1000);
  }, { passive: true });

  // Сбрасываем snapping если пользователь сам начал скроллить
  window.addEventListener('touchstart', () => { snapping = false; clearTimeout(timer); }, { passive: true });
  window.addEventListener('wheel', () => { snapping = false; }, { passive: true });
})();

// Слайдер карточек услуг (АЙДЕНТИКА)
(function () {
  const slider = document.querySelector('.service-slider');
  if (!slider) return;

  const track = slider.querySelector('.service-slider__track');
  const cards = Array.from(slider.querySelectorAll('.service-card'));
  let current = 0;

  function setTrackHeight(card) {
    const h = card.offsetHeight;
    track.style.height = h + 'px';
  }

  cards.forEach((c, i) => c.classList.toggle('is-active', i === 0));
  document.fonts.ready.then(() => {
    setTrackHeight(cards[0]);
    window.addEventListener('resize', () => setTrackHeight(cards[current]), { passive: true });
  });

  function show(index) {
    const prev = cards[current];
    const next = cards[index];

    prev.classList.remove('is-active');
    prev.classList.add('is-exit');
    setTimeout(() => prev.classList.remove('is-exit'), 380);

    next.style.transform = 'translateX(100%)';
    next.style.opacity = '0';
    requestAnimationFrame(() => requestAnimationFrame(() => {
      next.classList.add('is-active');
      next.style.transform = '';
      next.style.opacity = '';
      setTrackHeight(next);
    }));

    current = index;
  }

  slider.addEventListener('click', e => {
    const btn = e.target.closest('.service-slider__arrow');
    if (!btn) return;
    show(btn.getAttribute('aria-label') === 'Назад'
      ? (current - 1 + cards.length) % cards.length
      : (current + 1) % cards.length);
  });
})();

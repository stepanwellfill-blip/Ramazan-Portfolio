'use strict';

/* ============================================================
   ДАННЫЕ ПРОЕКТОВ
   Сюда добавляй свои проекты.
   Поля:
     title       — название
     description — 1–2 строки
     stack       — массив технологий
     image       — имя файла без расширения в assets/images/
                   (например, 'project-1' → project-1.webp / project-1.png)
     demo        — ссылка на демо ('#' пока нет)
     github      — ссылка на репозиторий ('#' пока нет)
     soon        — true, если проект ещё не готов (показывается бейдж "Скоро")
   ============================================================ */
const PROJECTS = [
  {
    title: 'Weather App',
    description: 'Погодное приложение с геолокацией и прогнозом на 5 дней. Работа с OpenWeatherMap API.',
    stack: ['HTML', 'CSS', 'JavaScript', 'API'],
    image: 'project-1',
    demo: 'https://stepanwellfill-blip.github.io/weather-app/',
    github: 'https://github.com/stepanwellfill-blip/weather-app',
    soon: false,
  },
  {
    title: 'Expense Tracker',
    description: 'Трекер личных расходов с категориями, общей суммой и интерактивной диаграммой. Данные хранятся в localStorage.',
    stack: ['HTML', 'CSS', 'JavaScript', 'Chart.js', 'localStorage'],
    image: 'project-2',
    demo: 'https://stepanwellfill-blip.github.io/expense-tracker/',
    github: 'https://github.com/stepanwellfill-blip/expense-tracker',
    soon: false,
  },
  {
    title: 'News Parser',
    description: 'Python-скрипт для сбора новостей с фильтрацией по ключевым словам. Экспорт в CSV и JSON, логирование и обработка ошибок.',
    stack: ['Python', 'requests', 'BeautifulSoup', 'CSV/JSON'],
    image: 'project-3',
    demo: '#', // Демо-версии нет, это консольный скрипт
    github: 'https://github.com/stepanwellfill-blip/news-parser',
    soon: false,
  },
];

/* ============================================================
   Константы
   ============================================================ */
const EMAIL = 'stepanwellfill@gmail.com';

/* ============================================================
   Утилиты
   ============================================================ */
function escapeHtml(str) {
  return String(str).replace(/[&<>"']/g, (ch) => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;',
  }[ch]));
}

function svgDataUri(svg) {
  return 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg);
}

/* Плейсхолдер для аватара: градиентный круг с инициалом */
function avatarPlaceholder(letter) {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200">
    <defs>
      <linearGradient id="ag" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stop-color="#6366f1"/>
        <stop offset="0.5" stop-color="#8b5cf6"/>
        <stop offset="1" stop-color="#06b6d4"/>
      </linearGradient>
    </defs>
    <rect width="200" height="200" fill="url(#ag)"/>
    <text x="100" y="108" text-anchor="middle" dominant-baseline="middle"
      font-family="Manrope, Inter, Arial, sans-serif" font-size="92" font-weight="700" fill="#ffffff">${escapeHtml(letter)}</text>
  </svg>`;
  return svgDataUri(svg);
}

/* Плейсхолдер для карточки проекта: градиентный прямоугольник с иконкой кода */
function projectPlaceholder() {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 240">
    <defs>
      <linearGradient id="pg" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stop-color="#6366f1"/>
        <stop offset="1" stop-color="#06b6d4"/>
      </linearGradient>
    </defs>
    <rect width="400" height="240" fill="url(#pg)"/>
    <g fill="none" stroke="#ffffff" stroke-width="4" stroke-linecap="round" stroke-linejoin="round" opacity="0.9">
      <path d="M170 100 L140 120 L170 140"/>
      <path d="M230 100 L260 120 L230 140"/>
      <path d="M215 88 L185 152"/>
    </g>
  </svg>`;
  return svgDataUri(svg);
}

/* ============================================================
   Рендер проектов
   ============================================================ */
function renderProjects() {
  const grid = document.getElementById('projects-grid');
  if (!grid) return;

  grid.innerHTML = PROJECTS.map((p) => {
    const title = escapeHtml(p.title);
    const badge = p.soon ? '<span class="project-card__badge">Скоро</span>' : '';
    const stack = (p.stack || []).map((s) => `<li>${escapeHtml(s)}</li>`).join('');

    // Берем SVG-плейсхолдер из функции, которую мы писали выше
    const fallbackSvg = projectPlaceholder();

    return `
      <article class="project-card reveal">
        <div class="project-card__media">
          <img
            src="assets/images/${escapeHtml(p.image)}.webp"
            alt="${title}"
            loading="lazy"
            onerror="this.onerror=null; this.src='${fallbackSvg}';"
          />
          ${badge}
        </div>
        <div class="project-card__body">
          <h3 class="project-card__title">${title}</h3>
          <p class="project-card__desc">${escapeHtml(p.description || '')}</p>
          <ul class="project-card__stack">${stack}</ul>
          <div class="project-card__links">
            <a href="${escapeHtml(p.demo || '#')}" class="project-card__link">Демо</a>
            <a href="${escapeHtml(p.github || '#')}" class="project-card__link">GitHub</a>
          </div>
        </div>
      </article>
    `;
  }).join('');
}

/* ============================================================
   Подстановка SVG, если файлы картинок не найдены
   ============================================================ */
function initImageFallbacks() {
  // 1. Ловим ошибки для картинок, которые сломаются в будущем
  document.addEventListener(
    'error',
    (e) => {
      const el = e.target;
      if (!el || el.tagName !== 'IMG') return;
      if (!el.dataset.fallback) return;
      if (el.dataset.fallbackApplied === '1') return;

      el.dataset.fallbackApplied = '1';
      if (el.dataset.fallback === 'avatar') {
        el.src = avatarPlaceholder(el.dataset.fallbackText || 'Р');
      } else {
        el.src = projectPlaceholder();
      }
    },
    true
  );

  // 2. Ловим картинки, которые УЖЕ сломались до запуска скрипта
  document.querySelectorAll('img[data-fallback]').forEach((img) => {
    if (img.complete && img.naturalWidth === 0) {
      img.dispatchEvent(new Event('error'));
    }
  });
}

/* ============================================================
   Появление секций при скролле
   ============================================================ */
let revealObserver;

function observeReveals() {
  if (!revealObserver) return;
  document.querySelectorAll('.reveal:not(.is-visible)').forEach((el) => {
    revealObserver.observe(el);
  });
}

function initRevealObserver() {
  if (!('IntersectionObserver' in window)) {
    document.querySelectorAll('.reveal').forEach((el) => el.classList.add('is-visible'));
    return;
  }

  revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: '0px 0px -60px 0px' }
  );

  observeReveals();
}

/* ============================================================
   Sticky header: blur при скролле
   ============================================================ */
function initHeaderScroll() {
  const header = document.getElementById('site-header');
  if (!header) return;

  const onScroll = () => {
    header.classList.toggle('is-scrolled', window.scrollY > 20);
  };

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
}

/* ============================================================
   Бургер-меню
   ============================================================ */
function initBurger() {
  const burger = document.getElementById('burger');
  const nav = document.getElementById('site-nav');
  const overlay = document.getElementById('nav-overlay');
  if (!burger || !nav || !overlay) return;

  const setOpen = (open) => {
    nav.classList.toggle('is-open', open);
    burger.classList.toggle('is-open', open);
    burger.setAttribute('aria-expanded', String(open));
    burger.setAttribute('aria-label', open ? 'Закрыть меню' : 'Открыть меню');
    overlay.classList.toggle('is-visible', open);
    document.body.classList.toggle('no-scroll', open);
  };

  burger.addEventListener('click', () => {
    setOpen(!nav.classList.contains('is-open'));
  });

  overlay.addEventListener('click', () => setOpen(false));

  nav.querySelectorAll('a').forEach((a) => {
    a.addEventListener('click', () => setOpen(false));
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && nav.classList.contains('is-open')) {
      setOpen(false);
      burger.focus();
    }
  });
}

/* ============================================================
   Плавный скролл по якорям
   ============================================================ */
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener('click', (e) => {
      const href = link.getAttribute('href');
      if (!href || href === '#') {
        e.preventDefault();
        return;
      }
      const target = document.querySelector(href);
      if (!target) return;
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });
}

/* ============================================================
   Активный пункт меню
   ============================================================ */
function initNavObserver() {
  const sections = document.querySelectorAll('main section[id]');
  const links = document.querySelectorAll('.site-nav__link');
  if (!sections.length || !links.length) return;

  if (!('IntersectionObserver' in window)) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const id = entry.target.id;
        links.forEach((link) => {
          link.classList.toggle('is-active', link.getAttribute('href') === '#' + id);
        });
      });
    },
    { rootMargin: '-45% 0px -50% 0px', threshold: 0 }
  );

  sections.forEach((s) => observer.observe(s));
}

/* ============================================================
   Копирование email + тост
   ============================================================ */
function initCopyEmail() {
  const btn = document.getElementById('copy-email');
  const toast = document.getElementById('toast');
  if (!btn || !toast) return;

  let timer = null;
  const showToast = (msg) => {
    toast.textContent = msg;
    toast.classList.add('is-visible');
    clearTimeout(timer);
    timer = setTimeout(() => toast.classList.remove('is-visible'), 2200);
  };

  const copyFallback = () => {
    const ta = document.createElement('textarea');
    ta.value = EMAIL;
    ta.setAttribute('readonly', '');
    ta.style.position = 'fixed';
    ta.style.opacity = '0';
    document.body.appendChild(ta);
    ta.select();
    let ok = false;
    try {
      ok = document.execCommand('copy');
    } catch {
      ok = false;
    }
    document.body.removeChild(ta);
    showToast(ok ? 'Скопировано' : 'Не удалось скопировать');
  };

  btn.addEventListener('click', async () => {
    if (navigator.clipboard && window.isSecureContext) {
      try {
        await navigator.clipboard.writeText(EMAIL);
        showToast('Скопировано');
      } catch {
        copyFallback();
      }
    } else {
      copyFallback();
    }
  });
}

/* ============================================================
   Год в футере
   ============================================================ */
function initYear() {
  const el = document.getElementById('year');
  if (el) el.textContent = String(new Date().getFullYear());
}

/* ============================================================
   Инициализация
   ============================================================ */
document.addEventListener('DOMContentLoaded', () => {
  initImageFallbacks();
  renderProjects();
  initRevealObserver();
  initHeaderScroll();
  initBurger();
  initSmoothScroll();
  initNavObserver();
  initCopyEmail();
  initYear();
});
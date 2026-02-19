(function () {
  'use strict';

  var STORAGE_KEY = 'theme';
  var THROTTLE_MS = 18;
  var PIXEL_SIZE = 3;
  var MAX_DOTS = 90;
  var DOTS_PER_MOVE = 2;
  var SPAWN_RADIUS = 8;
  var DRIFT_DECAY = 0.992;
  var COLORS = ['#ec4899', '#8b5cf6', '#06b6d4', '#f59e0b', '#22c55e', '#3b82f6', '#f43f5e', '#a855f7'];

  function getTheme() {
    if (typeof document === 'undefined') return 'light';
    try {
      return localStorage.getItem(STORAGE_KEY) || 'light';
    } catch (e) {
      return 'light';
    }
  }

  function getSystemTheme() {
    if (typeof window === 'undefined' || !window.matchMedia) return 'light';
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }

  function applyTheme(theme) {
    var root = document.documentElement;
    var resolved = theme === 'system' ? getSystemTheme() : theme;
    root.classList.remove('light', 'dark');
    root.classList.add(resolved);
    try {
      localStorage.setItem(STORAGE_KEY, theme);
    } catch (e) {}
    document.querySelectorAll('.theme-btn').forEach(function (btn) {
      var id = btn.getAttribute('data-theme');
      btn.setAttribute('data-active', id === theme ? 'true' : 'false');
    });
  }

  function initTheme() {
    applyTheme(getTheme());
    document.querySelectorAll('.theme-btn').forEach(function (btn) {
      btn.addEventListener('click', function () {
        applyTheme(btn.getAttribute('data-theme'));
      });
    });
    if (window.matchMedia) {
      window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', function () {
        if (getTheme() === 'system') applyTheme('system');
      });
    }
  }

  function initSectionReveal() {
    var sections = document.querySelectorAll('.section-reveal');
    if (typeof IntersectionObserver === 'undefined') {
      sections.forEach(function (s) {
        s.classList.add('visible');
      });
      return;
    }
    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) entry.target.classList.add('visible');
        });
      },
      { threshold: 0.05, rootMargin: '0px 0px -20px 0px' }
    );
    sections.forEach(function (s) {
      observer.observe(s);
    });
  }

  function initJobAccordion() {
    var container = document.getElementById('job-accordion');
    if (!container) return;

    var cards = container.querySelectorAll('[data-job]');
    var triggers = container.querySelectorAll('.job-card-trigger');
    var panels = container.querySelectorAll('.job-card-panel');

    function closeAll() {
      triggers.forEach(function (btn) {
        btn.setAttribute('aria-expanded', 'false');
      });
      panels.forEach(function (panel) {
        panel.style.gridTemplateRows = '0fr';
      });
    }

    function openPanel(trigger, panel) {
      closeAll();
      trigger.setAttribute('aria-expanded', 'true');
      panel.style.gridTemplateRows = '1fr';
    }

    triggers.forEach(function (trigger, i) {
      var panel = panels[i];
      if (!panel) return;

      trigger.addEventListener('click', function () {
        var isExpanded = trigger.getAttribute('aria-expanded') === 'true';
        if (isExpanded) {
          closeAll();
        } else {
          openPanel(trigger, panel);
        }
      });
    });
  }

  function initFooterLoop() {
    var el = document.getElementById('footer-loop');
    if (!el) return;
    var texts = ['© 2026 Vasuki Sunder.', 'vasuki.design'];
    var idx = 0;
    el.textContent = texts[0];
    setInterval(function () {
      idx = (idx + 1) % texts.length;
      el.textContent = texts[idx];
    }, 3000);
  }

  function initSparkles() {
    var container = document.getElementById('sparkles-container');
    if (!container) return;

    var trail = [];
    var lastMove = 0;
    var lastPos = { x: 0, y: 0 };
    var idCounter = 0;
    var colorIndex = 0;

    function pickColor(i) {
      return COLORS[i % COLORS.length];
    }

    function normalize(x, y) {
      var len = Math.hypot(x, y) || 1;
      return { x: x / len, y: y / len };
    }

    function tick() {
      trail.forEach(function (d) {
        d.x += d.vx;
        d.y += d.vy;
        d.vx *= DRIFT_DECAY;
        d.vy *= DRIFT_DECAY;
        d.el.style.left = d.x + 'px';
        d.el.style.top = d.y + 'px';
      });
      requestAnimationFrame(tick);
    }

    window.addEventListener('mousemove', function (e) {
      var now = Date.now();
      if (now - lastMove < THROTTLE_MS) return;
      lastMove = now;

      var cx = e.clientX;
      var cy = e.clientY;
      var vx = cx - lastPos.x;
      var vy = cy - lastPos.y;
      lastPos.x = cx;
      lastPos.y = cy;

      if (Math.hypot(vx, vy) < 0.1) return;

      var back = normalize(-vx, -vy);

      for (var i = 0; i < DOTS_PER_MOVE; i++) {
        var angle = Math.random() * Math.PI * 2;
        var r = Math.random() * SPAWN_RADIUS;
        var x = cx + Math.cos(angle) * r;
        var y = cy + Math.sin(angle) * r;
        var backward = 0.15 + Math.random() * 0.2;
        var scatter = 0.25 + Math.random() * 0.35;
        var dot = {
          id: ++idCounter,
          x: x,
          y: y,
          vx: back.x * backward + (Math.random() - 0.5) * scatter,
          vy: back.y * backward + (Math.random() - 0.5) * scatter,
          el: null,
        };
        var span = document.createElement('span');
        span.className = 'sparkle-dot';
        span.style.left = x + 'px';
        span.style.top = y + 'px';
        span.style.backgroundColor = pickColor(colorIndex++);
        container.appendChild(span);
        dot.el = span;
        trail.push(dot);
      }

      while (trail.length > MAX_DOTS) {
        var old = trail.shift();
        if (old && old.el && old.el.parentNode) old.el.parentNode.removeChild(old.el);
      }
    });

    requestAnimationFrame(tick);
  }

  initTheme();
  initSectionReveal();
  initJobAccordion();
  initFooterLoop();
  initSparkles();
})();

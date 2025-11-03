// main.js
// Alle internen Links nutzen data-href statt href
// Damit zeigt die Statusleiste beim Hover keine Ziel-URL an.

(function () {
  'use strict';

  function navigateTo(target, ev) {
    if (!target) return;
    // allow modifier clicks to work normally (open in new tab)
    if (ev && (ev.metaKey || ev.ctrlKey || ev.shiftKey || ev.altKey)) {
      // simulate a normal navigation for modifier clicks
      window.open(target, '_blank');
      return;
    }

    if (target.startsWith('#')) {
      const id = target.slice(1);
      const el = document.getElementById(id);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        history.pushState(null, '', target);
        return;
      }
    }

    // external URL or fallback
    window.location.href = target;
  }

  function initDataHref() {
    const nodes = Array.from(document.querySelectorAll('[data-href]'));
    nodes.forEach(el => {
      if (el.hasAttribute('href')) el.removeAttribute('href');
      el.setAttribute('role', 'link');
      if (!el.hasAttribute('tabindex')) el.setAttribute('tabindex', '0');

      const clickHandler = function (evt) {
        evt.preventDefault();
        evt.stopPropagation();
        const target = (el.getAttribute('data-href') || '').trim();
        navigateTo(target, evt);
      };

      el.addEventListener('click', clickHandler);
      el.addEventListener('keydown', function (ev) {
        if (ev.key === 'Enter' || ev.key === ' ') {
          ev.preventDefault();
          clickHandler(ev);
        }
      });

      // remove native status preview on mousedown where possible
      el.addEventListener('mousedown', function (ev) {
        if (ev.button === 0) ev.preventDefault();
      }, { passive: false });
    });
  }

  document.addEventListener('DOMContentLoaded', initDataHref);
})();

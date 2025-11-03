// main.js
// Zweck: alle internen Links über data-href handhaben,
// damit beim Hover in der Statusleiste keine Ziel-URL angezeigt wird.
// Links brauchen absichtlich kein href-Attribut.
// Die Navigation erfolgt programmgesteuert.

(function () {
  'use strict';

  // Utility: öffnet target. Wenn target ein Hash innerhalb der Seite ist, scrollen wir.
  function navigateTo(target) {
    if (!target) return;
    try {
      if (target.startsWith('#')) {
        const id = target.slice(1);
        const el = document.getElementById(id);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'start' });
          // update history without showing full URL on hover (keine href)
          history.pushState(null, '', target);
          return;
        }
      }
      // Externe URL oder normaler Pfad: wechseln
      window.location.href = target;
    } catch (e) {
      // Fallback: direkte Navigation
      window.location.href = target;
    }
  }

  // Setzt elemente so auf, dass sie wie Links funktionieren, aber kein href haben.
  function prepareLinkElements() {
    const selectors = '[data-href]';
    const nodes = Array.from(document.querySelectorAll(selectors));
    nodes.forEach(el => {
      // Entferne ein mögliches href, damit Browser-Statusleiste beim Hover nicht die Ziel-URL zeigt
      if (el.hasAttribute('href')) el.removeAttribute('href');

      // Rolle und tabindex für Tastatur/Accessibility
      el.setAttribute('role', 'link');
      if (!el.hasAttribute('tabindex')) el.setAttribute('tabindex', '0');

      // Click / Enter / Space handler
      const handler = (evt) => {
        // Allow modifiers to behave normally (open in new tab, etc.)
        if (evt.metaKey || evt.ctrlKey || evt.shiftKey || evt.altKey) return;
        evt.preventDefault();
        evt.stopPropagation();
        const target = String(el.getAttribute('data-href') || '').trim();
        navigateTo(target);
      };

      el.addEventListener('click', handler);
      el.addEventListener('keydown', (ev) => {
        if (ev.key === 'Enter' || ev.key === ' ') {
          ev.preventDefault();
          handler(ev);
        }
      });

      // Optional: mousedown trigger for snappier feel on some devices
      el.addEventListener('mousedown', (ev) => {
        if (ev.button === 0) {
          // same behavior as click but without showing the hover URL in status bar beforehand
          ev.preventDefault();
        }
      }, { passive: false });
    });
  }

  // Prevent long-press/context menu from revealing a link preview on some mobile browsers
  function disableContextOnDataHref() {
    document.addEventListener('contextmenu', function (e) {
      const target = e.target.closest && e.target.closest('[data-href]');
      if (target) {
        // allow user to open context menu if they explicitly want to copy etc.
        // we do not block the menu completely, but we avoid default browser link preview behavior because href is absent
        return;
      }
    }, true);
  }

  // Initialize
  document.addEventListener('DOMContentLoaded', function () {
    prepareLinkElements();
    disableContextOnDataHref();
  });
})();

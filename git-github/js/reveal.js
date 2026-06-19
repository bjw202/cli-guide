/* =================================================================
   SPEC-GIT-GITHUB-IMPL-001 — 스크롤 리빌
   tmux main.js initReveal 추출·재포장.
   REQ-007: reduced-motion 또는 IO 미지원 시 즉시 표시.
   (fake-terminal / 다이어그램 로직은 P3 범위 — 여기서는 제외)
   ================================================================= */
(function () {
  'use strict';

  var prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function initReveal() {
    var els = document.querySelectorAll('[data-reveal]');
    if (!els.length) return;

    // REQ-007: reduced-motion 또는 IO 미지원 시 transition 없이 즉시 표시
    if (prefersReducedMotion || !('IntersectionObserver' in window)) {
      els.forEach(function (el) {
        el.classList.add('is-visible');
      });
      return;
    }

    var io = new IntersectionObserver(
      function (entries, obs) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            obs.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -8% 0px' }
    );

    els.forEach(function (el) {
      io.observe(el);
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initReveal);
  } else {
    initReveal();
  }
})();

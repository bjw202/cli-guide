/* =================================================================
   SPEC-GIT-GITHUB-IMPL-004 (P4) — R03 FAQ 아코디언 (vanilla JS)
   tmux FAQItem 패턴을 본 사이트에서 독립 재구현 (REQ-012: tmux 원본 무결성).
   file:// 동작 필수 (REQ-010).
   ================================================================= */
(function () {
  'use strict';

  function init() {
    const faqs = document.querySelectorAll('.faq');
    if (!faqs.length) return;

    faqs.forEach(function (faq) {
      faq.addEventListener('click', function (e) {
        const trigger = e.target.closest('.faq-trigger');
        if (!trigger) return;
        const item = trigger.parentElement;
        const content = item.querySelector('.faq-content');
        const isOpen = item.classList.contains('is-open');

        // 단일 오픈 정책(같은 .faq 안에서 나머지 접기)
        faq.querySelectorAll('.faq-item').forEach(function (other) {
          if (other === item) return;
          other.classList.remove('is-open');
          const ot = other.querySelector('.faq-trigger');
          const oc = other.querySelector('.faq-content');
          if (ot) ot.setAttribute('aria-expanded', 'false');
          if (oc) oc.style.maxHeight = null;
        });

        if (isOpen) {
          item.classList.remove('is-open');
          trigger.setAttribute('aria-expanded', 'false');
          content.style.maxHeight = null;
        } else {
          item.classList.add('is-open');
          trigger.setAttribute('aria-expanded', 'true');
          content.style.maxHeight = content.scrollHeight + 'px';
        }
      });

      // URL fragment(#faq-N)로 직접 진입 시 해당 항목 펼치기
      const hash = location.hash;
      if (hash) {
        const target = faq.querySelector(hash + '.faq-item') ||
                       document.getElementById(hash.slice(1));
        if (target && target.classList.contains('faq-item')) {
          const trig = target.querySelector('.faq-trigger');
          const cont = target.querySelector('.faq-content');
          if (trig && cont) {
            target.classList.add('is-open');
            trig.setAttribute('aria-expanded', 'true');
            cont.style.maxHeight = cont.scrollHeight + 'px';
          }
        }
      }
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();

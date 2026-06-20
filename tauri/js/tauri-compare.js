/* =================================================================
   SPEC-TAURI-IMPL-002 — CompareToggle (design-guide C)
   Electron/Tauri 비교 매트릭스에서 보기 모드를 토글해 해당 열을
   하이라이트(REQ-005). reduced-motion 즉시 전환(REQ-007). 키보드(REQ-008).
   ================================================================= */
(function () {
  'use strict';

  function init(root) {
    var table = root.querySelector('[data-compare-table]');
    var buttons = root.querySelectorAll('[data-compare-focus]');
    if (!table || !buttons.length) return;

    function setFocus(mode) {
      table.classList.remove('focus-electron', 'focus-tauri');
      if (mode === 'electron') table.classList.add('focus-electron');
      else if (mode === 'tauri') table.classList.add('focus-tauri');
      buttons.forEach(function (btn) {
        var target = btn.getAttribute('data-compare-focus');
        btn.classList.toggle('is-active', target === mode);
        btn.setAttribute('aria-pressed', String(target === mode));
      });
    }

    buttons.forEach(function (btn) {
      btn.addEventListener('click', function () {
        var mode = btn.getAttribute('data-compare-focus');
        // 같은 모드 재클릭 시 해제
        if (table.classList.contains('focus-' + mode)) {
          setFocus('both');
        } else {
          setFocus(mode);
        }
      });
    });
  }

  function start() { document.querySelectorAll('[data-asset="compare-toggle"]').forEach(init); }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start);
  else start();
})();

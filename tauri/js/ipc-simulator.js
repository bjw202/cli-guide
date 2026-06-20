/* =================================================================
   SPEC-TAURI-IMPL-006 — InvokeSimulator (design-guide F)
   브라우저에서 "프론트 invoke → Rust command → 결과" 회로를 모의 체험.
   실제 Rust 없이 IPC 흐름 감(REQ-003). reduced-motion 즉시 결과(REQ-007).
   ================================================================= */
(function () {
  'use strict';
  var REDUCED = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function init(root) {
    var input = root.querySelector('[data-invoke-input]');
    var btn = root.querySelector('[data-invoke-btn]');
    var out = root.querySelector('[data-invoke-out]');
    if (!btn || !out) return;

    function escapeHTML(s) {
      return String(s).replace(/[&<>]/g, function (c) {
        return { '&': '&amp;', '<': '&lt;', '>': '&gt;' }[c];
      });
    }

    function run() {
      var name = (input && input.value ? input.value : '지웅').trim() || '친구';
      var rust = '<span class="rust-cmd">// Rust (백엔드) — #[tauri::command]가 응답</span>\nfn greet(name: String) -> String {\n    format!("안녕, {}!", name)\n}';
      var js = '<span class="js-cmd">// 프론트엔드 (JS) — invoke로 주문</span>\nawait invoke("greet", { name: "' + escapeHTML(name) + '" })';
      var result = '// 결과\n"안녕, ' + escapeHTML(name) + '!"';

      function render() {
        out.innerHTML = js + '\n\n' + rust + '\n\n' + result;
        out.setAttribute('role', 'status');
      }

      if (REDUCED) { render(); return; }
      out.innerHTML = '<span class="js-cmd">// invoke 전송 중...</span>';
      setTimeout(render, 350);
    }

    btn.addEventListener('click', run);
    if (input) {
      input.addEventListener('keydown', function (e) { if (e.key === 'Enter') run(); });
    }
  }

  function start() { document.querySelectorAll('[data-asset="invoke-sim"]').forEach(init); }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start);
  else start();
})();

/* =================================================================
   SPEC-GIT-GITHUB-IMPL-006 — ConflictResolverMini (design-guide N)
   충돌 난 파일에서 두 버전(A/B) 토글 선택 → 결과 미리보기 (REQ-007).
   reduced-motion: 즉시 전환 (REQ-004). 키보드 라디오 조작 (REQ-005).
   ================================================================= */
(function () {
  'use strict';

  function init(root) {
    var lines = root.querySelectorAll('[data-conflict-line]');
    var preview = root.querySelector('[data-conflict-preview]');

    function choiceFor(line) {
      var checked = line.querySelector('input[type="radio"]:checked');
      return checked ? checked.value : 'a';
    }

    function resolve() {
      var out = [];
      lines.forEach(function (line) {
        var choice = choiceFor(line);
        var text = line.getAttribute('data-text-' + choice) || '';
        out.push(text);
      });
      if (preview) {
        preview.innerHTML = '<pre class="conflict__result-pre"></pre>';
        preview.querySelector('pre').textContent = out.join('\n');
        preview.setAttribute('role', 'status');
      }
    }

    lines.forEach(function (line) {
      var radios = line.querySelectorAll('input[type="radio"]');
      radios.forEach(function (r) {
        r.addEventListener('change', resolve);
      });
      // 본문 A/B 미리보기 토글
      radios.forEach(function (r) {
        r.addEventListener('change', function () {
          var v = r.value;
          line.querySelector('.conflict__line-a').classList.toggle('is-chosen', v === 'a');
          line.querySelector('.conflict__line-b').classList.toggle('is-chosen', v === 'b');
        });
      });
    });

    resolve();
  }

  function start() { document.querySelectorAll('[data-asset="conflict-resolver"]').forEach(init); }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start);
  else start();
})();

/* =================================================================
   SPEC-GIT-GITHUB-IMPL-006 — StagingFlowDiagram (design-guide D)
   3개 방(working/staging/repo) 사이 파일 이동.
   add → working→staging, commit → staging→repo (REQ-009).
   reduced-motion: transition 없이 즉시 위치 전환 (REQ-004).
   ================================================================= */
(function () {
  'use strict';

  var REDUCED = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var GREEN = '#2E7D52';
  var CORAL = '#FF8A5B';
  var INDIGO = '#5B6CFF';

  function init(root) {
    var rooms = {
      working: root.querySelector('[data-room="working"]'),
      staging: root.querySelector('[data-room="staging"]'),
      repo: root.querySelector('[data-room="repo"]')
    };
    var counts = { working: 3, staging: 0, repo: 0 };
    var log = root.querySelector('[data-staging-log]');

    function render() {
      Object.keys(rooms).forEach(function (k) {
        var room = rooms[k];
        var box = room.querySelector('[data-room-files]');
        var badge = room.querySelector('[data-room-count]');
        box.innerHTML = '';
        for (var i = 0; i < counts[k]; i++) {
          var f = document.createElement('span');
          f.className = 'staging-file';
          f.setAttribute('aria-hidden', 'true');
          f.textContent = '📄';
          box.appendChild(f);
        }
        if (badge) {
          badge.textContent = counts[k] + '개';
          room.classList.toggle('is-active', counts[k] > 0);
        }
      });
    }

    function move(from, to, label) {
      if (counts[from] <= 0) return false;
      counts[from]--; counts[to]++;
      render();
      if (log) log.textContent = label;
      return true;
    }

    var actions = {
      add: function () { return move('working', 'staging', 'git add: 작업 방 → 대기 방으로 파일이 올라갔어요.'); },
      commit: function () { return move('staging', 'repo', 'git commit: 대기 방의 파일들이 기록 방에 영구 저장됐어요.'); },
      reset: function () {
        counts = { working: 3, staging: 0, repo: 0 };
        render();
        if (log) log.textContent = '초기 상태로 되돌렸어요.';
      }
    };

    root.querySelectorAll('[data-staging-action]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var act = btn.getAttribute('data-staging-action');
        if (REDUCED) { actions[act](); return; }
        btn.disabled = true;
        setTimeout(function () { actions[act](); btn.disabled = false; }, 180);
      });
    });

    render();
  }

  function start() { document.querySelectorAll('[data-asset="staging-flow"]').forEach(init); }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start);
  else start();
})();

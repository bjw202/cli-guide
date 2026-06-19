/* =================================================================
   SPEC-GIT-GITHUB-IMPL-006 — ActionsPipelineAnimation (design-guide F)
   event → job → step → artifact → deploy 5단계 순차 하이라이트 (REQ-008).
   성공 = --git-green, 실패 = --warning (REQ-012).
   reduced-motion: 즉시 전환, 단계별은 유지 (REQ-004).
   ================================================================= */
(function () {
  'use strict';

  var REDUCED = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  var STAGES = [
    { key: 'event',    icon: '⚡', label: 'event',   desc: 'push 이벤트 발생 — "코드가 올라왔어!" 신호.' },
    { key: 'job',      icon: '🤖', label: 'job',     desc: 'runner 로봇이 깨어나 작업을 받아요.' },
    { key: 'step',     icon: '🔧', label: 'step',    desc: '테스트·빌드 단계를 차례로 실행해요.' },
    { key: 'artifact', icon: '📦', label: 'artifact', desc: '빌드 결과물(아티팩트)이 만들어져요.' },
    { key: 'deploy',   icon: '🚀', label: 'deploy',  desc: '배포 완료 — 사용자가 새 버전을 써요.' }
  ];

  function init(root) {
    var belt = root.querySelector('[data-pipeline-belt]');
    var detail = root.querySelector('[data-pipeline-detail]');
    var playBtn = root.querySelector('[data-pipeline-play]');
    var failBtn = root.querySelector('[data-pipeline-fail]');
    var current = -1;
    var timer = null;

    STAGES.forEach(function (s, i) {
      var seg = document.createElement('div');
      seg.className = 'pipeline__stage';
      seg.setAttribute('data-pipeline-idx', i);
      seg.innerHTML = '<span class="pipeline__icon" aria-hidden="true">' + s.icon + '</span>' +
        '<span class="pipeline__label">' + s.label + '</span>';
      if (i < STAGES.length - 1) {
        var con = document.createElement('span');
        con.className = 'pipeline__conveyor';
        con.setAttribute('aria-hidden', 'true');
        belt.appendChild(seg);
        belt.appendChild(con);
      } else {
        belt.appendChild(seg);
      }
    });

    var stages = root.querySelectorAll('[data-pipeline-idx]');

    function setStage(i, failed) {
      current = i;
      stages.forEach(function (n, idx) {
        n.classList.remove('is-active', 'is-done', 'is-failed');
        if (failed && idx === i) n.classList.add('is-failed');
        else if (idx === i) n.classList.add('is-active');
        else if (idx < i) n.classList.add('is-done');
      });
      var s = STAGES[i];
      detail.innerHTML = '<strong>' + (i + 1) + '. ' + s.label + '</strong>' +
        '<p>' + (failed ? '❌ 이 단계에서 실패! 로그를 확인하고 고쳐야 해요.' : s.desc) + '</p>';
      detail.setAttribute('role', 'status');
    }

    function play(failAt) {
      stop();
      var i = 0;
      function next() {
        var failed = (failAt != null && i === failAt);
        setStage(i, failed);
        if (failed) { stop(); return; }
        i++;
        if (i < STAGES.length) timer = setTimeout(next, REDUCED ? 350 : 1000);
      }
      next();
    }
    function stop() { if (timer) { clearTimeout(timer); timer = null; } }

    if (playBtn) playBtn.addEventListener('click', function () { play(null); });
    if (failBtn) failBtn.addEventListener('click', function () { play(2); });
    setStage(0, false);
  }

  function start() { document.querySelectorAll('[data-asset="actions-pipeline"]').forEach(init); }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start);
  else start();
})();

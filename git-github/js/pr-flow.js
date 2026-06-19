/* =================================================================
   SPEC-GIT-GITHUB-IMPL-006 — PRFlowDiagram (design-guide E)
   fork → branch → commit → push → PR → review → merge 7단계 순차
   하이라이트 (REQ-010). 각 노드 포커스/클릭 시 상세 설명 (REQ-005).
   reduced-motion: transition 없이 즉시 하이라이트 (REQ-004).
   ================================================================= */
(function () {
  'use strict';

  var REDUCED = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  var STEPS = [
    { key: 'fork',   icon: '🍴', label: 'fork',   desc: '원본 저장소를 내 계정로 복사해요. 원본에 직접 쓸 권한이 없어도 이렇게 시작.' },
    { key: 'branch', icon: '🌿', label: 'branch', desc: '내 복사본에서 새 브랜치를 만들어 작업해요. main은 그대로 두고.' },
    { key: 'commit', icon: '📦', label: 'commit', desc: '변경사항을 커밋으로 묶어요. 한 번에 하나의 명확한 의도로.' },
    { key: 'push',   icon: '☁️', label: 'push',   desc: '내 커밋을 GitHub(원격)로 올려요. 이제 다른 사람이 볼 수 있어요.' },
    { key: 'PR',     icon: '📨', label: 'PR',     desc: 'Pull Request: "내 변경사항을 원본에 넣어주세요"라고 제안해요.' },
    { key: 'review', icon: '🔍', label: 'review', desc: '메인테이너가 코드를 검토해요. 코멘트·수정 요청이 오갈 수 있어요.' },
    { key: 'merge',  icon: '✅', label: 'merge',  desc: '승인되면 원본(main)에 병합돼요. 이제 전 세계가 내 코드를 써요.' }
  ];

  function init(root) {
    var track = root.querySelector('[data-pr-track]');
    var detail = root.querySelector('[data-pr-detail]');
    var playBtn = root.querySelector('[data-pr-play]');
    var current = -1;
    var timer = null;

    STEPS.forEach(function (s, i) {
      var node = document.createElement('button');
      node.type = 'button';
      node.className = 'pr-flow__node';
      node.setAttribute('data-pr-idx', i);
      node.setAttribute('aria-label', s.label + ' 단계');
      node.innerHTML = '<span class="pr-flow__icon" aria-hidden="true">' + s.icon + '</span>' +
        '<span class="pr-flow__label">' + s.label + '</span>';
      node.addEventListener('click', function () { stop(); highlight(i); });
      if (i < STEPS.length - 1) {
        var arrow = document.createElement('span');
        arrow.className = 'pr-flow__arrow';
        arrow.setAttribute('aria-hidden', 'true');
        arrow.textContent = '→';
        track.appendChild(node);
        track.appendChild(arrow);
      } else {
        track.appendChild(node);
      }
    });

    var nodes = root.querySelectorAll('[data-pr-idx]');

    function highlight(i) {
      current = i;
      nodes.forEach(function (n, idx) {
        n.classList.toggle('is-active', idx === i);
        n.classList.toggle('is-done', idx < i);
      });
      var s = STEPS[i];
      detail.innerHTML = '<strong>' + (i + 1) + '. ' + s.label + '</strong>' +
        '<p>' + s.desc + '</p>';
      detail.setAttribute('role', 'status');
    }

    function play() {
      stop();
      var i = 0;
      function next() {
        highlight(i);
        i++;
        if (i < STEPS.length) timer = setTimeout(next, REDUCED ? 400 : 1200);
      }
      next();
    }
    function stop() { if (timer) { clearTimeout(timer); timer = null; } }

    if (playBtn) playBtn.addEventListener('click', play);
    highlight(0);
  }

  function start() { document.querySelectorAll('[data-asset="pr-flow"]').forEach(init); }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start);
  else start();
})();

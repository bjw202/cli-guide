/* =================================================================
   SPEC-TAURI-IMPL-003 — WorkflowStepper (design-guide E)
   scaffold → dev → 작성 → build → 인스톨러 순차 하이라이트(REQ-004).
   Git PRFlowDiagram 패턴 추출·재포장. reduced-motion(REQ-007), 키보드(REQ-008).
   ================================================================= */
(function () {
  'use strict';
  var REDUCED = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  var STEPS = [
    { icon: '🏗️', label: 'scaffold', title: 'scaffold — 앱 뼈대 만들기',
      cmd: 'npm create tauri-app@latest',
      desc: '`npm create tauri-app` 한 줄로 프론트(React/Vue/Svelte/vanilla) + Rust 백엔드 뼈대가 만들어져요.' },
    { icon: '🔁', label: 'dev', title: 'dev — 뜨거운 개발',
      cmd: 'cargo tauri dev',
      desc: '`cargo tauri dev`로 실행하면 프론트와 Rust가 동시에 핫 리로드돼요. 저장하면 바로 반영.' },
    { icon: '✏️', label: '작성', title: '작성 — 화면과 명령 짜기',
      cmd: '# frontend: invoke()  /  backend: #[tauri::command]',
      desc: '프론트엔드는 웹처럼 짜고, Rust에 `#[tauri::command]`로 명령을 만들어 프론트에서 `invoke`로 불러요.' },
    { icon: '📦', label: 'build', title: 'build — 완성품 굽기',
      cmd: 'cargo tauri build',
      desc: '`cargo tauri build`로 운영체제별 인스톨러를 만들어요. Rust는 릴리즈 최적화까지 알아서.' },
    { icon: '🚀', label: '인스톨러', title: '인스톨러 — 배포',
      cmd: '# .msi / .dmg / .deb / .AppImage',
      desc: 'Windows는 .msi, macOS는 .dmg, Linux는 .deb/.AppImage. (Tauri 2) `tauri android`/`ios`로 모바일도.' }
  ];

  function init(root) {
    var track = root.querySelector('[data-workflow-track]');
    var detail = root.querySelector('[data-workflow-detail]');
    var playBtn = root.querySelector('[data-workflow-play]');
    var current = -1;
    var timer = null;

    STEPS.forEach(function (s, i) {
      var node = document.createElement('button');
      node.type = 'button';
      node.className = 'workflow-stepper__node';
      node.setAttribute('data-wf-idx', i);
      node.setAttribute('aria-label', s.label + ' 단계');
      node.innerHTML = '<span class="workflow-stepper__icon" aria-hidden="true">' + s.icon + '</span>' +
        '<span>' + s.label + '</span>';
      node.addEventListener('click', function () { stop(); highlight(i); });
      track.appendChild(node);
      if (i < STEPS.length - 1) {
        var ar = document.createElement('span');
        ar.className = 'workflow-stepper__arrow';
        ar.setAttribute('aria-hidden', 'true');
        ar.textContent = '→';
        track.appendChild(ar);
      }
    });

    var nodes = root.querySelectorAll('[data-wf-idx]');

    function highlight(i) {
      current = i;
      nodes.forEach(function (n, idx) {
        n.classList.remove('is-active', 'is-done');
        if (idx === i) n.classList.add('is-active');
        else if (idx < i) n.classList.add('is-done');
      });
      var s = STEPS[i];
      detail.innerHTML = '<strong>' + s.title + '</strong>' +
        '<p><code>' + s.cmd + '</code><br>' + s.desc + '</p>';
      detail.setAttribute('role', 'status');
    }

    function play() {
      stop();
      var i = 0;
      function next() {
        highlight(i); i++;
        if (i < STEPS.length) timer = setTimeout(next, REDUCED ? 600 : 1600);
      }
      next();
    }
    function stop() { if (timer) { clearTimeout(timer); timer = null; } }

    if (playBtn) playBtn.addEventListener('click', play);
    highlight(0);
  }

  function start() { document.querySelectorAll('[data-asset="workflow-stepper"]').forEach(init); }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start);
  else start();
})();

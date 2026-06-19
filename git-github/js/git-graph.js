/* =================================================================
   SPEC-GIT-GITHUB-IMPL-006 — GitGraphVisualizer (design-guide C)
   인터랙티브 commit 그래프: main 일직선 → feature 분기 → 커밋 →
   merge 합류 (REQ-001) → (선택) rebase 재배치 (REQ-002).
   인라인 SVG. reduced-motion 즉시 전환 (REQ-004). 키보드 조작 (REQ-005).
   단일 독립 모듈, 빌드 없음 (REQ-013).
   ================================================================= */
(function () {
  'use strict';

  var REDUCED = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var GREEN = '#2E7D52';   // --git-green (성공/합류, REQ-012)
  var CORAL = '#FF8A5B';   // --primary (main)
  var INDIGO = '#5B6CFF';  // --village-indigo (feature)

  function init(root) {
    var W = 520, H = 260, stepX = 70, baseY = 130;
    var svg = root.querySelector('svg.git-graph__svg');
    var stage = 0; // 0:main 1:branch 2:commits 3:merge 4:rebase
    var buttons = root.querySelectorAll('[data-graph-step]');

    function coord(i, y) { return { x: 40 + i * stepX, y: y == null ? baseY : y }; }

    function draw() {
      svg.innerHTML = '';
      var ns = 'http://www.w3.org/2000/svg';
      function el(name, attrs) {
        var e = document.createElementNS(ns, name);
        for (var k in attrs) e.setAttribute(k, attrs[k]);
        return e;
      }
      function line(x1, y1, x2, y2, color, w) {
        svg.appendChild(el('path', {
          d: 'M' + x1 + ' ' + y1 + ' L' + x2 + ' ' + y2,
          stroke: color, 'stroke-width': w || 4, fill: 'none',
          'stroke-linecap': 'round'
        }));
      }
      function node(x, y, color, label) {
        svg.appendChild(el('circle', { cx: x, cy: y, r: 11, fill: color, stroke: '#fff', 'stroke-width': 2 }));
        if (label) {
          var t = el('text', { x: x, y: y + 30, 'text-anchor': 'middle',
            'font-size': 12, 'font-family': 'monospace', fill: '#7A726B' });
          t.textContent = label; svg.appendChild(t);
        }
      }

      // main 일직선 커밋 개수 (단계에 따라)
      var mainCount = stage >= 3 ? 4 : 3;
      for (var i = 0; i < mainCount; i++) {
        var a = coord(i), b = coord(i + 1);
        if (i < mainCount - 1) line(a.x, a.y, b.x, b.y, CORAL);
      }

      if (stage >= 1) {
        // feature 가지 분기 (main 인덱스 1에서 위로)
        var bx = coord(1).x;
        var fY = baseY - 56;
        line(bx, baseY, bx, fY, INDIGO);
        if (stage >= 2) {
          // feature 커밋 2개 (오른쪽으로)
          line(bx, fY, bx + stepX, fY, INDIGO);
          if (stage < 4) line(bx + stepX, fY, bx + 2 * stepX, fY, INDIGO);
          node(bx, fY, INDIGO, 'f1');
          node(bx + stepX, fY, INDIGO, 'f2');
        }
      }

      // main 노드들
      for (var m = 0; m < mainCount; m++) node(coord(m).x, baseY, CORAL, 'm' + (m + 1));

      if (stage === 3) {
        // merge: feature 끝(main 인덱스 3)으로 합류 (REQ-001)
        var mx = coord(3).x;
        var fx = coord(1).x + 2 * stepX;
        line(fx, baseY - 56, mx, baseY, GREEN, 5);
        node(mx, baseY, GREEN, 'merge');
      }
      if (stage === 4) {
        // rebase: feature 커밋들이 main 끝으로 재배치 → 일직선 (REQ-002)
        var end = coord(mainCount - 1).x;
        line(end, baseY, end + stepX, baseY, INDIGO);
        line(end + stepX, baseY, end + 2 * stepX, baseY, INDIGO);
        node(end + stepX, baseY, INDIGO, "f1'");
        node(end + 2 * stepX, baseY, INDIGO, "f2'");
      }
      // 범례/설명 갱신
      var cap = root.querySelector('[data-graph-caption]');
      if (cap) cap.textContent = CAPTIONS[stage];
    }

    var CAPTIONS = [
      'main 브랜치: 커밋이 일렬로 쌓이는 기준 줄기.',
      'feature 브랜치 생성: main에서 새 가지가 위로 갈라져요.',
      '각 가지에 커밋 추가: main과 feature가 각자 진행돼요.',
      'merge: 두 가지가 하나의 합류 노드에서 만나요.',
      'rebase: feature 커밋들이 main 끝으로 재배치돼 역사가 일직선으로.'
    ];

    function setStage(s) {
      stage = Math.max(0, Math.min(4, s));
      buttons.forEach(function (btn) {
        var target = Number(btn.getAttribute('data-graph-step'));
        btn.setAttribute('aria-pressed', String(target === stage));
      });
      if (REDUCED) { draw(); return; }
      root.style.opacity = '0.6';
      setTimeout(function () { draw(); root.style.opacity = '1'; }, 120);
    }

    buttons.forEach(function (btn) {
      btn.addEventListener('click', function () {
        setStage(Number(btn.getAttribute('data-graph-step')));
      });
    });

    root.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowRight') { setStage(stage + 1); e.preventDefault(); }
      else if (e.key === 'ArrowLeft') { setStage(stage - 1); e.preventDefault(); }
    });

    setStage(0);
  }

  function start() {
    document.querySelectorAll('[data-asset="git-graph"]').forEach(init);
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start);
  else start();
})();

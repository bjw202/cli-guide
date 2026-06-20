/* =================================================================
 * SPEC-GIT-GITHUB-IMPL-003 — FakeTerminal (git 명령 타이핑 재생)
 * 순수 바닐라 JS. 빌드/프레임워크/라이브러리 없음.
 * tmux/js/main.js fake-terminal 패턴을 추출·재포장(IMPL-001 결정 6.2).
 * tmux 원본은 수정하지 않는다(REQ-013).
 *
 * 동작:
 *  - <div class="fake-terminal" data-terminal-script='[{...},...]'>
 *    요소를 찾아, 뷰포트 진입 시 스크립트를 타이핑 애니메이션으로 재생.
 *  - 각 단계: { cmd: "git init", out: [{t:"ok",s:"Initialized..."}] }
 *    out 항목 t 종류: "ok"(초록) / "out"(회색) / "hi"(민트) / "warn"(코랄).
 *  - prefers-reduced-motion 또는 IntersectionObserver 미지원 시 즉시 전체 표시(REQ-012).
 * 모든 주석은 한국어(code_comments 설정).
 * ================================================================= */
(function () {
  'use strict';

  var prefersReducedMotion =
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* 출력 줄 색상 클래스 → 텍스트 그대로 렌더 (XSS 회피: textContent 사용) */
  function appendLine(body, segs) {
    var line = document.createElement('div');
    line.className = 'fterm__line';
    if (segs.cmd) {
      var prompt = document.createElement('span');
      prompt.className = 'fterm__prompt';
      prompt.textContent = '$';
      line.appendChild(prompt);
      line.appendChild(document.createTextNode(' '));
      var cmd = document.createElement('span');
      cmd.className = 'fterm__cmd';
      cmd.textContent = segs.cmd;
      line.appendChild(cmd);
    } else if (segs.t) {
      var out = document.createElement('span');
      out.className = 'fterm__out fterm__out--' + segs.t;
      out.textContent = segs.s;
      line.appendChild(out);
    }
    body.appendChild(line);
    return line;
  }

  /* 타이핑 애니메이션: 한 글자씩 cmd 스팬에 채움 */
  function typeInto(span, text, done) {
    var i = 0;
    function step() {
      if (i <= text.length) {
        span.textContent = text.slice(0, i);
        i += 1;
        setTimeout(step, prefersReducedMotion ? 0 : 38);
      } else if (typeof done === 'function') {
        done();
      }
    }
    step();
  }

  /* 단일 터미널 재생 */
  function play(term) {
    var raw = term.getAttribute('data-terminal-script');
    var steps;
    try {
      steps = JSON.parse(raw);
    } catch (e) {
      return; // 스크립트가 없거나 무효면 정적 콘텐츠 그대로
    }
    if (!steps || !steps.length) return;

    var body = term.querySelector('.fterm__body');
    if (!body) return;
    body.innerHTML = ''; // 정적 placeholder 제거

    var idx = 0;
    function nextStep() {
      if (idx >= steps.length) {
        // 완료 커서 제거
        var cursors = body.querySelectorAll('.fterm__cursor');
        cursors.forEach(function (c) { c.remove(); });
        return;
      }
      var step = steps[idx];
      idx += 1;

      // 명령 줄 추가(커서와 함께)
      var line = appendLine(body, { cmd: '' });
      var cmdSpan = line.querySelector('.fterm__cmd');
      var cursor = document.createElement('span');
      cursor.className = 'fterm__cursor';
      line.appendChild(cursor);

      body.scrollTop = body.scrollHeight;

      typeInto(cmdSpan, step.cmd, function () {
        cursor.remove();
        // 출력 줄들 추가
        var outs = step.out || [];
        var delay = prefersReducedMotion ? 0 : 120;
        outs.forEach(function (o, k) {
          setTimeout(function () {
            appendLine(body, o);
            body.scrollTop = body.scrollHeight;
          }, delay + k * (prefersReducedMotion ? 0 : 90));
        });
        setTimeout(nextStep, delay + outs.length * (prefersReducedMotion ? 0 : 90) + 220);
      });
    }

    nextStep();
  }

  /* 즉시 전체 표시(reduced-motion / IO 미지원) */
  function renderInstant(term) {
    var raw = term.getAttribute('data-terminal-script');
    var steps;
    try { steps = JSON.parse(raw); } catch (e) { return; }
    if (!steps || !steps.length) return;
    var body = term.querySelector('.fterm__body');
    if (!body) return;
    body.innerHTML = '';
    steps.forEach(function (step) {
      appendLine(body, { cmd: step.cmd });
      (step.out || []).forEach(function (o) { appendLine(body, o); });
    });
  }

  function init() {
    var terms = Array.prototype.slice.call(document.querySelectorAll('.fake-terminal'));
    if (!terms.length) return;

    if (prefersReducedMotion || !('IntersectionObserver' in window)) {
      terms.forEach(renderInstant);
      return;
    }

    var io = new IntersectionObserver(function (entries, obs) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          obs.unobserve(entry.target);
          play(entry.target);
        }
      });
    }, { threshold: 0.3 });
    terms.forEach(function (t) { io.observe(t); });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();

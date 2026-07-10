/* =================================================================
   SPEC-GIT-GITHUB-IMPL-009 — GitHub mock UI 인터랙션 엔진 (gh-ui.js)
   IMPL-006 js/pr-flow.js 패턴 상속: IIFE + 'use strict' + data-asset 진입 +
   REDUCED = matchMedia('(prefers-reduced-motion: reduce)') + 프레임워크 없음.

   data-asset 훅 5종:
     gh-pins     — 핀 ↔ 범례 양방향 하이라이트 (REQ-006/007/008)
     gh-tabs     — PR 탭 전환, role=tablist + 화살표 키 (REQ-009/015)
     gh-diff     — 라인 코멘트 → Start a review(pending) → Submit review 배치 (REQ-010)
     gh-board    — 카드 다음 열 이동 + Status 동기 (REQ-011)
     gh-mergebox — 체크 통과/실패 토글 → merge 버튼 활성/비활성 (REQ-012)

   REDUCED 시 애니메이션 없이 즉시 상태 전환. 정보는 정적으로 온전히 전달 (REQ-014).
   file:// 에서 동작 — fetch·모듈 import 없음 (REQ-019).
   ================================================================= */
(function () {
  'use strict';

  var REDUCED = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* 자산별 유니크 id 접두사 생성용 카운터 (페이지에 여러 자산 공존 대비) */
  var uid = 0;
  function nextId(prefix) { uid += 1; return prefix + '-' + uid; }

  /* 시각적으로 숨겨진 aria-live 영역 확보(상태 변화 안내용) */
  function ensureLive(root) {
    var live = root.querySelector('[data-gh-live]');
    if (!live) {
      live = document.createElement('span');
      live.className = 'ghui-live';
      live.setAttribute('data-gh-live', '');
      live.setAttribute('aria-live', 'polite');
      live.setAttribute('role', 'status');
      root.appendChild(live);
    }
    return live;
  }
  function announce(live, msg) {
    if (!live) return;
    /* 동일 문자열 재알림도 읽히도록 한 번 비웠다가 채운다 */
    live.textContent = '';
    window.setTimeout(function () { live.textContent = msg; }, REDUCED ? 0 : 30);
  }

  /* =================================================================
     1) gh-pins — 핀 ↔ 범례 양방향 하이라이트 (REQ-006/007/008)
     ================================================================= */
  function initPins(root) {
    var pins = Array.prototype.slice.call(root.querySelectorAll('.ghui-pin[data-ghui-pin]'));
    var items = Array.prototype.slice.call(root.querySelectorAll('.ghui-legend__item[data-ghui-legend]'));
    if (!pins.length && !items.length) return;

    var scope = nextId('ghui-lg');

    /* 범례 항목: id 부여(없으면 생성) + 키보드 조작 가능화 */
    items.forEach(function (item) {
      var n = item.getAttribute('data-ghui-legend');
      if (!item.id) item.id = scope + '-' + n;
      if (!item.hasAttribute('tabindex')) item.setAttribute('tabindex', '0');
      if (!item.hasAttribute('role')) item.setAttribute('role', 'button');
    });

    function itemFor(n) {
      for (var i = 0; i < items.length; i++) {
        if (items[i].getAttribute('data-ghui-legend') === n) return items[i];
      }
      return null;
    }
    function pinFor(n) {
      for (var i = 0; i < pins.length; i++) {
        if (pins[i].getAttribute('data-ghui-pin') === n) return pins[i];
      }
      return null;
    }

    /* 핀: 대응 범례 id 를 aria-describedby 로 결속 (HTML 에 있으면 존중) — REQ-007 */
    pins.forEach(function (pin) {
      var n = pin.getAttribute('data-ghui-pin');
      var item = itemFor(n);
      if (item && !pin.getAttribute('aria-describedby')) {
        pin.setAttribute('aria-describedby', item.id);
      }
    });

    function clearAll() {
      pins.forEach(function (p) { p.classList.remove('is-active'); });
      items.forEach(function (it) { it.classList.remove('is-active'); });
    }
    function activate(n) {
      clearAll();
      var pin = pinFor(n);
      var item = itemFor(n);
      if (pin) pin.classList.add('is-active');
      if (item) item.classList.add('is-active');
    }

    pins.forEach(function (pin) {
      var n = pin.getAttribute('data-ghui-pin');
      pin.addEventListener('click', function () { activate(n); });
      pin.addEventListener('focus', function () { activate(n); });
    });
    items.forEach(function (item) {
      var n = item.getAttribute('data-ghui-legend');
      item.addEventListener('click', function () { activate(n); });
      item.addEventListener('focus', function () { activate(n); });
      item.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' || e.key === ' ' || e.key === 'Spacebar') {
          e.preventDefault();
          activate(n);
        }
      });
    });
  }

  /* =================================================================
     2) gh-tabs — PR 탭 전환 (REQ-009/015)
     role=tablist + 좌우/Home/End 화살표 + roving tabindex
     ================================================================= */
  function initTabs(root) {
    var list = root.querySelector('[role="tablist"]');
    if (!list) return;
    var tabs = Array.prototype.slice.call(list.querySelectorAll('[role="tab"]'));
    if (!tabs.length) return;

    function panelOf(tab) {
      var id = tab.getAttribute('aria-controls');
      return id ? root.querySelector('#' + id) : null;
    }

    function select(idx, focus) {
      tabs.forEach(function (tab, i) {
        var on = i === idx;
        tab.setAttribute('aria-selected', on ? 'true' : 'false');
        tab.setAttribute('tabindex', on ? '0' : '-1');
        tab.classList.toggle('is-active', on);
        var panel = panelOf(tab);
        if (panel) {
          if (on) panel.removeAttribute('hidden');
          else panel.setAttribute('hidden', '');
        }
      });
      if (focus) tabs[idx].focus();
    }

    tabs.forEach(function (tab, i) {
      tab.addEventListener('click', function () { select(i, false); });
      tab.addEventListener('keydown', function (e) {
        var idx = i;
        if (e.key === 'ArrowRight' || e.key === 'ArrowDown') idx = (i + 1) % tabs.length;
        else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') idx = (i - 1 + tabs.length) % tabs.length;
        else if (e.key === 'Home') idx = 0;
        else if (e.key === 'End') idx = tabs.length - 1;
        else return;
        e.preventDefault();
        select(idx, true);
      });
    });

    /* 초기 선택 상태 정규화 */
    var initial = tabs.findIndex ? tabs.findIndex(function (t) { return t.getAttribute('aria-selected') === 'true'; }) : -1;
    if (initial < 0) {
      initial = 0;
      for (var k = 0; k < tabs.length; k++) {
        if (tabs[k].getAttribute('aria-selected') === 'true') { initial = k; break; }
      }
    }
    select(initial < 0 ? 0 : initial, false);
  }

  /* =================================================================
     3) gh-diff — 라인 코멘트 + 배치 리뷰 (REQ-010, 가장 복잡)
     ================================================================= */
  function initDiff(root) {
    var live = ensureLive(root);
    var reviewBtn = root.querySelector('[data-gh-review]');
    var reviewCount = root.querySelector('[data-gh-review-count]');
    var rows = Array.prototype.slice.call(root.querySelectorAll('.ghui-diff__row[data-gh-line]'));

    /* 리뷰 배치 상태: active(리뷰 시작 여부), pending(대기 코멘트 노드 목록) */
    var state = { active: false, pending: [] };
    var panel = null;

    /* split / unified 모드 토글 (표현 전환) */
    var modeBtns = Array.prototype.slice.call(root.querySelectorAll('[data-gh-mode]'));
    modeBtns.forEach(function (mb) {
      mb.addEventListener('click', function () {
        modeBtns.forEach(function (b) { b.classList.remove('is-active'); });
        mb.classList.add('is-active');
        var mode = mb.getAttribute('data-gh-mode');
        root.setAttribute('data-gh-diff-mode', mode);
        announce(live, mode === 'split' ? '분할 보기로 전환했어요.' : '통합 보기로 전환했어요.');
      });
    });

    function updateReviewBtn() {
      var n = state.pending.length;
      if (reviewCount) {
        if (n > 0) {
          reviewCount.textContent = String(n);
          reviewCount.removeAttribute('hidden');
        } else {
          reviewCount.setAttribute('hidden', '');
        }
      }
      if (reviewBtn) {
        reviewBtn.setAttribute('aria-label', n > 0
          ? '리뷰 변경 사항 검토 — 대기 코멘트 ' + n + '개'
          : '리뷰 변경 사항 검토');
      }
    }

    /* 코멘트 표시 노드 생성 (pending 또는 즉시 제출) */
    function makeCommentNode(text, kind) {
      var box = document.createElement('div');
      box.className = 'ghui-diff__comment';
      var body = document.createElement('div');
      body.className = 'ghui-diff__comment-text';
      body.textContent = text || '(내용 없음)';
      var note = document.createElement('div');
      note.className = 'ghui-diff__comment-note';
      box.appendChild(makeBadge(kind));
      box.appendChild(body);
      box.appendChild(note);
      setKind(box, note, kind);
      return box;
    }
    function makeBadge(kind) {
      var b = document.createElement('span');
      b.className = 'ghui-badge';
      box_badge_class(b, kind);
      return b;
    }
    function box_badge_class(b, kind) {
      b.className = 'ghui-badge ' + (kind === 'pending' ? 'ghui-badge--pending' : 'ghui-badge--merged');
      b.textContent = kind === 'pending' ? 'Pending' : '제출됨';
    }
    function setKind(box, note, kind) {
      if (kind === 'pending') {
        note.textContent = '대기 중 — 지금은 본인에게만 보여요. Submit review 를 눌러야 함께 제출돼요.';
      } else {
        note.textContent = '제출됨 — 이제 모두에게 보여요.';
      }
    }

    /* 라인 코멘트 폼 열기 */
    function openForm(row) {
      /* 이미 폼/코멘트가 열려 있으면 그쪽 textarea 로 포커스 */
      var next = row.nextElementSibling;
      if (next && next.classList.contains('ghui-diff__comment-row')) {
        var ta0 = next.querySelector('textarea');
        if (ta0) ta0.focus();
        return;
      }

      var cr = document.createElement('div');
      cr.className = 'ghui-diff__comment-row';
      var form = document.createElement('form');
      form.className = 'ghui-diff__comment-form';
      form.addEventListener('submit', function (e) { e.preventDefault(); });

      var ta = document.createElement('textarea');
      ta.setAttribute('aria-label', '라인 코멘트 입력');
      ta.placeholder = '이 줄에 대한 코멘트를 남겨보세요';

      var actions = document.createElement('div');
      actions.className = 'ghui-diff__comment-actions';

      var single = document.createElement('button');
      single.type = 'button';
      single.className = 'ghui-btn';
      single.textContent = 'Add single comment';

      var primary = document.createElement('button');
      primary.type = 'button';
      primary.className = 'ghui-btn ghui-btn--primary';
      primary.textContent = state.active ? 'Add review comment' : 'Start a review';

      var cancel = document.createElement('button');
      cancel.type = 'button';
      cancel.className = 'ghui-btn';
      cancel.textContent = 'Cancel';

      cancel.addEventListener('click', function () { cr.remove(); });

      /* Add single comment: 배치를 거치지 않고 즉시 제출 상태 */
      single.addEventListener('click', function () {
        var node = makeCommentNode(ta.value, 'submitted');
        cr.replaceChildren(node);
        announce(live, '코멘트를 단건으로 제출했어요.');
      });

      /* Start a review / Add review comment: pending 으로 담고 배치 카운터 증가 */
      primary.addEventListener('click', function () {
        var wasActive = state.active;
        state.active = true;
        var node = makeCommentNode(ta.value, 'pending');
        cr.replaceChildren(node);
        state.pending.push(node);
        updateReviewBtn();
        announce(live, wasActive
          ? '코멘트를 리뷰 배치에 추가했어요. 대기 ' + state.pending.length + '개.'
          : '리뷰를 시작했어요. 코멘트가 대기 상태로 담겼어요.');
      });

      actions.appendChild(single);
      actions.appendChild(primary);
      actions.appendChild(cancel);
      form.appendChild(ta);
      form.appendChild(actions);
      cr.appendChild(form);
      row.parentNode.insertBefore(cr, row.nextElementSibling);
      ta.focus();
    }

    /* 각 diff 라인에 + 버튼 주입 (hover/focus 로 노출은 CSS 가 담당) */
    rows.forEach(function (row) {
      var btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'ghui-diff__addbtn';
      btn.setAttribute('aria-label', '이 줄에 코멘트 추가');
      btn.textContent = '+';
      btn.addEventListener('click', function () { openForm(row); });
      row.appendChild(btn);
    });

    /* 리뷰 제출 패널 토글 */
    function togglePanel() {
      if (panel) { panel.remove(); panel = null; return; }
      panel = buildReviewPanel();
      /* 툴바 바로 아래에 삽입, 없으면 root 끝에 */
      var toolbar = root.querySelector('.ghui-diff__toolbar');
      if (toolbar && toolbar.nextSibling) root.insertBefore(panel, toolbar.nextSibling);
      else root.appendChild(panel);
      var firstInput = panel.querySelector('textarea, input, button');
      if (firstInput) firstInput.focus();
    }

    function buildReviewPanel() {
      var wrap = document.createElement('div');
      wrap.className = 'ghui-diff__review-panel';

      var summary = document.createElement('textarea');
      summary.setAttribute('aria-label', '리뷰 요약');
      summary.placeholder = '리뷰 요약을 남겨보세요 (선택)';

      var opts = document.createElement('div');
      opts.className = 'ghui-diff__review-opts';
      var groupName = nextId('ghui-review');
      var choices = [
        { v: 'comment', t: 'Comment', d: '일반 의견을 남겨요. 승인/변경요청 없음.' },
        { v: 'approve', t: 'Approve', d: '변경 사항을 승인해요.' },
        { v: 'request', t: 'Request changes', d: '병합 전 수정이 필요하다고 표시해요.' }
      ];
      var radios = [];
      choices.forEach(function (c, i) {
        var lab = document.createElement('label');
        lab.className = 'ghui-diff__review-opt';
        var input = document.createElement('input');
        input.type = 'radio';
        input.name = groupName;
        input.value = c.v;
        if (i === 0) input.checked = true;
        radios.push(input);
        var span = document.createElement('span');
        var strong = document.createElement('strong');
        strong.textContent = c.t;
        var small = document.createElement('small');
        small.textContent = c.d;
        span.appendChild(strong);
        span.appendChild(small);
        lab.appendChild(input);
        lab.appendChild(span);
        opts.appendChild(lab);
      });

      var submit = document.createElement('button');
      submit.type = 'button';
      submit.className = 'ghui-btn ghui-btn--primary';
      submit.textContent = 'Submit review';
      submit.addEventListener('click', function () {
        var chosen = 'comment';
        radios.forEach(function (r) { if (r.checked) chosen = r.value; });
        submitReview(chosen);
      });

      wrap.appendChild(summary);
      wrap.appendChild(opts);
      wrap.appendChild(submit);
      return wrap;
    }

    var TYPE_LABEL = { comment: '코멘트', approve: '승인', request: '변경 요청' };

    function submitReview(kind) {
      /* 모든 pending 코멘트를 제출됨 상태로 전환 */
      state.pending.forEach(function (node) {
        var badge = node.querySelector('.ghui-badge');
        var note = node.querySelector('.ghui-diff__comment-note');
        if (badge) box_badge_class(badge, 'submitted');
        if (note) note.textContent = '제출됨 — 리뷰 결과: ' + (TYPE_LABEL[kind] || kind) + '. 이제 모두에게 보여요.';
      });
      var count = state.pending.length;
      state.pending = [];
      state.active = false;
      updateReviewBtn();
      if (panel) { panel.remove(); panel = null; }
      announce(live, '리뷰를 제출했어요 — ' + (TYPE_LABEL[kind] || kind) + '. 대기 코멘트 ' + count + '개가 함께 제출됐어요.');
    }

    if (reviewBtn) reviewBtn.addEventListener('click', togglePanel);
    updateReviewBtn();
  }

  /* =================================================================
     4) gh-board — 카드 다음 열 이동 + Status 동기 (REQ-011)
     ================================================================= */
  function initBoard(root) {
    var live = ensureLive(root);
    var cols = Array.prototype.slice.call(root.querySelectorAll('.ghui-board__col[data-gh-col]'));
    if (!cols.length) return;

    function colName(col) { return col.getAttribute('data-gh-col'); }
    function cardsBox(col) { return col.querySelector('.ghui-board__cards'); }
    function updateCounts() {
      cols.forEach(function (col) {
        var cnt = col.querySelector('[data-gh-count]');
        var box = cardsBox(col);
        if (cnt && box) cnt.textContent = String(box.querySelectorAll('.ghui-board__card').length);
      });
    }

    function moveCard(card) {
      var col = card.closest('.ghui-board__col');
      var idx = cols.indexOf(col);
      if (idx < 0 || idx >= cols.length - 1) {
        announce(live, '이미 마지막 열이에요. 더 이동할 수 없어요.');
        return;
      }
      var target = cols[idx + 1];
      var box = cardsBox(target);
      if (!box) return;

      if (!REDUCED) {
        card.classList.add('is-moving');
        window.setTimeout(function () { card.classList.remove('is-moving'); }, 180);
      }
      box.appendChild(card);

      /* Status 필드 동기 변경 */
      var status = card.querySelector('[data-gh-status]');
      if (status) status.textContent = colName(target);
      updateCounts();
      card.focus();
      var title = card.getAttribute('data-gh-card-title') || '카드';
      announce(live, title + '를 ' + colName(target) + ' 열로 옮겼어요.');
    }

    cols.forEach(function (col) {
      var cards = Array.prototype.slice.call(col.querySelectorAll('.ghui-board__card'));
      cards.forEach(function (card) {
        if (!card.hasAttribute('tabindex')) card.setAttribute('tabindex', '0');
        if (!card.hasAttribute('role')) card.setAttribute('role', 'button');
      });
    });

    /* 이벤트 위임 — 카드가 열 간 이동해도 root 리스너 하나로 처리 */
    root.addEventListener('click', function (e) {
      var card = e.target.closest && e.target.closest('.ghui-board__card');
      if (card && root.contains(card)) moveCard(card);
    });
    root.addEventListener('keydown', function (e) {
      if (e.key !== 'Enter' && e.key !== ' ' && e.key !== 'Spacebar') return;
      var card = e.target.closest && e.target.closest('.ghui-board__card');
      if (card && root.contains(card)) { e.preventDefault(); moveCard(card); }
    });

    updateCounts();
  }

  /* =================================================================
     5) gh-mergebox — 체크 통과/실패 토글 → merge 버튼 활성/비활성 (REQ-012)
     ================================================================= */
  function initMergebox(root) {
    var live = ensureLive(root);
    var checks = Array.prototype.slice.call(root.querySelectorAll('.ghui-mergebox__check[data-gh-check]'));
    var merge = root.querySelector('[data-gh-merge]');
    var reason = root.querySelector('[data-gh-reason]');
    var statusText = root.querySelector('[data-gh-merge-status]');

    function refresh() {
      var failing = checks.filter(function (c) { return c.classList.contains('is-fail'); });
      var waiting = checks.filter(function (c) { return c.classList.contains('is-wait'); });
      var blocked = failing.length > 0 || waiting.length > 0;

      root.classList.toggle('is-ready', !blocked);
      root.classList.toggle('is-blocked', blocked);

      if (merge) {
        if (blocked) merge.setAttribute('disabled', '');
        else merge.removeAttribute('disabled');
      }
      if (reason) {
        if (failing.length > 0) {
          reason.textContent = '실패한 검사 ' + failing.length + '개가 있어 병합할 수 없어요.';
          reason.removeAttribute('hidden');
        } else if (waiting.length > 0) {
          reason.textContent = '대기 중인 검사 ' + waiting.length + '개가 있어 아직 병합할 수 없어요.';
          reason.removeAttribute('hidden');
        } else {
          reason.setAttribute('hidden', '');
        }
      }
      if (statusText) {
        statusText.textContent = blocked ? '병합할 수 없음' : '병합할 수 있음';
      }

      /* 검사별 상태 낱말 갱신. 마크업이 [data-gh-check-state] 스팬을 제공하면
         "통과/실패/대기" 글자가 실제 상태를 따라간다. 이 훅이 없으면 라벨에
         적어둔 상태 글자가 토글 후에도 그대로 남아 화면과 어긋난다. */
      checks.forEach(function (c) {
        var state = c.querySelector('[data-gh-check-state]');
        if (!state) return;
        if (c.classList.contains('is-fail')) state.textContent = '실패';
        else if (c.classList.contains('is-wait')) state.textContent = '대기';
        else state.textContent = '통과';
      });
    }

    checks.forEach(function (check) {
      var toggle = check.querySelector('.ghui-mergebox__toggle');
      if (!toggle) return;
      function flip() {
        /* 통과 ↔ 실패 토글 (대기 상태는 첫 클릭에 실패로 확정) */
        if (check.classList.contains('is-pass')) {
          check.classList.remove('is-pass');
          check.classList.add('is-fail');
          toggle.setAttribute('aria-pressed', 'false');
        } else {
          check.classList.remove('is-fail');
          check.classList.remove('is-wait');
          check.classList.add('is-pass');
          toggle.setAttribute('aria-pressed', 'true');
        }
        /* 상태 낱말이 섞인 라벨 전체 대신 [data-gh-check-name]의 순수 검사명을 읽는다. */
        var named = check.querySelector('[data-gh-check-name]');
        var label = named || check.querySelector('.ghui-mergebox__check-label');
        var name = label ? label.textContent.trim() : '검사';
        announce(live, name + ' 검사를 ' + (check.classList.contains('is-pass') ? '통과' : '실패') + '로 바꿨어요.');
        refresh();
      }
      toggle.addEventListener('click', flip);
    });

    refresh();
  }

  /* =================================================================
     진입 — data-asset 훅별 초기화 (pr-flow.js 와 동일한 readyState 분기)
     ================================================================= */
  function start() {
    document.querySelectorAll('[data-asset="gh-pins"]').forEach(initPins);
    document.querySelectorAll('[data-asset="gh-tabs"]').forEach(initTabs);
    document.querySelectorAll('[data-asset="gh-diff"]').forEach(initDiff);
    document.querySelectorAll('[data-asset="gh-board"]').forEach(initBoard);
    document.querySelectorAll('[data-asset="gh-mergebox"]').forEach(initMergebox);
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start);
  else start();
})();

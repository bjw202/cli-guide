/* =================================================================
 * SPEC-TMUX-GUIDE-001 — 메인 인터랙션
 * 순수 바닐라 JS. 빌드/프레임워크/라이브러리 없음.
 * 담당: 진행률 바, 활성 섹션 하이라이트, 스크롤 리빌, 계층 다이어그램,
 *        FakeTerminal 데모 3종(core/copy/detach-fear), 아코디언,
 *        Before/After 탭, 플로팅 치트시트
 * 모든 주석은 한국어 (프로젝트 code_comments 설정).
 * ================================================================= */
(function () {
  'use strict';

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------------------------------------------------
   * 1. 유틸
   * ------------------------------------------------- */
  const $ = (sel, ctx = document) => ctx.querySelector(sel);
  const $$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));
  const wait = (ms) => new Promise((r) => setTimeout(r, ms));

  /* ---------------------------------------------------
   * 2. 읽기 진행률 바
   * ------------------------------------------------- */
  function initProgressBar() {
    const bar = $('.progress-bar');
    if (!bar) return;

    let ticking = false;
    function update() {
      const docH = document.documentElement;
      const scrollable = docH.scrollHeight - docH.clientHeight;
      const pct = scrollable > 0 ? (docH.scrollTop / scrollable) * 100 : 0;
      bar.style.width = pct.toFixed(2) + '%';
      bar.setAttribute('aria-valuenow', Math.round(pct));
      ticking = false;
    }
    function onScroll() {
      if (!ticking) {
        window.requestAnimationFrame(update);
        ticking = true;
      }
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });
    update();
  }

  /* ---------------------------------------------------
   * 3. 내비게이션 활성 섹션 하이라이트
   * ------------------------------------------------- */
  function initActiveNav() {
    const links = $$('.nav__link');
    if (!links.length) return;

    const sectionMap = new Map();
    links.forEach((link) => {
      const id = link.getAttribute('href').slice(1);
      const sec = document.getElementById(id);
      if (sec) sectionMap.set(sec, link);
    });

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            links.forEach((l) => l.classList.remove('is-active'));
            const link = sectionMap.get(entry.target);
            if (link) link.classList.add('is-active');
          }
        });
      },
      { rootMargin: '-40% 0px -55% 0px', threshold: 0 }
    );
    sectionMap.forEach((_, sec) => observer.observe(sec));
  }

  /* ---------------------------------------------------
   * 4. ScrollReveal — IntersectionObserver
   * ------------------------------------------------- */
  function initReveal() {
    const els = $$('.reveal');
    if (!els.length) return;

    if (prefersReducedMotion || !('IntersectionObserver' in window)) {
      els.forEach((el) => el.classList.add('is-visible'));
      return;
    }

    const io = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            obs.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -8% 0px' }
    );
    els.forEach((el) => io.observe(el));
  }

  /* ---------------------------------------------------
   * 5. 계층 다이어그램 — 스크롤/클릭 시 한 층씩 펼침
   * ------------------------------------------------- */
  function initHierarchyDiagram() {
    const diagram = $('#hierarchy-diagram');
    if (!diagram) return;

    const layers = $$('.hierarchy__layer', diagram);
    if (prefersReducedMotion) {
      layers.forEach((l) => l.classList.add('is-visible'));
      return;
    }

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            // 순차적 리빌
            layers.forEach((layer, idx) => {
              setTimeout(() => layer.classList.add('is-visible'), idx * 220);
            });
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.25 }
    );
    io.observe(diagram);

    // 클릭하면 전체 토글 (재생)
    diagram.addEventListener('click', () => {
      layers.forEach((l) => l.classList.remove('is-visible'));
      // 리플로우 후 다시
      void diagram.offsetWidth;
      layers.forEach((layer, idx) => {
        setTimeout(() => layer.classList.add('is-visible'), idx * 200);
      });
    });
  }

  /* ---------------------------------------------------
   * 6. FakeTerminal — CORE 데모 (분할/이동/detach/attach)
   *    상태 머신: empty → started → (split-v/h, move) → detached → attached
   * ------------------------------------------------- */
  function initCoreDemo() {
    const term = $('#demo-core');
    if (!term) return;

    const status = $('#demo-core-status', term);
    const panesEl = $('#demo-core-panes', term);
    const buttons = $$('.term__btn', term);
    const btnByAction = {};
    buttons.forEach((b) => (btnByAction[b.dataset.action] = b));

    // 초기엔 "세션 시작" 만 활성화
    function setEnabled(actions) {
      buttons.forEach((b) => (b.disabled = !actions.includes(b.dataset.action)));
    }

    // 임시 강조 (버튼 눌림 시각)
    async function flashKey(action, label) {
      const btn = btnByAction[action];
      if (!btn) return;
      btn.classList.add('is-pressed');
      btn.setAttribute('aria-label', `${label} 실행됨`);
      await wait(420);
      btn.classList.remove('is-pressed');
    }

    function renderPanes(state) {
      // state.panes: [{active:bool, content:[lines]}]
      // state.layout: 'single' | 'h-split' | 'v-split'
      panesEl.innerHTML = '';
      panesEl.className = 'term__panes';

      if (state.layout === 'v-split') panesEl.classList.add('pane-row');
      if (state.layout === 'h-split') panesEl.classList.add('pane-col');

      state.panes.forEach((p, i) => {
        const div = document.createElement('div');
        div.className = 'term__pane' + (p.active ? ' is-active' : '');
        div.dataset.pane = i;
        div.innerHTML = p.content.map((line) => `<div class="term__line">${line}</div>`).join('');
        panesEl.appendChild(div);
      });
    }

    const initialPaneContent = [
      '<span class="term__prompt">$</span> <span class="term__cmd">vim app.js</span>',
      '<span class="term__out">// 작업 중…</span>',
    ];

    function emptyState() {
      return {
        layout: 'single',
        panes: [
          {
            active: true,
            content: [
              '<span class="term__out">— 세션이 종료됨 —</span>',
              '<span class="term__out">아래 "세션 시작" 버튼으로 다시 시작하세요.</span>',
            ],
          },
        ],
      };
    }

    function startedState() {
      return {
        layout: 'single',
        panes: [
          {
            active: true,
            content: [
              '<span class="term__prompt">$</span> <span class="term__cmd">vim app.js</span>',
              '<span class="term__out">// 코드 편집 중…</span>',
              '<span class="term__out">// 분할하려면 "분할(좌우)" 또는 "분할(상하)" 클릭</span>',
            ],
          },
        ],
      };
    }

    function vSplitState(activeLeft) {
      return {
        layout: 'v-split',
        panes: [
          {
            active: activeLeft,
            content: [
              '<span class="term__prompt">$</span> <span class="term__cmd">vim app.js</span>',
              '<span class="term__out">// 좌측 pane</span>',
            ],
          },
          {
            active: !activeLeft,
            content: [
              '<span class="term__prompt">$</span> <span class="term__cmd">npm run dev</span>',
              '<span class="term__hi">▶ 우측 pane — 서버 실행</span>',
            ],
          },
        ],
      };
    }

    function hSplitState(activeTop) {
      return {
        layout: 'h-split',
        panes: [
          {
            active: activeTop,
            content: [
              '<span class="term__prompt">$</span> <span class="term__cmd">vim app.js</span>',
              '<span class="term__out">// 상단 pane</span>',
            ],
          },
          {
            active: !activeTop,
            content: [
              '<span class="term__hi">▶ 하단 pane — tail -f log</span>',
              '<span class="term__out">[14:32] request ok</span>',
              '<span class="term__out">[14:33] request ok</span>',
            ],
          },
        ],
      };
    }

    // 현재 상태 추적 (move 토글용)
    let currentState = 'started';
    let activeSide = 0; // 분할 상태에서 몇 번 pane이 active인지

    function syncUI() {
      if (currentState === 'started') {
        renderPanes(startedState());
        setEnabled(['split-v', 'split-h', 'detach']);
      } else if (currentState === 'v-split') {
        const s = vSplitState(activeSide === 0);
        renderPanes(s);
        setEnabled(['split-h', 'move', 'detach']);
      } else if (currentState === 'h-split') {
        const s = hSplitState(activeSide === 0);
        renderPanes(s);
        setEnabled(['split-v', 'move', 'detach']);
      } else if (currentState === 'detached') {
        term.classList.add('is-detached');
        status.classList.remove('is-on');
        setEnabled(['attach']);
      } else if (currentState === 'attached') {
        term.classList.remove('is-detached');
        status.classList.add('is-on');
        currentState = 'started';
        activeSide = 0;
        renderPanes(startedState());
        setEnabled(['split-v', 'split-h', 'detach']);
      }
    }

    // 초기
    setEnabled(['start']);

    term.addEventListener('click', async (e) => {
      const btn = e.target.closest('.term__btn');
      if (!btn || btn.disabled) return;
      const action = btn.dataset.action;

      switch (action) {
        case 'start':
          await flashKey('start', 'tmux');
          status.classList.add('is-on');
          currentState = 'started';
          renderPanes(startedState());
          setEnabled(['split-v', 'split-h', 'detach']);
          break;
        case 'split-v':
          await flashKey('split-v', 'C-b %');
          currentState = 'v-split';
          activeSide = 0;
          syncUI();
          break;
        case 'split-h':
          await flashKey('split-h', 'C-b "');
          currentState = 'h-split';
          activeSide = 0;
          syncUI();
          break;
        case 'move':
          await flashKey('move', 'C-b 방향키');
          activeSide = activeSide === 0 ? 1 : 0;
          syncUI();
          break;
        case 'detach':
          await flashKey('detach', 'C-b d');
          currentState = 'detached';
          syncUI();
          break;
        case 'attach':
          await flashKey('attach', 'tmux a');
          currentState = 'attached';
          syncUI();
          break;
      }
    });
  }

  /* ---------------------------------------------------
   * 7. FakeTerminal — COPY MODE 데모
   *    enter → select → paste → reset
   * ------------------------------------------------- */
  function initCopyDemo() {
    const term = $('#demo-copy');
    if (!term) return;

    const badge = $('#demo-copy-badge', term);
    const target = $('#demo-copy-target', term);
    const target2 = $('#demo-copy-target2', term);
    const afterCmd = $('#demo-copy-after', term);
    const hint = $('#demo-copy-hint', term);
    const buttons = $$('.term__btn', term);
    const btnByAction = {};
    buttons.forEach((b) => (btnByAction[b.dataset.action] = b));

    function setEnabled(actions) {
      buttons.forEach((b) => (b.disabled = !actions.includes(b.dataset.action)));
    }

    async function flash(action) {
      const b = btnByAction[action];
      if (!b) return;
      b.classList.add('is-pressed');
      await wait(420);
      b.classList.remove('is-pressed');
    }

    setEnabled(['enter']);

    term.addEventListener('click', async (e) => {
      const btn = e.target.closest('.term__btn');
      if (!btn || btn.disabled) return;
      const action = btn.dataset.action;

      if (action === 'enter') {
        await flash('enter');
        badge.classList.add('is-on');
        // 첫 번째 타겟 강조
        target.classList.add('term__selection');
        hint.textContent = '돋보기 모드 진입. 화살표로 이동 후 선택해요.';
        setEnabled(['select']);
      } else if (action === 'select') {
        await flash('select');
        target2.classList.add('term__selection');
        hint.textContent = '선택 완료 — C-w 로 복사하고 복사 모드 종료. 버퍼에 저장됐어요.';
        setEnabled(['paste']);
      } else if (action === 'paste') {
        await flash('paste');
        badge.classList.remove('is-on');
        target.classList.remove('term__selection');
        target2.classList.remove('term__selection');
        afterCmd.textContent = 'echo "src/index.ts · 12 modules"  ← 방금 복사한 내용';
        hint.textContent = '붙여넣기 완료! tmux 버퍼에서 다시 꺼냈어요.';
        setEnabled(['reset']);
      } else if (action === 'reset') {
        afterCmd.textContent = '';
        hint.textContent = '"복사 모드는 잠시 화면을 정지시키고 돋보기로 살펴보는 시간이에요."';
        setEnabled(['enter']);
      }
    });
  }

  /* ---------------------------------------------------
   * 8. FakeTerminal — DETACH 공포 안심 인터랙션
   * ------------------------------------------------- */
  function initDetachFearDemo() {
    const term = $('#demo-fear');
    if (!term) return;

    const body = $('#demo-fear-body', term);
    const reassure = $('#reassure');
    const buttons = $$('.term__btn', term);
    const btnByAction = {};
    buttons.forEach((b) => (btnByAction[b.dataset.action] = b));

    function setEnabled(actions) {
      buttons.forEach((b) => (b.disabled = !actions.includes(b.dataset.action)));
    }
    async function flash(action) {
      const b = btnByAction[action];
      if (!b) return;
      b.classList.add('is-pressed');
      await wait(420);
      b.classList.remove('is-pressed');
    }

    setEnabled(['detach']);

    term.addEventListener('click', async (e) => {
      const btn = e.target.closest('.term__btn');
      if (!btn || btn.disabled) return;
      const action = btn.dataset.action;

      if (action === 'detach') {
        await flash('detach');
        term.classList.add('is-detached');
        setEnabled(['attach']);
      } else if (action === 'attach') {
        await flash('attach');
        term.classList.remove('is-detached');
        if (reassure) reassure.hidden = false;
        setEnabled(['detach']);
      }
    });
  }

  /* ---------------------------------------------------
   * 9. 아코디언 (FAQ + Deep Dive)
   * ------------------------------------------------- */
  function initAccordions() {
    $$('.accordion').forEach((acc) => {
      acc.addEventListener('click', (e) => {
        const trigger = e.target.closest('.acc-trigger');
        if (!trigger) return;
        const item = trigger.parentElement;
        const content = item.querySelector('.acc-content');
        const isOpen = item.classList.contains('is-open');

        // 단일 오픈 정책 (같은 accordion 안에서)
        $$('.acc-item', acc).forEach((other) => {
          if (other !== item) {
            other.classList.remove('is-open');
            const ot = other.querySelector('.acc-trigger');
            const oc = other.querySelector('.acc-content');
            ot.setAttribute('aria-expanded', 'false');
            oc.style.maxHeight = null;
          }
        });

        if (isOpen) {
          item.classList.remove('is-open');
          trigger.setAttribute('aria-expanded', 'false');
          content.style.maxHeight = null;
        } else {
          item.classList.add('is-open');
          trigger.setAttribute('aria-expanded', 'true');
          content.style.maxHeight = content.scrollHeight + 'px';
        }
      });

      // 키보드 — 이미 버튼이라 Enter/Space 동작. 화살표 탐색 보조
      acc.addEventListener('keydown', (e) => {
        const triggers = $$('.acc-trigger', acc);
        const idx = triggers.indexOf(document.activeElement);
        if (idx === -1) return;
        let target = null;
        if (e.key === 'ArrowDown') target = triggers[(idx + 1) % triggers.length];
        if (e.key === 'ArrowUp') target = triggers[(idx - 1 + triggers.length) % triggers.length];
        if (e.key === 'Home') target = triggers[0];
        if (e.key === 'End') target = triggers[triggers.length - 1];
        if (target) {
          e.preventDefault();
          target.focus();
        }
      });
    });

    // detach 공포 FAQ 자동 오픈은 의도적 비활성화 (사용자가 클릭하도록)
  }

  /* ---------------------------------------------------
   * 10. Before/After (CONFIG status line)
   * ------------------------------------------------- */
  function initBeforeAfter() {
    const ba = $('#config-ba');
    if (!ba) return;

    const tabs = $$('.ba__tab', ba);
    const panels = $$('.ba__panel', ba);

    tabs.forEach((tab) => {
      tab.addEventListener('click', () => {
        const which = tab.dataset.ba;
        tabs.forEach((t) => {
          const active = t === tab;
          t.classList.toggle('is-active', active);
          t.setAttribute('aria-selected', active ? 'true' : 'false');
        });
        panels.forEach((p) => {
          p.classList.toggle('is-active', p.dataset.panel === which);
        });
      });
    });
  }

  /* ---------------------------------------------------
   * 11. 플로팅 치트시트 (FAB)
   * ------------------------------------------------- */
  function initCheatSheetFab() {
    const fab = $('#cheat-fab');
    const sheet = $('#cheat-sheet');
    const closeBtn = $('#cheat-close');
    if (!fab || !sheet) return;

    function toggle(force) {
      const open = force !== undefined ? force : !sheet.classList.contains('is-open');
      sheet.classList.toggle('is-open', open);
      fab.classList.toggle('is-open', open);
      fab.setAttribute('aria-expanded', open ? 'true' : 'false');
      fab.setAttribute('aria-label', open ? '단축키 카드 닫기' : '단축키 카드 열기');
      // 접근성: 닫혀 있을 때 스크린 리더가 숨겨진 내용을 읽지 않도록
      sheet.setAttribute('aria-hidden', open ? 'false' : 'true');
      if ('inert' in HTMLElement.prototype) {
        sheet.inert = !open;
      }
    }

    fab.addEventListener('click', () => toggle());
    if (closeBtn) closeBtn.addEventListener('click', () => toggle(false));
    // 바깥 클릭 시 닫기
    document.addEventListener('click', (e) => {
      if (!sheet.classList.contains('is-open')) return;
      if (sheet.contains(e.target) || fab.contains(e.target)) return;
      toggle(false);
    });
    // ESC 닫기
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && sheet.classList.contains('is-open')) toggle(false);
    });
  }

  /* ---------------------------------------------------
   * 12. 부드러운 스크롤 (네비 클릭)
   * ------------------------------------------------- */
  function initSmoothScroll() {
    $$('a[href^="#"]').forEach((a) => {
      a.addEventListener('click', (e) => {
        const id = a.getAttribute('href').slice(1);
        if (!id) return;
        const target = document.getElementById(id);
        if (!target) return;
        e.preventDefault();
        const reduce = prefersReducedMotion;
        target.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' });
        // 포커스 이동 (접근성)
        target.setAttribute('tabindex', '-1');
        target.focus({ preventScroll: true });
      });
    });
  }

  /* ---------------------------------------------------
   * 초기화
   * ------------------------------------------------- */
  function init() {
    initProgressBar();
    initActiveNav();
    initReveal();
    initHierarchyDiagram();
    initCoreDemo();
    initCopyDemo();
    initDetachFearDemo();
    initAccordions();
    initBeforeAfter();
    initCheatSheetFab();
    initSmoothScroll();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();

/* =================================================================
   SPEC-GIT-GITHUB-IMPL-001 — 읽기 진행률
   담당: 현재 페이지 진행률 바 (REQ-004),
        트랙 전체 진행률 + localStorage 복원 (REQ-005).
   순수 바닐라 JS.
   ================================================================= */
(function () {
  'use strict';

  /* ---------------------------------------------------
   * 1. 현재 페이지 진행률 바 (REQ-004)
   *    tmux main.js initProgressBar 추출.
   * ------------------------------------------------- */
  function initProgressBar() {
    const bar = document.querySelector('.reading-bar');
    if (!bar) return;

    let ticking = false;

    function update() {
      const docH = document.documentElement;
      const scrollable = docH.scrollHeight - docH.clientHeight;
      const pct = scrollable > 0 ? (docH.scrollTop / scrollable) * 100 : 0;
      bar.style.width = pct.toFixed(2) + '%';
      bar.setAttribute('aria-valuenow', String(Math.round(pct)));
      ticking = false;

      // 튜토리얼 페이지에서만 트랙 진행률 갱신
      maybeUpdateTrackProgress(pct);
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
   * 2. 트랙 전체 진행률 (REQ-005)
   *    localStorage 키: gg-progress
   *    튜토리얼 페이지(/tutorial/)에서만 동작.
   *    페이지 하단 도달(scrollPct >= 95) 시 해당 페이지 ID(pathname 기반)
   *    를 완료 집합에 추가. "완료 수/21" + 백분율 표시.
   * ------------------------------------------------- */
  var TRACK_KEY = 'gg-progress';
  var TRACK_TOTAL = 21;           // 전체 튜토리얼 페이지 수
  var COMPLETE_THRESHOLD = 95;    // 95% 이상 읽으면 완료 처리

  function isTutorialPage() {
    return /\/tutorial\//i.test(location.pathname) ||
           /(^|\/)tutorial\//i.test(location.pathname.replace(/\\/g, '/'));
  }

  function pageId() {
    // 사이트 루트 이하 경로를 ID로 사용 (쿼리/해시 제외)
    return location.pathname.replace(/\\/g, '/').split('#')[0].split('?')[0];
  }

  function readProgress() {
    try {
      var raw = localStorage.getItem(TRACK_KEY);
      if (!raw) return { pages: [] };
      var parsed = JSON.parse(raw);
      if (!parsed || !Array.isArray(parsed.pages)) return { pages: [] };
      return parsed;
    } catch (e) {
      return { pages: [] };
    }
  }

  function writeProgress(data) {
    try {
      localStorage.setItem(TRACK_KEY, JSON.stringify(data));
    } catch (e) {
      // 저장소 접근 불가(예: file:// 제한, 쿼터 초과) — 조용히 무시
    }
  }

  function markComplete(id) {
    var data = readProgress();
    if (data.pages.indexOf(id) === -1) {
      data.pages.push(id);
      writeProgress(data);
    }
  }

  function completedCount() {
    return readProgress().pages.length;
  }

  function maybeUpdateTrackProgress(scrollPct) {
    // 튜토리얼 페이지가 아니면 무시
    if (!isTutorialPage()) return;

    // 95% 이상 읽으면 완료로 표시
    if (scrollPct >= COMPLETE_THRESHOLD) {
      markComplete(pageId());
    }

    renderTrackProgress();
  }

  function renderTrackProgress() {
    var countEl = document.querySelector('.track-progress__count');
    var fillEl = document.querySelector('.track-progress__fill');
    if (!countEl && !fillEl) return;

    var done = completedCount();
    var pct = Math.min(100, Math.round((done / TRACK_TOTAL) * 100));

    if (countEl) countEl.textContent = done + '/' + TRACK_TOTAL + ' · ' + pct + '%';
    if (fillEl) fillEl.style.width = pct + '%';
  }

  /* ---------------------------------------------------
   * 3. 초기화
   * ------------------------------------------------- */
  function init() {
    initProgressBar();
    // 페이지 진입 시 저장된 진행률 즉시 반영 (새로고침 후 복원)
    renderTrackProgress();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();

/* =================================================================
   SPEC-GIT-GITHUB-IMPL-005 — 사례 갤러리 필터 (DOM 기반)
   카드는 cases/index.html에 정적 렌더링(앵커 안정성, REQ-004/005).
   본 JS는 data-* 속성 기반으로 가시성 토글만 (REQ-002).
   결과 카운트 aria-live announce (REQ-007). 빈 상태 (REQ-002).
   reduced-motion: CSS가 처리. 본 JS는 토글만.
   ================================================================= */
(function () {
  'use strict';

  var grid = document.querySelector('[data-case-grid]');
  if (!grid) return;
  var cards = Array.prototype.slice.call(grid.querySelectorAll('.case-gallery__card'));

  var selTier = document.getElementById('filter-tier');
  var selDomain = document.getElementById('filter-domain');
  var selFeature = document.getElementById('filter-feature');
  var resetBtn = document.querySelector('[data-case-reset]');
  var countEl = document.querySelector('[data-case-count]');
  var emptyEl = document.querySelector('[data-case-empty]');

  // Domain/Feature 옵션을 카드 데이터에서 동적 생성
  function unique(field) {
    var set = {};
    cards.forEach(function (c) {
      var raw = c.getAttribute('data-' + field) || '';
      raw.split(',').forEach(function (v) {
        v = v.trim();
        if (v) set[v] = true;
      });
    });
    return Object.keys(set).sort(function (a, b) { return a.localeCompare(b, 'ko'); });
  }
  function fillSelect(select, values) {
    if (!select) return;
    values.forEach(function (v) {
      var opt = document.createElement('option');
      opt.value = v; opt.textContent = v;
      select.appendChild(opt);
    });
  }
  fillSelect(selDomain, unique('domain'));
  fillSelect(selFeature, unique('features'));

  function applyFilter() {
    var t = selTier ? selTier.value : '';
    var d = selDomain ? selDomain.value : '';
    var f = selFeature ? selFeature.value : '';
    var shown = 0;
    cards.forEach(function (c) {
      var ct = c.getAttribute('data-tier');
      var cd = c.getAttribute('data-domain');
      var cfs = (c.getAttribute('data-features') || '').split(',');
      var ok = (!t || ct === t) && (!d || cd === d) && (!f || cfs.indexOf(f) !== -1);
      c.style.display = ok ? '' : 'none';
      if (ok) shown++;
    });
    if (countEl) countEl.textContent = shown + '개 사례 표시 중 (전체 ' + cards.length + '개)';
    if (emptyEl) emptyEl.style.display = shown === 0 ? 'block' : 'none';
  }

  function reset() {
    if (selTier) selTier.value = '';
    if (selDomain) selDomain.value = '';
    if (selFeature) selFeature.value = '';
    applyFilter();
  }

  [selTier, selDomain, selFeature].forEach(function (sel) {
    if (sel) sel.addEventListener('change', applyFilter);
  });
  if (resetBtn) resetBtn.addEventListener('click', reset);

  applyFilter();
})();

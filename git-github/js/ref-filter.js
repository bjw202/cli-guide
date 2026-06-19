/* =================================================================
   SPEC-GIT-GITHUB-IMPL-004 (P4) — R01/R02 필터 + 검색 (vanilla JS)
   file:// 동작 필수 (REQ-010). build 의존성 없음.
   ================================================================= */
(function () {
  'use strict';

  // 필터 그룹(주제/난이도/알파벳) + 검색 입력을 연결해 아이템을 걸러낸다.
  // 각 아이템은 data-* 속성에 메타데이터를, 검색 대상 텍스트는 .js-search-text 에 가진다.
  function init() {
    const bar = document.querySelector('.ref-filter-bar');
    if (!bar) return;
    const list = document.querySelector('.js-ref-list');
    if (!list) return;

    const items = Array.from(list.querySelectorAll('.js-ref-item'));
    const empty = list.querySelector('.ref-empty');
    const searchInput = bar.querySelector('.ref-search input');

    // 활성 필터 모음: { group: value | 'all' }
    const active = {};

    // 같은 그룹 내 단일 선택. 클릭 시 토글(이미 활성이면 all로 복귀).
    bar.addEventListener('click', function (e) {
      const chip = e.target.closest('.ref-filter__chip');
      if (!chip) return;
      const group = chip.getAttribute('data-group');
      const value = chip.getAttribute('data-value');
      const wasActive = chip.classList.contains('is-active');

      // 같은 그룹 비활성화
      bar.querySelectorAll('.ref-filter__chip[data-group="' + group + '"]')
        .forEach(function (c) { c.classList.remove('is-active'); });

      if (wasActive) {
        active[group] = 'all';
      } else {
        chip.classList.add('is-active');
        active[group] = value;
      }
      apply();
    });

    // 키보드 접근성(REQ-009): chip은 <button>이라 Enter/Space 기본 동작.

    if (searchInput) {
      searchInput.addEventListener('input', function () { apply(); });
    }

    function matchesFilters(item) {
      for (const group in active) {
        if (active[group] === 'all' || !active[group]) continue;
        const val = item.getAttribute('data-' + group);
        // 다중 값은 공백 구분(예: data-topic="basic branch")
        const set = (val || '').split(/\s+/);
        if (!set.includes(active[group])) return false;
      }
      return true;
    }

    function matchesSearch(item) {
      if (!searchInput) return true;
      const q = searchInput.value.trim().toLowerCase();
      if (!q) return true;
      const hay = (item.querySelector('.js-search-text') || item).textContent.toLowerCase();
      return hay.indexOf(q) !== -1;
    }

    function apply() {
      let visible = 0;
      items.forEach(function (item) {
        const show = matchesFilters(item) && matchesSearch(item);
        item.style.display = show ? '' : 'none';
        if (show) visible++;
      });
      if (empty) empty.classList.toggle('is-visible', visible === 0);
    }

    apply();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();

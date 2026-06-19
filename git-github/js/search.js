/* =================================================================
   SPEC-GIT-GITHUB-IMPL-002 — 사이트 검색 (SearchOverlay)
   담당: 인라인 검색 인덱스 로드, 단순 문자열 매칭, 키보드 탐색,
        단축키(Ctrl+K/Cmd+K/`/`), aria-live 결과 안내, reduced-motion.
   순수 바닐라 JS. 빌드/프레임워크/퍼지 라이브러리 없음.
   REQ: 003(검색), 005(키보드), 006(aria-live), 007(단축키),
        009(인라인 인덱스, fetch 금지), 010(reduced-motion).
   ================================================================= */
(function () {
  'use strict';

  /* ---------------------------------------------------
   * 0. 상태 변수
   * ------------------------------------------------- */
  // @MX:ANCHOR: [AUTO] 검색 인덱스 캐시 — loadIndex() 의 단일 진실 원천.
  // @MX:REASON: 여러 핸들러(search, render, 탭 필터)가 동일 인덱스를 공유. 중복 파싱 방지.
  var INDEX = null;
  var activeTab = 'all';            // 현재 활성 탭: all|tutorial|reference|case|command
  var activeIndex = -1;            // 키보드 탐색 중인 결과 항목 인덱스
  var currentResults = [];         // 현재 렌더된(탭 필터 후) 결과 배열
  var lastFocused = null;          // 오버레이 열기 전 포커스 저장 (닫을 때 복원)
  var debounceTimer = null;        // 입력 디바운스 타이머
  var prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // 탭 → 표시할 type 매핑 (glossary는 reference 탭에 흡수)
  var TAB_TYPE_MAP = {
    all: null,                                     // 전체: 필터 없음
    tutorial: ['tutorial'],
    reference: ['reference', 'glossary'],          // glossary 흡수
    case: ['case'],
    command: ['command']
  };

  /* ---------------------------------------------------
   * 1. 검색 인덱스 로드 (REQ-009: fetch 금지, 인라인 JSON 파싱)
   * ------------------------------------------------- */
  function loadIndex() {
    if (INDEX) return INDEX;
    var el = document.getElementById('search-index');
    if (!el) {
      // @MX:WARN: [AUTO] search-index 스크립트 태그 누락 — 검색 불가.
      // @MX:REASON: 인덱스가 없으면 모든 검색이 빈 결과를 반환함. 조용히 빈 배열로 폴백.
      INDEX = [];
      return INDEX;
    }
    try {
      var raw = el.textContent || '';
      INDEX = JSON.parse(raw);
      if (!Array.isArray(INDEX)) INDEX = [];
    } catch (e) {
      // @MX:WARN: [AUTO] search-index JSON 파싱 실패 — 빈 인덱스로 폴백.
      // @MX:REASON: 깨진 JSON은 검색을 무력화. 운영자가 인덱스를 점검해야 함.
      INDEX = [];
    }
    return INDEX;
  }

  /* ---------------------------------------------------
   * 2. 검색 로직 (단순 문자열 매칭 — 퍼지/라이브러리 금지)
   *    빈 쿼리 → 빈 결과. 소문자 비교.
   * ------------------------------------------------- */
  function search(query) {
    var index = loadIndex();
    var q = (query || '').trim().toLowerCase();
    if (!q) return [];

    var matched = [];
    for (var i = 0; i < index.length; i++) {
      var item = index[i];
      // title + summary + keywords 를 하나의 문자열로 결합해 소문자 비교
      var haystack = [
        item.title || '',
        item.summary || '',
        (item.keywords || []).join(' ')
      ].join(' ').toLowerCase();

      if (haystack.indexOf(q) !== -1) {
        matched.push(item);
      }
    }
    return matched;
  }

  /* ---------------------------------------------------
   * 3. DOM 요소 참조 캐시
   * ------------------------------------------------- */
  var overlay, overlayInput, resultsEl, tabsEl, statusEl;

  function cacheDom() {
    overlay = document.getElementById('search-overlay');
    overlayInput = document.getElementById('search-overlay-input');
    resultsEl = document.getElementById('search-results');
    tabsEl = document.getElementById('search-tabs');
    statusEl = document.getElementById('search-status');
  }

  /* ---------------------------------------------------
   * 4. SearchOverlay 열기/닫기
   * ------------------------------------------------- */
  function openOverlay(initialQuery) {
    if (!overlay) return;
    lastFocused = document.activeElement;

    overlay.hidden = false;
    // is-open 클래스로 트랜지션 트리거 (reduced-motion 시 CSS가 즉시 전환)
    // @MX:NOTE: [AUTO] body.search-open 은 스크롤 잠금 용도.
    requestAnimationFrame(function () {
      overlay.classList.add('is-open');
      document.body.classList.add('search-open');
    });

    // 포커스 이동
    if (overlayInput) {
      overlayInput.value = initialQuery || '';
      overlayInput.focus();
      // 초기 쿼리가 있으면 즉시 검색 실행
      if (initialQuery) {
        runSearch(initialQuery);
      } else {
        renderResults([]);
      }
    }
  }

  function closeOverlay() {
    if (!overlay) return;
    overlay.classList.remove('is-open');
    document.body.classList.remove('search-open');

    // 트랜지션 종료 후 hidden 처리 (reduced-motion 시 즉시)
    if (prefersReducedMotion) {
      overlay.hidden = true;
    } else {
      // 트랜지션 지속시간(var(--dur)=0.32s) 후 hidden
      setTimeout(function () {
        if (!overlay.classList.contains('is-open')) overlay.hidden = true;
      }, 320);
    }

    // 포커스 반환
    if (lastFocused && typeof lastFocused.focus === 'function') {
      lastFocused.focus();
    }
    activeIndex = -1;
  }

  function isOpen() {
    return overlay && overlay.classList.contains('is-open');
  }

  /* ---------------------------------------------------
   * 5. 결과 렌더링 + 탭 필터
   * ------------------------------------------------- */
  function typeLabel(type) {
    switch (type) {
      case 'tutorial': return '튜토리얼';
      case 'reference': return '참조';
      case 'glossary': return '용어';
      case 'case': return '사례';
      case 'command': return '명령어';
      case 'home': return '홈';
      default: return type;
    }
  }

  function filterByTab(results) {
    var types = TAB_TYPE_MAP[activeTab];
    if (!types) return results; // 'all' 탭
    return results.filter(function (item) {
      return types.indexOf(item.type) !== -1;
    });
  }

  function renderResults(allResults) {
    if (!resultsEl) return;

    var filtered = filterByTab(allResults);
    currentResults = filtered;
    activeIndex = filtered.length > 0 ? 0 : -1;

    // REQ-006: aria-live 결과 개수 안내
    if (statusEl) {
      if (allResults.length === 0) {
        statusEl.textContent = '검색어를 입력하세요.';
      } else if (filtered.length === 0) {
        statusEl.textContent = '이 탭에 결과가 없습니다. (전체 ' + allResults.length + '개)';
      } else {
        statusEl.textContent = filtered.length + '개 결과.';
      }
    }

    // 빈 결과
    if (filtered.length === 0) {
      if (allResults.length === 0) {
        resultsEl.innerHTML = '<p class="search-empty">검색어를 입력하면 튜토리얼·참조·사례·명령어를 찾아드려요.</p>';
      } else {
        resultsEl.innerHTML = '<p class="search-empty">이 탭에 해당하는 결과가 없어요. 다른 탭을 선택해 보세요.</p>';
      }
      return;
    }

    // 결과 항목 렌더 (DOM 조작 — innerHTML 대신 createElement로 XSS 회피)
    var frag = document.createDocumentFragment();
    filtered.forEach(function (item, idx) {
      var a = document.createElement('a');
      a.className = 'search-result' + (idx === activeIndex ? ' is-active' : '');
      a.setAttribute('role', 'option');
      a.setAttribute('data-index', String(idx));
      a.href = item.url;

      var typeEl = document.createElement('span');
      typeEl.className = 'search-result__type';
      typeEl.textContent = typeLabel(item.type);
      a.appendChild(typeEl);

      var titleEl = document.createElement('span');
      titleEl.className = 'search-result__title';
      titleEl.textContent = item.title;
      a.appendChild(titleEl);

      if (item.summary) {
        var sumEl = document.createElement('span');
        sumEl.className = 'search-result__summary';
        sumEl.textContent = item.summary;
        a.appendChild(sumEl);
      }

      frag.appendChild(a);
    });
    resultsEl.innerHTML = '';
    resultsEl.appendChild(frag);
  }

  /* ---------------------------------------------------
   * 6. 검색 실행 (디바운스 포함)
   * ------------------------------------------------- */
  function runSearch(query) {
    if (debounceTimer) {
      clearTimeout(debounceTimer);
      debounceTimer = null;
    }
    // REQ: debounce 최소 120ms
    debounceTimer = setTimeout(function () {
      var results = search(query);
      renderResults(results);
    }, 120);
  }

  /* ---------------------------------------------------
   * 7. 키보드 탐색 (REQ-005)
   *    ↑/↓: 활성 항목 이동, Enter: 이동, Esc: 닫기
   * ------------------------------------------------- */
  function moveActive(delta) {
    if (currentResults.length === 0) return;
    // 순환 탐색
    activeIndex = (activeIndex + delta + currentResults.length) % currentResults.length;
    updateActiveClass();
    scrollActiveIntoView();
  }

  function updateActiveClass() {
    var items = resultsEl.querySelectorAll('.search-result');
    items.forEach(function (el, idx) {
      if (idx === activeIndex) {
        el.classList.add('is-active');
      } else {
        el.classList.remove('is-active');
      }
    });
  }

  function scrollActiveIntoView() {
    var active = resultsEl.querySelector('.search-result.is-active');
    if (active && typeof active.scrollIntoView === 'function') {
      active.scrollIntoView({ block: 'nearest' });
    }
  }

  function navigateActive() {
    if (activeIndex < 0 || activeIndex >= currentResults.length) return;
    var item = currentResults[activeIndex];
    if (item && item.url) {
      location.href = item.url;
    }
  }

  /* ---------------------------------------------------
   * 8. 이벤트 바인딩
   * ------------------------------------------------- */
  function bindEvents() {
    // 8-1. 히어로 검색 입력: 클릭/Enter 시 오버레이 열기
    var heroInput = document.getElementById('search-input');
    if (heroInput) {
      var openFromHero = function () {
        openOverlay(heroInput.value || '');
      };
      heroInput.addEventListener('focus', function () {
        // 포커스만으로는 열지 않음 — 사용자가 타이핑 시작하면 열기
      });
      heroInput.addEventListener('keydown', function (e) {
        if (e.key === 'Enter') {
          e.preventDefault();
          openFromHero();
        }
      });
      var heroBtn = document.querySelector('.home-hero__search-btn');
      if (heroBtn) {
        heroBtn.addEventListener('click', openFromHero);
      }
    }

    // 8-2. 헤더 검색 버튼 (.gh-search-btn)
    var ghBtn = document.querySelector('.gh-search-btn');
    if (ghBtn) {
      ghBtn.addEventListener('click', function () {
        openOverlay('');
      });
    }

    // 8-3. 오버레이 입력: 실시간 검색
    if (overlayInput) {
      overlayInput.addEventListener('input', function () {
        runSearch(overlayInput.value);
      });

      // REQ-005: 오버레이 내 키보드 탐색
      overlayInput.addEventListener('keydown', function (e) {
        switch (e.key) {
          case 'ArrowDown':
            e.preventDefault();
            moveActive(1);
            break;
          case 'ArrowUp':
            e.preventDefault();
            moveActive(-1);
            break;
          case 'Enter':
            e.preventDefault();
            navigateActive();
            break;
          case 'Escape':
            e.preventDefault();
            closeOverlay();
            break;
          case 'Tab':
            // 첫 결과로 포커스 이동(접근성 보조)
            if (currentResults.length > 0) {
              e.preventDefault();
              activeIndex = 0;
              updateActiveClass();
              var first = resultsEl.querySelector('.search-result');
              if (first) first.focus();
            }
            break;
        }
      });
    }

    // 8-4. 결과 항목 키보드 탐색 (포커스 받은 경우)
    if (resultsEl) {
      resultsEl.addEventListener('keydown', function (e) {
        var target = e.target.closest('.search-result');
        if (!target) return;
        var idx = parseInt(target.getAttribute('data-index'), 10) || 0;

        switch (e.key) {
          case 'ArrowDown':
            e.preventDefault();
            activeIndex = Math.min(idx + 1, currentResults.length - 1);
            updateActiveClass();
            scrollActiveIntoView();
            var next = resultsEl.querySelector('.search-result[data-index="' + activeIndex + '"]');
            if (next) next.focus();
            break;
          case 'ArrowUp':
            e.preventDefault();
            if (idx === 0) {
              // 첫 항목에서 ↑ → 입력창으로 복귀
              if (overlayInput) overlayInput.focus();
            } else {
              activeIndex = idx - 1;
              updateActiveClass();
              scrollActiveIntoView();
              var prev = resultsEl.querySelector('.search-result[data-index="' + activeIndex + '"]');
              if (prev) prev.focus();
            }
            break;
          case 'Escape':
            e.preventDefault();
            closeOverlay();
            break;
        }
      });

      // 마우스 hover 시 active 동기화
      resultsEl.addEventListener('mouseover', function (e) {
        var target = e.target.closest('.search-result');
        if (!target) return;
        var idx = parseInt(target.getAttribute('data-index'), 10);
        if (!isNaN(idx)) {
          activeIndex = idx;
          updateActiveClass();
        }
      });
    }

    // 8-5. 탭 전환
    if (tabsEl) {
      tabsEl.addEventListener('click', function (e) {
        var tab = e.target.closest('.search-tab');
        if (!tab) return;
        var tabId = tab.getAttribute('data-tab');
        if (!tabId || tabId === activeTab) return;

        activeTab = tabId;
        // 활성 탭 시각 갱신
        tabsEl.querySelectorAll('.search-tab').forEach(function (t) {
          var isActive = t.getAttribute('data-tab') === tabId;
          t.classList.toggle('is-active', isActive);
          t.setAttribute('aria-selected', isActive ? 'true' : 'false');
        });
        // 현재 쿼리로 다시 렌더 (탭 필터만 재적용)
        var query = overlayInput ? overlayInput.value : '';
        renderResults(search(query));
      });
    }

    // 8-6. 오버레이 외부 클릭(배경) 시 닫기
    if (overlay) {
      overlay.addEventListener('click', function (e) {
        if (e.target === overlay) closeOverlay();
      });
    }

    // 8-7. REQ-007: 전역 단축키
    document.addEventListener('keydown', function (e) {
      // Ctrl+K / Cmd+K — 오버레이 열기
      if ((e.ctrlKey || e.metaKey) && (e.key === 'k' || e.key === 'K')) {
        e.preventDefault();
        if (isOpen()) {
          if (overlayInput) overlayInput.focus();
        } else {
          openOverlay('');
        }
        return;
      }

      // '/' — 입력 필드에 포커스 없을 때만 오버레이 열기
      if (e.key === '/' && !isOpen()) {
        var ae = document.activeElement;
        var tag = ae ? ae.tagName : '';
        var isEditable = ae && (tag === 'INPUT' || tag === 'TEXTAREA' || ae.isContentEditable);
        if (!isEditable) {
          e.preventDefault();
          openOverlay('');
        }
        return;
      }

      // Esc — 오버레이 열려 있으면 닫기 (전역)
      if (e.key === 'Escape' && isOpen()) {
        e.preventDefault();
        closeOverlay();
        return;
      }
    });
  }

  /* ---------------------------------------------------
   * 9. 초기화
   * ------------------------------------------------- */
  function init() {
    cacheDom();
    // 인덱스 미리 로드(선택적 — 첫 검색 시에도 로드됨)
    loadIndex();
    bindEvents();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();

/* =================================================================
   SPEC-GIT-GITHUB-IMPL-001 — 글로벌 내비 동작
   담당: GlobalHeader 드롭다운 토글, 햄버거 모바일 드로어,
        Breadcrumb 자동 생성 (REQ-008).
   순수 바닐라 JS. 빌드/프레임워크 없음.
   ================================================================= */
(function () {
  'use strict';

  /* ---------------------------------------------------
   * 1. GlobalHeader 드롭다운 토글
   * ------------------------------------------------- */
  function initDropdowns() {
    const items = document.querySelectorAll('.gh-nav__item');
    if (!items.length) return;

    items.forEach((item) => {
      const trigger = item.querySelector('.gh-nav__trigger');
      if (!trigger) return;

      // 클릭 시 토글 (터치/키보드 모두 대응)
      trigger.addEventListener('click', (e) => {
        e.preventDefault();
        // 다른 열린 드롭다운 닫기
        items.forEach((other) => {
          if (other !== item) other.classList.remove('gh-nav__item--open');
        });
        item.classList.toggle('gh-nav__item--open');
        const open = item.classList.contains('gh-nav__item--open');
        trigger.setAttribute('aria-expanded', open ? 'true' : 'false');
      });

      // 키보드: Enter/Space 는 click 에서 처리됨. ESC 시 닫기.
      trigger.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
          item.classList.remove('gh-nav__item--open');
          trigger.setAttribute('aria-expanded', 'false');
        }
      });
    });

    // 외부 클릭 시 모든 드롭다운 닫기
    document.addEventListener('click', (e) => {
      if (!e.target.closest('.gh-nav__item')) {
        items.forEach((item) => {
          item.classList.remove('gh-nav__item--open');
          const t = item.querySelector('.gh-nav__trigger');
          if (t) t.setAttribute('aria-expanded', 'false');
        });
      }
    });
  }

  /* ---------------------------------------------------
   * 2. 햄버거 모바일 드로어 토글 (768px 이하)
   * ------------------------------------------------- */
  function initHamburger() {
    const btn = document.querySelector('.gh-hamburger');
    const drawer = document.querySelector('.mobile-drawer');
    if (!btn || !drawer) return;

    function open() {
      document.body.classList.add('drawer-open');
      btn.setAttribute('aria-expanded', 'true');
    }
    function close() {
      document.body.classList.remove('drawer-open');
      btn.setAttribute('aria-expanded', 'false');
    }

    btn.addEventListener('click', () => {
      if (document.body.classList.contains('drawer-open')) close();
      else open();
    });

    // 오버레이 클릭 시 닫기
    drawer.addEventListener('click', (e) => {
      if (e.target === drawer) close();
    });

    // 드로어 내 링크 클릭 시 닫기
    drawer.querySelectorAll('a').forEach((a) => {
      a.addEventListener('click', close);
    });

    // ESC 시 닫기
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && document.body.classList.contains('drawer-open')) {
        close();
      }
    });
  }

  /* ---------------------------------------------------
   * 3. Breadcrumb 자동 생성 (REQ-008)
   *    location.pathname 파싱 → "홈 › 섹션 › 현재 페이지"
   * ------------------------------------------------- */
  function initBreadcrumb() {
    const bc = document.querySelector('.breadcrumb');
    if (!bc) return;

    // 빈 breadcrumb 컨테이너에 자동 생성 (이미 내용이 있으면 건드리지 않음)
    if (bc.querySelector('.breadcrumb__list')) return;

    const path = location.pathname.replace(/\\/g, '/');
    // 파일명 추출 (index.html 등)
    const segments = path.split('/').filter(Boolean);
    // 마지막 세그먼트가 파일명(보통 .html)이면 분리
    let dirs = segments.slice();
    let file = '';
    if (dirs.length && /\.[a-z0-9]+$/i.test(dirs[dirs.length - 1])) {
      file = dirs[dirs.length - 1];
      dirs = dirs.slice(0, -1);
    }
    // 사이트 루트 이하의 상대 경로만 사용 (도메인/프로젝트 접두어 제거).
    // 본 사이트(tauri) 루트 감지.
    const SITE_ROOTS = ['tauri', 'git-github'];
    let rootIdx = -1;
    for (let i = dirs.length - 1; i >= 0; i--) {
      if (SITE_ROOTS.indexOf(dirs[i]) !== -1) { rootIdx = i; break; }
    }
    const localDirs = rootIdx >= 0 ? dirs.slice(rootIdx + 1) : dirs;

    // 홈 여부: localDirs 가 비어있고 파일이 index.html(또는 없음) → 홈
    const isHome = localDirs.length === 0 &&
      (!file || file === '' || /^index\./i.test(file));

    // 사이트 루트로부터의 깊이(= 상위로 가기 위한 ../ 개수)
    const depth = localDirs.length;

    // 섹션 라벨 매핑
    const sectionMap = {
      tutorial: { label: '튜토리얼', order: 1 },
      ref: { label: '참조', order: 2 },
      cases: { label: '사례 갤러리', order: 3 },
    };

    // 페이지 제목: <title> 태그에서 추출, 없으면 파일명
    function pageTitle() {
      const t = document.title && document.title.trim();
      return t || (file ? file.replace(/\.[^.]+$/, '') : '');
    }

    // href 빌더: 현재 위치에서 depth 만큼 올라간 기준 상대경로
    function homeHref() {
      return '../'.repeat(depth) + 'index.html';
    }

    const list = document.createElement('ol');
    list.className = 'breadcrumb__list';

    // 항목 추가 헬퍼
    function addItem(text, href, isCurrent) {
      const li = document.createElement('li');
      li.className = 'breadcrumb__item';
      if (isCurrent) {
        const span = document.createElement('span');
        span.className = 'breadcrumb__current';
        span.textContent = text;
        li.appendChild(span);
      } else {
        const a = document.createElement('a');
        a.className = 'breadcrumb__link';
        a.href = href;
        a.textContent = text;
        li.appendChild(a);
      }
      return li;
    }
    function addSep() {
      const li = document.createElement('li');
      li.className = 'breadcrumb__sep';
      li.setAttribute('aria-hidden', 'true');
      li.textContent = '›';
      return li;
    }

    if (isHome) {
      // 홈: "홈" 만 표시 (또는 빈 상태 유지)
      list.appendChild(addItem('홈', 'index.html', true));
      bc.appendChild(list);
      return;
    }

    // 1) 홈
    list.appendChild(addItem('홈', homeHref(), false));
    list.appendChild(addSep());

    // 2) 섹션 (있을 경우)
    const section = localDirs[0] ? sectionMap[localDirs[0]] : null;
    if (section) {
      // 섹션 인덱스로 이동 (같은 디렉토리의 index.html)
      const sectionIdxHref = '../'.repeat(depth - 1) + localDirs[0] + '/index.html';
      list.appendChild(addItem(section.label, sectionIdxHref, false));
      list.appendChild(addSep());
    }

    // 3) 현재 페이지
    list.appendChild(addItem(pageTitle(), '#', true));

    bc.appendChild(list);
  }

  /* ---------------------------------------------------
   * 4. 초기화
   * ------------------------------------------------- */
  function init() {
    initDropdowns();
    initHamburger();
    initBreadcrumb();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();

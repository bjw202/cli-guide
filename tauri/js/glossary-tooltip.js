/* =================================================================
   SPEC-TAURI-IMPL-007 — GlossaryTooltip (design-guide I)
   본문 Rust/Tauri 용어 hover/focus → 정의 + 비유 한 줄(R02 미러).
   file:// 동작 위해 인라인 임베드. 시리즈 glossary-tooltip 패턴 상속.
   ================================================================= */
(function () {
  'use strict';

  var GLOSSARY = {
    'tauri': { term: 'Tauri', metaphor: '웹으로 화면을 그리고, Rust로 일을 시키고, 운영체제의 창으로 띄우는 가벼운 데스크톱 앱 프레임워크.' },
    'electron': { term: 'Electron', metaphor: '웹 기술로 데스크톱 앱을 만드는 older 형. Chromium을 앱마다 번들해 무겁다.' },
    'webview': { term: 'webview (웹뷰)', metaphor: '운영체제가 기본 탑재한 웹 렌더러. Tauri가 Chromium 대신 빌려 쓰는 "식당 홀".' },
    'rust': { term: 'Rust', metaphor: '빠르고 메모리 안전한 시스템 언어. Tauri의 "주방" 언어.' },
    'cargo': { term: 'cargo', metaphor: 'Rust의 빌드·패키지 매니저. npm 같은 존재. 의존성은 Cargo.toml.' },
    'crate': { term: 'crate (크레이트)', metaphor: 'Rust의 패키지 단위. npm의 package 같은 것.' },
    'rustup': { term: 'rustup', metaphor: 'Rust 버전 관리자. "Rust의 nvm".' },
    'ipc': { term: 'IPC', metaphor: '프로세스 간 통신. Tauri에선 프론트↔Rust의 "주문서(invoke) ↔ 명령(command)" 통로.' },
    'invoke': { term: 'invoke()', metaphor: '프론트가 Rust 명령을 부르는 "주문서". await로 결과를 받아요.' },
    'command': { term: '#[tauri::command]', metaphor: 'Rust 함수를 프론트에 노출시키는 표시(매크로). 주방의 "요리법".' },
    'macro': { term: 'macro (매크로)', metaphor: '코드를 만들어내는 코드. #[...] 모양. "이 함수에 특별한 능력을 부여"하는 주문.' },
    'compiler': { term: 'compiler (컴파일러)', metaphor: '코드를 기계어로 번역해 주는 번역기. Rust 컴파일러는 안전성까지 검사해요.' },
    'ownership': { term: 'ownership (소유권)', metaphor: '"이 값은 누가 관리하나"를 정하는 Rust의 규칙. 본 가이드에선 깊이 다루지 않아요.' },
    'borrow': { term: '& (borrow, 빌림)', metaphor: '값을 소유하지 않고 "빌려 읽는다"는 표시. &str = 문자열을 빌려 쓴다는 뜻.' },
    'result': { term: 'Result', metaphor: '"성공하거나 실패할 수 있음"을 나타내는 타입. 예외 대신 쓰는 안전한 방식.' },
    'option': { term: 'Option', metaphor: '"값이 있거나 없을 수 있음"을 나타내는 타입. null 대신 쓰는 안전한 방식.' },
    'struct': { term: 'struct', metaphor: '관련 데이터를 하나로 묶는 상자. 객체지향의 객체 비슷.' },
    'enum': { term: 'enum', metaphor: '"경우의 수"를 나열한 타입. Status::Win / Lose / Draw 처럼.' },
    'match': { term: 'match', metaphor: 'switch의 강력한 사촌. 가능한 경우를 빠짐없이 다뤄요.' },
    'mut': { term: 'let mut', metaphor: '변수를 "바꿀 수 있게" 만드는 키워드. Rust는 기본이 불변이라 mut가 필요해요.' },
    'acl': { term: 'ACL (권한)', metaphor: 'Tauri 2의 최소권한 모델. 모든 API는 명시적 허용 필요. 기본은 차단.' },
    'tauri-cli': { term: 'Tauri CLI', metaphor: 'scaffold/dev/build를 한 번에 하는 "Tauri 주방 세트".' },
    'rust-analyzer': { term: 'rust-analyzer', metaphor: 'IDE에 자동완성·타입 정보를 주는 두뇌(LSP).' },
    'vite': { term: 'Vite', metaphor: '프론트엔드 번들러. Tauri 공식 권장. 핫 리로드가 빨라요.' },
    'frontend': { term: 'frontend (프론트엔드)', metaphor: '사용자가 보는 화면. Tauri에선 웹 기술(React/Vue/Svelte)로 만들어요.' },
    'backend': { term: 'backend (백엔드)', metaphor: '화면 뒤에서 진짜 일을 하는 곳. Tauri에선 Rust가 맡아요.' },
    'bundle': { term: 'bundle (번들)', metaphor: '운영체제별 설치 파일. .msi/.dmg/.deb 같은 "포장 상자".' },
    'lsp': { term: 'LSP', metaphor: '언어 서버 프로토콜. IDE에 코드 지능(자동완성/이동)을 제공하는 표준.' }
  };

  var tooltipEl = null;
  var currentTrigger = null;

  function ensureTooltip() {
    if (tooltipEl) return tooltipEl;
    tooltipEl = document.createElement('div');
    tooltipEl.className = 'glossary-tooltip';
    tooltipEl.setAttribute('role', 'tooltip');
    tooltipEl.setAttribute('hidden', '');
    document.body.appendChild(tooltipEl);
    return tooltipEl;
  }

  function escapeHTML(s) {
    return String(s).replace(/[&<>"]/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c];
    });
  }

  function show(trigger) {
    var key = trigger.getAttribute('data-term');
    var entry = GLOSSARY[key];
    if (!entry) return;
    var tip = ensureTooltip();
    tip.innerHTML = '<strong class="glossary-tooltip__term">' + escapeHTML(entry.term) + '</strong>' +
      '<span class="glossary-tooltip__metaphor">' + escapeHTML(entry.metaphor) + '</span>';
    tip.removeAttribute('hidden');
    currentTrigger = trigger;
    var rect = trigger.getBoundingClientRect();
    var top = rect.bottom + window.scrollY + 8;
    var left = rect.left + window.scrollX;
    var tipRect = tip.getBoundingClientRect();
    var maxLeft = window.innerWidth - tipRect.width - 12;
    tip.style.top = top + 'px';
    tip.style.left = Math.max(12, Math.min(left, maxLeft)) + 'px';
    trigger.setAttribute('aria-expanded', 'true');
  }

  function hide() {
    if (!tooltipEl) return;
    tooltipEl.setAttribute('hidden', '');
    if (currentTrigger) currentTrigger.setAttribute('aria-expanded', 'false');
    currentTrigger = null;
  }

  function init() {
    document.querySelectorAll('[data-term]').forEach(function (el) {
      if (!GLOSSARY[el.getAttribute('data-term')]) return;
      el.setAttribute('tabindex', '0');
      el.setAttribute('role', 'button');
      el.setAttribute('aria-expanded', 'false');
      el.classList.add('glossary-term');
      el.addEventListener('focus', function () { show(el); });
      el.addEventListener('blur', hide);
      el.addEventListener('mouseenter', function () { show(el); });
      el.addEventListener('mouseleave', hide);
      el.addEventListener('click', function (e) {
        e.preventDefault();
        if (currentTrigger === el) hide(); else show(el);
      });
      el.addEventListener('keydown', function (e) {
        if (e.key === 'Escape') { hide(); el.blur(); }
      });
    });
    window.addEventListener('scroll', hide, true);
    window.addEventListener('resize', hide);
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();

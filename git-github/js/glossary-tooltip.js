/* =================================================================
   SPEC-GIT-GITHUB-IMPL-006 — GlossaryTooltip (design-guide K)
   본문 용어에 hover/focus → 정의 + 비유 한 줄 툴팁 (REQ-006).
   데이터: R02 용어집(ref/glossary.html)의 정확한 미러 (REQ-006 일치).
   결정 6.4: 데이터 주도. file://에서 fetch 불가(CORS)하므로 인라인 임베드.
   reduced-motion: 즉시 표시 (REQ-004). 키보드 focus/Escape (REQ-005).
   유지보수: R02 수정 시 본 데이터도 동기화 필요 (sync 단계).
   ================================================================= */
(function () {
  'use strict';

  // R02 용어집 미러 — metaphor는 R02 .glossary__metaphor와 정확히 일치.
  var GLOSSARY = {
    'repository': { term: 'repository (저장소)', metaphor: '사진첩 그 자체. 지금까지 찍은 모든 사진(버전)이 보관되는 상자.' },
    'commit': { term: 'commit (커밋)', metaphor: '사진첩에 찍어 붙이는 한 장의 사진. 그 순간의 프로젝트 모습을 영구히 보존.' },
    'staging-area': { term: 'staging area / index', metaphor: '대기방. 다음 사진에 넣을 파일만 골라 모아두는 곳.' },
    'working-directory': { term: 'working directory', metaphor: '작업방. 지금 내가 직접 고치고 있는 실제 파일들.' },
    'head': { term: 'HEAD', metaphor: "'지금 내가 여기 있어' 손가락. 현재 보고 있는 사진/브랜치를 가리키는 포스트잇." },
    'detached-head': { term: 'detached HEAD', metaphor: '브랜치 없이 사진 한 장 위에 둥둥 떠 있는 상태.' },
    'branch': { term: 'branch (브랜치)', metaphor: '평행 우주. 원본을 그대로 둔 채 안전하게 새 실험을 이어가는 갈래.' },
    'merge': { term: 'merge (병합)', metaphor: '두 평행 우주의 이야기를 하나로 엮어 한 권의 책으로.' },
    'fast-forward-merge': { term: 'fast-forward merge', metaphor: '갈래가 난 적 없는 곧은길. 포인터만 앞으로 쭉 밀어주면 끝.' },
    'three-way-merge': { term: '3-way merge', metaphor: '두 갈래와 그 출발점 셋을 겹쳐 비교하며 한 권으로 엮기.' },
    'conflict': { term: 'conflict (충돌)', metaphor: '두 사람이 같은 문단을 서로 다르게 고쳐 결정이 필요할 때.' },
    'rebase': { term: 'rebase (리베이스)', metaphor: '내 사진들을 뽑아 다른 우주 끝으로 옮겨 다시 차례대로 붙이기.' },
    'interactive-rebase': { term: 'interactive rebase', metaphor: '과거 사진들을 편집기에서 한 줄씩 손보기.' },
    'squash': { term: 'squash', metaphor: '여러 장의 잔사진을 한 장으로 뭉쳐 붙이기.' },
    'cherry-pick': { term: 'cherry-pick', metaphor: '다른 나무의 열매 한 알만 콕 골라 따오기.' },
    'stash': { term: 'stash', metaphor: '하던 일을 잠시 서랍에 넣어두기.' },
    'bisect': { term: 'bisect', metaphor: '반씩 쪼개며 범인을 찾는 이진 탐색.' },
    'remote': { term: 'remote (원격)', metaphor: '내 컴퓨터 밖, 세상 어딘가에 있는 사진첩 사본(GitHub 등).' },
    'origin': { term: 'origin', metaphor: "'본점'. 내가 clone해 온 원본 원격 저장소에 붙인 기본 이름." },
    'fork': { term: 'fork', metaphor: '남의 요리책을 통째로 내 책장으로 복사.' },
    'pull-request': { term: 'pull request (PR)', metaphor: '"제가 만든 변경을 받아주세요" 하는 제안서.' },
    'pr': { term: 'pull request (PR)', metaphor: '"제가 만든 변경을 받아주세요" 하는 제안서.' },
    'issue': { term: 'issue', metaphor: "마을 게시판에 붙이는 '할 일·버그·질문' 쪽지." },
    'label': { term: 'label (라벨)', metaphor: '이슈·PR에 붙이는 색깔 분류 스티커(bug, enhancement 등).' },
    'milestone': { term: 'milestone', metaphor: '이슈·PR을 한 목표로 묶는 이정표.' },
    'tag': { term: 'tag (태그)', metaphor: '특정 사진에 붙이는 이름표. "이 지점이 v1.0!".' },
    'annotated-tag': { term: 'annotated tag', metaphor: '이름표에 메시지와 도장까지 찍은 정식 버전 표시.' },
    'semantic-versioning': { term: 'SemVer', metaphor: '"주.부.수" 세 숫자로 변화의 크기를 알려주는 관례(예: 2.1.0).' },
    'submodule': { term: 'submodule', metaphor: '책 속에 다른 책 한 권을 통째로 끼워 넣기.' },
    'worktree': { term: 'worktree', metaphor: '한 저장소를 여러 책상에 펼쳐 각각 다른 브랜치를 동시에 작업.' },
    'dependabot': { term: 'Dependabot', metaphor: '의존성을 지켜보는 로봇 경비. 취약 패키지를 고쳐주는 PR을 올려요.' },
    'actions-workflow': { term: 'Actions workflow', metaphor: '"push하면 자동 점검·배포"라며 미리 짜둔 로봇 작업 지시서.' },
    'runner': { term: 'runner (러너)', metaphor: '작업 지시서를 실제로 수행하는 일꾼 기계.' },
    'matrix': { term: 'matrix', metaphor: '조합마다 일꾼을 여럿 보내는 격자(OS·버전 조합 등).' },
    'secret': { term: 'secret / variable', metaphor: 'secret은 금고 속 비밀번호, variable은 바꾸기 쉬운 설정값.' },
    'branch-protection': { term: 'branch protection', metaphor: '중요 방(main)에 자물쇠. 검사·리뷰 없이는 직접 넣지 못하게.' },
    'codeowners': { term: 'CODEOWNERS', metaphor: '"이 폴더는 이 팀이 책임져요"라는 담당자 배정표.' }
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
    // 위치: 트리거 바로 아래, 뷰포트 경계 회피
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
    var terms = document.querySelectorAll('[data-term]');
    terms.forEach(function (el) {
      if (!GLOSSARY[el.getAttribute('data-term')]) return;
      el.setAttribute('tabindex', '0');
      el.setAttribute('role', 'button');
      el.setAttribute('aria-expanded', 'false');
      el.classList.add('glossary-term');

      el.addEventListener('focus', function () { show(el); });
      el.addEventListener('blur', hide);
      el.addEventListener('mouseenter', function () { show(el); });
      el.addEventListener('mouseleave', hide);
      // 모바일/터치: tap toggle
      el.addEventListener('click', function (e) {
        e.preventDefault();
        if (currentTrigger === el) hide(); else show(el);
      });
      el.addEventListener('keydown', function (e) {
        if (e.key === 'Escape') { hide(); el.blur(); }
      });
    });
    // 스크롤/리사이즈 시 툴팁 숨김(위치 어긋남 방지)
    window.addEventListener('scroll', hide, true);
    window.addEventListener('resize', hide);
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();

/* =================================================================
   SPEC-GIT-GITHUB-IMPL-006 — OhShitGitSimulator (design-guide G, 시그니처)
   7 시나리오 복구 시뮬레이터. 데이터 주도 (결정 6.4).
   REQ-003: content-plan T11 / design-guide G의 복구 명령과 정확히 일치.
   카드 선택 → 복구 명령 + "왜 작동하나" 설명.
   reduced-motion: 즉시 표시 (REQ-004). 키보드 조작 (REQ-005).
   ================================================================= */
(function () {
  'use strict';

  // REQ-003: 복구 명령은 design-guide G / content-plan T11과 정확히 일치
  var SCENARIOS = [
    {
      id: 'wrong-branch',
      emoji: '🌿',
      situation: '잘못 브랜치에서 커밋했어요',
      commands: [
        { cmd: 'git branch new-branch', note: '지금 커밋을 담아 둘 새 브랜치 생성' },
        { cmd: 'git reset --hard HEAD~1', note: 'main은 커밋 직전으로 되돌림' },
        { cmd: 'git switch new-branch', note: '새 브랜치로 이동 — 커밋이 살아 있어요' }
      ],
      why: '커밋 자체는 사라지지 않아요. main의 "가리키는 화살표"만 한 칸 뒤로 옮기고, 커밋은 새 브랜치가 가리키게 하면 돼요. (또는 git cherry-pick <커밋> 으로 복사해도 됩니다.)'
    },
    {
      id: 'reset-hard',
      emoji: '😱',
      situation: 'reset --hard 했는데 필요했어요',
      commands: [
        { cmd: 'git reflog', note: '내가 움직였던 모든 HEAD 기록 보기' },
        { cmd: 'git reset --hard <이전_위치>', note: 'reflog에서 찾은 위치로 복원' }
      ],
      why: 'Git은 90일간 모든 HEAD 이동을 reflog에 남겨요. reset --hard로 "삭제한" 커밋도 사실은 가비지컬렉션 전엔 살아 있어서 reflog로 되찾을 수 있어요.'
    },
    {
      id: 'typo-message',
      emoji: '✏️',
      situation: '커밋 메시지 오타 났어요',
      commands: [
        { cmd: 'git commit --amend -m "올바른 메시지"', note: '바로 직전 커밋의 메시지 수정' }
      ],
      why: '--amend는 "가장 최근 커밋을 고쳐 다시 만드는" 명령이에요. 아직 push하지 않았다면 안전해요. 이미 push했다면 push --force가 필요하니 주의.'
    },
    {
      id: 'undo-commit',
      emoji: '↩️',
      situation: '방금 커밋 취소하고 싶어요',
      commands: [
        { cmd: 'git reset HEAD~1', note: '커밋 1개 취소(파일은 작업 방에 보존)' },
        { cmd: 'git reset --hard HEAD~1', note: '커밋+변경사항까지 모두 버릴 때' }
      ],
      why: 'reset HEAD~1(= --soft 아님)은 커밋은 취소하되 변경사항은 staging이 풀린 채로 남겨요. --hard는 변경사항까지 날리니 정말 버릴 때만.'
    },
    {
      id: 'undo-pushed',
      emoji: '☁️',
      situation: '이미 push한 커밋 취소하고 싶어요',
      commands: [
        { cmd: 'git revert <커밋>', note: '취소하는 "반대 커밋"을 새로 만듦' },
        { cmd: 'git push', note: '안전하게 새 커밋으로 push' }
      ],
      why: '이미 push한 역사는 다 같이 쓰는 거라 reset으로 고쳐 쓰면 위험해요. revert는 "원래대로 되돌리는 새 커밋"을 추가해서 안전하게 취소하는 방법이에요.'
    },
    {
      id: 'force-push',
      emoji: '⚠️',
      situation: 'force push 해서 동료 작업 날아갔어요',
      commands: [
        { cmd: '# 즉시 팀에게 상황 공유', note: '혼자 고치지 말고 동료에게 알리기' },
        { cmd: 'git reflog / 동료의 로컬에서 복구', note: '동료 로컬에 살아있는 커밋으로 복원' }
      ],
      why: 'force push는 원격 역사를 덮어써요. 날아간 동료 커밋은 그 동료의 로컬 reflog에 남아 있을 수 있어요. 협조가 필수예요. 예방: 보호 브랜치(branch protection) 설정.'
    },
    {
      id: 'env-leak',
      emoji: '🔑',
      situation: '.env 파일(비밀번호) 실수로 push했어요',
      commands: [
        { cmd: '# 1. 즉시 모든 비밀번호/토큰 폐기·재발급', note: '가장 시급 — 이미 유출됐다고 가정' },
        { cmd: 'git filter-repo --path .env --invert-paths', note: '역사에서 .env 제거' },
        { cmd: '# 2. .gitignore에 .env 추가 후 재push', note: '다시는 안 올라가게' }
      ],
      why: '한 번 push한 비밀번호는 이미 유출된 것으로 봐야 해요. 역사에서 지워도(git filter-repo) 이미 복사본이 있을 수 있으니 "지우기"보다 "폐기·재발급"이 먼저예요.'
    }
  ];

  function init(root) {
    var menu = root.querySelector('[data-ohshit-menu]');
    var panel = root.querySelector('[data-ohshit-panel]');

    function escapeHTML(s) {
      return String(s).replace(/[&<>"]/g, function (c) {
        return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c];
      });
    }

    function renderPanel(s) {
      var cmds = s.commands.map(function (c) {
        return '<div class="ohshit__cmd"><code>' + escapeHTML(c.cmd) + '</code>' +
          '<span class="ohshit__cmd-note">' + escapeHTML(c.note) + '</span></div>';
      }).join('');
      panel.innerHTML =
        '<h4 class="ohshit__situation">' + s.emoji + ' ' + escapeHTML(s.situation) + '</h4>' +
        '<div class="ohshit__commands">' + cmds + '</div>' +
        '<div class="side-note side-note--tip ohshit__why">' +
        '<span class="side-note__label">왜</span>' +
        '<p>' + escapeHTML(s.why) + '</p></div>';
      panel.setAttribute('role', 'status');
      panel.setAttribute('aria-live', 'polite');
    }

    SCENARIOS.forEach(function (s, i) {
      var btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'ohshit__card';
      btn.setAttribute('data-ohshit-idx', i);
      btn.innerHTML = '<span class="ohshit__card-emoji" aria-hidden="true">' + s.emoji + '</span>' +
        '<span class="ohshit__card-text">' + escapeHTML(s.situation) + '</span>';
      btn.addEventListener('click', function () {
        menu.querySelectorAll('.ohshit__card').forEach(function (b) {
          b.classList.remove('is-selected');
          b.setAttribute('aria-pressed', 'false');
        });
        btn.classList.add('is-selected');
        btn.setAttribute('aria-pressed', 'true');
        renderPanel(s);
      });
      menu.appendChild(btn);
    });

    // 기본 첫 시나리오 표시
    var first = menu.querySelector('[data-ohshit-idx="0"]');
    if (first) first.click();
  }

  function start() { document.querySelectorAll('[data-asset="oh-shit-git"]').forEach(init); }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start);
  else start();
})();

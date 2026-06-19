# Progress — SPEC-GIT-GITHUB-IMPL-004 (P4: 참조 허브 4페이지)

**SPEC**: SPEC-GIT-GITHUB-IMPL-004 v1.0.1
**Phase**: Run + Sync
**Methodology**: TDD 모드 적용 — 단, 본 프로젝트는 빌드 단계 없는 정적 HTML(REQ-010)로 테스트 프레임워크가 없음. IMPL-001/002/003 선례에 따라 "수용기준 명세 기반 검증(REQ-001~012)"을 테스트 게이트로 사용.
**Date**: 2026-06-19

---

## Run 산출물 (납품)

### 페이지 (4)
- `git-github/ref/command-dictionary.html` (R01 명령어 사전) — 33개 항목(git 28 + GitHub 5)
- `git-github/ref/glossary.html` (R02 용어집) — 35개 용어(비유 1문장 + 공식 정의)
- `git-github/ref/faq.html` (R03 FAQ) — 15개 아코디언 항목
- `git-github/ref/cheatsheet.html` (R04 치트시트) — 주제별 6 카드(기본/브랜치/원격/복구/고급/github)

### 공유 자산
- `git-github/js/ref-filter.js` — R01/R02/R03 필터 + 검색(vanilla, file:// 동작)
- `git-github/js/faq-accordion.js` — R03 아코디언(tmux 패턴 독립 재구현, URL fragment 자동 펼침)
- `git-github/css/components.css` — ref 컴포넌트 클래스 추가(필터 바·명령어 카드·용어집·FAQ 아코디언·치트시트 그리드·`@media print`)

### P1 셸 상속 (REQ-008)
- 4페이지 전부 동일 순서로 5 CSS(tokens→base→layout→components→pages) + nav/progress/reveal link.
- GlobalHeader(참조 드롭다운에 R01~R04 정확 파일명) / GlobalFooter / Breadcrumb는 nav.js 자동 생성(`ref` → "참조" 섹션 라벨).
- tmux `:root` 변수명·토큰 그대로 사용. CommandPill(`.cmd-pill`), CheatSheetCard(`.cheat-card`) 재사용.

---

## 수용기준 검증 (독립, Run 게이트)

| REQ | 항목 | 검증 | 결과 |
|---|---|---|---|
| REQ-001 | R01 명령어 커버리지 | git 28(status/add/commit/log/show/diff/blame/reflog/branch/switch/merge/rebase/remote/fetch/pull/push/clone/tag/reset/revert/restore/clean/cherry-pick/stash/bisect/submodule/worktree/filter-repo/config/init/.gitignore) + GitHub 5(fork/PR/Issue/Actions/gh CLI) 전부 출현 | PASS |
| REQ-002 | R02 용어 커버리지 | commit/branch/HEAD/detached HEAD/staging/working dir/repo/merge/FF/3-way/conflict/rebase/interactive rebase/squash/cherry-pick/stash/bisect/remote/origin/fork/PR/issue/label/milestone/tag/annotated tag/SemVer/submodule/worktree/Dependabot/Actions workflow/runner/matrix/secret·variable/branch protection/CODEOWNERS 등 35용어 | PASS |
| REQ-003 | R03 FAQ 15+ | `faq-item` 15개(reset 3종·revert vs reset·push 취소·force push·.env·충돌·amend·reflog·잘못된 브랜치·비밀번호 노출·branch vs fork·pull vs fetch·merge vs rebase·clone vs fork·PR) | PASS |
| REQ-004 | R04 인쇄 가독성 | `@media print` — 헤더/진행률/브레드크럼브/필터 바 숨김, `page-break-inside: avoid` 카드 보존, 2단 그리드, 텍스트 검은색 고정으로 배경 제거 시에도 대비 유지 | PASS |
| REQ-005 | 튜토리얼 역링크 정확성 | 역링크 대상 18개 튜토리얼 파일 전부 존재(grep 검증 0 누락). content-plan G/H "위치" 열과 매핑 일치 | PASS |
| REQ-006 | 앵커 동작 | 항목별 id(`#git-reset`, `#git-rebase`, `#branch`, `#head`, `#pull-request`, `#faq-1` 등). `scroll-margin-top`으로 헤더 가림 방지. faq-accordion.js가 URL fragment 진입 시 자동 펼침 | PASS |
| REQ-007 | GlossaryTooltip(P6 의존) | 본 SPEC은 R02 용어 데이터(용어+비유+정의)만 납품, tooltip 컴포넌트 구현 안 함(IMPL-006 범위 명시 준수) | PASS(범위 외 명시) |
| REQ-008 | P1 셸 상속 | 4페이지 × 5 CSS + nav/progress/reveal link grep 확인 | PASS |
| REQ-009 | 필터 키보드 접근성 | chip 전부 `<button type="button">`(Enter/Space 기본 동작), `:focus-visible` outline, `aria-label`/`role="region"` 부여 | PASS |
| REQ-010 | 빌드 없음 | Node/npm/bundler 의존성 0. 외부 리소스는 Pretendard CDN 폰트만. ref-filter.js/faq-accordion.js 순수 vanilla | PASS |
| REQ-011 | WCAG AA | Python 정밀 계산 — 본문 13.85:1, text-secondary 4.72:1, 태그/링크 5.2~7.12:1. 전항목 4.5:1 이상(원본 primary-dark/secondary 미달값은 어두운 변형으로 치환) | PASS |
| REQ-012 | tmux 원본 무결성 | tmux/style.css·main.js·index.html mtime 14:13~14:14 유지(수정 없음). 아코디언은 tmux 패턴 참조만, 본 사이트 `.faq-*` 클래스로 독립 구현 | PASS |

---

## 검증 중 수정 (REQ-011 WCAG 결함)

- **tag--topic `--secondary`(#26A69A) 미달**: note-tip 배경 위 약 2.5:1 → `#0E6B5E`(5.78:1)로 치환.
- **tag--diff-easy `--git-green` 경계치**: `#256E48`(5.5:1)로 여유 확보.
- **tag--diff-hard `#B23A2E`**: `#9A2E24`(6.58:1)로 강화.
- **cmd-dict__link / glossary__metaphor `--primary-dark`(#E66E3F) 미달**: 링크는 `--accent-dark`(7.12:1), 비유문은 어두운 코랄 `#B84A20`(5.2:1)로 수정. 코랄 정체성 유지.

> P3(IMPL-003)에서 지적된 CommandPill WCAG 결함(`--accent-dark` 추가)은 본 Phase 산물이 상속해 그대로 AA 충족.

---

## Sync 단계

- git 저장소 아님 → PR/커밋 생략(IMPL-001/002/003 선례 동일).
- 본 progress.md로 진행 기록 확보.
- spec.md frontmatter `status: Planned → Implemented` 갱신.

## 알려진 제한 / Follow-up

- **REQ-007 GlossaryTooltip**: 툴팁 컴포넌트 자체는 P6(IMPL-006). R02 데이터가 준비됐으므로 P6에서 소비 가능.
- **GlossaryTooltip 데이터 소스 일치 검증**(REQ-007)은 P6 구현 시 R02 정의와 툴팁 데이터 비교로 수행 — 본 Phase는 데이터 납품까지만.
- **검색 인덱스(IMPL-002)**: R01~R04 페이지의 title/summary를 사이트 검색 인덱스에 추가하는 작업은 본 Phase 범위 외(필요 시 IMPL-002 인덱스 갱신). Task #17(P4 후속) 참조.
- 최종 일러스트·접근성 실측·Lighthouse·크로스 브라우저는 P7(IMPL-007).
- 인쇄 시 카드 색상 태그(`data-topic-label`)는 배경 제거 시 회색 텍스트로만 표시 — REQ-004 "대비 유지"는 텍스트 색 고정으로 충족하나, 색상 구분은 인쇄 품질에 따라 약화 가능(자명한 제한).

## HISTORY

- 2026-06-19: Run+Sync 완료. 4 ref HTML + 2 JS + components.css ref 섹션 납품. 12개 EARS 수용기준 전부 독립 검증 통과. REQ-011 WCAG AA 미달 색 5종 치환. tmux 원본 무결성 유지.

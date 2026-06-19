---
id: SPEC-GIT-GITHUB-IMPL-003
version: 1.0.1
status: Implemented
created: 2026-06-19
updated: 2026-06-19
author: jw
priority: High
lifecycle: spec-anchored
related:
  - SPEC-GIT-GITHUB-GUIDE-001
  - SPEC-GIT-GITHUB-IMPL-001
  - SPEC-TMUX-GUIDE-001
---

# SPEC — P3: 튜토리얼 트랙 21페이지 일괄 (T01~T21)

> 본 SPEC은 SPEC-GIT-GITHUB-GUIDE-001(기획) roadmap P3를 구현 단계로 정식화한 것이다.
> P1 셸(IMPL-001), P2 홈·검색(IMPL-002)과 병렬 계획된다. P3는 본 사이트 전체에서 **가장 분량이 큰 Phase**다.
> 아키텍처 결정(CSS 5분할, tmux 변수명, `#3D5AFE`, 추출-재포장, tmux 무결성)은 IMPL-001을 상속한다. research.md는 작성하지 않는다(경량 SPEC).

---

## 1. 목표 (Goal)

튜토리얼 트랙의 21개 HTML 페이지(T01 `git-concept` ~ T21 `github-extras`)를 납품한다. 각 페이지는 한국어 풀 카피, side-note 박스(페이지당 3~6개, 6종 혼합), CommandPill/CodeBlock, SidebarTOC(스크롤 스파이), PrevNextPager(T01→T21), 페이지별 치트시트 카드를 포함하며, 명령 실습 페이지(T03/T04/T09 등)는 FakeTerminal로 `init/status/add/commit/log` 흐름을 재생한다. 21페이지는 content-plan.md 섹션 4의 커버리지 체크리스트 GIT G1~G65(65항목) + GITHUB H1~H61(61항목) = 총 126항목을 누락 없이 다룬다.

---

## 2. 배경 (Background)

본 SPEC은 IMPL-001(P1 공유 셸)이 납품한 인프라 위에 튜토리얼 본문을 채운다. IMPL-001은 CSS 5분할(`tokens`/`base`/`layout`/`components`/`pages`), JS 3모듈(`nav`/`progress`/`reveal`), side-note 박스 6종 변수(`--note-metaphor` `#FFF7E6`, `--note-history` `#F5EFE0`, `--note-tip` `#E6F7F4`, `--note-warn` `#FDECEA`, `--note-extra` `#F1ECFB`, `--note-case` `#E8F5EE` + `--git-green` `#2E7D52` 테두리), CommandPill/CodeBlock 컴포넌트를 이미 제공한다. 본 SPEC은 이 셸을 상속만 하고 수정하지 않는다.

`content-plan.md`는 21페이지 전체의 카피 방향·핵심 개념·연결 side-note·사례 콜아웃 매핑을 담은 **권위 카피 소스(authoritative copy source)**다. 본 SPEC은 "무엇을 만들지"를 정의하고, 실제 한국어 카피 라이팅은 Run Phase에서 content-plan 방향을 다듬어 작성한다.

FakeTerminal은 tmux 자매 사이트 `tmux/js/main.js`의 fake-terminal 로직을 **추출하여 재포장(extract-and-repackage)** 한 뒤 git 명령 시퀀스(`init`→`status`→`add`→`commit`→`log`)로 확장한다(IMPL-001 결정 6.2 방식 준수). P3가 tmux fake-terminal 패턴이 "재사용"되는 실제 지점이다. tmux 원본은 수정하지 않는다(REQ-011 상속).

---

## 3. 산출물 (Deliverables)

### 3.1 튜토리얼 HTML 21파일 (`tutorial/*.html`)

5부(paran) 구조로 분할(content-plan.md 섹션 2 서사 흐름 준수):

**Part 1 — Git 기초 (T01~T05)**
- `tutorial/git-concept.html` (T01) — 버전 관리 개념, VCS, 분산 vs 중앙, 스냅샷, 3영역, commit+SHA-1, 불변성, HEAD (G1~G7)
- `tutorial/git-setup.html` (T02) — 설치(mac/linux/windows), config, init, clone (G8~G13)
- `tutorial/git-basics.html` (T03) — status/add/commit/log/show/--amend 기본 사이클 + FakeTerminal (G14~G18)
- `tutorial/git-staging.html` (T04) — 3영역 심화, diff 변형(working/staged/HEAD/stat/파일/word-diff/브랜치 간) + FakeTerminal (G4, G19~G23)
- `tutorial/git-history.html` (T05) — log 변형(oneline/graph/all/-p/stat), blame, reflog, show (G24~G26)

**Part 2 — 브랜치·병합 (T06~T08)**
- `tutorial/git-branch.html` (T06) — branch/switch/checkout, 브랜치 모델, HEAD, detached HEAD (G27~G31)
- `tutorial/git-merge.html` (T07) — fast-forward, 3-way merge, 충돌 해결 절차 (G32~G34)
- `tutorial/git-rebase.html` (T08) — rebase, interactive(squash/reword/reorder/drop), rebase vs merge, pull --rebase (G35~G37, G43)

**Part 3 — 원격·태그·복구·고급 (T09~T13)**
- `tutorial/git-remote.html` (T09) — remote/fetch/pull/push/clone, pull --rebase, force push 주의 + FakeTerminal (G38~G43)
- `tutorial/git-tag.html` (T10) — lightweight/annotated 태그, semantic versioning, 태그 공유 (G44~G46)
- `tutorial/git-undo.html` (T11) — reset(soft/mixed/hard), revert, restore, checkout <file>, clean, reflog 복구, "Oh Shit Git" 패턴 (G26, G47~G54)
- `tutorial/git-advanced.html` (T12) — cherry-pick, stash, bisect, submodule, worktree, filter-repo (G55~G60)
- `tutorial/git-config-files.html` (T13) — .gitignore, .gitattributes, hooks, Git LFS, aliases (G61~G65)

**Part 4 — GitHub 협업 (T14~T17)**
- `tutorial/github-concept.html` (T14) — git vs github, hosting platform, social coding, 역사 (H1~H3)
- `tutorial/github-repo.html` (T15) — create/clone/fork/template/import (H4~H8)
- `tutorial/github-issues-pr.html` (T16) — Issue(templates/labels/milestones), PR(draft/review/approve/comment/resolve conflicts), merge 전략 3종(squash/rebase/merge-commit), Discussions/Wiki/Projects (H9~H22)
- `tutorial/github-review.html` (T17) — review comments, suggestions, CODEOWNERS, branch protection, required reviews, status checks (H23~H28)

**Part 5 — GitHub 자동화·보안·워크플로우 (T18~T21)**
- `tutorial/github-actions.html` (T18) — workflow.yml(events/jobs/steps/runners), marketplace, matrix, secrets, variables, artifacts, caching, environments, CI/CD, Pages 배포, gh CLI (H29~H40)
- `tutorial/github-security.html` (T19) — Dependabot(alerts/updates), secret scanning, code scanning, branch protection, 2FA, commit signing(SSH/GPG), Secrets vs Variables (H41~H48)
- `tutorial/github-workflow-models.html` (T20) — GitFlow/GitHub Flow/Trunk-based/Forking/Release Flow 5종 비교 (H49~H53)
- `tutorial/github-extras.html` (T21) — Releases, Packages, Container registry, Codespaces, Copilot, Gists, profile README, organizations/teams (H54~H61)

**각 페이지 공통 구조**(design-guide.md 섹션 4.2 튜토리얼 템플릿 준수):
- PageHeader(제목 + 서브헤드) — content-plan 카피 방향 기반
- SidebarTOC(현재 페이지 섹션 목록 + 스크롤 스크라이)
- 본문 섹션들(content-plan 페이지별 본문 방향 기반 라이팅)
- side-note 박스 3~6개(6종 혼합: 비유/역사/팁/주의/알아두면/사례 콜아웃)
- CommandPill(`git status` 등) 및 필요 시 CodeBlock
- 사례 콜아웃 박스 → `cases/` 갤러리 해당 카드로 링크(content-plan 섹션 3 매핑 + cases-gallery 교차 맵)
- FakeTerminal(T03/T04/T09 등 명령 실습 페이지에 한함)
- 페이지 하단 치트시트 카드(해당 페이지 명령 요약)
- PrevNextPager(T01↔T02↔...↔T21 양방향)

### 3.2 JS — `js/fake-terminal.js`

tmux `tmux/js/main.js` fake-terminal 패턴 추출 + git 명령 스크립트 확장(IMPL-001 결정 6.2). 기본 `init`→`status`→`add`→`commit`→`log` 시퀀스를 타이핑 애니메이션·출력 재생으로 렌더링하며, 페이지별로 다른 명령 시퀀스를 `data-terminal-script` 속성으로 주입 가능해야 한다. tmux 원본 미수정.

---

## 4. 수용 기준 (Acceptance Criteria, EARS)

> 키워드(UBIQUITOUS, WHEN, WHILE, IF, THEN, WHERE, SHALL)는 영어로 유지. 본문은 한국어.

- **REQ-001 (커버리지 완전성)**: UBIQUITOUS — 21개 튜토리얼 페이지는 content-plan.md 섹션 4의 커버리지 체크리스트 GIT G1~G65(65항목)와 GITHUB H1~H61(61항목), 총 126항목을 누락 없이 다루 SHALL. 각 항목은 content-plan이 지정한 위치 페이지에 출현.

- **REQ-002 (오디언스 계약 — 비우 선행)**: UBIQUITOUS — 모든 기술 용어 첫 등장 앞에는 "비유 박스"(배경 `#FFF7E6`) 1개가 선행 SHALL. 비유 없이 기술어가 먼저 소개되는 페이지는 허용되지 않는다.

- **REQ-003 (git 팩트 정확성)**: UBIQUITOUS — 모든 git 명령어·옵션·동작 설명은 git-scm.com/docs와 일치 SHALL. (예: `git reset --soft`는 사진만 뒤로, `--mixed`는 대기 방까지, `--hard`는 작업 방까지 — git-scm.com/docs/git-reset 기준.)

- **REQ-004 (GitHub 팩트 정확성)**: UBIQUITOUS — 모든 GitHub 기능명·동작은 docs.github.com과 일치 SHALL. (예: PR merge 전략 3종 squash/rebase/merge-commit 명칭, Dependabot alerts vs security updates 구분.)

- **REQ-005 (PrevNextPager 순서)**: UBIQUITOUS — PrevNextPager는 T01→T02→...→T21 순서로 양방향 연결 SHALL. 순서 역전·끊김·순환 허용되지 않는다.

- **REQ-006 (사례 콜아웃 교차 맵 일치)**: UBIQUITOUS — 각 튜토리얼 페이지의 사례 콜아웃 박스(배경 `#E8F5EE` + 테두리 `#2E7D52`)는 content-plan 섹션 3의 페이지-사례 매핑과 cases-gallery.md 교차 맵이 지정하는 정확한 사례 카드로 링크 SHALL. (예: T03→"소설가의 원고 버전 관리", T06→"디자이너의 대안 디자인 브랜치", T11→"법률가의 계약서 변경 추적", T18→"뉴스레터 자동 발행 via GitHub Pages".)

- **REQ-007 (FakeTerminal 흐름 재생)**: WHEN 명령 실습 페이지(T03/T04/T09 등)가 로드되면, THEN `js/fake-terminal.js`가 `git init`→`git status`→`git add`→`git commit -m`→`git log` 기본 흐름을 타이핑 애니메이션과 출력으로 재생 SHALL.

- **REQ-008 (P1 셸 상속)**: UBIQUITOUS — 21페이지 모두 IMPL-001의 5 CSS(`tokens`→`base`→`layout`→`components`→`pages`)와 3 JS(`nav`→`progress`→`reveal`)를 link/load SHALL. P1 컴포넌트(GlobalHeader/GlobalFooter/Breadcrumb/ReadingProgress/SidebarTOC)를 재구현하지 않고 상속 사용.

- **REQ-009 (side-note 6종 렌더링)**: UBIQUITOUS — 21페이지의 side-note 박스 6종은 IMPL-001이 정의한 정확한 hex로 렌더링 SHALL: 비유 `#FFF7E6`, 역사 `#F5EFE0`, 팁 `#E6F7F4`, 주의 `#FDECEA`, 알아두면 좋은 `#F1ECFB`, 사례 콜아웃 배경 `#E8F5EE` + 테두리 `#2E7D52`.

- **REQ-010 (side-note 분량)**: WHILE 각 튜토리얼 페이지에 side-note 박스가 3~6개 배치되면, THEN 모든 페이지가 이 범위를 충족 SHALL. (6종 혼합, 단일 종으로만 채우지 않음.)

- **REQ-011 (빌드 없음)**: UBIQUITOUS — 21페이지는 빌드 단계 없이 `file://` 프로토콜로 브라우저에서 직접 열림 SHALL. (Node/npm/bundler 의존성 없음, IMPL-001 REQ-009 상속.)

- **REQ-012 (접근성·모션)**: UBIQUITOUS — 21페이지는 WCAG AA 색 대비(일반 텍스트 4.5:1)를 충족하고, WHILE 운영체제 설정이 `prefers-reduced-motion: reduce`이면, THEN FakeTerminal 타이핑 애니메이션과 scroll reveal 모션이 즉시 표시로 축소 SHALL.

- **REQ-013 (tmux 무결성)**: UBIQUITOUS — 본 SPEC의 어떤 산출물도 `tmux/` 디렉토리 원본 파일을 수정하지 SHALL NOT (IMPL-001 REQ-011 상속). FakeTerminal은 본 사이트 디렉토리 내 사본에서 추출·재포장.

---

## 5. 범위 외 (Out of Scope)

명시적으로 본 SPEC(P3) 범위에서 제외되는 항목.

- 홈 허브 콘텐츠(HeroBlock, ThreeDoors, CasePreview, SeriesLink)와 클라이언트 사이드 검색 → **P2 (IMPL-002)**.
- 참조 4페이지(R01 명령어 사전, R02 용어집, R03 FAQ, R04 치트시트 + CommandDictionaryItem/GlossaryItem/FAQItem) → **P4 (IMPL-004)**.
- 사례 갤러리 페이지(`cases/index.html`, CaseCard, CaseFilterBar, 26개 사례 데이터) → **P5 (IMPL-005)**. 본 SPEC은 사례 콜아웃 박스가 링크하는 "대상 카드"가 P5에서 생성됨을 가정하고 링크만 걸며, 실제 카드 구현은 하지 않는다.
- Git 특화 인터랙티브 자산(GitGraphVisualizer, StagingFlowDiagram, PRFlowDiagram, ActionsPipelineAnimation, OhShitGitSimulator, ConflictResolverMini, GlossaryTooltip) → **P6 (IMPL-006)**. 본 SPEC에서 FakeTerminal만 P3 범위로 포함하고, 나머지 인터랙티브 자산은 자리표시자(placeholder) 또는 정적 다이어그램으로 둔다.
- 최종 일러스트 제작(각 튜토리얼 비유 일러스트, 사례 카드 26종) → 각 해당 Phase. P3에서는 자리표시자 허용.
- 최종 QA, 접근성 감사(스크린 리더, 키보드 전용 탐색), 크로스 브라우저 테스트, Lighthouse 성능 검증 → **P7 (IMPL-007)**.
- `tmux/` 원본 파일의 어떠한 수정 (REQ-013 위반).
- 실제 한국어 카피 라이팅 완성본 — 본 SPEC은 content-plan 방향이 가리키는 "무엇을"을 정의하고, Run Phase에서 방향을 다듬어 라이팅한다.

---

## 6. 서브배칭 권고 (Sub-batching Recommendation)

본 Phase는 21페이지로 전체 roadmap 중 **가장 분량이 크다**. roadmap P3 note에 따라 Run Phase에서 5개 서브배치로 분할 실행할 것을 권고한다(별도 SPEC 분할이 아닌, 동일 SPEC 내 실행 지침).

| 서브배치 | 페이지 | 커버리지 범위 | 비고 |
| --- | --- | --- | --- |
| Sub-batch 1 | T01~T05 (Part 1) | G1~G26 | Git 기초. FakeTerminal 첫 도입(T03). |
| Sub-batch 2 | T06~T08 (Part 2) | G27~G37, G43 | 브랜치·병합·리베이스. |
| Sub-batch 3 | T09~T13 (Part 3) | G38~G42, G44~G65 | 원격·태그·복구·고급·설정. |
| Sub-batch 4 | T14~T17 (Part 4) | H1~H28 | GitHub 협업. |
| Sub-batch 5 | T18~T21 (Part 5) | H29~H61 | GitHub 자동화·보안·워크플로우. |

서브배치는 순차 실행을 권고하되, 서브배치 간 파일 충돌이 없으므로 병렬 실행도 허용한다(FakeTerminal `js/fake-terminal.js`은 Sub-batch 1에서 1차 구축 후 후속 서브배치에서 재사용).

---

## 7. 의존성 (Dependencies)

- **SPEC-GIT-GITHUB-IMPL-001 (P1 셸)** — 5 CSS, 3 JS, side-note 6종 변수, CommandPill/CodeBlock, GlobalHeader/Footer/Breadcrumb/ReadingProgress/SidebarTOC/PrevNextPager 컴포넌트. 본 SPEC은 상속만 하고 수정하지 않는다.
- **SPEC-GIT-GITHUB-GUIDE-001/content-plan.md** — 21페이지 카피 방향·핵심 개념·연결 side-note·사례 콜아웃 매핑·커버리지 체크리스트(G1~G65, H1~H61). 권위 카피 소스.
- **SPEC-GIT-GITHUB-GUIDE-001/design-guide.md** — 섹션 4.2(튜토리얼 템플릿), 5.B(FakeTerminal), 7(CommandPill/CodeBlock/SidebarTOC/PrevNextPager/SideNote).
- **SPEC-GIT-GITHUB-GUIDE-001/cases-gallery.md** — 사례 콜아웃 박스 교차 맵(REQ-006). 읽기 전용.
- **SPEC-TMUX-GUIDE-001 tmux 사이트** — `tmux/js/main.js`의 fake-terminal 로직(추출 소스, 읽기 전용). 원본 수정 금지(REQ-013).
- **외부 팩트 소스**(검증 기준): git-scm.com/docs(REQ-003), docs.github.com(REQ-004). 본 SPEC은 링크만 참조하고 카피하지 않는다.

---

## 8. 관련 산출물 (Related)

- SPEC-GIT-GITHUB-IMPL-001 — P1 공유 셸(직접 의존).
- SPEC-GIT-GITHUB-IMPL-002 — P2 홈·검색(병렬 계획).
- SPEC-GIT-GITHUB-IMPL-004 — P4 참조 4페이지(병렬 계획).
- SPEC-GIT-GITHUB-IMPL-005 — P5 사례 갤러리(사례 콜아웃 링크 대상 생성).
- SPEC-GIT-GITHUB-IMPL-006 — P6 Git 특화 인터랙티브 자산(자리표시자 교체 대상).
- SPEC-GIT-GITHUB-IMPL-007 — P7 QA/접근성.
- SPEC-GIT-GITHUB-GUIDE-001 산출물군: `spec.md`, `roadmap.md`, `design-guide.md`, `ia-sitemap.md`, `content-plan.md`, `cases-gallery.md`.
- SPEC-TMUX-GUIDE-001 — tmux 자매 사이트 원본. FakeTerminal 추출 소스.

---

## HISTORY

- 2026-06-19: 최초 작성. SPEC-GIT-GITHUB-GUIDE-001 roadmap P3(튜토리얼 21페이지 일괄)를 구현 단계로 정식화. IMPL-001 아키텍처 결정(CSS 5분할, tmux 변수명, `#3D5AFE`, 추출-재포장, tmux 무결성) 상속. content-plan.md 섹션 4 커버리지 체크리스트(126항목)를 REQ-001로 정식화. 13개 EARS 수용 기준 확정(REQ-001~REQ-013). 5개 서브배치 권고(Sub-batch 1~5)를 실행 지침으로 명시(별도 SPEC 분할 아님). research.md는 작성하지 않음(경량 SPEC). P2/P4/P5/P6/P7 명시적 범위 외.
- 2026-06-19: Run+Sync 완료. 튜토리얼 T01~T21(21 HTML) + js/fake-terminal.js 납품. 5 서브배치 병렬 실행(SB1 T02-T05 / SB2 T06-T08 / SB3 T09-T13 / SB4 T14-T17 / SB5 T18-T21). 126항목 커버리지·PrevNextPager 체인·사례 콜아웃 교차맵·FakeTerminal 흐름(T03/T04/T09) 독립 검증 통과. CommandPill WCAG 결함 수정(신규 토큰 --accent-dark #2A47D4, 5.82:1). home 헤더 드롭다운 파일명 불일치(P2 결함) follow-up 기록. 상세는 progress.md.

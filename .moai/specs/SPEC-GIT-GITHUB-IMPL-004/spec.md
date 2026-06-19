---
id: SPEC-GIT-GITHUB-IMPL-004
version: 1.0.1
status: Implemented
created: 2026-06-19
updated: 2026-06-19
author: jw
priority: Medium
lifecycle: spec-anchored
related:
  - SPEC-GIT-GITHUB-GUIDE-001
  - SPEC-GIT-GITHUB-IMPL-001
  - SPEC-GIT-GITHUB-IMPL-002
  - SPEC-TMUX-GUIDE-001
  - SPEC-GIT-GITHUB-IMPL-003
  - SPEC-GIT-GITHUB-IMPL-005
  - SPEC-GIT-GITHUB-IMPL-006
  - SPEC-GIT-GITHUB-IMPL-007
  - SPEC-TMUX-GUIDE-001
---

# SPEC — P4: 참조 허브 4페이지 (재방문자 점프 허브)

> 본 SPEC은 SPEC-GIT-GITHUB-GUIDE-001(기획 산출물)의 roadmap P4를 구현 단계로 정식화한 것이다.
> P4는 재방문자용 점프 허브 4페이지(R01~R04)에 한정한다. IMPL-002/003/005와 병렬 기획.
> IMPL-001(공유 셸 + 디자인 시스템)의 아키텍처 결정을 그대로 상속한다 (research.md 섹션 4).

---

## 1. 목표 (Goal)

재방문자("git reset --hard 차이가 뭐였지?", "rebase 한 줄 정의", "force push 위험?")가 필요한 순간에 점프해서 답을 얻는 4개 참조 허브 페이지를 납품한다: R01 명령어 사전(`ref/command-dictionary.html`), R02 용어집(`ref/glossary.html`), R03 FAQ(`ref/faq.html`), R04 치트시트(`ref/cheatsheet.html`). 각 페이지는 필터/앵커/아코디언으로 빠른 검색을 지원하고, 모든 항목에서 "→ 튜토리얼 TXX" 역링크로 학습 트랙과 양방향 연결된다. 한국어 카피.

---

## 2. 배경 (Background)

본 SPEC은 GUIDE-001 roadmap P4 + ia-sitemap 섹션 2.3(R01~R04 정의)/6.3(용어집·사전 항목별 앵커) + design-guide 섹션 4.3(참조 페이지 템플릿)/7(`CommandDictionaryItem`, `GlossaryItem`, `FAQItem` 컴포넌트) + content-plan G/H 체크리스트(명령어·용어 소스)를 구현 단계로 전환한다.

의존:
- **IMPL-001 (P1)**: 5-split CSS(tokens/base/layout/components/pages) + 3 JS(nav/progress/reveal) 셸을 상속. GlobalHeader/Breadcrumb/Footer는 본 페이지에서 재구현하지 않고 P1 산출물을 link.
- **IMPL-003 (P3) — soft dependency**: 튜토리얼 카피에서 용어·명령어의 최종 정의(비유 1문장 + 공식 정의)가 확정된 후 P4가 그것을 소비한다. 단, 병렬 기획은 가능하다 (정의의 방향은 content-plan.md로 이미 확정됨).
- **tmux FAQItem 아코디언 패턴**: R03 FAQ에서 재사용 (roadmap 섹션 3 cross-reuse 표). tmux 원본은 읽기 전용 (IMPL-001 REQ-011 준수, tmux 원본 무결성).

P4는 P3 출력(확정된 정의)을 소비하지만, content-plan.md가 방향을 이미 확정했으므로 병렬 기획이 가능하다. 단, 구현(Run Phase)은 P3 정의 확정 후 정합성 검증이 필요하다.

---

## 3. 산출물 (Deliverables)

### 3.1 R01 — `ref/command-dictionary.html` (명령어 사전)

- PageHeader + 검색/필터 바(알파벳 A-Z | 주제 | 난이도) (design-guide 섹션 4.3).
- `CommandDictionaryItem` 카드 리스트 (design-guide 섹션 7). 항목: git 명령어 전부(content-plan G14~G65 대응 — status, add, commit, log, diff, branch, switch, merge, rebase, remote, fetch, pull, push, clone, tag, reset, revert, restore, clean, reflog, cherry-pick, stash, bisect, submodule, worktree, filter-repo, config) + 주요 GitHub 기능(fork, PR, Issue, Actions, gh CLI).
- 각 카드: 명령어(`CommandPill` monospace) + 한 줄 설명(한국어) + 주제 태그(기본/브랜치/원격/복구/고급/github) + 난이도 태그(초급/중급/고급) + "→ 튜토리얼 TXX" 링크.
- 항목별 앵커: `#git-reset`, `#git-rebase` 등 (ia-sitemap 섹션 6.3). URL fragment로 직접 링크 가능.

### 3.2 R02 — `ref/glossary.html` (용어집)

- PageHeader + 알파벳/주제 필터 바.
- `GlossaryItem` 리스트 (design-guide 섹션 7). 용어: commit, branch, HEAD, detached HEAD, staging area, working directory, repository, merge, fast-forward merge, 3-way merge, conflict, rebase, interactive rebase, remote, origin, fork, pull request, issue, label, milestone, tag, annotated tag, semantic versioning, squash, cherry-pick, stash, bisect, submodule, worktree, Dependabot, Actions workflow, runner, matrix, secret, variable, branch protection, CODEOWNERS 등 — content-plan.md에서 정의한 모든 용어.
- 각 항목: 용어명 + 일상 비유 1문장(content-plan의 비유 박스 방향) + 공식 정의(git-scm.com/docs / docs.github.com 기준) + "→ 튜토리얼 TXX" 링크.
- 항목별 앵커: `#branch`, `#head`, `#pull-request` 등 (ia-sitemap 섹션 6.3).

### 3.3 R03 — `ref/faq.html` (FAQ)

- PageHeader + 주제 필터(되돌리기/충돌/원격/보안/협업).
- `FAQItem` 아코디언 (tmux FAQItem 패턴 재사용). 15개 이상 실제 초보자 질문 (content-plan T11 "Oh Shit Git" 패턴 + design-guide 핫 에셋 G 시나리오 메뉴 기반):
  - reset --soft / --mixed / --hard 차이가 뭔가요? (G47~G49)
  - revert와 reset의 차이? 언제 뭘 쓰나요? (G50)
  - 이미 push한 커밋을 취소하려면? (revert)
  - force push가 위험한 이유? `--force-with-lease`는? (T09 주의 박스)
  - `.env` 파일을 실수로 push했어요. 어떡하죠? (T13/T19 주의 박스 + filter-repo)
  - merge 충돌이 났어요. 어떻게 푸나요? (T07/G34)
  - 방금 한 커밋 메시지 오타 났어요. (`--amend`)
  - reset --hard 했는데 필요한 커밋이었어요. (reflog 복구)
  - 잘못된 브랜치에서 커밋했어요. (cherry-pick 또는 브랜치 생성)
  - 공개 저장소에 비밀번호를 올렸어요. (filter-repo + 비밀번호 변경)
  - branch와 fork의 차이? (T06/T15)
  - pull과 fetch의 차이? (T09/G40)
  - merge와 rebase의 차이? (T07/T08/G37)
  - clone과 fork의 차이? (T15)
  - PR이 뭔가요? 어떻게 만드나요? (T16)
- 각 답변: 한 줄 결론 + 2~4문장 설명 + "→ 튜토리얼 TXX 자세히" 링크 + (필요 시) `CommandPill` 명령어.

### 3.4 R04 — `ref/cheatsheet.html` (치트시트)

- PageHeader (검색/필터 없음, 단일 페이지 인쇄용).
- `CheatSheetCard` 주제별 카드 (roadmap P4 + design-guide 핫 에셋 J):
  - **기본**: init, clone, config, status, add, commit, log, show.
  - **브랜치**: branch, switch/checkout, merge, conflict 해결.
  - **원격**: remote, fetch, pull, push, clone.
  - **복구**: reset(soft/mixed/hard), revert, restore, clean, reflog, `--amend`.
  - **고급**: rebase, cherry-pick, stash, bisect, tag, filter-repo.
  - **github**: fork, PR, Issue, gh CLI, Actions, Pages.
- 각 카드: 명령어 + 한 줄 설명 + 주제 색상 태그. A4 인쇄 최적화(`@media print` CSS: 여백 축소, 배경색 제거 시에도 가독성 유지, 페이지 분산 방지).

### 3.5 공유 자산 (P4에서 신규 생성, P1 셸 위에 얹음)

- 페이지별 템플릿 클래스 `.tpl-ref` (IMPL-001 `css/pages.css`에 정의됨, 본 SPEC에서는 사용만).
- 필터/아코디언 JS: 최소한의 vanilla JS (R01/R02 필터, R03 아코디언 토글). 별도 모듈 파일로 분리(`js/ref-filter.js`, `js/faq-accordion.js`)하거나 인라인 — Run Phase에서 결정. 어느 쪽이든 `file://` 동작 필수.

---

## 4. 수용 기준 (Acceptance Criteria, EARS)

> 키워드(UBIQUITOUS, WHEN, WHILE, IF, THEN, WHERE, SHALL)는 영어로 유지. 본문은 한국어.

- **REQ-001 (R01 명령어 커버리지)**: UBIQUITOUS — `ref/command-dictionary.html`은 content-plan G14~G65에 대응하는 모든 주요 git 명령어(status, add, commit, log, diff, branch, switch, merge, rebase, remote, fetch, pull, push, clone, tag, reset, revert, restore, clean, reflog, cherry-pick, stash, bisect, submodule, worktree, filter-repo, config) + 주요 GitHub 기능(fork, PR, Issue, Actions, gh CLI)을 포함 SHALL. git-scm.com/docs / docs.github.com와 일치.

- **REQ-002 (R02 용어 커버리지)**: UBIQUITOUS — `ref/glossary.html`은 content-plan.md에서 정의한 모든 기술 용어(commit, branch, HEAD, staging, merge, rebase, conflict, remote, origin, fork, PR, Issue, tag, Dependabot, Actions workflow, runner, secret 등)를 포함 SHALL.

- **REQ-003 (R03 FAQ 15+)**: UBIQUITOUS — `ref/faq.html`은 15개 이상의 실제 초보자 질문을 다루 SHALL. 최소 포함: reset soft/mixed/hard 차이, revert vs reset, 이미 push한 커밋 취소, force push 위험, `.env` 실수 push, merge 충돌 해결, `--amend`, reflog 복구, 잘못된 브랜치 커밋, 공개 repo 비밀번호 노출. (content-plan T11 Oh Shit Git 패턴 기반.)

- **REQ-004 (R04 인쇄 가독성)**: WHEN 사용자가 `ref/cheatsheet.html`을 브라우저 인쇄(Ctrl+P / Cmd+P)하면, THEN A4 용지에서 주제별 카드가 가독성을 유지하고 페이지 중간에 카드가 잘리지 않으며 SHALL, 배경색 제거 시에도 텍스트 대비가 유지 SHALL.

- **REQ-005 (튜토리얼 역링크 정확성)**: UBIQUITOUS — R01/R02/R03의 모든 "→ 튜토리얼 TXX" 링크는 content-plan.md의 페이지-명령어/용어 매핑(G/H 테이블의 "위치" 열)과 일치하는 튜토리얼 파일(`tutorial/git-*.html` / `tutorial/github-*.html`)을 가리키고 SHALL, 존재하지 않는 파일이나 잘못된 매핑이 없을 것.

- **REQ-006 (앵커 동작)**: WHEN 사용자가 `/ref/command-dictionary.html#git-reset` 또는 `/ref/glossary.html#branch` URL을 직접 입력/링크하면, THEN 해당 항목으로 스크롤 이동하고 SHALL, 튜토리얼 본문의 용어/명령어 링크가 이 앵커로 정확히 연결 SHALL.

- **REQ-007 (GlossaryTooltip 통합 — P6 의존 명시)**: WHERE `GlossaryTooltip` 컴포넌트가 P6(IMPL-006)에서 구현된 경우, R02 용어집 항목은 tooltip 데이터 소스와 일치하는 정의를 표시 SHALL. 본 SPEC(P4)은 tooltip 컴포넌트 자체를 구현하지 않고 R02 데이터만 제공한다 (tooltip 구현은 IMPL-006 범위).

- **REQ-008 (P1 셸 상속)**: UBIQUITOUS — 4개 참조 페이지 모두 IMPL-001의 5 CSS(tokens → base → layout → components → pages)와 3 JS(nav → progress → reveal)를 동일 순서로 link/load하고 SHALL, GlobalHeader/Footer/Breadcrumb가 정상 렌더링 SHALL. tmux `:root` 변수명(`--primary`, `--accent`, `--note-*` 등)을 그대로 사용 (IMPL-001 REQ-001 시리즈 결속 상속).

- **REQ-009 (필터 키보드 접근성)**: WHEN 사용자가 R01/R02의 필터 바를 Tab으로 탐색하면, THEN 각 필터(알파벳/주제/난이도)와 검색 입력이 순서대로 포커스를 받고 Enter/Space로 선택 가능 SHALL. R03 아코디언은 Enter/Space로 펼치고/접을 수 SHALL.

- **REQ-010 (빌드 없음)**: UBIQUITOUS — 4개 참조 페이지 모두 빌드 단계 없이 `file://` 프로토콜로 브라우저에서 직접 열림 SHALL. (Node/npm/bundler 의존성 없음. IMPL-001 REQ-009 상속.)

- **REQ-011 (WCAG AA)**: UBIQUITOUS — 본문 텍스트와 배경 간 색 대비는 WCAG AA(일반 텍스트 4.5:1 이상)를 충족 SHALL. 따뜻한 톤(`#FFFBF5` 배경 위 `#2D2A26` 본문 등)이라도 대비 희생 없음 (IMPL-001 REQ-010 상속).

- **REQ-012 (tmux 원본 무결성)**: UBIQUITOUS — 본 SPEC의 어떤 산출물도 `tmux/` 디렉토리 원본 파일을 수정하지 SHALL NOT. FAQItem 아코디언 패턴은 tmux 소스를 참조만 하고 본 사이트 디렉토리 내에서 독립 구현 (IMPL-001 REQ-011 상속).

---

## 5. 범위 외 (Out of Scope)

명시적으로 본 SPEC(P4) 범위에서 제외되는 항목.

- **`GlossaryTooltip` 인터랙티브 컴포넌트 자체** (hover/focus 시 툴팁 팝업 JS/CSS) → **P6 (IMPL-006)**. 본 SPEC은 R02 용어집 데이터(용어 + 비유 + 정의)만 납품하고, tooltip이 그 데이터를 소비한다 (REQ-007).
- 튜토리얼 21페이지 본문(T01~T21) → **P3 (IMPL-003)**.
- 사례 갤러리 + CaseCard/CaseFilterBar + 26개 사례 데이터 → **P5 (IMPL-005)**.
- Git 특화 인터랙티브 자산(GitGraphVisualizer, OhShitGitSimulator, ConflictResolverMini, GlossaryTooltip 등) → **P6 (IMPL-006)**.
- 홈 허브(ThreeDoors, HeroBlock, 검색) → **P2 (IMPL-002)**.
- 공유 셸 CSS/JS(tokens/base/layout/components/pages, nav/progress/reveal)의 신규 작성 → **P1 (IMPL-001)**. 본 SPEC은 link만.
- 최종 QA, 접근성 감사, 크로스 브라우저, 성능 → **P7 (IMPL-007)**.
- `tmux/` 원본 파일의 어떠한 수정 (REQ-012).

---

## 6. 의존성 (Dependencies)

- **IMPL-001 (P1, hard)**: 공유 셸(5 CSS + 3 JS) + GlobalHeader/Footer/Breadcrumb + `.tpl-ref` 템플릿 클래스 + CommandPill/ComparisonTable 컴포넌트. 본 페이지는 이를 link/상속.
- **IMPL-003 (P3, soft)**: 튜토리얼 카피에서 용어/명령어의 최종 정의(비유 1문장 + 공식 정의) 확정. P4는 이 정의를 소비한다. 단, 병렬 기획은 가능 — content-plan.md가 방향을 이미 확정했으므로. Run Phase에서 P3 정의 확정 후 정합성 검증(REQ-001/002/005) 수행.
- **tmux 자매 사이트 (읽기 전용)**: FAQItem 아코디언 패턴 참조 (roadmap 섹션 3 cross-reuse 표). 원본 수정 금지 (REQ-012).
- **GUIDE-001 기획 산출물 (입력)**: roadmap P4, ia-sitemap 섹션 2.3/6.3, design-guide 섹션 4.3/7, content-plan G/H 체크리스트 + T11 Oh Shit Git 패턴.

> 병렬 기획 메모: IMPL-002/003/005와 동시에 spec을 작성할 수 있다. 각 SPEC은 P1 셸(IMPL-001)에 의존하지만 서로 독립이다. P4 ↔ P3 soft 의존은 content-plan.md가 완충제 역할을 하므로 기획 단계에서는 블로커가 아니다.

---

## 7. 관련 산출물 (Related)

- SPEC-GIT-GITHUB-IMPL-001 (P1, 부모) — 공유 셸 + 디자인 시스템. 본 SPEC이 상속. `research.md`(tmux 역분석, CSS 5분할 결정), `spec.md`(REQ-001~011 셸 수용 기준).
- SPEC-GIT-GITHUB-GUIDE-001 (기획 산출물군): `roadmap.md`(P4 항목), `ia-sitemap.md`(섹션 2.3 R01~R04, 6.3 앵커), `design-guide.md`(섹션 4.3 참조 템플릿, 7 컴포넌트 인벤토리), `content-plan.md`(G/H 체크리스트, T11 Oh Shit Git).
- 형제 구현 SPEC: IMPL-002(P2 홈+검색), IMPL-003(P3 튜토리얼 21), IMPL-005(P5 사례 갤러리), IMPL-006(P6 Git 특화 자산, GlossaryTooltip 포함), IMPL-007(P7 QA/접근성).
- SPEC-TMUX-GUIDE-001 — tmux 자매 사이트. FAQItem 아코디언 참조 소스(읽기 전용).

---

## HISTORY

- 2026-06-19: 최초 작성. GUIDE-001 roadmap P4를 구현 단계로 정식화. IMPL-001 아키텍처 결정(CSS 5분할, tmux 변수명, extract-repackage, tmux 원본 무결성) 상속. R01~R04 산출물 확정. 12개 EARS 수용 기준(REQ-001~012). IMPL-003 soft 의존 명시(병렬 기획 가능, Run Phase 정합성 검증 필요). GlossaryTooltip을 범위 외(P6)로 명시.
- 2026-06-19: annotation 통과. related에 SPEC-TMUX-GUIDE-001 추가(FAQItem 아코디언 패턴 재사용 소스 명시, 다른 IMPL SPEC과 일관).

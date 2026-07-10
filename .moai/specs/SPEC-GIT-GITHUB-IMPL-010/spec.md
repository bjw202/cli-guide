---
id: SPEC-GIT-GITHUB-IMPL-010
version: 1.0.0
status: Draft
created: 2026-07-10
updated: 2026-07-10
author: jw
priority: High
lifecycle: spec-anchored
related:
  - SPEC-GIT-GITHUB-GUIDE-001
  - SPEC-GIT-GITHUB-IMPL-001
  - SPEC-GIT-GITHUB-IMPL-006
  - SPEC-GIT-GITHUB-IMPL-009
  - SPEC-GIT-GITHUB-IMPL-011
  - SPEC-GIT-GITHUB-IMPL-012
---

# SPEC — P10: 실전 협업 트랙 P01~P08

> 본 SPEC은 승인된 계획서 `git-github-synchronous-hummingbird.md`의 "관통 시나리오" + "페이지 구성" + "정확성 원칙" 절을 구현 단계로 정식화한 것이다.
> 청중: 본 사이트를 구현하는 개발자. WHAT/WHY(각 페이지가 어떤 GitHub 기능을 어떤 정확도로 전달해야 하는가)에 집중하고 HOW(문장 카피, DOM 구조, mock UI 좌표)는 run 단계로 연기한다.
> mock UI 시스템(`.ghui-`, `data-asset` 훅)은 IMPL-009가 권위 있게 정의하며 본 SPEC은 이를 소비한다.

---

## 1. 목표 (Goal)

비개발자(기획·PM·디자이너·QA)가 개발팀의 실제 GitHub 워크플로우에 참여할 수 있도록, 화면을 재현해 보여주고 클릭 경로까지 안내하는 **실전 협업 트랙 P01~P08** 8개 페이지를 신설한다. `git-github/practice/` 신규 디렉터리에 8개 HTML을 납품하며, 각 페이지는 IMPL-009의 mock UI 시스템으로 GitHub 화면을 재현하고 핀 어노테이션으로 클릭 경로를 안내한다.

기존 T 트랙이 "무엇인가(비유)"를 담당한다면, P 트랙은 "어디를 누르는가(화면)"를 담당한다. **성공 기준**: 독자가 P02를 읽고 실제 GitHub 이슈 화면을 열었을 때, 사이드바 각 항목이 무엇이고 어디를 클릭하는지 헤매지 않는다.

---

## 2. 배경 (Background)

계획서가 확정한 방향은 "기존 T16/T17/T23 보강 + 실전 트랙 P01~P08 신설"이며, 독자 역할은 이슈 트리아지 / PR 읽기·리뷰 / Projects·Milestone 운영 / 웹 에디터 PR 생성 4가지 전부다. 실습 방식은 **관통 시나리오 하나가 전 페이지를 이어간다.**

**관통 시나리오** — 가상 저장소 `dongne-library/library-web`(동네 도서관 웹사이트 리뉴얼):
- **인물**: 지원(기획/PM — 독자의 분신, 비개발자) · 민수(개발자) · 하늘(디자이너)
- **고정 소재**:
  - Issue **#42** 「로그인 버튼이 안 눌려요」 — type `Bug`, label `bug`·`priority:high`, milestone `v1.0 오픈`
  - Issue **#38** 「대출 연장 기능」 — type `Feature`, 하위 이슈 3개(진행률 1/3)
  - PR **#57** 「로그인 버튼 클릭 영역 수정」 — 본문에 `Closes #42`, 리뷰어 하늘, 변경 파일 2개
  - Milestone **`v1.0 오픈`** — 마감일 있음, 진행률 바
  - Project **`도서관 리뉴얼 보드`**

모든 mock UI가 같은 번호·같은 인물을 쓴다. P02의 이슈 #42가 P04의 PR #57로 이어지고, P07의 Milestone 진행률에 반영된다.

**정확성 원칙** — 2026년 조사에서 **문서로 확정되지 않은 항목** 셋이 드러났다. 비개발자 대상 가이드에서 틀린 UI 라벨은 독자를 화면 앞에서 멈춰 세우므로, (a) Projects 자동화는 공식 문서 확정 4종만 단정 서술, (b) Milestone 진행률 산식은 단정 회피, (c) Slice by 출시 시점(날짜)은 미표기 규칙을 지킨다. 또한 모든 영문 UI 라벨은 원문 그대로 표기하고 괄호로 한국어를 병기한다(독자가 실제 화면에서 문자열을 찾아야 하기 때문).

**WHAT vs HOW 경계**: 본 SPEC은 각 페이지가 어떤 GitHub 기능을 어떤 정확도로 전달하고, 관통 시나리오를 어떻게 결속하는지를 정의한다. 문장 단위 카피, mock UI 좌표·DOM 구조는 run 단계로 연기한다. mock UI 컴포넌트·`data-asset` 훅 정의는 IMPL-009 소관이다.

---

## 3. 산출물 (Deliverables)

`git-github/practice/` 신규 디렉터리 + 8개 HTML:

| ID | 파일 | 다루는 것 |
|---|---|---|
| **P01** | `practice/repo-tour.html` | 시나리오·인물 소개. 저장소 상단 탭 한 바퀴. 비개발자가 어느 탭에 사나 |
| **P02** | `practice/issue-anatomy.html` | 이슈 #42 화면 해부. 사이드바 9항목. Issue types. Sub-issues |
| **P03** | `practice/issue-triage.html` | 잘 쓴 이슈 vs 나쁜 이슈. Issue Forms(YAML) vs Markdown 템플릿. 검색 문법. 일괄 편집·pin·transfer |
| **P04** | `practice/pr-anatomy.html` | PR #57 화면 해부. 4탭. Draft → Ready. `Closes #42` 함정. merge box |
| **P05** | `practice/pr-review.html` | Files changed 실습. 라인/멀티라인 코멘트. Suggested change. 배치 리뷰 |
| **P06** | `practice/projects-ops.html` | 보드 운영. Board/Table/Roadmap, Group by, Slice by. 필드. 자동화 |
| **P07** | `practice/milestone-release.html` | Milestone 화면. Milestone vs Iteration vs Label 선택 기준 |
| **P08** | `practice/nondev-playbook.html` | 역할별 체크리스트. 웹 에디터 PR. gh CLI 맛보기. 하지 말 것 |

각 페이지는 기존 튜토리얼 골격을 그대로 쓴다: `reading-bar` → `global-header` → `breadcrumb` → `page-header` → `.layout`(`.layout__main.tpl-tutorial` + `.sidebar-toc`) → `global-footer` → JS. `side-note--metaphor/tip/warn/extra/case`, `cheat-card`, `pager`도 재사용한다.

---

## 4. 수용 기준 (Acceptance Criteria, EARS)

> 키워드(UBIQUITOUS, WHEN, WHILE, IF, THEN, WHERE, SHALL)는 영어로 유지. 본문은 한국어.

### 관통 시나리오 결속

- **REQ-001 (시나리오 일관성)**: UBIQUITOUS — P01~P08 전 페이지의 mock UI와 본문은 동일 저장소 `dongne-library/library-web`, 동일 인물(지원 PM / 민수 개발자 / 하늘 디자이너), 동일 고정 소재를 사용 SHALL. 같은 번호·같은 인물이 페이지를 관통 SHALL.

- **REQ-002 (고정 소재 속성 일치)**: UBIQUITOUS — Issue #42는 type `Bug`, label `bug`·`priority:high`, milestone `v1.0 오픈`으로 표현 SHALL; PR #57은 본문에 `Closes #42`, 리뷰어 하늘, 변경 파일 2개로 표현 SHALL; Issue #38은 type `Feature`, 하위 이슈 3개 중 1개 완료(진행률 1/3)로 표현 SHALL. P02의 이슈 #42가 P04의 PR #57로 이어지고 P07의 Milestone `v1.0 오픈` 진행률에 반영 SHALL.

### 페이지별 콘텐츠 정확성

- **REQ-003 (P01 저장소 투어)**: P01은 관통 시나리오·인물을 소개하고 저장소 상단 탭(Code / Issues / Pull requests / Actions / Projects)을 한 바퀴 안내하며, 비개발자가 주로 사는 탭이 어디인지 제시 SHALL.

- **REQ-004 (P02 사이드바 9항목)**: P02는 이슈 사이드바 9항목을 정확히 표현 SHALL: Assignees / Labels / Type / Projects / Milestone / Sub-issues(Relationships) / Development / Notifications / Participants. 각 항목은 핀 어노테이션으로 클릭 경로와 결속 SHALL.

- **REQ-005 (P02 Issue types · Sub-issues 정확성)**: P02는 Issue types를 2025-04 GA, 기본 3종 `Bug`·`Feature`·`Task`, 조직 Settings → Planning → Issue types 경로, 조직당 최대 25개로 서술 SHALL. Sub-issues는 부모당 최대 100개, 최대 8단계 중첩, Create sub-issue 버튼으로 서술 SHALL.

- **REQ-006 (P03 템플릿 비교)**: P03은 Issue Forms(`.github/ISSUE_TEMPLATE/*.yml`, input/textarea/dropdown/checkboxes, validations)와 Markdown 템플릿(`*.md` + frontmatter `name:`/`about:`)을 비교하고, `config.yml`의 blank issue·contact_links를 서술 SHALL.

- **REQ-007 (P03 검색 qualifier 정확성)**: P03은 다음 검색 qualifier를 원문 그대로 표기 SHALL: `is:open`, `label:"in progress"`, `-label:bug`, `assignee:`, `milestone:`, `type:bug`, `no:label` / `no:assignee` / `no:milestone` / `no:project`, `linked:pr`. 아울러 일괄 편집, Pin(리포당 최대 3개), Transfer(같은 소유자만), Convert to discussion을 서술 SHALL.

- **REQ-008 (P04 PR 4탭 · Draft)**: P04는 PR 4탭(Conversation / Commits / Checks / Files changed)이 각각 무엇을 보여주는지 서술하고, Draft PR → Ready for review 전환을 설명 SHALL. Ready for review 시 CODEOWNERS 알림이 발생하며 Draft 상태에는 자동 리뷰 요청이 가지 않음을 명시 SHALL.

- **REQ-009 (P04 Closes 함정)**: P04는 닫기 키워드(`Closes #42`)가 **PR이 default 브랜치를 대상으로 할 때만** 이슈를 자동으로 닫는다는 함정을 `side-note--warn`으로 강조 SHALL.

- **REQ-010 (P04 merge box)**: P04는 merge box를 다음으로 서술 SHALL: required checks, Update branch(브랜치 업데이트), Enable auto-merge(즉시 병합 불가한 PR에만 노출), Merge when ready(merge queue). merge 3종은 원문 라벨 `Create a merge commit` / `Squash and merge` / `Rebase and merge`로 표기 SHALL. Development 사이드바로 이슈를 수동 연결하는 경로도 서술 SHALL.

- **REQ-011 (P05 Files changed 리뷰 도구)**: P05는 Files changed의 리뷰 도구를 서술 SHALL: 라인 코멘트(라인번호 hover → 파란 `+`), 멀티라인 코멘트(드래그 또는 Shift+클릭), Suggested change(제안 변경) + Commit suggestion(batch 커밋 가능), Viewed(확인함) 체크박스(파일 변경 시 자동 해제), 기어 아이콘 → Unified / Split, Hide whitespace(공백 무시).

- **REQ-012 (P05 배치 리뷰 흐름)**: P05는 배치 리뷰 흐름을 정확히 서술 SHALL: Start a review → pending(본인만 보임) → Add review comment → Review changes → Comment / Approve / Request changes → Submit review. 단발성 코멘트는 Add single comment로 구분 SHALL. Copilot code review는 항상 Comment만 남겨 병합을 막지 않음(2025-04 GA)을 명시 SHALL.

- **REQ-013 (P05 비개발자 판단 기준)**: P05는 비개발자가 언제 Comment(코멘트)를 쓰고 언제 Approve(승인)를 피해야 하는지 판단 기준을 제시 SHALL.

- **REQ-014 (P06 뷰·그룹·필드)**: P06은 보드 운영을 서술 SHALL: Board / Table / Roadmap 뷰, Group by(title·labels·reviewers·linked PR 필드로는 그룹 불가), Slice by, saved view, Field sums. 필드는 Text / Number / Date / Single select / Iteration + Parent issue + Sub-issue progress로 서술 SHALL. Insights 차트, 항목 추가 4경로(사이드바 기어 / 프로젝트 `+` / Auto-add 워크플로 / `gh project item-add`), 프로젝트당 최대 50,000 항목을 서술 SHALL.

- **REQ-015 (P06 자동화 확정 4종 단정)**: P06은 Projects 자동화를 공식 문서가 확정하는 4종만 단정 서술 SHALL: 기본 2종(이슈/PR close → Status `Done`, PR merge → Status `Done`) + Auto-add to project + Auto-archive items.

- **REQ-016 (P07 Milestone 화면 · 선택 기준)**: P07은 Milestone 화면(제목·설명·due date·completion percentage 바·open/closed 카운트)을 표현하고, 접근 경로(Issues 또는 Pull requests → 우측 상단 Milestones)를 안내 SHALL. Milestone vs Iteration vs Label 선택 기준(날짜 기반 목표 / 반복 스프린트 주기 / 비-시간적 분류)을 제시 SHALL.

- **REQ-017 (P08 역할별 체크리스트 · 웹 에디터 PR · gh CLI)**: P08은 역할별 체크리스트를 제공하고, 웹 에디터로 문서를 수정해 PR을 만드는 경로(연필 아이콘 → Commit changes → Create a new branch → Propose changes)를 안내 SHALL. gh CLI 맛보기로 `gh issue create`, `gh pr create --draft`, `gh pr review --approve|--request-changes|--comment`, `gh pr merge --squash --auto`, `gh project item-add`를 소개하고, 하지 말아야 할 것(force push, main 직접 커밋)을 명시 SHALL.

### 정확성 원칙 (문서 미확정 항목)

- **REQ-018 (Projects 자동화 미확정 명칭 처리)**: WHERE 문서에 열거되지 않은 자동화 명칭("Item added to project", "Code review approved", "Code changes requested" 등)을 언급해야 하는 경우, THEN 단정 서술하지 SHALL NOT — side-note로 "조직·시점에 따라 목록이 다르니 프로젝트 `…` 메뉴 → Workflows에서 직접 확인하세요"로 안내 SHALL.

- **REQ-019 (Milestone 진행률 서술 제한)**: P07의 Milestone 진행률은 "닫힌 항목 ÷ 전체 항목(이슈·PR 모두 포함)으로 표시됩니다"까지만 서술 SHALL, 공식 산식으로 단정 SHALL NOT.

- **REQ-020 (Slice by 날짜 미표기)**: Slice by의 출시 시점(날짜)은 표기 SHALL NOT. 기능만 설명한다.

- **REQ-021 (UI 라벨 원문 병기)**: UBIQUITOUS — 모든 영문 UI 라벨은 원문 그대로 표기하고 괄호로 한국어를 병기 SHALL (예: `Request changes`(수정 요청), `Squash and merge`(스쿼시 병합)). 독자가 실제 화면에서 문자열을 찾아야 하기 때문이다.

### 골격·톤·공통 계약

- **REQ-022 (페이지 골격 재사용)**: UBIQUITOUS — P01~P08 각 페이지는 기존 튜토리얼 골격(`reading-bar` → `global-header` → `breadcrumb` → `page-header` → `.layout`(`.layout__main.tpl-tutorial` + `.sidebar-toc`) → `global-footer` → JS)을 사용하고, `side-note--metaphor/tip/warn/extra/case`·`cheat-card`·`pager`를 재사용 SHALL.

- **REQ-023 (mock UI 재사용)**: UBIQUITOUS — P 트랙의 모든 GitHub 화면 재현은 IMPL-009의 `.ghui-` mock UI 시스템과 `data-asset` 훅(`gh-pins`/`gh-tabs`/`gh-diff`/`gh-board`/`gh-mergebox`)으로 렌더링 SHALL. 새 mock UI 스타일을 정의하지 SHALL NOT.

- **REQ-024 (톤 유지)**: UBIQUITOUS — 본문은 사이트의 "비유 먼저, 단어 나중" 원칙을 유지하고 비개발자 독자를 기준으로 서술 SHALL.

- **REQ-025 (빌드 없음)**: UBIQUITOUS — P 트랙 8개 페이지는 빌드 단계 없이 `file://` 프로토콜에서 직접 열릴 SHALL. (Node/npm/bundler 및 외부 라이브러리 의존성 없음.)

- **REQ-026 (tmux 원본 무결성)**: UBIQUITOUS — 본 SPEC의 어떤 산출물도 `tmux/` 디렉토리의 원본 파일을 수정하지 SHALL NOT.

---

## 5. 범위 외 (Out of Scope)

명시적으로 본 SPEC(P10) 범위에서 제외되는 항목.

- mock UI 컴포넌트 스타일(`css/gh-ui.css`)·인터랙션 엔진(`js/gh-ui.js`)의 정의 → **P9 (IMPL-009)**. P10은 이를 소비만 한다.
- 27개 기존 HTML 네비게이션에 `실전` 드롭다운 신설, `index.html` 도어 4개 확장·검색 인덱스 8항목 추가, `nav.js` `sectionMap` 수정 → **P11 (IMPL-011)**. P 트랙 페이지가 사이트에서 도달 가능해지는 작업은 IMPL-011 소관.
- 기존 T16/T17/T23 mock UI 삽입, glossary 5항목 추가 → **P12 (IMPL-012)**.
- `cases/index.html`에 P 트랙 연계 사례 추가 → 범위 밖(기존 사례로 충분, 이번엔 건드리지 않음).
- 문장 단위 카피 확정, mock UI 좌표·DOM 구조, 핀 범례 실제 문구 → **run 단계** (WHAT이 아닌 HOW).
- 실제 GitHub API 연동·라이브 데이터(정적 재현, 서버 없음).
- `tmux/` 원본 파일의 어떠한 수정 (REQ-026 위반).

---

## 6. 아키텍처 결정 (Architecture Decisions)

### 6.1 관통 시나리오 단일화 (페이지별 독립 예제 배격)

**결정**: 8개 페이지가 각기 다른 예제를 쓰지 않고, `dongne-library/library-web` 하나의 시나리오·인물·번호를 관통시킨다.

**근거**: 페이지마다 다른 예제를 쓰면 독자가 매 페이지 문맥을 새로 학습해야 한다. Issue #42가 PR #57로, 다시 Milestone 진행률로 이어지는 하나의 이야기여야 "이슈에서 시작한 일이 어떻게 릴리스로 완결되는가"라는 워크플로우 전체가 몸에 남는다. 이것이 REQ-001·REQ-002의 근간이다.

### 6.2 문서 미확정 항목의 방어적 서술 (조사 함정 대응)

**결정**: 조사에서 공식 문서가 확정하지 못한 3개 항목(Projects 자동화 전체 목록, Milestone 진행률 산식, Slice by 출시일)은 단정 서술을 회피하고, 확정된 것만 단정하거나 side-note로 "직접 확인" 안내한다(REQ-015/018/019/020).

**근거**: 비개발자 대상 가이드에서 틀린 UI 라벨·틀린 산식은 독자를 화면 앞에서 멈춰 세운다. "널리 알려졌으나 문서 미확정"인 명칭을 단정하면 독자가 실제 화면에서 그 문자열을 못 찾고 신뢰를 잃는다. 확정 4종만 단정하고 나머지는 확인 경로를 주는 편이 안전하다.

### 6.3 영문 UI 라벨 원문 우선 + 한국어 병기

**결정**: 모든 클릭 대상 UI 라벨은 영문 원문을 1차로 표기하고 괄호로 한국어를 병기한다(REQ-021).

**근거**: GitHub UI는 영문이 기본이다. 독자가 실제 화면에서 찾아 눌러야 하는 문자열은 원문이어야 한다. 한국어만 쓰면 "수정 요청" 버튼을 화면에서 못 찾는다. 원문+병기가 "이해"와 "실행"을 동시에 만족시킨다.

### 6.4 개념/실전 층위 분리 (T 트랙과의 역할 경계)

**결정**: P 트랙은 "어디를 누르는가(화면·클릭 경로)"에 집중하고, "무엇인가(비유·개념)"는 T 트랙에 위임한다. P 페이지에서 개념을 재설명하기보다 필요 시 T 페이지로 링크한다.

**근거**: T 트랙과 중복 서술하면 유지보수 지점이 둘로 갈라진다. 층위를 분리하면 T는 개념, P는 실전으로 각자 단일 책임을 진다. (IMPL-012가 T 페이지 측 대칭 원칙을 다룬다.)

---

## 7. 의존성 (Dependencies)

- **SPEC-GIT-GITHUB-IMPL-009 (P9)**(선행, 강한 의존): `.ghui-` mock UI 컴포넌트 9종과 `data-asset` 인터랙션 5종. P 트랙의 모든 GitHub 화면 재현이 이 시스템으로 렌더링된다(REQ-023). IMPL-009가 먼저 완료되어야 한다.
- **SPEC-GIT-GITHUB-IMPL-001 (P1)**: 공유 셸(5 CSS + 3 JS), 튜토리얼 골격, side-note 6종, `pager`, `cheat-card`. P 페이지 골격의 상속 원천(REQ-022).
- **SPEC-GIT-GITHUB-IMPL-006 (P6)**: `js/glossary-tooltip.js`. P 트랙에서 용어 `data-term` 툴팁을 재사용한다(신규 용어 앵커는 IMPL-012가 추가).
- **SPEC-GIT-GITHUB-IMPL-011 (P11)**(후행): 본 SPEC이 만든 페이지를 사이트 네비·검색에 연결한다. IMPL-011은 IMPL-010에 의존.
- **SPEC-GIT-GITHUB-IMPL-012 (P12)**(후행): 본 트랙으로의 진입 링크를 기존 T 페이지에 추가한다. IMPL-012는 IMPL-010에 의존.
- **SPEC-GIT-GITHUB-GUIDE-001 기획 산출물**(입력): 오디언스 계약(비개발자), "비유 먼저" 톤 원칙, 시리즈 결속.

---

## 8. 리스크 (Risks)

| 리스크 | 영향 | 완화 |
|---|---|---|
| 8페이지에 걸친 시나리오 번호·인물 불일치 | 독자 혼란, 관통 서사 붕괴 | REQ-001·REQ-002로 고정 소재 속성을 수용 기준에 못박음. run 단계에서 8페이지 전수 대조(같은 #42/#57/#38, 같은 인물). |
| 조사 미확정 항목의 잘못된 단정 | 독자가 화면에서 문자열 못 찾음, 신뢰 상실 | REQ-015/018/019/020으로 방어적 서술 규칙화(결정 6.2). 확정 4종만 단정, 나머지는 side-note 확인 안내. |
| 영문 라벨 오탈자·번역 불일치 | 실제 화면과 문자열 어긋남 | REQ-021로 원문 병기 강제(결정 6.3). run 단계에서 라벨 원문을 실제 GitHub UI와 대조. |
| P05 배치 리뷰 흐름 서술 난이도 | 가장 복잡한 인터랙션, 오해 유발 | `gh-diff`(IMPL-009) 인터랙션으로 독자가 직접 pending → Submit review를 체험하게 하여 산문 부담 경감. Comment/Approve/Request changes 판단 기준을 별도 REQ-013으로 분리. |
| P 트랙이 T 트랙과 중복 서술 | 유지보수 지점 이중화 | 개념/실전 층위 분리(결정 6.4). P는 화면·클릭에 집중, 개념은 T로 링크. |

---

## 9. 관련 산출물 (Related)

- SPEC-GIT-GITHUB-IMPL-009 (P9): mock UI 기반 시스템. 본 트랙의 화면 재현 엔진.
- SPEC-GIT-GITHUB-IMPL-001 (P1): 공유 셸·튜토리얼 골격. 페이지 뼈대 원천.
- SPEC-GIT-GITHUB-IMPL-006 (P6): `glossary-tooltip.js` 등 인터랙티브 자산.
- SPEC-GIT-GITHUB-IMPL-011 (P11): 사이트 통합(네비·검색·도어).
- SPEC-GIT-GITHUB-IMPL-012 (P12): 기존 개념 페이지 보강 + P 트랙 진입 링크.
- SPEC-GIT-GITHUB-GUIDE-001: 기획 산출물군(오디언스 계약, 톤 원칙).
- 승인 계획서: `.moai/plans/git-github-synchronous-hummingbird.md` "관통 시나리오"·"페이지 구성"·"정확성 원칙" 절 — 본 SPEC의 1차 입력.

---

## HISTORY

- 2026-07-10: 최초 작성. 승인 계획서의 "관통 시나리오"·"페이지 구성"·"정확성 원칙" 절을 구현 단계로 정식화. `practice/` 신규 디렉터리 + 8개 HTML(P01~P08) 산출물 정의. 관통 시나리오 `dongne-library/library-web`(지원/민수/하늘, Issue #42/#38, PR #57, Milestone `v1.0 오픈`, Project `도서관 리뉴얼 보드`)를 REQ-001·REQ-002로 결속. 2026년 조사 결과(Issue types 2025-04 GA·최대 25개, Sub-issues 100개·8단계, 검색 qualifier, `Closes` default 브랜치 함정, merge box 원문 라벨, 배치 리뷰 흐름, Projects 필드·자동화, Milestone 선택 기준)를 페이지별 REQ로 반영. 문서 미확정 3항목(자동화 목록·진행률 산식·Slice by 출시일) 방어적 서술을 REQ-015/018/019/020으로 정식화. UI 라벨 원문 병기(REQ-021), mock UI 재사용(REQ-023) 명시. 26개 EARS 수용 기준(REQ-001~REQ-026) 확정. WHAT/WHY에 집중하고 HOW(카피·좌표·DOM)는 run 단계로 연기. IMPL-009 강한 의존, IMPL-001 골격 상속, IMPL-011/012 후행 의존 명시.

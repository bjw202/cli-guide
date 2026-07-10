---
id: SPEC-GIT-GITHUB-IMPL-009
version: 1.3.0
status: Implemented
created: 2026-07-10
updated: 2026-07-10
author: jw
priority: High
lifecycle: spec-anchored
related:
  - SPEC-GIT-GITHUB-GUIDE-001
  - SPEC-GIT-GITHUB-IMPL-001
  - SPEC-GIT-GITHUB-IMPL-006
  - SPEC-GIT-GITHUB-IMPL-010
  - SPEC-GIT-GITHUB-IMPL-011
  - SPEC-GIT-GITHUB-IMPL-012
---

# SPEC — P9: GitHub mock UI 기반 시스템 (gh-ui.css + gh-ui.js)

> 본 SPEC은 승인된 계획서 `git-github-synchronous-hummingbird.md`의 "아키텍처: mock UI 시스템" 절을 구현 단계로 정식화한 것이다.
> 청중: 본 사이트를 구현하는 개발자. WHAT/WHY에 집중하고 HOW(CSS 좌표, DOM 트리, 애니메이션 easing, 정확한 hex 값)는 run 단계로 연기한다.
> 단, 계획서에 이미 확정된 클래스명·`data-*` 훅 이름·파일 경로는 산출물 정의이므로 본 SPEC에 포함한다.

---

## 1. 목표 (Goal)

실전 협업 트랙(P01~P08, IMPL-010)과 기존 개념 페이지 보강(IMPL-012)이 공용으로 쓸 **GitHub 화면 재현(mock UI) 기반 시스템**을 납품한다. 시스템은 두 산출물로 구성된다 — `css/gh-ui.css`(신규 6번째 CSS)와 `js/gh-ui.js`(신규). 이 시스템은 스크린샷 이미지 없이(`<img>` 0개인 프로젝트 전례 유지) HTML/CSS만으로 GitHub의 Issue·PR·Diff·Projects·Milestone 화면을 재현하고, 그 위에 **번호 핀 어노테이션**을 얹어 "화면의 이 지점 = 이 설명"을 연결한다.

본 Phase가 끝나면 P 트랙 각 페이지는 mock UI 스타일을 새로 정의하지 않고 `.ghui-` 컴포넌트를 조합·주입하기만 하면 되도록 기반이 완성된다. 이 시스템은 안내서를 "개념은 이해했지만 따라할 수 없는 문서"에서 "화면 앞에서 헤매지 않는 문서"로 전환하는 핵심 장치다.

---

## 2. 배경 (Background)

`git-github/` 안내서는 T01~T26으로 Git/GitHub 개념을 비유 중심으로 설명하나, **실제 GitHub 화면이 단 한 장도 없다.** 프로젝트 전체에 `<img>` 태그가 0개이고 Issue·PR·Projects·Milestone은 산문과 `comparison-table`로만 설명된다. 그 결과 독자는 "Issue가 무엇인지"는 알지만 "이 화면 어디를 눌러야 담당자를 지정하는지"는 모른다. 계획서가 채택한 방향은 **스크린샷이 아닌 HTML/CSS 재현(mock UI)** 이다 — `<img>` 0개 전례를 유지하면서 화면을 보여준다.

IMPL-001(P1)이 정한 공유 셸은 5개 CSS(`tokens` → `base` → `layout` → `components` → `pages`)와 3개 JS(`nav` → `progress` → `reveal`)다. 사이트는 따뜻한 크림톤(`--bg-base:#FFFBF5`)인 반면 GitHub는 차가운 회색톤이라, 두 톤을 한 스타일시트에서 섞으면 양쪽 다 망가진다. 따라서 mock UI는 **`.ghui-` 네임스페이스로 완전 격리**하고, GitHub Primer 계열 변수(`--ghui-canvas`, `--ghui-border`, `--ghui-accent` 등)를 `.ghui-window` 스코프 내부에서만 재정의한다. `gh-ui.js`는 IMPL-006의 `js/pr-flow.js` 패턴(IIFE, `'use strict'`, `data-asset` 훅 진입, `prefers-reduced-motion` 존중, 프레임워크 없음)을 그대로 상속한다.

**핀 어노테이션이 "따라할 수 있게" 만드는 핵심 장치다.** mock UI 위에 번호 핀(①②③)을 얹고, 아래 범례(`.ghui-legend`)에서 각 핀을 설명한다. 핀을 클릭·포커스하면 대응 범례가 하이라이트되고, 범례를 조작하면 대응 핀이 하이라이트된다(양방향). 이 장치가 없으면 mock UI는 그냥 예쁜 그림에 그친다. 핀이 있어야 "화면의 이 지점"과 "이 설명"이 결속되어, 독자가 실제 GitHub 화면을 열었을 때 각 지점이 무엇인지 대응시킬 수 있다.

**WHAT vs HOW 경계**: 본 SPEC은 각 컴포넌트와 인터랙션이 "무엇을 재현하고 어떤 체험을 전달하는가"를 정의한다. CSS 좌표, DOM 구조, 애니메이션 easing, 정확한 색 좌표는 run 단계로 연기한다. 클래스명·`data-*` 훅·파일 경로는 계획서에서 확정된 산출물 계약이므로 포함한다.

---

## 3. 산출물 (Deliverables)

### 3.1 `css/gh-ui.css` (신규 6번째 CSS)

`.ghui-` 네임스페이스로 완전 격리된 GitHub mock UI 스타일. P 트랙 페이지와 보강 대상 T 페이지에서만 로드한다(전 페이지 로드 아님). 컴포넌트 9종:

| 클래스 | 재현 대상 |
|---|---|
| `.ghui-window` | 브라우저 크롬 + 주소창(`github.com/dongne-library/library-web`) |
| `.ghui-repo-tabs` | Code / Issues / Pull requests / Actions / Projects 저장소 탭 바 |
| `.ghui-issue` + `.ghui-sidebar` | 이슈 본문 2단 레이아웃(본문 + 우측 사이드바) |
| `.ghui-tabs` | PR 4탭(Conversation / Commits / Checks / Files changed) |
| `.ghui-diff` | diff(통합 보기), 라인 번호, +/- 배경, 코멘트 삽입 슬롯 |
| `.ghui-mergebox` | 체크 상태 목록 + merge 버튼 드롭다운 |
| `.ghui-board` | 칸반 열 + 카드 |
| `.ghui-milestone` | 제목·마감일·진행률 바·open/closed 카운트 |
| `.ghui-label` / `.ghui-badge` / `.ghui-avatar` | 라벨 pill / Open·Merged 배지 / 아바타(이니셜 원) 원자 요소 |

### 3.2 핀 어노테이션 요소

- `.ghui-pin` — mock UI 위에 얹히는 번호 핀. `data-ghui-pin="N"` 훅으로 식별.
- `.ghui-legend` — mock UI 하단 범례(순서 목록). 각 항목은 `data-ghui-legend="N"` 훅과 `id`를 가진다.
- 핀 ↔ 범례 접근성 연결: 각 핀은 `aria-describedby`로 대응 범례 항목 `id`를 참조한다.

### 3.3 `js/gh-ui.js` (신규)

IMPL-006 `js/pr-flow.js` 패턴 상속(IIFE, `'use strict'`, `data-asset` 진입, `matchMedia('(prefers-reduced-motion: reduce)')` 존중, 프레임워크 없음). `data-asset` 훅 5종:

| `data-asset` 값 | 인터랙션 |
|---|---|
| `gh-pins` | 핀 ↔ 범례 양방향 하이라이트(전 페이지 공용) |
| `gh-tabs` | PR 4탭 전환(`role="tablist"`, 키보드 화살표 지원) |
| `gh-diff` | 라인번호 hover → 파란 `+` → 코멘트 폼 → "Start a review" 배치 → pending → "Submit review" 일괄 제출 |
| `gh-board` | 카드 클릭 → 다음 열로 이동, Status 필드 값 동기 변경 |
| `gh-mergebox` | 체크 통과/실패 토글 → merge 버튼 활성/비활성 변화 관찰 |

`gh-diff`가 가장 복잡하다. 독자가 실제로 라인 코멘트를 달아보고 배치 리뷰(pending → Submit review)를 체험하는 것이 P05의 핵심이기 때문이다.

---

## 4. 수용 기준 (Acceptance Criteria, EARS)

> 키워드(UBIQUITOUS, WHEN, WHILE, IF, THEN, WHERE, SHALL)는 영어로 유지. 본문은 한국어.

- **REQ-001 (네임스페이스 격리)**: UBIQUITOUS — `gh-ui.css`의 모든 mock UI 스타일은 `.ghui-` 접두사 네임스페이스 안에서만 정의 SHALL. GitHub Primer 계열 변수(`--ghui-canvas`, `--ghui-border`, `--ghui-accent` 등)는 `.ghui-window` 스코프 내부에서만 재정의 SHALL.

- **REQ-002 (오염 금지 — 사이트 → mock)**: UBIQUITOUS — `components.css`를 비롯한 사이트 공유 컴포넌트 스타일은 `.ghui-window` 내부 요소의 렌더링을 변경하지 SHALL NOT.

- **REQ-003 (오염 금지 — mock → 사이트)**: UBIQUITOUS — `gh-ui.css`의 어떤 규칙도 `.ghui-window` 바깥의 사이트 크림톤 렌더링(`--bg-base:#FFFBF5` 톤, side-note 6종, 본문 타이포)을 변경하지 SHALL NOT.

- **REQ-004 (컴포넌트 9종)**: UBIQUITOUS — `gh-ui.css`는 9종 컴포넌트를 제공 SHALL: `.ghui-window`, `.ghui-repo-tabs`, `.ghui-issue`+`.ghui-sidebar`, `.ghui-tabs`, `.ghui-diff`, `.ghui-mergebox`, `.ghui-board`, `.ghui-milestone`, 원자 요소(`.ghui-label`/`.ghui-badge`/`.ghui-avatar`).

- **REQ-005 (브라우저 크롬 + 주소창)**: WHEN `.ghui-window`가 렌더링되면, THEN 브라우저 크롬과 주소창이 함께 표현되고 주소창에 `github.com/dongne-library/library-web`가 표시 SHALL.

- **REQ-006 (핀 ↔ 범례 양방향 하이라이트)**: WHEN 사용자가 mock UI 위의 번호 핀(`.ghui-pin`, `data-ghui-pin`)을 클릭 또는 포커스하면, THEN 대응하는 하단 범례 항목(`.ghui-legend`, `data-ghui-legend`)이 하이라이트 SHALL. 역방향(범례 항목 조작 → 대응 핀 하이라이트)도 성립 SHALL.

- **REQ-007 (핀 ↔ 범례 접근성 연결)**: UBIQUITOUS — 각 `.ghui-pin`은 `aria-describedby`로 대응 `.ghui-legend` 항목의 `id`를 참조하여 스크린리더가 핀의 의미를 읽을 수 있게 SHALL.

- **REQ-008 (gh-pins 진입)**: WHEN 페이지에 `data-asset="gh-pins"` 요소가 존재하면, THEN `gh-ui.js`가 이를 감지하여 핀↔범례 인터랙션을 초기화 SHALL.

- **REQ-009 (gh-tabs 탭 전환)**: WHEN 사용자가 PR 4탭(`role="tablist"`)에서 탭을 클릭하거나 좌우 화살표 키로 이동하면, THEN 해당 탭 패널로 전환되고 활성 탭 상태가 갱신 SHALL.

- **REQ-010 (gh-diff 배치 리뷰 흐름)**: WHEN 사용자가 diff 라인의 라인번호에 hover하여 나타난 `+` 버튼으로 코멘트 폼을 열고, "Start a review"로 코멘트를 배치에 담은 뒤 "Submit review"를 실행하면, THEN 담긴 pending 코멘트들이 일괄 제출되는 배치 리뷰 흐름이 표현 SHALL.

- **REQ-011 (gh-board 카드 이동 + Status 동기)**: WHEN 사용자가 보드 카드를 다음 열로 이동시키면, THEN 카드의 위치가 이동하고 대응하는 Status 필드 값이 동기 변경 SHALL.

- **REQ-012 (gh-mergebox 체크 토글)**: WHEN 사용자가 mergebox의 체크 항목을 통과/실패로 토글하면, THEN merge 버튼의 활성/비활성 상태가 그에 맞춰 변화 SHALL.

- **REQ-013 (JS 패턴 상속)**: UBIQUITOUS — `gh-ui.js`는 IIFE + `'use strict'` 구조로 작성되고, `data-asset` 훅으로 진입하며, 외부 프레임워크·라이브러리 없이 IMPL-006 `js/pr-flow.js` 패턴을 상속 SHALL.

- **REQ-014 (모션 축소)**: WHILE 운영체제 설정이 `prefers-reduced-motion: reduce`이면, THEN 모든 `gh-ui.js` 인터랙션의 애니메이션 모션이 축소(즉시 상태 전환)되거나 정지 SHALL. 단, 축소 모드에서도 각 인터랙션의 정보(탭 내용, diff, 범례 대응, 보드 상태)는 정적으로 온전히 전달 SHALL.

- **REQ-015 (키보드 조작)**: UBIQUITOUS — mock UI의 인터랙티브 요소(핀, 탭, diff 코멘트 버튼, 보드 카드, mergebox 체크)는 tab 키로 포커스 이동이 가능하고 Enter/Space로 활성화 SHALL. 탭 전환은 `role="tablist"` + 좌우 화살표로 조작 SHALL.

- **REQ-016 (재현 화면 고지)**: UBIQUITOUS — 각 `.ghui-window`는 `aria-label`로 "실제 GitHub이 아닌 재현 화면"임을 스크린리더가 인지할 수 있도록 명시 SHALL.

- **REQ-017 (WCAG AA 색 대비)**: UBIQUITOUS — mock UI의 텍스트와 배경 간 색 대비는 WCAG AA 기준(일반 텍스트 4.5:1 이상)을 충족 SHALL. GitHub 회색톤을 재현하더라도 대비를 희생하지 않는다.

- **REQ-018 (반응형 접힘/가로 스크롤)**: WHILE 뷰포트 너비가 `768px` 이하이면, THEN `.ghui-issue`의 2단 이슈 레이아웃(본문 + 사이드바)이 1단으로 접히고, 넓은 mock UI(`.ghui-diff`, `.ghui-board`)는 가로 스크롤로 처리 SHALL.

- **REQ-019 (빌드 없음)**: UBIQUITOUS — `gh-ui.css`와 `gh-ui.js`는 빌드 단계 없이 `file://` 프로토콜에서 직접 동작 SHALL. (Node/npm/bundler 및 외부 라이브러리 의존성 없음.)

- **REQ-020 (tmux 원본 무결성)**: UBIQUITOUS — 본 SPEC의 어떤 산출물도 `tmux/` 디렉토리의 원본 파일을 수정하지 SHALL NOT.

---

## 5. 범위 외 (Out of Scope)

명시적으로 본 SPEC(P9) 범위에서 제외되는 항목.

- P 트랙 8개 페이지 본문·카피·시나리오·핀 범례 실제 내용 → **P10 (IMPL-010)**. P9는 mock UI 컴포넌트와 인터랙션 엔진만 납품하고, 어떤 화면에 어떤 핀·범례를 얹을지는 IMPL-010이 정의한다.
- 27개 HTML 네비게이션 통합, `index.html` 도어·검색 인덱스, `nav.js` `sectionMap` 수정 → **P11 (IMPL-011)**.
- 기존 T16/T17/T23 mock UI 삽입, glossary 항목 추가 → **P12 (IMPL-012)**. P9는 재사용 가능한 컴포넌트를 제공만 한다.
- CSS 좌표 명세, DOM 트리 구조, 애니메이션 easing 함수, 정확한 hex 색 좌표, 상태 전이 다이어그램 → **run 단계** (WHAT이 아닌 HOW).
- 실제 GitHub API 연동, 라이브 데이터 fetch(본 mock UI는 정적 재현, 서버·네트워크 없음).
- IMPL-001의 5개 기존 CSS(`tokens`/`base`/`layout`/`components`/`pages`) 내용 수정 (`gh-ui.css`는 독립 6번째 파일로 추가).
- `tmux/` 원본 파일의 어떠한 수정 (REQ-020 위반).

---

## 6. 아키텍처 결정 (Architecture Decisions)

### 6.1 독립 6번째 CSS 파일 신설 (components.css 추가 배격)

**결정**: mock UI 스타일을 IMPL-006처럼 `components.css`에 추가하지 않고, 독립 파일 `css/gh-ui.css`로 분리한다. P 트랙 페이지와 보강 대상 T 페이지에서만 `<link>`로 로드한다.

**근거**: (a) mock UI는 `.ghui-` 완전 격리 + `.ghui-window` 스코프 변수 재정의가 필요한데, 이를 사이트 공용 `components.css`에 넣으면 양방향 오염 위험이 커진다(REQ-002, REQ-003). (b) 전 페이지가 아니라 GitHub 화면을 다루는 페이지에서만 로드하면 나머지 25개 페이지의 로드를 늘리지 않는다. (c) IMPL-001의 5-CSS 계약은 "사이트 공유 셸"에 대한 것이고, mock UI는 특정 트랙 전용 자산이므로 별도 파일이 계약을 위반하지 않는다.

### 6.2 스코프드 변수 재정의 (`.ghui-window` 스코프)

**결정**: GitHub Primer 계열 변수(`--ghui-canvas`, `--ghui-border`, `--ghui-accent` 등)를 `:root`가 아닌 `.ghui-window` 셀렉터 스코프 안에서만 정의한다.

**근거**: 사이트 크림톤(`--bg-base:#FFFBF5`)과 GitHub 회색톤을 `:root`에서 섞으면 어느 한쪽이 반드시 깨진다. 스코프드 재정의로 "mock 창 안은 GitHub 톤, 창 밖은 사이트 톤"을 물리적으로 보장한다. 이것이 REQ-002·REQ-003 양방향 오염 금지의 구현 근간이다.

### 6.3 데이터 주도 핀·범례 (aria-describedby 결속)

**결정**: 핀 번호(`data-ghui-pin`)와 범례 항목(`data-ghui-legend`)을 값으로 매칭하고, `aria-describedby`로 접근성 연결한다. 핀 텍스트·범례 내용은 각 페이지 HTML이 소유하고 `gh-ui.js`는 매칭·하이라이트 로직만 제공한다.

**근거**: 핀 내용은 페이지마다 다르므로(P02 사이드바 9항목 vs P04 merge box 등) JS에 하드코딩하면 재사용이 불가능하다. 데이터 훅으로 결속하면 IMPL-010의 8개 페이지가 같은 엔진을 공유하되 각기 다른 핀·범례를 얹을 수 있다.

### 6.4 pr-flow.js 패턴 상속 (신규 프레임워크 배격)

**결정**: `gh-ui.js`는 IMPL-006 `js/pr-flow.js`의 IIFE·`'use strict'`·`data-asset` 진입·`REDUCED = matchMedia(...)` 패턴을 그대로 따른다. 별도 상태관리 라이브러리·번들러를 도입하지 않는다.

**근거**: 빌드 없는 정적 사이트 원칙(REQ-019)과 npm 의존성이 충돌한다. 5종 인터랙션은 모두 단순 선형·토글 수준이라 범용 상태머신 라이브러리가 과잉이다. 기존 자산과 동일 패턴이면 유지보수 인지 부하도 낮다.

---

## 7. 의존성 (Dependencies)

- **SPEC-GIT-GITHUB-IMPL-001 (P1)**: 공유 셸(5 CSS + 3 JS), `tokens.css`의 시리즈 변수 관습, `prefers-reduced-motion` 패턴, WCAG AA 대비 기준을 상속. `gh-ui.css`는 이 셸 위에 6번째 파일로 얹힌다.
- **SPEC-GIT-GITHUB-IMPL-006 (P6)**: `js/pr-flow.js`가 `gh-ui.js`의 코드 패턴 원천(IIFE, `'use strict'`, `data-asset` 진입, reduced-motion 존중). 본 SPEC은 이 패턴을 상속한다.
- **SPEC-GIT-GITHUB-IMPL-010 (P10)**(하류 소비자): P 트랙 8개 페이지가 본 시스템의 컴포넌트·인터랙션을 소비한다. 본 SPEC은 IMPL-010보다 먼저 실행되어야 한다(IMPL-010은 IMPL-009에 의존).
- **SPEC-GIT-GITHUB-IMPL-012 (P12)**(하류 소비자): 기존 T16/T17/T23 보강 시 본 시스템의 mock UI를 재사용한다.
- **SPEC-GIT-GITHUB-GUIDE-001 기획 산출물**(입력): 시리즈 결속·오디언스 계약·디자인 원칙의 상위 근거.

---

## 8. 리스크 (Risks)

| 리스크 | 영향 | 완화 |
|---|---|---|
| `.ghui-` 격리 누수 (사이트 톤 오염 또는 역방향) | 크림톤/회색톤 상호 파손 | `.ghui-window` 스코프 변수 재정의(결정 6.2)로 물리적 격리. REQ-002·REQ-003을 독립 수용 기준으로 검증(창 안/밖 렌더링 diff). |
| `gh-diff` 배치 리뷰 복잡도 | 구현 지연, 인터랙션 버그 | `gh-diff`를 우선순위 High로 먼저 완성하고 P02 한 장으로 조기 검증. 나머지 4종 인터랙션은 단순 토글·전환이라 분리 납품 가능. |
| 핀·범례 매칭 어긋남 | 잘못된 설명이 잘못된 지점에 결속 | `data-ghui-pin`/`data-ghui-legend` 값 일치 + `aria-describedby` 참조를 REQ-006·REQ-007로 강제. run 단계에서 페이지별 값 정합 검증. |
| mock UI JS·CSS로 페이지 로드 증가 | 성능 저하 | `gh-ui.css`/`gh-ui.js`는 GitHub 화면을 다루는 페이지에서만 로드(결정 6.1). 나머지 페이지 로드 불변. Lighthouse 검증은 후속 QA. |
| 768px 이하에서 넓은 mock UI 잘림 | 모바일 가독성 저하 | REQ-018로 2단 접힘 + 가로 스크롤 처리 명시. run 단계에서 실제 뷰포트 검증. |

---

## 9. 관련 산출물 (Related)

- SPEC-GIT-GITHUB-IMPL-001 (P1): 공유 셸·디자인 시스템·토큰 관습. 본 SPEC의 셸 상속 원천.
- SPEC-GIT-GITHUB-IMPL-006 (P6): `js/pr-flow.js` 등 7개 인터랙티브 자산. `gh-ui.js` 코드 패턴 원천.
- SPEC-GIT-GITHUB-IMPL-010 (P10): 실전 협업 트랙 P01~P08. 본 시스템의 1차 소비자.
- SPEC-GIT-GITHUB-IMPL-011 (P11): 사이트 통합(네비·검색·도어).
- SPEC-GIT-GITHUB-IMPL-012 (P12): 기존 개념 페이지 보강. 본 시스템 mock UI 재사용.
- SPEC-GIT-GITHUB-GUIDE-001: 기획 산출물군(오디언스 계약, 디자인 원칙, 시리즈 결속).
- 승인 계획서: `.moai/plans/git-github-synchronous-hummingbird.md` "아키텍처: mock UI 시스템" 절 — 본 SPEC의 1차 입력.

---

## HISTORY

- 2026-07-10 (v1.3.0): REQ-018 미충족 정정 + 핀 반응형 결함 수정. **아래 v1.2.0 직전 항목의 "375px에서 body 가로 스크롤 없음"은 사실이 아니었다** — 실제 브라우저 실측 결과 `practice/` 8개 전부 위반이었고(`issue-anatomy` 474px, `projects-ops` 1064px), `tutorial/` 등 기존 페이지도 마찬가지였다. 원인은 `css/layout.css`의 `.layout__main`으로, 그리드 아이템이 `min-width:0`만으로는 트랙(375px 뷰포트에서 327px)에 고정되지 않고 콘텐츠 최소 너비까지 늘어나, 그 안의 `overflow-x:auto` 컨테이너(`.code-block`·`.ghui-diff__scroll`·`.ghui-board__scroll`)를 무력화시켰다. `width:100%` 추가로 해소. 잔여 4개 페이지는 `css/components.css` 파일 끝에 모바일 전용 `@media` 블록을 추가해 처리(`.cmd-pill`/`.cheat-card__cmd` 줄바꿈 허용, `.glossary` `overflow-wrap`, `.comparison-table` `table-layout:fixed`) — 이 블록은 각 컴포넌트 기본 규칙보다 뒤에 와야 동일 특이도에서 `white-space`를 덮는다. 또한 768px 이하에서 `.ghui-sidebar`가 row/wrap으로 재배치될 때 항목에 앵커된 핀이 `.ghui-window`의 `overflow:hidden`에 잘리고(9개 중 4개만 창 안) 우측 열 핀이 좌측 열 기어 아이콘을 덮던 문제를 `padding-left:16px` + 열 간격 32px(핀 지름 24px 초과)로 수정. 검증: 40개 페이지 × 375/768/1280px 전부 통과, 핀 9/9 창 안·겹침 0. 수용 기준 변경 없음(REQ-018은 원래부터 이를 요구했다).
- 2026-07-10: split/unified 모드 토글 컨트롤 제거 (v1.2.0). `Unified`/`Split` 버튼은 대응 CSS가 없어 눌러도 화면이 바뀌지 않았고(`data-gh-diff-mode` 속성만 토글), 독자에게 거짓 신호를 줬다. 진짜 좌우 분할은 `.ghui-diff__row`의 `44px 44px 1fr` 그리드를 old/new 셀 분리형으로 재설계해야 가능하므로 범위 밖이다. 따라서 `css/gh-ui.css`의 `.ghui-diff__modes`/`.ghui-diff__mode` 규칙, `js/gh-ui.js`의 `modeBtns` 블록, 소비 페이지의 모드 버튼과 `data-gh-diff-mode` 속성을 모두 삭제했다. mock은 통합 보기(unified)만 렌더링하며, Unified/Split 개념은 P05(`practice/pr-review.html`) 산문과 기어(⚙) 메뉴 안내로만 유지한다. `.ghui-diff__toolbar`·`Review changes` 버튼·배치 리뷰(REQ-010)는 그대로다. 어떤 REQ도 모드 컨트롤을 요구하지 않았으므로 수용 기준 변경 없음.
- 2026-07-10: Run 완료. `css/gh-ui.css`(849줄, 9종 컴포넌트) + `js/gh-ui.js`(566줄, 5종 `data-asset`) 납품. REQ-001~020 전부 충족, 브라우저 실측 검증(콘솔 에러 0). 양방향 격리 확인 — 창 안 `p`=`#1f2328`·링크=`#0969da`, 창 밖 본문 `p`=`#2D2A26`·side-note 크림톤 유지. base.css의 태그 셀렉터 7종(`p`/`h1~h6`/`ul,ol`/`a`/`code,pre`/`img,svg`/`:focus-visible`)이 `.ghui-window` 내부를 오염시키던 것을 스코프 재정의로 무력화(REQ-002). `!important`는 reduced-motion 블록 2줄에 한정. 배치 리뷰(REQ-010) 전이 실측: `+` → `Start a review` → pending 1 → `Add review comment` → `Submit review` → pending 0·제출됨 1. 반응형(REQ-018) 375px에서 이슈 2단→1단, body 가로 스크롤 없음.
  - 검증 중 발견한 결함 1건 수정: mergebox 체크를 실패로 토글해도 라벨의 "통과" 글자가 남아 화면과 상태가 어긋났다. `[data-gh-check-state]`(상태 낱말 갱신)와 `[data-gh-check-name]`(aria-live가 읽을 순수 검사명) 훅을 추가해 해소. IMPL-010의 mergebox 마크업은 이 두 훅을 사용해야 한다.
  - 알려진 한계: 핀 좌표의 실제 지점 정합은 IMPL-010 범위. (split/unified 모드 컨트롤은 2026-07-10에 제거됨 — 아래 최신 HISTORY 항목 참조.)
- 2026-07-10: 최초 작성. 승인 계획서의 "아키텍처: mock UI 시스템" 절을 구현 단계로 정식화. `css/gh-ui.css`(9종 컴포넌트, `.ghui-` 격리) + `js/gh-ui.js`(5종 `data-asset` 인터랙션) 산출물 정의. 핀 어노테이션을 "따라할 수 있게" 만드는 핵심 장치로 배경에 명시. 20개 EARS 수용 기준(REQ-001~REQ-020) 확정. 양방향 오염 금지(REQ-002/003), 배치 리뷰 흐름(REQ-010), 재현 화면 고지(REQ-016), 반응형 접힘(REQ-018)을 정식화. WHAT/WHY에 집중하고 HOW(CSS 좌표·DOM 트리·easing·hex)는 run 단계로 연기. IMPL-001 셸·IMPL-006 JS 패턴 상속, IMPL-010/011/012 하류 의존 명시.

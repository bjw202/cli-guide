---
id: SPEC-GIT-GITHUB-IMPL-012
version: 1.0.0
status: Draft
created: 2026-07-10
updated: 2026-07-10
author: jw
priority: Medium
lifecycle: spec-anchored
related:
  - SPEC-GIT-GITHUB-GUIDE-001
  - SPEC-GIT-GITHUB-IMPL-001
  - SPEC-GIT-GITHUB-IMPL-006
  - SPEC-GIT-GITHUB-IMPL-009
  - SPEC-GIT-GITHUB-IMPL-010
  - SPEC-GIT-GITHUB-IMPL-011
---

# SPEC — P12: 기존 개념 페이지 보강 (T16 · T17 · T23 · 용어집)

> 본 SPEC은 승인된 계획서 `git-github-synchronous-hummingbird.md`의 "기존 개념 페이지 보강" 절을 구현 단계로 정식화한 것이다.
> 청중: 본 사이트를 구현하는 개발자. WHAT/WHY(어떤 T 페이지에 어떤 mock UI 맛보기와 P 트랙 링크를 얹는가)에 집중하고 HOW(삽입 위치·마크업)는 run 단계로 연기한다.
> mock UI 시스템은 IMPL-009가, P 트랙 페이지는 IMPL-010이 권위 있게 정의하며 본 SPEC은 이를 소비·연결한다.

---

## 1. 목표 (Goal)

기존 개념 튜토리얼(T16 Issue·PR, T17 코드 리뷰, T23 Projects)과 용어집(R02)을 보강하여, 개념 층(T 트랙)과 실전 층(P 트랙)을 연결한다. T 페이지에는 mock UI **맛보기 1장**과 대응 P 트랙 링크를 얹고, 용어집에는 실전 트랙이 참조할 신규 용어 항목을 추가한다.

본 Phase가 끝나면 개념을 읽던 독자가 "화면을 직접 보려면 P02/P04/P05/P06으로"라는 다리를 건너 실전 트랙으로 자연스럽게 이동할 수 있고, P 트랙은 신규 용어를 `data-term` 툴팁으로 재사용할 수 있다.

---

## 2. 배경 (Background)

기존 T16/T17/T23은 GitHub 협업 개념을 산문과 `comparison-table`로만 설명한다(현 상태는 IMPL-003 산출물). 실전 트랙 P01~P08(IMPL-010)이 신설되면, 개념 페이지에서 실전 페이지로 넘어가는 진입 다리가 필요하다. 계획서는 각 T 페이지에 mock UI 맛보기 1장을 삽입하고 대응 P 트랙으로 링크할 것을 요구한다:

- **T16**(`github-issues-pr.html`): Issue mock UI 1장 + PR mock UI 1장, P02/P04 링크. Milestone 설명이 현재 한 줄뿐이므로 P07 링크 추가.
- **T17**(`github-review.html`): diff mock UI 1장, P05 링크.
- **T23**(`github-projects.html`): 칸반 보드 mock UI(현재 산문+표뿐), P06 링크.

또한 용어집 `ref/glossary.html`에 `sub-issue`, `issue type`, `merge queue`, `ruleset`, `suggested change` 5개 항목을 추가한다. `js/glossary-tooltip.js`(IMPL-006)가 이 앵커를 참조하므로, 추가되면 P 트랙에서 이 용어를 `data-term`으로 쓸 수 있게 된다.

**개념/실전 층위 분리 원칙이 본 SPEC의 설계 근간이다.** T 트랙은 "무엇인가(비유)", P 트랙은 "어디를 누르는가(화면)"를 담당한다. 따라서 T 페이지는 mock UI를 **맛보기 1장**만 두고 깊이(사이드바 9항목 해부, 배치 리뷰 흐름 등)는 P 트랙으로 넘긴다 — 중복 서술을 방지한다.

**WHAT vs HOW 경계**: 본 SPEC은 어떤 T 페이지에 어떤 mock UI 맛보기와 어떤 P 링크를 얹고, 용어집에 어떤 항목을 추가하는지를 정의한다. 삽입 위치·마크업·용어 정의 문구는 run 단계로 연기한다. mock UI 컴포넌트·`data-asset` 훅은 IMPL-009 소관이다.

---

## 3. 산출물 (Deliverables)

본 SPEC은 신규 파일이 아닌 **기존 파일 보강**이 산출물이다.

### 3.1 `tutorial/github-issues-pr.html` (T16)

- Issue mock UI 1장 + PR mock UI 1장 삽입(IMPL-009 `.ghui-` 컴포넌트 사용).
- "화면을 직접 보려면 P02/P04로" 링크.
- Milestone 설명(현재 한 줄)에 P07 링크 추가.

### 3.2 `tutorial/github-review.html` (T17)

- diff mock UI 1장 삽입.
- P05 링크.

### 3.3 `tutorial/github-projects.html` (T23)

- 칸반 보드 mock UI 삽입(현재 산문+표뿐).
- P06 링크.

### 3.4 `ref/glossary.html` (R02)

- 신규 용어 5항목 추가: `sub-issue`, `issue type`, `merge queue`, `ruleset`, `suggested change`.
- 각 항목은 `js/glossary-tooltip.js`가 참조할 수 있는 앵커를 가진다(P 트랙에서 `data-term`으로 사용 가능).

---

## 4. 수용 기준 (Acceptance Criteria, EARS)

> 키워드(UBIQUITOUS, WHEN, WHILE, IF, THEN, WHERE, SHALL)는 영어로 유지. 본문은 한국어.

- **REQ-001 (T16 mock UI 맛보기 + P 링크)**: WHEN 독자가 T16(`github-issues-pr.html`)을 열면, THEN Issue mock UI 1장과 PR mock UI 1장이 삽입되어 있고 각각 P02·P04로 이동하는 링크가 표시 SHALL.

- **REQ-002 (T16 Milestone → P07 링크)**: T16의 Milestone 설명(현재 한 줄)에 P07(`practice/milestone-release.html`)로 이동하는 링크가 추가 SHALL.

- **REQ-003 (T17 diff 맛보기 + P05 링크)**: WHEN 독자가 T17(`github-review.html`)을 열면, THEN diff mock UI 1장이 삽입되어 있고 P05(`practice/pr-review.html`)로 이동하는 링크가 표시 SHALL.

- **REQ-004 (T23 보드 맛보기 + P06 링크)**: WHEN 독자가 T23(`github-projects.html`)을 열면, THEN 칸반 보드 mock UI가 삽입되어 있고 P06(`practice/projects-ops.html`)로 이동하는 링크가 표시 SHALL.

- **REQ-005 (용어집 5항목 추가)**: WHEN 독자가 `ref/glossary.html`을 열면, THEN `sub-issue`, `issue type`, `merge queue`, `ruleset`, `suggested change` 5개 용어 항목이 정의와 함께 존재 SHALL.

- **REQ-006 (glossary 앵커 `data-term` 연동)**: WHEN P 트랙 페이지의 용어 요소가 신규 5개 용어를 `data-term`으로 참조하면, THEN `js/glossary-tooltip.js`가 `ref/glossary.html`에 추가된 해당 용어 정의를 툴팁으로 표시 SHALL.

- **REQ-007 (mock UI 재사용)**: UBIQUITOUS — T16/T17/T23에 삽입되는 모든 mock UI는 IMPL-009의 `.ghui-` 컴포넌트 시스템으로 렌더링 SHALL. 새 mock UI 스타일을 정의하지 SHALL NOT.

- **REQ-008 (개념/실전 층위 분리)**: UBIQUITOUS — T16/T17/T23에는 mock UI를 "맛보기" 1장(T16은 Issue·PR 각 1장)만 두고, 상세 클릭 경로·화면 해부는 P 트랙으로 링크하여 위임 SHALL. T 페이지에서 P 트랙의 상세를 중복 서술하지 SHALL NOT.

- **REQ-009 (기존 콘텐츠 보존 — 스코프 규율)**: UBIQUITOUS — 본 SPEC은 명시된 보강 지점(mock UI 삽입, P 링크 추가, 용어 5항목)만 수정 SHALL. 대상 외 기존 본문·자산·기존 용어 항목은 변경하지 SHALL NOT.

- **REQ-010 (빌드 없음)**: UBIQUITOUS — 모든 보강은 빌드 단계 없이 `file://` 프로토콜에서 직접 동작 SHALL. (Node/npm/bundler 및 외부 라이브러리 의존성 없음.)

- **REQ-011 (tmux 원본 무결성)**: UBIQUITOUS — 본 SPEC의 어떤 수정도 `tmux/` 디렉토리의 원본 파일을 변경하지 SHALL NOT.

---

## 5. 범위 외 (Out of Scope)

명시적으로 본 SPEC(P12) 범위에서 제외되는 항목.

- mock UI 컴포넌트·인터랙션(`css/gh-ui.css`, `js/gh-ui.js`) 정의 → **P9 (IMPL-009)**. P12는 이를 소비만 한다.
- P 트랙 8개 페이지 본문 → **P10 (IMPL-010)**. P12는 T 페이지에서 P 트랙으로 링크만 건다.
- 27개 HTML 네비게이션 `실전` 드롭다운, `index.html` 도어·검색 인덱스 → **P11 (IMPL-011)**.
- `cases/index.html`에 P 트랙 연계 사례 추가 → **명시적 범위 외**(계획서 확정: 이번엔 건드리지 않음).
- T16/T17/T23 외 다른 튜토리얼 페이지 보강 → 범위 밖(3개 페이지 + 용어집만).
- 신규 용어 5항목의 상세 정의 문구, mock UI 삽입 위치·마크업 → **run 단계** (WHAT이 아닌 HOW).
- `tmux/` 원본 파일의 어떠한 수정 (REQ-011 위반).

---

## 6. 아키텍처 결정 (Architecture Decisions)

### 6.1 개념/실전 층위 분리 (맛보기 1장 원칙)

**결정**: T 트랙은 "무엇인가(비유·개념)"에 집중하고, "어디를 누르는가(화면·클릭 경로)"는 P 트랙에 위임한다. T16/T17/T23에는 mock UI를 맛보기 1장(T16은 Issue·PR 각 1장)만 두고, 깊이 있는 화면 해부는 대응 P 페이지로 링크한다.

**근거**: T 페이지에서 사이드바 9항목·배치 리뷰 흐름을 전부 재현하면 P 트랙과 중복되어 유지보수 지점이 이중화된다(같은 내용을 두 곳에서 고쳐야 함). 층위를 분리하면 T는 개념, P는 실전으로 각자 단일 책임을 지고, 독자는 "개념 → 맛보기 → 실전"의 자연스러운 경로를 밟는다. 이는 IMPL-010 결정 6.4(P 트랙 측 층위 분리)와 대칭을 이룬다.

### 6.2 용어집 앵커를 통한 툴팁 재사용 (데이터 단일 소스)

**결정**: 신규 용어 5항목을 `ref/glossary.html`에 추가하고, P 트랙은 이를 `data-term`으로 참조해 `glossary-tooltip.js`(IMPL-006)로 툴팁을 띄운다. 용어 정의를 P 트랙에 별도로 복제하지 않는다.

**근거**: 용어 정의가 용어집과 P 트랙 두 곳에 존재하면 불일치가 생긴다. `glossary-tooltip.js`가 이미 용어집 앵커를 참조하는 구조이므로, 용어집을 단일 소스로 두고 P 트랙이 소비만 하면 정의가 한 곳에서 관리된다. 이것이 REQ-006의 근간이다.

---

## 7. 의존성 (Dependencies)

- **SPEC-GIT-GITHUB-IMPL-009 (P9)**(선행, 강한 의존): T 페이지에 삽입할 mock UI(`.ghui-` 컴포넌트)가 먼저 존재해야 한다(REQ-007). IMPL-009 완료 후 본 SPEC이 이를 재사용한다.
- **SPEC-GIT-GITHUB-IMPL-010 (P10)**(선행, 강한 의존): 링크 대상 P02/P04/P05/P06/P07 페이지가 먼저 존재해야 한다. IMPL-010 완료 후 본 SPEC이 T 페이지에서 이를 링크한다.
- **SPEC-GIT-GITHUB-IMPL-006 (P6)**: `js/glossary-tooltip.js`가 용어집 앵커를 참조하는 구조. 신규 용어 5항목이 이 메커니즘으로 P 트랙에서 툴팁으로 재사용된다(REQ-006).
- **SPEC-GIT-GITHUB-IMPL-001 (P1)**: T16/T17/T23의 튜토리얼 골격, side-note 6종, `ref/glossary.html` 구조. 보강 대상의 원천.
- **SPEC-GIT-GITHUB-IMPL-011 (P11)**(느슨한 결합): 사이트 통합. 본 SPEC의 T→P 링크는 네비게이션 통합과 독립적으로 동작하나, 둘 다 P 트랙 도달성을 높인다.
- **SPEC-GIT-GITHUB-GUIDE-001 기획 산출물**(입력): 개념/실전 층위 분리 원칙, 오디언스 계약.

---

## 8. 리스크 (Risks)

| 리스크 | 영향 | 완화 |
|---|---|---|
| T 페이지가 P 트랙 내용을 과도하게 재현(층위 혼선) | 중복 서술, 유지보수 이중화 | REQ-008로 "맛보기 1장" 원칙을 강제(결정 6.1). 상세는 링크로 위임. run 단계에서 T/P 서술 중복 여부 점검. |
| 신규 용어 앵커와 `glossary-tooltip.js` 참조 형식 불일치 | P 트랙 툴팁 공백 | REQ-006으로 `data-term` 연동을 검증. run 단계에서 기존 용어 앵커 형식을 그대로 따르는지 확인. |
| P 트랙 미완성 시 T→P 링크가 깨짐 | 404, 진입 다리 단절 | IMPL-010 선행 의존 명시. IMPL-010 완료 후 본 SPEC 실행. |
| 보강 중 기존 T 페이지 콘텐츠 훼손 | 개념 설명 회귀 | REQ-009 스코프 규율로 보강 지점 외 불변 강제. run 단계에서 diff 최소성 검증. |

---

## 9. 관련 산출물 (Related)

- SPEC-GIT-GITHUB-IMPL-009 (P9): mock UI 기반 시스템. T 페이지 삽입 mock UI의 원천.
- SPEC-GIT-GITHUB-IMPL-010 (P10): 실전 협업 트랙 P01~P08. T→P 링크의 대상.
- SPEC-GIT-GITHUB-IMPL-006 (P6): `glossary-tooltip.js`. 신규 용어 툴팁 재사용 메커니즘.
- SPEC-GIT-GITHUB-IMPL-001 (P1): 튜토리얼 골격·용어집 구조. 보강 대상의 원천.
- SPEC-GIT-GITHUB-IMPL-011 (P11): 사이트 통합(느슨한 결합).
- SPEC-GIT-GITHUB-GUIDE-001: 기획 산출물군(층위 분리 원칙, 오디언스 계약).
- 승인 계획서: `.moai/plans/git-github-synchronous-hummingbird.md` "기존 개념 페이지 보강" 절 — 본 SPEC의 1차 입력.

---

## HISTORY

- 2026-07-10: 최초 작성. 승인 계획서의 "기존 개념 페이지 보강" 절을 구현 단계로 정식화. T16(Issue·PR mock UI 맛보기 + P02/P04/P07 링크), T17(diff mock UI + P05 링크), T23(칸반 보드 mock UI + P06 링크), `ref/glossary.html`(sub-issue·issue type·merge queue·ruleset·suggested change 5항목 추가)을 산출물로 정의. 개념/실전 층위 분리(결정 6.1, "맛보기 1장" 원칙)와 용어집 앵커 툴팁 재사용(결정 6.2, 데이터 단일 소스)을 아키텍처 결정으로 명문화. `cases/index.html` 사례 추가는 명시적 범위 외. 11개 EARS 수용 기준(REQ-001~REQ-011) 확정. WHAT/WHY에 집중하고 HOW(삽입 위치·마크업·용어 정의 문구)는 run 단계로 연기. IMPL-009·IMPL-010 강한 의존, IMPL-006 툴팁 메커니즘, IMPL-001 골격 의존 명시.

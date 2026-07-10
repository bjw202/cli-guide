---
id: SPEC-GIT-GITHUB-IMPL-012
version: 1.2.0
status: Implemented
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

또한 용어집 `ref/glossary.html`에 `sub-issue`, `issue type`, `merge queue`, `ruleset`, `suggested change` 5개 항목을 추가한다. 단, `js/glossary-tooltip.js`(IMPL-006)는 이 정의를 **런타임에 fetch하지 않고 인라인 `GLOSSARY` 맵으로 미러링**한다(`file://`에서 CORS로 fetch 불가 — 파일 헤더 주석이 명시). 따라서 P 트랙에서 `data-term`으로 재사용하려면 R02와 인라인 맵 **두 곳 모두**에 5개 항목을 추가해야 한다(REQ-006).

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
- 각 항목은 `article.glossary__item`으로 `id` 앵커(`.glossary__term`·`.glossary__metaphor`·`.glossary__def` 포함)를 가진다(P 트랙에서 `data-term`으로 사용 가능).

### 3.5 `js/glossary-tooltip.js` (IMPL-006 인라인 미러 갱신)

- 인라인 `GLOSSARY` 객체에 R02와 **동일한 5개 키**를 추가한다. 키는 R02 항목의 `id` 앵커 슬러그와 1:1로 일치한다(예: `sub-issue`, `issue-type`, `merge-queue`, `ruleset`, `suggested-change`). 각 키는 `term`·`metaphor` 필드를 가지며, `term`은 R02 `.glossary__term`, `metaphor`는 R02 대응 항목의 `.glossary__metaphor` 본문과 일치한다(기존 엔트리 관례대로 앞의 "비유 — " 도입부는 제외).
- **이는 fetch가 아니라 수기 미러다.** `glossary-tooltip.js` 헤더 주석("file://에서 fetch 불가(CORS)하므로 인라인 임베드")대로, `file://`에서 `ref/glossary.html`을 런타임 fetch할 수 없어 데이터를 인라인 임베드한다. R02에만 5항목을 추가하고 인라인 맵을 갱신하지 않으면 `GLOSSARY[key]`가 `undefined`가 되어 `show()`가 조기 반환(툴팁 미표시)한다.
- 따라서 R02(§3.4)와 본 인라인 맵은 **항상 동기화**되어야 한다(REQ-006, REQ-012). 빌드 단계가 없으므로 동기화는 수기로 이뤄진다.

---

## 4. 수용 기준 (Acceptance Criteria, EARS)

> 키워드(UBIQUITOUS, WHEN, WHILE, IF, THEN, WHERE, SHALL)는 영어로 유지. 본문은 한국어.

- **REQ-001 (T16 mock UI 맛보기 + P 링크)**: WHEN 독자가 T16(`github-issues-pr.html`)을 열면, THEN Issue mock UI 1장과 PR mock UI 1장이 삽입되어 있고 각각 P02·P04로 이동하는 링크가 표시 SHALL.

- **REQ-002 (T16 Milestone → P07 링크)**: T16의 Milestone 설명(현재 한 줄)에 P07(`practice/milestone-release.html`)로 이동하는 링크가 추가 SHALL.

- **REQ-003 (T17 diff 맛보기 + P05 링크)**: WHEN 독자가 T17(`github-review.html`)을 열면, THEN diff mock UI 1장이 삽입되어 있고 P05(`practice/pr-review.html`)로 이동하는 링크가 표시 SHALL.

- **REQ-004 (T23 보드 맛보기 + P06 링크)**: WHEN 독자가 T23(`github-projects.html`)을 열면, THEN 칸반 보드 mock UI가 삽입되어 있고 P06(`practice/projects-ops.html`)로 이동하는 링크가 표시 SHALL.

- **REQ-005 (용어집 5항목 추가)**: WHEN 독자가 `ref/glossary.html`을 열면, THEN `sub-issue`, `issue type`, `merge queue`, `ruleset`, `suggested change` 5개 용어 항목이 정의와 함께 존재 SHALL.

- **REQ-006 (glossary 5항목 미러 일치 — R02 ↔ 인라인 맵)**: WHEN 신규 5개 용어(`sub-issue`, `issue type`, `merge queue`, `ruleset`, `suggested change`)가 도입되면, THEN (a) 5개 항목이 `ref/glossary.html`에 정의와 `id` 앵커를 갖고 존재하고, AND (b) `js/glossary-tooltip.js`의 인라인 `GLOSSARY` 객체에 R02 `id`와 1:1로 일치하는 동일 5개 키가 `term`·`metaphor` 필드와 함께 존재하며, 각 `metaphor`는 대응 R02 항목의 `.glossary__metaphor` 본문과 일치(기존 엔트리 관례상 앞의 "비유 — " 도입부는 제외) SHALL. `js/glossary-tooltip.js`는 R02를 런타임에 fetch하지 않고 인라인 맵만 읽으므로, (b)가 누락되면 `GLOSSARY[key]`가 `undefined`가 되어 P 트랙 툴팁이 표시되지 SHALL NOT.

- **REQ-007 (mock UI 재사용)**: UBIQUITOUS — T16/T17/T23에 삽입되는 모든 mock UI는 IMPL-009의 `.ghui-` 컴포넌트 시스템으로 렌더링 SHALL. 새 mock UI 스타일을 정의하지 SHALL NOT.

- **REQ-008 (개념/실전 층위 분리)**: UBIQUITOUS — T16/T17/T23에는 mock UI를 "맛보기" 1장(T16은 Issue·PR 각 1장)만 두고, 상세 클릭 경로·화면 해부는 P 트랙으로 링크하여 위임 SHALL. T 페이지에서 P 트랙의 상세를 중복 서술하지 SHALL NOT.

- **REQ-009 (기존 콘텐츠 보존 — 스코프 규율)**: UBIQUITOUS — 본 SPEC은 명시된 보강 지점(mock UI 삽입, P 링크 추가, 용어 5항목)만 수정 SHALL. 대상 외 기존 본문·자산·기존 용어 항목은 변경하지 SHALL NOT.

- **REQ-010 (빌드 없음)**: UBIQUITOUS — 모든 보강은 빌드 단계 없이 `file://` 프로토콜에서 직접 동작 SHALL. (Node/npm/bundler 및 외부 라이브러리 의존성 없음.)

- **REQ-011 (tmux 원본 무결성)**: UBIQUITOUS — 본 SPEC의 어떤 수정도 `tmux/` 디렉토리의 원본 파일을 변경하지 SHALL NOT.

- **REQ-012 (미러 동기화 불변식 — R02 ↔ 인라인 맵)**: UBIQUITOUS — R02(`ref/glossary.html`)의 용어 항목과 `js/glossary-tooltip.js`의 인라인 `GLOSSARY` 항목은 언제나 동기화 상태를 유지 SHALL. R02의 용어를 추가·수정·삭제하면 인라인 맵에 동일하게 반영하고, 그 역도 성립 SHALL. 빌드 단계도 런타임 fetch도 없으므로(그 부재가 이 중복의 존재 이유다) 어느 한쪽만 변경하지 SHALL NOT.

---

## 5. 범위 외 (Out of Scope)

명시적으로 본 SPEC(P12) 범위에서 제외되는 항목.

- mock UI 컴포넌트·인터랙션(`css/gh-ui.css`, `js/gh-ui.js`) 정의 → **P9 (IMPL-009)**. P12는 이를 소비만 한다.
- P 트랙 8개 페이지 본문 → **P10 (IMPL-010)**. P12는 T 페이지에서 P 트랙으로 링크만 건다.
- 27개 HTML 네비게이션 `실전` 드롭다운, `index.html` 도어·검색 인덱스 → **P11 (IMPL-011)**.
- `cases/index.html`에 P 트랙 연계 사례 추가 → **명시적 범위 외**(계획서 확정: 이번엔 건드리지 않음).
- T16/T17/T23 외 다른 튜토리얼 페이지 보강 → 범위 밖(3개 페이지 + 용어집만).
- 신규 용어 5항목의 상세 정의 문구, mock UI 삽입 위치·마크업 → **run 단계** (WHAT이 아닌 HOW).
- 본 SPEC이 편집하는 네 파일의 **네비게이션 헤더** 수정 → **P11 (IMPL-011)** 소관 (범위 밖).
- `tmux/` 원본 파일의 어떠한 수정 (REQ-011 위반).

**IMPL-011과의 파일 동시 편집 금지**: IMPL-011(P11)은 본 SPEC이 편집하는 네 파일 — T16 `tutorial/github-issues-pr.html`, T17 `tutorial/github-review.html`, T23 `tutorial/github-projects.html`, R02 `ref/glossary.html` — 의 **네비게이션 헤더**를 소관한다. 두 SPEC은 이 네 파일에서 **동시에 실행하지 SHALL NOT**. 실행 순서: **IMPL-012가 먼저**(mock UI 맛보기·P 링크·용어 5항목·인라인 미러) 완료된 뒤, **IMPL-011의 기계적 네비게이션 일괄 수정(nav sweep)이 뒤따른다**.

---

## 6. 아키텍처 결정 (Architecture Decisions)

### 6.1 개념/실전 층위 분리 (맛보기 1장 원칙)

**결정**: T 트랙은 "무엇인가(비유·개념)"에 집중하고, "어디를 누르는가(화면·클릭 경로)"는 P 트랙에 위임한다. T16/T17/T23에는 mock UI를 맛보기 1장(T16은 Issue·PR 각 1장)만 두고, 깊이 있는 화면 해부는 대응 P 페이지로 링크한다.

**근거**: T 페이지에서 사이드바 9항목·배치 리뷰 흐름을 전부 재현하면 P 트랙과 중복되어 유지보수 지점이 이중화된다(같은 내용을 두 곳에서 고쳐야 함). 층위를 분리하면 T는 개념, P는 실전으로 각자 단일 책임을 지고, 독자는 "개념 → 맛보기 → 실전"의 자연스러운 경로를 밟는다. 이는 IMPL-010 결정 6.4(P 트랙 측 층위 분리)와 대칭을 이룬다.

### 6.2 용어집 앵커를 통한 툴팁 재사용 (데이터 단일 소스)

**결정**: 신규 용어 5항목을 `ref/glossary.html`(사람이 읽는 단일 소스)에 추가하고, 동일 5항목을 `js/glossary-tooltip.js`의 인라인 `GLOSSARY` 맵에도 미러링한다. P 트랙은 이를 `data-term`으로 참조해 툴팁을 띄우며, 용어 정의를 P 트랙에 별도로 복제하지 않는다.

**근거**: `glossary-tooltip.js`는 `file://`에서 CORS로 `ref/glossary.html`을 런타임 fetch할 수 없어(파일 헤더 주석 명시) 용어 데이터를 인라인 임베드한다. 즉 정의의 권위 있는 단일 소스는 R02이고, 인라인 맵은 그 **수기 미러**다. P 트랙이 정의를 복제하지 않게 하는 대신, R02와 인라인 맵 두 곳은 반드시 동기화되어야 한다. 이 이중화는 빌드 단계도 런타임 fetch도 없다는 제약의 산물이며, 이것이 REQ-006·REQ-012의 근간이다.

---

## 7. 의존성 (Dependencies)

- **SPEC-GIT-GITHUB-IMPL-009 (P9)**(선행, 강한 의존): T 페이지에 삽입할 mock UI(`.ghui-` 컴포넌트)가 먼저 존재해야 한다(REQ-007). IMPL-009 완료 후 본 SPEC이 이를 재사용한다.
- **SPEC-GIT-GITHUB-IMPL-010 (P10)**(선행, 강한 의존): 링크 대상 P02/P04/P05/P06/P07 페이지가 먼저 존재해야 한다. IMPL-010 완료 후 본 SPEC이 T 페이지에서 이를 링크한다.
- **SPEC-GIT-GITHUB-IMPL-006 (P6)**: `js/glossary-tooltip.js`는 R02 용어 데이터를 인라인 `GLOSSARY` 맵으로 미러링한다(런타임 fetch 아님 — `file://` CORS 제약). 신규 용어 5항목은 R02와 인라인 맵 **양쪽**에 추가되어야 P 트랙에서 `data-term` 툴팁으로 재사용된다(REQ-006, REQ-012).
- **SPEC-GIT-GITHUB-IMPL-001 (P1)**: T16/T17/T23의 튜토리얼 골격, side-note 6종, `ref/glossary.html` 구조. 보강 대상의 원천.
- **SPEC-GIT-GITHUB-IMPL-011 (P11)**(기능상 느슨한 결합 · 파일상 배타): 사이트 통합. 본 SPEC의 T→P 링크는 네비게이션 통합과 독립적으로 동작하나, 둘 다 P 트랙 도달성을 높인다. 단, IMPL-011은 본 SPEC이 편집하는 네 파일(T16·T17·T23·R02)의 네비게이션 헤더를 소관하므로 **동일 파일 동시 편집 불가** — IMPL-012 선행, IMPL-011 nav sweep 후행(§5).
- **SPEC-GIT-GITHUB-GUIDE-001 기획 산출물**(입력): 개념/실전 층위 분리 원칙, 오디언스 계약.

---

## 8. 리스크 (Risks)

| 리스크 | 영향 | 완화 |
|---|---|---|
| T 페이지가 P 트랙 내용을 과도하게 재현(층위 혼선) | 중복 서술, 유지보수 이중화 | REQ-008로 "맛보기 1장" 원칙을 강제(결정 6.1). 상세는 링크로 위임. run 단계에서 T/P 서술 중복 여부 점검. |
| R02(`ref/glossary.html`)와 `glossary-tooltip.js` 인라인 `GLOSSARY` 맵이 조용히 어긋남(한쪽만 갱신) | 정의와 모순되는 툴팁 또는 툴팁 공백(키 `undefined`) | `glossary-tooltip.js`는 R02를 런타임 fetch하지 않고 인라인 미러를 읽음(§3.5). REQ-006으로 양쪽 5키 존재·`metaphor` 일치를, REQ-012로 미러 동기화 불변식을 강제. sync 단계에서 R02 ↔ 인라인 맵 5키 대조를 필수 점검. |
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

- 2026-07-10 (v1.2.0): Run 완료 + `data-term` 트리거 연결. T16/T17/T23 mock UI 맛보기와 용어집 5항목(`sub-issue`·`issue-type`·`merge-queue`·`ruleset`·`suggested-change`)을 `ref/glossary.html`과 `js/glossary-tooltip.js` 인라인 맵 양쪽에 추가, `metaphor` 5건 바이트 단위 일치 확인(REQ-006/REQ-012 충족). 다만 REQ-006은 "양쪽 미러 일치"만 요구하므로, 추가 직후에는 본문 어디에서도 `data-term`으로 참조하지 않아 툴팁이 뜰 자리가 없었다. 이후 본문 첫 등장 위치 4곳에 트리거를 연결 — `sub-issue`·`issue-type`(`practice/issue-anatomy.html`), `merge-queue`(`practice/pr-anatomy.html`), `suggested-change`(`practice/pr-review.html`). 이때 실전 페이지 3곳이 `js/glossary-tooltip.js`를 아예 로드하지 않고 있어 `<script>` 태그를 함께 추가했다(`data-term`만으로는 아무 일도 일어나지 않는다). 트리거는 mock UI(`.ghui-window`)와 범례(`.ghui-legend__item`) 바깥의 산문에만 둔다 — 범례 항목은 핀 활성화 클릭 핸들러를 갖고 있어 `role="button"` 트리거를 중첩하면 클릭이 양쪽으로 발화한다. **`ruleset`은 용어집 밖 본문에 등장하지 않아 트리거를 걸지 않았다**; 항목과 인라인 맵은 유지하며, `tutorial/github-org-teams.html`의 branch protection 서술에 ruleset 문장이 추가되면 즉시 사용 가능하다. 표기 정합: `practice/pr-anatomy.html` 본문의 `병합 대기열`을 용어집·툴팁과 같은 `병합 큐`로 통일. 브라우저 실측: 트리거 4/4 툴팁 표시, mock UI·범례 내부 트리거 0개.
- 2026-07-10 (v1.1.0): REQ-006 정정 + 산출물 추가. **REQ-006이 원안대로는 성립 불가였음을 수정** — `js/glossary-tooltip.js`는 `ref/glossary.html`을 런타임 fetch하지 않고 인라인 `GLOSSARY` 맵을 임베드한다(헤더 주석: "file://에서 fetch 불가(CORS)하므로 인라인 임베드"). 따라서 R02에만 5항목을 추가하면 `GLOSSARY[key]`가 `undefined`가 되어 툴팁이 침묵한다. REQ-006을 "R02·인라인 맵 양쪽에 5키가 존재하고 `metaphor`가 일치해야 한다"는 검증 가능·참인 조건으로 재서술(EARS 유지). 산출물 §3.5(`js/glossary-tooltip.js` 인라인 미러 갱신) 신설 — 종전 §3의 4개 산출물이 `glossary-tooltip.js`를 누락하고 있었다. 미러 동기화 불변식 REQ-012 신설(빌드·런타임 fetch 부재가 중복의 존재 이유). 결정 6.2·§2 배경·§7 IMPL-006 의존성의 "앵커 참조" 오기술을 "인라인 미러" 실제 메커니즘으로 정정. §8 리스크에 R02 ↔ 인라인 맵 드리프트 위험 반영. §5·§7에 IMPL-011과의 네 파일(T16·T17·T23·R02) 동시 편집 금지·실행 순서(IMPL-012 선행, IMPL-011 nav sweep 후행) 명시. REQ-007/009/011 불변. version 1.0.0 → 1.1.0.
- 2026-07-10: 최초 작성. 승인 계획서의 "기존 개념 페이지 보강" 절을 구현 단계로 정식화. T16(Issue·PR mock UI 맛보기 + P02/P04/P07 링크), T17(diff mock UI + P05 링크), T23(칸반 보드 mock UI + P06 링크), `ref/glossary.html`(sub-issue·issue type·merge queue·ruleset·suggested change 5항목 추가)을 산출물로 정의. 개념/실전 층위 분리(결정 6.1, "맛보기 1장" 원칙)와 용어집 앵커 툴팁 재사용(결정 6.2, 데이터 단일 소스)을 아키텍처 결정으로 명문화. `cases/index.html` 사례 추가는 명시적 범위 외. 11개 EARS 수용 기준(REQ-001~REQ-011) 확정. WHAT/WHY에 집중하고 HOW(삽입 위치·마크업·용어 정의 문구)는 run 단계로 연기. IMPL-009·IMPL-010 강한 의존, IMPL-006 툴팁 메커니즘, IMPL-001 골격 의존 명시.

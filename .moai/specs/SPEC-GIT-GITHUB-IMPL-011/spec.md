---
id: SPEC-GIT-GITHUB-IMPL-011
version: 1.1.0
status: Draft
created: 2026-07-10
updated: 2026-07-10
author: jw
priority: High
lifecycle: spec-anchored
related:
  - SPEC-GIT-GITHUB-GUIDE-001
  - SPEC-GIT-GITHUB-IMPL-001
  - SPEC-GIT-GITHUB-IMPL-009
  - SPEC-GIT-GITHUB-IMPL-010
  - SPEC-GIT-GITHUB-IMPL-012
---

# SPEC — P11: 사이트 통합 (네비게이션 · 도어 · 검색 인덱스)

> 본 SPEC은 승인된 계획서 `git-github-synchronous-hummingbird.md`의 "사이트 통합 (영향 범위)" 절을 구현 단계로 정식화한 것이다.
> 청중: 본 사이트를 구현하는 개발자. WHAT/WHY(어디를 어떻게 연결해야 P 트랙이 도달 가능해지는가)에 집중하고 HOW(구체적 마크업·CSS 조정)는 run 단계로 연기한다.
> 계획서에서 확정된 파일 경로·`sectionMap` 키·검색 인덱스 스키마는 산출물 계약이므로 포함한다.

---

## 1. 목표 (Goal)

IMPL-010이 신설한 실전 협업 트랙 `practice/`(P01~P08)를 사이트의 네비게이션·홈 도어·검색에 통합하여, **`gh-nav`를 가진 40개 페이지 어디서나 도달 가능**하게 만든다. 네비게이션이 40개 HTML에 하드코딩되어 있어 `실전` 드롭다운을 추가하는 연쇄 변경 지점이 많고, **본 SPEC의 작업량 상당 비중이 여기 있다.**

본 Phase가 끝나면 독자는 어느 페이지에서든 `실전` 드롭다운으로 P 트랙에 진입할 수 있고, breadcrumb에 "실전"이 표시되며, `Ctrl+K` 검색에서 P 트랙 페이지가 검출된다.

---

## 2. 배경 (Background)

계획서가 밝히듯 **네비게이션이 40개 HTML에 하드코딩**되어 있어 `실전` 트랙 통합은 다음을 연쇄로 요구한다: `js/nav.js`의 `sectionMap` 확장, `gh-nav`를 가진 40개 HTML에 `실전` 드롭다운 신설, 모바일 드로어(`index.html`에만 존재) 갱신, `index.html`의 도어 확장과 인라인 검색 인덱스 갱신. 계획서는 이 부분을 "작업량의 상당 비중"으로 명시한다.

핵심 난점은 **상대경로가 위치별로 다르다**는 점이다. `index.html`(1개)은 `practice/…`, `tutorial/*.html`(26개)은 `../practice/…`, `ref/*.html`(4개)·`cases/index.html`(1개)은 `../practice/…`, `practice/*.html`(8개)은 형제 페이지이므로 접두사 없는 `파일명.html`(단, `tutorial/`로 되돌아가는 링크는 `../tutorial/…`)을 써야 한다. 이를 4그룹으로 나눠 처리하지 않으면 경로 접두사 혼동으로 링크가 깨진다.

또한 `index.html`의 검색은 CORS 회피를 위해 **인라인 검색 인덱스**(`<script type="application/json" id="search-index">`)로 구현되어 있다. 여기에 P01~P08 8항목을 추가하지 않으면 새 페이지가 검색 결과에 나오지 않는다.

**WHAT vs HOW 경계**: 본 SPEC은 어떤 파일의 어떤 지점을 무엇으로 연결해야 하는지를 정의한다. 구체적 마크업 문자열·CSS 그리드 조정 값은 run 단계로 연기한다. 확정된 파일 경로·`sectionMap` 키·검색 인덱스 스키마는 계약이므로 포함한다.

---

## 3. 산출물 (Deliverables)

본 SPEC은 신규 파일이 아닌 **기존 파일 수정**이 주된 산출물이다. 스위프 대상은 `gh-nav` 헤더를 가진 **총 40개 HTML**이다(사전 존재 32개 + IMPL-010이 커밋한 P 트랙 8개).

### 3.1 `js/nav.js` — sectionMap 확장

- `initBreadcrumb()`의 `sectionMap`에 `practice: { label: '실전', order: 4 }` 항목 추가(현재 `tutorial`/`ref`/`cases` 3항목, nav.js:133-137 부근).

### 3.2 `gh-nav`를 가진 40개 HTML — `실전` 드롭다운 신설

- 각 HTML의 `gh-nav`에서 `학습트랙`/`참조`/`사례` 옆에 `실전` 드롭다운을 신설, P01~P08 링크를 노출.
- `gh-nav` 헤더 보유 파일은 총 **40개**다: 사전 존재 **32개**(`index.html` 1개 + `tutorial/*.html` 26개 + `ref/*.html` 4개 + `cases/index.html` 1개) + IMPL-010이 커밋한 `practice/*.html` **8개**. P 트랙 8개 페이지는 nav 변경을 IMPL-011이 소유하도록 `실전` 드롭다운 없이 선적되었으므로 **본 스위프의 대상에 포함**된다(총 40개).
- 상대경로가 위치별로 다르므로 **4그룹**으로 분리 처리:
  - `index.html`(1개) → `practice/…`
  - `tutorial/*.html`(26개) → `../practice/…`
  - `ref/*.html`(4개)·`cases/index.html`(1개) → `../practice/…`
  - `practice/*.html`(8개) → 형제 P 페이지 링크는 접두사 없이 `파일명.html`, `tutorial/`로 가는 링크는 `../tutorial/…`

### 3.3 모바일 드로어 — `실전` 섹션 추가

- `.mobile-drawer`에 `실전` 섹션 추가. 드로어는 `index.html`에만 존재하므로 그곳만 수정.

### 3.4 `index.html` — 도어 확장 + 검색 인덱스

- `.three-doors`를 문 4개로 확장(`실전 협업 트랙` 카드 추가). `.three-doors__grid`가 `auto-fill`이 아니면 그리드 조정.
- 인라인 검색 인덱스(`<script type="application/json" id="search-index">`)에 P01~P08 8개 항목을 `{type, id, title, summary, url, keywords}` 스키마로 추가.

---

## 4. 수용 기준 (Acceptance Criteria, EARS)

> 키워드(UBIQUITOUS, WHEN, WHILE, IF, THEN, WHERE, SHALL)는 영어로 유지. 본문은 한국어.

- **REQ-001 (nav.js sectionMap 확장)**: WHEN `js/nav.js`가 `practice/` 하위 경로 페이지에서 breadcrumb를 생성하면, THEN `sectionMap`의 `practice: { label: '실전', order: 4 }` 항목에 따라 섹션 라벨이 "실전"으로 매핑 SHALL.

- **REQ-002 (40개 페이지 실전 드롭다운)**: UBIQUITOUS — `gh-nav` 헤더를 가진 40개 HTML(사전 존재 32개 + `practice/*.html` 8개) 각각의 `gh-nav`에 `실전` 드롭다운이 신설되어 P01~P08 링크를 노출 SHALL. 어느 페이지에서든 `실전` 드롭다운이 표시 SHALL.

- **REQ-003 (상대경로 무결성 — 4그룹)**: UBIQUITOUS — `실전` 드롭다운의 링크 경로는 파일 위치에 따라 `index.html`은 `practice/…`, `tutorial/*.html`(26개)은 `../practice/…`, `ref/*.html`·`cases/index.html`(5개)은 `../practice/…`, `practice/*.html`(8개)은 형제 링크이므로 접두사 없는 `파일명.html`로 정확히 설정 SHALL. 40개 페이지 전수에서 P 트랙 링크 깨짐이 0건 SHALL.

- **REQ-004 (모바일 드로어 실전 섹션)**: WHERE `.mobile-drawer`가 존재하는 페이지(`index.html`)에서, THEN 드로어에 `실전` 섹션이 추가되어 P01~P08 링크를 노출 SHALL.

- **REQ-005 (홈 도어 4개 확장)**: WHEN `index.html`이 렌더링되면, THEN `.three-doors`가 문 4개(기존 3개 + `실전 협업 트랙` 카드)로 확장되어 표시 SHALL. `.three-doors__grid`가 `auto-fill`이 아닌 경우 그리드 레이아웃이 4개 카드를 정상 배치하도록 조정 SHALL.

- **REQ-006 (검색 인덱스 8항목 추가)**: WHEN `index.html`의 인라인 검색 인덱스(`<script type="application/json" id="search-index">`)가 로드되면, THEN P01~P08 8개 항목이 `{type, id, title, summary, url, keywords}` 스키마로 포함 SHALL.

- **REQ-007 (Ctrl+K 검색 검출)**: WHEN 사용자가 `Ctrl+K` 검색에서 P 트랙 관련어(예: "마일스톤", "리뷰", "이슈")를 입력하면, THEN 대응하는 P 트랙 페이지가 검색 결과에 검출 SHALL.

- **REQ-008 (breadcrumb 실전 표시)**: WHEN `practice/` 하위 페이지가 로드되면, THEN breadcrumb가 "홈 › 실전 › 현재 페이지" 형식으로 자동 생성되어 렌더링 SHALL.

- **REQ-009 (기존 콘텐츠 불변 — 스코프 규율)**: UBIQUITOUS — 본 SPEC은 `gh-nav`를 가진 40개 페이지의 네비게이션·모바일 드로어·홈 도어·검색 인덱스만 수정 SHALL. 대상 외 본문 콘텐츠·자산·스타일은 변경하지 SHALL NOT.

- **REQ-010 (빌드 없음)**: UBIQUITOUS — 모든 수정은 빌드 단계 없이 `file://` 프로토콜에서 직접 동작 SHALL. 인라인 검색 인덱스가 CORS 회피를 위해 인라인화된 만큼 `file://`로도 검색이 동작 SHALL.

- **REQ-011 (tmux 원본 무결성)**: UBIQUITOUS — 본 SPEC의 어떤 수정도 `tmux/` 디렉토리의 원본 파일을 변경하지 SHALL NOT.

- **REQ-012 (practice 트랙 형제 링크 · 현재 페이지 표시)**: WHERE `practice/*.html` 8개 페이지 각각에서, THEN `실전` 드롭다운은 8개 형제 P 페이지 전부를 `../practice/` 접두사 없이 형제 상대경로(`파일명.html`)로 링크 SHALL. WHEN 독자가 P 트랙 내부 페이지에 있으면, THEN 페이저 외에도 `실전` 드롭다운으로 나머지 형제 P 페이지에 직접 도달 SHALL, AND 현재 열람 중인 P 페이지를 드롭다운에서 활성(current) 상태로 표시 SHALL. (최소 요건: 8개 형제 링크가 `../practice/` 접두사 없이 정확히 연결.)

---

## 5. 범위 외 (Out of Scope)

명시적으로 본 SPEC(P11) 범위에서 제외되는 항목.

- P 트랙 8개 페이지 본문·mock UI·시나리오 → **P10 (IMPL-010)**. P11은 이미 존재하는 페이지를 사이트에 "연결"만 한다.
- mock UI 컴포넌트·인터랙션(`css/gh-ui.css`, `js/gh-ui.js`) → **P9 (IMPL-009)**.
- 기존 T16/T17/T23 mock UI 삽입, glossary 항목 추가 → **P12 (IMPL-012)**.
- 네비게이션 동적 렌더링 리팩터링(하드코딩을 JS 생성으로 전환) → **명시적 배격**(아키텍처 결정 6.1 참조).
- `cases/index.html`에 P 트랙 연계 사례 추가 → 범위 밖(계획서에서 이번 제외로 확정).
- 구체적 마크업 문자열, `.three-doors__grid` CSS 조정 값, 검색 항목의 실제 키워드 카피 → **run 단계** (WHAT이 아닌 HOW).
- `tmux/` 원본 파일의 어떠한 수정 (REQ-011 위반).

---

## 6. 아키텍처 결정 (Architecture Decisions)

### 6.1 네비 동적 렌더링 리팩터링 배격 (하드코딩 유지)

**결정**: 40개 HTML에 하드코딩된 네비게이션을 JS 동적 렌더링으로 전환하는 리팩터링을 하지 않는다. `실전` 드롭다운을 40개 파일에 반복 추가하는 현행 하드코딩 방식을 유지한다.

**근거**: 매력적으로 보이나, `file://` 환경에서 JS가 실패하면 동적 렌더링 네비는 통째로 사라진다. 본 사이트는 빌드 없이 `file://`로 직접 열리는 정적 멀티페이지가 원칙(IMPL-001 REQ-009)이므로, 네비게이션이 JS 실행 여부에 의존하면 안 된다. 하드코딩 반복은 편집 비용이 크지만 정적 사이트 원칙에 부합하고 견고하다. 반복 편집 누락 리스크는 4그룹 분리 처리 + 전수 링크 검증으로 완화한다(리스크 표).

### 6.2 4그룹 경로 접두사 분리 처리

**결정**: 40개 페이지를 상대경로 접두사에 따라 4그룹(`index.html`=`practice/`, `tutorial/*`=`../practice/`, `ref/*`·`cases/`=`../practice/`, `practice/*`=접두사 없는 형제 `파일명.html`)으로 나눠 편집한다.

**근거**: 위치가 다른 파일에 같은 접두사를 쓰면 링크가 깨진다. 특히 `practice/*.html`은 형제 P 페이지를 접두사 없이 링크해야 하므로(REQ-012), 다른 3그룹과 접두사 규칙이 다르다. 그룹을 명시적으로 분리하면 접두사 혼동을 구조적으로 예방하고, 각 그룹 편집 후 그룹 단위 검증이 가능하다. 이것이 REQ-003·REQ-012의 구현 전략이다.

### 6.3 검색 인덱스 인라인 유지 (외부 JSON 배격)

**결정**: P01~P08 항목을 별도 `search-index.json` 파일이 아닌 `index.html`의 기존 인라인 `<script type="application/json">`에 추가한다.

**근거**: 본 사이트는 CORS 회피를 위해 검색 인덱스를 인라인화했다(IMPL-002 전례). 외부 JSON으로 분리하면 `file://`에서 fetch가 CORS로 실패한다. 기존 인라인 방식에 항목만 추가하는 것이 `file://` 동작(REQ-010)을 보장하는 유일한 방법이다.

---

## 7. 의존성 (Dependencies)

- **SPEC-GIT-GITHUB-IMPL-010 (P10)**(선행, 강한 의존): 연결 대상인 `practice/` 8개 페이지가 먼저 존재해야 한다. **IMPL-010은 완료되어 8개 페이지가 커밋된 상태**이며, 이 8개는 nav 변경을 IMPL-011이 소유하도록 `실전` 드롭다운 없이 선적되었으므로 본 SPEC 스위프의 대상(총 40개)에 포함된다. IMPL-010 완료 후 본 SPEC이 이를 네비·검색에 연결한다.
- **SPEC-GIT-GITHUB-IMPL-001 (P1)**: `js/nav.js`(`sectionMap`, breadcrumb 자동 생성), `gh-nav` 드롭다운 구조, `.mobile-drawer`, `.three-doors` 도어, 인라인 검색 인덱스 구조를 상속·수정 대상으로 삼는다.
- **SPEC-GIT-GITHUB-IMPL-009 (P9)**(간접): 연결되는 페이지가 mock UI 시스템을 사용하나, 본 SPEC의 통합 작업 자체는 mock UI에 직접 의존하지 않는다.
- **SPEC-GIT-GITHUB-GUIDE-001 기획 산출물**(입력): 사이트 IA·네비게이션 구조의 상위 근거.

---

## 8. 리스크 (Risks)

| 리스크 | 영향 | 완화 |
|---|---|---|
| 40파일 반복 편집 중 일부 누락 | 특정 페이지에서 `실전` 드롭다운 누락, 도달 불가 | 4그룹 분리 처리(결정 6.2) 후 전수 링크 검증. REQ-002를 UBIQUITOUS로 두어 40개 전부에 강제. |
| 경로 접두사 혼동(`practice/` vs `../practice/` vs 형제 접두사 없음) | 링크 깨짐, 404 | 4그룹별 접두사를 REQ-003·REQ-012로 못박음. 그룹 편집 직후 그룹 단위로 링크 클릭 검증. |
| P 트랙 내부(`practice/*.html`)에서 형제 링크에 `../practice/` 접두사 오용 | P 페이지 간 이동 시 404, 페이저 외 이동 불가 | REQ-012로 형제 링크는 접두사 없이 `파일명.html`로 못박음. `practice/` 그룹 편집 직후 8페이지 상호 이동 전수 검증. |
| 검색 인덱스 8항목 누락 | 새 페이지가 `Ctrl+K` 검색에서 안 나옴 | REQ-006·REQ-007로 인덱스 추가와 검출을 각각 검증. run 단계에서 실제 검색어로 8페이지 전부 검출 확인. |
| `.three-doors__grid`가 3개 고정 폭이면 4번째 카드 깨짐 | 홈 레이아웃 붕괴 | REQ-005에 그리드 조정 조건 명시(`auto-fill`이 아니면 조정). run 단계에서 4개 카드 배치 확인. |
| 네비 동적화 유혹으로 인한 정적 원칙 위반 | `file://`에서 네비 소실 | 결정 6.1로 하드코딩 유지를 명문화. 리팩터링을 범위 외로 배격. |

---

## 9. 관련 산출물 (Related)

- SPEC-GIT-GITHUB-IMPL-010 (P10): 실전 협업 트랙 P01~P08. 본 SPEC의 연결 대상.
- SPEC-GIT-GITHUB-IMPL-001 (P1): 공유 셸·`nav.js`·`gh-nav`·`.three-doors`·검색 인덱스 구조. 수정 대상의 원천.
- SPEC-GIT-GITHUB-IMPL-009 (P9): mock UI 기반 시스템(간접).
- SPEC-GIT-GITHUB-IMPL-012 (P12): 기존 개념 페이지 보강.
- SPEC-GIT-GITHUB-GUIDE-001: 기획 산출물군(IA·네비게이션 구조).
- 승인 계획서: `.moai/plans/git-github-synchronous-hummingbird.md` "사이트 통합 (영향 범위)" 절 — 본 SPEC의 1차 입력.

---

## HISTORY

- 2026-07-10 (v1.1.0): 스위프 대상 수 정정. 기존 "27개"는 사전 존재 페이지를 과소집계한 값으로, 저장소 `class="gh-nav"` grep으로 검증한 실제 사전 존재 `gh-nav` 보유 페이지는 **32개**(`index.html` 1 + `tutorial/*.html` 26 + `ref/*.html` 4 + `cases/index.html` 1)다. 여기에 IMPL-010이 커밋한 `practice/*.html` **8개**(nav 변경을 IMPL-011이 소유하도록 `실전` 드롭다운 없이 선적됨)를 더해 **총 40개**가 스위프 대상임을 확정 — P 페이지도 페이저 외 도달 경로가 필요하므로 스위프에 포함. `practice/` 내부에서는 형제 P 페이지를 접두사 없이(`파일명.html`), `tutorial/`로는 `../tutorial/…`로 링크하는 **네 번째 경로 그룹**을 추가하여 기존 3그룹을 4그룹으로 확장. REQ-002(27→40 페이지), REQ-003(3그룹→4그룹, 전수 링크 깨짐 0건 유지) 본문 재기술, REQ-012(practice 형제 링크·현재 페이지 표시) 신설. Section 3 산출물·6.1·6.2 아키텍처 결정·7 의존성(IMPL-010 완료 반영)·8 리스크의 수치·그룹 표기를 40개·4그룹으로 정정. REQ-009 스코프 규율은 대상 수만 40으로 정정(스코프 규율 의미 불변). version 1.0.0→1.1.0.
- 2026-07-10: 최초 작성. 승인 계획서의 "사이트 통합 (영향 범위)" 절을 구현 단계로 정식화. `js/nav.js` `sectionMap` 확장(`practice: { label: '실전', order: 4 }`), 27개 HTML `gh-nav` `실전` 드롭다운 신설(3그룹 경로), 모바일 드로어 갱신, `index.html` 도어 4개 확장·인라인 검색 인덱스 8항목 추가를 산출물로 정의. 상대경로 3그룹 분리(REQ-003), 검색 검출(REQ-007), breadcrumb 실전 표시(REQ-008)를 정식화. 네비 동적 렌더링 리팩터링 배격(결정 6.1, `file://` JS 실패 시 네비 소실 근거)과 검색 인덱스 인라인 유지(결정 6.3)를 아키텍처 결정으로 명문화. 27파일 반복 편집 누락·경로 접두사 혼동을 리스크로 등록하고 3그룹 분리 + 전수 검증으로 완화. 11개 EARS 수용 기준(REQ-001~REQ-011) 확정. WHAT/WHY에 집중하고 HOW(마크업·CSS 조정 값)는 run 단계로 연기. IMPL-010 강한 의존 명시.

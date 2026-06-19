---
id: SPEC-GIT-GITHUB-IMPL-005
version: 1.1.0
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

# SPEC — P5: 사례 갤러리 (Cases Gallery) — 시그니처 기능

> 본 SPEC은 SPEC-GIT-GITHUB-GUIDE-001 roadmap P5를 구현 단계로 정식화한다.
> `cases-gallery.md` 카탈로그(26 사례)를 납품 가능한 단일 인덱스 페이지로 전환한다.
> IMPL-002/IMPL-003/IMPL-004와 병렬 계획. 본 SPEC은 P5 범위만 다루며 research.md를 작성하지 않는다(lightweight).
> 청중: 본 사이트를 구현하는 개발자. 한국어 본문, EARS 키워드·식별자·hex·경로는 영어.

---

## 1. 목표 (Goal)

본 사이트의 **시그니처 기능**인 사례 갤러리를 납품한다: 단일 인덱스 페이지(`cases/index.html`)에 26개 사례 카드(Tier 1 비개발자 14 + Tier 2 전문가/오픈소스 12)를 CaseCard 그리드로 배치하고, CaseFilterBar(Tier/Domain/Feature 3축)로 필터링 가능하게 한다. 각 카드는 따뜻한 톤 일러스트 + 한 줄 설명 + 보여주는 기능 태그 + "→ 튜토리얼 TXX" 양방향 링크를 제공하며, 튜토리얼 페이지(P3)의 사례 콜아웃 박스는 본 카드로 역연결된다.

---

## 2. 배경 (Background)

본 사이트는 GUIDE-001 spec 섹션 1/4에서 "아~ 이렇게도 쓸 수 있구나" 순간을 설계하는 시그니처 기능으로 사례 갤러리를 규정했다. 두 티어 구조(Tier 1 실생활 / Tier 2 전문가)로 비개발자 동기부여와 거시적 시각을 동시에 제공한다.

아키텍처 상속(IMPL-001):
- P1 셸(5 CSS + 3 JS)과 `tokens.css` 변수명 관습(tmux 단순명)을 그대로 상속한다. 본 페이지는 `.tpl-cases` 템플릿 클래스를 사용.
- 사례 콜아웃 박스 색상은 IMPL-001 `tokens.css`에 정의된 신규 토큰을 사용: `--note-case: #E8F5EE`(배경) + `--git-green: #2E7D52`(테두리). 이는 시리즈 공유 side-note 5종과 시각적으로 구분되는 6번째 박스.
- "재사용 = 추출·재포장" 원칙(IMPL-001 결정 6.2)과 tmux 원본 무결성(REQ-011)을 준수.

양방향 연결 의존성:
- 본 갤러리의 "→ 튜토리얼 TXX" 링크는 IMPL-003(P3)의 튜토리얼 페이지가 링크 타겟이다.
- 튜토리얼 페이지(P3)의 사례 콜아웃 박스는 본 갤러리 카드 앵커(`cases/index.html#t1-01`)로 역연결된다.
- 사례 콜아웃 박스 자체는 P3 튜토리얼 페이지에 렌더링되므로 **P3 산출물**이다. 본 P5는 카드 타겟(앵커)을 제공할 뿐.

`cases-gallery.md`가 26 사례 카탈로그의 **단일 권위 소스(authoritative catalog)**다. 본 SPEC은 카탈로그를 수정하지 않고 구현으로 전환할 뿐.

---

## 3. 산출물 (Deliverables)

### 3.1 `cases/index.html` — 사례 갤러리 템플릿

`.tpl-cases` 템플릿(IMPL-001 `pages.css`). IMPL-001 셸(GlobalHeader, Breadcrumb, Footer, ReadingProgress)을 상속. 본문 구성:

- **CaseFilterBar** — 3축 필터:
  - Tier: 전체 / 비개발자(Tier 1) / 전문가(Tier 2)
  - Domain: 작가·디자인·연구·법률·행정·음악·요리·게임·설정·글쓰기·이력서·개인·교육·번역·커널·클라우드·정부·학계·문서·도구·AI(cases-gallery.md 섹션 5 스키마 기준)
  - Feature: commit / branch / checkout / log / blame / tag / revert / remote / push / pull / clone / PR / review / fork / Actions / Pages / LFS / .gitignore 등
- **CaseCard 그리드** — 26개 카드. 각 카드 요소:
  - 따뜻한 톤 일러스트(tmux 일러스트와 동일 스타일)
  - 한 줄 설명(oneliner)
  - 보여주는 기능 태그(`features` 배열 → CommandPill 스타일)
  - "→ 튜토리얼 TXX" 링크(`related_tutorials` 기반)
  - 카드 앵커 `id="t1-01"` / `id="t2-01"` (사례 콜아웃 역연결 타겟)

### 3.2 `js/cases-filter.js` — 필터 로직

Tier/Domain/Feature 3축 조합 필터. 한 축 선택 시 다른 축의 옵션 카운트가 갱신되고, 결과 없을 경우 빈 상태 메시지 표시. `prefers-reduced-motion` 준수.

### 3.3 26개 사례 데이터

cases-gallery.md 섹션 5 스키마(id / tier / title / domain / oneliner / features / related_tutorials / illustration_ref) 기반 JSON 또는 인라인 데이터. Tier 1 14개(T1-01~T1-14) + Tier 2 12개(T2-01~T2-12). 카탈로그와 1:1.

### 3.4 26개 일러스트

따뜻한 톤, tmux 일러스트와 동일 스타일. 본 SPEC에서는 `illustration_ref` 경로만 확정하고 **placeholder를 허용**한다. 최종 아트는 본 Phase 런 단계에서 cases-gallery.md 각 사례의 "일러스트" 설명을 기반으로 제작.

---

## 4. 수용 기준 (Acceptance Criteria, EARS)

> 키워드(UBIQUITOUS, WHEN, WHILE, IF, THEN, WHERE, SHALL)는 영어로 유지. 본문은 한국어.

- **REQ-001 (카탈로그 1:1 대응)**: UBIQUITOUS — `cases/index.html`에 렌더링되는 CaseCard는 26개이며, 각 카드의 id/tier/title/oneliner/features/related_tutorials는 `cases-gallery.md` 카탈로그(Tier 1 14 + Tier 2 12)와 1:1로 일치 SHALL.

- **REQ-002 (필터 3축 조합)**: WHEN 사용자가 CaseFilterBar에서 Tier/Domain/Feature 임의 조합을 선택하면, THEN CaseCard 그리드가 해당 조건을 모두 만족하는 카드만 표시하고 나머지는 숨기 SHALL.

- **REQ-003 (튜토리얼 순방향 링크 정합)**: UBIQUITOUS — 각 카드의 "→ 튜토리얼 TXX" 링크는 cases-gallery.md 섹션 4 교차 맵의 `related_tutorials`와 일치 SHALL (예: T1-01 카드 → T01, T03, T06, T11).

- **REQ-004 (사례 콜아웃 역방향 링크 타겟)**: UBIQUITOUS — 각 카드는 안정적인 앵커(`id="t1-01"` 형식)를 가져, 튜토리얼 페이지(P3)의 사례 콜아웃 박스가 `cases/index.html#t1-01`로 점프할 수 있도록 SHALL.

- **REQ-005 (사례 콜아웃 색상 구분)**: UBIQUITOUS — 사례 콜아웃 박스(본 페이지 내 정보성 박스 및 P3 역연결 시각 단서)는 `--note-case: #E8F5EE` 배경 + `--git-green: #2E7D52` 테두리를 사용하여 시리즈 공유 side-note 5종(metaphor/history/tip/warn/extra)과 시각적으로 구분 SHALL.

- **REQ-006 (모바일 카드 그리드)**: WHILE 뷰포트 너비가 `768px` 이하이면, THEN CaseCard 그리드가 1~2열로 재배치되어 가로 스크롤 없이 렌더링 SHALL.

- **REQ-007 (필터 키보드 접근성 + 결과 카운트)**: UBIQUITOUS — CaseFilterBar의 모든 컨트롤은 키보드로 접근·조작 가능 SHALL. 또한 필터 적용 후 스크린 리더가 현재 표시된 카드 수를 announce SHALL (`aria-live` 영역).

- **REQ-008 (P1 셸 상속)**: UBIQUITOUS — `cases/index.html`은 IMPL-001의 5개 CSS(`tokens` → `base` → `layout` → `components` → `pages`)와 3개 JS(`nav` → `progress` → `reveal`)를 동일 순서로 link/load SHALL. GlobalHeader, Breadcrumb, GlobalFooter, ReadingProgress가 정상 동작.

- **REQ-009 (빌드 없음)**: UBIQUITOUS — 본 페이지와 `js/cases-filter.js`는 빌드 단계 없이 `file://` 프로토콜로 직접 열릴 SHALL.

- **REQ-010 (WCAG AA)**: UBIQUITOUS — 카드 본문, 필터 라벨, 기능 태그 텍스트와 배경 간 색 대비는 WCAG AA(일반 텍스트 4.5:1 이상)를 충족 SHALL.

---

## 5. 범위 외 (Out of Scope)

- 튜토리얼 21페이지 본문 및 사례 콜아웃 박스 렌더링 자체 → **P3 (IMPL-003)**. 본 P5는 역연결 타겟 앵커만 제공.
- 최종 일러스트 아트 제작 — 본 SPEC은 placeholder를 허용. 최종 아트는 런 단계에서 cases-gallery.md 각 사례 설명 기반 제작.
- GlossaryTooltip → **P6 (IMPL-006)**.
- 최종 QA, 접근성 감사(스크린 리더 전수 테스트, 키보드 전용 탐색, 크로스 브라우저) → **P7 (IMPL-007)**.
- `cases-gallery.md` 카탈로그 내용 변경(본 SPEC은 카탈로그를 납품물로 전환만 수행).
- `tmux/` 원본 파일 수정(IMPL-001 REQ-011 준수).

---

## 6. 의존성 (Dependencies)

- **IMPL-001 (P1 셸)** — `.tpl-cases` 템플릿, GlobalHeader/Breadcrumb/Footer/ReadingProgress, `--note-case: #E8F5EE` / `--git-green: #2E7D52` 토큰, CommandPill 컴포넌트, CSS 5-link·JS 3-load 순서.
- **IMPL-003 (P3 튜토리얼)** — 본 갤러리의 "→ 튜토리얼 TXX" 링크 타겟. 사례 콜아웃 박스(본 갤러리로 역연결)는 P3 페이지에 렌더링되므로 P3 산출물.
- **`cases-gallery.md`** — 26 사례 카탈로그 권위 소스. 섹션 2(Tier 1 14), 섹션 3(Tier 2 12), 섹션 4(교차 맵), 섹션 5(카드 스키마)가 본 SPEC의 입력.
- **GUIDE-001 `design-guide.md`** 섹션 4.4(cases gallery 템플릿), 5.H(CaseCard 그리드 + 필터 자산), 7(CaseCard, CaseFilterBar 컴포넌트).
- **GUIDE-001 `ia-sitemap.md`** 섹션 2.4(cases gallery 페이지), 5.3(교차 링크).

---

## 7. 관련 산출물 (Related)

- GUIDE-001 산출물군: `spec.md`, `roadmap.md`(P5 섹션), `design-guide.md`, `ia-sitemap.md`, `cases-gallery.md`(본 SPEC의 1차 입력).
- IMPL-001(P1 셸) — 본 SPEC이 상속하는 아키텍처 결정의 원천. `research.md`(CSS 5분할, 추출·재포장 정의).
- 병렬 계획 대상: IMPL-002(P2 홈+검색), IMPL-003(P3 튜토리얼), IMPL-004(P4 참조).
- 후속: IMPL-006(P6 Git 특화 자산), IMPL-007(P7 QA/접근성).
- SPEC-TMUX-GUIDE-001 — 일러스트 스타일 기준점(따뜻한 톤).

---

## HISTORY

- 2026-06-19: 최초 작성. GUIDE-001 roadmap P5를 구현 단계로 정식화. IMPL-001 아키텍처(CSS 5분할, tmux 변수명 관습, 추출·재포장, `--note-case`/`--git-green` 토큰)를 상속. `cases-gallery.md` 26 사례 카탈로그를 단일 권위 소스로 지정. 10개 EARS 수용 기준 확정(REQ-001~REQ-010). IMPL-002/003/004와 병렬 계획. research.md 없는 lightweight SPEC.
- 2026-06-19: Run + Sync 완료. `cases/index.html`(26 카드 정적 렌더) + `js/cases-filter.js`(DOM 기반 3축 필터) 납품. 카드를 정적 HTML에 고정해 역방향 앵커(`#t1-01` 등) 무결성·no-JS 견고성 확보(REQ-004/005 강화). `.tpl-cases` 스타일을 `pages.css`에 추가(5-CSS 링크 계약 유지). P7 검증에서 26 앵커·550 내부 링크 0 broken 확인. status → Implemented.

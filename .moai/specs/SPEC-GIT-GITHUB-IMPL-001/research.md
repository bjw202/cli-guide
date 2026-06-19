---
id: SPEC-GIT-GITHUB-IMPL-001/research
version: 1.0.0
status: Planned
created: 2026-06-19
updated: 2026-06-19
author: jw
priority: High
related:
  - SPEC-GIT-GITHUB-GUIDE-001
  - SPEC-TMUX-GUIDE-001
---

# Research — SPEC-GIT-GITHUB-IMPL-001 (P1: 공유 셸 + 디자인 시스템 + 내비 스캐폴딩)

> 본 research는 SPEC-GIT-GITHUB-GUIDE-001(기획 산출물)의 roadmap P1을
> 구현 단계로 정식화하기 위한 참조 구현 분석 및 재사용 자산 식별 결과다.
> IMPL-001은 **P1에 한정**한다(P2~P7은 IMPL-002~IMPL-007로 분할 예정).

---

## 1. 참조 구현 분석 (tmux 자매 사이트)

tmux 사이트(`tmux/`)는 이미 구현 완료 상태다. P1 재사용 자산의 원본.

### 1.1 파일 구조 (실제)

```
tmux/
├── index.html          (101 KB, 단일 페이지)
├── css/
│   └── style.css       (43 KB / 1718줄, 단일 파일)
└── js/
    └── main.js         (21 KB / 613줄, 단일 파일)
```

### 1.2 핵심 발견: 단일 파일 구조 vs 기획 가정의 불일치

| 항목 | 기획 문서 가정 (roadmap/design-guide) | tmux 실제 구현 | 영향 |
|---|---|---|---|
| CSS | `tokens.css` + `base.css` + `layout.css` + `components.css` + `pages.css` (5개 분할) | `style.css` 단일 파일 | 27페이지 사이트에서는 분할이 필수. tmux 단일 파일 방식은 단일 페이지에만 적합 |
| JS | `reveal.js`, `fake-terminal.js`, `nav.js`, `progress.js` 등 모듈화 | `main.js` 단일 파일에 모든 로직 인라인 | "tmux reveal.js 재사용" 표현은 부정확. 실제는 "tmux main.js의 reveal 로직을 추출·모듈화" |
| 내비 | `GlobalHeader`, `Breadcrumb`, `PrevNextPager`, `SidebarTOC` | 단일 페이지라 해당 없음 (`StickyNav`만 존재) | 이 컴포넌트들은 모두 **신규**. tmux에 참조 구현 없음 |
| 진행률 | `ReadingProgressBar` (현재 페이지 + 트랙 전체) | `.progress-bar` (현재 페이지만) | 현재 페이지 진행률은 재사용 가능, 트랙 전체 진행률(localStorage)은 **신규** |

### 1.3 tmux에서 추출 가능한 재사용 로직 (main.js 역분석)

tmux `main.js`(613줄)에 인라인된 것으로 예상되는 로직 (SPEC 작성 시 실제 코드 확인 필요):

- **스크롤 리빌** (IntersectionObserver) → 추출하여 `reveal.js`로 모듈화
- **읽기 진행률 바** (scroll event → width %) → 추출하여 `progress.js`의 현재-페이지 진행률 컴포넌트로
- **가짜 터미널 데모** → P1 범위 아님 (P3 튜토리얼에서 사용, IMPL-003에서 다룸)
- **치트시트 토글 / FAQ 아코디언** → P1 범위 아님

> P1은 **reveal 로직과 진행률 로직**만 tmux에서 추출 대상. 나머지는 해당 Phase에서.

---

## 2. P1 재사용 vs 신규 자산 매트릭스

### 2.1 CSS (5개 분할 채택 — 27페이지 규모에 필수)

| 파일 | 출처 | 근거 |
|---|---|---|
| `css/tokens.css` | **신규** (tmux 단일 파일에서 변수 추출) | 시리즈 공유 토큰 + Git 액센트. design-guide 섹션 2 정의. tmux `:root` 변수를 추출하여 동일 변수명 유지 → 시리즈 일관성 |
| `css/base.css` | **신규** (tmux reset/타이포 추출) | reset, 한국어 본문 타이포(line-height 1.7, word-break: keep-all, Pretendard + JetBrains Mono) |
| `css/layout.css` | **신규** | GlobalHeader/Footer 고정, Breadcrumb, 2단(본문+TOC), 반응형 중단점. tmux는 단일 페이지라 레이아웃 구조 다름 |
| `css/components.css` | **신규** (side-note 박스는 tmux 스타일 참조) | side-note 6종(5 시리즈 공유 + 1 사례 콜아웃), CommandPill, CodeBlock, ComparisonTable. tmux의 side-note 스타일을 5종까지 역추적 가능 |
| `css/pages.css` | **신규** | 4 템플릿(홈/튜토리얼/참조/사례)별 페이지 스타일. tmux에 해당 없음 |

**전략**: tmux `style.css`를 분해하여 `tokens.css`/`base.css`의 변수·reset·타이포를 추출(시리즈 톤 일관성 확보), `layout/components/pages`는 신규 작성. 이로써 "시리즈 60% 재사용"이라는 roadmap 목표를 토큰·톤·기본 컴포넌트 수준에서 달성.

### 2.2 JS

| 파일 | 출처 | P1 포함? |
|---|---|---|
| `js/reveal.js` | **재사용** (tmux main.js에서 IntersectionObserver 로직 추출·모듈화) | ✅ |
| `js/progress.js` | **재사용+신규** (현재 페이지 진행률 = tmux 추출, 트랙 전체 진행률 localStorage = 신규) | ✅ |
| `js/nav.js` | **신규** (GlobalHeader 드롭다운, 햄버거 토글, Breadcrumb 생성) | ✅ |
| `js/fake-terminal.js` | 재사용+확장 | ❌ P3 (IMPL-003) |
| `js/search.js`, `git-graph.js`, `pr-flow.js` 등 | 신규 | ❌ P2~P6 |

---

## 3. P1 범위 정의 (확정)

### 3.1 산출물 (Deliverables)

**CSS (5파일)**:
- `css/tokens.css` — 시리즈 공유 토큰(크림 `#FFFBF5`/코랄 `#FF8A5B`/인디고 `#3D5AFE`/민트 `#26A69A`/경고 `#EF5350`/텍스트 `#2D2A26`·`#7A726B`) + Git 액센트(따뜻한 초록 `#2E7D52`, 마을 인디고 `#5B6CFF`). 모든 색 CSS 변수화, tmux와 동일 변수명.
- `css/base.css` — reset, 한국어 본문 타이포(line-height 1.7, `word-break: keep-all`), 폰트 임포트(Pretendard CDN + JetBrains Mono).
- `css/layout.css` — GlobalHeader/Footer 고정, Breadcrumb, 2단 레이아웃(본문+TOC), 반응형 중단점(768px).
- `css/components.css` — side-note 박스 6종(비유 노랑/역사 베이지/팁 민트/주의 코랄/알아두면 라벤더/사례 콜아웃 연초록), CommandPill, CodeBlock, ComparisonTable.
- `css/pages.css` — 4 템플릿(홈/튜토리얼/참조/사례) 골격 스타일. 본문은 빈 canvas (P2~P5에서 채움).

**JS (3파일)**:
- `js/nav.js` — GlobalHeader(학습트랙/참조/사례 드롭다운, 시리즈 링크), 햄버거 토글, Breadcrumb 자동 생성.
- `js/progress.js` — 현재 페이지 진행률(상단 2px 바) + 트랙 전체 진행률(localStorage).
- `js/reveal.js` — IntersectionObserver 스크롤 리빌 (tmux 로직 추출).

**검증용 HTML (1개, 최소)**:
- `index.html` — P1 범위 검증용 빈 셸. GlobalHeader/Footer/Breadcrumb/진행률 바/6종 side-note 박스 렌더링 확인. 본문 콘텐츠는 P2에서 교체.

### 3.2 수용 기준 (roadmap P1 매핑)

- 어느 빈 HTML에도 GlobalHeader/Footer가 붙어 정상 동작.
- 6종 side-note 박스가 시리즈 톤(따뜻한 노랑/베이지/민트/코랄/라벤더/연초록)으로 렌더링.
- ReadingProgress가 스크롤 시 부드럽게 갱신. 트랙 진행률이 새로고침 후에도 유지(localStorage).
- 모바일(768px 이하)에서 햄버거 메뉴 정상 동작.
- `prefers-reduced-motion: reduce`에서 reveal 모션 축소.

### 3.3 범위 외 (P1에서 하지 않는 것)

- 홈 허브 콘텐츠(ThreeDoors, CasePreview, HeroBlock 실제 일러스트) → P2 (IMPL-002)
- 검색(search-index.json, SearchOverlay) → P2
- 튜토리얼 21페이지 본문 → P3 (IMPL-003)
- 참조 4페이지 → P4
- 사례 갤러리 → P5
- Git 특화 인터랙티브 자산(GitGraph, OhShitGit 등) → P6
- 일러스트 실제 제작 → 각 Phase
- QA/접근성 최종 감사 → P7

---

## 4. 아키텍처 결정사항

### 4.1 CSS/JS 분할 채택 (tmux 단일 파일 방식 배격)

**결정**: design-guide/roadmap의 5개 CSS 분할 + 모듈화 JS 방식을 채택.

**이유**:
- 27페이지 × 단일 style.css = 파일 과대(예상 3000줄+) → 유지보수 불가.
- tmux 단일 파일 방식은 단일 페이지(1718줄)에만 적합.
- 분할하더라도 `tokens.css` 변수명을 tmux와 동일하게 유지 → 시리즈 시각적 일관성 확보(결속 목표 달성).

**표면적 불일치 수용**: tmux(`style.css` 1개) ↔ 본 사이트(5개). 단, 시각 출력은 동일(같은 토큰). "시리즈 결속"은 사용자 눈에 보이는 톤이지 파일 구조가 아님.

### 4.2 "재사용"의 정확한 의미 재정의

기획 문서의 "tmux reveal.js 재사용" 표현은 다음으로 정정:
- tmux `main.js`에서 해당 로직을 **추출**하여 별도 모듈 파일로 **재포장**.
- 추출 후 동작은 동일, 단 P1에서는 `fake-terminal` 로직은 제외(P3 범위).

---

## 5. 리스크

| 리스크 | 영향 | 완화 |
|---|---|---|
| tmux main.js 로직 추출 시 의도치 않은 회귀 | tmux 사이트 파손 | 추출은 사본에서 수행, tmux 원본은 미수정. 본 사이트는 독립 디렉토리 |
| tokens.css 변수명 동기화 누락 | 시리즈 톤 이탈 | tmux `:root` 변수를 그대로 복사, 변수명 일치 검증을 P1 수용 기준에 추가 |
| P1 검증 HTML이 너미 단순하면 후속 Phase에서 재작업 | P2~P5 낭비 | P1 검증 HTML은 4 템플릿 골격을 모두 포함(빈 canvas라도 구조는 완비) |
| 빌드 단계 없는 CSS 5파일 + JS 3파일 관리 | 반복/불일치 | P1에서 네이밍·임포트 순서 규칙 확정. 각 HTML은 동일한 5개 CSS link 순서 사용 |

---

## 6. 다음 Phase 분할 예고 (참고)

| SPEC | Phase | 범위 |
|---|---|---|
| **IMPL-001** | **P1** | **공유 셸 + 디자인 시스템 + 내비 스캐폴딩 (본 SPEC)** |
| IMPL-002 | P2 | 홈 허브 + IA + 클라이언트 사이드 검색 |
| IMPL-003 | P3 | 튜토리얼 21페이지 본문 + FakeTerminal 확장 |
| IMPL-004 | P4 | 참조 허브 4페이지 (사전/용어집/FAQ/치트시트) |
| IMPL-005 | P5 | 사례 갤러리 + 필터 + 26개 사례 데이터 |
| IMPL-006 | P6 | Git 특화 인터랙티브 자산 (GitGraph, OhShitGit 등) |
| IMPL-007 | P7 | QA + 접근성 + 크로스 브라우저 + 성능 |

---

## HISTORY

- 2026-06-19: 최초 작성. tmux 실제 구현(단일 파일 구조) 분석으로 기획 가정과의 불일치 식별. CSS 5분할/JS 모듈화 아키텍처 결정. P1 범위(5 CSS + 3 JS + 1 검증 HTML) 확정.

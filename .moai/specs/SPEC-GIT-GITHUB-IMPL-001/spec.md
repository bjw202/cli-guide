---
id: SPEC-GIT-GITHUB-IMPL-001
version: 1.0.2
status: Implemented
created: 2026-06-19
updated: 2026-06-19
author: jw
priority: High
lifecycle: spec-anchored
related:
  - SPEC-GIT-GITHUB-GUIDE-001
  - SPEC-TMUX-GUIDE-001
---

# SPEC — P1: 공유 셸 + 디자인 시스템 + 내비 스캐폴딩

> 본 SPEC은 SPEC-GIT-GITHUB-GUIDE-001(기획 산출물)의 roadmap P1을 구현 단계로 정식화한 것이다.
> P2~P7은 IMPL-002~IMPL-007로 분할되며 본 SPEC 범위가 아니다.
> 청중: 본 사이트를 구현하는 개발자 (최종 튜토리얼 독자 아님). 기술적 정확도 우선.

---

## 1. 목표 (Goal)

모든 하위 페이지(T01~T21, R01~R04, cases)가 상속받을 **공유 셸**을 납품한다. 셸은 CSS 디자인 시스템(tokens/base/layout/components/pages 5분할)과 JS 내비/진행률/리빌 3모듈로 구성되며, tmux 자매 사이트와 시리즈 결속을 유지하는 동시에 27페이지 규모에 맞춘 멀티페이지 구조(GlobalHeader, Footer, Breadcrumb, side-note 6종, ReadingProgress)를 제공한다. 본 Phase가 끝나면 P2~P6은 본문 콘텐츠만 채우면 되도록 뼈대가 완성된다.

---

## 2. 배경 (Background)

본 SPEC은 SPEC-GIT-GITHUB-GUIDE-001의 기획 산출물(roadmap, design-guide, ia-sitemap, spec)을 구현 단계로 전환한다. GUIDE-001의 roadmap P1 항목이 본 SPEC의 직접 범위가 된다.

자매 사이트인 SPEC-TMUX-GUIDE-001(tmux 가이드)는 이미 구현 완료 상태이며 본 사이트의 참조 구현(reference implementation)이다. 단, tmux는 단일 페이지(`index.html` 101KB + `css/style.css` 1718줄 + `js/main.js` 613줄의 단일 파일 구조)이고, 본 사이트는 27페이지 정적 멀티페이지다.

research.md 섹션 1.2에서 식별된 핵심 불일치: 기획 문서는 CSS 5분할·JS 모듈화를 가정했으나 tmux는 단일 파일이다. 따라서 "tmux에서 재사용"의 정확한 의미는 **tmux 원본 파일을 직접 import하는 것이 아니라**, tmux `main.js`에서 IntersectionObserver(리빌)와 scroll-event(현재 페이지 진행률) 로직을 **추출하여 재포장(extract-and-repackage)**하는 것이다. GlobalHeader, Footer, Breadcrumb, PrevNextPager, SidebarTOC는 tmux에 대응물이 없는 신규 컴포넌트다. 트랙 전체 진행률(localStorage)도 신규.

---

## 3. 산출물 (Deliverables)

### 3.1 CSS (5 파일)

**`css/tokens.css`** — 디자인 토큰. 모든 색을 CSS 변수로 정의. **변수명은 tmux `style.css` `:root` 관습(접두사 없는 단순명)을 그대로 따른다** (annotation 결정, REQ-001).
- 시리즈 공유 토큰(tmux에서 직접 복사): `--bg-base: #FFFBF5`, `--bg-surface: #FFFFFF`, `--bg-soft: #FFF6EC`, `--primary: #FF8A5B`(+ `--primary-dark`/`--primary-soft`), `--accent: #3D5AFE`(+ `--accent-soft`), `--secondary: #26A69A`(+ `--secondary-soft`), `--warning: #EF5350`(+ `--warning-soft`), `--text-primary: #2D2A26`, `--text-secondary: #7A726B`, `--text-tertiary: #A39A92`.
- side-note 박스 배경 5종(tmux에서 복사): `--note-metaphor: #FFF7E6`, `--note-history: #F5EFE0`, `--note-tip: #E6F7F4`, `--note-warn: #FDECEA`, `--note-extra: #F1ECFB`. 테두리 변수(`--border-metaphor` 등 5종)도 tmux에서 동일 복사.
- **신규 변수(본 사이트 전용)**: `--note-case: #E8F5EE` (사례 콜아웃 박스 배경), `--git-green: #2E7D52` (사례 콜아웃 테두리·commit 노드·성공 병합), `--village-indigo: #5B6CFF` (마을/협업 메타포 일러스트).
- 폰트·크기·간격·반경·그림자·이징 변수(`--font-sans`, `--font-mono`, `--fs-*`, `--space-*`, `--r-*`, `--shadow-*`, `--ease-*`, `--dur-*`)도 tmux `:root`에서 그대로 복사하여 시리즈 타이포·리듬 일관성 확보.
- **인디고 값 통일**: `--accent`는 design-guide 기준 `#3D5AFE`로 확정. tmux 구현의 `#3D5FE0`은 오타로 판단(아키텍처 결정 6.4).

**`css/base.css`** — reset + 한국어 본문 타이포그래피.
- reset (margin/padding/box-sizing), 폰트 임포트(Pretendard CDN + JetBrains Mono — design-guide 섹션 3).
- 본문: 17~18px / 400 weight / `line-height: 1.7` / `word-break: keep-all` (한국어 단어 중간 단절 방지).
- 코드/명령어: 15~16px JetBrains Mono.

**`css/layout.css`** — 페이지 레이아웃 뼈대.
- GlobalHeader(상단 고정), GlobalFooter, Breadcrumb 컨테이너, 2단 그리드(본문 + SidebarTOC), ReadingProgressBar 상단 2px 바 (ia-sitemap 섹션 4.1, 4.2, 4.5).
- 반응형 중단점 `768px`: 데스크톱 2단 → 모바일 1단, GlobalHeader 햄버거 메뉴(`☰`) 전환 (ia-sitemap 섹션 7).

**`css/components.css`** — 공유 컴포넌트 스타일.
- side-note 박스 6종 스타일 (위 6개 변수 사용). 사례 콜아웃 박스는 `#E8F5EE` 배경 + `#2E7D52` 1~2px 테두리로 시리즈 5종과 시각적 구분.
- CommandPill (`git status` 등 — `#3D5AFE` 톤 알약형 monospace), CodeBlock (코드/설정 블록), ComparisonTable (비교/치트시트 표) (design-guide 섹션 7).

**`css/pages.css`** — 4 템플릿(홈/튜토리얼/참조/사례) 골격 스타일.
- 4 템플릿 각각의 컨테이너 클래스 `.tpl-home`, `.tpl-tutorial`, `.tpl-ref`, `.tpl-cases` 정의 (design-guide 섹션 4).
- 본문 캔버스는 빈 상태(콘텐츠는 P2~P5에서 채움). P1은 구조만.

### 3.2 JS (3 파일)

**`js/nav.js`** — 글로벌 내비게이션 동작.
- GlobalHeader 드롭다운(학습트랙/참조/사례), 시리즈 링크(tmux), 햄버거 토글(768px 이하).
- Breadcrumb 자동 생성: 현재 페이지 경로를 기반으로 "홈 › 섹션 › 페이지" 출력 (ia-sitemap 섹션 4.2).

**`js/progress.js`** — 읽기 진행률.
- 현재 페이지 진행률: scroll event → 상단 2px 바 width% 갱신 (tmux `main.js` 추출).
- 트랙 전체 진행률: localStorage 기반 "T03/21 · 14%" 표시, 새로고침 후에도 유지 (ia-sitemap 섹션 4.5).

**`js/reveal.js`** — 스크롤 리빌.
- IntersectionObserver 기반. `[data-reveal]` 요소가 뷰포트 진입 시 `.is-visible` 클래스 토글 (tmux `main.js` 로직 추출·재포장).
- `prefers-reduced-motion: reduce`에서 모션 축소(즉시 표시) (design-guide 섹션 6).

### 3.3 검증용 HTML (1 파일)

**`index.html`** — P1 범위 검증용 최소 셸.
- `<head>`에서 `tokens.css` → `base.css` → `layout.css` → `components.css` → `pages.css` 순서로 5개 CSS link, `</body>` 앞에 `nav.js` → `progress.js` → `reveal.js` 순서로 3개 JS 로드.
- GlobalHeader(드롭다운 포함), Breadcrumb, GlobalFooter, ReadingProgress 바, 6종 side-note 박스 각 1개(라벨 + 더미 텍스트)를 렌더링하여 시각적 검증 가능 상태로 구성.
- 본문은 빈 캔버스(placeholder). 홈 허브 콘텐츠(ThreeDoors, HeroBlock 등)는 P2에서 교체.

---

## 4. 수용 기준 (Acceptance Criteria, EARS)

> 키워드(UBIQUITOUS, WHEN, WHILE, IF, THEN, WHERE, SHALL)는 영어로 유지. 본문은 한국어.

- **REQ-001 (시리즈 결속 — 변수명 일치)**: UBIQUITOUS — `css/tokens.css`의 시리즈 공유 토큰(배경/primary/accent/secondary/warning/text/note 5종)은 tmux `tmux/css/style.css` `:root`의 변수명과 동일한 이름을 사용 SHALL (예: `--bg-base`, `--primary`, `--accent`, `--note-metaphor`, `--note-warn`, `--note-extra`). 신규 변수(`--note-case`, `--git-green`, `--village-indigo`)만 본 사이트 고유명으로 추가 허용.

- **REQ-002 (공유 셸 상속)**: WHEN 임의의 HTML 페이지가 5개 CSS(`tokens` → `base` → `layout` → `components` → `pages` 순서)와 3개 JS(`nav` → `progress` → `reveal`)를 link/load하면, THEN GlobalHeader(상단 고정)와 GlobalFooter가 올바르게 렌더링되고 동작 SHALL.

- **REQ-003 (side-note 6종 색상)**: UBIQUITOUS — 본 사이트의 모든 HTML 페이지에서 6종 side-note 박스는 다음 배경으로 렌더링 SHALL: 비유 박스 `#FFF7E6`, 역사 박스 `#F5EFE0`, 팁 박스 `#E6F7F4`, 주의 박스 `#FDECEA`, "알아두면 좋은" 박스 `#F1ECFB`, 사례 콜아웃 박스 `#E8F5EE`(배경) + `#2E7D52`(테두리).

- **REQ-004 (현재 페이지 진행률)**: WHEN 사용자가 페이지를 스크롤하면, THEN 상단 2px ReadingProgress 바가 스크롤 위치에 비례하여 0%~100%로 부드럽게 갱신 SHALL.

- **REQ-005 (트랙 전체 진행률 지속성)**: WHEN 사용자가 튜토리얼 페이지에 방문하여 스크롤 완료 후 새로고침하면, THEN 트랙 전체 진행률(예: "T03/21 · 14%")이 localStorage에서 복원되어 동일하게 표시 SHALL.

- **REQ-006 (모바일 햄버거 메뉴)**: WHILE 뷰포트 너비가 `768px` 이하이면, THEN GlobalHeader가 햄버거 아이콘(`☰`)으로 전환되고, 클릭 시 드로어/시트 메뉴(학습트랙/참조/사례/시리즈)가 열리고 닫히 SHALL.

- **REQ-007 (리빌 모션 축소)**: WHILE 운영체제 설정이 `prefers-reduced-motion: reduce`이면, THEN `js/reveal.js`의 스크롤 리빌 모션이 즉시 표시(transition 없음)로 축소 SHALL.

- **REQ-008 (Breadcrumb 자동 생성)**: WHEN `js/nav.js`가 로드된 페이지가 non-home 경로(예: `/tutorial/git-concept.html`)를 가지면, THEN Breadcrumb가 "홈 › 섹션 › 현재 페이지" 형식으로 자동 생성되어 렌더링 SHALL.

- **REQ-009 (빌드 없음)**: UBIQUITOUS — 본 사이트는 빌드 단계 없이 `file://` 프로토콜로 브라우저에서 직접 열릴 SHALL. (Node/npm/bundler 의존성 없음.)

- **REQ-010 (WCAG AA 색 대비)**: UBIQUITOUS — 본문 텍스트와 배경 간 색 대비는 WCAG AA 기준(일반 텍스트 4.5:1 이상)을 충족 SHALL. 따뜻한 톤(`#FFFBF5` 배경 위 `#2D2A26` 본문 등)이라도 대비를 희생하지 않는다.

- **REQ-011 (tmux 원본 무결성)**: UBIQUITOUS — 본 SPEC의 어떤 산출물도 `tmux/` 디렉토리의 원본 파일을 수정하지 SHALL NOT. 모든 추출 작업은 본 사이트 디렉토리 내 사본에서 수행한다.

---

## 5. 범위 외 (Out of Scope)

명시적으로 본 SPEC(P1) 범위에서 제외되는 항목. 후속 IMPL SPEC에서 처리.

- 홈 허브 콘텐츠(HeroBlock 일러스트, ThreeDoors 세 문 카드, CasePreview, SeriesLink 카드) → **P2 (IMPL-002)**.
- 클라이언트 사이드 검색(`search-index.json`, `SearchOverlay`, `js/search.js`, Ctrl+K 단축키) → **P2 (IMPL-002)**.
- 튜토리얼 21페이지 본문(T01~T21 HTML + 카피 + side-note 실제 내용 + FakeTerminal 확장 + CommandPill/CodeBlock 인스턴스) → **P3 (IMPL-003)**.
- 참조 4페이지(R01 명령어 사전, R02 용어집, R03 FAQ, R04 치트시트 + CommandDictionaryItem/GlossaryItem/FAQItem) → **P4 (IMPL-004)**.
- 사례 갤러리(`cases/index.html`, CaseCard, CaseFilterBar, 26개 사례 데이터 + 일러스트) → **P5 (IMPL-005)**.
- Git 특화 인터랙티브 자산(GitGraphVisualizer, StagingFlowDiagram, PRFlowDiagram, ActionsPipelineAnimation, OhShitGitSimulator, ConflictResolverMini, GlossaryTooltip) → **P6 (IMPL-006)**.
- 최종 QA, 접근성 감사(스크린 리더, 키보드 전용 탐색), 크로스 브라우저 테스트, Lighthouse 성능 검증 → **P7 (IMPL-007)**.
- 실제 일러스트 제작(각 튜토리얼 비유, 사례 카드 26종) → 각 해당 Phase에서.
- `tmux/` 원본 파일의 어떠한 수정 (REQ-011 위반).

---

## 6. 아키텍처 결정 (Architecture Decisions)

### 6.1 CSS 5-way 분할 채택 (tmux 단일 파일 방식 배격)

**결정**: design-guide와 ia-sitemap이 정의한 5개 CSS 분할(`tokens` / `base` / `layout` / `components` / `pages`)을 채택한다. tmux의 단일 `style.css`(1718줄) 방식을 따르지 않는다.

**근거**: 27페이지 × 단일 style.css는 예상 3000줄+ 파일을 만들어 유지보수가 불가능하다. tmux 단일 파일 방식은 단일 페이지에만 적합하다. 분할하더라도 `tokens.css`의 변수명을 tmux와 동일하게 유지하면 시리즈 시각적 결속(사용자 눈에 보이는 톤)은 달성된다. "시리즈 결속"은 파일 구조가 아니라 렌더링 결과의 톤이다(research.md 섹션 4.1).

### 6.2 "재사용"의 정확한 정의

기획 문서의 "tmux reveal.js 재사용" 표현을 다음으로 정정(research.md 섹션 4.2):

- tmux `js/main.js`에서 IntersectionObserver 로직과 scroll-event 진행률 로직을 **추출(extract)**하여 별도 모듈 파일(`reveal.js`, `progress.js`)로 **재포장(repackage)**.
- 추출 후 동작은 동일하되, P1에서는 `fake-terminal` 로직은 제외(P3 범위).
- tmux 원본 파일은 절대 직접 import하거나 수정하지 않는다(REQ-011).

### 6.3 신규 컴포넌트 (tmux에 대응물 없음)

GlobalHeader, GlobalFooter, Breadcrumb, PrevNextPager, SidebarTOC, 트랙 전체 진행률(localStorage)은 멀티페이지 구조 전용 신규 컴포넌트로, tmux(단일 페이지)에서 가져올 참조 구현이 없다. P1에서 순수 신규 작성한다.

### 6.4 변수명 관습 + 인디고 값 통일 (annotation 결정)

- **변수명**: tmux `:root`의 단순명 관습(`--primary`, `--accent`, `--note-metaphor` 식)을 그대로 따른다. SPEC 초안의 서술적 이름(`--primary-coral`, `--sn-metaphor`)은 폐기. 이유: REQ-001 시리즈 결속을 문자 그대로 충족하고 tmux `:root` 복사가 단순해짐.
- **인디고 accent 값**: design-guide 섹션 2.1의 `#3D5AFE`를 정식 채택. tmux 구현의 `#3D5FE0`은 오타로 판단(0/F 전위). 향후 tmux 사이트 소급 수정을 별도 권장(본 SPEC 범위 외, REQ-011 준수).

---

## 7. 리스크 (Risks)

| 리스크 | 영향 | 완화 |
|---|---|---|
| tmux `main.js` 로직 추출 시 의도치 않은 회귀 | tmux 자매 사이트 파손 | 추출은 본 사이트 디렉토리 내 사본에서 수행. tmux 원본 미수정(REQ-011). |
| `tokens.css` 변수명 동기화 누락 → 시리즈 톤 이탈 | tmux와 시각적 일관성 상실 | tmux `style.css` `:root` 변수를 그대로 복사. 변수명 일치 여부를 REQ-001로 수용 기준에 명시. |
| P1 검증 HTML(`index.html`)이 너무 단순하면 후속 Phase에서 재작업 | P2~P5 낭비 | 검증 HTML은 4 템플릿 골격을 포함하되 빈 캔버스로 제공. 구조는 완비, 본문만 채우면 되도록 설계. |
| 빌드 단계 없는 5 CSS + 3 JS 관리 → 반복/불일치 | link 순서 오류, 변수 누락 | P1에서 CSS link 순서(`tokens` → `base` → `layout` → `components` → `pages`)와 JS 로드 순서(`nav` → `progress` → `reveal`)를 확정. 모든 HTML은 동일 순서 사용. |

---

## 8. 의존성 (Dependencies)

- **SPEC-GIT-GITHUB-GUIDE-001 기획 산출물**(입력): `roadmap.md` P1 항목, `design-guide.md`(섹션 2 컬러, 3 타이포, 7 컴포넌트 인벤토리), `ia-sitemap.md`(섹션 3 파일 트리, 4 내비게이션 시스템), `spec.md`(오디언스 계약, 시리즈 결속, 멀티페이지 제약).
- **SPEC-TMUX-GUIDE-001 tmux 사이트**(참조 구현, 읽기 전용): `tmux/css/style.css`(`:root` 변수 추출 소스), `tmux/js/main.js`(IntersectionObserver·scroll-event 로직 추출 소스). 원본 수정 금지(REQ-011).

---

## 9. 관련 산출물 (Related)

- `research.md`(본 SPEC 디렉토리) — tmux 역분석, 재사용 vs 신규 자산 매트릭스, P1 범위 정의의 근거.
- SPEC-GIT-GITHUB-GUIDE-001 산출물군: `spec.md`, `roadmap.md`, `design-guide.md`, `ia-sitemap.md`, `content-plan.md`, `cases-gallery.md`.
- SPEC-TMUX-GUIDE-001 — tmux 자매 사이트 원본. 시리즈 결속의 기준점.
- 후속 구현 SPEC: IMPL-002(P2 홈+검색), IMPL-003(P3 튜토리얼 21), IMPL-004(P4 참조 4), IMPL-005(P5 사례 갤러리), IMPL-006(P6 Git 특화 자산), IMPL-007(P7 QA/접근성).

---

## HISTORY

- 2026-06-19: 최초 작성. SPEC-GIT-GITHUB-GUIDE-001 roadmap P1을 구현 단계로 정식화. research.md의 CSS 5분할 결정과 "재사용 = 추출·재포장" 정의를 반영. 11개 EARS 수용 기준 확정(REQ-001~REQ-011). P2~P7을 명시적 범위 외로 지정.
- 2026-06-19: annotation cycle 1차 통과. tmux `style.css` `:root` 실제 변수명 검증 결과 초안의 서술적 변수명(`--primary-coral`, `--sn-*`)을 tmux 단순명 관습(`--primary`, `--note-*`)으로 통일(결정 6.4, REQ-001 보강). 인디고 accent 값을 design-guide `#3D5AFE`로 확정(tmux `#3D5FE0` 오타 판정). 신규 변수 `--note-case`, `--git-green`, `--village-indigo`만 본 사이트 고유로 추가.
- 2026-06-19: Run+Sync 완료. 사이트 루트 `git-github/` 신규 디렉토리에 9개 산출물(5 CSS + 3 JS + index.html) 납품. REQ-001~011 독립 검증 전부 통과(tokens 변수명 diff, CSS/JS 로드 순서, side-note 6종 색상, WCAG AA 대비 13.85:1/12.73:1/4.98:1, tmux 원본 mtime 무결성). 진행 상세는 progress.md.

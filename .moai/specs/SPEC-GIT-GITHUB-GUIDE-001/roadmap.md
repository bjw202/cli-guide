---

## id: SPEC-GIT-GITHUB-GUIDE-001/roadmap version: 1.0.0 status: Planned created: 2026-06-19 updated: 2026-06-19 author: jw priority: High

# 로드맵 — 비개발자를 위한 Git/GitHub 멀티페이지 가이드

> **PLANNING ONLY — 본 단계에서는 실행하지 않는다**.본 파일은 향후 **구현 Phase**를 위한 단계 분할이다. 시간 추정은 금지(MoAI 규칙) — Priority/Phase 순서로만 표현.

---

## 0. 전제

- 본 사이트는 **정적 멀티페이지**(27페이지: 홈 1 + 튜토리얼 21 + 참조 4 + 사례 1).
- 빌드 단계 없음. 순수 HTML/CSS/Vanilla JS. `file://`로 바로 열림.
- **SPEC-TMUX-GUIDE-001 (tmux 가이드)와 디자인 패밀리 공유** — 토큰/폰트/side-note 박스/따뜻한 톤 재사용.
- Phase는 P1\~P7. 각 Phase는 이전 Phase의 결과에 의존.

---

## 1. Phase 개요

| Phase | 이름 | 핵심 산출물 | 의존 |
| --- | --- | --- | --- |
| P1 | 공유 셸 + 디자인 시스템 + 내비 스캐폴딩 | tokens.css, base.css, layout.css, components.css(6종 side-note), GlobalHeader/Footer/Breadcrumb/Pager/TOC, ReadingProgress | 없음 |
| P2 | 홈 허브 + IA + 검색 | index.html(ThreeDoors, CasePreview, SeriesLink), search-index.json, SearchOverlay, search.js | P1 |
| P3 | 튜토리얼 페이지 일괄 (T01\~T21) | 21개 튜토리얼 HTML + 본문 + side-note + FakeTerminal(확장) + CommandPill + CodeBlock | P1, P2 |
| P4 | 참조 페이지 (R01\~R04) | command-dictionary, glossary, faq, cheatsheet HTML + CommandDictionaryItem/GlossaryItem/FAQItem | P1, P3 |
| P5 | 사례 갤러리 + 필터 | cases/index.html + CaseCard + CaseFilterBar + 26개 사례 데이터 | P1, P3 |
| P6 | 인터랙티브 자산 (Git 특화) | GitGraphVisualizer, StagingFlowDiagram, PRFlowDiagram, ActionsPipelineAnimation, OhShitGitSimulator, ConflictResolverMini, GlossaryTooltip | P3, P4 |
| P7 | QA + 접근성 + 크로스 브라우저 + 성능 | 전체 검증, a11y 오류 0, 크로스 브라우저, Lighthouse, prefers-reduced-motion | P1\~P6 |

---

## 2. Phase별 상세

### P1 — 공유 셸 + 디자인 시스템 + 내비 스캐폴딩 (Priority: High, 선행)

**목표**: 모든 페이지의 뼈대가 되는 공유 CSS/JS와 내비게이션 컴포넌트를 만든다.

**산출물 (Deliverables)**:

- `css/tokens.css` — 시리즈 공유 토큰(크림/코랄/인디고/민트) + Git 액센트(따뜻한 초록 #2E7D52).
  - 모든 색 CSS 변수화. tmux 사이트와 동일 변수명으로 시리즈 일관성.
- `css/base.css` — reset, 한국어 본문 타이포(line-height 1.7, word-break: keep-all).
- `css/layout.css` — GlobalHeader/Footer 고정, Breadcrumb, 2단 레이아웃(본문+TOC), 반응형 중단점.
- `css/components.css` — side-note 박스 6종(5 시리즈 공유 + 1 사례 콜아웃), CommandPill, CodeBlock, ComparisonTable.
- `css/pages.css` — 4 템플릿(홈/튜토리얼/참조/사례)별 페이지 스타일.
- `js/nav.js` — GlobalHeader(학습트랙/참조/사례 드롭다운, 시리즈 링크), 햄버거 토글, Breadcrumb 생성.
- `js/progress.js` — 현재 페이지 진행률(상단 2px 바) + 트랙 전체 진행률(localStorage, "T03/21 · 14%").
- `js/reveal.js` — IntersectionObserver 스크롤 리빌. **tmux 사이트의 reveal.js 재사용**.

**의존**: 없음 (가장 먼저).

**수용 기준 (Acceptance)**:

- 어느 빈 HTML에도 GlobalHeader/Footer가 붙어 정상 동작.
- 6종 side-note 박스가 시리즈 톤(따뜻한 노랑/베이지/민트/코랄/라벤더/연초록)으로 렌더링.
- ReadingProgress가 스크롤 시 부드럽게 갱신. 트랙 진행률이 새로고침 후에도 유지.
- 모바일(768px 이하)에서 햄버거 메뉴 정상 동작.
- `prefers-reduced-motion: reduce`에서 reveal 모션 축소.

---

### P2 — 홈 허브 + IA + 검색 (Priority: High)

**목표**: 사이트의 현관(index.html)과 전역 검색을 만든다.

**산출물**:

- `index.html` — 홈 허브 템플릿:
  - HeroBlock (큰 일러스트: commit 그래프가 나무처럼 뻗는 모습 + 헤드라인 + "두 길을 드려요").
  - ThreeDoors (튜토리얼 트랙 / 참조 허브 / 사례 갤러리 세 큰 문 카드).
  - CasePreview (사례 미리보기 3카드: 소설가·법률가·리눅스 커널).
  - SeriesLink (이 시리즈의 다른 글: tmux 가이드 + 현재 사이트).
  - 검색창.
- `js/search-index.json` — 사전 빌드된 검색 인덱스:
  - 모든 페이지(27) 제목 + 요약.
  - 주요 git 명령어 + 옵션.
  - 용어집 항목.
  - 사례 카드 26개.
- `js/search.js` — 클라이언트 사이드 검색:
  - 검색 오버레이 UI. Ctrl+K / `/` 단축키.
  - 결과 분류 탭(튜토리얼/참조/사례/명령어).
  - 키보드 탐색(↑↓Enter).
- `SearchOverlay` 컴포넌트.

**의존**: P1 (GlobalHeader, tokens).

**수용 기준**:

- 홈에서 세 문 카드 각각 클릭 시 올바른 영역 첫 페이지로 이동.
- 검색에서 "merge" 입력 → T07, R01#git-merge, R02#merge, 사례 T1-08 등 관련 결과 모두 반환.
- 검색 결과 키보드로 탐색 가능. 스크린 리더가 결과 개수 안내.
- 검색 인덱스가 27페이지 모두 커버 (빠진 페이지 없음).

---

### P3 — 튜토리얼 페이지 일괄 (T01\~T21) (Priority: High, 분량 집중)

**목표**: 21개 튜토리얼 페이지의 본문 + side-note + 기본 자산을 만든다.

**산출물**:

- 21개 HTML 파일 (`tutorial/git-*.html`, `tutorial/github-*.html`).
- 각 페이지:
  - PageHeader(제목 + 서브헤드 + Breadcrumb).
  - SidebarTOC(현재 페이지 섹션 + 스크롤 스파이).
  - 본문 섹션 (content-plan.md의 페이지별 카피 방향 기반 라이팅).
  - side-note 박스 3\~6개 (비유/역사/팁/주의/알아두면/사례 콜아웃 혼합).
  - CommandPill (`git status` 등), CodeBlock (필요 시).
  - PrevNextPager (T01→T02→...→T21).
  - FakeTerminal (T03, T04, T09 등 명령 실습 페이지).
  - "사례 콜아웃" 박스 → 사례 갤러리 해당 카드로 링크.
  - 페이지 하단 치트시트 카드 (해당 페이지 명령 요약).
- `js/fake-terminal.js` — **tmux 사이트의 fake-terminal 패턴 재사용 + git 명령 스크립트 확장**.

**의존**: P1 (셸, side-note), P2 (검색, 페이저 연결).

**수용 기준**:

- 21페이지 모두 content-plan.md의 커버리지 체크리스트(G1\~G65, H1\~H61) 대응 항목 누락 없이 다룸.
- 모든 기술 용어 첫 등장 앞에 "비유 박스" 1개 (오디언스 계약).
- 모든 git 명령어/옵션이 git-scm.com/docs와 일치 (팩트 검증).
- 모든 GitHub 기능명이 docs.github.com과 일치.
- PrevNextPager가 T01→T21 순서로 정확 연결.
- 사례 콜아웃 박스가 cases-gallery.md의 교차 맵과 일치.
- 가짜 터미널 데모가 `git init`/`status`/`add`/`commit`/`log` 흐름을 재생.

**참고**: P3은 분량이 가장 크다. 내부적으로 하위 배치(T01\~T05 → T06\~T08 → T09\~T13 → T14\~T17 → T18\~T21)로 나누어 진행 권장.

---

### P4 — 참조 페이지 (R01\~R04) (Priority: Medium)

**목표**: 재방문자용 점프 허브 4페이지를 만든다.

**산출물**:

- `ref/command-dictionary.html` (R01):
  - 검색/필터 바(알파벳 | 주제 | 난이도).
  - CommandDictionaryItem 카드 리스트 (git 명령어 전부 + 주요 github 기능).
  - 각 항목: 명령어 + 한 줄 설명 + 주제/난이도 태그 + "튜토리얼 TXX로 →" 링크.
- `ref/glossary.html` (R02):
  - GlossaryItem 리스트 (commit, branch, HEAD, PR, rebase 등 모든 용어).
  - 각 항목: 용어 + 일상 비유 1문장 + 공식 정의 + "튜토리얼 TXX로 →".
  - 앵커(`#branch`)로 직접 링크 가능.
- `ref/faq.html` (R03):
  - FAQItem 아코디언 (자주 묻는 질문 — content-plan.md의 "Oh Shit Git" 패턴 기반).
- `ref/cheatsheet.html` (R04):
  - 인쇄용 단일 페이지 치트시트 (주제별 카드: 기본/브랜치/원격/복구/고급/github).

**의존**: P1, P3 (용어/명령어 정의는 튜토리얼에서 확정된 후).

**수용 기준**:

- 명령어 사전이 git-scm.com/docs의 주요 명령 전부 커버.
- 용어집이 content-plan.md에서 정의한 모든 용어 커버.
- FAQ가 비개발자 실제 질문 15+건 다룸 (reset 차이, force push 위험, .env 실수, 충돌, 잃어버린 커밋 등).
- 치트시트가 A4 인쇄 시 가독성 유지.
- 모든 참조 페이지의 "튜토리얼 TXX로 →" 링크가 정확.

---

### P5 — 사례 갤러리 + 필터 (Priority: High, 시그니처)

**목표**: 시그니처 기능인 사례 갤러리를 만든다.

**산출물**:

- `cases/index.html` — 사례 갤러리 템플릿:
  - CaseFilterBar (Tier: 전체/비개발/전문가, Domain: 작가/디자인/연구/법률/..., Feature: commit/branch/PR/...).
  - CaseCard 그리드 (26개 카드: Tier 1 14개 + Tier 2 12개).
  - 각 카드: 따뜻한 일러스트 + 한 줄 설명 + 보여주는 기능 태그 + "관련 튜토리얼 TXX" 링크.
- `js/cases-filter.js` — 필터 로직 (Tier/Domain/Feature 조합).
- 26개 사례 데이터 (cases-gallery.md의 스키마 기반 JSON 또는 인라인).
- 26개 일러스트 (따뜻한 톤, tmux 일러스트와 동일 스타일).

**의존**: P1, P3 (튜토리얼 링크 타겟 확정 후).

**수용 기준**:

- 26개 사례가 cases-gallery.md 카탈로그와 1:1 대응.
- 필터(Tier/Domain/Feature) 조합이 정확히 동작.
- 각 카드의 "관련 튜토리얼" 링크가 교차 맵(cases-gallery.md 섹션 4)과 일치.
- 튜토리얼 페이지의 "사례 콜아웃"이 정확한 카드 앵커로 연결 (`cases/index.html#t1-01`).
- 모바일에서 카드 그리드가 1\~2열로 정상 렌더링.

---

### P6 — 인터랙티브 자산 (Git 특화) (Priority: Medium, 품질 차별화)

**목표**: design-guide.md가 정의한 Git 특화 인터랙티브 자산을 구현한다.

**산출물**:

- `js/git-graph.js` + `GitGraphVisualizer` 컴포넌트 — 인터랙티브 commit 그래프 (브랜치 갈라짐/병합/rebase 애니메이션). T06/T07/T08에 삽입.
- `js/staging-flow.js` + `StagingFlowDiagram` — 3개 방 다이어그램 (working/staging/repo 파일 이동 애니메이션). T04에 삽입.
- `js/pr-flow.js` + `PRFlowDiagram` — PR 워크플로우 애니메이션 (fork→branch→commit→push→PR→review→merge). T15/T16에 삽입.
- `js/actions-pipeline.js` + `ActionsPipelineAnimation` — CI/CD 파이프라인 애니메이션 (event→job→step→artifact→deploy). T18에 삽입.
- `js/oh-shit-git.js` + `OhShitGitSimulator` — 실수 복구 시뮬레이터 (7개 시나리오, content-plan.md T11 기반). T11에 삽입.
- `js/conflict-resolver.js` + `ConflictResolverMini` — 충돌 해결 미니 인터랙션. T07에 삽입.
- `js/glossary-tooltip.js` + `GlossaryTooltip` — 용어 hover/focus 툴팁 (R02 용어집 연동). 모든 튜토리얼 페이지 용어에 적용.

**의존**: P3 (자산이 삽입될 튜토리얼 완성 후), P4 (GlossaryTooltip은 R02 용어집 연동).

**수용 기준**:

- GitGraphVisualizer가 main → feature 갈라짐 → merge 합류를 시각적으로 재현.
- OhShitGitSimulator가 content-plan.md T11의 7개 시나리오 각각에 정확한 복구 명령 + 설명 제공.
- 모든 자산이 `prefers-reduced-motion: reduce`에서 모션 축소.
- 모든 자산이 키보드로 조작 가능 (탭/엔터).
- GlossaryTooltip이 R02 용어집과 일치하는 정의 표시.

---

### P7 — QA + 접근성 + 크로스 브라우저 + 성능 (Priority: High, 마무리)

**목표**: 전체 사이트 품질 보증.

**산출물**:

- 접근성 감사:
  - WCAG AA 색 대비 검증 (따뜻한 톤이라도 4.5:1 유지).
  - 스크린 리더 테스트 (VoiceOver/NVDA).
  - 키보드 전용 탐색 테스트 (모든 인터랙티브 요소).
  - 일러스트 `alt` / `aria-describedby` 검증.
- 크로스 브라우저 테스트:
  - Chrome, Firefox, Safari, Edge 최신 버전.
  - iOS Safari, Android Chrome 모바일.
- 성능 검증:
  - Lighthouse 점수 (Performance 90+, Accessibility 95+, Best Practices 95+).
  - 이미지 최적화(WebP/SVG).
  - JS 번들 크기 (빌드 없이 각 페이지 &lt; 50KB JS).
  - 검색 인덱스 로드 지연.
- 기능 검증:
  - 27페이지 모든 내부 링크 정상 (깨진 링크 0).
  - 모든 앵커(`#xxx`) 정상 이동.
  - localStorage 진행률 새로고침 후 유지.
  - 검색이 모든 페이지를 반환.
- 모바일 최종 검증:
  - 320px \~ 768px 반응형 중단점 점검.
  - 햄버거 메뉴, 하단 바, 사이드바 TOC 접기 정상.
- 시리즈 결속 검증:
  - tmux 가이드와의 시각적 일관성 (토큰/폰트/side-note 톤).
  - "이 시리즈의 다른 글" 양방향 링크 정상.

**의존**: P1\~P6 전부.

**수용 기준**:

- 접근성: WCAG AA 준수, 스크린 리더로 모든 콘텐츠 접근 가능.
- 크로스 브라우저: 주요 4개 브라우저 + 2개 모바일 브라우저에서 동일 동작.
- 성능: Lighthouse Performance 90+, 첫 페이지 로드 2초 이내(정적 호스팅 기준).
- 기능: 깨진 내부 링크 0, 깨진 앵커 0.
- 품질: 비개발자 리뷰어 1\~2명이 "처음부터 끝까지 읽을 수 있다" 확인 (선택).

---

## 3. 시리즈 자산 재사용 요약 (Cross-Reuse from tmux site)

> tmux 사이트(SPEC-TMUX-GUIDE-001)에서 **재사용**하여 일관성·효율 확보.

| 자산 | 재사용 | 비고 |
| --- | --- | --- |
| 컬러 토큰 (크림/코랄/인디고/민트) | 그대로 | `tokens.css` 시리즈 공유. Git 액센트(초록)만 추가. |
| 폰트 패밀리 (Pretendard + JetBrains Mono) | 그대로 | 시리즈 일관성. |
| side-note 박스 5종 | 그대로 | 6번째(사례 콜아웃)만 신규 추가. |
| `reveal.js` (스크롤 리빌) | 그대로 | IntersectionObserver 로직 동일. |
| `fake-terminal.js` 패턴 | 재사용+확장 | git 명령어 스크립트 추가. |
| `CheatSheetCard` 패턴 | 재사용+확장 | 튜토리얼 하단 + R04 페이지로. |
| `FAQItem` 아코디언 | 그대로 | R03에 사용. |
| 따뜻한 일러스트 스타일 | 재사용+확장 | Git/GitHub 테마 일러스트 추가. |
| 친근한 마이크로 인터랙션 (hover/transition) | 그대로 | 시리즈 톤 유지. |

**재사용 비율**: 디자인 시스템·톤·기본 컴포넌트 약 60% 재사용, 멀티페이지 구조·Git 특화 자산 약 40% 신규.

---

## 4. 위험 및 완화 (Risks)

| 위험 | 영향 | 완화 |
| --- | --- | --- |
| 27페이지 분량으로 P3 분산 | 일관성 저하 | P3을 5개 하위 배치로 분할. 공유 컴포넌트(P1) 먼저 확정. |
| 빌드 단계 없는 27페이지 관리 | 반복·불일치 | 공유 css/js로 스타일 일원화. 페이지별 본문만 개별 관리. |
| 클라이언트 사이드 검색 품질 | 사용자 실망 | search-index.json을 정제(제목+요약+키워드). 결과 분류로 가독성 확보. |
| Git 인터랙티브 자산(graph/pipeline) 복잡도 | 구현 지연 | P6를 별도 Phase로 분리. 핵심 자산(GitGraph, OhShitGit) 우선, 부가 자산은 선택. |
| tmux 사이트와의 시각적 일관성 | 시리즈 결속 저해 | tokens.css를 두 사이트가 동일 변수명으로 공유. P1에서 시리즈 톤 먼저 확정. |
| 일러스트 26+개 제작 분량 | P5 지연 | 일러스트 스타일을 tmux와 동일 톤으로 단순화. 우선순위 카드부터. |

---

## 5. Phase 의존 그래프

```
P1 (셸+디자인+내비)
  │
  ├─→ P2 (홈+검색)
  │     │
  │     └─→ P3 (튜토리얼 21)
  │           │
  │           ├─→ P4 (참조 4)
  │           │
  │           └─→ P5 (사례 갤러리)
  │                 │
  │                 └─→ P6 (인터랙티브 자산)
  │                       │
  │                       └─→ P7 (QA/접근성/성능)
  │
  └─→ (P1은 모든 Phase의 기반)
```

---

## 6. 추후 구현 Phase 시작 전 확인 사항

본 roadmap은 PLANNING ONLY. 구현 Phase 시작 시:

1. 본 SPEC 문서 6종(spec/ia-sitemap/content-plan/design-guide/cases-gallery/roadmap) 재확정.
2. SPEC-TMUX-GUIDE-001의 tokens.css/fake-terminal.js/reveal.js를 가져와 재사용 기반 확보.
3. P1부터 순차 진행. 각 Phase 종료 시 수용 기준 체크리스트 확인.
4. 팩트 검증: git 명령어는 git-scm.com/docs, GitHub 기능은 docs.github.com과 일치 재확인.

---

## HISTORY

- 2026-06-19: 최초 작성. PLANNING ONLY 명시. 7 Phase(P1\~P7)로 분할. tmux 사이트 자산 재사용 약 60%, 신규 약 40%. 시간 추정 금지, Priority/Phase 순서만.
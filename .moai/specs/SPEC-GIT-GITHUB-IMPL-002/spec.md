---
id: SPEC-GIT-GITHUB-IMPL-002
version: 1.0.3
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

# SPEC — P2: 홈 허브 + IA + 클라이언트 사이드 검색

> 본 SPEC은 SPEC-GIT-GITHUB-GUIDE-001(기획 산출물)의 roadmap P2를 구현 단계로 정식화한 것이다.
> P2는 IMPL-001(P1 공유 셸)이 완료된 후 진행되며, IMPL-003~IMPL-007과 병렬 계획 가능하다.
> **Lightweight SPEC** — research.md는 작성하지 않고 IMPL-001/research.md를 공유 참조 소스로 사용한다.

---

## 1. 목표 (Goal)

사이트의 현관인 `index.html` 홈 허브를 납품한다. 허브는 HeroBlock(commit 그래프-나무 일러스트 자리표시자 + 헤드라인 + "두 길을 드려요" 서브헤드 + 검색창), ThreeDoors(세 큰 문 카드: Tutorial Track / Reference Hub / Cases Gallery), CasePreview(소설가·법률가·리눅스 커널 사례 미리보기 3카드), SeriesLink(tmux + 현재 사이트)로 구성된다. 허브와 함께 클라이언트 사이드 검색(`search-index.json` + `search.js` + `SearchOverlay`)을 납품하여, 27페이지 규모에서 "필요한 것 찾기"가 빌드 없이 `file://`로 동작하도록 한다.

---

## 2. 배경 (Background)

본 SPEC은 SPEC-GIT-GITHUB-IMPL-001(P1 공유 셸)이 납품한 디자인 시스템·내비게이션·진행률 셸 위에 올라간다. P1이 납입한 `tokens.css`(시리즈 공유 토큰: `--primary: #FF8A5B`, `--accent: #3D5AFE`, `--secondary: #26A69A`, side-note 5종 + 신규 `--note-case: #E8F5EE`, `--git-green: #2E7D52`, `--village-indigo: #5B6CFF`), `nav.js`(GlobalHeader), `progress.js`, `components.css`(side-note 박스, CommandPill, CodeBlock), `pages.css`(`.tpl-home` 골격)을 그대로 상속받아 본문만 채운다.

공유 컨텍스트(tmux 역분석, 재사용 자산 매트릭스, "추출-재포장" 정의, tmux 원본 무결성 규칙)는 **IMPL-001/research.md**를 단일 소스로 참조한다. 본 SPEC은 research.md를 중복 작성하지 않는다(경량화 원칙).

검색은 design-guide 섹션 5.L이 정의한 대로 단순한 "사전 빌드된 JSON 인덱스 + JS 필터" 방식이다. 퍼지 매칭 라이브러리·서버·인덱서 없이 멀티페이지 사이트에서 가장 단순하게 동작하는 구현을 목표로 한다(과잉 엔지니어링 회피, MoAI 핵심 행동 4 "Enforce Simplicity").

---

## 3. 산출물 (Deliverables)

### 3.1 `index.html` (P1 placeholder 교체)

P1이 남겨둔 빈 canvas placeholder를 홈 허브 본문으로 교체한다. 헤더의 5 CSS + 3 JS link/load 순서와 P1 셸 구조는 그대로 유지(REQ-001 계승). `.tpl-home` 컨테이너 내에 다음 블록을 추가:

- **HeroBlock**: 헤드라인("Git과 GitHub, 한 권의 친절한 안내서" 방향 — content-plan HOME) + 서브헤드("두 길을 드려요" 방향) + commit 그래프가 나무처럼 뻗는 일러스트 자리표시자(P2는 자리만, 최종 아트는 아님 — 범위 외) + 헤더 검색 입력(`#search-input`).
- **ThreeDoors**: 세 큰 문 카드. 각각 올바른 영역 첫 페이지로 링크:
  - Tutorial Track → `tutorial/git-concept.html` (T01)
  - Reference Hub → `ref/command-dictionary.html` (R01)
  - Cases Gallery → `cases/index.html`
- **CasePreview**: 사례 미리보기 카드 3개(소설가 T1-01 · 법률가 · 리눅스 커널) — 각 카드는 `cases/index.html#t1-01` 등 앵커로 링크.
- **SeriesLink**: tmux 자매 사이트 + 현재 사이트 카드 2개(ia-sitemap 섹션 4.7).

### 3.2 검색 인덱스 데이터 (인라인 임베드)

사전 빌드된 정적 검색 인덱스. 항목 스키마: `{ type, id, title, summary, url, keywords? }`. `type`은 `tutorial | reference | case | command | glossary`. 커버 범위:

> **로드 전략 (annotation 결정)**: 인덱스 데이터는 별도 `.json` fetch가 아니라 **`index.html`에 `<script type="application/json" id="search-index">`로 인라인 임베드**한다. 이유: 본 사이트는 `file://`로 직접 열림(REQ-009)이 하드 요구사항인데, `fetch()`는 `file://`에서 CORS로 차단된다. 인라인 임베드면 추가 HTTP 요청 없이 `JSON.parse(document.getElementById('search-index').textContent)`로 즉시 로드된다. 인덱스 분량(27페이지 + 명령어/용어/사례, 예상 수십 KB)은 HTML 내 허용 범위.

- 27페이지 전부(홈 1 + 튜토리얼 21 + 참조 4 + 사례 1)의 제목 + 요약.
- 주요 git 명령어 + 옵션(`git merge`, `git merge --no-ff`, `git rebase`, `git reset` 등 — `type: command`, `url`은 R01 `#git-merge` 앵커).
- 용어집 항목(commit, branch, HEAD, PR, rebase 등 — `type: glossary`, `url`은 R02 `#merge` 앵커).
- 사례 카드 26개(Tier 1 14 + Tier 2 12 — `type: case`, `url`은 `cases/index.html#t1-08` 식).

> P2 시점에 튜토리얼/참조/사례 페이지 본문이 아직 존재하지 않으므로, 인덱스의 title/summary는 content-plan.md의 페이지별 카피 방향과 cases-gallery.md 카탈로그에서 추출한다(최종 페이지가 완성되면 IMPL-003~005에서 인덱스 정제).

### 3.3 `js/search.js`

클라이언트 사이드 검색 로직. 단순 문자열 매칭(대소문자 무시, 키워드 포함 여부). 외부 라이브러리 없음.

- 인라인 임베드된 인덱스 로드: `JSON.parse(document.getElementById('search-index').textContent)` (load 시 1회, fetch 미사용).
- 검색 입력 변경 시 입력 즉시 결과 필터링(debounce 최소).
- 결과 분류 탭: tutorial / reference / case / command(glossary는 reference 탭에 흡수 또는 별도 — P2 구현 시 선택, design-guide는 4개 탭 명시).
- 키보드 탐색: `↑`/`↓`로 결과 이동, `Enter`로 이동, `Esc`로 닫기.
- 단축키: `Ctrl+K`(또는 macOS `Cmd+K`)와 `/`(입력 필드에 포커스 없을 때)로 SearchOverlay 열기.

### 3.4 `SearchOverlay` 컴포넌트

- CSS는 `components.css`에 추가(SearchOverlay 블록). JS는 `search.js`에서 DOM 제어.
- 전체 화면 오버레이, 상단 입력창, 분류 탭, 결과 리스트.
- 접근성: `role="dialog"`, `aria-modal="true"`, 입력창 `aria-label`, 결과 영역 `aria-live="polite"`로 개수 안내(예: "5개 결과").

---

## 4. 수용 기준 (Acceptance Criteria, EARS)

> 키워드(UBIQUITOUS, WHEN, WHILE, IF, THEN, WHERE, SHALL)는 영어로 유지. 본문은 한국어.

- **REQ-001 (P1 셸 상속)**: UBIQUITOUS — `index.html`은 IMPL-001이 납입한 5개 CSS(`tokens` → `base` → `layout` → `components` → `pages`)와 3개 JS(`nav` → `progress` → `reveal`)를 동일 순서로 link/load SHALL. 토큰 변수명(`--primary`, `--accent`, `--note-*`, `--git-green` 등)은 IMPL-001/REQ-001의 시리즈 결속 규칙을 변경 없이 계승.

- **REQ-002 (세 문 카드 링크 정확성)**: WHEN 사용자가 ThreeDoors의 세 카드 중 하나를 클릭하면, THEN Tutorial Track 카드는 `tutorial/git-concept.html`(T01), Reference Hub 카드는 `ref/command-dictionary.html`(R01), Cases Gallery 카드는 `cases/index.html`로 각각 이동 SHALL.

- **REQ-003 (검색 — merge 쿼리)**: WHEN 사용자가 검색 입력창에 "merge"를 입력하면, THEN 결과에 최소 T07(git-merge 튜토리얼), R01 명령어 사전의 `git-merge` 항목, R02 용어집의 merge 항목, 사례 T1-08(게이머 세이지·롤백, cases-gallery 교차 맵에서 T07과 연계)가 모두 포함 SHALL.

- **REQ-004 (검색 인덱스 전체 커버)**: UBIQUITOUS — `js/search-index.json`은 27페이지(홈 1 + 튜토리얼 21 + 참조 4 + 사례 1) 전부의 항목을 누락 없이 포함 SHALL. (P2 시점에는 title/summary가 content-plan 방향 기준이며, IMPL-003~005에서 정제.)

- **REQ-005 (키보드 탐색)**: WHEN SearchOverlay가 열려 있고 결과가 표시 중이면, THEN `↑`/`↓` 키로 결과 항목 간 이동이 가능하고 `Enter`로 선택 항목 페이지로 이동하며 `Esc`로 오버레이가 닫히 SHALL. 포커스가 보이는 항목은 시각적으로 구분.

- **REQ-006 (스크린 리더 결과 개수 안내)**: WHEN 검색 결과가 갱신되면, THEN 결과 영역의 `aria-live` 영역이 "N개 결과" 형식으로 스크린 리더에 안내 SHALL.

- **REQ-007 (단축키)**: WHEN 사용자가 `Ctrl+K`(macOS `Cmd+K`)를 누르거나, 입력 필드에 포커스가 없을 때 `/`를 누르면, THEN SearchOverlay가 열리고 입력창에 포커스 SHALL.

- **REQ-008 (SeriesLink — tmux 자매 사이트)**: UBIQUITOUS — `index.html`의 SeriesLink 블록은 tmux 자매 사이트(SPEC-TMUX-GUIDE-001)로의 링크 카드와 현재 사이트 카드를 포함 SHALL (ia-sitemap 섹션 4.7, 시리즈 결속).

- **REQ-009 (빌드 없음 + file:// 검색 동작)**: UBIQUITOUS — 본 SPEC의 모든 산출물은 빌드 단계 없이 `file://` 프로토콜로 브라우저에서 직접 열릴 SHALL. 검색 인덱스는 `fetch()`가 아닌 `index.html` 내 `<script type="application/json" id="search-index">` 인라인 임베드로 로드하여 `file://` CORS 제약을 원천 회피 SHALL.

- **REQ-010 (prefers-reduced-motion)**: WHILE 운영체제 설정이 `prefers-reduced-motion: reduce`이면, THEN SearchOverlay의 열림/닫힘 트랜지션과 결과 등장 모션이 즉시 표시(transition 없음)로 축소 SHALL.

- **REQ-011 (WCAG AA 색 대비)**: UBIQUITOUS — 홈 허브 본문·문 카드·검색 결과 텍스트와 배경 간 색 대비는 WCAG AA(일반 텍스트 4.5:1 이상)를 충족 SHALL. 따뜻한 톤(`#FFFBF5` 위 `#2D2A26` 등)에서 대비를 희생하지 않는다.

- **REQ-012 (tmux 원본 무결성 — IMPL-001/REQ-011 계승)**: UBIQUITOUS — 본 SPEC의 어떤 산출물도 `tmux/` 디렉토리 원본 파일을 수정하지 SHALL NOT.

- **REQ-013 (검색 인덱스 무결성 — 커버리지 체크리스트 바인딩, 회귀 방지)**: UBIQUITOUS — 검색 인덱스(REQ-009에 따라 `<script type="application/json" id="search-index">` 인라인 임베드)는 SPEC-GIT-GITHUB-GUIDE-001/content-plan.md 섹션 4 커버리지 체크리스트(G1~G65, H1~H61)가 정의하는 모든 git/GitHub 명령·용어·사례와, SPEC-GIT-GITHUB-IMPL-003(튜토리얼)이 가르치는 모든 git/GitHub 명령·용어·사례를 누락 없이 포함 SHALL. 인덱스 항목 수는 임의 큐레이션이 아니라 상기 커버리지 체크리스트에 바운드(bound)되며, 인덱스의 `command`/`glossary`/`case` 항목은 해당 체크리스트의 모든 항목과 1:1 매핑되어야 한다.

  WHEN sync 단계에서 무결성을 검증할 때, THEN 검증은 산출물 자동 생성이 아니라 게이트(gate)로 동작 SHALL — 인덱스는 `file://` 제약(REQ-009)으로 인라인 수동 큐레이션만 가능하므로 빌드 시점 자동 생성이 불가능하며, 따라서 "튜토리얼·체크리스트에 등장하는 명령/용어/사례의 집합 \ 인덱스 `command`/`glossary`/`case` 항목의 집합" 차집합이 0(누락 없음)인지를 sync 게이트에서 정적으로 검증하여 무결성을 강제 SHALL. 차집합이 비어 있지 않으면(누락 명령/용어/사례가 존재하면) sync는 통과하지 못한다.

  > 본 REQ는 회귀 방지(regression-prevention) binding이다. P3 구현 후 검증에서 12개 명령(git-diff, git-worktree, git-blame, git-show, git-bisect, git-clean, git-config, git-filter-repo, git-reflog, git-restore, git-submodule, git-switch)이 인덱스에서 누락된 것이 확인되었고, 근본 원인은 인덱스가 커버리지 체크리스트에 미바인딩된 구조적 드리프트였다. 본 REQ는 "무엇이 들어가야 하는가"만 정의하며, 인덱스 로딩 방식(REQ-009 인라인 임베드)은 변경하지 않는다. 누락 12개 명령을 즉시 채우는 작업은 본 SPEC 수정 범위가 아니며 P4(IMPL-004) R01 명령어 사전 생성 시 통합 수행 예정(HISTORY 참조).

---

## 5. 범위 외 (Out of Scope)

명시적으로 본 SPEC(P2) 범위에서 제외되는 항목.

- 튜토리얼 21페이지 본문(T01~T21 HTML + 카피 + side-note + FakeTerminal) → **P3 (IMPL-003)**. 단, search-index.json의 title/summary 항목은 P2에서 placeholder로 포함(REQ-004).
- 참조 4페이지(R01 명령어 사전, R02 용어집, R03 FAQ, R04 치트시트 HTML 본문) → **P4 (IMPL-004)**. search-index의 command/glossary 항목은 P2에서 placeholder로 포함.
- 사례 갤러리 전체 페이지(`cases/index.html` 본문, CaseCard, CaseFilterBar, 26개 카드 상세 데이터 + 일러스트) → **P5 (IMPL-005)**. 단, search-index의 case 항목 26개와 CasePreview 3카드는 P2에서 placeholder로 포함.
- 최종 일러스트 아트(HeroBlock commit-나무, 문 카드 아이콘, CasePreview 일러스트) — P2는 자리표시자(placeholder box 또는 단색 SVG)만. 최종 아트는 해당 Phase에서.
- Git 특화 인터랙티브 자산(GitGraphVisualizer, OhShitGitSimulator 등) → **P6 (IMPL-006)**.
- 최종 QA, 접근성 감사(스크린 리더 실측, 크로스 브라우저), Lighthouse 성능 검증 → **P7 (IMPL-007)**.
- 퍼지 매칭 검색 라이브러리(lunr.js, fuse.js 등) 도입 — 단순 문자열 매칭으로 충분(design-guide 섹션 5.L 방향).
- `tmux/` 원본 파일의 어떠한 수정(REQ-012).

---

## 6. 의존성 (Dependencies)

- **IMPL-001 (P1 공유 셸) — 선행 필수**: `tokens.css`, `base.css`, `layout.css`, `components.css`(side-note 6종, CommandPill — SearchOverlay CSS도 여기 추가), `pages.css`(`.tpl-home` 골격), `nav.js`(GlobalHeader — 검색 아이콘 자리), `progress.js`, `reveal.js`가 모두 납입되어 있어야 P2 진입 가능.
- **GUIDE-001 기획 산출물 (입력)**: `roadmap.md` P2 항목, `design-guide.md`(섹션 4.1 Home Hub 템플릿, 5.L 검색 자산, 7 컴포넌트 인벤토리 HeroBlock/ThreeDoors/CasePreview/SearchOverlay/SeriesLink), `ia-sitemap.md`(섹션 2.1 Home Hub, 4.6 검색, 4.7 SeriesLink, 5.1 Home Branching), `content-plan.md`(HOME 카피 방향 + 페이지별 title/summary 추출 소스), `cases-gallery.md`(26개 사례 id/title + 교차 맵).
- **IMPL-001/research.md (참조 소스)**: tmux 역분석, 재사용 매트릭스, "추출-재포장" 정의, tmux 원본 무결성 원칙(REQ-012 계승).
- **SPEC-TMUX-GUIDE-001 (참조 구현, 읽기 전용)**: SeriesLink 링크 타겟. 원본 수정 금지(REQ-012).

---

## 7. 관련 산출물 (Related)

- SPEC-GIT-GITHUB-IMPL-001 — P1 공유 셸. 본 SPEC의 직접 선행 의존. research.md 공유 참조 소스.
- SPEC-GIT-GITHUB-GUIDE-001 산출물군: `spec.md`, `roadmap.md`, `design-guide.md`, `ia-sitemap.md`, `content-plan.md`, `cases-gallery.md` — 본 SPEC의 기획 입력.
- SPEC-TMUX-GUIDE-001 — tmux 자매 사이트 원본. SeriesLink 결속의 기준점.
- 병렬/후속 구현 SPEC: IMPL-001(P1 셸, 선행), IMPL-003(P3 튜토리얼 21), IMPL-004(P4 참조 4), IMPL-005(P5 사례 갤러리), IMPL-006(P6 Git 특화 자산), IMPL-007(P7 QA/접근성).

---

## HISTORY

- 2026-06-19: 최초 작성. P2(홈 허브 + IA + 검색) 범위로 GUIDE-001 roadmap P2 정식화. 12개 EARS 수용 기준.
- 2026-06-19: annotation 통과. 검색 인덱스 로드 전략을 `fetch()`에서 `<script type="application/json">` 인라인 임베드로 확정(`file://` CORS 회피, REQ-009 보강). GUIDE-001 roadmap P2를 구현 단계로 정식화. Lightweight SPEC(research.md 없음, IMPL-001/research.md 참조). 12개 EARS 수용 기준 확정(REQ-001~REQ-012). P3~P7을 명시적 범위 외로 지정. IMPL-003~007과 병렬 계획.
- 2026-06-19: Run+Sync 완료. index.html 홈 허브 본문(HeroBlock/ThreeDoors/CasePreview/SeriesLink) + 88항목 인라인 검색 인덱스 + js/search.js(키보드 탐색·aria-live·Ctrl+K/`/` 단축키) 납품. REQ-001~012 독립 검증 통과. 검증 중 WCAG AA 결함 2건(활성 탭·SeriesLink 현재 카드) 발견·수정. CommandPill 대비(4.20)는 P3/P7 처리 권장으로 기록. 상세는 progress.md.
- 2026-06-19: 버전 1.0.2 → 1.0.3. P3(IMPL-003) 구현 후 검증에서 검색 인덱스 드리프트(12개 명령 누락: git-diff, git-worktree, git-blame, git-show, git-bisect, git-clean, git-config, git-filter-repo, git-reflog, git-restore, git-submodule, git-switch) 발견. 근본 원인 분석: 기존 REQ-004는 "27페이지 분량"만 강제했고 인덱스가 content-plan.md 섹션 4 커버리지 체크리스트(G1~G65, H1~H61)에 바인딩되어 있지 않아 구조적 드리프트가 발생함. 인덱스는 REQ-009(file:// 인라인 로드) 제약으로 빌드 자동 생성이 불가하여 sync 게이트로 무결성을 강제하도록 REQ-013(검색 인덱스 무결성)을 회귀 방지 binding으로 추가. status Implemented 유지(본 REQ은 향후 드리프트 회귀 방지용). 12개 누락 명령 채우기는 즉시 수행하지 않고 P4(IMPL-004) R01 명령어 사전 생성 시 통합 수행 예정. REQ-001~012는 변경 없음.

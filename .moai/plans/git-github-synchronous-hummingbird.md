# GitHub 실전 협업 트랙(P01~P08) 신설 + mock UI 시스템 구축

## Context

`git-github/` 안내서는 T01~T26으로 Git/GitHub 개념을 비유 중심으로 설명한다. 문제는 **실제 GitHub 화면이 단 한 장도 없다**는 점이다. 프로젝트 전체에 `<img>` 태그가 0개이고, Issue·PR·Projects·Milestone은 전부 산문과 `comparison-table`로만 설명된다.

그 결과 독자는 "Issue가 무엇인지"는 알지만 "이 화면 어디를 눌러야 담당자를 지정하는지"는 모른다. 개념은 이해했는데 따라할 수 없다. 실제 GitHub의 Issue 화면 우측 사이드바는 9개 항목이고, PR 화면에는 탭이 4개이며, Projects에는 자동화 워크플로우가 붙는데 — 안내서는 이 존재조차 알려주지 않는다.

**목표**: 비개발자(기획·PM·디자이너·QA)가 개발팀의 실제 GitHub 워크플로우에 참여할 수 있도록, 화면을 재현해 보여주고 클릭 경로까지 안내하는 **실전 협업 트랙 P01~P08**을 신설한다. 기존 T16/T17/T23은 개념 층으로 유지하되 mock UI를 보강하고 P 트랙으로 연결한다.

**성공 기준**: 독자가 P02를 읽고 실제 GitHub 이슈 화면을 열었을 때, 사이드바 각 항목이 무엇이고 어디를 클릭하는지 헤매지 않는다.

---

## 확정 방향 (사용자 결정)

| 항목 | 결정 |
|---|---|
| 화면 표현 | **HTML/CSS로 GitHub UI 재현** (mock UI). 스크린샷 이미지 없음 — `<img>` 0개인 프로젝트 전례 유지 |
| 구성 범위 | 기존 T16/T17/T23 보강 + **실전 트랙 P01~P08 신설** |
| 독자 역할 | 이슈 트리아지 / PR 읽기·리뷰 / Projects·Milestone 운영 / 웹 에디터 PR 생성 — **4가지 전부** |
| 실습 방식 | **관통 시나리오 하나**가 전 페이지를 이어감 |

---

## 관통 시나리오

가상 저장소 **`dongne-library/library-web`** — 동네 도서관 웹사이트 리뉴얼.

- **인물**: 지원(기획/PM — 독자의 분신, 비개발자) · 민수(개발자) · 하늘(디자이너)
- **고정 소재**:
  - Issue **#42** 「로그인 버튼이 안 눌려요」 — type `Bug`, label `bug`·`priority:high`, milestone `v1.0 오픈`
  - Issue **#38** 「대출 연장 기능」 — type `Feature`, 하위 이슈 3개 (진행률 1/3)
  - PR **#57** 「로그인 버튼 클릭 영역 수정」 — 본문에 `Closes #42`, 리뷰어 하늘, 변경 파일 2개
  - Milestone **`v1.0 오픈`** — 마감일 있음, 진행률 바
  - Project **`도서관 리뉴얼 보드`**

모든 mock UI가 같은 번호·같은 인물을 쓴다. P02의 이슈 #42가 P04의 PR #57로 이어지고, P07의 Milestone 진행률에 반영된다.

---

## 아키텍처: mock UI 시스템

### 1) 신규 `css/gh-ui.css` (~600줄)

`.ghui-` 네임스페이스로 **완전 격리**한다. 사이트는 따뜻한 크림톤(`--bg-base:#FFFBF5`)인데 GitHub는 차가운 회색톤이라, 토큰을 섞으면 양쪽 다 망가진다. `.ghui-window` 스코프 안에서만 GitHub Primer 계열 변수(`--ghui-canvas`, `--ghui-border`, `--ghui-accent` 등)를 재정의한다.

핵심 컴포넌트:

| 클래스 | 재현 대상 |
|---|---|
| `.ghui-window` | 브라우저 크롬 + 주소창 (`github.com/dongne-library/library-web`) |
| `.ghui-repo-tabs` | Code / Issues / Pull requests / Actions / Projects 탭 바 |
| `.ghui-issue` + `.ghui-sidebar` | 이슈 본문 2단 레이아웃 |
| `.ghui-tabs` | PR 4탭 (Conversation/Commits/Checks/Files changed) |
| `.ghui-diff` | split/unified diff, 라인 번호, +/- 배경, 코멘트 삽입 슬롯 |
| `.ghui-mergebox` | 체크 상태 목록 + merge 버튼 드롭다운 |
| `.ghui-board` | 칸반 열 + 카드 |
| `.ghui-milestone` | 제목·마감일·진행률 바·open/closed 카운트 |
| `.ghui-label`, `.ghui-badge`, `.ghui-avatar` | 라벨 pill, Open/Merged 배지, 아바타(이니셜 원) |

### 2) 핀 어노테이션 — "따라할 수 있게" 만드는 핵심 장치

mock UI 위에 번호 핀(①②③)을 얹고, 아래 범례에서 각 핀을 설명한다. 핀을 클릭하면 해당 범례가 하이라이트되고, 반대도 성립한다.

```html
<div class="ghui-pin" data-ghui-pin="1" aria-describedby="p2-pin-1">1</div>
...
<ol class="ghui-legend">
  <li id="p2-pin-1" data-ghui-legend="1">
    <strong>Assignees</strong> — 기어 아이콘을 눌러 담당자를 고릅니다. 지정되면 그 사람에게 알림이 갑니다.
  </li>
</ol>
```

이게 없으면 mock UI는 그냥 예쁜 그림이다. 핀이 있어야 "화면의 이 지점 = 이 설명"이 붙는다.

### 3) 신규 `js/gh-ui.js` (~350줄)

기존 `js/pr-flow.js`의 패턴을 그대로 따른다: IIFE, `'use strict'`, `data-asset` 훅으로 진입, `REDUCED = matchMedia('(prefers-reduced-motion: reduce)')` 존중, 프레임워크 없음.

| `data-asset` 값 | 인터랙션 |
|---|---|
| `gh-pins` | 핀 ↔ 범례 양방향 하이라이트 (전 페이지 공용) |
| `gh-tabs` | PR 4탭 전환 (`role="tablist"`, 키보드 화살표 지원) |
| `gh-diff` | 라인 번호 hover → `+` 버튼 → 코멘트 폼 열기 → "Start a review" 배치에 담기 |
| `gh-board` | 카드 클릭 → 다음 열로 이동, Status 필드 값 동기 변경 |
| `gh-mergebox` | 체크 통과/실패 토글로 merge 버튼 활성/비활성 변화 관찰 |

`gh-diff`가 P05의 핵심이다. 독자가 실제로 라인 코멘트를 달아보고 배치 리뷰(pending → Submit review)를 체험한다.

---

## 페이지 구성

| ID | 파일 | 다루는 것 (조사 결과 반영) |
|---|---|---|
| **P01** | `practice/repo-tour.html` | 시나리오·인물 소개. 저장소 상단 탭 한 바퀴. 비개발자가 어느 탭에 사나 |
| **P02** | `practice/issue-anatomy.html` | 이슈 #42 화면 해부. 사이드바 9항목(Assignees/Labels/**Type**/Projects/Milestone/**Sub-issues**/Development/Notifications/Participants). Issue types(2025-04 GA, 기본 Bug·Feature·Task). Sub-issues(부모당 100개, 8단계 중첩) |
| **P03** | `practice/issue-triage.html` | 잘 쓴 이슈 vs 나쁜 이슈. **Issue Forms(YAML)** vs Markdown 템플릿 비교. 라벨 체계 설계. 검색 문법(`is:open`, `no:assignee`, `-label:`, `type:bug`). 일괄 편집·pin·transfer |
| **P04** | `practice/pr-anatomy.html` | PR #57 화면 해부. 4탭 각각 무엇이 보이나. Draft PR → Ready for review. `Closes #42`가 **default 브랜치 대상일 때만** 작동한다는 함정. merge box: required checks, Update branch, auto-merge, merge queue |
| **P05** | `practice/pr-review.html` | Files changed 실습. 라인/멀티라인 코멘트, **Suggested change** + Commit suggestion, Viewed 체크박스, split/unified, hide whitespace. **배치 리뷰**(Start a review → pending → Submit review). Comment/Approve/Request changes 중 비개발자는 언제 무엇을 |
| **P06** | `practice/projects-ops.html` | 보드 운영. Board/Table/Roadmap, Group by, **Slice by**, saved view. 필드 5종 + **Sub-issue progress**. 자동화: 문서 확정 4종(close→Done, merge→Done, Auto-add, Auto-archive)만 단정 서술 |
| **P07** | `practice/milestone-release.html` | Milestone 화면(마감일·진행률 바·open/closed 카운트). **Milestone vs Iteration vs Label** 선택 기준표. 릴리스 노트 |
| **P08** | `practice/nondev-playbook.html` | 역할별 체크리스트. 웹 에디터로 문서 고쳐 PR 만들기(연필 아이콘 → Commit changes → Create PR). `gh` CLI 맛보기. 하지 말아야 할 것(force push, main 직접 커밋) |

각 페이지는 기존 튜토리얼 골격을 그대로 쓴다: `reading-bar` → `global-header` → `breadcrumb` → `page-header` → `.layout` (`.layout__main.tpl-tutorial` + `.sidebar-toc`) → `global-footer` → JS. `side-note--metaphor/tip/warn/extra/case`, `cheat-card`, `pager`도 동일.

---

## 정확성 원칙 (조사에서 드러난 함정)

조사 결과 **문서로 확정되지 않은 항목**이 셋 있다. 비개발자 대상 가이드에서 틀린 UI 라벨은 독자를 화면 앞에서 멈춰 세우므로, 다음 규칙을 지킨다.

1. **Projects 자동화 워크플로우** — 공식 문서가 확정하는 것은 `close→Done`, `merge→Done`(기본 2종) + `Auto-add to project` + `Auto-archive items`뿐이다. "Item added to project", "Code review approved" 등 널리 알려진 명칭은 문서에 열거되지 않는다. → **확정 4종만 단정 서술**하고, 나머지는 side-note에 "조직·시점에 따라 목록이 다를 수 있으니 Workflows 메뉴에서 직접 확인하세요"로 처리.
2. **Milestone 진행률 산식** — 문서에 명문화 없음. → "닫힌 항목 ÷ 전체 항목으로 표시됩니다(이슈와 PR 모두 포함)"까지만 쓰고 공식 단정 회피.
3. **Slice by 출시 시점** — 정확한 날짜 미확인. → 날짜를 쓰지 않고 기능만 설명.

또한 **모든 영문 UI 라벨은 원문 그대로** 표기하고 괄호로 한국어를 덧붙인다(`Request changes`(수정 요청)). 독자가 실제 화면에서 문자열을 찾아야 하기 때문이다.

---

## 사이트 통합 (영향 범위)

`practice/` 디렉터리를 추가하면 다음이 연쇄로 바뀐다. **네비게이션이 27개 HTML에 하드코딩**되어 있어 이 부분이 작업량의 상당 비중이다.

### 필수 수정

1. **`js/nav.js`** — `initBreadcrumb()`의 `sectionMap`에 `practice: { label: '실전', order: 4 }` 추가 (nav.js:133-137).
2. **기존 27개 HTML의 `gh-nav`** — `학습트랙` / `참조` / `사례` 옆에 **`실전` 드롭다운** 신설. 경로 접두사가 위치별로 다르므로 3그룹으로 나눠 처리:
   - `index.html` → `practice/…`
   - `tutorial/*.html` (26개) → `../practice/…`
   - `ref/*.html`, `cases/index.html` → `../practice/…`
   동일하게 **모바일 드로어**(`.mobile-drawer`)에도 `실전` 섹션 추가 — 현재 드로어는 `index.html`에만 존재하므로 그곳만.
3. **`index.html`** —
   - `.three-doors` → 문 4개로 확장 (`실전 협업 트랙` 카드 추가). CSS는 `.three-doors__grid`가 `auto-fill`이면 그대로, 아니면 그리드 조정.
   - **인라인 검색 인덱스** (`<script type="application/json" id="search-index">`)에 P01~P08 8개 항목 추가. 누락 시 검색에서 새 페이지가 안 나온다.

### 기존 개념 페이지 보강

4. **`tutorial/github-issues-pr.html` (T16)** — Issue mock UI 1장 + PR mock UI 1장 삽입, "화면을 직접 보려면 P02/P04로" 링크. Milestone 설명이 한 줄뿐이므로 P07 링크 추가.
5. **`tutorial/github-review.html` (T17)** — diff mock UI 1장 삽입, P05 링크.
6. **`tutorial/github-projects.html` (T23)** — 칸반 보드 mock UI 삽입(현재 산문+표뿐), P06 링크.
7. **`ref/glossary.html`** — `sub-issue`, `issue type`, `merge queue`, `ruleset`, `suggested change` 항목 추가. `js/glossary-tooltip.js`가 이 앵커를 참조하므로 P 트랙에서 `data-term`으로 쓸 수 있게 된다.

### 선택 (범위 밖으로 둘 것)

- `cases/index.html`에 P 트랙 연계 사례 추가 — 기존 사례로도 충분, 이번엔 건드리지 않는다.
- 네비 동적 렌더링 리팩터링 — 매력적이지만 `file://` 환경에서 JS 실패 시 네비가 통째로 사라진다. 현행 하드코딩 유지.

---

## 실행 순서

Rule 2(3+ 파일 분해)에 따라 단위를 나눈다. 각 단위 끝에서 브라우저로 확인한다.

1. **기반** — `css/gh-ui.css` + `js/gh-ui.js` 작성. 검증용으로 P02 한 장 먼저 완성해 mock UI·핀·사이드바가 실제로 보이는지 확인.
2. **P 트랙 본문** — P01, P03, P04를 작성 (P02 패턴 재사용).
3. **인터랙티브** — P05(`gh-diff`), P06(`gh-board`), P07, P08. `gh-diff`가 가장 복잡하므로 여기 시간을 쓴다.
4. **사이트 통합** — nav.js `sectionMap`, 27개 HTML 네비, index.html 도어 + 검색 인덱스.
5. **기존 페이지 보강** — T16/T17/T23 mock UI 삽입, glossary 항목 추가.

각 단위 완료 시 진행 상황을 보고한다.

---

## 검증

빌드 없는 정적 사이트이므로 실제 브라우저로 확인한다.

```
cd git-github && python3 -m http.server 8000
```

체크리스트:

- **렌더링** — P01~P08 각 페이지에서 mock UI가 GitHub처럼 보이는가. `.ghui-` 스타일이 사이트 크림톤을 오염시키지 않았는가 (역으로 `components.css`가 mock UI를 오염시키지 않았는가).
- **인터랙션** — 핀 클릭 → 범례 하이라이트. PR 탭 4개 전환. diff 라인에 코멘트 달고 Submit review까지. 보드 카드 열 이동.
- **네비게이션** — 27개 페이지 아무 곳에서나 `실전` 드롭다운이 뜨고 링크가 깨지지 않는가. 상대경로(`../practice/`) 정확한가. breadcrumb에 "실전"이 표시되는가.
- **검색** — `Ctrl+K` → "마일스톤", "리뷰" 검색 시 P 트랙 페이지가 결과에 나오는가.
- **접근성** — 키보드만으로 탭 전환·핀 이동 가능한가. `prefers-reduced-motion: reduce`에서 애니메이션이 죽는가. mock UI에 `aria-label`이 붙어 스크린리더가 "가짜 화면"임을 알 수 있는가.
- **반응형** — 768px 이하에서 mock UI가 가로 스크롤로 처리되는가 (2단 이슈 레이아웃은 접어야 함).
- **`file://` 직접 열기** — 프로젝트가 CORS 회피를 위해 검색 인덱스를 인라인화한 만큼, `file://`로도 동작해야 한다.

# SPEC-GIT-GITHUB-IMPL-010 (P10) — run 단계 구현 계약서

SPEC이 run으로 연기한 HOW(카피 규칙, mock UI 마크업 규약, 좌표 전략)를 확정한다.
P01~P08 전 배치가 이 문서를 정본으로 삼는다. 여기서 벗어나면 REQ-001/002 위반이다.

---

## 0. 절대 규칙

- [HARD] `git-github/css/gh-ui.css` 와 `git-github/js/gh-ui.js` 를 **수정하지 말 것**. IMPL-009 소관. 새 mock UI 스타일 정의 금지(REQ-023).
- [HARD] `tmux/` 디렉토리 어떤 파일도 건드리지 말 것(REQ-026).
- [HARD] 빌드 없음. `file://` 로 바로 열려야 함. 외부 라이브러리/모듈/fetch 금지(REQ-025).
- [HARD] 기존 27개 HTML, `git-github/index.html`, `js/nav.js`, `js/search.js` 를 수정하지 말 것 — IMPL-011/012 소관.
- [HARD] 오직 `git-github/practice/*.html` 8개 파일만 신규 생성한다.
- [HARD] 모든 영문 UI 라벨은 원문 그대로 쓰고 괄호로 한국어 병기(REQ-021). 예: `Request changes`(수정 요청), `Squash and merge`(스쿼시 병합), `Files changed`(변경 파일).
- 톤: 비개발자 독자. "비유 먼저, 단어 나중". 존댓말 `~해요/~예요` 체(기존 튜토리얼과 동일).
- 개념 재설명 금지 — 개념은 `../tutorial/*.html` 로 링크(결정 6.4). P 트랙은 "어디를 누르는가"만.

---

## 1. 관통 시나리오 정본 (REQ-001 / REQ-002)

8페이지 전부 동일. 다른 예제·다른 번호·다른 인물을 만들지 말 것.

**저장소**: `dongne-library/library-web` (동네 도서관 웹사이트 리뉴얼)
**주소창 표기**: `github.com/dongne-library/library-web`

**인물**

| 이름 | 역할 | 아바타 이니셜 | 아바타 색 |
|---|---|---|---|
| 지원 | 기획/PM — 독자의 분신, 비개발자 | 지 | `--avatar-bg:#8250df` |
| 민수 | 개발자 | 민 | `--avatar-bg:#1f883d` |
| 하늘 | 디자이너 | 하 | `--avatar-bg:#0969da` |

**고정 소재 (속성 고정 — 변경 금지)**

- **Issue #42** 「로그인 버튼이 안 눌려요」
  - Type: `Bug` · Labels: `bug`, `priority:high` · Milestone: `v1.0 오픈`
  - Assignee: 민수 · 작성자: 지원 · 상태: Open · 코멘트 3개
- **Issue #38** 「대출 연장 기능」
  - Type: `Feature` · 하위 이슈(Sub-issues) 3개 중 1개 완료 → 진행률 **1/3**
- **PR #57** 「로그인 버튼 클릭 영역 수정」
  - 작성자: 민수 · 리뷰어: 하늘 · 브랜치 `fix/login-hitbox` → `main`
  - 본문에 `Closes #42` · 변경 파일 **2개**:
    - `src/components/LoginButton.jsx`
    - `src/styles/login.css`
- **Milestone `v1.0 오픈`**
  - Due by 2026년 8월 14일 · Open **5** / Closed **7** (전체 12) · 진행률 바 **58%**
- **Project `도서관 리뉴얼 보드`**
  - 열 4개: `Todo` / `In Progress` / `Review` / `Done`

**서사 연결**: P02의 #42 → P04의 PR #57(`Closes #42`) → P07의 Milestone `v1.0 오픈` 진행률.
P07에서 "#57이 병합되면 #42가 닫히고 바가 7/12에서 8/12로 올라가요" 식으로 결속을 명시할 것.

**라벨 색 고정**

```html
<span class="ghui-label" style="--label-bg:#cf222e">bug</span>
<span class="ghui-label" style="--label-bg:#d4a72c;--label-fg:#1f2328">priority:high</span>
<span class="ghui-label" style="--label-bg:#a2eeef;--label-fg:#1f2328">enhancement</span>
```

밝은 배경 라벨은 반드시 `--label-fg:#1f2328` 을 함께 줄 것(기본 전경색이 흰색이라 대비 미달).

---

## 2. 페이지 골격 (REQ-022)

파일: `git-github/practice/<file>.html`. `tutorial/` 과 같은 깊이이므로 상대경로 규칙이 같다.

```
<!DOCTYPE html> / <html lang="ko">
<head>
  meta charset, viewport
  <title>P0N 제목 — Git & GitHub 안내서</title>
  <meta name="description" content="...">
  preconnect + pretendard CDN (기존 페이지에서 그대로 복사)
  ../css/tokens.css → base.css → layout.css → components.css → pages.css → gh-ui.css
</head>
<body>
  <div class="reading-bar" role="progressbar" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100" aria-label="읽기 진행률"></div>
  <header class="global-header"> ... </header>
  <nav class="breadcrumb" aria-label="경로"></nav>
  <header class="page-header">
    <p class="page-header__eyebrow">실전 · P0N · GitHub 협업</p>
    <h1 class="page-header__title">...</h1>
    <p class="page-header__subhead">...</p>
  </header>
  <div class="layout">
    <main class="layout__main tpl-tutorial"> ... </main>
    <aside class="sidebar-toc" aria-label="이 페이지에서"> ... </aside>
  </div>
  <footer class="global-footer"> ... </footer>
  <script src="../js/nav.js" defer></script>
  <script src="../js/progress.js" defer></script>
  <script src="../js/reveal.js" defer></script>
  <script src="../js/gh-ui.js" defer></script>
</body>
```

**헤더/푸터**: `git-github/tutorial/github-review.html` 의 `global-header`/`global-footer` 를 그대로 복사하되:

- 학습트랙 드롭다운 링크 26개: `git-concept.html` → `../tutorial/git-concept.html` 처럼 전부 접두사 추가
- 참조 `../ref/...`, 사례 `../cases/index.html`, 로고 `../index.html` — 그대로
- **tmux 시리즈 링크는 `../../tmux/index.html`** 로 쓸 것. 기존 tutorial 페이지의 `../tmux/index.html` 은 깨진 링크다(`git-github/tmux` 는 없다). 복제하지 말 것. 기존 페이지 수정도 하지 말 것 — 범위 밖.
- `실전` 드롭다운은 **추가하지 말 것** — IMPL-011 소관.

**본문 구성 요소** (모두 기존 클래스, 신규 CSS 금지)

- `<section class="tut-section" id="..." data-reveal><h2 class="tut-section__title">…</h2><div class="tut-section__body">…</div></section>`
- side-note 5종: `side-note side-note--metaphor | --tip | --warn | --extra | --case`

  ```html
  <div class="side-note side-note--warn" data-reveal>
    <span class="side-note__label">주의</span>
    <p>…</p>
  </div>
  ```

  라벨 문구: metaphor=`비유`, tip=`팁`, warn=`주의`, extra=`알아두면 좋은`, case=`이렇게도 써요`
- `<pre class="code-block"><code>…</code></pre>`
- `cheat-card` — 페이지 끝 한 장 요약 (`cheat-card__title` / `__sub` / `__list` / `__row` / `__cmd` / `__desc`)
- `pager` — 이전/다음 (§5)
- `sidebar-toc__link` 는 본문 `tut-section` 의 `id` 와 1:1

---

## 3. mock UI 마크업 규약 (REQ-023)

`gh-ui.js` 가 요구하는 훅. **아래 형태에서 벗어나면 동작하지 않는다.**

### 3.0 창 껍데기 (모든 mock 공통)

```html
<div class="ghui-window" role="figure" aria-label="재현 화면입니다. 실제 GitHub이 아니라 학습용으로 다시 그린 화면이에요.">
  <div class="ghui-window__chrome">
    <div class="ghui-window__dots"><span class="ghui-window__dot ghui-window__dot--r"></span><span class="ghui-window__dot ghui-window__dot--y"></span><span class="ghui-window__dot ghui-window__dot--g"></span></div>
    <div class="ghui-window__address">github.com/dongne-library/library-web</div>
  </div>
  <div class="ghui-window__body"> … </div>
</div>
```

`.ghui-window` 는 `overflow:hidden` 이다. 창 밖으로 튀어나가는 요소를 두지 말 것.

### 3.1 gh-pins — 핀 ↔ 범례

루트: `<div class="ghui-annotated" data-asset="gh-pins">` 안에 `.ghui-window` + `.ghui-legend` 를 넣는다.

핀:

```html
<button class="ghui-pin" data-ghui-pin="1" style="left:-9px;top:20px;" aria-label="핀 1">1</button>
```

범례(번호는 CSS `::before` 가 `data-ghui-legend` 에서 렌더 — 본문에 번호를 또 쓰지 말 것):

```html
<ol class="ghui-legend" aria-label="핀 설명">
  <li class="ghui-legend__cap" style="list-style:none">핀을 누르면 이 설명이 켜져요 (양방향)</li>
  <li class="ghui-legend__item" data-ghui-legend="1"><span>Assignees(담당자) — …</span></li>
</ol>
```

`data-ghui-pin` 값과 `data-ghui-legend` 값이 문자열로 정확히 일치해야 결속된다. JS가 `aria-describedby` 를 자동 연결한다.

**[HARD] 핀 배치 규칙 — 반응형 안전**

`.ghui-pin` 은 `position:absolute; transform:translate(-50%,-50%)` 이고 CSS가 좌표를 주지 않으므로 인라인 `style` 로 `top`/`left` 를 준다. 그런데 768px 이하에서 `.ghui-issue` 가 1단으로 무너지고 `.ghui-sidebar` 가 본문 위로 올라간다(`order:-1`). **창 기준 고정 px/% 좌표는 모바일에서 전부 어긋난다.**

따라서 **핀이 가리키는 요소 자체를 위치 기준으로 삼는다**:

- 그 요소에 `ghui-annotated` 클래스를 함께 붙이고(예: `class="ghui-sidebar__item ghui-annotated"`),
- 핀을 그 요소의 **첫 자식**으로 넣고 `style="left:-9px;top:20px;"` 처럼 요소 기준 좌표를 준다.

P02의 사이드바 9항목은 반드시 이 방식을 쓴다. `.ghui-window__body` 의 padding 16px 덕분에 `left:-9px` 도 창 안에 들어와 잘리지 않는다.
가로로 리플로우하지 않는 대상에 한해 창 기준 `top:NNNpx;left:NN%` 방식을 써도 된다.

### 3.2 gh-tabs — PR 4탭

```html
<div class="ghui-tabs" data-asset="gh-tabs">
  <div class="ghui-tabs__list" role="tablist" aria-label="PR 탭">
    <button type="button" role="tab" id="pr-t1" aria-controls="pr-p1" aria-selected="true" class="ghui-tabs__tab is-active">Conversation</button>
    <button type="button" role="tab" id="pr-t2" aria-controls="pr-p2" aria-selected="false" class="ghui-tabs__tab">Commits <span class="ghui-tabs__count">2</span></button>
    <button type="button" role="tab" id="pr-t3" aria-controls="pr-p3" aria-selected="false" class="ghui-tabs__tab">Checks</button>
    <button type="button" role="tab" id="pr-t4" aria-controls="pr-p4" aria-selected="false" class="ghui-tabs__tab">Files changed <span class="ghui-tabs__count">2</span></button>
  </div>
  <div class="ghui-tabs__panels">
    <div role="tabpanel" id="pr-p1" aria-labelledby="pr-t1" class="ghui-tabs__panel">…</div>
    <div role="tabpanel" id="pr-p2" aria-labelledby="pr-t2" class="ghui-tabs__panel" hidden>…</div>
  </div>
</div>
```

`id` 는 페이지 안에서 유일해야 한다(한 페이지에 탭 자산이 2개면 접두사를 달리할 것).

### 3.3 gh-diff — 라인 코멘트 + 배치 리뷰

루트는 `.ghui-diff` **그 자체**에 `data-asset="gh-diff"` 를 단다(JS가 root에 리뷰 패널을 삽입한다).

```html
<div class="ghui-diff" data-asset="gh-diff" data-gh-diff-mode="unified">
  <div class="ghui-diff__toolbar">
    <div class="ghui-diff__modes">
      <button type="button" class="ghui-diff__mode is-active" data-gh-mode="unified">Unified</button>
      <button type="button" class="ghui-diff__mode" data-gh-mode="split">Split</button>
    </div>
    <button type="button" class="ghui-diff__review-btn" data-gh-review>Review changes <span class="ghui-diff__review-count" data-gh-review-count hidden>0</span></button>
  </div>
  <div class="ghui-diff__file-head">
    <span class="ghui-diff__file-name">src/components/LoginButton.jsx</span>
    <label class="ghui-diff__viewed"><input type="checkbox"> Viewed</label>
  </div>
  <div class="ghui-diff__scroll"><div class="ghui-diff__body">
    <div class="ghui-diff__row ghui-diff__row--del" data-gh-line>
      <span class="ghui-diff__ln">12</span><span class="ghui-diff__ln"></span>
      <code class="ghui-diff__content">  &lt;button className="login" onClick={login}&gt;</code>
    </div>
    <div class="ghui-diff__row ghui-diff__row--add" data-gh-line>
      <span class="ghui-diff__ln"></span><span class="ghui-diff__ln">12</span>
      <code class="ghui-diff__content">  &lt;button className="login login--lg" onClick={login}&gt;</code>
    </div>
  </div></div>
</div>
```

- `+`/`-` 기호는 CSS `::before` 가 그린다. 본문 텍스트에 직접 쓰지 말 것.
- 꺾쇠·앰퍼샌드는 `&lt;` `&gt;` `&amp;` 로 이스케이프.
- JS가 각 `.ghui-diff__row[data-gh-line]` 에 hover 시 나타나는 파란 `+` 버튼을 주입한다. 직접 만들지 말 것.
- **알려진 한계**: `data-gh-diff-mode="split"` 에 대응하는 CSS가 없어 Split 토글은 시각적으로 바뀌지 않고 스크린리더 안내만 나간다. IMPL-009의 갭이다. **CSS를 추가해 고치지 말 것.** 대신 P05 본문에서 실제 GitHub의 기어 아이콘 → `Unified`(통합 보기) / `Split`(분할 보기) 를 산문으로 설명한다.

### 3.4 gh-board — 칸반

```html
<div class="ghui-board__scroll">
  <div class="ghui-board" data-asset="gh-board">
    <div class="ghui-board__col" data-gh-col="Todo">
      <div class="ghui-board__col-head">Todo <span class="ghui-board__col-count" data-gh-count>0</span></div>
      <div class="ghui-board__cards">
        <article class="ghui-board__card" data-gh-card-title="#38 대출 연장 기능">
          <div class="ghui-board__card-title">대출 연장 기능 #38</div>
          <div class="ghui-board__card-meta"><span class="ghui-avatar" style="--avatar-bg:#8250df">지</span> 지원</div>
          <div class="ghui-board__card-status">Status: <b data-gh-status>Todo</b></div>
        </article>
      </div>
    </div>
    <!-- In Progress / Review / Done 동일 구조. 빈 열도 .ghui-board__cards 를 반드시 둘 것 -->
  </div>
</div>
```

카드 클릭/Enter 시 다음 열로 이동하고 `data-gh-status` 텍스트와 열 카운트가 동기화된다. 카운트 초깃값은 JS가 덮어쓴다.

### 3.5 gh-mergebox — 병합 상자

`data-asset` 과 `.ghui-mergebox` 는 **같은 요소**에 둔다(JS가 root에 `is-ready`/`is-blocked` 를 토글하고 CSS가 `.ghui-mergebox.is-ready` 를 읽는다).

```html
<div class="ghui-mergebox is-ready" data-asset="gh-mergebox">
  <ul class="ghui-mergebox__checks">
    <li class="ghui-mergebox__check is-pass" data-gh-check>
      <button class="ghui-mergebox__toggle" type="button" aria-pressed="true" aria-label="CI 빌드 검사 통과/실패 토글"></button>
      <span class="ghui-mergebox__check-label"><span data-gh-check-name>CI 빌드</span> — <span data-gh-check-state>통과</span></span>
    </li>
  </ul>
  <div class="ghui-mergebox__action">
    <span class="ghui-mergebox__status"><span class="ghui-mergebox__status-dot"></span><span data-gh-merge-status>병합할 수 있음</span></span>
    <button class="ghui-mergebox__merge" type="button" data-gh-merge>Squash and merge <span class="ghui-mergebox__caret" aria-hidden="true">▾</span></button>
    <p class="ghui-mergebox__reason" data-gh-reason hidden></p>
  </div>
</div>
```

- [HARD] `data-gh-check-name` 과 `data-gh-check-state` 훅을 **반드시** 넣을 것. 없으면 토글 후 "— 통과" 글자가 그대로 남아 화면과 어긋난다.
- `.ghui-mergebox__toggle` 버튼은 **내용이 비어 있어야** 한다(✓/✕/• 는 CSS `::before`).
- 상태 클래스: `is-pass` / `is-fail` / `is-wait`.

### 3.6 Milestone (JS 없음, 정적)

```html
<div class="ghui-milestone">
  <p class="ghui-milestone__title">v1.0 오픈</p>
  <p class="ghui-milestone__due">Due by 2026년 8월 14일 · 58% complete</p>
  <div class="ghui-milestone__bar" role="img" aria-label="진행률 58퍼센트"><div class="ghui-milestone__bar-fill" style="width:58%"></div></div>
  <div class="ghui-milestone__counts"><span><b>5</b> Open</span><span><b>7</b> Closed</span></div>
</div>
```

### 3.7 저장소 탭 바 (JS 없음, 정적)

```html
<nav class="ghui-repo-tabs" aria-label="저장소 탭">
  <a href="#" class="ghui-repo-tab">Code</a>
  <a href="#" class="ghui-repo-tab is-active">Issues <span class="ghui-repo-tab__count">2</span></a>
  <a href="#" class="ghui-repo-tab">Pull requests <span class="ghui-repo-tab__count">1</span></a>
  <a href="#" class="ghui-repo-tab">Actions</a>
  <a href="#" class="ghui-repo-tab">Projects <span class="ghui-repo-tab__count">1</span></a>
</nav>
```

`.ghui-repo-tabs` 는 `overflow-x:auto` 라 핀이 잘린다. 이 탭 바에는 핀을 달지 말 것.

### 3.8 기타 원자

- 배지: `ghui-badge--open` / `--merged` / `--closed` / `--draft` / `--pending`
- 아바타: `<span class="ghui-avatar" style="--avatar-bg:#1f883d">민</span>`
- 버튼: `ghui-btn`, `ghui-btn--primary`
- 이슈 2단: `.ghui-issue` > `.ghui-issue__main` + `.ghui-sidebar`
- 사이드바 항목:

  ```html
  <div class="ghui-sidebar__item">
    <div class="ghui-sidebar__head"><span>Assignees</span><span class="ghui-sidebar__gear" aria-hidden="true">⚙</span></div>
    <div class="ghui-sidebar__value"><span class="ghui-avatar" style="--avatar-bg:#1f883d">민</span> 민수</div>
  </div>
  ```

---

## 4. 정확성 원칙 (문서 미확정 항목 — 위반 시 REQ 실패)

- **REQ-015 / REQ-018 (Projects 자동화)**: 공식 문서가 확정하는 **4종만** 단정 서술.
  1. 이슈/PR이 close 되면 Status → `Done`
  2. PR이 merge 되면 Status → `Done`
  3. `Auto-add to project`
  4. `Auto-archive items`

  그 밖의 자동화 명칭("Item added to project", "Code review approved", "Code changes requested" 등)은 **단정 금지**. 언급이 필요하면 side-note로:
  > 조직·시점에 따라 목록이 다르니 프로젝트 `…` 메뉴 → `Workflows`(워크플로) 에서 직접 확인하세요.
- **REQ-019 (Milestone 진행률)**: "닫힌 항목 ÷ 전체 항목(이슈·PR 모두 포함)으로 표시됩니다" **까지만**. 공식 산식이라고 단정하지 말 것. 반올림/가중치 언급 금지.
- **REQ-020 (Slice by)**: 출시 시점(날짜)을 **표기하지 말 것**. 기능만 설명.
- **REQ-021**: 모든 영문 UI 라벨 원문 + 괄호 한국어 병기.

**확정 사실 (그대로 서술해도 됨)**

- Issue types: 2025-04 GA · 기본 3종 `Bug`/`Feature`/`Task` · 조직 `Settings` → `Planning` → `Issue types` · 조직당 최대 25개
- Sub-issues: 부모당 최대 100개 · 최대 8단계 중첩 · `Create sub-issue` 버튼
- Pin: 리포당 최대 3개 · Transfer: 같은 소유자만 · `Convert to discussion`
- Projects: 프로젝트당 최대 50,000 항목
- Copilot code review: 항상 `Comment` 만 남겨 병합을 막지 않음 (2025-04 GA)
- `Closes #42` 같은 닫기 키워드는 **PR이 default 브랜치를 대상으로 할 때만** 이슈를 자동으로 닫는다
- Draft PR 상태에는 자동 리뷰 요청이 가지 않고, `Ready for review` 로 전환할 때 CODEOWNERS 알림이 발생
- Group by: `title`, `labels`, `reviewers`, `linked PR` 필드로는 그룹 불가
- merge 3종 원문 라벨: `Create a merge commit` / `Squash and merge` / `Rebase and merge`

---

## 5. 페이지 목록과 pager 사슬

| ID | 파일 | 제목(초안) | 이전 | 다음 |
|---|---|---|---|---|
| P01 | `practice/repo-tour.html` | 저장소 한 바퀴, 나는 어느 탭에 사나 | `../tutorial/github-issues-pr.html` (T16 대화로 코드를 만드는 법) | `issue-anatomy.html` |
| P02 | `practice/issue-anatomy.html` | 이슈 화면 해부: 사이드바 9칸 | `repo-tour.html` | `issue-triage.html` |
| P03 | `practice/issue-triage.html` | 잘 쓴 이슈, 나쁜 이슈 | `issue-anatomy.html` | `pr-anatomy.html` |
| P04 | `practice/pr-anatomy.html` | PR 화면 해부: 4탭과 merge box | `issue-triage.html` | `pr-review.html` |
| P05 | `practice/pr-review.html` | Files changed에서 리뷰하기 | `pr-anatomy.html` | `projects-ops.html` |
| P06 | `practice/projects-ops.html` | 보드 운영: 뷰·필드·자동화 | `pr-review.html` | `milestone-release.html` |
| P07 | `practice/milestone-release.html` | Milestone과 릴리스 | `projects-ops.html` | `nondev-playbook.html` |
| P08 | `practice/nondev-playbook.html` | 비개발자 플레이북 | `milestone-release.html` | `../ref/cheatsheet.html` (치트시트) |

pager 마크업:

```html
<nav class="pager" aria-label="이전/다음 페이지">
  <a class="pager__card" href="repo-tour.html">
    <span class="pager__label">← 이전</span>
    <span class="pager__title">P01 저장소 한 바퀴</span>
  </a>
  <a class="pager__card pager__card--next" href="issue-triage.html">
    <span class="pager__label">다음 →</span>
    <span class="pager__title">P03 잘 쓴 이슈, 나쁜 이슈</span>
  </a>
</nav>
```

---

## 6. 페이지별 필수 내용 (REQ 대응)

### P01 `repo-tour.html` — REQ-003

- 관통 시나리오·인물 3명 소개(지원/민수/하늘, `dongne-library/library-web`).
- 저장소 상단 탭 한 바퀴: `Code` / `Issues` / `Pull requests` / `Actions` / `Projects` — 각각 무엇을 보는 곳인지.
- 비개발자가 주로 사는 탭이 어디인지 명시(`Issues`, `Pull requests`, `Projects`).
- mock: `.ghui-repo-tabs` 정적 재현(핀 없음).

### P02 `issue-anatomy.html` — REQ-004, REQ-005

- mock: `gh-pins` 로 이슈 #42 화면. **사이드바 9항목에 핀 9개**:
  `Assignees` / `Labels` / `Type` / `Projects` / `Milestone` / `Sub-issues`(Relationships) / `Development` / `Notifications` / `Participants`
  (핀은 §3.1 [HARD] 규칙대로 각 `.ghui-sidebar__item` 에 앵커)
- 각 핀 = 범례 1항목. 범례 문구에 "어디를 누르는가"를 담을 것.
- Issue types: 2025-04 GA, 기본 3종, 조직 `Settings` → `Planning` → `Issue types`, 조직당 최대 25개.
- Sub-issues: Issue #38 예시(3개 중 1개 완료, 1/3), 부모당 최대 100개, 최대 8단계, `Create sub-issue` 버튼.

### P03 `issue-triage.html` — REQ-006, REQ-007

- 잘 쓴 이슈 vs 나쁜 이슈 대비(#42를 좋은 예로).
- Issue Forms(`.github/ISSUE_TEMPLATE/*.yml`): `input`/`textarea`/`dropdown`/`checkboxes`, `validations` — `code-block` 으로 YAML 예시.
- Markdown 템플릿(`*.md` + frontmatter `name:` / `about:`) 과 비교.
- `config.yml` 의 `blank_issues_enabled` 와 `contact_links`.
- 검색 qualifier **원문 그대로**: `is:open`, `label:"in progress"`, `-label:bug`, `assignee:`, `milestone:`, `type:bug`, `no:label`, `no:assignee`, `no:milestone`, `no:project`, `linked:pr`
- 일괄 편집(bulk edit), `Pin issue`(리포당 최대 3개), `Transfer issue`(같은 소유자만), `Convert to discussion`.

### P04 `pr-anatomy.html` — REQ-008, REQ-009, REQ-010

- mock 1: `gh-tabs` — PR #57의 4탭 `Conversation` / `Commits` / `Checks` / `Files changed`, 각 탭이 무엇을 보여주는지.
- Draft PR → `Ready for review` 전환. Draft에는 자동 리뷰 요청이 가지 않고, `Ready for review` 시 CODEOWNERS 알림 발생.
- **REQ-009 필수**: `side-note--warn` 으로 — 닫기 키워드(`Closes #42`)는 **PR이 default 브랜치를 대상으로 할 때만** 이슈를 자동으로 닫는다.
- mock 2: `gh-mergebox` — required checks, `Update branch`(브랜치 업데이트), `Enable auto-merge`(자동 병합 켜기, 즉시 병합 불가한 PR에만 노출), `Merge when ready`(merge queue).
- merge 3종 원문 라벨 `Create a merge commit`(병합 커밋 만들기) / `Squash and merge`(스쿼시 병합) / `Rebase and merge`(리베이스 병합).
- 사이드바 `Development` 로 이슈를 수동 연결하는 경로.

### P05 `pr-review.html` — REQ-011, REQ-012, REQ-013

- mock: `gh-diff` — PR #57의 2개 파일. 독자가 직접 `Start a review` → pending → `Submit review` 를 체험.
- 리뷰 도구: 라인 코멘트(라인번호 hover → 파란 `+`), 멀티라인 코멘트(드래그 또는 Shift+클릭), `Suggested change`(제안 변경) + `Commit suggestion`(batch 커밋 가능), `Viewed`(확인함) 체크박스(파일 변경 시 자동 해제), 기어 아이콘 → `Unified`(통합 보기) / `Split`(분할 보기), `Hide whitespace`(공백 무시).
- 배치 리뷰 흐름 정확히: `Start a review` → pending(본인만 보임) → `Add review comment` → `Review changes` → `Comment` / `Approve` / `Request changes` → `Submit review`. 단발성은 `Add single comment` 로 구분.
- Copilot code review는 항상 `Comment` 만 남겨 병합을 막지 않음(2025-04 GA).
- **REQ-013**: 비개발자가 언제 `Comment`(코멘트)를 쓰고 언제 `Approve`(승인)를 피해야 하는지 판단 기준.

### P06 `projects-ops.html` — REQ-014, REQ-015, REQ-018, REQ-020

- mock: `gh-board` — `도서관 리뉴얼 보드`, 4열, 카드 이동 체험.
- 뷰: `Board`(보드) / `Table`(표) / `Roadmap`(로드맵).
- `Group by`(그룹 기준) — `title`, `labels`, `reviewers`, `linked PR` 필드로는 그룹 불가.
- `Slice by`(슬라이스) — **출시 날짜 표기 금지**, 기능만.
- `saved view`(저장된 뷰), `Field sums`(필드 합계), `Insights` 차트.
- 필드: `Text` / `Number` / `Date` / `Single select` / `Iteration` + `Parent issue` + `Sub-issue progress`.
- 항목 추가 4경로: 사이드바 기어 / 프로젝트 `+` / `Auto-add` 워크플로 / `gh project item-add`.
- 프로젝트당 최대 50,000 항목.
- 자동화: **확정 4종만 단정** + side-note로 `…` 메뉴 → `Workflows` 직접 확인 안내(§4).

### P07 `milestone-release.html` — REQ-016, REQ-019

- mock: `.ghui-milestone` — `v1.0 오픈`, due date, completion percentage 바, open/closed 카운트.
- 접근 경로: `Issues` 또는 `Pull requests` → 우측 상단 `Milestones`(마일스톤).
- **REQ-019**: 진행률은 "닫힌 항목 ÷ 전체 항목(이슈·PR 모두 포함)으로 표시됩니다" 까지만.
- Milestone vs `Iteration`(반복) vs `Label`(라벨) 선택 기준: 날짜 기반 목표 / 반복 스프린트 주기 / 비-시간적 분류.
- 관통 결속: PR #57 병합 → #42 닫힘 → 바가 7/12 → 8/12.

### P08 `nondev-playbook.html` — REQ-017

- 역할별 체크리스트(기획/PM · 디자이너 · QA).
- 웹 에디터로 문서 수정 → PR: 연필 아이콘 → `Commit changes`(변경 사항 커밋) → `Create a new branch`(새 브랜치 만들기) → `Propose changes`(변경 제안).
- gh CLI 맛보기 (`code-block`):
  `gh issue create`, `gh pr create --draft`, `gh pr review --approve|--request-changes|--comment`, `gh pr merge --squash --auto`, `gh project item-add`
- 하지 말 것: force push, `main` 직접 커밋 — `side-note--warn`.

---

## 7. 완료 정의

- 담당 페이지 HTML이 `git-github/practice/` 에 생성됨
- `../css/gh-ui.css` 와 `../js/gh-ui.js` 를 로드함
- 시나리오 정본(§1)과 한 글자도 어긋나지 않음
- 영문 UI 라벨 전부 원문 + 괄호 한국어 병기
- 신규 CSS/JS 파일 없음, 기존 파일 수정 없음
- `sidebar-toc` 링크가 본문 `id` 와 전부 일치
- pager 링크가 §5 표와 일치

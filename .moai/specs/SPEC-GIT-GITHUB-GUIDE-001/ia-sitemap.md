---

## id: SPEC-GIT-GITHUB-GUIDE-001/ia-sitemap version: 1.0.0 status: Planned created: 2026-06-19 updated: 2026-06-19 author: jw priority: High

# 정보 구조 및 사이트맵 (IA & Sitemap) — 비개발자를 위한 Git/GitHub 멀티페이지 가이드

> 본 파일은 **멀티페이지 IA 기획** 이다. tmux 가이드(단일 페이지)와의 핵심 차이점. 실제 HTML/CSS/JS 구현은 이후 Phase에서 다룬다.

---

## 1. IA 철학: 하이브리드 (Hybrid)

본 사이트는 **두 가지 탐색 모드**를 동시에 제공한다. 한 사이트, 두 길.

```
                          ┌─────────────────────────────────────┐
                          │      HOME HUB (index.html)          │
                          │  "처음 오셨나요? / 다시 찾으셨나요?"  │
                          └──────────────┬──────────────────────┘
                                         │
                    ┌────────────────────┴────────────────────┐
                    │                                         │
                    ▼                                         ▼
        ┌───────────────────────┐              ┌──────────────────────────┐
        │ (A) TUTORIAL TRACK     │              │ (B) REFERENCE HUB        │
        │ 초보자용 선형 경로      │              │ 재방문자용 점프 허브      │
        │ "처음부터 끝까지 읽기"  │              │ "필요할 때 찾아 보기"     │
        └───────────────────────┘              └──────────────────────────┘
                    │                                         │
                    ▼                                         ▼
        [T01] → [T02] → ... → [T21]            [R01] [R02] [R03] [R04]
        (이전/다음 페이저)                       (사전/용어집/FAQ/치트시트)
                    │                                         │
                    └──────────────┬──────────────────────────┘
                                   │
                                   ▼
                       ┌──────────────────────────┐
                       │  CASES GALLERY            │
                       │  "이렇게도 쓸 수 있어요"    │
                       │  (필터: 비개발/전문가/분야)  │
                       └──────────────────────────┘
                       (모든 트랙·참조 페이지에서 교차 링크)
```

### 왜 하이브리드인가

- **처음 온 독자**는 한 페이지씩 순서대로 읽어야 "왜?"와 "뭔지?"가 차곡차곡 쌓인다. → Tutorial Track (선형)
- **다시 찾는 독자**는 "git merge conflict 어떻게 풀지?"처럼 특정 명령어만 찾고 싶다. → Reference Hub (점프)
- 두 독자 모두를 버리지 않기 위해 한 사이트에 두 길을 둔다.

---

## 2. 전체 사이트맵 (Full Sitemap)

총 **약 27페이지** (1 홈 + 21 튜토리얼 + 4 참조 + 1 사례 갤러리).

### 2.1 홈 허브 (Home Hub)

| ID | 파일 | 제목(방향) | 역할 |
| --- | --- | --- | --- |
| HOME | `index.html` | "Git과 GitHub, 한 권의 친절한 안내서" | 두 길(Tutorial/Reference) 안내 + 검색 + 사례 갤러리 미리보기 + 시리즈 링크 |

### 2.2 튜토리얼 트랙 (Tutorial Track, A) — 선형 경로

초급 → 중급 → 고급 → GitHub 협업 → GitHub 자동화·보안·워크플로우.

**파트 1: Git 기초 (초급, T01\~T05)**

| ID | 파일 | 제목(방향) | 핵심 |
| --- | --- | --- | --- |
| T01 | `tutorial/git-concept.html` | "버전 관리가 뭔가요? — 시간을 되돌릴 수 있는 사진첩" | VCS, 분산 vs 중앙, 스냅샷-not-diff |
| T02 | `tutorial/git-setup.html` | "Git, 설치하고 첫 인사까지" | install(mac/linux/win), config, init, clone |
| T03 | `tutorial/git-basics.html` | "수정 → 묶기 → 기록, 세 단어의 마법" | status, add, commit(-m/--amend), log, show |
| T04 | `tutorial/git-staging.html` | "3개의 방 — 작업·대기·기록" | working/staging/repo 3영역, diff 변형들 |
| T05 | `tutorial/git-history.html` | "과거로 여행하기 — 히스토리 읽는 법" | log 옵션, blame, reflog, show |

**파트 2: Git 브랜치·병합 (중급, T06\~T08)**

| ID | 파일 | 제목(방향) | 핵심 |
| --- | --- | --- | --- |
| T06 | `tutorial/git-branch.html` | "평행 우주를 만드는 법 — 브랜치" | branch, switch/checkout, HEAD, detached |
| T07 | `tutorial/git-merge.html` | "두 세계가 하나로 — 병합과 충돌" | fast-forward/3-way merge, conflict 해결 |
| T08 | `tutorial/git-rebase.html` | "역사를 깔끔하게 다시 쓰기 — 리베이스" | rebase, interactive(squash/reword/reorder), merge vs rebase |

**파트 3: Git 원격·태그·복구·고급 (중·고급, T09\~T13)**

| ID | 파일 | 제목(방향) | 핵심 |
| --- | --- | --- | --- |
| T09 | `tutorial/git-remote.html` | "세상과 연결되기 — 원격 저장소" | remote, fetch, pull(vs fetch), push, clone, pull --rebase |
| T10 | `tutorial/git-tag.html` | "버전, 딱 붙이기 — 태그와 시맨틱 버전" | lightweight/annotated tag, semantic versioning |
| T11 | `tutorial/git-undo.html` | "실수했다고요? 괜찮아요 — 되돌리기" | reset(soft/mixed/hard), revert, restore, checkout &lt;file&gt;, clean, reflog 복구, "Oh Shit Git" |
| T12 | `tutorial/git-advanced.html` | "한 단계 더 깊이 — 고급 기법" | cherry-pick, stash, bisect, submodule, worktree, filter-repo |
| T13 | `tutorial/git-config-files.html` | "Git을 내 입맛대로 — 설정과 파일들" | .gitignore, .gitattributes, hooks(client-side), Git LFS, aliases |

**파트 4: GitHub 협업 (중급, T14\~T17)**

| ID | 파일 | 제목(방향) | 핵심 |
| --- | --- | --- | --- |
| T14 | `tutorial/github-concept.html` | "Git은 도구, GitHub는 마을" | git vs github, hosting, social coding |
| T15 | `tutorial/github-repo.html` | "나의 첫 저장소 — 만들기·가져오기" | create, fork, clone, template repo, import |
| T16 | `tutorial/github-issues-pr.html` | "대화로 코드를 만드는 법 — Issue와 PR" | Issue(templates/labels/milestones), PR(draft, review, merge 전략: squash/rebase/merge-commit) |
| T17 | `tutorial/github-review.html` | "코드 리뷰, 서로 키워주는 시간" | review comments, suggestions, CODEOWNERS, branch protection, required reviews, status checks |

**파트 5: GitHub 자동화·보안·워크플로우 (고급, T18\~T21)**

| ID | 파일 | 제목(방향) | 핵심 |
| --- | --- | --- | --- |
| T18 | `tutorial/github-actions.html` | "로봇 비서를 고용하세요 — GitHub Actions" | workflow .yml, events/jobs/steps/runners, marketplace, matrix, secrets/variables, artifacts, caching, environments, Pages 배포, gh CLI |
| T19 | `tutorial/github-security.html` | "안전한 협업의 기술 — 보안" | Dependabot, secret scanning, code scanning, branch protection, 2FA, commit signing(SSH/GPG), Secrets vs Variables |
| T20 | `tutorial/github-workflow-models.html` | "어떻게 일할 것인가 — 워크플로우 모델 비교" | GitFlow(Driessen 2010), GitHub Flow, Trunk-based, Forking, Release flow — 비교 + 언제 쓸지 |
| T21 | `tutorial/github-extras.html` | "GitHub, 더 넓은 세계" | Releases, Packages, Container registry, Codespaces, Copilot, Gists, profile README, orgs/teams |

### 2.3 참조 허브 (Reference Hub, B) — 점프 허브

| ID | 파일 | 제목(방향) | 역할 |
| --- | --- | --- | --- |
| R01 | `ref/command-dictionary.html` | "Git/GitHub 명령어 사전" | 검색/필터 가능한 명령어 리스트 (알파벳/주제/난이도) |
| R02 | `ref/glossary.html` | "용어집 — 두려운 단어 사전" | commit/branch/rebase/PR 등 모든 용어 + 비유 + 공식 정의 |
| R03 | `ref/faq.html` | "자주 묻는 질문 (FAQ)" | 실수/충돌/잃어버림 등 초보자 실제 질문 + 답 |
| R04 | `ref/cheatsheet.html` | "한눈에 보는 치트시트 모음" | 단일 페이지 인쇄용 치트시트 (주제별 카드) |

### 2.4 사례 갤러리 (Cases Gallery) — 시그니처

| ID | 파일 | 제목(방향) | 역할 |
| --- | --- | --- | --- |
| CASES | `cases/index.html` | "이렇게도 쓸 수 있어요 — 사례 갤러리" | Tier 1(비개발자) + Tier 2(전문가) 카드 그리드 + 필터(분야/난이도/주체) |

> 상세 사례 카탈로그는 `cases-gallery.md` 참조.

---

## 3. 파일 구조 (File Tree Sketch)

```
git-github-guide/                       ← 사이트 루트
├── index.html                          ← HOME HUB
├── tutorial/                           ← 튜토리얼 트랙 (A) — 21페이지
│   ├── git-concept.html                (T01)
│   ├── git-setup.html                  (T02)
│   ├── git-basics.html                 (T03)
│   ├── git-staging.html                (T04)
│   ├── git-history.html                (T05)
│   ├── git-branch.html                 (T06)
│   ├── git-merge.html                  (T07)
│   ├── git-rebase.html                 (T08)
│   ├── git-remote.html                 (T09)
│   ├── git-tag.html                    (T10)
│   ├── git-undo.html                   (T11)
│   ├── git-advanced.html               (T12)
│   ├── git-config-files.html           (T13)
│   ├── github-concept.html             (T14)
│   ├── github-repo.html                (T15)
│   ├── github-issues-pr.html           (T16)
│   ├── github-review.html              (T17)
│   ├── github-actions.html             (T18)
│   ├── github-security.html            (T19)
│   ├── github-workflow-models.html     (T20)
│   └── github-extras.html              (T21)
├── ref/                                ← 참조 허브 (B) — 4페이지
│   ├── command-dictionary.html         (R01)
│   ├── glossary.html                   (R02)
│   ├── faq.html                        (R03)
│   └── cheatsheet.html                 (R04)
├── cases/                              ← 사례 갤러리 — 1페이지 (단일 인덱스 + 필터)
│   └── index.html                      (CASES)
├── css/                                ← 공유 스타일
│   ├── tokens.css                      (따뜻한 크림/코랄/초록, 폰트 변수 — 시리즈 공유)
│   ├── base.css                        (reset, 타이포 기본)
│   ├── layout.css                      (헤더/푸터/그리드/반응형)
│   ├── components.css                  (side-note 박스 6종, 코드/명령어, 카드, 페이저)
│   └── pages.css                       (홈/튜토리얼/참조/사례 템플릿별)
├── js/                                 ← 공유 스크립트
│   ├── nav.js                          (글로벌 헤더/브레드크럼/모바일 토글)
│   ├── progress.js                     (현재 페이지 + 트랙 전체 읽기 진행률)
│   ├── reveal.js                       (IntersectionObserver 스크롤 리빌)
│   ├── search.js                       (클라이언트 사이드 검색)
│   ├── search-index.json               (사전 빌드된 검색 인덱스)
│   ├── fake-terminal.js                (재사용: tmux에서 가져온 가짜 터미널)
│   ├── git-graph.js                    (신규: commit 그래프 시각화)
│   ├── pr-flow.js                      (신규: PR 워크플로우 애니메이션)
│   ├── actions-pipeline.js             (신규: Actions 파이프라인 애니메이션)
│   ├── oh-shit-git.js                  (신규: 실수 복구 시뮬레이터)
│   ├── cases-filter.js                 (신규: 사례 갤러리 필터)
│   └── glossary-tooltip.js             (신규: 용어 hover/focus 툴팁)
├── assets/                             ← 일러스트/이미지/SVG
│   ├── illustrations/                 (따뜻한 일러스트 세트)
│   └── og/                            (소셜 공유용 OG 이미지)
└── series/                             ← 시리즈 교차 링크 메타 (선택)
    └── tmux.html → (외부: tmux 가이드 사이트)
```

---

## 4. 내비게이션 시스템 (Navigation System)

### 4.1 글로벌 헤더 (Global Header) — 모든 페이지 공통

```
┌───────────────────────────────────────────────────────────────────────┐
│ [로고 Git/GitHub 안내서]  학습트랙 ▾  참조 ▾  사례  검색🔍  [시리즈:tmux]│
└───────────────────────────────────────────────────────────────────────┘
```

- **로고**: 클릭 시 `index.html` (홈 허브)로.
- **학습트랙 ▾**: 튜토리얼 트랙(T01\~T21) 드롭다운. 현재 읽는 페이지 강조.
- **참조 ▾**: 참조 허브(R01\~R04) 드롭다운.
- **사례**: `cases/index.html` 직행.
- **검색🔍**: 클라이언트 사이드 검색 오버레이. 명령어/용어/페이지 제목 통합 검색.
- **시리즈:tmux**: 형제 사이트(tmux 가이드)로 이동 — 시리즈 결속 표시.

### 4.2 브레드크럼 (Breadcrumb) — 모든 하위 페이지

```
홈 › 튜토리얼 › Git 기초 › 버전 관리가 뭔가요?
홈 › 참조 › 명령어 사전
홈 › 사례 갤러리
```

- 현재 위치를 항상 보여줌. 각 단계 클릭 시 상위로 이동.

### 4.3 이전/다음 페이저 (Prev/Next Pager) — 튜토리얼 트랙 페이지 하단

```
┌────────────────────────────┐  ┌────────────────────────────┐
│ ← 이전                      │  │ 다음 →                      │
│ T01 버전 관리가 뭔가요?      │  │ T03 수정 → 묶기 → 기록       │
└────────────────────────────┘  └────────────────────────────┘
```

- 선형 경로를 유도. 페이지 하단에 큰 카드형.
- 참조/사례 페이지에는 (기본) 페이저 없음. "관련 페이지" 추천으로 대체.

### 4.4 사이드바 TOC (Sidebar Table of Contents) — 튜토리얼 긴 페이지

```
┌─────────────────────┐
│ 이 페이지에서         │
│ • 1. 무엇인가         │
│ • 2. 왜 쓰나          │
│ • 3. 어떻게           │   ← 현재 섹션 하이라이트
│ • 4. 실습             │
└─────────────────────┘
```

- 데스크톱: 우측 고정(또는 좌측). 현재 섹션 스크롤 스파이.
- 모바일: 상단 접기/펼치기 (하단 시트 또는 인라인).

### 4.5 읽기 진행률 (Reading Progress) — 두 가지

- **현재 페이지 내 진행률**: 상단 2px 바 (스크롤 위치).
- **트랙 전체 진행률**: 헤더 또는 사이드바에 "T03/21" + 진행 바. localStorage로 기억. (예: "튜토리얼 5/21 완료 — 24%")

### 4.6 클라이언트 사이드 검색 (Client-Side Search)

- **인덱스**: 빌드 없이 사전 작성된 `search-index.json` (제목·요약·명령어·용어·사례).
- **UI**: 헤더 검색 아이콘 → 전체 오버레이 → 입력 즉시 결과. 키보드(`/` 또는 Ctrl+K) 단축키.
- **결과 분류**: 튜토리얼 / 참조 / 사례 / 명령어 탭으로 그룹.
- **서버 없음**: 정적 호스팅에서도 동작.

### 4.7 "이 시리즈의 다른 글" (Series Cross-Link) — 모든 페이지 푸터 근처

```
이 시리즈의 다른 글
┌──────────────────────┐  ┌──────────────────────┐
│ [tmux 아이콘]         │  │ [Git/GitHub 아이콘]   │
│ tmux, 방 하나를 통째로 │  │ Git과 GitHub 안내서    │
│ (형제 사이트)          │  │ (현재 사이트)          │
└──────────────────────┘  └──────────────────────┘
```

- 시리즈 결속 표시. 두 사이트가 같은 "따뜻한 튜토리얼 시리즈"임을 강조.

---

## 5. 두 탐색 모드 — 독자가 길을 고르는 법

### 5.1 홈 허브에서의 분기 (Home Hub Branching)

홈 허브(`index.html`)는 두 개의 큰 문을 보여준다:

```
┌──────────────────────────────────────────────────────────┐
│  "처음 오셨나요?"                                          │
│  ┌────────────────────────────────────────────────────┐  │
│  │ 📖 튜토리얼 트랙 따라가기                             │  │
│  │ "Git/GitHub를 처음부터, 한 페이지씩."                 │  │
│  │ [T01 버전 관리가 뭔가요? 부터 시작 →]                 │  │
│  └────────────────────────────────────────────────────┘  │
│                                                          │
│  "다시 찾으셨나요?"                                       │
│  ┌────────────────────────────────────────────────────┐  │
│  │ 🔎 참조 허브 바로가기                                  │  │
│  │ "필요한 명령어/용어만 빠르게."                         │  │
│  │ [명령어 사전] [용어집] [FAQ] [치트시트]                 │  │
│  └────────────────────────────────────────────────────┘  │
│                                                          │
│  "이렇게도 쓸 수 있다고?"                                 │
│  ┌────────────────────────────────────────────────────┐  │
│  │ ✨ 사례 갤러리 둘러보기                               │  │
│  │ "소설가·디자이너·법률가·리눅스 커널까지."              │  │
│  │ [사례 갤러리로 →]                                    │  │
│  └────────────────────────────────────────────────────┘  │
└──────────────────────────────────────────────────────────┘
```

### 5.2 어떤 독자가 어느 길을?

| 독자 유형 | 추천 경로 | 이유 |
| --- | --- | --- |
| "버전 관리"를 처음 들어본 사람 | (A) Tutorial Track T01부터 순서대로 | 개념이 순차적으로 쌓여야 이해 |
| 개발자 동료의 PR을 보고 궁금한 사람 | (A) T14(github-concept)부터 | git은 건너뛰고 github 협업부터 |
| "git merge conflict 어떻게 풀지?" 찾는 사람 | (B) R01 사전 또는 R03 FAQ | 특정 명령만 즉시 |
| "rebase가 뭔지 한 줄로" 묻는 사람 | (B) R02 용어집 | 정의 + 비유 한 줄 |
| "비개발자도 git 쓸 수 있나요?" 묻는 사람 | 사례 갤러리 → Tier 1 | 영감 + 동기부여 |

### 5.3 교차 링크 전략 (Cross-Linking Strategy)

세 영역(튜토리얼↔참조↔사례)은 양방향으로 연결된다:

```
튜토리얼 페이지 (TXX)
   │
   ├──→ 해당 명령어 → R01 사전 (페이지 내 용어 클릭/툴팁)
   ├──→ 해당 용어   → R02 용어집 (용어 hover 툴팁 + "더 보기" 링크)
   ├──→ 실수 시나리오 → R03 FAQ (주의 박스에서 "자주 묻는 질문" 링크)
   └──→ "이렇게도 쓸 수 있어요" callout → 사례 갤러리 해당 카드

참조 페이지 (RXX)
   │
   ├──→ "이 명령어가 쓰이는 튜토리얼" → TXX
   └──→ "이 용어의 실제 사례" → 사례 갤러리

사례 갤러리
   │
   └──→ 각 사례 카드 → "관련 튜토리얼 TXX / 관련 명령어 R01#xxx"
```

**핵심 원칙**: 독자가 어느 페이지에 있든, 3영역 어디로든 한 번의 클릭으로 이동 가능.

---

## 6. URL 및 파일 이름 규칙 (URL & Naming Convention)

### 6.1 파일 이름

- **소문자, 하이픈 구분**(kebab-case): `git-concept.html`, `github-issues-pr.html`.
- **접두어로 주제 구분**: `git-*` / `github-*` / `ref/*` / `cases/*`.
- **튜토리얼은 번호를 URL에 안 넣음**: 순서는 내비게이션(prev/next)이 관리. 파일명은 안정적. (예: `/tutorial/git-concept.html` — 순서 바뀌어도 URL 안 깨짐)
- **참조 페이지는 의미명**: `/ref/command-dictionary.html`, `/ref/glossary.html`.

### 6.2 URL 구조 (정적, 빌드 없음)

```
/index.html                              홈
/tutorial/git-concept.html              T01
/tutorial/github-issues-pr.html         T16
/ref/command-dictionary.html            R01
/ref/glossary.html                      R02
/cases/index.html                       사례
```

- 확장자 `.html` 그대로 (빌드 단계 없음, `file://` 동작).
- 앵커는 `#section-slug` (예: `/tutorial/git-merge.html#conflict`).

### 6.3 페이지 내 앵커 (In-page Anchors)

- 각 섹션은 `id` 앵커. 사이드바 TOC와 URL fragment로 직접 링크.
- 용어집/사전은 항목별 앵커: `/ref/glossary.html#branch`, `/ref/command-dictionary.html#git-reset`.

---

## 7. 모바일 내비게이션 패턴 (Mobile Navigation)

### 7.1 모바일 글로벌 헤더 (축소)

```
┌───────────────────────────────┐
│ [로고]              검색  ☰    │  ← 햄버거 메뉴
└───────────────────────────────┘
```

### 7.2 햄버거 메뉴 (드로어/시트)

- 슬라이드인 드로어(좌→우) 또는 하단 시트.
- "학습트랙 / 참조 / 사례 / 시리즈" 전체 메뉴.
- 현재 페이지 강조.

### 7.3 모바일 사이드바 TOC

- 데스크톱의 우측 고정 사이드바는 모바일에서 **상단 접기/펼치기 카드**로.
- "이 페이지에서 ▾" 버튼.

### 7.4 모바일 하단 바 (Bottom Bar) — 튜토리얼 트랙 한정

```
┌──────────────────────────────────────────────┐
│  [← 이전]   T03/21 · 14%   [다음 →]            │  ← 하단 고정
└──────────────────────────────────────────────┘
```

- 튜토리얼 페이지에서만 노출. 선형 진행을 손닿게 함.
- 참조/사례 페이지는 하단 바 대신 "관련 페이지" 추천.

### 7.5 모바일 검색

- 헤더 검색 아이콘 → 전체 화면 오버레이 → 결과 탭.

### 7.6 모바일 side-note 박스

- 본문 흐름 안으로 인라인 펼침 (데스크톱 2단 → 모바일 1단).

---

## 8. 페이지 수 추정 (Page Count Estimate)

| 영역 | 페이지 수 |
| --- | --- |
| 홈 허브 | 1 |
| 튜토리얼 트랙 (T01\~T21) | 21 |
| 참조 허브 (R01\~R04) | 4 |
| 사례 갤러리 | 1 |
| **총계** | **27페이지** |

> 참고: tmux 가이드는 단일 1페이지. 본 사이트는 tmux 대비 약 27배 분량. 빌드 단계 없이 27개 정적 HTML + 공유 css/js로 관리.

---

## 9. 시리즈 교차 링크 (Series Cross-Site Linking)

- 본 사이트의 모든 페이지 푸터 근처에 "이 시리즈의 다른 글" 카드.
- tmux 가이드 사이트도 동일하게 본 사이트를 향한 카드를 가짐 (구현 Phase에서 협의).
- 시각적 단서: 같은 디자인 패밀리(크림/코랄) + 각 사이트의 시그니처 색(tmux=민트 강조, git=따뜻한 초록 강조).

---

## HISTORY

- 2026-06-19: 최초 작성. 하이브리드 IA(튜토리얼 트랙 + 참조 허브) 확정. 총 27페이지(홈 1 + 튜토리얼 21 + 참조 4 + 사례 1). 시리즈 교차 링크 전략 포함.
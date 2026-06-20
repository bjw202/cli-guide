---
id: SPEC-TAURI-GUIDE-001/ia-sitemap
version: 1.0.0
status: Planned
created: 2026-06-21
updated: 2026-06-21
author: jw
priority: High
---

# IA / Sitemap — Tauri (Rust) 데스크톱 앱 개발 가이드

> 페이지 트리·파일명·내비게이션 시스템. SPEC-GIT-GITHUB-GUIDE-001/ia-sitemap 하이브리드 IA 철학 상속.
> 정적 멀티페이지, 빌드 없음, `file://` 동작.

---

## 1. IA 철학: 하이브리드 (Hybrid) — 시리즈 상속

두 탐색 모드를 섞는다(시리즈 일관성):
- **A. 선형 튜토리얼 트랙**: T01→T09 순서대로 읽는 길.
- **B. 참조 허브**: 치트시트·용어집·FAQ에서 점프하는 길.
- **홈 허브**가 두 길의 분기점. 시리즈 "터미널 친구들"의 세 번째 문.

### 왜 하이브리드인가
Tauri는 "처음부터 끝까지" 읽어야 이해가 쌓이는(탄생 배경 → 흐름 → 도구 → 문법 → 실전) 동시에,
"이 명령 뭐였지"를 치트시트에서 찾는 점프 수요도 있다. 선형 + 허브가 둘 다 필요.

---

## 2. 전체 사이트맵 (Full Sitemap)

### 2.1 홈 허브 (Home Hub)
```
tauri/index.html
  ├── 3개 문(시작하기 / 개념잡기 / 실전만들기)
  ├── 시리즈 링크(tmux · Git/GitHub)
  └── 헤더 검색
```

### 2.2 튜토리얼 트랙 (Tutorial Track, A) — 선형 9페이지

| ID | 파일 | 제목 | Phase |
|---|---|---|---|
| T01 | `tutorial/why-tauri.html` | 왜 Tauri인가 — 탄생 배경 | P2 |
| T02 | `tutorial/electron-comparison.html` | Electron과 비교 | P2 |
| T03 | `tutorial/architecture.html` | 3계층 아키텍처 | P3 |
| T04 | `tutorial/dev-workflow.html` | 개발 흐름 한눈에 | P3 |
| T05 | `tutorial/tooling.html` | 도구 생태계 | P4 |
| T06 | `tutorial/rust-basics.html` | Rust 대표 문법(얕게) | P5 |
| T07 | `tutorial/ipc-commands.html` | 프론트·Rust 대화(IPC) | P6 |
| T08 | `tutorial/build-deploy.html` | 빌드와 배포 | P6 |
| T09 | `tutorial/mini-project.html` | 실전 미니 프로젝트 | P7 |

> 선형 순서: T01(왜) → T02(비교) → T03(구조) → T04(흐름) → T05(도구) → T06(문법) → T07(IPC) → T08(빌드) → T09(실전).
> PrevNextPager로 일렬로 연결.

### 2.3 참조 허브 (Reference Hub, B) — 점프 3페이지 (선택)

| ID | 파일 | 제목 | 비고 |
|---|---|---|---|
| R01 | `ref/cheatsheet.html` | Tauri/Rust 한눈 치트시트 | 도구·명령·문법 요약 |
| R02 | `ref/glossary.html` | 용어집(Rust·Tauri) | 소유권·컴파일러·매크로·IPC·웹뷰 등 |
| R03 | `ref/faq.html` | FAQ | "Rust 어렵지 않나요?", "v1/v2 차이?" 등 |

> 참조 3종은 분량 조절을 위해 P7 이후 별도 Phase로 둘 수도(본 기획에서는 P1/P7에 분산 가능).

### 2.4 사례 갤러리 — **없음**
Tauri는 개발 프레임워크라 "비개발자 실생활 사례" 시그니처가 맞지 않음. 사례는 T01/T02에
"대표 앱"(1Password, Cody, VS Code, Slack 등) 인라인으로 처리.

---

## 3. 파일 구조 (File Tree Sketch)

```
tauri/
├── index.html                      # 홈 허브
├── css/
│   ├── tokens.css                  # 시리즈 공유 토큰 + --tauri-rust
│   ├── base.css                    # 리셋·기본
│   ├── layout.css                  # 헤더/푸터/그리드/반응형
│   ├── components.css              # side-note·cmd-pill·cheat-card·자산
│   └── pages.css                   # 템플릿별 본문(.tpl-home/tutorial/ref)
├── js/
│   ├── nav.js                      # 헤더·햄버거·브레드크럼 자동
│   ├── progress.js                 # 읽기 진행률·트랙 진행률
│   ├── reveal.js                   # 스크롤 리빌
│   ├── tauri-compare.js            # P2 비교 매트릭스 토글 자산
│   ├── workflow-stepper.js         # P3 워크플로우 스텝퍼 자산
│   ├── ipc-simulator.js            # P6/P7 invoke 데모 자산
│   └── glossary-tooltip.js         # 용어 툴팁(Rust/Tauri 용어)
├── tutorial/
│   ├── why-tauri.html              # T01
│   ├── electron-comparison.html    # T02
│   ├── architecture.html           # T03
│   ├── dev-workflow.html           # T04
│   ├── tooling.html                # T05
│   ├── rust-basics.html            # T06
│   ├── ipc-commands.html           # T07
│   ├── build-deploy.html           # T08
│   └── mini-project.html           # T09
└── ref/
    ├── cheatsheet.html             # R01
    ├── glossary.html               # R02
    └── faq.html                    # R03
```

> CSS 5분할·JS 3종 기본(nav/progress/reveal)은 시리즈 원칙 준수. 자산 JS는 필요 페이지만 `<script>` 로드.

---

## 4. 내비게이션 시스템 (Navigation System) — 시리즈 상속

### 4.1 글로벌 헤더 (모든 페이지 공통)
```
[로고 Tauri 가이드] | 학습트랙 ▾ | 참조 ▾ | [🔍 검색] | [이 시리즈: tmux · Git/GitHub]
```
- 학습트랙 드롭다운: T01/T03/T06/T07/T09 (큐레이션 5개).
- 시리즈 링크는 tmux·Git/GitHub 양쪽 향함(시리즈 결속).

### 4.2 브레드크럼 — nav.js 자동 생성
`홈 › 튜토리얼 › T03 아키텍처` 형태. `tutorial`→"튜토리얼", `ref`→"참조" 라벨 매핑.

### 4.3 이전/다음 페이저 — 튜토리얼 9페이지 일렬 연결
T01←→T02←→...←→T09. T09가 끝(다음 없음). T01이 처음(이전 없음).

### 4.4 사이드바 TOC — 튜토리얼 페이지 섹션 목록
긴 페이지(T01/T03/T04 등)에 섹션 앵커 링크.

### 4.5 읽기 진행률 — 두 가지(시리즈 상속)
현재 페이지 진행률(reading-bar) + (선택)트랙 전체 진행률(localStorage).

### 4.6 클라이언트 사이드 검색 — 헤더 🔍
`search-index.json`(홈에 임베드) + JS 풀텍스트. Ctrl+K.

### 4.7 "이 시리즈의 다른 글" — 푸터 근처
tmux · Git/GitHub · **Tauri(현재)** 양방향 링크.

---

## 5. 교차 링크 전략 (Cross-Linking)

| 출발 | 도착 | 맥락 |
|---|---|---|
| T01(왜) | T02(비교) | "더 자세한 비교는 T02" |
| T02(비교) | T01(왜) | "탄생 배경은 T01" |
| T03(아키텍처) | T07(IPC) | "IPC 자세히" |
| T04(흐름) | T05(도구) · T08(빌드) | 흐름의 각 단계 상세화 |
| T06(문법) | T07(IPC) | "`#[tauri::command]` 쓰는 법" |
| T07(IPC) | T09(실전) | "직접 만들어 보기" |
| T08(빌드) | T02(비교) | "크기 비교 다시 보기" |
| R02(용어집) | 각 튜토리얼 용어 | GlossaryTooltip hover/focus |

> 모든 교차 링크는 **양방향** 원칙(시리즈 결속).

---

## 6. URL 및 파일 이름 규칙

### 6.1 파일 이름
- 튜토리얼: `tutorial/{kebab-case}.html` (예: `why-tauri.html`).
- 참조: `ref/{kebab-case}.html`.
- 명령/식별자는 영어 소문자·하이픈. 본문은 한국어.

### 6.2 URL 구조 (정적, 빌드 없음)
```
https://bjw202.github.io/cli-guide/tauri/index.html
https://bjw202.github.io/cli-guide/tauri/tutorial/why-tauri.html
https://bjw202.github.io/cli-guide/tauri/ref/cheatsheet.html
```
> 본 사이트는 시리즈의 3번째 멤버로 `/cli-guide/tauri/` 하위에 위치(시리즈 랜딩에서 분기).

### 6.3 페이지 내 앵커
`id="kebab-case"` (예: `#why-light`, `#ipc`). GlossaryTooltip·사이드바 TOC가 사용.

---

## 7. 시리즈 통합 (Series Integration)

- 루트 랜딩(`cli-guide/index.html`): tmux · Git/GitHub 카드 옆에 **Tauri 카드** 추가(P1 범위).
- 시리즈 헤더 링크 양방향: tmux·Git/GitHub에서 Tauri로, Tauri에서 양쪽으로.
> 랜딩 "터미널 친구들" 명칭을 "개발자 친구들"로 넓히는 건 별도 논의(roadmap §4 리스크).

---

## HISTORY

- 2026-06-21: 최초 작성. 하이브리드 IA(선형 9 튜토리얼 + 참조 3) 확정. 파일 트리·내비게이션 시스템·교차 링크 전략 정리. 사례 갤러리는 프레임워크 성격상 제외.

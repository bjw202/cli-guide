---
id: SPEC-TAURI-GUIDE-001/design-guide
version: 1.0.0
status: Planned
created: 2026-06-21
updated: 2026-06-21
author: jw
priority: High
---

# Design Guide — Tauri (Rust) 데스크톱 앱 개발 가이드

> 시리즈 공유 디자인 시스템(tmux · Git/GitHub) 상속 + Tauri 전용 액센트.
> 원천: SPEC-GIT-GITHUB-GUIDE-001/design-guide.md. 본 문서는 **차이점·신규**만 상세히.

---

## 1. 톤앤매너 (Tone & Manner) — 시리즈 공유

- **비유 먼저, 단어 나중**: 모든 추상 개념에 일상 비유 선행.
- 따뜻하고 친절한 어조. 두려운 단어는 사전으로 풀어쓰기.
- 한국어 본문, 식별자/명령/코드는 영어 그대로.

> Tauri 특화 비유 톤: Chromium 번들="앱마다 브라우저 한 벌", 웹뷰="운영체제 창 빌려쓰기",
> IPC="식당 주문서(invoke) → 주방 명령(command)", Rust="주방", 프론트="손님".

---

## 2. 컬러 시스템 — 시리즈 공유 + Tauri 액센트

### 2.1 시리즈 공유 토큰 (tmux/Git/GitHub와 동일)
```
--bg-base: #FFFBF5;  --bg-surface: #FFFFFF;  --bg-soft: #FFF6EC;
--primary: #FF8A5B;  --primary-dark: #E66E3F;  --primary-soft: #FFE3D4;
--accent: #3D5AFE;   --accent-soft: #E2E8FB;   --accent-dark: #2A47D4;
--secondary: #26A69A;
--warning: #EF5350;
--text-primary: #2D2A26;  --text-secondary: #7A726B;
```

### 2.2 Tauri 사이트만의 액센트 (tmux/Git/GitHub와 구별)
```
--tauri-rust: #CE412B;        /* Rust crab 오렌지/적갈 — 코드 블록·Rust 강조 */
--tauri-rust-soft: #F8E4DF;   /* 코드 블록 배경 (따뜻한 톤) */
--tauri-rust-dark: #A8341F;   /* soft 배경 위 텍스트용 (AA 확보) */
```
- **용도**: Rust 코드 블록(`.code-block--rust`), `#[tauri::command]` 강조, Rust crab 마스코트.
- **AA 대비**: `--tauri-rust-dark #A8341F` on `--tauri-rust-soft #F8E4DF` = 5.6:1 (PASS).
- 시리즈 side-note 5종(metaphor/history/tip/warn/extra) + 사례(case) 색은 그대로. Tauri는 **7번째 액센트**로 코드 영역만 구분.

### 2.3 side-note 박스 색 매핑 — 시리즈 공유 6종 (변경 없음)
`--note-metaphor/history/tip/warn/extra/case` + 테두리. Git/GitHub 가이드와 동일.

---

## 3. 타이포그래피 — 시리즈 공유 (변경 없음)

- 본문: Pretendard Variable. 코드: JetBrains Mono.
- 타입 스케일 `--fs-hero/section/subhead/body/body-sm/mono/note/small` 상속.
- `word-break: keep-all` 한국어 줄바꿈.

---

## 4. 페이지 템플릿 (Multi-Page Templates) — 시리즈 상속

4개 템플릿(`.tpl-home/tutorial/ref/cases`) 중 **Tauri는 3개 사용**(cases 없음):
- `.tpl-home` — 홈 허브(3개 문).
- `.tpl-tutorial` — 튜토리얼 9페이지. 헤더/사이드바 TOC/페이저/치트시트.
- `.tpl-ref` — 참조 3페이지. 필터/검색.

> 사례 갤러리 템플릿(`.tpl-cases`)은 Tauri에 미사용(프레임워크 성격상 사례 갤러리 제외).

### 4.1 튜토리얼 페이지 구성 (표준)
```
[ReadingBar] [GlobalHeader] [Breadcrumb]
[PageHeader(eyebrow/title/subhead)]
[Case 콜아웃(대표 앱)] → 본문 섹션들(side-note 교삽) → 자산(해당 시) → [CheatCard] → [PrevNextPager]
[SidebarTOC]
[GlobalFooter]
```

### 4.2 글로벌 헤더/푸터 — 시리즈 상속
로고 "Tauri 가이드", 학습트랙/참조 드롭다운, 검색, 시리즈 링크.

---

## 5. 핫 에셋 인벤토리 ("Hot Assets") — 시리즈 재사용 + Tauri 신규

> 각 자산은 비개발자/초보 개발자 학습 가치로 정당화. 과잉 엔지니어링 금지.

### A. Scroll-triggered Reveal — 시리즈 재사용 (reveal.js)
스크롤 시 개념 등장. `prefers-reduced-motion` 즉시 표시.

### B. Interactive Fake-Terminal — 시리즈 재사용 + Tauri 확장
설치/개발/빌드 명령 시퀀스 재연(`rustup` → `npm create tauri-app` → `cargo tauri dev/build`).

### C. Electron-vs-Tauri Compare Toggle (신규) — P2 시그니처
- **목적**: 비교 매트릭스 10항목을 "Electron 보기 / Tauri 보기 / 둘 다" 토글로 강조.
- **학습 가치**: "뭐가 다른지"를 클릭 한 번에 체감. 양측 장단 객관 전달.
- **기술(방향)**: ComparisonTable + 토글 버튼. 항목 클릭 시 해당 열 하이라이트.
- **삽입**: T02.

### D. Architecture 3-Layer Diagram (신규) — P3
- **목적**: 프론트엔드 ↔ IPC ↔ Rust 3계층 그림 + 식당 비유 오버레이.
- **기술(방향)**: 인라인 SVG 또는 CSS-positioned div. 호버 시 각 층 설명 팝업.
- **삽입**: T03.

### E. Workflow Stepper (신규) — P3
- **목적**: scaffold → dev → 작성 → build → 인스톨러 순차 하이라이트.
- **기술(방향)**: Git PRFlowDiagram 패턴(순차 하이라이트 + 각 단계 설명).
- **삽입**: T04.

### F. Invoke Simulator (신규) — P6/P7 시그니처
- **목적**: "버튼 누르면 → Rust 명령 → 결과"를 브라우저에서 모의 체험.
- **학습 가치**: IPC의 "주문서 → 주방"을 직접 해봄. 실제 Tauri 없이 감 잡기.
- **기술(방향)**: 입력란 + 버튼 → JS가 "Rust 명령 흉내" 결과 반환. FakeTerminal 변형.
- **삽입**: T07, T09.

### G. Side-note Box System (6종) — 시리즈 재사용 (변경 없음)
metaphor/history/tip/warn/extra/case.

### H. Per-page Cheat-sheet — 시리즈 재사용
각 튜토리얼 하단 한 장 요약. R01 글로벌 치트시트와 중복 방지.

### I. Glossary Tooltips (Hover/Focus) — 시리즈 재사용 + Tauri 용어
Rust/Tauri 용어(소유권·컴파일러·매크로·바운드·IPC·웹뷰·ACL 등) 툴팁. R02 데이터 소비.

### J. Breadcrumb + Prev/Next + Reading Progress — 시리즈 재사용 (멀티페이지 필수)

### K. Warm Friendly Illustration Set — 시리즈 재사용 + Tauri 테마 4종 (아래 §6)

### L. Gentle Onboarding Micro-interactions — 시리즈 재사용

> Git 가이드의 GitGraph/StagingFlow/ActionsPipeline/OhShitGit/ConflictResolver 자산은 Tauri에 미사용.

---

## 6. 일러스트 — Tauri 테마 4종 (필수)

tmux/Git/GitHub 일러스트와 **동일 톤**(플랫 + 약간 텍스처, 따뜻 팔레트, 둥근 형태).

1. **"브라우저 한 벌 vs 창 빌려쓰기"** (T01/T02): 왼쪽엔 앱마다 Chromium 박스를 들고 다니는 모습, 오른쪽엔 운영체제의 창을 빌려쓰는 가벼운 모습. 크기·무게 대비 강조.
2. **식당 주방 비유** (T03/T07): 손님(프론트)이 주문서(`invoke`)를 카운터에 놓고, 주방(Rust)이 요리(`#[tauri::command]`)해서 다시 내어주는 모습.
3. **빌드 파이프라인** (T04/T08): scaffold → dev → build → 인스톨러 상자들이 컨베이어로 흐르는 모습(Git ActionsPipeline 톤 차용).
4. **Rust crab(게) 마스코트** (전역 안내자): 친근한 게 캐릭터가 안내. `--tauri-rust` 색. 따뜻한 눈.

---

## 7. 컴포넌트 인벤토리 — 시리즈 상속 + 신규 최소

| 컴포넌트 | 시리즈 재사용? | Tauri 사용 |
|---|---|---|
| GlobalHeader/Footer/Breadcrumb/Pager/TOC/ReadingProgress | 상속 | 전역 |
| SideNote(6종) | 상속 | 전 Phase |
| CommandPill(`.cmd-pill`) | 상속 | 도구·명령 표시 |
| CodeBlock(`.code-block`) | 상속 + **`.code-block--rust` 변형** | Rust 코드(--tauri-rust 강조) |
| ComparisonTable | 상속 | T02 비교 매트릭스 |
| CheatSheetCard | 상속 | T05/T06/T09 |
| GlossaryTooltip | 상속 | 전역(Rust/Tauri 용어) |
| FakeTerminal | 상속 + Tauri 명령 확장 | T04/T05/T07 |

> 신규 컴포넌트는 최소(CompareToggle/ArchitectureDiagram/WorkflowStepper/InvokeSimulator는 자산 JS로 구현, components.css에 클래스 추가).

---

## 8. 접근성 & 모바일 — 시리즈 공유 + 멀티페이지 확장

| 항목 | 방향 |
|---|---|
| 키보드 탐색 | 모든 인터랙티브 요소 tab 가능. 데모 버튼 Enter/Space. 검색 Ctrl+K. |
| 스크린 리더 | 일러스트 `alt`. side-note `role="complementary"`. 진행률 `aria-valuenow`. 페이저 `rel="prev/next"`. 브레드크럼 `nav aria-label`. |
| 색 대비 | WCAG AA(본문 4.5:1+). `--tauri-rust-dark` on soft = 5.6:1 검증. |
| 모션 민감도 | `prefers-reduced-motion: reduce`에서 reveal/stepper/simulator 모션 축소·정지. 정보는 정적 전달. |
| 모바일 | 1단 레이아웃. 햄버거 메뉴. 사이드바 TOC 상단 접기. 코드 블록 가로 스크롤. |
| 한국어 줄바꿈 | `word-break: keep-all`. |
| 코드 접근성 | 코드 블록에 `role="img"` + `aria-label`(의미 요약) 권장; 긴 코드는 `aria-hidden` 후 인접 텍스트로 설명. |

---

## 9. 시리즈 결속 검증 항목 (QA)

- 토큰 변수명·값이 tmux/Git/GitHub와 동일(신규 `--tauri-rust*` 3종만 추가).
- 폰트 Pretendard + JetBrains Mono 양쪽 동일.
- side-note 6종 톤 동일.
- "이 시리즈의 다른 글" 양방향 링크 정상.

---

## HISTORY

- 2026-06-21: 최초 작성. 시리즈 디자인 시스템 상속 + Tauri 액센트(`--tauri-rust`계 3종) 정의. 핫 자산 12종(A~L, 그중 신규 C/D/E/F 4종). 일러스트 4종. 접근성 AA 검증(`--tauri-rust-dark` 5.6:1).

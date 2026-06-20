---
id: SPEC-TAURI-GUIDE-001/content-plan
version: 1.0.0
status: Planned
created: 2026-06-21
updated: 2026-06-21
author: jw
priority: High
---

# Content Plan — Tauri (Rust) 데스크톱 앱 개발 가이드

> 페이지별 카피 방향·삽입 자산·side-note 배치. 청중: "웹은 아는데 Rust/데스크톱은 처음인 개발자".
> 원천: SPEC-GIT-GITHUB-GUIDE-001/content-plan.md 구조. 사례 갤러리 관련 항목은 Tauri에 미적용.

---

## 1. 곁가지(Side-note) 시스템 — 시리즈 공유 6종

시리즈 5종(metaphor/history/tip/warn/extra) + case(사례 콜아웃). Tauri의 case는 "대표 앱" 인라인.

### 전체 배치 원칙
- 매 튜토리얼 상단에 **metaphor 비유 박스** 1개 (핵심 개념의 일상 비유).
- 명령/설치에는 **tip** (자주 틀리는 점), 위험 설정에는 **warn**.
- 역사(탄생 배경)에는 **history**, 깊이는 **extra**.
- "이렇게도 써요" 사례(case)는 T01/T02(대표 앱), T08(모바일)에.

---

## 2. 서사 흐름 (Narrative Arc) — 왜 이 페이지 순서인가

| 파트 | 페이지 | 흐름 |
|---|---|---|
| 파트 1 (T01~T02) | 왜·비교 | **"왜 Tauri인가"** — Electron의 무거움이라는 문제 → Tauri의 답. 비유 + 비교. |
| 파트 2 (T03~T04) | 구조·흐름 | **"어떻게 돌아가나"** — 3계층 아키텍처(식당 비유) → 개발 워크플로우(scaffold→build). |
| 파트 3 (T05~T06) | 도구·문법 | **"뭘로, 무엇을 알아야"** — 도구 생태계(rustup/cargo/CLI/IDE) → Rust 대표 문법 7(얕게). |
| 파트 4 (T07~T08) | IPC·배포 | **"화면과 백엔드가 대화하고, 배포까지"** — invoke/commands → 빌드/인스톨러/모바일. |
| 파트 5 (T09) | 실전 | **"한 번 만들어 보자"** — 미니 프로젝트로 전체 회로 체험. |

> 순서의 논리: 왜(동기) → 어떻게(구조) → 무엇으로(도구/문법) → 대화/배포(실제) → 만들기(통합).
> Git/GitHub 가이드처럼 "비유 먼저 → 점점 기술적" 계단.

---

## 3. 페이지별 카피 방향 (Per-Page Copy Direction)

### HOME — 홈 허브 (tauri/index.html)
- **헤드카피**: "웹으로 만드는, 가볍고 빠른 진짜 데스크톱 앱 — Tauri"
- **3개 문**: (1)처음부터(T01) (2)흐름만(T03) (3)직접 만들기(T09)
- **시리즈 링크**: tmux · Git/GitHub.
- 자산: 없음(정적 허브). 검색 박스.

### T01 — 왜 Tauri인가 (why-tauri.html) — 시그니처
- **비유 박스**: "Electron은 앱마다 브라우저를 한 벌씩 들고 다닌다. Tauri는 운영체제가 깔아둔 창을 빌려 쓴다."
- **history 박스**: 2013 Electron → 2019 Tauri 시작 → 2020 v1 → 2024 v2.
- **본문 섹션**: (1)Electron의 무거움(크기/메모리 수치) (2)Tauri의 발상(네이티브 웹뷰 + Rust) (3)"왜 쓰나" 4가지.
- **case 박스**: "Tauri로 만든 앱" — 1Password, Cody, Pomofocus.
- 자산: 없음(비유 그림 1장). 치트시트 없음(다음 페이지로).

### T02 — Electron과 비교 (electron-comparison.html)
- **비유 박스**: "둘 다 웹으로 만든다. 차이는 '브라우저를 들고 다니느냐, 빌리느냐'."
- **본문**: 10항목 비교 매트릭스(크기·메모리·보안·모바일·성숙도·장벽).
- **tip 박스**: "정답이 아니라 트레이드오프 — 가벼움이 중요하면 Tauri, 자료 풍부함이 중요하면 Electron."
- 자산: **CompareToggle**(C) — Electron/Tauri/둘 다 토글.
- 치트시트: 비교 한 장 요약.

### T03 — 3계층 아키텍처 (architecture.html)
- **비유 박스**: "식당 — 손님(프론트)이 주문서(invoke)를 주방(Rust)에 넘기면 요리(command)해서 내어줌."
- **본문**: (1)프론트엔드(웹) (2)IPC(주문서) (3)Rust 백엔드(주방) (4)운영체제 웹뷰(식당 홀).
- 자산: **ArchitectureDiagram**(D) — 3계층 SVG, 호버 시 설명.
- 치트시트: 각 층 한 줄.

### T04 — 개발 흐름 (dev-workflow.html)
- **비유 박스**: "요리법 — 재료 준비(scaffold) → 시식하며 개발(dev) → 완성품 포장(build)."
- **본문**: scaffold → dev(핫리로드) → frontend/Rust 작성 → build → 인스톨러.
- 자산: **WorkflowStepper**(E) — 순차 하이라이트 + FakeTerminal 명령 재연.
- 치트시트: 명령 5개(`create tauri-app`, `tauri dev`, `tauri build` 등).

### T05 — 도구 생태계 (tooling.html)
- **비유 박스**: "주방 도구 — rustup은 도구 버전 관리자, cargo는 식자재 창고(npm 같은), Tauri CLI는 주방 세트."
- **본문**: rustup · cargo(`Cargo.toml`) · Tauri CLI · rust-analyzer · IDE(RustRover/VS Code) · Vite.
- 자산: FakeTerminal 설치 시퀀스.
- 치트시트: 도구-역할-명령 표.

### T06 — Rust 대표 문법 (rust-basics.html) — 얕게
- **비유 박스**: "Rust는 안전한 주방 규칙. 다 외울 필요 없다 — Taur이 쓰는 7가지만."
- **warn 박스**: "본 가이드는 Rust를 가르치지 않는다. 7가지만 익히고 깊이는 별도 자료로."
- **본문**: 7가지(fn/let-mut/match/struct-enum/Result-Option/& 냄새/#[tauri::command]) 각 한 줄 + 예제.
- 자산: `.code-block--rust` 강조. 치트시트: 7가지 한 장.

### T07 — IPC·명령 (ipc-commands.html)
- **비유 박스**: "주문서(invoke) → 주방 명령(command). 손님이 직접 요리하지 않는다."
- **본문**: 프론트 `invoke('greet', {name})` ↔ Rust `#[tauri::command] fn greet`. 권한(ACL, Tauri 2).
- **tip 박스**: "모든 명령은 명시적으로 권한 허용해야(Tauri 2 최소권한)."
- 자산: **InvokeSimulator**(F) — 입력 → "Rust 흉내" 결과.
- 치트시트: invoke/command 쌍 예시.

### T08 — 빌드와 배포 (build-deploy.html)
- **비유 박스**: "완성품 포장 — 운영체제마다 다른 상자(.msi/.dmg/.deb)."
- **본문**: `tauri.conf.json`(창/아이콘/권한) → `cargo tauri build` → 인스톨러 → (Tauri 2) 모바일.
- **case 박스**: "하나의 코드로 iOS/Android까지 — Electron엔 없는 Tauri 2의 강점."
- 자산: FakeTerminal 빌드 출력.
- 치트시트: 빌드 산출물 표(운영체제별).

### T09 — 실전 미니 프로젝트 (mini-project.html)
- **비유 박스**: "이제 직접 주문 넣어보자 — 가장 작은 앱 하나."
- **본문**: 이름 입력 → Rust `greet` → "안녕, {이름}!" → 화면 갱신. 전체 회로(scaffold→command→invoke→build).
- 자산: **InvokeSimulator**(F) 실전 버전.
- 치트시트: "Tauri 앱 만들기 5단계".

### R01 — 치트시트 (ref/cheatsheet.html)
- 주제별 카드: 도구 / 명령 / Rust 7문법 / IPC / 빌드 산출물.

### R02 — 용어집 (ref/glossary.html)
- Rust/Tauri 용어: 소유권·수명·컴파일러·매크로·바운드·IPC·웹뷰·ACL·cargo·크레이트 등. 비유 1문장 + 정의.

### R03 — FAQ (ref/faq.html)
- "Rust 어렵지 않나요?" / "v1과 v2 차이?" / "Electron 마이그레이션?" / "모바일 진짜 되나요?" 등.

---

## 4. 자산 삽입 지점 요약

| 자산 | 삽입 페이지 | Phase |
|---|---|---|
| CompareToggle (C) | T02 | P2 |
| ArchitectureDiagram (D) | T03 | P3 |
| WorkflowStepper (E) | T04 | P3 |
| FakeTerminal (B, 확장) | T04, T05, T07, T08 | P3/P4/P6 |
| InvokeSimulator (F) | T07, T09 | P6/P7 |
| GlossaryTooltip (I) | 전역 | P1(R02 연동) |
| Reveal (A) | 전역 | P1 |

---

## 5. 톤 가이드라인 (Tone Guidelines)

- **두려운 단어 먼저 풀기**: "소유권", "컴파일러", "매크로" → R02 용어집 + 본문 인라인 비유.
- **수치는 구체적으로**: "100~200MB" vs "3~10MB" (추상적 표현 금지).
- **객관적 비교**: Electron 장점(생태계·자료·JS만)도 인정. 편향 방지.
- **"Rust를 가르치지 않는다" 반복**: T06 본문 + R02에서 재강조. 깊이는 별도 자료로 유도.
- **v2 기준 고정**: 예제·설정 모두 Tauri 2. v1 문법 혼입 금지.

---

## 6. 대표 앱 인용 (case 콜아웃용)

| 앱 | 프레임워크 | 비고 |
|---|---|---|
| VS Code, Slack, Discord | Electron | 비교 대향 |
| 1Password, Cody, Pomofocus, tauri-apps/examples | Tauri | Tauri 사례 |

---

## HISTORY

- 2026-06-21: 최초 작성. 서사 5파트(왜→구조→도구/문법→IPC/배포→실전) 확정. 9 튜토리얼 + 3 참조 페이지별 카피 방향. 자산 삽입 지점 7종. "Rust 얕게 / v2 고정 / 객관 비교" 톤 가이드라인 명시.

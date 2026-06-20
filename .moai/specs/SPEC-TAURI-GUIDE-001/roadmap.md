---
id: SPEC-TAURI-GUIDE-001/roadmap
version: 1.0.0
status: Planned
created: 2026-06-21
updated: 2026-06-21
author: jw
priority: High
---

# Roadmap — Tauri (Rust) 데스크톱 앱 개발 가이드

> SPEC-TAURI-GUIDE-001/spec.md §5 로드맵을 실행 단계로 분해.
> 청중: 본 가이드를 구현하는 개발자. P1~P7 각각 후속 IMPL SPEC(SPEC-TAURI-IMPL-001~007)로 연결.

---

## 0. 전제

- 정적 멀티페이지 사이트, 빌드 단계 없음, `file://` 동작 (시리즈 원칙 상속).
- 시리즈 자산(tmux · Git/GitHub)의 **추출·재포장**: P1 셸은 SPEC-GIT-GITHUB-IMPL-001을 거의 그대로 재사용.
- 톤: 비유 먼저, 따뜻한 크림 토큰, side-note 6종. 주 독자 = "웹은 아는데 Rust/데스크톱은 처음인 개발자".
- 분량: 튜토리얼 약 9페이지 + 홈 + 참조(선택). Git/GitHub(27페이지)보다 가벼운 범위.

---

## 1. Phase 개요

| Phase | 제목 | 페이지 | Priority | IMPL SPEC |
|---|---|---|---|---|
| P1 | 공유 셸 + 디자인 + 내비 | (셸 전역) | High · 선행 | IMPL-001 |
| P2 | 왜 Tauri인가 + Electron 비교 | T01, T02 | High · 시그니처 | IMPL-002 |
| P3 | 개발 흐름 (아키텍처·워크플로우) | T03, T04 | High | IMPL-003 |
| P4 | 도구 생태계 (rustup·cargo·CLI·IDE) | T05 | Medium | IMPL-004 |
| P5 | Rust 대표 문법 (얕게) | T06 | Medium | IMPL-005 |
| P6 | 프론트엔드·IPC·빌드/배포 | T07, T08 | High | IMPL-006 |
| P7 | 실전 미니 프로젝트 + QA | T09 + 체크리스트 | High · 마무리 | IMPL-007 |

> 총 페이지: 홈 1 + 튜토리얼 9 + 참조(치트시트/용어집/FAQ, 선택) = 10~13.
> 각 IMPL SPEC은 본 roadmap의 대응 Phase를 EARS 수용 기준으로 정식화한다.

---

## 2. Phase별 상세

### P1 — 공유 셸 + 디자인 시스템 + 내비 (Priority: High, 선행)

- CSS 5분할(`tokens` → `base` → `layout` → `components` → `pages`), JS 3종(`nav` · `progress` · `reveal`).
- GlobalHeader(학습트랙/참조/시리즈 드롭다운), GlobalFooter, Breadcrumb(자동), ReadingProgress, PrevNextPager, SidebarTOC.
- **시리즈 재사용**: SPEC-GIT-GITHUB-IMPL-001 산출물을 추출·재포장. 신규 작성 최소화.
- Tauri 액센트 토큰 1종 추가: `--tauri-rust #CE412B` (design-guide.md §2.2).
- 산출: `tauri/css/*`, `tauri/js/{nav,progress,reveal}.js`, 글로벌 헤더/푸터 마크업 패턴.

### P2 — 왜 Tauri인가 + Electron 비교 (Priority: High, 시그니처)

- **T01 why-tauri.html**: 탄생 배경(Electron의 무거움 → Tauri 2019), "왜 쓰나" 4가지. 비유 페이지("브라우저 한 벌 vs 창 빌려쓰기").
- **T02 electron-comparison.html**: 10항목 비교 매트릭스(크기·메모리·보안·모바일·성숙도·장벽) — 인터랙티브 토글(Git 가이드 ComparisonTable + 토글 자산 패턴 재사용). 양측 장단 객관화.
- 시리즈 시그니처(비유 + "왜")가 가장 진하게 드러나는 Phase.

### P3 — 개발 흐름 (Priority: High)

- **T03 architecture.html**: 3계층(프론트엔드 ↔ IPC ↔ Rust 백엔드) + 식당 비유(손님/주문서/주방). 아키텍처 다이어그램.
- **T04 dev-workflow.html**: `scaffold → dev(핫리로드) → 작성 → build → 인스톨러` 흐름도(Git PRFlowDiagram 자산 패턴 재사용).
- P6 자산(ArchitectureDiagram · WorkflowStepper)은 본 Phase에서 자산 JS로 구현됨(IMPL-003 범위).

### P4 — 도구 생태계 (Priority: Medium)

- **T05 tooling.html**: rustup · cargo · Tauri CLI · rust-analyzer · RustRover/VS Code · Vite 카탈로그. 각 "한 줄 + 설치 명령 + 언제 쓰나".
- 도구 카드 그리드(Git 가이드 CheatSheetCard 패턴 재사용).
- 설치 명령 단계(`rustup` → `npm create tauri-app` → `cargo tauri dev`)를 FakeTerminal 자산으로 재연.

### P5 — Rust 대표 문법 (Priority: Medium, 얕게)

- **T06 rust-basics.html**: 7가지(`fn` · `let/mut` · `match` · `struct/enum` · `Result/Option` · `&` 냄새 · `#[tauri::command]`). 각 한 줄 + 예제 한 조각.
- **원칙**: Rust 언어 심층(소유권·수명·트레이트)은 범위 밖. 치트시트 1장으로 정리.
- 코드 블록은 `--tauri-rust` 액센트로 강조(다른 가이드의 터미널 블록과 구분).

### P6 — 프론트엔드·IPC·빌드/배포 (Priority: High)

- **T07 ipc-commands.html**: 프론트 `invoke('greet')` ↔ Rust `#[tauri::command]`. 식당 주문서 비유. 권한(ACL, Tauri 2).
- **T08 build-deploy.html**: `tauri.conf.json` 설정, `cargo tauri build` → 인스톨러(`.msi`/`.dmg`/`.deb`/`.AppImage`), (Tauri 2) 모바일 타겟.
- IPC 데모 자산(InvokeSimulator: 버튼 → Rust 명령 → 결과) — Git FakeTerminal 패턴 변형.

### P7 — 실전 미니 프로젝트 + QA (Priority: High, 마무리)

- **T09 mini-project.html**: 이름 입력 → Rust `greet` → "안녕, {이름}!" 반환 → 화면 갱신. 인터랙티브 데모.
- **QA 체크리스트**: 빌드 산출물 크기 비교(Electron vs Tauri), 메모리, 권한 최소화, 링크 무결성.
- SPEC-GIT-GITHUB-IMPL-007(qa-report) 패턴 재사용 — 듀얼 용도(최종 게이트 + per-Phase 사후검증).

---

## 3. 시리즈 자산 재사용 요약 (Cross-Reuse)

| 자산 | 원천 | Tauri 활용 |
|---|---|---|
| CSS 5분할 + JS 3종 | IMPL-GIT-GITHUB-001 | P1 그대로 재사용(토큰 1종 추가) |
| GlobalHeader/Footer/Breadcrumb/Pager/TOC/Progress | IMPL-GIT-GITHUB-001 | P1 재사용 |
| Side-note 6종(metaphor/history/tip/warn/extra/case) | IMPL-GIT-GITHUB-001 | 전 Phase 재사용 |
| ComparisonTable + 토글 | IMPL-GIT-GITHUB-006(actions-pipeline 패턴) | P2 비교 매트릭스 |
| PRFlowDiagram(순차 하이라이트) | IMPL-GIT-GITHUB-006 | P3 워크플로우 스텝퍼 |
| FakeTerminal | IMPL-GIT-GITHUB-001 | P4 설치·P6 IPC 데모 |
| CheatSheetCard | IMPL-GIT-GITHUB-001 | P4 도구·P5 문법·P7 요약 |
| GlossaryTooltip | IMPL-GIT-GITHUB-006 | 전역(Rust 용어: 소유권·컴파일러·매크로 등) |
| QA 링크 무결성 스크립트 | IMPL-GIT-GITHUB-007 | P7 재사용 |

> "추출·재포장" 원칙: 원본 파일 수정 없이, 패턴을 베껴 Tauri 전용으로 재구성.

---

## 4. 위험 및 완화 (Risks)

| 리스크 | 영향 | 완화 |
|---|---|---|
| Rust 진입장벽 → "어렵다" 인식 | 이탈 | P5 얕게 7가지만, 식당 비유로 친숙화. "Rust를 가르치지 않는다" 명시 |
| Electron 대비 자료/사례 부족 | 예제 한정 | 공식 문서 인용, 비교 매트릭스로 객관성 유지 |
| Tauri 버전(v1 vs v2 API 차이) | 예제 구식화 | **v2(2024~) 기준 통일**, 각 IMPL SPEC에 버전 명시 |
| OS 웹뷰 차이(특히 Linux WebKitGTK) | 혼란 | P2/P7에서 "웹뷰 의존성 = 트레이드오프" 명시 |
| 프로젝트명(cli-guide) 불일치 | 시리즈 일관성 | 랜딩 "터미널 친구들" → "개발자 친구들" 확장(별도 논의, 본 roadmap 범위 외) |

---

## 5. Phase 의존 그래프

```
P1 (셸) ──────────────────────────────── 모든 Phase의 기반
  │
  ├── P2 (왜/비교) ──────────────────── 시그니처, P3~P7이 인용
  │      │
  │      └── (P3 아키텍처가 P2 비교를 뒷받침)
  │
  ├── P3 (흐름) ─────────────────────── P4/P6이 흐름 단계를 상세화
  │
  ├── P4 (도구) ──────────┐
  │                       ├── P6 (IPC/빌드) — 도구·문법 모두 사용
  ├── P5 (Rust 문법) ─────┘
  │
  └── P7 (미니프로젝트/QA) ─────────── P2~P6 통합 검증 (터미널 Phase)
```

- P1은 모든 Phase의 선행(셸 없이 페이지 못 만듦).
- P7은 P2~P6 전부 완료 후 실행(터미널 Phase).
- P4·P5는 P6에 입력 제공하지만, SPEC 작성은 병렬 가능.

---

## 6. 추후 구현 Phase 시작 전 확인 사항

- [ ] 본 roadmap + design-guide + content-plan + ia-sitemap 승인.
- [ ] Tauri **v2** 기준 확정 (v1 예제 혼입 금지).
- [ ] 시리즈 토큰(`tokens.css`) Tauri 액센트 추가분(`--tauri-rust`) 합의.
- [ ] 랜딩("터미널 친구들") 확장 여부 결정(별도).
- [ ] 각 IMPL SPEC이 본 roadmap의 대응 Phase를 1:1로 커버하는지 교차 검증.

---

## HISTORY

- 2026-06-21: 최초 작성. SPEC-TAURI-GUIDE-001/spec.md §5 로드맵을 P1~P7로 분해. 시리즈 자산 재사용 맵, 의존 그래프, 리스크 정리. 각 Phase → IMPL-001~007 매핑 확정.

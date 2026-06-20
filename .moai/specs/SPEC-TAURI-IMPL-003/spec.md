---
id: SPEC-TAURI-IMPL-003
version: 1.1.0
status: Implemented
created: 2026-06-21
updated: 2026-06-21
author: jw
priority: High
lifecycle: spec-anchored
related:
  - SPEC-TAURI-GUIDE-001
  - SPEC-TAURI-IMPL-001
  - SPEC-GIT-GITHUB-IMPL-006
---

# SPEC — P3: 개발 흐름 — 아키텍처·워크플로우

> roadmap P3 정식화. Tauri 앱이 구조적으로 어떻게 돌아가는지, 개발이 어떤 순서로 진행되는지.
> 청중: 구현 개발자. WHAT/WHY 집중.

---

## 1. 목표 (Goal)

Tauri의 **3계층 구조**(프론트엔드 ↔ IPC ↔ Rust 백엔드)와 **개발 워크플로우**(scaffold→dev→build)를
2페이지 + 2자산으로 납품. 식당 비유(손님/주문서/주방)로 추상 구조를 친숙하게.

---

## 3. 산출물 (Deliverables)

### 3.1 `tutorial/architecture.html` (T03)
- 비유 박스(식당: 손님=프론트, 주문서=invoke, 주방=Rust, 홀=웹뷰).
- 본문: 프론트엔드(웹) / IPC / Rust 백엔드 / 운영체제 웹뷰 4층 설명.
- 자산: **ArchitectureDiagram**(design-guide D) — 3계층 SVG, 호버/포커스 시 각 층 설명.

### 3.2 `tutorial/dev-workflow.html` (T04)
- 비유 박스(요리법: 재료 준비→시식→포장).
- 본문: `scaffold → dev(핫리로드) → frontend/Rust 작성 → build → 인스톨러`.
- 자산: **WorkflowStepper**(design-guide E) — 순차 하이라이트 + FakeTerminal 명령 재연(`npm create tauri-app` → `cargo tauri dev` → `cargo tauri build`).

### 3.3 자산 JS
- `js/workflow-stepper.js` — Git PRFlowDiagram 패턴(순차 하이라이트 + 단계 설명) 추출·재포장.
- ArchitectureDiagram은 인라인 SVG + `js/nav.js` 패턴의 hover/focus 처리(별도 JS 또는 인라인).

### 3.4 자산 CSS
- `components.css`에 ArchitectureDiagram/WorkflowStepper 클래스 추가.

---

## 4. 수용 기준 (EARS)

- **REQ-001 (3계층 구조 전달)**: UBIQUITOUS — T03이 프론트엔드·IPC·Rust 백엔드(+(웹뷰)) 3~4층을 명확히 구분해 설명 SHALL.
- **REQ-002 (식당 비유 정합)**: UBIQUITOUS — T03의 식당 비유(손님/주문서/주방)가 IPC 흐름과 정합 SHALL.
- **REQ-003 (ArchitectureDiagram 호버)**: WHEN 사용자가 ArchitectureDiagram의 각 층에 hover/focus하면, THEN 해당 층의 설명이 팝업/강조로 표시 SHALL.
- **REQ-004 (WorkflowStepper 순차)**: WHEN WorkflowStepper가 실행되면, THEN scaffold→dev→작성→build→인스톨러 단계가 순차 하이라이트되는 흐름이 표현 SHALL.
- **REQ-005 (명령 정확)**: UBIQUITOUS — WorkflowStepper/FakeTerminal이 `npm create tauri-app@latest`, `cargo tauri dev`, `cargo tauri build` (Tauri v2) 명령을 정확히 표시 SHALL.
- **REQ-006 (P1 셸 상속)**: UBIQUITOUS — 두 페이지가 IMPL-001 셸(5 CSS + 3 JS)을 상속 SHALL.
- **REQ-007 (reduced-motion)**: WHILE reduced-motion이면, THEN 두 자산 모션이 축소/즉시 전환되며 정보는 정적 전달 SHALL.
- **REQ-008 (키보드·WCAG AA)**: UBIQUITOUS — 두 자산의 인터랙티브 요소가 키보드 조작 가능하고 ARIA·대비 충족 SHALL.
- **REQ-009 (빌드 없음)**: UBIQUITOUS — 본 산출물이 빌드 없이 `file://`에서 동작 SHALL.

---

## 5. 범위 외
- 도구 상세(rustup/cargo) → P4. Rust 문법 → P5. IPC 명령 작성법 → P6.

---

## 6. 의존성
- **IMPL-001(P1 셸)**, **IMPL-002(P2 비교 — 흐름이 비교를 뒷받침)**.
- **SPEC-GIT-GITHUB-IMPL-006** — PRFlowDiagram/FakeTerminal 패턴 원천(추출·재포장).

---

## HISTORY

- 2026-06-21: 최초 작성. roadmap P3 정식화. T03/T04 + ArchitectureDiagram/WorkflowStepper 자산. 9 EARS. v2 명령 고정.

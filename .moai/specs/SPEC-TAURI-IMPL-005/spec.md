---
id: SPEC-TAURI-IMPL-005
version: 1.1.0
status: Implemented
created: 2026-06-21
updated: 2026-06-21
author: jw
priority: Medium
lifecycle: spec-anchored
related:
  - SPEC-TAURI-GUIDE-001
  - SPEC-TAURI-IMPL-001
---

# SPEC — P5: Rust 대표 문법 (얕게)

> roadmap P5 정식화. Rust 언어 심층 학습이 아닌, **Tauri 예제를 읽을 수 있는 최소 7가지 문법**만.
> 청중: 구현 개발자. "얕게" 원칙이 본 SPEC의 핵심 제약.

---

## 1. 목표 (Goal)

Tauri에서 마주칠 Rust **대표 문법 7가지**를 한 페이지에 얕게 납품. Rust를 가르치지 않는다 —
"이 7개만 알면 Tauri 예제가 읽힌다"가 목표.

---

## 3. 산출물 (Deliverables)

### 3.1 `tutorial/rust-basics.html` (T06)
- 비유 박스("Rust는 안전한 주방 규칙. 다 외울 필요 없다 — Tauri가 쓰는 7가지만").
- warn 박스("본 가이드는 Rust를 가르치지 않는다. 깊이는 별도 자료로").
- 본문: 7가지 각 "한 줄 설명 + 예제 한 조각":
  1. `fn` — 함수
  2. `let` / `let mut` — 변수(기본 불변)
  3. `match` — 패턴 매칭
  4. `struct` / `enum` — 데이터/경우의 수
  5. `Result` / `Option` — 실패/없음을 타입으로
  6. `&` 와 소유권 냄새 — "빌려 쓴다" 개념만 (깊이 X)
  7. `#[tauri::command]` — Tauri 명령 매크로
- 치트시트: 7가지 한 장 요약.

### 3.2 코드 블록 스타일
- `.code-block--rust` (design-guide §7) — `--tauri-rust-dark` on `--tauri-rust-soft` (5.6:1).

---

## 4. 수용 기준 (EARS)

- **REQ-001 (7문법 커버)**: UBIQUITOUS — T06이 fn·let/mut·match·struct/enum·Result/Option·&·#[tauri::command] 7가지를 모두 다루 SHALL.
- **REQ-002 (얕게 원칙)**: UBIQUITOUS — 각 문법이 "한 줄 + 예제 한 조각" 수준이고, 소유권·수명·트레이트 심화는 범위 밖으로 명시 SHALL.
- **REQ-003 (Tauri 연결)**: UBIQUITOUS — 7번째 `#[tauri::command]`가 Tauri IPC(P6)로 연결됨을 보여 SHALL.
- **REQ-004 (Rust 코드 강조)**: UBIQUITOUS — Rust 코드 블록이 `.code-block--rust`(`--tauri-rust*`)로 시각 구분 SHALL.
- **REQ-005 (P1 셸 상속)**: UBIQUITOUS — 페이지가 IMPL-001 셸을 상속 SHALL.
- **REQ-006 (WCAG AA)**: UBIQUITOUS — 코드 블록 색 대비 AA 충족(`--tauri-rust-dark` 5.6:1 검증) SHALL.
- **REQ-007 (빌드 없음)**: UBIQUITOUS — 빌드 없이 `file://` 동작 SHALL.

---

## 5. 범위 외 (명시적)
- 소유권(ownership)·수명(lifetime)·트레이트(trait)·에러 처리 심화 → **별도 Rust 입문 자료**.
- 비동기(async/await) 심화 → T07(IPC)에서 필요 최소만.

---

## 6. 의존성
- **IMPL-001(P1 셸)**, design-guide §7(`.code-block--rust`).

---

## HISTORY

- 2026-06-21: 최초 작성. roadmap P5 정식화. T06 + Rust 7문법. 7 EARS. "얕게" 원칙을 REQ-002로 강제.

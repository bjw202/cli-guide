---
id: SPEC-TAURI-IMPL-006
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
  - SPEC-TAURI-IMPL-005
---

# SPEC — P6: 프론트엔드·IPC·빌드/배포

> roadmap P6 정식화. 화면(프론트)과 Rust 백엔드가 어떻게 대화하고(IPC), 어떻게 포장·배포되는지.
> 청중: 구현 개발자.

---

## 1. 목표 (Goal)

Tauri의 **IPC(invoke ↔ command)** 와 **빌드/배포**를 2페이지 + 1자산으로 납품:
- T07: 프론트 `invoke` ↔ Rust `#[tauri::command]` + 권한(ACL).
- T08: `tauri.conf.json` → `cargo tauri build` → 인스톨러 → (Tauri 2) 모바일.

---

## 3. 산출물 (Deliverables)

### 3.1 `tutorial/ipc-commands.html` (T07)
- 비유 박스("주문서(invoke) → 주방 명령(command). 손님이 직접 요리하지 않는다").
- 본문: 프론트 `await invoke('greet', { name })` ↔ Rust `#[tauri::command] fn greet(name: String) -> String`.
- tip 박스("Tauri 2 최소권한 — 모든 명령은 명시적 권한 허용 필요(ACL)").
- 자산: **InvokeSimulator**(design-guide F) — 입력 → JS "Rust 흉내" 결과 반환.

### 3.2 `tutorial/build-deploy.html` (T08)
- 비유 박스("완성품 포장 — 운영체제마다 다른 상자(.msi/.dmg/.deb/.AppImage)").
- 본문: `tauri.conf.json`(창/아이콘/번들id/권한) → `cargo tauri build` → 운영체제별 인스톨러 → (Tauri 2) `ios`/`android` 타겟.
- case 박스("하나의 코드로 iOS/Android까지 — Electron엔 없는 Tauri 2 강점").
- 치트시트: 빌드 산출물 표(운영체제별).

### 3.3 자산 JS
- `js/ipc-simulator.js` — FakeTerminal 패턴 변형. 입력 → 명령 → 결과 모의.
- reduced-motion: 즉시 결과 표시. 키보드 조작.

### 3.4 자산 CSS
- `components.css`에 InvokeSimulator 클래스 추가.

---

## 4. 수용 기준 (EARS)

- **REQ-001 (invoke/command 쌍)**: UBIQUITOUS — T07이 프론트 `invoke('greet', {name})`와 Rust `#[tauri::command] fn greet`의 대응을 정확히 보여 SHALL.
- **REQ-002 (ACL 언급)**: UBIQUITOUS — T07이 Tauri 2의 권한(ACL) 최소권한 원칙을 언급 SHALL.
- **REQ-003 (InvokeSimulator 동작)**: WHEN 사용자가 InvokeSimulator에 값을 넣고 실행하면, THEN "Rust 명령 흉내" 결과가 화면에 반환되어 IPC 흐름이 체감되 SHALL.
- **REQ-004 (빌드 산출물)**: UBIQUITOUS — T08이 운영체제별 인스톨러(`.msi`/`.dmg`/`.deb`/`.AppImage`)와 빌드 명령(`cargo tauri build`)을 정확히 나열 SHALL.
- **REQ-005 (모바일)**: UBIQUITOUS — T08이 Tauri 2의 iOS/Android 타겟 가능을 언급하고 Electron과의 차별점으로 제시 SHALL.
- **REQ-006 (P1 셸 상속)**: UBIQUITOUS — 두 페이지가 IMPL-001 셸을 상속 SHALL.
- **REQ-007 (reduced-motion·키보드·AA)**: UBIQUITOUS — InvokeSimulator가 reduced-motion·키보드·WCAG AA를 충족 SHALL.
- **REQ-008 (빌드 없음)**: UBIQUITOUS — 본 산출물이 빌드 없이 `file://`에서 동작 SHALL.

---

## 5. 범위 외
- CI/CD(GitHub Actions로 Tauri 빌드) → 심화, 별도. 모바일 스토어 심사 절차 → "가능하다"까지만.

---

## 6. 의존성
- **IMPL-001(P1 셸 + FakeTerminal)**, **IMPL-005(P5 `#[tauri::command]` 문법)**.

---

## HISTORY

- 2026-06-21: 최초 작성. roadmap P6 정식화. T07/T08 + InvokeSimulator 자산. 8 EARS. v2 ACL·모바일 강조.

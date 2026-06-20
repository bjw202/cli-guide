---
id: SPEC-TAURI-IMPL-004
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

# SPEC — P4: 도구 생태계 (rustup · cargo · Tauri CLI · IDE)

> roadmap P4 정식화. Tauri 개발에 필요한 도구 카탈로그 1페이지.
> 청중: 구현 개발자.

---

## 1. 목표 (Goal)

Tauri 개발에 쓰이는 **6가지 핵심 도구**를 한 페이지에 정리: rustup·cargo·Tauri CLI·rust-analyzer·IDE(RustRover/VS Code)·Vite.
각 "역할 + 설치 명령 + 언제 쓰나"를 간결히 납품.

---

## 3. 산출물 (Deliverables)

### 3.1 `tutorial/tooling.html` (T05)
- 비유 박스("주방 도구 — rustup은 도구 버전 관리자, cargo는 식자재 창고, Tauri CLI는 주방 세트").
- 도구 카드 그리드(CheatSheetCard 패턴) 6종.
- FakeTerminal 자산(IMPL-001 상속)으로 설치 시퀀스 재연: `curl ... rustup` → `npm create tauri-app` → `cargo tauri dev`.
- 치트시트: 도구-역할-명령 표.

### 3.2 도구 데이터 (카드용)
| 도구 | 역할 | 비유 | 설치/명령 |
|---|---|---|---|
| rustup | Rust 툴체인 관리자 | Rust의 nvm | `curl ... sh.rustup.rs \| sh` |
| cargo | 빌드·패키지 매니저 | Rust의 npm (`Cargo.toml`) | rustup에 포함 |
| Tauri CLI | 앱 스캐폴드/dev/build | 주방 세트 | `npm i -g @tauri-apps/cli` |
| rust-analyzer | LSP(자동완성/타입) | IDE의 두뇌 | IDE 확장 |
| RustRover/VS Code | IDE | 정석/무료충분 | — |
| Vite | 프론트엔드 번들러 | Tauri 공식 권장 | `npm create tauri-app` 시 포함 |

---

## 4. 수용 기준 (EARS)

- **REQ-001 (6도구 커버)**: UBIQUITOUS — T05가 rustup·cargo·Tauri CLI·rust-analyzer·IDE·Vite 6종을 모두 다루 SHALL.
- **REQ-002 (설치 명령 정확)**: UBIQUITOUS — 각 도구의 설치/실행 명령이 Tauri v2 환경에서 정확 SHALL (`npm i -g @tauri-apps/cli` 등).
- **REQ-003 (비유 일관)**: UBIQUITOUS — 도구 비유가 식당/주방 시리즈 비유와 일관 SHALL.
- **REQ-004 (FakeTerminal 재연)**: UBIQUITOUS — 설치 시퀀스가 FakeTerminal 자산으로 재연 가능 SHALL.
- **REQ-005 (P1 셸 상속)**: UBIQUITOUS — 페이지가 IMPL-001 셸(5 CSS + 3 JS)을 상속 SHALL.
- **REQ-006 (빌드 없음)**: UBIQUITOUS — 빌드 없이 `file://` 동작 SHALL.

---

## 5. 범위 외
- 각 도구의 심화 사용법(cargo workspace·rustup target 추가 등) → 별도 자료. 본 가이드는 카탈로그 수준.

---

## 6. 의존성
- **IMPL-001(P1 셸 + FakeTerminal)**.

---

## HISTORY

- 2026-06-21: 최초 작성. roadmap P4 정식화. T05 + 도구 카드 6종. 6 EARS. v2 명령.

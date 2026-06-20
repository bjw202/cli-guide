---
id: SPEC-TAURI-IMPL-002
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
---

# SPEC — P2: 왜 Tauri인가 + Electron 비교 (시그니처)

> roadmap P2 정식화. 본 시리즈의 시그니처(비유 + "왜")가 가장 진하게 드러나는 Phase.
> 청중: 본 사이트를 구현하는 개발자. WHAT/WHY 집중, HOW(SVG 좌표)는 run 단계 연기.

---

## 1. 목표 (Goal)

Tauri가 **왜 태어났고 왜 쓰는지**를 2페이지로 납품한다:
- T01: 탄생 배경(Electron의 무거움 → Tauri) + "왜 쓰나" 4가지.
- T02: Electron과의 10항목 객관 비교 + 인터랙티브 토글 자산.

---

## 2. 산출물 (Deliverables)

### 3.1 `tutorial/why-tauri.html` (T01)
- 비유 박스("브라우저 한 벌 vs 창 빌려쓰기") + history 박스(2013→2024).
- 본문: (1)Electron의 무거움(크기 100~200MB, 메모리 100~300MB 수치) (2)Tauri 발상(네이티브 웹뷰 + Rust) (3)"왜 쓰나" 4가지(가볍다/안전/크로스플랫폼+모바일/웹 그대로).
- case 콜아웃: Tauri 대표 앱(1Password, Cody, Pomofocus).

### 3.2 `tutorial/electron-comparison.html` (T02)
- 10항목 비교 매트릭스(ComparisonTable): 백엔드·웹뷰·크기·메모리·보안·프론트·모바일·성숙도·대표앱·진입장벽.
- tip 박스: "정답이 아니라 트레이드오프". 양측 장단 객관 명시.
- 치트시트: 비교 한 장 요약.

### 3.3 `js/tauri-compare.js` + CompareToggle 자산 (design-guide C)
- "Electron 보기 / Tauri 보기 / 둘 다" 토글. 항목 클릭 시 해당 열 하이라이트.
- reduced-motion: 하이라이트 즉시 전환. 키보드 조작.

### 3.4 자산 CSS
- `components.css`에 CompareToggle 클래스 추가.

---

## 4. 수용 기준 (EARS)

- **REQ-001 (탄생 배경 정확)**: UBIQUITOUS — T01이 Electron(2013, GitHub)과 Tauri(2019, Thompson-Yvetot)의 탄생 연도·주체를 정확히 서술 SHALL.
- **REQ-002 (수치 구체)**: UBIQUITOUS — T01/T02가 Electron(~100~200MB, ~100~300MB) vs Tauri(~3~10MB, ~30~80MB) 크기·메모리 수치를 구체적으로 제시 SHALL (추상 표현 금지).
- **REQ-003 (비교 10항목)**: UBIQUITOUS — T02 비교 매트릭스가 백엔드·웹뷰·크기·메모리·보안·프론트·모바일·성숙도·대표앱·진입장벽 10항목을 모두 다루 SHALL.
- **REQ-004 (객관성)**: UBIQUITOUS — T02가 Electron의 장점(생태계·자료 풍부·JS만으로 충분)도 인정하여 편향되지 SHALL NOT.
- **REQ-005 (CompareToggle 동작)**: WHEN 사용자가 CompareToggle에서 보기 모드를 바꾸면, THEN 비교 매트릭스의 해당 열이 하이라이트되어 시각적으로 구분 SHALL.
- **REQ-006 (P1 셸 상속)**: UBIQUITOUS — 두 페이지가 IMPL-001의 5 CSS + 3 JS를 동일 순서로 link/load SHALL.
- **REQ-007 (reduced-motion)**: WHILE reduced-motion이면, THEN CompareToggle 하이라이트가 즉시 전환(모션 생략)되며 정보는 정적으로 전달 SHALL.
- **REQ-008 (WCAG AA + 키보드)**: UBIQUITOUS — CompareToggle 토글이 키보드로 조작 가능하고 색 대비 AA 충족 SHALL.
- **REQ-009 (빌드 없음)**: UBIQUITOUS — 본 페이지·자산이 빌드 없이 `file://`에서 동작 SHALL.

---

## 5. 범위 외
- 아키텍처 3계층 → P3(IMPL-003). 도구 → P4. Rust 문법 → P5.

---

## 6. 의존성
- **IMPL-001(P1 셸)** — CompareToggle이 동작할 토대.
- **GUIDE-001/design-guide** — CompareToggle 자산 정의(C), 일러스트 1종.

---

## HISTORY

- 2026-06-21: 최초 작성. roadmap P2 정식화. T01/T02 + CompareToggle 자산. 9 EARS. v2 기준, 객관 비교 강제.

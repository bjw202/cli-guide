---
id: SPEC-TAURI-IMPL-007
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
  - SPEC-TAURI-IMPL-002
  - SPEC-TAURI-IMPL-003
  - SPEC-TAURI-IMPL-004
  - SPEC-TAURI-IMPL-005
  - SPEC-TAURI-IMPL-006
  - SPEC-GIT-GITHUB-IMPL-007
---

# SPEC — P7: 실전 미니 프로젝트 + 최종 QA (터미널 Phase)

> roadmap P7 정식화. P2~P6를 통합하는 실전 미니앱 1페이지 + 사이트 전체 최종 QA 체크리스트.
> 듀얼 용도(최종 게이트 + per-Phase 사후검증)는 SPEC-GIT-GITHUB-IMPL-007 패턴 상속.
> 청중: 구현·검증 개발자.

---

## 1. 목표 (Goal)

이름 입력 → Rust `greet` → "안녕, {이름}!" 반환 → 화면 갱신의 **미니 Tauri 앱 흐름**을 한 페이지로 체험케 하고,
사이트 전체(홈 1 + 튜토리얼 9 + 참조 3)의 **최종 품질 게이트**를 통과시킨다.

---

## 3. 산출물 (Deliverables)

### 3.1 `tutorial/mini-project.html` (T09)
- 비유 박스("이제 직접 주문 넣어보자 — 가장 작은 앱 하나").
- 본문: scaffold → Rust `greet` command 작성 → 프론트 `invoke` 호출 → 결과 표시 → build의 전체 회로.
- 자산: **InvokeSimulator**(IMPL-006) 실전 버전 — 이름 입력 → "안녕, {이름}!".
- 치트시트: "Tauri 앱 만들기 5단계".

### 3.2 최종 QA 체크리스트 (문서 산물, 새 코드 X)
SPEC-GIT-GITHUB-IMPL-007 검증 프레임워크(7 범주) 추출·재포장:
- 접근성(WCAG AA·스크린 리더·키보드) · 크로스 브라우저 · 성능 · 링크/앵커 무결성 · 모바일 반응형 · 시리즈 결속 · 기능(자산 동작).

### 3.3 링크 무결성 스크립트 (재사용)
- SPEC-GIT-GITHUB-IMPL-007의 Python 크롤러 재사용 — `tauri/` 하위 페이지 순회, 0 broken 목표.

---

## 4. 수용 기준 (EARS)

- **REQ-001 (미니앱 회로)**: UBIQUITOUS — T09가 scaffold→command→invoke→build 전체 회로를 다루 SHALL.
- **REQ-002 (InvokeSimulator 실전)**: WHEN 사용자가 이름을 넣고 실행하면, THEN "안녕, {이름}!" 결과가 반환되어 IPC 회로가 체감되 SHALL.
- **REQ-003 (링크 무결성)**: UBIQUITOUS — 사이트 전체 내부 링크·앵커가 0 broken SHALL (자동화 스크립트 검증).
- **REQ-004 (WCAG AA)**: UBIQUITOUS — 모든 페이지가 WCAG AA 색 대비·키보드 접근성 충족 SHALL.
- **REQ-005 (모바일 반응형)**: WHILE 뷰포트 320~768px이면, THEN 모든 페이지가 레이아웃 붕괴 없이 렌더링 SHALL.
- **REQ-006 (시리즈 결속)**: UBIQUITOUS — tmux·Git/GitHub와 토큰·폰트·side-note 톤·양방향 링크가 일치 SHALL.
- **REQ-007 (자산 동작)**: UBIQUITOUS — CompareToggle·ArchitectureDiagram·WorkflowStepper·InvokeSimulator·FakeTerminal이 정상 동작 SHALL.
- **REQ-008 (reduced-motion)**: WHILE reduced-motion이면, THEN 모든 모션이 축소/즉시 표시로 전환 SHALL.
- **REQ-009 (빌드 없음)**: UBIQUITOUS — 사이트 전체가 빌드 없이 `file://`에서 동작 SHALL.

---

## 5. 범위 외
- 새 기능 개발(QA 중 발견된 gap) → 해당 Phase IMPL로 역 루팅.
- 크로스 브라우저 실기기·Lighthouse 실측·스크린 리더 실측 → 수동 권장(배포 전).

---

## 6. 의존성
- **IMPL-001~006 전부** — 본 Phase는 터미널 Phase로 선행 산출물이 모두 필요.
- **SPEC-GIT-GITHUB-IMPL-007** — QA 프레임워크·링크 스크립트 원천(추출·재포장).

---

## HISTORY

- 2026-06-21: 최초 작성. roadmap P7 정식화. T09 미니프로젝트 + QA 7범주 체크리스트. 9 EARS. SPEC-GIT-GITHUB-IMPL-007 패턴 상속.

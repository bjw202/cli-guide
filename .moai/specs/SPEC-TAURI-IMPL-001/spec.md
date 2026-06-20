---
id: SPEC-TAURI-IMPL-001
version: 1.1.0
status: Implemented
created: 2026-06-21
updated: 2026-06-21
author: jw
priority: High
lifecycle: spec-anchored
related:
  - SPEC-TAURI-GUIDE-001
  - SPEC-GIT-GITHUB-IMPL-001
  - SPEC-TMUX-GUIDE-001
---

# SPEC — P1: 공유 셸 + 디자인 시스템 + 내비 (Tauri 가이드)

> SPEC-TAURI-GUIDE-001 roadmap P1을 구현 단계로 정식화.
> SPEC-GIT-GITHUB-IMPL-001(P1 셸)을 **추출·재포장** — 시리즈 자산 재사용 원칙.
> 청중: 본 사이트를 구현하는 개발자. 한국어 본문, 식별자·경로·토큰은 영어.

---

## 1. 목표 (Goal)

Tauri 가이드 사이트 전체의 **공유 셸**을 납품한다: CSS 5분할 + JS 3종 + 글로벌 헤더/푸터/브레드크럼/진행률.
이후 Phase(P2~P7)는 본 셸 위에서 본문만 채운다. 시리즈(tmux·Git/GitHub)와 시각·동작이 일치해야 한다.

---

## 2. 배경 (Background)

시리즈 "터미널 친구들"의 세 번째 멤버. P1은 일관성의 뼈대. SPEC-GIT-GITHUB-IMPL-001가 이미 검증한
CSS 5분할(tokens→base→layout→components→pages) + JS 3종(nav/progress/reveal) 구조를 그대로 가져오되,
Tauri 전용 액센트 토큰(`--tauri-rust`계)을 추가한다(design-guide §2.2).

---

## 3. 산출물 (Deliverables)

### 3.1 `tauri/css/` — 5분할 (시리즈 상속 + Tauri 액센트)
- `tokens.css` — 시리즈 토큰 + `--tauri-rust #CE412B` / `--tauri-rust-soft #F8E4DF` / `--tauri-rust-dark #A8341F`.
- `base.css` · `layout.css` · `components.css` · `pages.css` — Git/GitHub 대응 파일에서 추출·재포장.

### 3.2 `tauri/js/` — 기본 3종
- `nav.js` — 글로벌 헤더(학습트랙/참조 드롭다운, 햄버거 드로어), 브레드크럼 자동 생성(`tutorial`/`ref` 라벨).
- `progress.js` — 읽기 진행률 바 + (선택)트랙 진행률(localStorage).
- `reveal.js` — 스크롤 리빌(`prefers-reduced-motion` 즉시 표시).

### 3.3 글로벌 헤더/푸터 마크업 패턴
- 로고 "Tauri 가이드", 학습트랙/참조 드롭다운, 검색 버튼, 시리즈 링크(tmux·Git/GitHub).
- 글로벌 푸터: 시리즈 링크 + 공식 문서(tauri.app · rust-lang.org).

### 3.4 홈 허브 `tauri/index.html` 뼈대 (본문은 P2~P7이 채움)
3개 문(시작하기/개념잡기/실전만들기) + 시리즈 링크 + 검색.

---

## 4. 수용 기준 (Acceptance Criteria, EARS)

- **REQ-001 (CSS 5분할 순서)**: UBIQUITOUS — 모든 페이지가 `tokens` → `base` → `layout` → `components` → `pages` 순서로 5 CSS를 link SHALL.
- **REQ-002 (JS 3종 로드)**: UBIQUITOUS — 모든 페이지가 `nav` → `progress` → `reveal` 순서로 3 JS를 load SHALL.
- **REQ-003 (시리즈 토큰 일치)**: UBIQUITOUS — `tokens.css`의 시리즈 공유 토큰(변수명·값)이 tmux/Git/GitHub와 일치 SHALL. Tauri 액센트 3종(`--tauri-rust*`)만 신규 허용.
- **REQ-004 (브레드크럼 자동)**: UBIQUITOUS — nav.js가 모든 하위 페이지에서 `홈 › 섹션 › 현재` 브레드크럼을 자동 생성 SHALL.
- **REQ-005 (시리즈 링크)**: UBIQUITOUS — 헤더/푸터에 tmux·Git/GitHub 양방향 시리즈 링크가 존재 SHALL.
- **REQ-006 (빌드 없음)**: UBIQUITOUS — 본 셸은 빌드 단계 없이 `file://`에서 동작 SHALL.
- **REQ-007 (reduced-motion)**: WHILE 운영체제가 `prefers-reduced-motion: reduce`이면, THEN reveal 모션이 즉시 표시로 전환 SHALL.
- **REQ-008 (WCAG AA)**: UBIQUITOUS — 본문·토큰 색 대비가 WCAG AA(4.5:1+)를 충족 SHALL. `--tauri-rust-dark` on soft = 5.6:1 검증 포함.
- **REQ-009 (tmux/Git 원본 무결성)**: UBIQUITOUS — 본 SPEC 산출물은 `tmux/`·`git-github/` 원본을 수정하지 SHALL NOT.

---

## 5. 범위 외 (Out of Scope)

- 튜토리얼 본문(T01~T09) → P2~P7.
- 자산(CompareToggle/ArchitectureDiagram 등) → P2~P7(해당 IMPL SPEC).
- 랜딩("터미널 친구들") 명칭 확장 → 별도 논의.

---

## 6. 의존성 (Dependencies)

- **SPEC-GIT-GITHUB-IMPL-001** — 셸·디자인·tmux 변수명 관습의 원천 (추출·재포장).
- **SPEC-TAURI-GUIDE-001/design-guide.md** — Tauri 액센트 토큰·컴포넌트 인벤토리.

---

## HISTORY

- 2026-06-21: 최초 작성. roadmap P1 정식화. SPEC-GIT-GITHUB-IMPL-001 추출·재포장. Tauri 액센트 3종 추가. 9 EARS 수용기준 확정. Tauri v2 기준.

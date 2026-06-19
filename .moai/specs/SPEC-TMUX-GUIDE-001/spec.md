---
id: SPEC-TMUX-GUIDE-001
version: 1.0.0
status: Planned
created: 2026-06-19
updated: 2026-06-19
author: jw
priority: High
issue_number: "-"
lifecycle: spec-anchored
---

# SPEC-TMUX-GUIDE-001 — 비개발자를 위한 tmux 단일 페이지 학습 가이드 (기획 단계)

## 1. 목표 (Goal)

비개발자(terminal, shell, multiplexer라는 단어를 모르는 사람)가 한 번의 스크롤로
tmux가 무엇인지, 왜 쓰는지, 어떻게 쓰는지, 그리고 실생활에 어떻게 적용되는지
이해할 수 있도록 돕는 **단일 페이지(one-page) 학습 가이드**를 기획한다.

본 SPEC은 **기획 산출물(Planning Deliverable)** 에 한정한다.
코드 구현(HTML/CSS/JS)은 이후 별도 SPEC/Phase에서 다룬다.

> **핵심 오디언스 계약**: 모든 기술 개념은 먼저 일상적 비유로 소개되고, 그 다음에
> 실제 용어가 등장해야 한다. 샘플 카피는 호기심 많은 초보자에게 말하듯 작성된다.

## 2. 배경 (Why)

- tmux는 강력하지만 "개발자 전용"이라는 인식이 강해 진입장벽이 높다.
- 기존 자료는 전부 개발자 독자를 가정하고 작성되어 있다.
- 친근하고 풍부한 비주얼 자산이 동반된, 비개발자용 단일 경로 학습 자료의 부재.

## 3. 오디언스 (Audience)

| 속성 | 설명 |
|---|---|
| 1차 독자 | "터미널"이라는 말을 들어본 적 없거나, 들어봐도 두려워하는 일반인 |
| 2차 독자 | 디자이너, 기획자, PM, 마케터 — 개발자 동료가 tmux를 쓰는 걸 본 사람 |
| 사전 지식 | 없음. 모든 개념은 0에서 시작한다고 가정 |
| 톤 | 따뜻하고 친절한 튜토리얼 (Dribbble/Notion급), 겁주지 않기 |

## 4. 성공 기준 (Success Criteria, EARS-lite)

> 본 기준은 "최종 페이지"가 아니라 **기획 산출물 자체**의 수용 기준이다.

- **UBIQUITOUS**: 기획 산출물은 본 SPEC의 "tmux 주제 커버리지 체크리스트" 항목
  전체를 누락 없이 다루어야 한다(shall cover).
- **WHEN** 비개발자 독자가 sample copy를 읽을 때, **THEN** 모든 기술 용어 앞에
  일상 비유가 먼저 등장해야 한다.
- **WHILE** 산출물을 리뷰하는 동안, **THEN** 어떤 항목도 HTML/CSS/JS 코드를
  포함하지 않아야 한다(no code this phase).
- **IF** 특정 기술 팩트(단축키, 명령어)가 명시된다면, **THEN** tmux 공식 위키와
  일치해야 한다(verified against official wiki).
- **WHEN** 디자인/자산 전략을 검토할 때, **THEN** 각 "핫 에셋"은 비개발자 학습
  가치에 대한 정당성을 포함해야 한다.

## 5. 단일 페이지 제약 (Single-Page Constraints)

- 하나의 긴 스크롤 페이지(one HTML narrative) — 다중 페이지/라우팅 없음.
- 스티키 내비게이션 + 읽기 진행률 바.
- 스크롤 기반 섹션 전개(Concept → Fundamentals → Practice → Applications).
- 모든 인터랙션은 순수 JS/CSS(빌드 단계 없음).
- 정적 호스팅 어디서나 동작(GitHub Pages, 단순 파일 오픈 등).

## 6. 범위 외 (Exclusions / Out of Scope)

> 본 SPEC은 **기획(Planning) ONLY** 이다.

명시적으로 **이번 단계에서 하지 않는 것**:

- HTML, CSS, JS 코드 작성 ❌
- 실제 페이지 구현(implementation) ❌
- 정적 사이트 생성기 설정 ❌
- 배포/호스팅 구성 ❌
- 일러스트레이션 실제 제작(에셋 리스트와 방향만) ❌
- tmux 고급 스크립팅/자동화 깊이 (개념만 소개) ❌

## 7. 기획 산출물 수용 체크리스트 (Acceptance — Planning Deliverable)

- [ ] `spec.md` — 본 파일. 목표, 오디언스, 성공 기준, 범위 외 정의.
- [ ] `content-plan.md` — 단일 페이지 IA, 섹션별 카피 방향, 곁가지(side-note) 시스템,
      tmux 주제 커버리지 체크리스트(누락 0).
- [ ] `design-guide.md` — 톤앤매너, 컬러/타이포 시스템, 레이아웃, "핫 에셋" 인벤토리
      (각각 학습 가치 정당화 포함), 접근성.
- [ ] `roadmap.md` — 향후 구현 Phase 분할(P1~P4). "PLANNING ONLY" 명시.
- [ ] tmux 팩트 검증 — 모든 단축키/명령어는 공식 위키 기반(prefix 기본 `C-b` 등).

## 8. 관련 산출물 (Related)

- `content-plan.md` — 본 SPEC의 심장.
- `design-guide.md` — 비주얼/자산 전략.
- `roadmap.md` — 구현 단계(본 단계 미실행).

## HISTORY

- 2026-06-19: 최초 작성. 기획 단계로 범위 확정. 테크 스택(정적 HTML/CSS/Vanilla JS) 반영.

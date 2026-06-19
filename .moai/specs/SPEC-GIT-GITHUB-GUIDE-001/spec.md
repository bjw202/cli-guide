---
id: SPEC-GIT-GITHUB-GUIDE-001
version: 1.0.0
status: Planned
created: 2026-06-19
updated: 2026-06-19
author: jw
priority: High
issue_number: "-"
lifecycle: spec-anchored
related:
  - SPEC-TMUX-GUIDE-001
---

# SPEC-GIT-GITHUB-GUIDE-001 — 비개발자를 위한 Git/GitHub 멀티페이지 학습 가이드 (기획 단계)

## 1. 목표 (Goal)

비개발자("버전 관리", "commit", "branch", "pull request"를 모르는 사람)가
**처음부터 끝까지 읽기만 해도** Git/GitHub가 무엇인지, 왜 쓰는지, 어떻게 쓰는지,
그리고 실생활·전문가 워크플로 모두에 어떻게 쓰이는지 이해할 수 있도록 돕는
**정적 멀티페이지 학습 가이드 웹사이트**를 기획한다.

본 사이트는 단일 페이지가 아닌 **하이브리드 IA**(순차 튜토리얼 트랙 + 참조 허브)를
가지며, 두 가지 탐색 모드를 제공한다:
- **(A) Tutorial Track**: 처음 들어온 독자를 위한 초급→고급 선형 경로
- **(B) Reference Hub**: 다시 찾는 독자를 위한 명령어 사전·용어집·FAQ 점프 허브

본 SPEC은 **기획 산출물(Planning Deliverable)** 에 한정한다.
HTML/CSS/JS 코드 구현은 이후 별도 Phase에서 다룬다.

> **핵심 오디언스 계약**: 모든 기술 개념은 먼저 일상적 비유로 소개되고, 그 다음에
> 실제 용어가 등장해야 한다. 샘플 카피는 호기심 많은 초보자에게 말하듯 작성된다.

## 2. 배경 및 시리즈 관계 (Why & Series Context)

### 2.1 왜 이 사이트인가

- Git/GitHub는 현대 모든 협업의 기반이지만 "개발자 전용"이라는 인식이 강하다.
- 비개발자(작가·디자이너·연구자·행정가·학생)도 매일 쓸 수 있는 도구인데, 진입장벽이
  너무 높아 보인다.
- 친근하고 풍부한 비주얼 자산(commit 그래프, PR 흐름 애니메이션, "Oh Shit Git" 복구기 등)이
  동반된, 비개발자용 풀스택 학습 자료의 부재.

### 2.2 시리즈 관계 (Series Continuity)

본 사이트는 **SPEC-TMUX-GUIDE-001 (tmux 단일 페이지 가이드)와 같은 시리즈의 자매 사이트**다.
"개발자들이 매일 쓰는 것을, 모두를 위해 풀어내는" 따뜻한 튜토리얼 시리즈의 두 번째 권.

**공유하는 것 (시리즈 결속을 위해 필수)**:
- 따뜻하고 친절한 튜토리얼 톤 (Dribbble/Notion-grade)
- 컬러 패밀리: 따뜻한 크림 #FFFBF5 / 코랄 #FF8A5B / 인디고 / 민트
- 타이포그래피: Pretendard(한) + JetBrains Mono(코드/명령어)
- 곁가지(side-note) 박스 시스템 5종 (비유/역사/팁/주의/알아두면 좋은)
- 오디언스 계약 (비유 먼저, 단어 나중)
- 한국어 존댓말 카피, 식별자/명령어는 영어 유지

**본 사이트만의 확장 (tmux 대비 다른 점)**:
- 멀티페이지 구조(허브 + 트랙 + 참조) — tmux는 단일 페이지였음
- Git 전용 인터랙티브 자산: commit 그래프 시각화, PR 흐름 다이어그램, Actions 파이프라인 애니메이션, "Oh Shit Git" 복구 시뮬레이터
- 시그니처 기능: **사례 갤러리(Cases Gallery)** — "이렇게도 쓸 수 있어요" 카드 그리드
- Git/GitHub 구별 색 액센트(따뜻한 초록 계열)로 tmux와 구별하되 패밀리 톤 유지

## 3. 오디언스 (Audience)

| 속성 | 설명 |
|---|---|
| 1차 독자 | "버전 관리", "commit", "branch"를 모르는 일반인 (작가/디자이너/학생/연구자/행정가) |
| 2차 독자 | 개발자 동료의 PR·Issue를 보거나, GitHub를 우연히 접한 비개발자 |
| 사전 지식 | 없음. 모든 개념은 0에서 시작한다고 가정 |
| 톤 | 따뜻하고 친절한 튜토리얼 (tmux 가이드와 동일), 겁주지 않기 |

## 4. 성공 기준 (Success Criteria, EARS-lite)

> 본 기준은 "최종 사이트"가 아니라 **기획 산출물 자체**의 수용 기준이다.

- **UBIQUITOUS**: 기획 산출물은 본 SPEC이 정의한 Git/GitHub 주제 커버리지 체크리스트
  항목 전체를 누락 없이 다루어야 한다(shall cover all coverage items).
- **WHEN** 비개발자 독자가 sample copy를 읽을 때, **THEN** 모든 기술 용어 앞에
  일상 비유가 먼저 등장해야 한다.
- **WHILE** 산출물을 리뷰하는 동안, **THEN** 어떤 항목도 HTML/CSS/JS 코드를
  포함하지 않아야 한다(no code this phase).
- **IF** 특정 git 명령어/옵션이나 GitHub 기능명이 명시된다면, **THEN** git-scm.com/docs
  및 docs.github.com 공식 문서와 일치해야 한다(verified against official docs).
- **WHEN** 멀티페이지 IA를 검토할 때, **THEN** 두 탐색 모드(순차 튜토리얼 트랙 +
  참조 허브)가 모두 명확히 정의되어야 하고, 페이지 간 교차 링크 전략이 있어야 한다.
- **WHEN** 디자인/자산 전략을 검토할 때, **THEN** 각 "핫 에셋"은 비개발자 학습
  가치에 대한 정당성을 포함해야 한다.
- **WHILE** 시리즈 결속을 검토할 때, **THEN** tmux 가이드(SPEC-TMUX-GUIDE-001)와
  디자인 톤/토큰/곁가지 박스를 공유하는 방향이 명시되어야 한다.
- **WHEN** 사례 갤러리를 검토할 때, **THEN** 비개발자 실생활 사례(Tier 1)와
  전문가/오픈소스 워크플로(Tier 2) 양쪽 모두가 포함되어야 한다.

## 5. 멀티페이지 제약 (Multi-Page Constraints)

- **정적 멀티페이지**: 섹션별 `.html` 파일 + 공유 `css/`+`js/` + 홈/인덱스 허브.
- **빌드 단계 없음**: 순수 HTML/CSS/Vanilla JS. `file://`로 바로 열림.
- **두 탐색 모드**: (A) Tutorial Track 선형 경로 + (B) Reference Hub 점프 허브.
- **전역 헤더/푸터**: 모든 페이지에 일관된 글로벌 내비게이션, 브레드크럼, prev/next 페이저.
- **클라이언트 사이드 검색**: 서버 없는 검색(사전 빌드된 인덱스 JSON).
- **교차 페이지 읽기 진행률**: 튜토리얼 트랙 전체 진행률 + 현재 페이지 내 진행률.
- **정적 호스팅 호환**: GitHub Pages 등 어디서나 동작.
- **시리즈 교차 링크**: tmux 가이드와 "이 시리즈의 다른 글"로 상호 링크.

## 6. 범위 외 (Exclusions / Out of Scope)

> 본 SPEC은 **기획(Planning) ONLY** 이다.

명시적으로 **이번 단계에서 하지 않는 것**:

- HTML, CSS, JS 코드 작성 ❌
- 실제 페이지 구현(implementation) ❌
- 정적 사이트 생성기 설정 ❌
- 배포/호스팅 구성 ❌
- 일러스트레이션 실제 제작(에셋 리스트와 방향만) ❌
- Git/GitHub 엔터프라이즈/서버 직접 운용 깊이 (개념만 소개) ❌
- 특정 언어/프레임워크별 git workflow 심화 (보편적 workflow만) ❌

## 7. 기획 산출물 수용 체크리스트 (Acceptance — Planning Deliverable)

- [ ] `spec.md` — 본 파일. 목표, 오디언스, 성공 기준, 범위 외, 시리즈 관계 정의.
- [ ] `ia-sitemap.md` — 멀티페이지 사이트맵, 파일 구조, 내비게이션 시스템, 두 탐색 모드,
      교차 링크 전략, 모바일 내비 패턴, 페이지 수 추정.
- [ ] `content-plan.md` — 페이지별 카피 방향, 곁가지 시스템(5+1종), Git/GitHub 커버리지
      체크리스트(누락 0), 서사 흐름(Arc) 근거, 깊은 곁가지 목록.
- [ ] `design-guide.md` — 톤앤매너(시리즈 공유), 컬러/타이포(시리즈 + git 액센트),
      페이지 템플릿, 핫 에셋 인벤토리(각 학습 가치 정당화 포함), 접근성/모바일.
- [ ] `cases-gallery.md` — Tier 1(비개발자 실생활) + Tier 2(전문가/오픈소스) 사례 카탈로그,
      각 사례별 git/github 기능 매핑 + 링크 타겟 페이지.
- [ ] `roadmap.md` — 향후 구현 Phase 분할(P1~P7). "PLANNING ONLY" 명시.
- [ ] 팩트 검증 — git 명령어는 git-scm.com/docs, GitHub 기능은 docs.github.com 기반.

## 8. 관련 산출물 (Related)

- `ia-sitemap.md` — 멀티페이지 구조의 심장 (tmux와의 가장 큰 차이).
- `content-plan.md` — 페이지별 카피 방향 + 풀스택 커버리지 체크리스트.
- `design-guide.md` — 시리즈 공유 디자인 + 멀티페이지 확장 + 핫 에셋.
- `cases-gallery.md` — 시그니처 기능 "이렇게도 쓸 수 있어요" 사례 카탈로그.
- `roadmap.md` — 구현 단계(본 단계 미실행).
- **형제 SPEC**: `SPEC-TMUX-GUIDE-001` — 같은 시리즈의 첫 권. 디자인 톤/토큰/곁가지 박스를 공유.

## HISTORY

- 2026-06-19: 최초 작성. 기획 단계로 범위 확정. 멀티페이지 + 하이브리드 IA 확정.
  시리즈 결속(SPEC-TMUX-GUIDE-001) 명시. 풀스택 Git/GitHub 커버리지 확정.

---
id: SPEC-GIT-GITHUB-IMPL-007
version: 1.1.0
status: Implemented
created: 2026-06-19
updated: 2026-06-19
author: jw
priority: High
lifecycle: spec-anchored
related:
  - SPEC-GIT-GITHUB-GUIDE-001
  - SPEC-GIT-GITHUB-IMPL-001
  - SPEC-GIT-GITHUB-IMPL-002
  - SPEC-GIT-GITHUB-IMPL-003
  - SPEC-GIT-GITHUB-IMPL-004
  - SPEC-GIT-GITHUB-IMPL-005
  - SPEC-GIT-GITHUB-IMPL-006
  - SPEC-TMUX-GUIDE-001
---

# SPEC — P7: 최종 QA + 접근성 + 크로스 브라우저 + 성능 (검증 프레임워크)

> 본 SPEC은 27페이지 사이트 전체의 **최종 품질 게이트**를 정의한다. 산출물은 새 기능이 아니라 **검증 체크리스트 + 테스트 계획**이다. 실제 버그 목록은 run 단계에서 발견되어 구체화된다.
> 청중: 본 사이트를 구현·검증하는 개발자. 기술적 정확도 우선.
> 듀얼 목적: (1) P7 최종 게이트, (2) P1~P6 run 중 사후검증(self-check) 참조.

---

## 1. 목표 (Goal)

27페이지(홈 1 + 튜토리얼 21 + 참조 4 + 사례 1) 정적 멀티페이지 사이트의 **최종 품질 게이트**를 통과시킨다. 검증 범주 7종(접근성, 크로스 브라우저, 성능, 링크/앵커 무결성, 모바일 반응형, 시리즈 결속, 기능 정상 동작) 각각에 대해 **무엇을 검증할 것인지(what to verify) + 통과 임계치(threshold)**를 정의한다. 본 SPEC이 끝나면 사이트가 공개될 준비를 마친다.

---

## 2. 배경 (Background)

본 SPEC은 모든 선행 Phase(P1~P6, IMPL-001~006)이 완료된 후 실행되는 **터미널 Phase**다. 본 SPEC이 정의하는 것은 **검증 프레임워크**(무엇을 검사할지 + 임계치)이며, 실제 버그 발견·수정은 run 단계에서 이루어진다. 본 SPEC을 사이트 전체의 "수용 체크리스트(acceptance checklist for the whole site)"로 취급한다.

**지금 플랜 가능한 부분**: 접근성 표준(WCAG AA), 크로스 브라우저 대상(Chrome/Firefox/Safari/Edge + iOS Safari/Android Chrome), Lighthouse 임계치(Performance 90+, Accessibility 95+, Best Practices 95+), 반응형 중단점(320~768px), 링크 무결성(0 broken) 등은 일반적 QA 표준으로 지금 확정 가능하다.

**P3~P6 run 이후 구체화되는 부분**: 실제 버그 패턴(예: 특정 일러스트 alt 누락, 특정 브라우저 CSS 미지원, 특정 인터랙티브 자산 성능 저하)은 각 Phase가 run된 후에야 드러난다. 따라서 본 SPEC은 프레임워크만 정의하고, 구체적 버그 목록은 run 보고서로 보강한다.

본 SPEC의 듀얼 용도: P1~P6 각 Phase는 자기 산출물에 대해 **본 체크리스트의 관련 부분집합**으로 사후검증(self-verify)한 뒤 done을 선언한다(섹션 6).

---

## 3. 검증 범주 (Verification Categories)

> 산출물은 체크리스트 + 테스트 계획이다. 새 코드를 작성하지 않는다. 각 범주별 검증 항목과 임계치를 아래에 정의한다.

### 3.1 접근성 (Accessibility)
- WCAG AA 색 대비: 본문 텍스트 4.5:1 이상 (IMPL-001 REQ-010 상속). 따뜻한 톤(`#FFFBF5` 배경 위 `#2D2A26` 본문 등)이라도 대비 희생 없음.
- 스크린 리더 테스트: VoiceOver(macOS/iOS), NVDA(Windows). 모든 콘텐츠 접근 가능.
- 키보드 전용 탐색: 모든 인터랙티브 요소(드롭다운, 검색, 페이저, 사이드바 TOC, 사례 필터, OhShitGitSimulator 등) Tab/Enter/Space 조작 가능.
- 일러스트 `alt` / `aria-describedby`: 핵심 일러스트(사진첩, 3개 방, 평행 우주, 마을, 컨베이어 등)에 의미 전달 보장.
- side-note: `role="complementary"` (design-guide 섹션 6).
- ReadingProgress: `aria-valuenow` 갱신.
- Breadcrumb: `nav aria-label="Breadcrumb"`.
- PrevNextPager: `rel="prev/next"`.

### 3.2 크로스 브라우저 (Cross-Browser)
- 데스크톱 4종: Chrome, Firefox, Safari, Edge (최신 안정 버전).
- 모바일 2종: iOS Safari, Android Chrome.
- 검증 기준: 6개 환경에서 시각적·기능적 동작 동일 (레이아웃 붕괴, JS 오류, 인터랙티브 자산 미동작 없음).

### 3.3 성능 (Performance)
- Lighthouse: Performance 90+, Accessibility 95+, Best Practices 95+.
- 첫 페이지 로드: 2초 이내(정적 호스팅 기준).
- 이미지 최적화: WebP/SVG (일러스트는 SVG 권장, 사진 계열은 WebP).
- 페이지당 JS: 50KB 미만 (빌드 단계 없음, 각 페이지가 로드하는 JS 합산).
- 검색 인덱스 로드 지연: `search-index.json` 로드 후 검색 사용 가능까지 측정 가능한 지연.

### 3.4 링크/앵커 무결성 (Link & Anchor Integrity)
- 27페이지 모든 내부 링크: broken link 0 (크롤러/스크립트 검증).
- 모든 `#anchor`: 대상 id 존재, 스크롤 이동 정상.
- 교차 링크(튜토리얼↔참조↔사례): 양방향 연결 정상 (ia-sitemap 섹션 5.3).

### 3.5 모바일 (Mobile Responsiveness)
- 반응형 중단점: 320~768px 전 구간 레이아웃 붕괴 없음.
- 햄버거/드로어 메뉴: 768px 이하 정상 동작 (IMPL-001 REQ-006).
- 하단 바(튜토리얼 한정): prev/next + 진행률 정상.
- 사이드바 TOC: 모바일에서 상단 접기/펼치기.
- side-note 박스: 모바일에서 본문 인라인 펼침 (데스크톱 2단 → 모바일 1단).

### 3.6 시리즈 결속 (Series Cohesion)
- tmux 자매 사이트와 시각적 일관성: 토큰(변수명 동일, IMPL-001 REQ-001), 폰트(Pretendard + JetBrains Mono), side-note 톤(5종 공유).
- "이 시리즈의 다른 글" 양방향 링크: 본 사이트 → tmux, tmux → 본 사이트 모두 동작.

### 3.7 기능 (Functional)
- localStorage 진행률: 새로고침 후 유지 (IMPL-001 REQ-005).
- 검색: 모든 27페이지 반환 (누락 페이지 0).
- P6 인터랙티브 자산: GitGraphVisualizer, StagingFlowDiagram, PRFlowDiagram, ActionsPipelineAnimation, OhShitGitSimulator, ConflictResolverMini, GlossaryTooltip 모두 정상 동작.
- `prefers-reduced-motion: reduce`: 모든 모션 축소 (IMPL-001 REQ-007).

---

## 4. 수용 기준 (Acceptance Criteria, EARS)

> 키워드(UBIQUITOUS, WHEN, WHILE, IF, THEN, SHALL)는 영어로 유지. 본문은 한국어.

- **REQ-001 (WCAG AA 준수)**: UBIQUITOUS — 본 사이트의 모든 페이지는 자동화된 접근성 스캔(axe/Lighthouse) 결과 WCAG AA 위반 0건이며, 수동 스크린 리더 테스트(VoiceOver 또는 NVDA)에서 모든 콘텐츠 접근 가능 SHALL.

- **REQ-002 (크로스 브라우저 동일 동작)**: UBIQUITOUS — 본 사이트는 Chrome, Firefox, Safari, Edge(데스크톱 최신)와 iOS Safari, Android Chrome(모바일) 6개 환경에서 시각적·기능적 동작이 동일 SHALL (레이아웃 붕괴·JS 오류·인터랙티브 자산 미동작 0건).

- **REQ-003 (Lighthouse 성능 임계치)**: UBIQUITOUS — Lighthouse 검증에서 Performance 점수 90 이상, Accessibility 점수 95 이상, Best Practices 점수 95 이상을 충족 SHALL.

- **REQ-004 (첫 페이지 로드 시간)**: WHEN 사용자가 정적 호스팅 환경에서 임의의 페이지를 최초 로드하면, THEN 첫 페이지 로드가 2초 이내에 완료 SHALL.

- **REQ-005 (링크 무결성)**: UBIQUITOUS — 본 사이트의 모든 내부 링크와 모든 `#anchor`는 broken 0건이며, 모든 교차 링크(튜토리얼↔참조↔사례)가 양방향으로 정상 동작 SHALL.

- **REQ-006 (모바일 반응형)**: WHILE 뷰포트 너비가 320px~768px 범위 내의 임의의 값이면, THEN 모든 페이지가 레이아웃 붕괴 없이 렌더링되고 햄버거 메뉴·하단 바·사이드바 TOC 접기·side-note 인라인 펼침이 정상 동작 SHALL.

- **REQ-007 (시리즈 시각 결속)**: UBIQUITOUS — 본 사이트는 tmux 자매 사이트와 토큰·폰트·side-note 톤에서 시각적 일관성을 유지하며, "이 시리즈의 다른 글" 양방향 링크가 정상 동작 SHALL.

- **REQ-008 (P6 자산 기능)**: UBIQUITOUS — P6에서 구현된 모든 인터랙티브 자산(GitGraphVisualizer, StagingFlowDiagram, PRFlowDiagram, ActionsPipelineAnimation, OhShitGitSimulator, ConflictResolverMini, GlossaryTooltip)이 정상 동작 SHALL.

- **REQ-009 (모션 축소)**: WHILE 운영체제 설정이 `prefers-reduced-motion: reduce`이면, THEN 본 사이트의 모든 모션(reveal, graph, pipeline 등)이 축소 또는 즉시 표시로 전환 SHALL.

- **REQ-010 (비개발자 리뷰, 선택)**: WHERE 비개발자 리뷰어 1~2명을 확보할 수 있으면, THEN 해당 리뷰어가 "처음부터 끝까지 읽을 수 있다"고 확인 SHALL (선택 기준, 미확보 시 본 SPEC 완료를 차단하지 않음).

---

## 5. 범위 외 (Out of Scope)

명시적으로 본 SPEC(P7) 범위에서 제외되는 항목.

- **새 기능 개발**: QA 과정에서 발견된 기능적 간격(gap)은 해당 산출물을 소유한 Phase의 SPEC(IMPL-001~006)으로 역루팅(reroute)되어 수정된다. 본 SPEC은 새 기능을 만들지 않는다.
- **백엔드**: 본 사이트는 정적 멀티페이지(서버 없음). 백엔드 검증 대상 아님.
- **SEO 심화**: 기본 메타 태그·OG 이미지 수준은 IMPL-002에서 처리. 본 SPEC은 SEO 심화(sitemap.xml, robots.txt, 구조화 데이터 등) 범위 외.
- **실제 버그 목록 작성(플랜 단계)**: 본 SPEC은 프레임워크만 정의. 구체적 버그 패턴은 P3~P6 run 후 보강.
- **tmux 자매 사이트 수정**: tmux 원본 무결성 유지(IMPL-001 REQ-0011 상속). 시리즈 결속 검증은 읽기 전용 비교만.

---

## 6. 사후검증 참조 (Per-Phase Self-Check Reference)

본 SPEC은 듀얼 목적을 가진다: P7 최종 게이트뿐 아니라, P1~P6 각 Phase가 자기 산출물을 검증할 때 참조하는 **사후검증 체크리스트**로도 사용된다.

- P1(IMPL-001)은 섹션 3.1(접근성 기본: 대비, role, aria), 3.5(햄버거, 반응형), 3.7(진행률, reduced-motion)의 부분집합으로 사후검증 후 done 선언.
- P2(IMPL-002)는 섹션 3.1(검색 키보드 탐색·결과 개수 안내), 3.4(홈→세 문 링크), 3.3(검색 인덱스 로드 지연) 부분집합으로 사후검증.
- P3(IMPL-003)은 섹션 3.1(side-note role, 용어 박스), 3.4(prev/next 페이저, 사례 콜아웃 링크), 3.5(사이드바 TOC 접기) 부분집합으로 사후검증.
- P4(IMPL-004)는 섹션 3.4(참조↔튜토리얼 링크, 용어집 앵커), 3.1(아코디언 키보드) 부분집합으로 사후검증.
- P5(IMPL-005)는 섹션 3.5(카드 그리드 모바일 1~2열), 3.1(필터 키보드), 3.4(사례↔튜토리얼 교차 링크) 부분집합으로 사후검증.
- P6(IMPL-006)은 섹션 3.1(자산 키보드 조작), 3.3(자산 성능), 3.7(자산 기능) 부분집합으로 사후검증.

각 Phase는 자기 범위의 부분집합을 통과한 후에만 done을 선언한다. P7은 이 모든 부분집합이 통과된 전제에서 전체 게이트를 최종 확인한다.

---

## 7. 의존성 (Dependencies)

- **IMPL-001 ~ IMPL-006 전부 완료**: 본 SPEC은 터미널 Phase로, 모든 선행 Phase의 산출물이 존재해야 검증 대상이 성립한다.
- **SPEC-GIT-GITHUB-GUIDE-001 기획 산출물**(입력): `roadmap.md` P7 항목, `design-guide.md` 섹션 6(접근성·모바일), `ia-sitemap.md` 섹션 7(모바일 내비), 섹션 8(27페이지).
- **SPEC-TMUX-GUIDE-001**(참조, 읽기 전용): 시리즈 결속 검증의 비교 기준점. 원본 수정 금지.

---

## 8. 리스크 (Risks)

| 리스크 | 영향 | 완화 |
|---|---|---|
| 비개발자 리뷰어 확보 불확실 | REQ-010(선택 기준) 미충족 | REQ-010을 선택 기준으로 명시(미확보 시 완료 차단 안 함). |
| Lighthouse 점수 run 간 변동 | REQ-003 임계치 경계에서 통과/실패 불안정 | 3회 이상 측정 중앙값 사용, 경계 케이스는 원인 분석 후 개선. |
| 스크린 리더 버전 차이(VoiceOver/NVDA) | 환경별 안내 차이로 위양성/위음성 | 주요 2종(VoiceOver, NVDA) 최신 안정 버전 기준. 버전 차이로 인한 미세 차이는 문서화만 하고 실패로 간주 안 함. |
| P3~P6 run 후 버그 패턴 구체화 | 본 SPEC 프레임워크만으로 불충분 가능 | run 보고서에서 발견된 구체적 버그 패턴을 본 SPEC에 보강(spec-anchored lifecycle). |
| 27페이지 분량으로 수동 검증 분산 | 검증 누락 | 자동화 가능한 항목(링크 크롤링, Lighthouse, axe 스캔)은 스크립트화, 수동 항목(스크린 리더, 비개발자 리뷰)은 체크리스트로 추적. |

---

## 9. 관련 산출물 (Related)

- **선행 구현 SPEC**: IMPL-001(P1 셸), IMPL-002(P2 홈+검색), IMPL-003(P3 튜토리얼 21), IMPL-004(P4 참조 4), IMPL-005(P5 사례 갤러리), IMPL-006(P6 Git 특화 자산).
- **기획 산출물군(GUIDE-001)**: `spec.md`, `roadmap.md`(P7 항목), `design-guide.md`(섹션 6 접근성·모바일), `ia-sitemap.md`(섹션 7 모바일 내비, 섹션 8 페이지 수), `content-plan.md`, `cases-gallery.md`.
- **SPEC-TMUX-GUIDE-001**: tmux 자매 사이트. 시리즈 결속 검증의 기준점.

---

## HISTORY

- 2026-06-19: 최초 작성. GUIDE-001 roadmap P7을 구현 단계로 정식화. 검증 범주 7종(접근성, 크로스 브라우저, 성능, 링크/앵커, 모바일, 시리즈 결속, 기능) 정의. 듀얼 용도(최종 게이트 + per-Phase 사후검증 참조) 명시. EARS 수용 기준 10건(REQ-001~REQ-010, 그중 REQ-010은 선택) 확정. 새 기능 개발·백엔드·SEO 심화를 명시적 범위 외로 지정. research.md는 작성하지 않음(검증 프레임워크이므로 역분석 대상 없음).
- 2026-06-19: Run + Sync 완료. 링크 무결성 자동화 스크립트로 27페이지·550 내부 링크·26 앵커 검증 → 0 broken(REQ-005 PASS). P5 정적 카드 리팩터(C1), github-concept pager 오타(C2), 홈 네비 placeholder 6건(C3) 시정. 자동화 게이트 PASS, 수동 권장 4종(크로스 브라우저·Lighthouse·스크린 리더·비개발자 리뷰)은 배포 전 별도 수행으로 위임. 실행 보고서는 `qa-report.md`. status → Implemented.

---
id: SPEC-GIT-GITHUB-IMPL-006
version: 1.1.0
status: Implemented
created: 2026-06-19
updated: 2026-06-19
author: jw
priority: Medium
lifecycle: spec-anchored
related:
  - SPEC-GIT-GITHUB-GUIDE-001
  - SPEC-GIT-GITHUB-IMPL-001
  - SPEC-GIT-GITHUB-IMPL-003
  - SPEC-GIT-GITHUB-IMPL-004
  - SPEC-TMUX-GUIDE-001
---

# SPEC — P6: Git 특화 인터랙티브 자산 7종

> 본 SPEC은 SPEC-GIT-GITHUB-GUIDE-001(기획 산출물)의 roadmap P6을 구현 단계로 정식화한 것이다.
> design-guide.md 섹션 5(C/D/E/F/G/K/N)가 각 자산의 권위 있는 정의이며, 본 SPEC은 이를 EARS 수용 기준으로 전환한다.
> 청중: 본 사이트를 구현하는 개발자. WHAT/WHY에 집중하고 HOW(SVG 좌표, 상태머신 다이어그램)는 run 단계로 연기한다.

---

## 1. 목표 (Goal)

**7개의 Git/GitHub 특화 인터랙티브 자산**을 납품한다. 각 자산은 추상적인 Git/GitHub 개념을 시각적·인터랙티브 경험으로 바꾼다. 이 자산들은 본 사이트의 **품질 차별화 요소**다 — 선형 텍스트 튜토리얼(P3)이 "설명"을 담당한다면, P6 자산은 "체험"을 담당하여 비개발자 학습 가치를 비약적으로 높인다.

7개 자산:
1. `js/git-graph.js` + `GitGraphVisualizer` — commit 그래프 인터랙티브.
2. `js/staging-flow.js` + `StagingFlowDiagram` — 3개 방 파일 이동 다이어그램.
3. `js/pr-flow.js` + `PRFlowDiagram` — PR 워크플로우 애니메이션.
4. `js/actions-pipeline.js` + `ActionsPipelineAnimation` — CI/CD 파이프라인 애니메이션.
5. `js/oh-shit-git.js` + `OhShitGitSimulator` — 실수 복구 시뮬레이터 (7 시나리오).
6. `js/conflict-resolver.js` + `ConflictResolverMini` — 충돌 해결 미니 인터랙션.
7. `js/glossary-tooltip.js` + `GlossaryTooltip` — 용어 hover/focus 툴팁.

본 Phase가 끝나면 P3 튜토리얼 페이지들에 이 자산들이 삽입되어 사이트가 "읽는 문서"에서 "만지는 문서"로 전환된다.

---

## 2. 배경 (Background)

본 SPEC은 GUIDE-001의 roadmap P6 항목을 구현 단계로 전환한다. design-guide.md 섹션 5 "핫 에셋 인벤토리"의 항목 C/D/E/F/G/K/N이 본 SPEC의 직접 범위다. content-plan.md의 T04/T06/T07/T08/T11/T15/T16/T18 삽입 타겟과 T11의 "Oh Shit Git" 7 시나리오가 자산별 적용 지점을 정의한다. ia-sitemap.md 섹션 3의 `js/` 파일 트리가 파일명을 확정한다.

**의존 관계**:
- IMPL-001(P1): 공유 셸, `--git-green #2E7D52` 토큰, side-note 박스, `prefers-reduced-motion` 패턴, tmux 변수명 관습(`--primary`, `--note-*`, 단순명)을 상속받는다.
- IMPL-003(P3): 자산이 삽입될 튜토리얼 호스트 페이지(T04/T06/T07/T08/T11/T15/T16/T18)가 필요하다. P6는 이론적으로 P3 페이지 완성 이후에 실행되나, SPEC은 지금 작성 가능하다(자산 독립 모듈).
- IMPL-004(P4): `GlossaryTooltip`이 R02 용어집 데이터를 소비한다. 용어 정의 자체는 P4 범위.

**WHAT vs HOW 경계**: 본 SPEC은 각 자산이 "무엇을 학습 가치로 전달해야 하는가"와 "어떤 삽입 지점에서 어떤 시나리오를 보여야 하는가"를 정의한다. SVG 구조, 상태머신 전이도, 애니메이션 easing 함수, 색상 좌표 등 구현 상세는 run 단계로 연기된다.

---

## 3. 산출물 — 7개 자산 (Deliverables)

### 3.1 `js/git-graph.js` + `GitGraphVisualizer` (design-guide C)

- **목적**: 인터랙티브 commit 그래프. 브랜치가 가지 뻗고, 병합이 합류하며, (선택) rebase가 커밋을 재배치하는 모습을 애니메이션으로.
- **학습 가치**: Git의 최대 진입장벽인 "브랜치가 뭐고 병합이 뭔지"를 한눈에. 선형 텍스트 100번 설명보다 그래프가 한 번 움직이는 것이 압도적.
- **삽입 타겟**: T06(branch), T07(merge), T08(rebase).
- **시나리오(design-guide C)**:
  1. main 브랜치 일직선.
  2. "feature 브랜치 만들기" → 가지 위로 갈라짐.
  3. "커밋 추가" → 각 가지에 노드.
  4. "merge" → 두 가지 합류 노드 생성.
  5. (선택) "rebase" → feature 커밋들이 main 끝으로 재배치.

### 3.2 `js/staging-flow.js` + `StagingFlowDiagram` (design-guide D)

- **목적**: 3개 방(working/staging/repo) 다이어그램. 파일 아이콘이 add/commit 명령에 따라 방 사이를 이동하는 애니메이션.
- **학습 가치**: "왜 add를 해야 commit하지?", "diff는 왜 3종류인가?"를 시각적으로 해소.
- **삽입 타겟**: T04(staging).
- **시나리오**: 파일이 작업 방 → (git add) → 대기 방 → (git commit) → 기록 방으로 이동. 각 전환 시 방 내 카운트/색상 변화.

### 3.3 `js/pr-flow.js` + `PRFlowDiagram` (design-guide E)

- **목적**: fork → branch → commit → push → PR → review → merge의 7단계 흐름을 애니메이션으로.
- **학습 가치**: PR이 뭔지 한 장의 그림+모션으로. "왜 fork하지?", "review는 언제?"를 흐름으로 파악.
- **삽입 타겟**: T15(repo), T16(issues-pr).
- **시나리오**: 7개 노드가 순차적으로 하이라이트. 각 노드 클릭/포커스 시 상세 설명 팝업.

### 3.4 `js/actions-pipeline.js` + `ActionsPipelineAnimation` (design-guide F)

- **목적**: event → job → step → artifact → deploy의 CI/CD 파이프라인 컨베이어 애니메이션. 로봇 공장 비유.
- **학습 가치**: "CI/CD가 뭔지"를 컨베이어 벨트 비유로 시각화. push 이벤트가 빌드 결과물로 변환되어 배포되는 흐름을 한눈에.
- **삽입 타겟**: T18(actions).
- **시나리오**: event(push) → runner → steps(순차 실행) → artifact(빌드 결과) → deploy(배포 완료). 각 단계 성공 시 `--git-green #2E7D52` 하이라이트, 실패 시 `--warning #EF5350`.

### 3.5 `js/oh-shit-git.js` + `OhShitGitSimulator` (design-guide G, 시그니처)

- **목적**: 실수 상황을 고르면 복구 명령 + "왜 이게 작동하나" 설명이 나오는 인터랙티브. ohshitgit.com 오마주.
- **학습 가치**: 비개발자가 Git을 두려워하는 최대 이유 = "실수하면 날아갈까". 이 공포를 시나리오로 직접 체험하고 해소.
- **삽입 타겟**: T11(undo).
- **7 시나리오(content-plan T11 / design-guide G)**:
  1. "잘못 브랜치에서 커밋했어요" → cherry-pick 또는 새 브랜치 생성 후 reset.
  2. "reset --hard 했는데 필요했어요" → reflog에서 복구.
  3. "커밋 메시지 오타 났어요" → `git commit --amend`.
  4. "방금 커밋 취소하고 싶어요" → `git reset HEAD~1`.
  5. "이미 push한 커밋 취소하고 싶어요" → `git revert`.
  6. "force push 해서 동료 작업 날아갔어요" → 경고 + 동료 협조 안내.
  7. ".env 파일 실수로 push했어요" → filter-repo + 비밀번호 변경.

### 3.6 `js/conflict-resolver.js` + `ConflictResolverMini` (design-guide N)

- **목적**: 충돌 난 파일에서 두 버전(A/B)을 토글하며 선택하는 미니 인터랙션.
- **학습 가치**: "충돌이 뭔가"를 행동으로 체험. 두 줄을 보고 하나를 고르는 단순 액션으로 `<<<<<<<`/`=======`/`>>>>>>>` 마커의 의미를 체득.
- **삽입 타겟**: T07(merge).
- **시나리오**: side-by-side 두 버전 + 라디오/토글 선택 + 결과 미리보기. 사용자가 A/B/둘 다 중 선택하면 최종 병합 결과 표시.

### 3.7 `js/glossary-tooltip.js` + `GlossaryTooltip` (design-guide K)

- **목적**: 본문에 나오는 용어에 hover/focus하면 한 줄 정의 + 비유 툴팁 표시.
- **학습 가치**: "branch가 뭐였지?"를 새 탭 열지 않고 본문에서 즉시 해결.
- **삽입 타겟**: 모든 튜토리얼 페이지의 용어 span (전역 적용).
- **데이터 소스**: R02 용어집(IMPL-004 산출물)과 연동. 툴팁 내용은 R02 정의 + 비유 한 줄.

---

## 4. 수용 기준 (Acceptance Criteria, EARS)

> 키워드(UBIQUITOUS, WHEN, WHILE, IF, THEN, WHERE, SHALL)는 영어로 유지. 본문은 한국어.

- **REQ-001 (GitGraph 분기·합류)**: WHEN 사용자가 `GitGraphVisualizer`에서 "merge" 단계를 실행하면, THEN main 브랜치와 feature 브랜치가 하나의 합류 노드에서 수렴하는 모습이 시각적으로 표현 SHALL.

- **REQ-002 (GitGraph rebase)**: WHERE "rebase" 시나리오가 활성화된 경우, WHEN 사용자가 rebase를 실행하면, THEN feature 브랜치의 커밋 노드들이 main 브랜치 끝으로 재배치되어 역사가 일직선으로 정리되는 모습이 표현 SHALL.

- **REQ-003 (OhShitGit 7 시나리오 정확성)**: UBIQUITOUS — `OhShitGitSimulator`는 content-plan T11의 7개 시나리오 각각에 대해, design-guide G에 명시된 복구 명령(`cherry-pick`/`reflog`/`commit --amend`/`reset HEAD~1`/`revert`/경고+협조/`filter-repo`)과 정확히 일치하는 명령과 설명을 표시 SHALL.

- **REQ-004 (prefers-reduced-motion 축소)**: WHILE 운영체제 설정이 `prefers-reduced-motion: reduce`이면, THEN 모든 7개 자산의 애니메이션 모션이 축소(즉시 상태 전환, transition 생략)되거나 정지 SHALL. 단, 축소 모드에서도 각 자산의 정보(그래프 구조, 시나리오 답안, 툴팁 정의)는 정적으로 온전히 전달 SHALL.

- **REQ-005 (키보드 조작)**: UBIQUITOUS — 모든 7개 자산의 인터랙티브 요소(버튼, 시나리오 카드, 토글, 툴팁 트리거)는 tab 키로 포커스 이동이 가능하고 Enter/Space로 활성화 SHALL.

- **REQ-006 (GlossaryTooltip R02 일치)**: WHEN 튜토리얼 페이지의 용어 span에 hover 또는 focus가 발생하면, THEN `GlossaryTooltip`이 R02 용어집(IMPL-004)의 해당 용어 정의 + 비유 한 줄과 정확히 일치하는 내용을 툴팁으로 표시 SHALL.

- **REQ-007 (ConflictResolver 양 버전 선택)**: WHEN 사용자가 `ConflictResolverMini`에서 두 버전(A/B) 중 하나 또는 둘 다를 선택하면, THEN 선택 결과를 반영한 최종 병합 텍스트가 즉시 미리보기로 표시 SHALL.

- **REQ-008 (ActionsPipeline event→deploy 순서)**: WHEN `ActionsPipelineAnimation`이 실행되면, THEN event → job → step → artifact → deploy의 5단계가 순차적으로 하이라이트되는 흐름이 표현 SHALL.

- **REQ-009 (StagingFlow 3방 이동)**: WHEN 사용자가 `StagingFlowDiagram`에서 add/commit 액션을 실행하면, THEN 파일 아이콘이 working → staging → repo의 3개 방을 순서대로 이동하는 모습이 표현 SHALL.

- **REQ-010 (PRFlow 7단계 순서)**: WHEN `PRFlowDiagram`이 실행되면, THEN fork → branch → commit → push → PR → review → merge의 7단계가 순차적으로 하이라이트되는 흐름이 표현 SHALL.

- **REQ-011 (P1 셸 상속 + tmux 변수명)**: UBIQUITOUS — 모든 7개 자산은 IMPL-001의 공유 셸(5 CSS + 3 JS) 위에서 동작하고, `tokens.css`의 tmux 변수명 관습(`--primary`, `--note-*` 단순명)과 Git 액센트 변수(`--git-green`, `--village-indigo`)를 사용 SHALL.

- **REQ-012 (성공 상태 색상)**: UBIQUITOUS — 자산 내에서 "성공"(merge 합류, deploy 완료, 복구 성공)을 나타내는 시각적 신호는 `--git-green #2E7D52` 톤을 사용 SHALL. "실패/주의"(충돌, 파이프라인 실패, force push 경고)는 `--warning #EF5350` 톤을 사용 SHALL.

- **REQ-013 (빌드 없음)**: UBIQUITOUS — 모든 7개 자산은 빌드 단계 없이 `file://` 프로토콜에서 직접 동작 SHALL. (Node/npm/bundler 의존성 없음. 각 자산은 단일 독립 JS 모듈.)

- **REQ-014 (WCAG AA + 키보드)**: UBIQUITOUS — 모든 7개 자산은 WCAG AA 색 대비(4.5:1 이상)를 충족하고, 스크린 리더가 자산 상태(현재 단계, 선택 결과, 툴팁 내용)를 인식할 수 있도록 적절한 ARIA 속성을 포함 SHALL.

- **REQ-015 (tmux 원본 무결성)**: UBIQUITOUS — 본 SPEC의 어떤 산출물도 `tmux/` 디렉토리의 원본 파일을 수정하지 SHALL NOT.

---

## 5. 범위 외 (Out of Scope)

명시적으로 본 SPEC(P6) 범위에서 제외되는 항목.

- 튜토리얼 페이지 본문 카피, side-note 실제 내용, FakeTerminal 명령 스크립트 → **P3 (IMPL-003)**. P6는 완성된 P3 페이지에 자산을 "삽입"만 한다.
- R02 용어집의 용어 정의·비유 자체 → **P4 (IMPL-004)**. P6의 `GlossaryTooltip`은 R02 데이터를 소비만 한다(정의 생성 안 함).
- 사례 갤러리 카드·필터·26개 사례 데이터 → **P5 (IMPL-005)**.
- 최종 QA 감사(WCAG 스크린 리더 테스트, 크로스 브라우저, Lighthouse 성능) → **P7 (IMPL-007)**. 본 SPEC은 REQ-014로 자산 단위 a11y를 정의하나, 전체 사이트 감사는 P7.
- 백엔드/API 서버 (본 사이트는 정적 멀티페이지, 서버 없음).
- SVG 좌표 명세, 상태머신 전이도, 애니메이션 easing 상세 → **run 단계** (WHAT이 아닌 HOW).
- tmux `main.js` 원본 수정 (REQ-015 위반).

---

## 6. 아키텍처 결정 (Architecture Decisions)

### 6.1 SVG/CSS-positioned 접근 (canvas/WebGL 라이브러리 배격)

**결정**: `GitGraphVisualizer`, `StagingFlowDiagram`, `PRFlowDiagram`, `ActionsPipelineAnimation`은 외부 그래픽 라이브러리(D3, vis.js, three.js 등) 없이 인라인 SVG 또는 CSS-positioned div로 구현한다.

**근거**: (a) 빌드 단계 없는 정적 사이트 원칙(REQ-013)과 npm 의존성 충돌. (b) SVG는 DOM 기반이라 스크린 리더·키보드 접근성(REQ-005, REQ-014)이 canvas 대비 압도적. (c) 7개 자산 모두 고정된 시나리오 재생형이라 범용 그래프 라이브러리의 표현력이 불필요.

### 6.2 최소 상태머신

**결정**: 각 자산의 상태 전이는 단순 선형(시나리오 스텝 순서) 또는 단일 선택(시나리오 카드 고르기) 수준의 최소 상태머신으로 제한한다.

**근거**: design-guide의 시나리오는 모두 미리 정해진 순서(main→feature→merge 등)이거나 카드 선택형(OhShitGit 7 시나리오)이다. 복잡한 유한상태머신(xstate 등)은 과잉 엔지니어링. 상태 전이의 상세한 정의는 run 단계에서 각 자산별로 최소화하여 설계.

### 6.3 자산별 독립 JS 모듈

**결정**: 7개 자산은 각각 단일 독립 JS 파일(`git-graph.js`, `staging-flow.js` 등)로 작성된다. 공통 유틸리티가 필요한 경우 IMPL-001의 `reveal.js`/`progress.js` 패턴을 따르되, 자산 간 강한 결합은 피한다.

**근거**: (a) 빌드 없이 각 튜토리얼 페이지가 필요한 자산 JS만 `<script>`로 로드할 수 있게. (b) 7개 자산 중 일부만 구현 완료해도 사이트가 동작(roadmap P6 리스크 완화: "핵심 자산 우선, 부가 자산은 선택"). (c) 파일명은 ia-sitemap 섹션 3에 확정된 대로.

### 6.4 데이터 주도 (OhShitGit 시나리오 JSON)

**결정**: `OhShitGitSimulator`의 7개 시나리오 데이터(상황 설명, 복구 명령, "왜 작동하나" 설명)는 JS 하드코딩이 아닌 별도 JSON 또는 JS 상수 객체로 분리한다. `GlossaryTooltip`도 마찬가지로 R02 용어집 데이터를 외부 소스에서 읽는다.

**근거**: 시나리오 내용(특히 복구 명령의 정확성, REQ-003)은 content-plan T11과 design-guide G에 명시되어 있고, 향후 오타 수정·시나리오 추가가 코드 로직 수정 없이 데이터만으로 가능해야 한다.

---

## 7. 의존성 (Dependencies)

- **SPEC-GIT-GITHUB-IMPL-001 (P1)**: 공유 셸(5 CSS + 3 JS), `--git-green #2E7D52`, `--village-indigo #5B6CFF`, side-note 박스 6종, `prefers-reduced-motion` 패턴, tmux 변수명 관습을 상속. 모든 자산은 P1 셸 위에서 동작(REQ-011).
- **SPEC-GIT-GITHUB-IMPL-003 (P3)**: 자산 삽입 호스트 페이지. T04/T06/T07/T08/T11/T15/T16/T18의 본문이 완성된 후 자산이 해당 위치에 주입된다. P6는 P3 완성 후 실행되는 것이 이상적이나, 자산 자체는 독립 모듈이라 P3 진행과 병렬로 개발 가능(나중에 삽입만 수행).
- **SPEC-GIT-GITHUB-IMPL-004 (P4)**: R02 용어집 데이터. `GlossaryTooltip`은 R02의 용어 정의·비유를 소비한다(REQ-006). R02 정의 자체는 P4 범위.
- **SPEC-GIT-GITHUB-GUIDE-001 기획 산출물**(입력): `design-guide.md` 섹션 5(C/D/E/F/G/K/N)가 자산 권위 정의, `content-plan.md` T04/T06/T07/T08/T11/T15/T16/T18이 삽입 타겟과 T11의 7 시나리오, `ia-sitemap.md` 섹션이 `js/` 파일명 확정.

---

## 8. 리스크 (Risks)

| 리스크 | 영향 | 완화 |
|---|---|---|
| 자산 복잡도 (GitGraph, OhShitGit이 시그니처) | 구현 지연, 품질 편차 | `GitGraphVisualizer`와 `OhShitGitSimulator`를 우선순위 High로 두고 먼저 완성. 나머지 5개 자산은 개별적으로 납품 가능(독립 모듈, 결정 6.3). roadmap P6 리스크 완화 원칙 준수. |
| `prefers-reduced-motion` 정적 전달 | 모션 축소 시 정보 손실 | REQ-004로 "모션은 축소되되 정보는 정적으로 온전히 전달"을 명시. 각 자산 설계 시 모션 없이도 그래프 구조·시나리오 답안·툴팁 정의가 가시적이도록 보장. |
| 툴팁 모바일 위치 | 작은 화면에서 툴팁 잘림 | `GlossaryTooltip`은 모바일에서 hover 대신 tap-to-toggle, 툴팁 위치는 뷰포트 경계 회피 로직 필요(구현 상세, run 단계). |
| R02 용어집 미완성 시 GlossaryTooltip 공백 | 툴팁 내용 누락 | P6 실행 시점에 R02가 완성되어 있어야(의존성 명시). R02 미완성 시 해당 용어는 툴팁 없이 일반 텍스트로 폴백. |
| 7개 자산 JS로 페이지 로드 증가 | 성능 저하 | 각 자산은 필요한 튜토리얼 페이지에서만 `<script>` 로드(독립 모듈, 결정 6.3). 모든 페이지가 7개를 전부 로드하지 않음. Lighthouse 검증은 P7. |

---

## 9. 관련 산출물 (Related)

- SPEC-GIT-GITHUB-GUIDE-001 산출물군: `spec.md`(오디언스 계약, 시리즈 결속), `roadmap.md`(P6 범위 스켈레톤), `design-guide.md`(섹션 5 자산 권위 정의 — 본 SPEC의 1차 입력), `content-plan.md`(T04/T06/T07/T08/T11/T15/T16/T18 삽입 타겟, T11의 7 시나리오), `ia-sitemap.md`(`js/` 파일명 확정).
- SPEC-GIT-GITHUB-IMPL-001 (P1): 공유 셸·디자인 시스템·tmux 변수명 관습. 본 SPEC의 토큰·셸 상속 원천.
- SPEC-GIT-GITHUB-IMPL-003 (P3): 튜토리얼 21페이지. 자산 삽입 호스트.
- SPEC-GIT-GITHUB-IMPL-004 (P4): R02 용어집. `GlossaryTooltip` 데이터 소스.
- SPEC-TMUX-GUIDE-001: tmux 자매 사이트. 시리즈 결속 기준점이자 변수명 관습 원천.
- 후속 구현 SPEC: IMPL-002(P2 홈+검색), IMPL-005(P5 사례 갤러리), IMPL-007(P7 QA/접근성). 본 SPEC과 느슨한 결합(직접 의존 아님).

---

## HISTORY

- 2026-06-19: 최초 작성. SPEC-GIT-GITHUB-GUIDE-001 roadmap P6를 구현 단계로 정식화. design-guide 섹션 5의 C/D/E/F/G/K/N 자산 정의를 15개 EARS 수용 기준(REQ-001~REQ-015)으로 전환. content-plan T11의 7개 "Oh Shit Git" 시나리오를 REQ-003으로 정식화. WHAT/WHY에 집중하고 HOW(SVG 좌표·상태머신 다이어그램)는 run 단계로 연기. IMPL-001 토큰·셸 상속, IMPL-003 삽입 호스트, IMPL-004 R02 데이터 의존성 명시.
- 2026-06-19: Run + Sync 완료. 7개 독립 JS 모듈 납품(`git-graph`/`staging-flow`/`pr-flow`/`actions-pipeline`/`oh-shit-git`/`conflict-resolver`/`glossary-tooltip`). 자산 컴포넌트 CSS를 `components.css`에 추가(5-CSS 계약 유지). OhShitGit 7 시나리오는 design-guide G와 정홀 일치(REQ-003). GlossaryTooltip은 R02 용어집 37종 미러(file:// 동작). 8개 튜토리얼 호스트 페이지(T04/T06/T07/T08/T11/T15/T16/T18)에 자산 삽입 + GlossaryTooltip 전역 로드. 모든 자산 reduced-motion·키보드·ARIA 준수. P7 검증 PASS. status → Implemented.

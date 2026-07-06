---
id: SPEC-GIT-GITHUB-IMPL-008
version: 1.1.0
status: Implemented
created: 2026-07-06
updated: 2026-07-06
author: jw
priority: Medium
lifecycle: spec-anchored
related:
  - SPEC-GIT-GITHUB-GUIDE-001
  - SPEC-GIT-GITHUB-IMPL-001
  - SPEC-GIT-GITHUB-IMPL-002
  - SPEC-GIT-GITHUB-IMPL-003
  - SPEC-GIT-GITHUB-IMPL-004
  - SPEC-GIT-GITHUB-IMPL-005
  - SPEC-GIT-GITHUB-IMPL-006
  - SPEC-GIT-GITHUB-IMPL-007
---

# SPEC — P8: GitHub 운영모델 심화 챕터(T23–T26) + 전역 학습트랙 내비 전파

> 본 SPEC은 정규 plan→run→sync 파이프라인 **밖에서 채팅으로 직접 구현**된 챕터 추가 작업을 사후(retroactive)에 기록한 것이다. 이력·추적성 확보가 목적이다.
> **Part A**(신규 T23–T26 챕터와 관련 내비·검색·사례·참조 갱신)는 **이미 완료**되었고, **Part B**(전역 헤더 "학습트랙" 드롭다운을 나머지 31개 페이지에 전파)는 **미착수** 상태다.
> 청중: 본 사이트를 유지·확장하는 개발자. 다음 세션이 Part B를 정확히 이어받을 수 있도록 완료/잔여 경계를 명시한다.

---

## 1. 목표 (Goal)

두 부분으로 구성된다.

**Part A (완료)**: 기존 22개 튜토리얼(T01–T22)만으로는 설명되지 않던 GitHub 운영모델의 개념 간극 5종을 메우는 **신규 챕터 "GitHub 운영모델 심화"(T23–T26)** 4페이지를 사이트 페이지 템플릿에 맞춰 추가하고, 페이저 체인·홈 검색 인덱스·사례 갤러리·참조(용어집/명령어 사전)와 홈 헤더 학습트랙 드롭다운을 그에 맞게 갱신한다.

**Part B (미착수)**: 홈(index.html)에만 반영된 **전체 T01–T26 학습트랙 드롭다운**을, 각 페이지가 독립적으로 하드코딩된 헤더를 가진 이 정적 사이트의 특성상 **나머지 31개 페이지(tutorial 26 + ref 4 + cases 1)에 동일하게 전파**한다. 본 Phase가 끝나면 사이트의 모든 페이지 헤더가 동일한 26항목 학습트랙 목록을 노출한다.

---

## 2. 배경 (Background)

### 2.1 동기 — GitOps 설계 문서를 설명하지 못한 기존 22페이지

본 저장소는 비개발자가 GitHub의 운영 모델을 이해하도록 돕는 사내 교육 사이트다. 별도의 설계 문서 `/Users/byunjungwon/Dev/my-project-03/rnd-gitops/Process-RnD-GitOps-Harness-설계-및-구현-가이드.md`(비개발자 R&D 팀을 위한 GitHub 기반 GitOps 프로세스 — 이슈를 작업 접수로, PR을 승인 게이트로, 병합을 공식 기록 커밋으로, Projects를 상태 보드로, AI 에이전트가 gh CLI로 GitHub를 운영)를 기존 22페이지(T01–T22)만으로는 충분히 설명할 수 없다는 점이 드러났다.

식별된 개념 간극 5종:

1. **GitHub Projects / 칸반 보드** — 상태 필드와 보드/테이블/로드맵 뷰 개념 부재.
2. **조직/팀 권한 모델** — org/team, 5단계 권한(read/triage/write/maintain/admin) 개념 부재.
3. **PR/Merge를 일반 결재 워크플로우로 재해석** — 코드 리뷰에 국한되지 않는 범용 승인 흐름으로서의 PR 개념 부재.
4. **gh CLI + 자동화 모델** — gh CLI의 목적, polling vs webhook/Actions(이벤트 구동) 자동화 모델 부재.
5. **"GitOps" 명칭 혼동** — 철학으로서의 GitOps(git 저장소를 선언적 진실 원천으로, 병합=승인)와 ArgoCD/Flux 같은 실제 동기화 도구를 혼동하는 문제.

Part A는 이 5종 간극을 4페이지(T23–T26)로 해소한다. 챕터 콘텐츠는 특정 실제 프로젝트를 지목하지 않는 **일반화된** 형태로 작성되었다.

### 2.2 파이프라인 밖 작업 + 사후 SPEC

Part A는 `/moai plan → run → sync` 정규 절차 없이 채팅에서 직접 구현·수동 QA되었다. 본 SPEC은 그 결과를 저장소의 SPEC 관습에 맞춰 **역으로 기록**하여, (a) 무엇이 이미 배포되었는지, (b) 무엇이 남았는지를 다음 세션이 명확히 이어받게 한다.

### 2.3 핵심 제약 — 공유 include/템플릿 메커니즘 부재

이 사이트의 각 HTML 페이지는 **자체적으로 하드코딩된 헤더 마크업**을 가진다(공유 include/템플릿 빌드 단계 없음). 따라서 헤더 "학습트랙" 드롭다운 같은 전역 내비 요소를 바꾸려면 **동일 수정을 페이지마다 반복**해야 한다. Part A에서 홈(index.html) 한 페이지만 전체 T01–T26 목록으로 갱신되었고, 나머지 페이지는 여전히 구(舊) 축약 목록을 노출한다 — 이것이 Part B의 존재 이유다.

---

## 3. Part A — 완료된 산출물 (Completed Deliverables) [DONE]

> 아래 항목은 이번 세션에 **이미 구현·검증 완료**되었다. 재구현 대상이 아니며(범위 외 4 참조), 맥락·이력 기록 목적으로만 나열한다. 완료 노트는 섹션 끝에 있다.

### 3.1 신규 챕터 "GitHub 운영모델 심화" (T23–T26) — [완료]

각 페이지는 사이트 기존 템플릿(header/breadcrumb/page-header/case-callout/metaphor-first tut-section/side-note/cheat-card/pager/sidebar-toc/footer)을 따르며, 한국어·비개발자 톤·일반화(특정 실제 프로젝트 미지목)를 준수한다.

| 페이지 | 파일 | 간극 | 핵심 내용 |
|---|---|---|---|
| T23 | `tutorial/github-projects.html` | 1 | GitHub Projects v2를 칸반 보드로: Status 필드, 커스텀 필드 타입, 보드/테이블/로드맵 뷰, 1이슈-다보드 관계 |
| T24 | `tutorial/github-org-teams.html` | 2 | Organizations/Teams, 5단계 권한(read/triage/write/maintain/admin), "write 권한이 브랜치 보호를 무력화하지 못한다"는 역설(T17 교차링크), CODEOWNERS × 팀 권한 상호작용 |
| T25 | `tutorial/github-approval-workflow.html` | 3 | PR/Merge를 범용 결재 워크플로우로 재해석(기안/검토/서명/시행/반려/철회 매핑), 비개발자용 산문·문서 diff 읽기 입문, "1 PR = 1 결재 단위" 원칙 |
| T26 | `tutorial/github-automation-model.html` | 4·5 | gh CLI 목적·예시 명령, polling vs 이벤트 구동(webhook/Actions), "GitOps=철학" vs 실제 GitOps 도구체인(ArgoCD/Flux) 구분 신화 정정, "저장소=신뢰/컨텍스트 경계" 프레이밍 |

### 3.2 페이저 체인 연결 — [완료]

T21(`tutorial/github-extras.html`) "다음" 링크를 참조 허브 대신 T23으로 변경. 이후 T23→T24→T25→T26→참조 허브(`ref/command-dictionary.html`)로 연결.

### 3.3 홈 검색 인덱스 갱신 — [완료]

`index.html`의 인라인 `search-index` JSON 스크립트 블록에 튜토리얼 4 + 사례 1 + 용어집 4 항목 추가(총 98개 엔트리, 파싱 정상).

### 3.4 사례 갤러리 카드 추가 — [완료]

`cases/index.html`에 신규 Tier 2(전문가/조직) 사례 카드 1건 추가: id `t2-13`, 일반화(특정 실제 프로젝트 미지목), `data-tier="2" data-domain="운영" data-features="Projects,권한,PR 결재,gh CLI"`, T24/T25/T26 교차링크. 페이지 노출 Tier 카운트 문구 갱신(총 26→27, Tier 2 12→13).

### 3.5 용어집 항목 추가 — [완료]

`ref/glossary.html`에 4개 항목 추가: GitHub Projects/Status 필드, 권한 레벨, gh CLI, GitOps(철학과 ArgoCD/Flux 계열 도구체인을 구분하는 명시 주석 포함).

### 3.6 명령어 사전 항목 추가 — [완료]

`ref/command-dictionary.html`에 `gh auth login`, `gh issue list`, `gh pr create` 항목 추가.

### 3.7 홈 헤더 학습트랙 드롭다운 전체화 (index.html 한정) — [완료]

`index.html`의 데스크톱 `gh-dropdown` 블록과 모바일 드로어 대응 블록의 기존 축약 4~5링크 부분집합을 **전체 T01–T26 목록(26링크, 올바른 상대 `tutorial/...` href, 순서 정확)**으로 교체. 헤드리스 브라우저로 26링크 존재·전부 해결·콘솔 오류 0 검증.

### 3.8 드롭다운 스크롤 처리 (공유 CSS, 전역) — [완료]

`css/layout.css`의 `.gh-dropdown` 규칙에 `max-height: 70vh; overflow-y: auto;` 추가(현재 layout.css 87~88행)하여 26항목 드롭다운이 뷰포트를 넘치지 않고 스크롤. 헤드리스 스크린샷으로 시각 검증(T01–T11 노출 후 스크롤). **이 규칙은 전역 스타일시트에 있으므로 모든 페이지에 자동 적용된다** — Part B에서 파일별 CSS 변경 불필요.

### 3.9 전체 수동 QA (헤드리스 브라우저) — [완료]

로컬 http.server + 헤드리스 브라우저로 전 항목 검증: 신규 4페이지 렌더링 정상·콘솔 오류 0(초기 스크린샷의 빈 화면은 사이트 기존 scroll-reveal IntersectionObserver 애니메이션 때문이며 실제 버그 아님 — 전체 텍스트 추출 및 스크롤 후 재촬영으로 확인), T21 페이저, 검색 인덱스(98엔트리 파싱), 사례 카드(`#t2-13` 존재·data 속성 정확), 용어집/명령어 사전 신규 항목, 홈 드롭다운(26링크·전부 `tutorial/` 접두사·스크롤) 모두 정상.

> **완료 노트**: 위 3.1–3.9는 본 SPEC 작성 시점(2026-07-06) 기준 배포 완료 상태다. 저장소 정적 파일에서 검증됨(T23–T26 파일 존재, index.html 26링크, layout.css 87–88행 오버플로 규칙). 이들은 EARS 재요구 대상이 아니라 이미 충족된 맥락으로 취급한다.

---

## 4. Part B — 남은 작업 (Remaining Work) [DONE, 2026-07-06 `/moai run` 실행으로 완료]

### 4.1 문제

Part A 3.7에서 홈(index.html) **단 하나의 페이지만** 전체 T01–T26 드롭다운으로 갱신되었다. 나머지 모든 페이지는 자체 헤더에 **구(舊) 축약 목록**(T01/T03/T06/T07/T16, 5링크만)을 여전히 하드코딩하고 있다(공유 include 부재, 섹션 2.3). 저장소 검증 결과 `tutorial/git-concept.html`은 이 구 목록을 그대로 노출한다.

### 4.2 대상 파일 (31개)

| 그룹 | 개수 | href 접두사 패턴 | 파일 |
|---|---|---|---|
| tutorial/ | 26 | 접두사 없는 파일명(예: `git-concept.html`) | T01–T26 전체(신규 T23–T26 4페이지 포함) |
| ref/ | 4 | `../tutorial/` | cheatsheet, command-dictionary, faq, glossary |
| cases/ | 1 | `../tutorial/` | index.html |

- 신규 T23–T26 페이지는 `github-extras.html` 템플릿에서 파생되어 **구 축약 5링크 드롭다운을 그대로 상속**했다. 이들도 대상에 포함된다.
- **CSS는 이미 전역**(3.8): `.gh-dropdown` 오버플로 규칙이 `css/layout.css`에 있어 모든 페이지에 적용된다. 파일별 CSS 변경은 없고, 공유 스타일시트 링크가 각 페이지에 존재하는지 확인만 하면 된다(현재 모든 페이지에 존재).

### 4.3 작업 내용

각 대상 파일의 헤더 학습트랙 드롭다운 블록을, index.html에 이미 구현된 **동일한 전체 T01–T26 목록 콘텐츠**로 교체하되, 해당 파일의 디렉토리 깊이에 맞는 href 접두사(tutorial/ 내부는 파일명, ref/·cases/는 `../tutorial/`)를 적용한다. 변경 후 tutorial/ref/cases 표본을 헤드리스 브라우저로 점검하여 broken link·콘솔 오류 0을 확인한다.

---

## 5. 수용 기준 (Acceptance Criteria, EARS) — Part B 전용

> 본 EARS는 **미착수 Part B**에만 적용된다. Part A는 섹션 3의 완료 노트로 대체되며 EARS 재요구 대상이 아니다.
> 키워드(UBIQUITOUS, WHEN, WHILE, IF, THEN, SHALL, SHALL NOT)는 영어로 유지. 본문은 한국어.

- **REQ-001 (전역 학습트랙 목록 완전성)**: UBIQUITOUS — 본 사이트의 모든 페이지 헤더의 "학습트랙" 드롭다운(`.gh-dropdown`)은 T01부터 T26까지 26개 튜토리얼 링크를 홈(index.html)에 이미 구현된 것과 **동일한 순서**로 나열 SHALL.

- **REQ-002 (디렉토리 깊이별 상대경로)**: UBIQUITOUS — 각 페이지의 학습트랙 드롭다운 링크 `href`는 해당 파일의 디렉토리 깊이에 맞는 접두사를 사용 SHALL: `tutorial/` 내부 페이지는 접두사 없는 파일명(예: `git-concept.html`), `ref/`·`cases/` 페이지는 `../tutorial/` 접두사.

- **REQ-003 (링크 무결성)**: WHEN 사용자가 임의 페이지의 학습트랙 드롭다운에서 T01~T26 링크를 선택하면, THEN 대상 튜토리얼 페이지로 broken link 없이 이동 SHALL.

- **REQ-004 (26항목 스크롤 처리)**: WHILE 학습트랙 드롭다운이 열려 있고 26개 항목이 뷰포트 높이를 초과하면, THEN 드롭다운은 `css/layout.css`의 공유 `.gh-dropdown { max-height: 70vh; overflow-y: auto; }` 규칙(이미 전역)에 의해 뷰포트를 넘치지 않고 내부 스크롤 SHALL. (파일별 CSS 변경 없이 공유 스타일시트 링크 존재만 확인.)

- **REQ-005 (신규 T23–T26 포함)**: UBIQUITOUS — 본 요구사항의 대상 집합에는 이번 세션에 추가된 T23~T26 4개 페이지가 포함 SHALL. 이들은 `github-extras.html` 템플릿에서 파생되어 구(舊) 축약 5링크 드롭다운(T01/T03/T06/T07/T16)을 상속했으므로 동일하게 전체 T01~T26 목록으로 교체 SHALL.

- **REQ-006 (대상 파일 완전성 — 31개)**: UBIQUITOUS — 본 요구사항은 홈(index.html, 이미 완료)을 제외한 31개 파일 전체에 빠짐없이 적용 SHALL: `tutorial/` 26개 + `ref/` 4개(cheatsheet, command-dictionary, faq, glossary) + `cases/index.html` 1개.

- **REQ-007 (콘텐츠 동일성 — 표류 금지)**: IF 어떤 페이지의 드롭다운 목록이 index.html 기준 목록과 항목·순서에서 달라지면(접두사 차이 제외), THEN 그 페이지는 미완료로 간주 SHALL. 각 페이지의 드롭다운은 접두사만 다르고 항목·순서는 index.html과 동일 SHALL.

- **REQ-008 (사후 헤드리스 검증)**: WHEN Part B 변경이 완료되면, THEN tutorial/ref/cases 페이지 표본을 헤드리스 브라우저로 점검하여 broken link 0건 및 콘솔 오류 0건을 확인 SHALL.

---

## 6. 범위 외 / 알려진 이슈 (Out of Scope / Known Issues)

- **Part A 재구현**: 섹션 3의 T23–T26 챕터 및 관련 갱신은 이미 완료되었다. Part B는 이를 **다시 구현하지 SHALL NOT**. index.html의 드롭다운·CSS도 재작업 대상이 아니다.
- **비홈 페이지의 모바일 드로어 부재(선재 결함, 범위 외)**: index.html을 제외한 페이지들은 **작동하는 모바일 드로어 요소가 아예 없다** — 햄버거 버튼이 `aria-controls="mobile-drawer"`를 참조하지만 대응하는 드로어 div가 페이지에 존재하지 않는다. 이는 본 SPEC 이전부터 있던 사이트 선재 한계이며 **본 SPEC 범위 밖**이다(사용자가 별도로 요청하지 않는 한 수정하지 않는다). Part B는 데스크톱 `.gh-dropdown` 목록 전파에 한정한다.
- **파일별 CSS 변경**: `.gh-dropdown` 오버플로 규칙은 `css/layout.css`에 이미 전역으로 존재한다(3.8). Part B는 새 CSS를 추가하지 SHALL NOT — 공유 스타일시트 링크 존재 확인만 수행한다.
- **T01–T26 본문 콘텐츠 수정**: Part B는 헤더 드롭다운만 다룬다. 튜토리얼 본문·side-note·페이저·사이드바 TOC는 변경 대상이 아니다.
- **공유 include/템플릿 도입**: 사이트에 공유 헤더 include 메커니즘을 신설하는 리팩터는 본 SPEC 범위 밖이다(선재 아키텍처 유지, 페이지별 하드코딩 전제).
- **백엔드/SEO 심화**: 본 사이트는 정적 멀티페이지(서버 없음). 해당 없음.
- **tmux 자매 사이트 수정**: 원본 무결성 유지. 대상 아님.

---

## 7. 의존성 (Dependencies)

- **SPEC-GIT-GITHUB-IMPL-001 (P1)**: 공유 셸·`.gh-dropdown` 헤더 컴포넌트·`css/layout.css`·tmux 변수명 관습. Part A/B 모두 이 셸 위에서 동작한다.
- **SPEC-GIT-GITHUB-IMPL-002 (P2)**: 홈(index.html)·검색 인덱스. Part A 3.3이 검색 인덱스를 확장한다.
- **SPEC-GIT-GITHUB-IMPL-003 (P3)**: 튜토리얼 페이지 템플릿(T23–T26의 원형)과 페이저 체인. Part A 3.1/3.2가 이를 확장한다.
- **SPEC-GIT-GITHUB-IMPL-004 (P4)**: 참조 페이지(용어집·명령어 사전). Part A 3.5/3.6이 이를 확장한다.
- **SPEC-GIT-GITHUB-IMPL-005 (P5)**: 사례 갤러리. Part A 3.4가 카드를 추가한다.
- **SPEC-GIT-GITHUB-IMPL-007 (P7)**: 링크 무결성 QA 프레임워크(REQ-005). Part B 완료 후 P7 링크 크롤러로 재검증하면 회귀 감지에 유용하다.
- **SPEC-GIT-GITHUB-GUIDE-001**: 사이트 기획 산출물군(디자인·IA). T23–T26은 기존 페이지 템플릿·IA 관습을 상속한다.
- **입력(외부 참조)**: `/Users/byunjungwon/Dev/my-project-03/rnd-gitops/Process-RnD-GitOps-Harness-설계-및-구현-가이드.md` — Part A 챕터 주제의 동기. 사이트에는 일반화하여 반영(원문 미지목).

---

## 8. 리스크 (Risks)

| 리스크 | 영향 | 완화 |
|---|---|---|
| 31개 파일 반복 수정 중 일부 누락 | 일부 페이지가 여전히 구 목록 노출(REQ-006 부분 실패) | progress.md 체크리스트에 31개 파일을 그룹으로 추적. 완료 후 `.gh-dropdown` 내 링크 개수(=26)를 전 파일 대상으로 grep 검증. |
| 디렉토리 깊이별 접두사 혼동 | ref/·cases/에서 `../tutorial/` 누락 시 broken link(REQ-002/003 실패) | 그룹별 접두사 규칙을 progress.md에 명시. tutorial/=파일명, ref/·cases/=`../tutorial/`. 헤드리스 표본 점검으로 확인. |
| 신규 T23–T26가 구 목록 상속 사실 간과 | 신규 페이지만 구 목록 잔존 | REQ-005로 T23–T26을 대상에 명시적으로 포함. tutorial/ 26개 = T01–T26 전체임을 강조. |
| 모바일 드로어 선재 부재를 Part B로 착각 | 범위 확대(scope creep) | 섹션 6에 선재 결함·범위 밖으로 명시. Part B는 데스크톱 `.gh-dropdown`에 한정. |
| 항목 텍스트·순서 표류(수동 반복 편집) | 페이지 간 목록 불일치(REQ-007 실패) | index.html 드롭다운을 단일 기준(source of truth)으로 삼아 복사. 접두사만 파일별로 조정. |

---

## 9. 관련 산출물 (Related)

- **선행 구현 SPEC**: IMPL-001(P1 셸·헤더 컴포넌트·layout.css), IMPL-002(P2 홈·검색), IMPL-003(P3 튜토리얼·페이저), IMPL-004(P4 참조), IMPL-005(P5 사례 갤러리), IMPL-006(P6 인터랙티브 자산), IMPL-007(P7 최종 QA·링크 무결성 프레임워크).
- **기획 산출물(GUIDE-001)**: 사이트 IA·디자인·콘텐츠 계획. T23–T26이 상속하는 페이지 템플릿·내비 관습의 원천.
- **본 SPEC 산출물**: `spec.md`(본 문서), `progress.md`(Part A/B 완료 상태 체크리스트).
- **외부 입력 문서**: `Process-RnD-GitOps-Harness-설계-및-구현-가이드.md`(Part A 주제 동기, 일반화 반영).

---

## HISTORY

- 2026-07-06: 최초 작성(사후 기록). 정규 파이프라인 밖에서 채팅으로 직접 구현된 챕터 추가 작업을 저장소 SPEC 관습에 맞춰 역기록. Part A(신규 챕터 T23–T26 "GitHub 운영모델 심화" + 페이저·검색 인덱스·사례 카드·용어집·명령어 사전·홈 드롭다운·layout.css 오버플로·전체 헤드리스 QA)를 완료 산출물(섹션 3, [DONE])로 기록하고 완료 노트로 EARS 재요구 대상에서 제외. Part B(전역 학습트랙 드롭다운을 나머지 31개 페이지에 전파)를 미착수 잔여 작업(섹션 4, [PLANNED])으로 정의하고 EARS 수용 기준 8건(REQ-001~REQ-008)으로 정식화. 비홈 페이지의 모바일 드로어 부재를 선재 결함·범위 밖으로 명시(섹션 6). status: In Progress(저장소 vocabulary는 Implemented/Planned 이분법이나 혼합 완료 상태 표현을 위해 MoAI 표준 status "In Progress" 채택). 완료/잔여 상태는 progress.md 체크리스트로 추적.
- 2026-07-06: `/moai run SPEC-GIT-GITHUB-IMPL-008` 실행. Part B(REQ-001~008) 구현 완료 — expert-refactoring 서브에이전트 2개(tutorial 26개 파일 / ref+cases 5개 파일, 파일셋 비중첩으로 병렬 실행)를 통해 각 페이지의 학습트랙 드롭다운을 index.html 기준 T01–T26 26링크 목록으로 교체, 디렉토리 깊이별 href 접두사(tutorial/ 내부는 파일명, ref/·cases/는 `../tutorial/`) 적용. 검증: (1) 31개 파일 전수 정적 스캔 — 링크 수 26·접두사 규칙 위반 0건, (2) 헤드리스 브라우저 7개 표본 페이지 — 콘솔 오류 0건, (3) `ref/glossary.html`·`tutorial/github-extras.html` 두 페이지에서 52개 링크 전수 HTTP 요청 — 200 응답, broken link 0건. status: Implemented, version: 1.1.0.

# git-github 가이드 업그레이드 — "GitHub 운영모델 심화" 챕터 신설

## Context

`/Users/byunjungwon/Dev/my-project-03/rnd-gitops/Process-RnD-GitOps-Harness-설계-및-구현-가이드.md`는 비개발자 R&D 팀을 대상으로 GitHub 기반 GitOps 운영 체계(이슈=업무접수, PR=결재, merge=공식기록 승인, Projects=진행보드, AI가 gh CLI로 GitHub을 조작)를 설계한 문서다. 이 문서를 팀에 설명하려면 독자가 GitHub의 "운영 모델"을 알아야 하는데, 현재 `cli-guide/git-github` 사이트(T01~T22, 22개 튜토리얼 페이지)는 브랜치·PR·리뷰·Actions·보안·워크플로우 모델까지는 다루지만, 다음 5가지 핵심 개념이 공백이거나 지나치게 얕다:

1. **GitHub Projects(칸반보드)** — 현재 한 줄 언급뿐. GitOps 문서의 진행상태 관리(Status 필드, 뷰)의 근간인데 전혀 설명 안 됨.
2. **조직·팀·권한 모델** — 한 문단뿐. "쓰기 권한은 있지만 branch protection으로 main 직접 반영은 막힌다"는 역설, permission level 개념이 얕음.
3. **PR/Merge의 "결재" 재해석** — 현재 가이드는 PR/Merge를 코드 리뷰 관점으로만 설명. GitOps 문서는 이를 "임의의 업무 산출물에 대한 결재/승인 게이트"로 재정의하는데, 이 프레이밍이 문서 전체의 핵심 축이라 반드시 다뤄야 함.
4. **gh CLI / AI가 GitHub을 조작하는 방식, 폴링 vs 웹훅·Actions** — 전혀 다뤄지지 않음. AI 하네스가 GitHub과 어떻게 상호작용하는지 이해에 필수.
5. **"GitOps"라는 이름의 용어 오해 방지** — 문서의 GitOps는 ArgoCD/Flux 같은 실제 배포 동기화 툴이 아니라 "선언적 저장소 = 진실"이라는 철학만 차용한 것. 이 구분이 없으면 독자가 엉뚱한 걸 찾아보게 됨.

사용자 확인 사항: (1) 기존 페이지를 고치지 않고 **신규 챕터를 추가**, (2) RnD 프로젝트의 구체적 세부사항(이슈 템플릿 7종, 브랜치 명명 규칙 등)은 인용하지 않고 **일반화**해서 설명, (3) 위 5개 핵심 공백에만 집중(PAT/bot 계정, 환경·시크릿 심화 등은 이번 범위 밖).

## Approach

새 챕터 **"GitHub 운영모델 심화"**를 T21(github-extras) 뒤, T22(git-worktree, 별도 분기 보너스 페이지)와는 독립적으로 **T23~T26** 4개 페이지로 신설한다. 기존 페이지 템플릿(`github-extras.html`을 레퍼런스로 확인 완료)을 그대로 따른다: global-header → breadcrumb → page-header(eyebrow/title/subhead) → 사례 콜아웃 → 비유 박스 선행 → `tut-section` 여러 개 → side-note(tip/warning/history/extra) → cheat-card 요약 → prev/next pager → sidebar TOC → global-footer. CSS/JS include는 5개 CSS(tokens→base→layout→components→pages) + 4개 JS(nav→progress→reveal→search) 순서 동일.

### 신규 페이지 4개

**T23 `tutorial/github-projects.html` — "칸반보드로 일의 흐름 보기" (GitHub Projects v2)**
- 비유: "회의실 화이트보드"
- Status 필드(커스텀 single-select), 기본 뷰(보드/테이블/로드맵), Priority/Due/Owner 같은 커스텀 필드 타입
- Issue/PR과 Projects의 관계(같은 이슈가 여러 보드에 걸릴 수 있음)
- 치트카드: 필드 타입 요약

**T24 `tutorial/github-org-teams.html` — "조직과 팀, 권한이 흐르는 방식"**
- 비유: "회사 건물의 출입카드 등급"
- Organization vs 개인 계정, Teams로 사람 묶기
- Permission level 5단계(read/triage/write/maintain/admin)를 표로 비교
- **핵심 역설 강조**: "write 권한이 있어도 branch protection이 main 직접 반영을 막는다" — 기존 T17의 branch protection 설명과 교차 링크하되, "권한 ≠ 이력 변경 권한"이라는 프레임을 명시적으로 다룸
- CODEOWNERS와 팀 권한의 관계(경로별 필수 리뷰어 자동 지정)

**T25 `tutorial/github-approval-workflow.html` — "PR과 Merge, 코드 너머의 결재"**
- 비유: "결재 문서함" — PR 올리기=기안 상신, 리뷰=검토의견, Approve=결재 서명, Merge=공식 승인/시행, Close=반려, Revert=승인 철회(철회도 이력으로 남음)
- 핵심 메시지: PR/Merge는 "코드 변경 검토" 전용 장치가 아니라 "diff로 비교 가능한 모든 파일(문서, 설정, 데이터, 보고서)에 대한 승인 워크플로우"라는 일반화
- Diff 읽는 법(비개발자가 코드가 아닌 문서 diff를 볼 때 필요한 최소한의 개념)
- "1 PR = 1 승인 단위" 같은 운영 원칙이 왜 리뷰 부담을 줄이는지

**T26 `tutorial/github-automation-model.html` — "로봇이 GitHub과 대화하는 법"**
- 비유: "우편함을 주기적으로 확인하는 집배원(폴링) vs 초인종이 울리면 나가는 것(웹훅/Actions)"
- gh CLI 개념(API를 직접 호출하지 않고 CLI로 GitHub과 상호작용하는 이유) — T18 github-actions.html의 `gh` 언급과 자연스럽게 연결
- 폴링 모델과 웹훅/Actions 자동화의 차이, 각각 언제 적합한지
- **"GitOps"라는 이름 바로잡기**: 선언적 저장소(= 진실의 원천) 철학과, ArgoCD/Flux 같은 실제 배포 동기화 툴을 혼동하지 않도록 명확히 구분하는 섹션
- Repository를 "신뢰·컨텍스트 경계"로 보는 사고방식(1 repo = 1 프로젝트 메모리)

각 페이지는 "이렇게도 써요" 콜아웃에서 RnD 프로젝트를 직접 지칭하지 않고 일반화된 사례(연구·행정·운영팀이 GitHub을 업무 프로세스에 활용)로 연결한다.

## 파일별 변경 사항

| 파일 | 변경 |
|---|---|
| `git-github/tutorial/github-projects.html` (신규) | T23 페이지 전체 작성 |
| `git-github/tutorial/github-org-teams.html` (신규) | T24 페이지 전체 작성 |
| `git-github/tutorial/github-approval-workflow.html` (신규) | T25 페이지 전체 작성 |
| `git-github/tutorial/github-automation-model.html` (신규) | T26 페이지 전체 작성 |
| `git-github/tutorial/github-extras.html` | T21 pager의 "다음" 링크를 참조허브 → T23으로 변경 |
| `git-github/index.html` | `search-index` JSON에 t23~t26 4개 항목 추가; 필요시 히어로 아래 학습트랙 드롭다운에 대표 링크 1개 추가 |
| `git-github/cases/index.html` | Tier 2(전문가)에 일반화된 사례 카드 1개 추가 — "연구·프로젝트 운영팀: Issue를 접수창구로, PR을 결재 게이트로" — T24/T25/T26로 교차링크 |
| `git-github/ref/glossary.html` | 신규 용어 추가: Projects(v2)/Status 필드, permission level, gh CLI, GitOps(철학 vs 툴 구분 주석) |
| `git-github/ref/command-dictionary.html` | `gh issue list`, `gh pr create`, `gh auth login` 등 최소 항목 추가 (선택) |

각 신규 페이지의 prev/next pager는 T23→T24→T25→T26 순서로 체이닝하고, T26의 "다음"은 기존처럼 참조 허브(`ref/command-dictionary.html`)로 연결한다.

## 실행 방식

5개 이상 파일 신규 생성 + 콘텐츠 성격상 CLAUDE.md 위임 규칙에 따라 `expert-frontend` 서브에이전트에 위임한다(정적 HTML 사이트의 신규 페이지 4개 + 사이트 통합 변경). 위임 시 다음을 프롬프트에 명시:
- 기존 `github-extras.html`을 구조 템플릿으로 그대로 따를 것 (헤더/푸터/CSS·JS 순서/사이드바 TOC/치트카드 패턴 재사용)
- "비유 먼저, 단어 나중"이라는 사이트 톤 유지, 비개발자 대상 눈높이
- RnD 프로젝트 구체 내용은 인용하지 않고 일반화
- 완료 후 `index.html`의 search-index, `cases/index.html`, `ref/glossary.html` 갱신까지 포함

## 검증

- 새로 만든 4개 HTML 파일을 브라우저로 열어 헤더/네비/사이드바 TOC/prev-next pager가 깨지지 않는지 육안 확인
- `git-github/index.html`을 열어 검색창에서 "칸반", "결재", "gh cli", "GitOps" 등을 입력했을 때 새 페이지가 검색 결과에 뜨는지 확인
- T21→T23→T24→T25→T26→참조허브 순서로 prev/next 페이저를 클릭해 전체 체인이 끊기지 않는지 확인
- `cases/index.html`에서 새 사례 카드의 필터/교차링크가 정상 동작하는지 확인

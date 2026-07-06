# Progress — SPEC-GIT-GITHUB-IMPL-008 (P8: 운영모델 심화 챕터 T23–T26 + 전역 학습트랙 내비 전파)

**SPEC**: SPEC-GIT-GITHUB-IMPL-008 v1.0.0
**Phase**: Part A 완료 / Part B 완료
**Status**: Implemented
**Methodology**: 정적 HTML/CSS/JS 편집 + 헤드리스 브라우저 수동 QA (빌드 단계 없음)
**Date**: 2026-07-06

---

## 완료 상태 요약

| 부분 | 범위 | 상태 |
|---|---|---|
| **Part A** | 신규 챕터 T23–T26 + 관련 내비·검색·사례·참조·홈 드롭다운·CSS·전체 QA | **Done** |
| **Part B** | 전역 학습트랙 드롭다운을 나머지 31개 페이지에 전파 | **Done** |

---

## Part A — 완료 체크리스트 [DONE]

> 정규 plan→run→sync 없이 채팅에서 직접 구현·검증 완료. 아래는 사후 기록.

| # | 산출물 | 파일 | 상태 |
|---|---|---|---|
| A1 | T23 GitHub Projects(칸반·Status 필드·뷰·1이슈-다보드) | `tutorial/github-projects.html` | Done |
| A2 | T24 Org/Teams·5단계 권한·branch-protection 역설(T17)·CODEOWNERS×팀 | `tutorial/github-org-teams.html` | Done |
| A3 | T25 PR/Merge=범용 결재(기안/검토/서명/시행/반려/철회)·문서 diff 입문·1 PR=1 결재 | `tutorial/github-approval-workflow.html` | Done |
| A4 | T26 gh CLI·polling vs webhook/Actions·GitOps 철학 vs ArgoCD/Flux 신화 정정·저장소=신뢰 경계 | `tutorial/github-automation-model.html` | Done |
| A5 | 페이저 체인: T21→T23→T24→T25→T26→참조 허브 | `tutorial/github-extras.html` 외 | Done |
| A6 | 홈 검색 인덱스: 튜토리얼 4+사례 1+용어집 4 추가(총 98엔트리, 파싱 정상) | `index.html` search-index | Done |
| A7 | 사례 카드 `#t2-13`(Tier 2, 일반화, data 속성, T24/T25/T26 링크) + 카운트 문구 26→27·Tier2 12→13 | `cases/index.html` | Done |
| A8 | 용어집 4항목(Projects/Status, 권한 레벨, gh CLI, GitOps+ArgoCD/Flux 구분 주석) | `ref/glossary.html` | Done |
| A9 | 명령어 사전: `gh auth login`·`gh issue list`·`gh pr create` | `ref/command-dictionary.html` | Done |
| A10 | 홈 헤더 학습트랙 드롭다운(데스크톱+모바일 드로어) 전체 T01–T26 26링크로 교체 | `index.html` | Done |
| A11 | `.gh-dropdown` 오버플로 스크롤(`max-height:70vh; overflow-y:auto`) — 전역 | `css/layout.css` (87–88행) | Done |
| A12 | 전체 헤드리스 QA: 4신규 페이지·페이저·검색·사례·용어집·명령어·홈 드롭다운 모두 콘솔 오류 0 | 전 페이지 | Done |

**완료 노트**: 저장소 정적 파일에서 검증됨 — T23–T26 파일 4개 존재, index.html 26링크, layout.css 87–88행 오버플로 규칙. Part A는 재구현 대상 아님(spec.md 섹션 6).

---

## Part B — 잔여 작업 체크리스트 [DONE]

> 2026-07-06 `/moai run SPEC-GIT-GITHUB-IMPL-008` 실행으로 완료. 홈(index.html) 전체 T01–T26 드롭다운을 나머지 31개 페이지에 전파.
> 각 페이지 헤더는 독립 하드코딩(공유 include 부재)이라 파일마다 동일 수정을 expert-refactoring 서브에이전트 2개(병렬, 파일셋 비중첩)로 반복 적용.

### 대상 파일 그룹 (31개)

| 그룹 | 개수 | href 접두사 | 상태 |
|---|---|---|---|
| B1. `tutorial/` 튜토리얼(T01–T26, 신규 T23–T26 포함) | 26 | 접두사 없음(파일명, 예: `git-concept.html`) | Done |
| B2. `ref/`(cheatsheet, command-dictionary, faq, glossary) | 4 | `../tutorial/` | Done |
| B3. `cases/index.html` | 1 | `../tutorial/` | Done |
| B4. 사후 헤드리스 표본 검증(broken link 0 · 콘솔 오류 0) | — | — | Done |

### 검증 결과 (2026-07-06)

- **정적 검증**: 31개 파일 전수 스캔 — 학습트랙 드롭다운 링크 수 = 26 (전 파일), href 접두사 규칙(`tutorial/`은 파일명만, `ref/`·`cases/`는 `../tutorial/`) 100% 준수. 위반 0건.
- **헤드리스 브라우저 표본 점검**: `tutorial/git-concept.html`, `tutorial/git-worktree.html`, `tutorial/github-projects.html`, `tutorial/github-automation-model.html`, `ref/glossary.html`, `ref/faq.html`, `cases/index.html` 7개 페이지 — 콘솔 오류 0건.
- **링크 무결성(REQ-003)**: `ref/glossary.html`과 `tutorial/github-extras.html`에서 각각 26개 드롭다운 링크를 전수 HTTP 요청 — 200 응답 26/26, broken link 0건.

### 작업 규칙

- 콘텐츠 기준(single source of truth): `index.html`의 데스크톱 `.gh-dropdown` 목록. 항목·순서 그대로 복사, **접두사만** 파일별로 조정.
- CSS: 변경 없음. `.gh-dropdown` 오버플로는 `css/layout.css`에 이미 전역(A11). 각 페이지에 공유 스타일시트 링크 존재만 확인(현재 전 페이지 존재).
- 검증: 완료 후 전 파일 `.gh-dropdown` 내 링크 개수 = 26 grep 확인 + tutorial/ref/cases 표본 헤드리스 점검.

### 수용 기준 매핑 (spec.md 섹션 5)

| REQ | 요지 | 대응 체크 |
|---|---|---|
| REQ-001 | 모든 페이지 드롭다운 = T01–T26 동일 순서 | B1·B2·B3 |
| REQ-002 | 디렉토리 깊이별 접두사 | B1(파일명)·B2·B3(`../tutorial/`) |
| REQ-003 | 링크 무결성(broken 0) | B4 |
| REQ-004 | 26항목 스크롤(전역 CSS) | A11 재확인(파일별 변경 없음) |
| REQ-005 | 신규 T23–T26도 전체 목록으로 교체 | B1(26 안에 포함) |
| REQ-006 | 31개 파일 전체 적용 | B1+B2+B3 |
| REQ-007 | index.html 기준과 항목·순서 동일 | 전 그룹 |
| REQ-008 | 사후 헤드리스 검증 | B4 |

---

## 범위 밖 확인 (착수 시 주의)

- **비홈 페이지 모바일 드로어 부재**: 햄버거가 `aria-controls="mobile-drawer"`를 참조하나 대응 div 없음. **선재 결함·범위 밖**(spec.md 섹션 6). Part B는 데스크톱 `.gh-dropdown` 목록 전파에 한정. 사용자 별도 요청 없으면 손대지 않음.
- 공유 include/템플릿 신설 리팩터: 범위 밖(페이지별 하드코딩 전제 유지).

---

## HISTORY

- 2026-07-06: 최초 작성(사후 기록). Part A(A1–A12) 전 항목 Done으로 기록 — 정규 파이프라인 밖 채팅 직접 구현·헤드리스 QA 완료. Part B(B1–B4) Planned로 정의 — 전역 학습트랙 드롭다운 31개 파일 전파, REQ-001~008 매핑. status: In Progress.
- 2026-07-06: `/moai run SPEC-GIT-GITHUB-IMPL-008` 실행. Part B(B1–B4) 전 항목 Done — expert-refactoring 서브에이전트 2개(tutorial 26개 / ref+cases 5개, 파일셋 비중첩 병렬 실행)로 학습트랙 드롭다운을 index.html 기준 T01–T26 26링크로 전파. 정적 스캔(31개 파일 링크 수·접두사 규칙 100% 준수) + 헤드리스 브라우저 7개 표본(콘솔 오류 0) + 링크 무결성 전수 점검(52개 링크 요청, broken 0)으로 REQ-001~008 전부 충족 확인. status: Implemented.

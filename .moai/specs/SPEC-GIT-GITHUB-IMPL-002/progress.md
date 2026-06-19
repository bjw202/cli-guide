---
spec: SPEC-GIT-GITHUB-IMPL-002
phase: Run+Sync
status: Implemented
started: 2026-06-19
completed: 2026-06-19
author: jw
---

# 진행 기록 — SPEC-GIT-GITHUB-IMPL-002 (P2 홈 허브 + 검색)

## Run 단계

- 위임: `expert-frontend` (3개 파일 = index.html 수정 + js/search.js 신규 + components.css 수정)
- 선행: IMPL-001(P1 공유 셸) 완료 상태에서 본문만 채우는 구조.
- 검색 인덱스 데이터: content-plan.md(27페이지 제목) + cases-gallery.md(26사례) + 명령어/용어 카탈로그에서 추출, 88항목 직렬화.
- 독립 검증 중 WCAG 결함 2건 발견·수정 (아래 "검증 중 수정" 참조).

## 산출물 (3개 파일)

| 파일 | 변경 | 내용 |
|---|---|---|
| `git-github/index.html` | 수정 (9.3KB → 35.5KB) | P1 placeholder → 홈 허브 본문(HeroBlock/ThreeDoors/CasePreview/SeriesLink) + SearchOverlay DOM + 88항목 인라인 검색 인덱스 + 헤더 검색 버튼 |
| `git-github/js/search.js` | 신규 (16.6KB) | 클라이언트 검색: 인라인 JSON 로드, 단순 문자열 매칭, 4탭 필터, 키보드 탐색, aria-live, Ctrl+K/Cmd+K/`/` 단축키, reduced-motion |
| `git-github/css/components.css` | 수정 (5.5KB → 15.5KB) | 헤더 검색 버튼 + 홈 허브 본문 스타일 + SearchOverlay 블록 + reduced-motion 미디어쿼리 |

P1 산출물(tokens/base/layout/pages.css, nav/progress/reveal.js)은 미변경 계승. search.js는 4번째 JS로 reveal.js 뒤에 추가.

## 검증 중 수정 (WCAG AA — REQ-011)

독립 검증에서 발견한 대비 결함 2건, components.css에서 수정:

1. **활성 검색 탭**: `accent #3D5AFE` on `accent-soft #E2E8FB` = 4.20:1 (AA 4.5 미달) → `background:var(--accent); color:#fff` (5.13:1 PASS) 로 변경.
2. **SeriesLink "현재 사이트" 카드**: accent-soft 배경 위 tag(accent 4.20)·desc(text-secondary 3.86) 미달 → 둘 다 `var(--text-primary)` 로 오버라이드 (11.67:1 PASS).

> CommandPill(accent on accent-soft = 4.20)은 P1 산출물이자 튜토리얼 페이지(P3)에서만 렌더링 — P2 홈 허브 범위 밖. P3(IMPL-003) 또는 P7(IMPL-007 접근성 감사)에서 처리 권장.

## 수용기준 검증 (독립, Run 게이트)

| REQ | 항목 | 검증 | 결과 |
|---|---|---|---|
| REQ-001 | P1 셸 5 CSS + 3 JS 순서 유지 + search.js 4번째 | link/script 순서 grep | PASS — tokens→base→layout→components→pages / nav→progress→reveal→search |
| REQ-002 | ThreeDoors 3 링크 | href grep | PASS — tutorial/git-concept.html / ref/command-dictionary.html / cases/index.html |
| REQ-003 | "merge" 검색 결과 | 인덱스 에뮬 매칭 | PASS — t07·git-merge·git-merge-no-ff·merge-glossary·t1-08·t08·t2-05 (필수 4개 t07/git-merge/merge-glossary/t1-08 포함) |
| REQ-004 | 27페이지 전체 커버 | 고유 URL 수 | PASS — 27 고유 페이지 URL (home1+tut21+ref4+cases1) |
| REQ-005 | 키보드 ↑/↓/Enter/Esc | search.js keydown | PASS |
| REQ-006 | aria-live 결과 개수 | #search-status aria-live="polite" | PASS |
| REQ-007 | Ctrl+K/Cmd+K/`/` 단축키 | keydown ctrlKey/metaKey + 'k'/'K' + '/' | PASS |
| REQ-008 | SeriesLink tmux+현재 | ../tmux/index.html + 현재 카드 | PASS |
| REQ-009 | file:// 동작, fetch 금지, 인라인 JSON | fetch 호출 0회 + `<script type="application/json" id="search-index">` | PASS |
| REQ-010 | reduced-motion 즉시 표시 | matchMedia + @media CSS | PASS |
| REQ-011 | WCAG AA 대비 | node 대비 계산 (수정 후) | PASS — 본문 14.28·활성탭 5.13·현재카드 11.67·case-more 5.13 (전부 4.5+). CommandPill은 P2 범위外 |
| REQ-012 | tmux 원본 무결성 | mtime 확인 | PASS — style.css/main.js/index.html 14:13~14:14 유지 |

검색 인덱스: 88항목 (home1+tutorial21+reference4+case27[페이지1+사례26]+command20+glossary15). JSON 유효. search.js `node --check` OK.

## Sync 단계

- git 저장소 아님 → PR/커밋 생략.
- 본 progress.md로 진행 기록 확보.
- spec.md status Planned → Implemented 갱신.

## 알려진 제한 (P2 범위 외, 의도적)

- 튜토리얼/참조/사례 페이지 본문 미존재 → ThreeDoors/CasePreview 링크는 P3~P5에서 실제 페이지 생성 시 유효. 인덱스 title/summary는 content-plan 방향 기준 placeholder (IMPL-003~005 정제 예정).
- 최종 일러스트(HeroBlock commit-나무, 문 카드 아이콘)는 자리표시자. 최종 아트는 해당 Phase.
- CommandPill 대비(4.20) — P3/P7 처리 권장 (위 참조).

## 후속 Phase 의존

- P3 (IMPL-003): 튜토리얼 21페이지 본문 → 인덱스 title/summary 정제 + CommandPill 대비 수정.
- P4 (IMPL-004): 참조 4페이지 → command/glossary 인덱스 앵커 실제화.
- P5 (IMPL-005): 사례 갤러리 → case 인덱스 앵커 실제화.

## HISTORY

- 2026-06-19: Run+Sync 완료. 12개 EARS 수용기준 전부 독립 검증 통과. WCAG 결함 2건 검증 중 발견·수정. 검색 인덱스 88항목 인라인 임베드(file:// CORS 회피).

## 사후 발견 — 인덱스 드리프트 (2026-06-19, P3 완료 후 검증)

**현상**: 튜토리얼(IMPL-003)은 32개 고유 git 명령을 가르치나, 본 인덱스는 command 타입 20개만 등록. 12개 누락: `git-diff, git-worktree, git-blame, git-show, git-bisect, git-clean, git-config, git-filter-repo, git-reflog, git-restore, git-submodule, git-switch`.

**근본 원인**: REQ-004는 "27페이지 분량"만 강제 → 인덱스가 커버리지 체크리스트에 미바인딩. inline 수동 큐레이션(REQ-009 file:// 제약)이 구조적 드리프트 유발.

**조치**:
- ✅ **SPEC 수정 (구조적)**: REQ-013(인덱스 무결성 — 체크리스트 바인딩) 추가. spec.md v1.0.2 → 1.0.3. sync 게이트에서 "체크리스트/튜토리얼 명령어 집합 \ 인덱스 항목 집합" 차집합 = 0 강제. 회귀 방지 binding.
- ⏸️ **12개 누락 명령 채우기 (P4로 위임)**: P4(IMPL-004)가 R01 명령어 사전 생성 시 인덱스 command 항목을 R01 앵커로 정위하며 12개를 함께 채움 → 인덱스·R01·체크리스트 3개 정렬. sync 검증 스크립트도 P4에서 추가.

**영향 범위**: 커버리지(REQ-001 계층1)·튜토리얼 본문(계층2)은 정상. 계층3(파생 인덱스)만 결손이며 독자 검색 체험에만 영향.

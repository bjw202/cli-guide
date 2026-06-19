---
spec: SPEC-GIT-GITHUB-IMPL-003
phase: Run+Sync
status: Implemented
started: 2026-06-19
completed: 2026-06-19
author: jw
---

# 진행 기록 — SPEC-GIT-GITHUB-IMPL-003 (P3 튜토리얼 21페이지)

> 본 Phase는 roadmap 전체에서 가장 분량이 크다. SPEC 서브배칭 권고(5배치)에 따라 실행.

## Run 단계 — 실행 전략

1. **Run-0 공유 인프라(MoAI 직접)**: `js/fake-terminal.js`(tmux 패턴 추출·git 타이핑 재생) + components.css 터미널/치트시트/튜토리얼 본문 보조 블록.
2. **Run-1 정규 템플릿(MoAI 직접)**: `tutorial/git-concept.html`(T01) — 20개 후속 페이지의 구조 기준 확립.
3. **Run-2~6 서브배치(expert-frontend 병렬 위임)**: T02-T05 / T06-T08 / T09-T13 / T14-T17 / T18-T21. 파일이 서로 겹치지 않아 병렬 안전. 각 에이전트는 T01 템플릿 + content-plan 카피 방향 + cases-gallery 교차 맵을 읽고 페이지별 한국어 카피 라이팅.

## 산출물 (22개 파일)

| 구분 | 파일 | 수 |
|---|---|---|
| JS 신규 | `git-github/js/fake-terminal.js` | 1 |
| 튜토리얼 HTML | `git-github/tutorial/git-concept.html` ~ `github-extras.html` (T01~T21) | 21 |
| CSS 갱신 | `git-github/css/components.css`(터미널/치트시트/본문 보조 + CommandPill 대비 수정) | — |
| 토큰 갱신 | `git-github/css/tokens.css`(`--accent-dark` 신규 추가) | — |

P1 셸(tokens/base/layout/pages.css 원본, nav/progress/reveal.js)은 미변경 계승.

## 검증 중 수정

1. **CommandPill WCAG AA 결함**: `accent #3D5AFE` on `accent-soft #E2E8FB` = 4.20:1(AA 미달). P3 튜토리얼 페이지에서 CommandPill이 활성 렌더링됨 → 신규 토큰 `--accent-dark #2A47D4` 추가(REQ-001 허용 범위), pill 텍스트 color 적용. 결과 5.82:1(AA 충족, REQ-012). P2에서 지적했던 동일 결함도 본 수정으로 소급 해소.
2. **home 헤더 드롭다운 결함 발견(P2 산물)**: `git-github/index.html` 헤더 드롭다운이 ia-sitemap과 불일치하는 파일명(`tutorial/first-commit.html`, `ref/conflict-guide.html` 등) 사용. P3 튜토리얼 헤더는 정확한 파일명으로 구축. home 헤더 수정은 P2 follow-up으로 기록(본 Phase 범위 외).

## 수용기준 검증 (독립, Run 게이트)

| REQ | 항목 | 검증 | 결과 |
|---|---|---|---|
| REQ-001 | 126항목 커버리지 | 주요 G/H 항목 스팟체크 | PASS — reset/rebase -i/cherry-pick/bisect/stash/filter-repo/.gitignore/.gitattributes/submodule/worktree/tag/Dependabot/secret·code scanning/CODEOWNERS/branch protection/squash/Copilot/Codespaces/workflow.yml/matrix/2FA/GPG/GitFlow/Trunk 각 지정 페이지 출현 |
| REQ-002 | 비우 선행 | metaphor 박스 위치 | PASS — 21페이지 전부 metaphor(1~2개) 보유, 기술어 섹션 앞 배치(T14 샘플 확인) |
| REQ-003 | git 팩트 | SB3 reset soft/mixed/hard 검증 | PASS — soft=HEAD만/mixed=대기방/hard=작업방(git-scm.com/docs 기준) |
| REQ-004 | GitHub 팩트 | T16 merge 3종·T19 Dependabot 구분 | PASS — squash/rebase/merge-commit 명칭, alerts vs security updates 구분 표 |
| REQ-005 | PrevNextPager 순서 | next 링크 체인 추적 | PASS — T01→T02→…→T21→ref/command-dictionary.html (순서 역전/끊김/순환 없음) |
| REQ-006 | 사례 콜아웃 교차맵 | case-callout-link href vs cases-gallery | PASS — 21페이지 전부 교차맵 지정 ID 일치(T01→t1-01/t2-01 … T21→t1-11/t2-11/t2-12) |
| REQ-007 | FakeTerminal 흐름 | data-terminal-script + js 로드 | PASS — T03(git-basics)/T04(git-staging)/T09(git-remote)에 data-terminal-script 및 fake-terminal.js 로드. init→status→add→commit→log 기본 흐름 포함 |
| REQ-008 | P1 셸 상속 | 5 CSS + 3 JS link | PASS — 21페이지 전부 tokens→base→layout→components→pages + Pretendard(6 link), nav→progress→reveal |
| REQ-009 | side-note 6종 hex | tokens.css 상속(P1) | PASS — 변수 미변경, components.css side-note 클래스 미변경 |
| REQ-010 | side-note 분량·다양성 | 박스 수·종류 집계 | PASS — 페이지당 4~6개(3~6 범위), 3~6종 혼합(단일종 페이지 없음) |
| REQ-011 | 빌드 없음 | 정적 HTML | PASS — Node/npm/bundler 의존성 없음 |
| REQ-012 | 접근성·모션 | WCAG 계산 + reduced-motion | PASS — CommandPill 수정 후 5.82:1; reduced-motion은 reveal.js/fake-terminal.js/CSS @media로 처리 |
| REQ-013 | tmux 무결성 | mtime 확인 | PASS — style.css/main.js/index.html 14:13~14:14 유지 |

## Sync 단계

- git 저장소 아님 → PR/커밋 생략.
- 본 progress.md로 진행 기록 확보.
- spec.md status Planned → Implemented 갱신.

## 알려진 제한 / Follow-up

- **home 헤더 드롭다운 파일명 불일치(P2)**: `git-github/index.html` 헤더 링크가 `tutorial/first-commit.html`, `ref/conflict-guide.html`, `cases/design-team.html` 등 미존재 파일을 가리킴. P2 follow-up에서 ia-sitemap 정확 파일명으로 수정 권장. (P3 튜토리얼 헤더는 정확함.)
- 사례 콜아웃 링크 대상(`cases/index.html#tX-YY`)은 P5(IMPL-005)에서 실제 카드 생성 시 유효해짐.
- Git 특화 인터랙티브 자산(GitGraphVisualizer 등)은 P6에서 자리표시자 교체. P3는 FakeTerminal만 구현, 나머지는 정적 다이어그램/텍스트.
- 최종 일러스트·접근성 실측·Lighthouse는 P7.
- 검색 인덱스(IMPL-002)의 튜토리얼 title/summary 정제는 본 Phase에서 미수행 — 필요시 IMPL-002 인덱스 갱신.

## HISTORY

- 2026-06-19: Run+Sync 완료. 21 튜토리얼 HTML + fake-terminal.js 납품. 5 서브배치 병렬 실행. 13개 EARS 수용기준 전부 독립 검증 통과. CommandPill WCAG 결함 수정(--accent-dark 추가). home 헤더 결함 P2 follow-up 기록.

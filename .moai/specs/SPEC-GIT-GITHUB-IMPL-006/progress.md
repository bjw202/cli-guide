# Progress — SPEC-GIT-GITHUB-IMPL-006 (P6: Git 특화 인터랙티브 자산 7종)

**SPEC**: SPEC-GIT-GITHUB-IMPL-006 v1.1.0
**Phase**: Run + Sync
**Methodology**: 수용기준 명세 기반 검증 (정적 HTML/JS, 빌드 단계 없음)
**Date**: 2026-06-19

---

## Run 산출물 (납품)

### 자산 JS 모듈 (7, 각 독립)
| 자산 | 파일 | 클래스 | 삽입 호스트 | design-guide |
|---|---|---|---|---|
| GitGraphVisualizer | `js/git-graph.js` | `git-graph` | T06, T08 | C |
| StagingFlowDiagram | `js/staging-flow.js` | `staging-flow` | T04 | D |
| PRFlowDiagram | `js/pr-flow.js` | `pr-flow` | T15, T16 | E |
| ActionsPipelineAnimation | `js/actions-pipeline.js` | `actions-pipeline` | T18 | F |
| OhShitGitSimulator (시그니처) | `js/oh-shit-git.js` | `oh-shit-git` | T11 | G |
| ConflictResolverMini | `js/conflict-resolver.js` | `conflict-resolver` | T07 | N |
| GlossaryTooltip | `js/glossary-tooltip.js` | `glossary-tooltip` | 전역(8페이지) | K |

> 각 모듈은 `[data-asset="..."]` 컨테이너를 찾아 IIFE 초기화. npm/번들 의존 0(REQ-013).

### CSS
- `git-github/css/components.css` — 7종 자산 컴포넌트 + `.glossary-term` 인라인 트리거 + 모바일 + `prefers-reduced-motion` 추가 (5-CSS 계약 유지).

### 자산 삽입 (8 튜토리얼 페이지)
T04(git-staging), T06(git-branch), T07(git-merge), T08(git-rebase), T11(git-undo),
T15(github-repo), T16(github-issues-pr), T18(github-actions). 각 페이지에 자산 `<section>` + 해당 자산 JS + `glossary-tooltip.js` 로드.

### GlossaryTooltip 데이터
- `glossary-tooltip.js`에 R02 용어집 37종 미러(`metaphor`는 R02 `.glossary__metaphor`와 정확 일치, REQ-006). file://에서 `fetch` 불가(CORS)해 인라인 임베드(결정 6.4 준수). 8페이지에 `data-term` 용어 10종 마킹(cherry-pick/conflict/detached-head/fork/head/pull-request/rebase/runner/staging-area/three-way-merge), orphan 0.

---

## 설계 결정 (run 중, SPEC 섹션 6 HOW 해소)

- **6.1 SVG/CSS-positioned**: GitGraph/Staging/PR/Actions 전부 인라인 SVG + DOM. 외부 그래픽 라이브러리 0(REQ-013). 스크린 리더·키보드 접근성 확보.
- **6.2 최소 상태머신**: GitGraph는 5단계 선형, OhShitGit은 단일 카드 선택, PR/Actions는 순차 하이라이트. xstate 등 FSM 도입 안 함(과잉).
- **6.3 자산별 독립 JS**: 7개 단일 파일. 일부만 로드해도 동작(roadmap P6 리스크 완화).
- **6.4 데이터 주도**: OhShitGit 7 시나리오·GlossaryTooltip 37 용어는 코드 로직과 분리된 데이터 객체.

---

## 수용기준 검증 (REQ-001~015)

전 15건 PASS. 상세는 SPEC-007 `qa-report.md` 섹션 5. 핵심:
- REQ-003: OhShitGit 7 시나리오 = design-guide G와 1:1(cherry-pick·reflog·amend·reset HEAD~1·revert·경고+협조·filter-repo).
- REQ-004/REQ-009: 7 자산 전부 reduced-motion 처리(정보는 정적 전달).
- REQ-012: 성공 `--git-green`, 실패 `--warning`.
- REQ-015: `tmux/` 원본 수정 0건.

---

## P1 셸 상속 (REQ-011)
- 모든 자산은 5 CSS + 3 JS 위에서 동작. tmux 변수명 관습(`--primary`/`--note-*`) + Git 액센트(`--git-green`/`--village-indigo`) 사용.

---

## Sync 산출물
- `spec.md` status Planned → Implemented, HISTORY 추가.
- 본 progress.md 작성.

---

## HISTORY
- 2026-06-19: Run + Sync 완료. 7 자산 + 8페이지 삽입 납품. P7 검증 PASS.

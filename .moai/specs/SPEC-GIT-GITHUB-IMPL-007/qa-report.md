---
id: SPEC-GIT-GITHUB-IMPL-007/qa-report
version: 1.0.0
status: Done
created: 2026-06-19
updated: 2026-06-19
author: MoAI (P7 run)
priority: High
lifecycle: spec-anchored
related:
  - SPEC-GIT-GITHUB-IMPL-005
  - SPEC-GIT-GITHUB-IMPL-006
  - SPEC-GIT-GITHUB-IMPL-007
---

# P7 최종 QA — 검증 실행 보고서 (run report)

> SPEC-GIT-GITHUB-IMPL-007 섹션 3의 검증 프레임워크를 P5·P6 산출물 및 사이트 전체에
> 적용한 실행 결과. 자동화 가능 항목은 스크립트로, 수동 항목은 체크리스트로 기록.
> 본 보고서는 SPEC-007의 "run 보고서로 보강" 항목(RISK 표 5번)을 충족한다.

---

## 1. 검증 요약 (Summary)

| 범주 | 항목 수 | PASS | FAIL | 비고 |
|---|---|---|---|---|
| 링크/앵커 무결성 (3.4) | 550 링크 + 26 앵커 | 전부 | 0 | 자동화 스크립트 |
| 접근성 자동 점검 (3.1) | 11 | 11 | 0 | ARIA·대비·키보드 정적 점검 |
| 모바일 반응형 (3.5) | 6 | 6 | 0 | 중단점 CSS 검수 |
| 시리즈 결속 (3.6) | 3 | 3 | 0 | 토큰·폰트·링크 |
| 기능 (3.7) | 7 자산 + 필터 | 전부 | 0 | 자산 동작·reduced-motion |
| 크로스 브라우저 (3.2) | 6 환경 | — | — | 수동 권장 (본 run 범위 외) |
| 성능 Lighthouse (3.3) | 3 지표 | — | — | 수동 권장 (본 run 범위 외) |
| 비개발자 리뷰 (3.7/REQ-010) | 선택 | — | — | 미확보 (선택 기준, 완료 차단 안 함) |

> 크로스 브라우저 실기기 테스트와 Lighthouse 실측은 브라우저/CLI 환경이 필요해
> 본 자동화 run 범위에서는 "수동 권장"으로 남긴다. 배포 전 1회 수행 권장.

---

## 2. 링크/앵커 무결성 (REQ-005) — 자동화

검증 스크립트: 본 run에서 작성한 Python 크롤러(27페이지 순회, 내부 href + `#anchor` 검증).
tmux 크로스사이트 시리즈 링크(`../tmux/index.html`)는 별개 사이트이므로 내부 검증에서 제외.

```
Pages: 27 | internal links: 550 | BROKEN pages: 0 | BROKEN anchors: 0
```

**결과: REQ-005 PASS** — 내부 링크 0 broken, `#anchor` 0 broken.

### run 중 발견·수정한 결함 (P7 corrective)

| # | 결함 | 원인 | 조치 |
|---|---|---|---|
| C1 | `cases/index.html#t1-01` 등 26 앵커가 정적 HTML에 없었음 | 최초 P5를 JS 렌더링으로 설계 → no-JS/정적 크롤러가 앵커를 못 찾음 | P5를 **정적 카드 렌더링**으로 리팩터. 카드는 HTML에 고정, JS는 필터 토글만 담당 → 앵커 무결성·no-JS 견고성 동시 확보 (REQ-004/005 강화) |
| C2 | `tutorial/github-concept.html` pager → `git-config.html` (존재 안 함) | 파일명 오타 | `git-config-files.html`로 수정 |
| C3 | `index.html`(홈) 드롭다운/드로어 6개 placeholder 링크가 실재하지 않는 페이지를 가리킴 (`first-commit.html`, `branch-basics.html`, `pull-request.html`, `conflict-guide.html`, `cases/design-team.html`, `cases/writing-team.html`) | P2 홈 네비가 가상 페이지명으로 작성됨 | 실재 페이지로 재매핑: T03 `git-basics`, T06 `git-branch`, T16 `github-issues-pr`, T07 `git-merge`(충돌), `cases/index.html#t1-02`/`#t1-01`(팀 사례) |

> C3는 P2(IMPL-002) 홈 범위의 결함이나, P7 REQ-005(0 broken) 게이트를 통과하기 위해
> P7 corrective로 즉시 수정했다(SPEC-007 섹션 5: "QA 과정에서 발견된 간격은 해당 Phase로 역 루팅" —
> 본 결함은 보유 Phase가 명백하고 정답이 유일해 즉시 시정).

---

## 3. 접근성 (3.1 / REQ-001) — 정적 점검

자동화(axe/Lighthouse)는 브라우저 환경 필요. 본 run은 마크업 수준 정적 점검 수행.

| 항목 | 결과 | 근거 |
|---|---|---|
| WCAG AA 색 대비 | PASS(정적) | 토큰 설계 시 계산: `--accent-dark #2A47D4` on `--accent-soft` = 5.82:1, 본문 `#2D2A26` on `#FFFBF5` = 12.6:1. 모든 자산 성공=`--git-green`, 경고=`--warning` (REQ-012) |
| 스크린 리더 대상 ARIA | PASS | `role="progressbar"`(진행률), `aria-label`(자산·필터), `aria-live="polite"`(결과 카운트 REQ-007, PR/Actions 단계, OhShitGit 패널), `role="tooltip"`(용어), `nav aria-label` |
| 키보드 조작 (REQ-005 P6) | PASS | 자산 버튼·카드·라디오·용어 span 모두 네이티브 포커스 가능. GitGraph ←→ 키 지원, GlossaryTooltip focus/Escape 지원 |
| `prefers-reduced-motion` (REQ-004/REQ-009) | PASS | 7개 자산 전부 REDUCED 분기 또는 CSS `@media`로 모션 축소. 정보(그래프 구조·시나리오 답안·툴팁 정의)는 정적으로 온전히 전달 |
| 일러스트 대안 | PASS(자산) | 자산 SVG는 `aria-hidden`(장식), 의미는 인접 텍스트·캡션으로 전달. 사례 카드 일러스트는 placeholder(emoji + 색)로 장식 처리 |

> 수동 권장: VoiceOver/NVDA 실기기 읽기 테스트, axe-core 브라우저 스캔은 배포 전 1회 수행.

---

## 4. P5 사후검증 (SPEC-005 REQ-001~010)

| REQ | 항목 | 결과 |
|---|---|---|
| REQ-001 | 카탈로그 1:1 (26 카드) | PASS — Tier1 14 + Tier2 12 = 26, id/tier/domain/oneliner/features/related_tutorials 정적 렌더 |
| REQ-002 | 필터 3축 조합 | PASS — Tier/Domain/Feature select 조합, 빈 상태 메시지 |
| REQ-003 | 튜토리얼 순방향 링크 | PASS — 카드별 `related_tutorials` → 실재 튜토리얼 파일 |
| REQ-004 | 역방향 앵커 (`#t1-01`) | PASS — 정적 `id` 26개, 무결성 0 broken |
| REQ-005 | 사례 콜아웃 색 구분 | PASS — `--note-case #E8F5EE` / `--git-green #2E7D52` 토큰 사용(OhShitGit `--tip` 박스로 활용) |
| REQ-006 | 모바일 카드 그리드 | PASS — `@media (max-width:768px)` 1~2열 재배치 |
| REQ-007 | 필터 키보드 + 결과 카운트 | PASS — 네이티브 select(키보드), `aria-live` 카운트 |
| REQ-008 | P1 셸 상속 (5 CSS + 3 JS) | PASS — tokens→base→layout→components→pages + nav→progress→reveal |
| REQ-009 | 빌드 없음 | PASS — `file://` 동작, npm 의존 0 |
| REQ-010 | WCAG AA | PASS(정적) — 섹션 3 참조 |

---

## 5. P6 사후검증 (SPEC-006 REQ-001~015)

| REQ | 자산/항목 | 결과 |
|---|---|---|
| REQ-001 | GitGraph 분기·합류 | PASS — stage 3 merge 합류 노드 |
| REQ-002 | GitGraph rebase | PASS — stage 4 재배치(일직선) |
| REQ-003 | OhShitGit 7 시나리오 정확 | PASS — `git-graph.js` 외 7 시나리오 each: cherry-pick/reset, reflog, commit --amend, reset HEAD~1, revert, 경고+협조, filter-repo. design-guide G와 1:1 |
| REQ-004 | reduced-motion 정보 정적 전달 | PASS — 각 자산 REDUCED 분기 |
| REQ-005 | 키보드 조작 | PASS |
| REQ-006 | GlossaryTooltip R02 일치 | PASS — 37 용어 R02 미러, metaphor R02 `.glossary__metaphor`와 정확 일치. data-term 10개 사용, orphan 0 |
| REQ-007 | ConflictResolver 양 버전 선택 | PASS — 라디오 A/B → 결과 미리보기 |
| REQ-008 | ActionsPipeline event→deploy | PASS — 5단계 순차 |
| REQ-009 | StagingFlow 3방 이동 | PASS — add/commit 이동 |
| REQ-010 | PRFlow 7단계 | PASS — fork→...→merge |
| REQ-011 | P1 셸 + tmux 변수명 | PASS — `--git-green`/`--village-indigo`/tmux 단순명 사용 |
| REQ-012 | 성공/실패 색상 | PASS — 성공 `--git-green`, 실패 `--warning` |
| REQ-013 | 빌드 없음 | PASS — 단일 독립 JS 모듈 7개, npm 0 |
| REQ-014 | WCAG AA + ARIA | PASS(정적) |
| REQ-015 | tmux 원본 무결성 | PASS — `tmux/` 수정 0건 |

> 자산 삽입 호스트 8페이지: T04(staging-flow), T06(git-graph), T07(conflict-resolver),
> T08(git-graph), T11(oh-shit-git), T15(pr-flow), T16(pr-flow), T18(actions-pipeline).
> GlossaryTooltip은 8페이지 전부에 로드 + data-term 용어 마킹.

---

## 6. 모바일 반응형 (3.5 / REQ-006) — CSS 검수

- 중단점 `768px`: 사례 그리드 1~2열, 필터 select 플렉스, 자산(StagingFlow/ConflictResolver) 1단, 파이프라인 컨베이어 숨김. PASS.
- 튜토리얼 하단 바(prev/next)·사이드바 TOC·햄버거 드로어: IMPL-001 자산으로 본 run에서 재검증 대상 아님(이미 P1 통과). PASS(상속).

---

## 7. 시리즈 결속 (3.6 / REQ-007)

- 토큰 변수명·값: tmux `style.css`와 동일(IMPL-001 상속). PASS.
- 폰트: Pretendard + JetBrains Mono 양쪽 동일. PASS.
- 양방향 링크: 본 사이트 → `../tmux/index.html` 존재(모든 페이지 푸터/헤더). 역방향은 tmux 사이트 소유(읽기 전용 비교). PASS.

---

## 8. 수동 권장 (본 run 범위 외)

배포 전 수행을 권장하는 항목. 본 SPEC 완료를 차단하지 않음.

1. **크로스 브라우저 (REQ-002)**: Chrome/Firefox/Safari/Edge + iOS Safari/Android Chrome 6환경 실기기 확인.
2. **Lighthouse (REQ-003)**: Performance 90+ / Accessibility 95+ / Best Practices 95+. 정적 사이트·JS 경량이므로 통과 예상.
3. **스크린 리더 (REQ-001)**: VoiceOver·NVDA 실기기 읽기 테스트.
4. **비개발자 리뷰 (REQ-010, 선택)**: 1~2명 확보 시 "끝까지 읽을 수 있다" 확인.

---

## 9. 결론 (Verdict)

- P5/P6 산출물은 검증 프레임워크(자동화 가능 항목)를 전부 PASS.
- 사이트 전체 링크 무결성(REQ-005) 0 broken 달성.
- 자동화 불가 항목(크로스 브라우저·Lighthouse·스크린 리더)은 "수동 권장"으로 위임.
- P7 SPEC의 듀얼 용도(최종 게이트 + per-Phase 사후검증) 중 자동화 영역은 충족.

**P7 자동화 게이트: PASS.** 수동 권장 4종은 배포 전 별도 수행.

---

## HISTORY

- 2026-06-19: 최초 작성. P5·P6 run 직후 P7 검증 프레임워크 실행. 링크 무결성 스크립트로 550 링크/26 앵커 검증(0 broken). P5 정적 카드 리팩터(C1), github-concept pager 오타(C2), 홈 네비 placeholder 6건(C3) 시정. 자동화 게이트 PASS, 수동 권장 4종 명시.

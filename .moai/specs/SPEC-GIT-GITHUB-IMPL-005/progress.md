# Progress — SPEC-GIT-GITHUB-IMPL-005 (P5: 사례 갤러리)

**SPEC**: SPEC-GIT-GITHUB-IMPL-005 v1.1.0
**Phase**: Run + Sync
**Methodology**: 수용기준 명세 기반 검증 (정적 HTML, 빌드 단계 없음 — IMPL-001~004 선례 준용)
**Date**: 2026-06-19

---

## Run 산출물 (납달)

### 페이지 (1)
- `git-github/cases/index.html` — `.tpl-cases` 템플릿. **26개 CaseCard 정적 렌더링**(Tier1 14 + Tier2 12). CaseFilterBar 3축(Tier/Domain/Feature). GlobalHeader/Breadcrumb/Footer/ReadingProgress 상속.

### JS (1)
- `git-github/js/cases-filter.js` — DOM 기반 3축 조합 필터. 카드 `data-tier`/`data-domain`/`data-features` 속성 읽어 가시성 토글. `aria-live` 결과 카운트(REQ-007). 빈 상태 메시지(REQ-002).

### CSS
- `git-github/css/pages.css` — `.tpl-cases` / CaseFilterBar / CaseCard 그리드 / 모바일(`@media 768px`) / `prefers-reduced-motion` 추가. (5-CSS 링크 계약 유지: 새 파일 생성 없이 `pages.css`에 추가.)

### 데이터
- 26 사례 데이터는 `cases/index.html`에 정적 카드로 인라인(권위 소스: `cases-gallery.md` 카탈로그와 1:1). 별도 데이터 JS는 두지 않음(drift 방지).

> 일러스트: warm-tone placeholder SVG(emoji + tier 색). SPEC 3.4가 placeholder를 허용. 최종 아트는 별도 작업.

---

## 설계 결정 (run 중)

### D1. 정적 카드 렌더링 (최초 JS 렌더링에서 리팩터)
최초엔 `cases-data.js` + JS 렌더링으로 설계. P7 링크 무결성 검증에서 역방향 앵커(`#t1-01` 등 26개)가 정적 HTML에 없어 41건 broken으로 검출. **카드를 정적 HTML에 고정, JS는 필터 토글만 담당**하도록 리팩터 → 앵커 무결성(REQ-004/005) + no-JS 견고성 + SEO 동시 확보. `cases-data.js`는 제거(drift 원천 제거).

---

## 수용기준 검증 (Run 게이트)

| REQ | 항목 | 결과 |
|---|---|---|
| REQ-001 | 카탈로그 1:1 (26 카드) | PASS |
| REQ-002 | 필터 3축 조합 + 빈 상태 | PASS |
| REQ-003 | 튜토리얼 순방향 링크 정합 | PASS |
| REQ-004 | 역방향 앵커 안정성 | PASS (정적 id) |
| REQ-005 | 사례 콜아웃 색 구분 토큰 | PASS |
| REQ-006 | 모바일 카드 그리드 | PASS |
| REQ-007 | 필터 키보드 + 결과 카운트 aria-live | PASS |
| REQ-008 | P1 셸 상속 (5 CSS + 3 JS) | PASS |
| REQ-009 | 빌드 없음 (file://) | PASS |
| REQ-010 | WCAG AA | PASS (정적 점검) |

---

## P1 셸 상속 (REQ-008)
- 5 CSS(tokens→base→layout→components→pages) + nav/progress/reveal 동일 순서 link.
- Breadcrumb는 nav.js가 `cases` → "사례 갤러리" 라벨로 자동 생성.
- `--note-case #E8F5EE` / `--git-green #2E7D52` 토큰 사용(OhShitGit `--tip` 박스로 시각적 구분).

---

## Sync 산출물
- `spec.md` status Planned → Implemented, HISTORY 추가.
- 본 progress.md 작성.

---

## HISTORY
- 2026-06-19: Run + Sync 완료. P7 검증(링크 무결성 0 broken) 통과.

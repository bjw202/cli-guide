---
spec: SPEC-GIT-GITHUB-IMPL-001
phase: Run+Sync
status: Implemented
started: 2026-06-19
completed: 2026-06-19
author: jw
---

# 진행 기록 — SPEC-GIT-GITHUB-IMPL-001 (P1 공유 셸)

## Run 단계

- 위임: `expert-frontend` (9개 파일 = 5 CSS + 3 JS + 1 HTML, 볼륨 트리거 5+ 동일 타입 → 강제 위임)
- 사이트 루트 결정: 신규 디렉토리 `git-github/` (`tmux/` 형제 패턴). 루트 시리즈 랜딩 `index.html` 유지.
- 방법론: greenfield 정적 사이트 → TDD 대신 명세 기반 구현 + 독립 검증 (테스트 프레임워크 없음, REQ-009 빌드 없음 제약).

## 산출물 (9개 파일)

| 파일 | 역할 | 크기 |
|---|---|---|
| `git-github/css/tokens.css` | 디자인 토큰 (tmux 공유 + 신규 6종) | 3.8KB |
| `git-github/css/base.css` | reset + 한국어 본문 타이포 | 2.2KB |
| `git-github/css/layout.css` | 헤더/푸터/그리드/반응형/드로어 | 5.7KB |
| `git-github/css/components.css` | side-note 6종 + 컴포넌트 | 5.5KB |
| `git-github/css/pages.css` | 4 템플릿 골격 | 1.1KB |
| `git-github/js/nav.js` | 드롭다운/햄버거/Breadcrumb 자동생성 | 7.6KB |
| `git-github/js/progress.js` | 페이지 진행률 + 트랙 진행률(localStorage) | 4.3KB |
| `git-github/js/reveal.js` | IntersectionObserver 리빌 + reduced-motion | 1.4KB |
| `git-github/index.html` | P1 검증용 셸 (6종 side-note 렌더링) | 9.3KB |

## 수용기준 검증 (독립, Run 게이트)

| REQ | 항목 | 검증 방법 | 결과 |
|---|---|---|---|
| REQ-001 | 시리즈 공유 변수명 tmux 일치 + 신규만 고유명 | `diff` tmux:root vs tokens.css | PASS — tmux 변수 전부 보존, 신규(--note-case/--border-case/--git-green/--village-indigo/--content-xwide/--header-h)만 추가 |
| REQ-002 | CSS 5개·JS 3개 로드 순서 | index.html link/script 순서 | PASS — tokens→base→layout→components→pages / nav→progress→reveal (defer) |
| REQ-003 | side-note 6종 색상 | components.css 변수 매핑 | PASS — FFF7E6/F5EFE0/E6F7F4/FDECEA/F1ECFB + case E8F5EE 배경 & 2E7D52 테두리 |
| REQ-004 | 페이지 진행률 바 | progress.js scroll+rAF | PASS |
| REQ-005 | 트랙 진행률 localStorage | progress.js `gg-progress` 키 | PASS |
| REQ-006 | 768px 햄버거 + 드로어 | layout.css media query + nav.js | PASS |
| REQ-007 | reduced-motion 즉시 표시 | reveal.js matchMedia 분기 | PASS |
| REQ-008 | Breadcrumb 자동 생성 | nav.js pathname 파싱 | PASS |
| REQ-009 | 빌드 없음, file:// 동작 | 의존성 = Pretendard CDN only | PASS |
| REQ-010 | WCAG AA 대비 | node 대비 계산 | PASS — 13.85:1(본문)/12.73(사례박스)/4.98(accent) |
| REQ-011 | tmux 원본 무결성 | mtime 확인 | PASS — style.css 14:14, main.js 14:13 (작업 전 유지) |

JS 구문: `node --check` 3개 파일 전부 OK.

## Sync 단계

- git 저장소 아님 (`fatal: not a git repository`) → PR 생성 불가, 커밋/PR 단계 생략.
- 본 progress.md로 진행 기록 확보.
- SPEC status를 Planned → Implemented로 갱신 권장 (spec.md frontmatter).

## 알려진 제한 (P1 범위 외, 의도적)

- 드롭다운/사이드바 링크(tutorial/ref/cases)는 더미 href — P2~P5에서 실제 페이지 생성 시 유효.
- SidebarTOC, PrevNextPager, FakeTerminal 등은 P1에서 정의만/제외 — 해당 Phase에서 적용.
- 시리즈 랜딩(`루트 index.html`)의 "Git & GitHub 안내서" 카드 링크 연결은 P2 홈 허브 완성 시.

## 후속 Phase 의존

- P2 (IMPL-002): 홈 허브 본문(HeroBlock/ThreeDoors/검색)으로 index.html 캔버스 교체.
- P3~P5: 튜토리얼 21 / 참조 4 / 사례 갤러리 본문. 본 셸의 5 CSS + 3 JS를 link만 하면 뼈대 즉시 동작.

## HISTORY

- 2026-06-19: Run+Sync 완료. 11개 EARS 수용기준 전부 독립 검증 통과.

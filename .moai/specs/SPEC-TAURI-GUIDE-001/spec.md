---

id: SPEC-TAURI-GUIDE-001 version: 1.1.0 status: Implemented created: 2026-06-20 updated: 2026-06-20 author: jw priority: High lifecycle: spec-anchored related:

- SPEC-TMUX-GUIDE-001
- SPEC-GIT-GITHUB-GUIDE-001
- SPEC-GIT-GITHUB-IMPL-001

---

# SPEC — Tauri (Rust) 데스크톱 앱 개발 워크플로우 교육 가이드 (기획 단계)

> 시리즈 "터미널 친구들"의 세 번째 분야. **프로젝트명(cli-guide)과는 어긋나지만**, 학습자가 웹 기술로 "빠르고 가벼운 진짜 데스크톱 앱"을 만드는 길을 열어주는 가이드. 본 SPEC은 **기획서**다 — 실제 페이지 구현은 후속 IMPL SPEC에서 다룬다. 청중: 본 가이드를 기획·구현하는 개발자. 한국어 본문, 식별자·명령어·경로는 영어.

---

## 1. 목표 (Goal)

**Tauri 프레임워크로 데스크톱 앱을 만드는 전체 워크플로우**를 한 사이트에 담아낸다. Tauri는 생소하지만 점점 주목받는 프레임워크라 — 학습자가 "이게 뭔지, 왜 쓰는지, 어떻게 만드는지"를 **한 번의 읽기**로 잡을 수 있게 한다. 본 가이드가 답하는 세 가지:

1. **왜(Why)**: Tauri는 왜 태어났고, 왜 써야 하는가 (Electron의 무거움이라는 문제).
2. **어떻게(How)**: 개발 흐름이 어떻게 돌아가는가 (프론트엔드 ↔ Rust 백엔드 ↔ 빌드).
3. **무엇으로(With what)**: 어떤 도구와 어떤 최소 문법을 알아야 하는가.

본 Phase가 끝나면 기획 산출물(spec.md + roadmap.md)로 구현(IMPL)의 단일 권위 소스가 된다.

---

## 2. 배경 — 왜 Tauri인가, 왜 이 가이드인가 (Why)

### 2.1 문제의식: Electron은 "무겁다"

2013년 GitHub가 발표한 **Electron**은 웹 기술(HTML/CSS/JS)로 크로스플랫폼 데스크톱 앱을 만들게 한 혁명이었다. VS Code, Slack, Discord, Figma 데스크톱 버전이 모두 Electron이다. 하지만 혁명의 대가가 있었다 — **모든 앱에 Chromium 브라우저와 Node.js 런타임을 통째로 포함**한다.

- 설치 파일 크기: 보통 **100\~200MB** (간단한 메모 앱조차).
- 메모리 사용: **100\~300MB** 시작, 여러 창이면 더.
- 배터리·자원: 각 앱마다 Chromium을 한 벌씩 켜는 셈.

"웹 기술로 만들 수 있다"는 장점이 "무겁고 자원을 많이 먹는다"는 단점을 동반한 구조다.

### 2.2 Tauri의 탄생 (2019\~)

**Tauri**는 2019년 Daniel Thompson-Yvetot와 크루(Crux) 커뮤니티가 시작한 프로젝트로, 같은 질문에서 출발했다: **"Chromium을 앱마다 포함하지 않고, 웹 기술로 데스크톱 앱을 만들 수는 없을까?"**

핵심 발상 두 가지:

1. **운영체제가 이미 가진 웹뷰를 쓴다.**

   - Windows → WebView2 (Edge 기반, 윈도우에 기본 탑재)
   - macOS → WKWebView (Safari 기반)
   - Linux → WebKitGTK → Chromium을 번들하지 않아도 된다. 앱 크기가 **3\~10MB**로 쪼그라든다.

2. **백엔드를 Rust로 짠다.**

   - Node.js 대신 Rust — 시스템 언어라 빠르고 메모리 안전.
   - 결과물은 진짜 네이티브 바이너리 (JS 런타임 없음).
   - 메모리 사용 **30\~80MB** 수준.

### 2.3 "왜?" 한 줄 요약

> **Tauri = "웹으로 화면을 그리고, Rust로 일을 시키고, 운영체제의 웹뷰로 띄운다.**"Electron의 무거움 없이, 웹 기술의 친숙함과 Rust의 가벼움·안전함을 동시에.

### 2.4 왜 "이 가이드"인가

Tauri는 **Rust**를 백엔드로 쓴다. Rust 자체의 진입장벽(소유권·수명 등) 때문에 많은 학습자가 "관심은 있는데 어디서 시작해야 할지"를 못 잡는다. 본 가이드는

- **Rust를 깊이 가르치지 않는다** (그건 별도 학습 과제).
- Tauri로 앱을 **만들어 보는 데 필요한 최소한**만 다룬다 — 대표 문법 몇 가지 + 도구 + 흐름.
- 시리즈의 시그니처 톤(**비유 먼저, 따뜻하게**)으로 생소함을 덜어낸다.

→ "Tauri가 뭔지 알겠고, 한번 만져볼 용기가 생겼다"가 성공 기준.

---

## 3. 오디언스 (Audience)

|  |  |
| --- | --- |
| 주 독자 | 웹 개발(HTML/CSS/JS)은 알지만 데스크톱 앱/Rust는 처음인 개발자 |
| 부 독자 | "Electron 말고 가벼운 대안이 뭐냐"를 찾는 기술 의사결정자/호기심 많은 학습자 |
| 전제 지식 | 명령줄 기본, npm/번들러 개념, JSON 설정 파일 읽기 |
| 전제 지식 **아닌 것** | Rust 문법(본 가이드가 얕게 소개), 시스템 프로그래밍 경험 |

> 비개발자가 주 독자인 tmux/Git-GitHub 가이드와 다르게, 본 가이드는 \*\*"웹을 할 줄 아는 사람"\*\*이 1차 대상이다. 하지만 시리즈 톤(비유 먼저, 두려운 단어 사전)은 그대로 가져간다.

---

## 4. 톤앤매너 (시리즈 일관성)

시리즈 "터미널 친구들"(tmux · Git/GitHub · **Tauri**)의 세 번째 멤버로서 시각·어조 일관성을 유지한다.

- **비유 먼저, 단어 나중**: Chromium 번들 = "앱마다 브라우저를 한 벌씩 들고 다닌다"; 웹뷰 = "운영체제가 이미 깔아둔 창을 빌려 쓴다"; Rust 명령 = "주방(Rust)에 주문서(invoke)를 보낸다".
- **따뜻한 크림 토큰**(`#FFFBF5` 배경, 코랄 액센트) 상속. Tauri 액센트 색 1종 추가(아래 10절).
- **side-note 박스 6종**(metaphor/history/tip/warn/extra/case) 그대로 사용.
- Pretendard + JetBrains Mono 폰트, `word-break: keep-all` 한국어 줄바꿈.
- 빌드 단계 없는 정적 사이트 원칙은 본 가이드에도 적용(본 가이드 자체는 HTML/CSS/JS).

---

## 5. 가이드 페이지 구성 (Roadmap)

본 기획서는 가이드를 **7개 Phase(P1\~P7)** 로 분해한다. 각 Phase는 후속 IMPL SPEC으로 구현.

| Phase | 제목 | 핵심 질문 | 산출물 |
| --- | --- | --- | --- |
| **P1** | 공유 셸·디자인 | 시리즈와 같은 껍질? | CSS 5분할 + JS 3종 + 헤더/푸터/브레드크럼 |
| **P2** | 왜 Tauri인가 | 왜 태어났고 왜 쓰나? | 탄생 배경 + Electron 비교 페이지 |
| **P3** | 개발 흐름 한눈에 | 어떻게 돌아가나? | 아키텍처 + 워크플로우 다이어그램 |
| **P4** | 도구 생태계 | 뭘로 깔고 뭘로 돌리나? | rustup·cargo·Tauri CLI·IDE 카탈로그 |
| **P5** | Rust 대표 문법 (얕게) | 최소한 뭘 알아야 하나? | fn·let·match·struct·Result/Option 미니 레퍼런스 |
| **P6** | 프론트엔드·IPC·빌드 | 화면과 백엔드가 어떻게 대화하나? | invoke/commands·설정·빌드·배포·(모바일) |
| **P7** | 실전 미니 프로젝트 + QA | 한 번 만들어 보자 | 버튼→Rust 명령→화면 갱신 미니앱 + 체크리스트 |

> P1은 SPEC-GIT-GITHUB-IMPL-001(P1 셸)을 거의 그대로 재사용한다 — **추출·재포장 원칙**. P2가 본 시리즈의 시그니처(비유 + "왜")를 가장 진하게 담는다.

---

## 6. 콘텐츠 계획 (섹션별 상세)

### 6.1 P2 — 왜 Tauri인가 (탄생 배경 + Electron 비교) — 시그니처

- **비유 페이지**: "Electron은 앱마다 브라우저를 한 벌씩 들고 다닌다. Tauri는 운영체제가 이미 깔아둔 창을 빌려 쓴다." 한 장의 그림(+ 모션)으로.
- **역사 side-note**: 2013 Electron → 2019 Tauri 시작 → 2020 v1 → **2024 v2**(모바일 지원).
- **비교 매트릭스 페이지**: 아래 7절의 표를 인터랙티브(P6 자산 패턴 재사용)로.
- **"왜 쓰나" 4가지**: 가볍다 / 안전하다(Rust) / 크로스플랫폼(데스크톱+모바일) / 웹 기술 그대로.

### 6.2 P3 — 개발 흐름 한눈에 (아키텍처)

- **3계층 그림**: 프론트엔드(웹) ↔ IPC(명령 주문서) ↔ Rust 백엔드(주방).
- **비유**: 식당 — 손님(프론트)이 주문서(`invoke`)를 주방(Rust)에 넘기면, 주방이 요리(`#[tauri::command]`)해서 결과를 다시 손님에게 가져다준다. 화면은 손님이, 일은 주방이.
- **흐름 다이어그램**(Git 가이드의 PRFlowDiagram 자산 패턴 재사용): `scaffold → dev(핫리로드) → frontend 작성 → Rust 명령 작성 → build → 인스톨러`.

### 6.3 P4 — 도구 생태계 (Tooling Catalog)

| 도구 | 역할 | 비유 |
| --- | --- | --- |
| **rustup** | Rust 버전 관리자 | "Rust의 nvm" |
| **cargo** | 빌드·패키지 매니저 | "Rust의 npm" (의존성은 `Cargo.toml`) |
| **Tauri CLI** | 앱 스캐폴드/dev/build | `cargo tauri dev` · `cargo tauri build` |
| **rust-analyzer** | LSP (자동완성/타입) | IDE의 두뇌 |
| **VS Code / RustRover** | IDE | RustRover(JetBrains)가 정석, VS Code도 충분 |
| **Vite** | 프론트엔드 번들러 | Tauri 공식 권장 |

- 각 도구별 한 줄 설명 + 설치 명령 + "언제 쓰는가".

### 6.4 P5 — Rust 대표 문법 (얕게, 깊이 X)

> **원칙**: Rust를 가르치지 않는다. Tauri에서 마주칠 **최소 7가지**만. 각각 한 줄 + 예제 한 조각.

1. `fn` — 함수 정의. `fn greet(name: &str) -> String { ... }`
2. `let` / `let mut` — 변수. 기본이 불변(immutable). `mut` 붙여야 변경.
3. `match` — 패턴 매칭 (switch의 강력한 사촌).
4. `struct` / `enum` — 데이터 묶기 / 경우의 수.
5. `Result` / `Option` — "실패할 수도" / "없을 수도"를 타입으로 표현 (null/예외 대신).
6. `&` 와 소유권 냄새만 — "빌려 쓴다"는 개념만 짚고 넘어감 (깊이 X).
7. `#[tauri::command]` — Tauri가 프론트에 노출할 Rust 함수 표시 (매크로).

→ 치트시트 카드 1장으로 정리. "이 7개만 알아도 Tauri 예제가 읽힌다"가 목표.

### 6.5 P6 — 프론트엔드·IPC·빌드

- **IPC**: 프론트엔드 JS에서 `invoke('greet', { name })` → Rust `#[tauri::command] fn greet(...)`. 비유 = "주문서(invoke) → 주방 명령(command)".
- **설정**(`tauri.conf.json`): 창 크기·아이콘·번들 id·권한(Tauri 2 ACL).
- **빌드**: `cargo tauri build` → 운영체제별 인스톨러(`.msi`/`.dmg`/`.deb`/`.AppImage`).
- **(Tauri 2) 모바일**: 같은 코드베이스로 iOS/Android 타겟 — Electron과의 차별점 강조.

### 6.6 P7 — 실전 미니 프로젝트 + QA

- **미니앱**: 이름 입력 → Rust `greet` 명령 → "안녕, {이름}!" 반환 → 화면 갱신. Git 가이드의 FakeTerminal/GitGraph 자산 패턴을 빌려 인터랙티브 데모로.
- **QA 체크리스트**: 빌드 산출물 크기 비교(Electron vs Tauri), 메모리, 권한 최소화.

---

## 7. Electron 비교 매트릭스 (P2 핵심 콘텐츠)

| 항목 | Electron | Tauri | 비고 |
| --- | --- | --- | --- |
| **백엔드 언어** | Node.js (JS/TS) | **Rust** | Tauri는 네이티브 바이너리 |
| **웹뷰** | Chromium 번들 포함 | **OS 네이티브 웹뷰** | Tauri가 압도적으로 가벼움 |
| **설치 파일 크기** | \~100\~200MB | **\~3\~10MB** | 단순 앱 기준 20\~50배 차이 |
| **메모리 사용** | \~100\~300MB | **\~30\~80MB** | Tauri 1/3\~1/5 수준 |
| **보안 모델** | Node 권한 광범위 | **권한 기반(ACL, Tauri 2)** | Tauri가 최소권한 원칙 |
| **프론트엔드** | 웹 기술 | 웹 기술 (동일) | 둘 다 React/Vue/Svelte 가능 |
| **모바일** | 불가 (별도 Capacitor) | **가능 (Tauri 2)** | 하나의 코드베이스 |
| **성숙도·생태계** | 매우 성숙, 거대 | **성장 중 (v2 2024)** | Electron이 아직 더 많은 사례 |
| **대표 앱** | VS Code, Slack, Discord | 1Password, Cody, Pomofocus | 점점 확산 |
| **시작 장벽** | JS만 알면 됨 | JS + **Rust 기초** | Tauri가 진입장벽 약간 높음 |

> 결론: **가벼움·보안·모바일**이 중요하면 Tauri, **생태계·자료 풍부함·JS만으로 충분**이면 Electron. 본 가이드는 이 객관적 트레이드오프를 숨기지 않고 보여준다(편향 방지).

---

## 8. Rust 대표 문법 카탈로그 (P5 — 얕게)

> 전부 "한 줄 + 예제 한 조각". 언어 자체 해설 X.

```
fn greet(name: &str) -> String {           // 1. 함수
    format!("안녕, {}!", name)
}
let count = 5;                              // 2. 불변 변수
let mut total = 0;                          //    가변 변수(mut)
match status {                              // 3. 패턴 매칭
    Ok(v)  => println!("{}", v),
    Err(e) => println!("에러: {}", e),
}
struct User { name: String, age: u32 }      // 4. 구조체
enum Result { Win, Lose, Draw }             //    열거형
fn find(id: u32) -> Option<User> { ... }    // 5. Option/Result (null/예외 대신)

#[tauri::command]                           // 7. Tauri 명령(매크로)
fn greet(name: String) -> String { format!("안녕, {}!", name) }
```

→ 프론트엔드에서: `await invoke('greet', { name: '지웅' })` 으로 이 Rust 함수를 호출.

---

## 9. 개발 도구 카탈로그 (P4)

```
# 1. Rust 설치 (rustup — 버전 관리자)
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh

# 2. 프로젝트 만들기 (Tauri CLI — npm 경로)
npm create tauri-app@latest
#   → 프레임워크 선택(React/Vue/Svelte/vanilla) → 자동 스캐폴드

# 3. 개발 (핫 리로드: 프론트 + Rust 동시)
cd my-app && npm run tauri dev

# 4. 빌드 (운영체제별 인스톨러 생성)
npm run tauri build
```

- **IDE**: RustRover(JetBrains, 정석) / VS Code + rust-analyzer(무료 충분) / Zed.
- **의존성**: Rust는 `Cargo.toml`의 `[dependencies]` (npm의 package.json 대응).

---

## 10. 디자인 시스템 (시리즈 상속 + Tauri 액센트)

- 시리즈 공유 토큰 그대로: `--bg-base #FFFBF5`, `--primary #FF8A5B`(코랄), `--accent #3D5AFE`(인디고).
- **Tauri 전용 액센트 1종 추가**: `--tauri-rust #CE412B`(Rust 공식 crab 오렌지/적갈) — 시리즈 side-note 5종과 구분되는 7번째 색. "Rust 코드 블록" 강조에 사용.
- 토큰 변수명은 tmux/Git 가이드의 **단순명 관습** 상속.
- 일러스트 톤: 따뜻한 플랫. 핵심 비유 그림 4종:
  1. "앱마다 브라우저 한 벌" vs "운영체제 창 빌려쓰기" (Electron vs Tauri)
  2. 식당 주방 비유 (프론트 = 손님, Rust = 주방, invoke = 주문서)
  3. 빌드 파이프라인 (scaffold → dev → build → 인스톨러)
  4. Rust crab(게) 마스코트 (친근한 안내자)

---

## 11. 산출물 목록 (Deliverables — 기획 단계)

본 SPEC(기획)이 완료되면 다음 산출물이 존재한다:

- `spec.md` (본 문서) — 오디언스 계약, "왜", 페이지 구성, 비교 매트릭스.
- `roadmap.md` — P1\~P7 세부 분해, 우선순위, 의존 그래프. *(후속 작성)*
- `design-guide.md` — 시리즈 상속 + Tauri 액센트, 일러스트 4종 방향. *(후속 작성)*
- `content-plan.md` — 섹션별 카피 방향, 삽입 자산 목록. *(후속 작성)*
- `ia-sitemap.md` — 페이지 트리, 파일명. *(후속 작성)*

> 본 기획서(spec.md)만 우선 납품. 나머지 4종은 기획 승인 후 순차 작성. \*\*구현(HTML/CSS/JS 페이지)\*\*은 별도 IMPL SPEC(SPEC-TAURI-IMPL-\*)에서.

---

## 12. 성공 기준 (Success Criteria, EARS-lite)

> 본 SPEC은 "기획 문서"라 코드 산출이 아니다. 수용 기준은 기획 완성도로 잰다.

- **REQ-001 (왜/어떻게/무엇으로)**: UBIQUITOUS — 본 SPEC이 "왜 Tauri"(2절), "어떻게 흐름"(6.2절), "무엇으로"(6.3\~6.4절) 세 질문에 각각 답할 것 SHALL.
- **REQ-002 (Electron 비교)**: UBIQUITOUS — 7절 비교 매트릭스가 크기·메모리·보안·모바일·성숙도·장벽을 객관적으로(양쪽 장단) 담을 것 SHALL.
- **REQ-003 (Rust 얕게)**: UBIQUITOUS — 8절이 Rust 7가지 대표 문법만 다루고 언어 심층 해설은 범위 밖으로 둘 것 SHALL.
- **REQ-004 (시리즈 일관성)**: UBIQUITOUS — 톤(비유 먼저), 토큰, side-note 체계를 tmux/Git 가이드와 일치시킬 것 SHALL (Tauri 액센트 1종 추가는 허용).
- **REQ-005 (구현 분리)**: UBIQUITOUS — 본 SPEC은 기획만 다루고, 실제 페이지 구현은 별도 IMPL SPEC으로 위임할 것 SHALL.

---

## 13. 범위 외 (Out of Scope)

명시적으로 본 기획에서 빼는 것:

- **Rust 언어 심층 학습**(소유권·수명·트레이트 심화) → 별도 Rust 입문 자료 권장.
- **실제 페이지 구현**(HTML/CSS/JS) → SPEC-TAURI-IMPL-\*.
- **모바일 배포 스토어 절차**(App Store/Play Store 인증·심사) — P6에서 "가능하다"까지만 언급.
- **CI/CD 파이프라인**(GitHub Actions로 Tauri 빌드) — 심화, 별도 기회.
- 프론트엔드 프레임워크 특화 튜토리얼(React/Vue 각각) — "둘 다 된다"까지만.

---

## 14. 리스크 (Risks)

| 리스크 | 영향 | 완화 |
| --- | --- | --- |
| Rust 진입장벽 → 학습 이탈 | 가이드가 "어렵다"고 인식 | P5에서 얕게 7가지만, 비유 주방으로 친숙화. "Rust를 다루는 게 아니다" 명시 |
| Electron 대비 자료 부족 | 예제/사례 한정 | Tauri 공식 문서·예제 인용, 비교 매트릭스로 객관성 유지 |
| OS 웹뷰 차이(특히 Linux WebKitGTK) | "운영체제마다 미세 차이" 혼란 | P7 QA에서 "웹뷰 의존성은 트레이드오프"로 명시 |
| 프로젝트명(cli-guide)과 주제 불일치 | 시리즈 일관성 흐트러짐 | 랜딩 "터미널 친구들"을 "개발자 친구들"로 넓히는 방향(별도 논의) |
| Tauri 버전 변화(v1→v2 API 차이) | 예제 구식화 | v2(2024\~) 기준으로 통일, 본 SPEC에 버전 명시 |

---

## 15. 관련 산출물 (Related)

- **SPEC-TMUX-GUIDE-001** — 시리즈 1편. 톤·토큰·비유 스타일 기준점.
- **SPEC-GIT-GITHUB-GUIDE-001** — 시리즈 2편. 멀티페이지 구조·기획 산출물 포맷 원천.
- **SPEC-GIT-GITHUB-IMPL-001** — P1 셸(5 CSS + 3 JS). 본 가이드 P1이 재사용.
- 후속(구현): `SPEC-TAURI-IMPL-001` \~ `SPEC-TAURI-IMPL-007` (본 기획 승인 후).

---

## HISTORY

- 2026-06-20: 최초 작성. 시리즈 3편으로 Tauri(Rust) 데스크톱 앱 개발 가이드 기획. 탄생 배경(2절)· "왜"(2.3)·개발 흐름(6.2)·Electron 비교(7절)·Rust 대표 문법 얕게(8절)·도구 카탈로그(9절) 구성. P1\~P7 로드맵 확정. Rust 심층·페이지 구현·CI/CD를 명시적 범위 외로 지정. status: Planned (기획 단계).
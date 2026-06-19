---
id: SPEC-GIT-GITHUB-GUIDE-001/content-plan
version: 1.0.1
status: Planned
created: 2026-06-19
updated: 2026-06-19
author: jw
priority: High
---

# 콘텐츠 플랜 — 비개발자를 위한 Git/GitHub 멀티페이지 학습 가이드

> 본 파일은 **기획 산출물** 이다. 코드 없음. 한국어 카피는 "방향(direction)"이며, 실제 라이팅은 이후 구현 Phase에서 다듬어진다. 모든 git 팩트는 git-scm.com/docs 기준, GitHub 기능은 docs.github.com 기준으로 검증되었다.

---

## 1. 곁가지(Side-note) 시스템 — 시리즈 공유 + 1종 추가

### 1.1 시리즈 공유 5종 (tmux 가이드와 동일, 결속 위해 필수)

| 타입 | 한국어 라벨 | 색상 톤 | 목적 | 배치 기준 |
| --- | --- | --- | --- | --- |
| **비유 박스** | "이렇게 생각해보세요" | 따뜻한 노랑 | 기술 개념을 일상에 빗댄 비유 | 모든 핵심 개념 첫 등장 시 의무 1개 |
| **역사 박스** | "옛날 이야기" | 빈티지 베이지 | 용어/도구의 기원 (Linus 2005, Driessen 2010 등) | Concept, History, Workflow Models |
| **팁 박스** | "꼭 알아두면 좋아요" | 민트 | 자주 쓰는 팁 / 꿀팁 | Basics, Staging, Remote, Actions |
| **주의 박스** | "잠깐, 주의!" | 부드러운 코랄 | 함정/실수 주의 (force push, reset --hard 등) | Undo, Remote, Merge, Security |
| **알아두면 좋은 박스** | "알아두면 좋은" | 연한 라벤더 | 심화 맥락 (꼭 안 써도 되지만 풍성해짐) | 전 구간, 특히 Advanced, Extras |

### 1.2 신규 6종: "이렇게도 쓸 수 있어요" 사례 콜아웃 박스

| 타입 | 한국어 라벨 | 색상 톤 | 목적 |
| --- | --- | --- | --- |
| **사례 콜아웃 박스** | "이렇게도 쓸 수 있어요" | 따뜻한 초록 (git 액센트) | 튜토리얼 페이지에서 사례 갤러리의 해당 카드로 "점프" 유도. "아\~ 이렇게도 쓸 수 있구나" 순간 설계 |

**추가 정당성 (왜 6번째 박스가 필요한가)**:

- 사례 갤러리가 본 사이트의 **시그니처 기능** (사용자가 명시적으로 강조).
- 튜토리얼 본문과 사례 갤러리를 잇는 "다리" 역할이 없으면, 두 영역이 단절됨.
- 비유/팁 박스와 시각적으로 구분되는 색(따뜻한 초록)으로 "이건 다른 영역으로 가는 문"임을 직관화.
- 각 튜토리얼 페이지마다 1\~2개 배치 → 독자가 학습 중 "이게 내 일에 어떻게 쓰이지?"라는 질문이 생길 즉시 사례로 연결.

**배치 원칙**:

- 튜토리얼 T03(commit) → 사례 "소설가의 원고 버전 관리"
- 튜토리얼 T06(branch) → 사례 "디자이너의 대안 디자인 브랜치"
- 튜토리얼 T11(undo) → 사례 "법률가의 계약서 변경 추적"
- 튜토리얼 T18(Actions) → 사례 "뉴스레터 자동 발행 via GitHub Pages"
- 등등 (페이지별 매핑은 아래 섹션 3 참조)

### 1.3 전체 배치 원칙

- 모든 기술 용어 첫 등장 앞에는 반드시 "비유 박스" 1개. (오디언스 계약 준수)
- 한 페이지당 side-note는 3\~6개. (tmux 단일 페이지보다 페이지당 분량은 적지만, 총 27페이지라 총량은 훨씬 많음)
- 주의 박스는 "공포/데이터 손실" 가능 지점(force push, reset --hard, 공개 repo 실수 등)마다 의구심을 미리 풀어준다.
- 사례 콜아웃 박스는 학습한 개념이 "실생활에 어떻게 쓰이는지"를 즉시 연결.

---

## 2. 서사 흐름 (Narrative Arc Rationale) — 왜 이 페이지 순서인가

튜토리얼 트랙 T01\~T21의 순서는 다음 논리로 설계되었다:

### 파트 1 (T01\~T05): Git 기초 — "왜? 뭔지? 어떻게?"

1. **Concept(T01) → Setup(T02)**: 먼저 "버전 관리가 뭔지, 왜 필요한지"를 비유로 그리고, 그림 위에서 "그럼 내 컴퓨터에 깔아볼까?"로 자연스럽게 설치.
2. **Basics(T03) → Staging(T04)**: 가장 기본 사이클(수정→묶기→기록)을 먼저 맛보고, 그 다음 "묶기 전에 대기하는 방"이라는 staging 영역을 깊이 파냄. staging을 이해해야 diff/reset이 와닿는다.
3. **History(T05)**: 기록을 남긴 뒤에야 "그 기록들을 어떻게 읽나?"가 의미를 갖는다.

### 파트 2 (T06\~T08): 브랜치·병합 — "평행 우주의 탄생"

4. **Branch(T06) → Merge(T07) → Rebase(T08)**: 평행 우주(브랜치)를 만들고, 합치고(병합), 더 깔끔하게 다시 쓰는(리베이스) 순서. merge vs rebase 트레이드오프는 두 개념 모두 이해한 뒤에야 가능.

### 파트 3 (T09\~T13): 원격·복구·고급 — "세상과 연결되고, 실수를 되돌리고"

5. **Remote(T09)**: 로컬 개념이 다 쌓인 뒤 "이제 남들과 공유하려면?"으로 원격.
6. **Tag(T10) → Undo(T11)**: 공유 전에 "버전 표시"를 배우고, "실수했을 때 어떡하지?"(공포 해소)를 다룬다. Undo는 비개발자에게 가장 큰 안도감을 주는 클라이맥스 중 하나.
7. **Advanced(T12) → Config(T13)**: 기본이 탄탄해진 뒤 고급 기법과 입맛 설정으로 확장.

### 파트 4 (T14\~T17): GitHub 협업 — "마을에 들어가서 대화하기"

8. **github-concept(T14)**: Git(도구)과 GitHub(마을)을 명확히 구분. 이 구분 없으면 PR/Issue 혼란.
9. **Repo(T15) → Issues/PR(T16) → Review(T17)**: 나의 공간을 만들고, 대화를 시작하고, 코드를 키워주는 리뷰.

### 파트 5 (T18\~T21): GitHub 자동화·보안·워크플로우 — "전문가처럼 일하기"

10. **Actions(T18) → Security(T19)**: 로봇 비서를 고용하고, 안전하게 지킨다.
11. **Workflow Models(T20)**: "그래서 우리 팀은 어떻게 일할까?" — 모든 협업 패턴 비교.
12. **Extras(T21)**: Releases, Codespaces, Copilot 등 생태계 소개로 마무리.

> 핵심: **공포(실수, 잃어버림)는 그 개념을 이해한 직후에 해소**. 개념이 없는 상태에서 해결책을 들어도 와닿지 않는다. 따라서 Undo(T11)는 Basics\~Remote 이후, Security(T19)는 Actions 등 기초 협업 이후에 배치.

---

## 3. 페이지별 카피 방향 (Per-Page Copy Direction)

> 아래 헤드라인/서브헤드/본문 1\~2문장은 톤을 보여주는 방향이다. 모든 기술어 앞에 비유가 선행된다.

### HOME — 홈 허브 (index.html)

- **헤드라인(방향)**: "Git과 GitHub, 한 권의 친절한 안내서"
- **서브헤드(방향)**: "버전 관리를 처음 듣는 분도, 커밋·브랜치·PR이 궁금한 분도. 따뜻한 비유로 하나씩 풀어드려요."
- **본문(방향)**: "개발자들이 매일 쓰는 Git과 GitHub을, 코딩을 모르는 분도 처음부터 끝까지 읽기만 해도 이해할 수 있도록 풀어냈어요. 두 길을 드려요 — 처음부터 순서대로, 혹은 필요할 때 찾아서."
- **에셋**: 따뜻한 일러스트(commit 그래프가 나무처럼 뻗는 모습) + 세 개의 큰 문 카드(트랙/참조/사례) + 검색창 + 시리즈 링크.
- **사례 콜아웃**: "소설가·법률가·리눅스 커널까지 — 이렇게도 써요" 미리보기 카드 3개.

---

### T01 — 버전 관리가 뭔가요? (git-concept.html)

- **헤드라인(방향)**: "시간을 되돌릴 수 있는 사진첩 — 버전 관리란"
- **서브헤드(방향)**: "문서를 고칠 때마다 '최종', '진짜최종', '진짜진짜최종' 파일을 만드셨나요? 버전 관리는 그 짓을 안 해도 되게 해 주는, 시간 여행 사진첨이에요."
- **본문 방향**:
  - "먼저 비유로 시작할게요. 컴퓨터 파일이 '책의 한 페이지'라 상상해 보세요. 수정할 때마다 그 페이지를 통째로 복사해서 사진첩에 한 장씩 붙이는 거예요. 언제든 과거 페이지로 돌아갈 수 있고, 두 페이지를 나란히 비교할 수도 있어요. 이 사진첩이 바로 **버전 관리 시스템(Version Control System)** 이에요."
  - 연결 용어: 사진첩 → 저장소(repository), 사진 한 장 → 커밋(commit).
  - "Git은 그 사진첩 중에서도 가장 많이 쓰이는 하나예요. 2005년에 Linus Torvalds가 만들었어요 — 리눅스를 만든 그 사람이요."
- **핵심 개념**: VCS, 분산 vs 중앙 집중식, 스냅샷(not diff), 3 영역 개념 소개, commit + SHA-1, 불변성(immutability), HEAD.
- **에셋**: 분산 vs 중앙 비교 다이어그램, 스냅샷-not-diff 시각화.

**연결 side-note**:

- **비유 박스**: "옛날엔 '최종\_진짜최종\_v3\_이게마지막.docx'처럼 파일 이름에 버전을 적었죠. 버전 관리는 그게 필요 없어요. 컴퓨터가 알아서 사진첩에 정리해 주니까요."
- **역사 박스(옛날 이야기)**: "Git이 있기 전에는 CVS, SVN 같은 '중앙 집중식' 사진첨이 먼저였어요. 2005년, Linus Torvalds가 '더 빠르고 분산된 사진첩이 필요하다'며 10일 만에 만든 게 Git의 시작이에요."
- **사례 콜아웃 박스**: "법률가도 계약서 변경을 이렇게 추적해요 →" (T11 undo와 연계)
- **"알아두면 좋은" 박스**: "Git은 '이상한 영어 단어'가 아니에요. 영국식 발음으로 '깃'인데, 원래 '바보 같은'이라는 뜻의 속어에서 왔대요. Linus의 유머."

---

### T02 — Git, 설치하고 첫 인사까지 (git-setup.html)

- **헤드라인(방향)**: "Git, 내 컴퓨터에 초대하기"
- **본문 방향**: "사진첩을 쓰려면 먼저 컴퓨터에 Git이라는 프로그램을 깔아야 해요. 그리고 '내가 누구인지' 한 번만 알려주면 돼요."
- **플랫폼별 설치(카드형)**:
  - **mac**: `brew install git` 또는 Xcode Command Line Tools. "Homebrew라는 앱스토어로 한 줄."
  - **Linux (Ubuntu/Debian)**: `sudo apt install git`. "리눅스의 앱스토어 명령어."
  - **Windows**: Git for Windows 인스톨러. "설치 마법사를 따라 '다음'만 누르면 돼요."
- **config (첫 인사)**:
  - `git config --global user.name "이름"`
  - `git config --global user.email "이메일"`
  - "사진첩에 '이 사진은 누가 찍었어?'라고 묻는데, 그 답을 미리 알려주는 거예요."
- **init / clone**:
  - `git init` — "빈 사진첩을 하나 새로 만들어요."
  - `git clone <주소>` — "누군가 공유한 사진첩을 통째로 복사해 와요."

**연결 side-note**:

- **비유 박스**: "config는 '사진첩에 적힌 내 명함'이에요. 한 번만 찍어두면, 이후 모든 사진에 내 이름이 같이 들어가요."
- **주의 박스(잠깐, 주의!)**: "이메일은 공개 저장소에 보일 수 있어요. GitHub에 올릴 예정이라면 GitHub 제공 noreply 이메일을 쓰는 게 안전해요."
- **사례 콜아웃**: "여러 컴퓨터에서 같은 설정 쓰기 — dotfiles 관리 →" (dotfiles 사례로)

---

### T03 — 수정 → 묶기 → 기록 (git-basics.html)

- **헤드라인(방향)**: "세 단어의 마법 — status, add, commit"
- **본문 방향**: "Git의 하루는 세 단어로 끝나요. (1) 지금 뭐가 바뀌었는지 보고(status), (2) 바뀐 걸 하나로 묶어서(add), (3) 사진첩에 한 장으로 붙이기(commit)."
- **기본 사이클 (가짜 터미널 데모 동반)**:
  - `git status` — "지금 바뀐 파일이 뭔지, 사진첩에 안 붙인 게 뭔지 보여줘."
  - `git add <file>` (또는 `git add .`) — "이 파일의 변경을 '다음 사진'에 넣어줘."
  - `git commit -m "메시지"` — "메시지를 적어서 사진첩에 한 장으로 붙여."
  - `git log` — "지금까지 붙인 사진들 목록 봐."
  - `git show` — "이 사진 하나 자세히 보여줘."
- **--amend**: "방금 찍은 사진의 메시지를 고치고 싶어 → `git commit --amend`. 단, 아직 안 올린 사진만!"

**연결 side-note**:

- **비유 박스**: "add는 '한 묶음으로 포장하기', commit은 '포장한 묶음에 도장 찍어 사진첩에 붙이기'. 포장하기 전에는 얼마든지 뺄 수 있어요."
- **팁 박스**: "처음엔 `git status`를 자주 치세요. Git이 '지금 뭘 해야 할지' 친절히 알려줘요."
- **사례 콜아웃**: "소설가도 이렇게 챕터별로 commit해요 →" (소설가 사례로)
- **주의 박스**: "commit 메시지는 '무엇을'보다 '왜'를 적는 게 나중에 도움돼요."

---

### T04 — 3개의 방: 작업·대기·기록 (git-staging.html)

- **헤드라인(방향)**: "Git에는 방이 3개 있어요"
- **본문 방향**: "Git은 파일의 상태를 3개의 '방'으로 구분해요. (1) **작업 방(working directory)** — 지금 고치고 있는 곳. (2) **대기 방(staging area)** — 다음 사진에 넣겠다고 표시한 곳. (3) **기록 방(repository)** — 사진첩에 영구히 찍힌 곳."
- **diff 변형**:
  - `git diff` — 작업 방 vs 대기 방 (뭘 더 안 넣었나)
  - `git diff --staged` (또는 `--cached`) — 대기 방 vs 마지막 사진 (뭘 넣으려나)
  - `git diff HEAD` — 작업 방 vs 마지막 사진 (전체)
  - `git diff --stat` — 파일별 요약
  - `git diff <파일>` — 특정 파일만
  - `git diff --word-diff` — 줄 단위가 아니라 단어 단위로
  - `git diff branch1..branch2` — 브랜치 간 차이
- **에셋**: 3영역 다이어그램(드래그 드롭 비유: 작업→대기→기록으로 파일이 움직이는 애니메이션).

**연결 side-note**:

- **비유 박스**: "대기 방(staging)은 '사진을 찍기 전에 인물을 정렬하는 무대' 같아요. 무대에 올린 사람만 사진에 찍혀요."
- **팁 박스**: "한 사진에 너무 많은 변경을 넣지 마세요. 주제별로 나눠 찍으면 나중에 되돌리기 쉬워요."
- **사례 콜아웃**: "디자이너도 에셋 변경을 주제별로 묶어요 →"

---

### T05 — 과거로 여행하기 (git-history.html)

- **헤드라인(방향)**: "히스토리, 읽는 법과 탐정하는 법"
- **본문 방향**: "사진첩에 사진이 많이 쌓였어요. 어떻게 읽나요?"
- **log 변형**:
  - `git log --oneline` — 한 줄 요약
  - `git log --graph --all --oneline` — 그래프로 (브랜치 흐름)
  - `git log -p` — 각 사진의 diff까지
  - `git log --stat` — 파일 통계
- **blame**: `git blame <파일>` — "이 줄은 누가 언제 적었어?" (탐정 도구).
  - 사례 콜아웃: "법률가도 계약서 줄마다 blame을 쓸 수 있어요."
- **reflog**: `git reflog` — "내가 커서(HEAD)를 어디로 옮겼는지 모든 기록. 숨겨진 흑역사 사진첨."
  - undo 페이지(T11)와 직결. "잃어버린 커밋도 reflog에 남아 있어요."
- **show**: `git show <커밋>` — 특정 사진 상세.

**연결 side-note**:

- **비유 박스**: "log는 사진첩을 넘기는 것, blame은 사진 속 인물에게 화살표 짚는 것, reflog는 '내가 사진첩을 언제 어디로 옮겼나' 숨겨진 발자국."
- **역사 박스**: "git log --graph는 Git 2.0대부터 기본 그래프 옵션으로 자리잡았어요."

---

### T06 — 평행 우주를 만드는 법: 브랜치 (git-branch.html)

- **헤드라인(방향)**: "같은 시점에서 갈라지는 또 하나의 세계"
- **본문 방향**: "소설을 쓰다가 '결말을 두 가지로 써보고 싶다'고 해요. 원본을 망치지 않고 실험할 수 있게, Git은 '평행 우주'를 만들어 주는데 그걸 **브랜치(branch)** 라고 불러요."
- **기본 명령**:
  - `git branch <이름>` — 새 평행 우주 만들기
  - `git switch <이름>` (구 `git checkout <이름>`) — 그 우주로 이동
  - `git switch -c <이름>` — 만들면서 이동
  - `git branch` — 목록 보기
  - `git branch -d <이름>` — 삭제
- **HEAD**: "지금 내가 발을 딛고 있는 우주의 표시. HEAD는 '나 여기 있어'라는 깃발."
- **detached HEAD**: "브랜치가 아니라 특정 사진에 직접 서면 HEAD가 '분리'돼요. 위험하지만 과거를 둘러보는 데는 유용해요."
- **에셋**: **commit 그래프 시각화(핵심)** — 가지가 뻗어나가는 인터랙티브 그래프.

**연결 side-note**:

- **비유 박스**: "브랜치는 '원본을 손대지 않고 실험하는 복제 방'. 실험이 맘에 들면 원본에 합치면 되고, 맘에 안 들면 그냥 방을 버리면 돼요."
- **사례 콜아웃**: "디자이너도 대안 디자인을 브랜치로 실험해요 →"
- **주의 박스**: "아직 안 합친 브랜치를 삭제하면(`-d` 대신 `-D`) 그 우주의 작업이 사라져요."

---

### T07 — 두 세계가 하나로: 병합과 충돌 (git-merge.html)

- **헤드라인(방향)**: "평행 우주 합치기 — 그리고 부딪혔을 때"
- **본문 방향**: "두 브랜치를 하나로 합치는 걸 **병합(merge)** 이라고 해요. 대개는 자동으로 되는데, 같은 줄을 두 사람이 다르게 고쳤을 땐 '충돌(conflict)'이 나요. 당황하지 마세요, 해결책이 있어요."
- **병합 두 종류**:
  - **Fast-forward**: 한쪽만 앞으로 갔을 때, 그냥 따라가기. (비유: "한 길만 걸었으니 그냥 그 길로.")
  - **3-way merge**: 양쪽 다 변했을 때, 공통 조상 기준으로 합치기. (비유: "두 갈래 길을 만나서 합류점을 새로 만드는 것.")
- **충돌 해결 절차**:
  1. `git merge <브랜치>` → 충돌 메시지.
  2. 충돌 난 파일 열기 → `<<<<<<<`, `=======`, `>>>>>>>` 표시 확인.
  3. 두 버전 중 하나/둘 다 합쳐서 직접 수정.
  4. `git add <파일>` → `git commit`.
- **에셋**: **충돌 해결 미니 시뮬레이션** — 충돌 난 파일에서 두 버전 토글하며 선택.

**연결 side-note**:

- **비유 박스**: "충돌은 두 사람이 같은 문단을 각자 고쳤을 때 일어나요. Git은 어느 쪽이 '맞는지' 모르기 때문에 우리에게 결정을 맡기는 거예요. 실패가 아니라 '너 결정해줘'라는 부탁이에요."
- **주의 박스**: "충돌 해결 중 `git merge --abort`면 병합 전으로 안전하게 돌아갈 수 있어요."
- **팁 박스**: "충돌이 자주 난다면 브랜치를 더 짧게 유지하고 자주 병합하세요."

---

### T08 — 역사를 깔끔하게 다시 쓰기: 리베이스 (git-rebase.html)

- **헤드라인(방향)**: "사진첩의 순서를 다시 정리하기"
- **본문 방향**: "병합은 합치기만 하고 순서를 안 건드려요. 리베이스(rebase)는 '내 사진들을 다른 우주의 맨 끝으로 다시 옮겨 놓기'예요. 역사가 한 줄로 깔끔해지지만, 조심할 점도 있어요."
- **기본**: `git rebase <브랜치>` — 현재 브랜치의 커밋들을 그 브랜치 끝으로 재배치.
- **interactive rebase**: `git rebase -i HEAD~3` — 최근 3개 커밋을 고치기.
  - pick, squash(합치기), reword(메시지 고치기), reorder(순서 바꾸기), drop(버리기).
- **rebase vs merge 트레이드오프**:
  - rebase: 깔끔한 한 줄 역사. 단, 커밋을 '다시 쓰기'에 이미 공유한 커밋엔 위험.
  - merge: 역사가 그대로 보존. 단, 병합 커밋이 섞여 지저분해질 수 있음.
- **pull --rebase**: "받아올 때 병합 대신 리베이스로."

**연결 side-note**:

- **주의 박스(핵심!)**: "**공개된(이미 push한) 브랜치는 리베이스하지 마세요.** 남이 이미 그 사진들을 보고 있어요. 사진을 다시 쓰면 혼란이 와요."
- **역사 박스**: "'rebase vs merge' 논쟁은 2010년대 Git 커뮤니티의 영원한 주제예요. 팀마다 규칙이 달라요."

---

### T09 — 세상과 연결되기: 원격 저장소 (git-remote.html)

- **헤드라인(방향)**: "내 사진첩, 다른 컴퓨터와 공유하기"
- **본문 방향**: "지금까지는 내 컴퓨터 안에서만. 이제 다른 컴퓨터(GitHub 서버, 동료 컴퓨터)와 사진첩을 연결해요. 그게 **원격 저장소(remote)** 예요."
- **기본 명령**:
  - `git remote add origin <주소>` — 원격 사진첩 연결
  - `git fetch` — 원격의 변경 '가져와서 보기만' (적용 안 함)
  - `git pull` — fetch + merge (가져와서 합치기)
  - `git push` — 내 사진을 원격으로 올리기
  - `git clone <주소>` — 원격 사진첩을 통째로 복사
  - `git pull --rebase` — pull을 병합 대신 리베이스로
- **fetch vs pull**: "fetch는 '엿보기', pull은 '엿보고 합치기'. pull이 편하지만, 변화를 먼저 보고 싶을 땐 fetch."

**연결 side-note**:

- **비유 박스**: "원격 저장소는 '구름 위의 사진첨'. push는 '올리기', pull은 '받아오기'. 같은 사진첩을 여러 기기에서 동기화할 수 있어요."
- **주의 박스**: "force push(`git push --force`)는 원격의 역사를 내 것으로 덮어써요. 다른 사람의 작업이 날아갈 수 있어요. 정말 필요할 때만, 그리고 `--force-with-lease`로 안전하게."
- **사례 콜아웃**: "dotfiles — 여러 컴퓨터 설정 동기화 →"

---

### T10 — 버전, 딱 붙이기: 태그 (git-tag.html)

- **헤드라인(방향)**: "'이 사진이 v1.0이야' — 표시 붙이기"
- **본문 방향**: "특정 사진에 '이건 1.0 배포판이야'라고 이름표를 붙이는 걸 **태그(tag)** 라고 해요."
- **두 종류 태그**:
  - **lightweight**: 단순 이름표. `git tag v1.0`.
  - **annotated**: 메시지·만든 사람·날짜가 포함된 정식 이름표. `git tag -a v1.0 -m "메시지"`.
- **semantic versioning (SemVer)**: `v1.2.3` — 주(major).부(minor).수(patch).
  - 주: 큰 변화(호환 안 됨). 부: 새 기능(호환 됨). 수: 버그 수정.
- **태그 공유**: `git push origin v1.0` 또는 `git push --tags`.

**연결 side-note**:

- **비유 박스**: "태그는 사진첩의 한 페이지에 '책갈피 + 제목'을 붙이는 거예요. 나중에 '아, v1.0이 어디 있더라' 할 때 바로 찾을 수 있게."
- **사례 콜아웃**: "음악가도 악보 버전을 v1.0, v2.0으로 붙여요 →"

---

### T11 — 실수했다고요? 괜찮아요: 되돌리기 (git-undo.html)

- **헤드라인(방향)**: "Git에서는 거의 모든 걸 되돌릴 수 있어요"
- **본문 방향**: "이 페이지가 제일 중요할지도 몰라요. 비개발자가 Git을 두려워하는 가장 큰 이유가 '실수하면 날아가지 않을까'인데, 사실 Git은 꽤 안전한 편이에요. 방법을 알면요."
- **되돌리기 도구 4종**:
  - **reset**: `git reset --soft`(사진만 뒤로) / `--mixed`(대기 방까지, 기본) / `--hard`(작업 방까지 완전히).
    - 비유: "사진첩에서 사진 몇 장을 떼어내기. 떼어낸 뒤 대기 방/작업 방까지 비울지 선택."
  - **revert**: `git revert <커밋>` — 그 사진을 '취소하는 새 사진'을 찍기. 역사를 안 지움.
    - 비유: "사진을 떼어내는 게 아니라, '이 사진 취소합니다'라는 취소 사진을 새로 찍기. 공개된 사진첩에 안전."
  - **restore**: `git restore <파일>` — 파일을 마지막 사진 상태로 되돌리기. `--staged`로 대기 방에서도 빼기.
  - **checkout &lt;파일&gt;** (구): restore의 이전 명령.
  - **clean**: `git clean -fd` — 추적 안 되는 새 파일들 삭제. 주의!
- **reflog로 잃어버린 커밋 찾기**: `git reflog` → `git reset --hard <reflog의 해시>`.
- **"Oh Shit Git" 패턴** (실제 자주 묻는 복구 시나리오):
  - "잘못 브랜치에서 커밋했어요" → cherry-pick 또는 브랜치 생성 후 reset.
  - "reset --hard 했는데 필요했어요" → reflog에서 복구.
  - "force push 해서 동료 작업 날아갔어요" → (이건 정말 조심, reflog·동료 협조로 일부 복구).
- **에셋**: **"Oh Shit Git" 인터랙티브 복구 시뮬레이터** — 실수 상황 고르기 → 복구 명령 + 설명.

**연결 side-note**:

- **비유 박스**: "Git의 사진첨은 한 번 찍은 사진을 안전한 쓰레기통(reflog)에도 복사해 둬요. 기본적으로 도달 가능한 사진은 90일, 그렇지 않은 사진도 30일간 보관돼요. 쓰레기통을 비우지 않는 한 거의 다 꺼낼 수 있어요."
- **주의 박스(핵심!)**: "`reset --hard`는 작업 방의 파일까지 덮어써요. 아직 사진으로 안 찍은 변경은 정말 날아가요. 커밋 안 한 변경엔 쓰지 마세요."
- **주의 박스**: "`revert`는 공개 저장소에서 쓰고, `reset`은 로컬에서 써요. 이미 push한 건 revert로."
- **사례 콜아웃**: "법률가 — 계약서 '이전 버전으로 돌아가기' →"

---

### T12 — 한 단계 더 깊이: 고급 기법 (git-advanced.html)

- **헤드라인(방향)**: "필요할 때 찾게 되는 고급 도구들"
- **본문 방향**: "이 도구들은 매일 안 써도, '아 그때 이걸 알았으면' 순간이 반드시 와요. 가볍게 훑어보세요."
- **도구 소개(각각 비유 1문장 + 언제 쓰는지)**:
  - **cherry-pick**: 다른 브랜치의 특정 사진만 딱 하나 가져오기. (비유: "체리 한 알만 따오기.")
  - **stash**: 작업 중인 변경을 잠시 서랍에 넣기. (비유: "방 청소하느라 물건 잠시 서랍에.")
  - **bisect**: 이진 탐색으로 '버그가 처음 생긴 사진' 찾기. (비유: "사진첩 반씩 쪼개며 범인 찾기.")
  - **submodule**: 한 사진첨 안에 다른 사진첨을 끼워 넣기. (비유: "책 안에 다른 책을 부록으로.")
  - **worktree**: 같은 사진첨을 여러 폴더에서 동시에 열기. (비유: "같은 책을 여러 책상에 펴놓기.")
  - **git filter-repo**: 역사 전체에서 특정 파일/비밀번호 제거. (비유: "사진첩 전체에서 한 사람 모자이크.")
- **에셋**: cherry-pick/stash 간단 애니메이션.

**연결 side-note**:

- **주의 박스**: "비밀번호를 실수로 커밋했다면 filter-repo로 역사에서 제거해야 해요. 그리고 비밀번호를 바꿔요. reset만으로는 원격에 남아있어요."
- **"알아두면 좋은" 박스**: "stash는 '잠깐 비켜' 명령어. 브랜치를 바꿔야 하는데 커밋하기엔 이를 때 유용해요."

---

### T13 — Git을 내 입맛대로: 설정과 파일들 (git-config-files.html)

- **헤드라인(방향)**: "Git, 나에게 맞게 조립하기"
- **본문 방향**: "Git은 설정 파일과 무시 파일, 훅, 대용량 파일 처리로 입맛대로 조립할 수 있어요."
- **주요 파일/기능**:
  - **.gitignore**: "이 파일들은 사진첨에 넣지 마!" (비밀번호, 빌드 결과물 등).
  - **.gitattributes**: 줄바꿈 처리, 바이너리 판별 등.
  - **hooks(client-side)**: 커밋 전/푸시 전에 자동으로 실행되는 작은 스크립트.
  - **Git LFS**: 큰 파일(이미지·영상)은 특별 저장소에.
  - **aliases**: `git l` → `git log --oneline`처럼 줄여 쓰기.
- **대표적 .gitignore 예시**: `.env`, `node_modules/`, `*.log`, `build/`, OS별 쓰레기 파일.

**연결 side-note**:

- **주의 박스(핵심!)**: "`.env`처럼 비밀이 든 파일은 반드시 .gitignore에! 실수로 push하면 비밀이 공개돼요. (Security T19와 연계)"
- **팁 박스**: "github.com/github/gitignore에 흔한 언어/프레임워크별 .gitignore 템플릿이 있어요."

---

### T14 — Git은 도구, GitHub는 마을 (github-concept.html)

- **헤드라인(방향)**: "Git과 GitHub, 다른 거예요"
- **본문 방향**: "혼동하기 쉬운 두 단어부터 정리할게요. Git은 '사진첨 프로그램'이고, GitHub는 그 사진첨을 인터넷에 올려놓고 남들과 함께 보는 **마을** 이에요."
- **비유 표**:

  | Git | GitHub |
  | --- | --- |
  | 사진첨 프로그램 | 사진첨을 모아두는 인터넷 마을 |
  | 내 컴퓨터에서 | 클라우드에서 |
  | 도구 | 서비스 (도구 위에 얹힌) |
- **GitHub가 특별한 이유**: social coding — 코드에 '좋아요'를 누르고, 복사(fork)하고, 제안(pull request)하고, 논의(issue). 단순 저장소 이상의 협업 공간.
- **역사**: 2008년 GitHub 출시. 이전엔 SourceForge, Google Code 등.

**연결 side-note**:

- **비유 박스**: "Git이 '연필'이라면, GitHub는 '모두가 글을 올리는 게시판'. 연필 없이 게시판이 안 되지만, 연필만 있다고 게시판이 되진 않아요."
- **역사 박스**: "GitHub는 2008년 샌프란시스코에서 시작됐어요. 'Git을 더 쉽게 함께 쓰자'는 아이디어. 2018년 Microsoft가 인수."
- **사례 콜아웃**: "리눅스 커널, 공공 데이터도 GitHub에 →" (Tier 2 사례로)

---

### T15 — 나의 첫 저장소 (github-repo.html)

- **헤드라인(방향)**: "GitHub에 나의 첫 사진첨 만들기"
- **본문 방향**: "GitHub에 올리는 사진첨을 **저장소(repository)** 라고 불러요."
- **기본**:
  - **create**: GitHub 사이트에서 "New repository". 또는 `gh repo create` (GitHub CLI).
  - **clone**: 남의 저장소를 내 컴퓨터로 복사.
  - **fork**: 남의 저장소를 '내 GitHub 계정으로' 복사. (비유: "남의 레시피북을 내 책장으로 베껴오기.")
  - **template repo**: 템플릿으로 만들어두고 반복해서 새 저장소 찍어내기.
  - **import**: 다른 곳(GitLab, Bitbucket)의 저장소를 GitHub로 가져오기.

**연결 side-note**:

- **비유 박스**: "fork는 '남의 사진첨을 통째로 내 계정으로 베껴오기'. 원본에 영향 안 주고 마음대로 고쳐볼 수 있어요. 고친 걸 원본에 제안하고 싶으면 pull request(T16)로."
- **사례 콜아웃**: "오픈소스 기여 흐름: fork → clone → PR →" (Tier 2 사례로)

---

### T16 — 대화로 코드를 만드는 법: Issue와 PR (github-issues-pr.html)

- **헤드라인(방향)**: "GitHub에서 대화하는 두 가지 방법"
- **본문 방향**: "GitHub는 단순 저장소가 아니라 대화 공간이에요. 두 가지 대화 방식이 있어요."
- **Issue**: "이거 버그 있어요", "이런 기능 있으면 좋겠어요" — 문제 제기 카드.
  - templates: 버그 리포트/기능 요청 양식 미리 만들기.
  - labels: `bug`, `feature`, `help wanted` 등 색깔 라벨.
  - milestones: "v1.0까지 이 이슈들 끝내자" 묶음.
- **Pull Request (PR)**: "내가 고친 거 같이 볼래요?" — 코드 변경 제안 카드.
  - draft PR: "아직 작성 중인데 미리 보여드려요."
  - review: 동료가 코드 한 줄씩 보며 의견.
  - approve / comment / request changes.
  - resolve conflicts: GitHub 웹에서 간단 충돌 해결.
  - **merge 전략 3종**:
    - **squash merge**: 브랜치의 모든 커밋을 하나로 합쳐서 병합.
    - **rebase merge**: 커밋들을 그대로 리베이스 형태로 이어붙이기.
    - **merge commit**: 병합 전용 커밋을 하나 만들어서 합치기 (기본).
- **에셋**: **PR 워크플로우 애니메이션** — fork → branch → commit → push → PR → review → merge 흐름.

**연결 side-note**:

- **비유 박스**: "Issue는 '건의함', PR은 '초안을 가져왔으니 검토해 주세요' 카드. PR이 더 능동적이에요."
- **사례 콜아웃**: "교사도 학생 과제를 PR로 받아요 →"
- **"알아두면 좋은" 박스**: "Discussions, Wiki, Projects(v2)도 함께 쓰면 팀 워크가 체계화돼요."

---

### T17 — 코드 리뷰, 서로 키워주는 시간 (github-review.html)

- **헤드라인(방향)**: "좋은 리뷰는 칭찬이자 훈련"
- **본문 방향**: "코드 리뷰는 '틀린 걸 잡는' 자리가 아니라 '서로 더 나은 코드로 키우는' 자리예요."
- **리뷰 도구**:
  - review comments: 코드 한 줄에 코멘트.
  - suggestions: "이렇게 바꾸면 어떨까요" 제안 (클릭 한 번으로 적용).
  - CODEOWNERS: 특정 폴더/파일은 지정된 사람이 무조건 리뷰.
  - branch protection: main 브랜치를 함부로 못 건드리게 잠그기.
  - required reviews: 최소 N명의 승인 필수.
  - status checks: CI 통과해야 병합 가능.
- **에셋**: 리뷰 흐름 다이어그램 (comment → resolve → approve → merge).

**연결 side-note**:

- **팁 박스**: "리뷰 코멘트는 '사람'이 아니라 '코드'에. '이 부분은 \~한 이유로 \~하면 좋겠어요'가 '이거 왜 이래?'보다 백번 낫습니다."
- **사례 콜아웃**: "오픈소스도 이렇게 리뷰해요 →"

---

### T18 — 로봇 비서를 고용하세요: GitHub Actions (github-actions.html)

- **헤드라인(방향)**: "내가 자리 비울 때 대신 일하는 로봇"
- **본문 방향**: "GitHub Actions은 '이런 일이 일어나면 이렇게 해줘'라는 로봇 비서예요. push할 때마다 자동으로 테스트, main에 합치면 자동으로 배포… 이런 걸 로봇이 해요."
- **워크플로우 .yml 구조**:
  - **events**: 누가/언제 (push, pull_request, schedule, workflow_dispatch).
  - **jobs**: 어떤 작업 묶음.
  - **steps**: 한 job 안의 단계.
  - **runners**: 어디서 돌리나 (ubuntu-latest, windows-latest 등 GitHub 제공 가상머신).
- **기능**:
  - marketplace actions: 남이 만든 액션 가져다 쓰기.
  - matrix: 여러 버전(Node 20/22 등)에서 동시에 돌리기.
  - secrets: 비밀번호 등 (암호화 저장, 로그에 안 찍힘).
  - variables: 비-비밀 설정값.
  - artifacts: 빌드 결과물 보관.
  - caching: 의존성 캐시로 속도 올리기.
  - environments: dev/staging/prod 환경 구분.
- **CI/CD 개념**: "CI(Continuous Integration)은 자동 테스트, CD(Continuous Deployment)는 자동 배포."
- **GitHub Pages 배포**: Actions로 정적 사이트 자동 배포. (본 사이트도 이렇게 배포 가능!)
- **gh CLI**: 터미널에서 GitHub 조작 (`gh pr create`, `gh issue list`).
- **에셋**: **Actions 파이프라인 애니메이션** — event → job → step → artifact → deploy 흐름.

**연결 side-note**:

- **비유 박스**: "Actions는 '이벤트가 발생하면 자동 실행되는 레시피'. IFTTT/Zapier 같은 자동화 도구의 GitHub 버전이에요."
- **사례 콜아웃**: "뉴스레터 자동 발행, 블로그 자동 배포 →" (Tier 1: GitHub Pages 사례)
- **주의 박스**: "secret은 절대 코드에 직접 적지 마세요. GitHub 설정의 Secrets에 넣고, 워크플로우에서 참조만."

---

### T19 — 안전한 협업의 기술: 보안 (github-security.html)

- **헤드라인(방향)**: "안전하게 함께 일하는 법"
- **본문 방향**: "여럿이 일하면 실수 위험도 커져요. GitHub는 여러 안전망을 제공해요."
- **보안 기능**:
  - **Dependabot**: 의존성 패키지 취약점 알림 + 자동 수정 PR.
  - **secret scanning**: 실수로 비밀번호 토큰을 push하면 즉시 발견.
  - **code scanning**: CodeQL 등으로 코드 자체 취약점 스캔.
  - **branch protection**: main 브랜치 보호 (직접 push 금지, 리뷰 필수).
  - **2FA (2단계 인증)**: 계정 보안의 기본.
  - **commit signing (SSH/GPG)**: "이 커밋은 정말 내가 한 거예요" 서명.
  - **Secrets vs Variables**: Secrets=비밀(암호화), Variables=비-비밀 설정.
- **에셋**: 보안 레이어 다이어그램 (계정/저장소/코드/커밋 4겹).

**연결 side-note**:

- **주의 박스(핵심!)**: "한 번 공개 저장소에 push한 비밀번호는 '지웠다'고 안전하지 않아요. 역사에 남아요. 즉시 비밀번호를 바꾸고, filter-repo로 역사에서 제거해야 해요."
- **사례 콜아웃**: "공공 기관도 GitHub 쓸 때 보안 이렇게 →"

---

### T20 — 어떻게 일할 것인가: 워크플로우 모델 비교 (github-workflow-models.html)

- **헤드라인(방향)**: "팀마다 다른 Git 사용법, 다섯 가지 철학"
- **본문 방향**: "Git은 도구일 뿐, '어떻게 쓸지'는 팀마다 달라요. 유명한 다섯 가지 워크플로우를 비교할게요."
- **5종 비교표**:

  | 워크플로우 | 핵심 | 언제 | 출처 |
  | --- | --- | --- | --- |
  | **GitFlow** | main/develop/feature/release/hotfix 다계층 | 릴리즈 주기 명확한 제품 | Vincent Driessen, 2010 |
  | **GitHub Flow** | main + feature 브랜치, 단순 | 웹 서비스, 잦은 배포 | GitHub |
  | **Trunk-based** | 모두가 main에 직접, 짧은 브랜치 | 대규모, 빠른 통합 | Google/Meta |
  | **Forking** | fork → PR, 원본 저장소 보호 | 오픈소스 | 일반적 |
  | **Release Flow** | GitFlow + trunk 혼합 (MS) | 제품 + 서비스 혼합 | Microsoft |
- **비유**: "GitFlow는 정교한 식당 주방(역할 분담), GitHub Flow는 스몰카페(빠르고 단순), Trunk는 바쁜 길거리 노점(빠른 회전)."

**연결 side-note**:

- **역사 박스**: "Vincent Driessen이 2010년 블로그에 올린 'A successful Git branching model'이 GitFlow의 원조. 10년 넘게 쓰이고 있어요. 본인이 2020년에 '웹 서비스엔 안 맞을 수 있다'고 업데이트하기도."
- **"알아두면 좋은" 박스**: "요즘은 GitHub Flow가 웹 분야에서 사실상 표준. GitFlow는 출시 주기가 명확한 제품에."

---

### T21 — GitHub, 더 넓은 세계 (github-extras.html)

- **헤드라인(방향)**: "GitHub, 알면 알수록 넓어지는 생태계"
- **본문 방향**: "저장소·PR 너머에도 GitHub는 많은 걸 제공해요. 가볍게 둘러보세요."
- **기능 투어**:
  - **Releases**: 태그와 함께 "v1.0 배포 노트" 발행.
  - **Packages / Container registry**: npm·Docker 이미지 등 패키지 호스팅.
  - **Codespaces**: 브라우저만 켜면 바로 개발 환경 (클라우드 IDE).
  - **Copilot**: AI 페어 프로그래머 (코드 자동 완성/생성).
  - **Gists**: 코드 조각 메모 (블로그 코드 블록처럼).
  - **profile README**: 내 GitHub 프로필을 자기소개서로 꾸미기.
  - **organizations / teams**: 여러 저장소·사람을 한 조직으로.

**연결 side-note**:

- **사례 콜아웃**: "이력서·포트폴리오를 GitHub Pages + profile README로 →" (Tier 1 사례)
- **역사 박스**: "Copilot은 2021년 출시. AI가 코드를 짜주는 시대가 현실이 됐어요."

---

## 4. 커버리지 체크리스트 (Coverage Checklist)

> 본 체크리스트는 SPEC이 요구한 Git/GitHub 모든 항목(floor)을 다루는지 검증한다. git 팩트는 git-scm.com/docs, GitHub 기능은 docs.github.com 기준. 누락 금지.

### 4.1 GIT 커버리지

| \# | 항목 | 상태 | 위치 |
| --- | --- | --- | --- |
| G1 | VCS 개념 | ✅ Covered | T01 |
| G2 | 분산 vs 중앙 집중식 | ✅ Covered | T01 |
| G3 | 스냅샷 (not diff) | ✅ Covered | T01 |
| G4 | 3 영역 (working/staging/repo) | ✅ Covered | T01(개념) + T04(심화) |
| G5 | commit + SHA-1 | ✅ Covered | T01, T03 |
| G6 | 불변성 (immutability) | ✅ Covered | T01 |
| G7 | HEAD 개념 | ✅ Covered | T01, T06 |
| G8 | install (mac) | ✅ Covered | T02 |
| G9 | install (linux) | ✅ Covered | T02 |
| G10 | install (windows) | ✅ Covered | T02 |
| G11 | config (user.name/email) | ✅ Covered | T02 |
| G12 | init | ✅ Covered | T02 |
| G13 | clone | ✅ Covered | T02, T09 |
| G14 | status | ✅ Covered | T03 |
| G15 | add | ✅ Covered | T03, T04 |
| G16 | commit (-m, --amend) | ✅ Covered | T03 |
| G17 | log | ✅ Covered | T03, T05 |
| G18 | show | ✅ Covered | T03, T05 |
| G19 | diff (working/staged/committed) | ✅ Covered | T04 |
| G20 | diff --stat | ✅ Covered | T04 |
| G21 | diff 특정 파일 | ✅ Covered | T04 |
| G22 | diff --word-diff | ✅ Covered | T04 |
| G23 | diff 브랜치 간 | ✅ Covered | T04 |
| G24 | log --oneline/--graph/--all/-p | ✅ Covered | T05 |
| G25 | blame | ✅ Covered | T05 |
| G26 | reflog | ✅ Covered | T05, T11 |
| G27 | branch | ✅ Covered | T06 |
| G28 | switch / checkout | ✅ Covered | T06 |
| G29 | 브랜치 모델 | ✅ Covered | T06 |
| G30 | HEAD | ✅ Covered | T06 |
| G31 | detached HEAD | ✅ Covered | T06 |
| G32 | merge (fast-forward) | ✅ Covered | T07 |
| G33 | merge (3-way) | ✅ Covered | T07 |
| G34 | conflict 해결 | ✅ Covered | T07 |
| G35 | rebase | ✅ Covered | T08 |
| G36 | interactive rebase (squash/reword/reorder) | ✅ Covered | T08 |
| G37 | rebase vs merge 트레이드오프 | ✅ Covered | T08 |
| G38 | remote | ✅ Covered | T09 |
| G39 | fetch | ✅ Covered | T09 |
| G40 | pull (vs fetch) | ✅ Covered | T09 |
| G41 | push | ✅ Covered | T09 |
| G42 | clone | ✅ Covered | T09 |
| G43 | pull --rebase | ✅ Covered | T08, T09 |
| G44 | tag (lightweight) | ✅ Covered | T10 |
| G45 | tag (annotated) | ✅ Covered | T10 |
| G46 | semantic versioning | ✅ Covered | T10 |
| G47 | reset (soft) | ✅ Covered | T11 |
| G48 | reset (mixed) | ✅ Covered | T11 |
| G49 | reset (hard) | ✅ Covered | T11 |
| G50 | revert | ✅ Covered | T11 |
| G51 | restore | ✅ Covered | T11 |
| G52 | checkout &lt;file&gt; | ✅ Covered | T11 |
| G53 | clean | ✅ Covered | T11 |
| G54 | "Oh Shit Git" 복구 패턴 | ✅ Covered | T11 (전용 에셋) |
| G55 | cherry-pick | ✅ Covered | T12 |
| G56 | stash | ✅ Covered | T12 |
| G57 | bisect | ✅ Covered | T12 |
| G58 | submodule | ✅ Covered | T12 |
| G59 | worktree | ✅ Covered | T12 |
| G60 | git filter-repo | ✅ Covered | T12 |
| G61 | .gitignore | ✅ Covered | T13 |
| G62 | .gitattributes | ✅ Covered | T13 |
| G63 | hooks (client-side) | ✅ Covered | T13 |
| G64 | Git LFS | ✅ Covered | T13 |
| G65 | aliases | ✅ Covered | T13 |

**GIT 결론: 65/65 항목 covered. gap 없음.**

### 4.2 GITHUB 커버리지

| \# | 항목 | 상태 | 위치 |
| --- | --- | --- | --- |
| H1 | git vs github | ✅ Covered | T14 |
| H2 | hosting platform | ✅ Covered | T14 |
| H3 | social coding | ✅ Covered | T14 |
| H4 | create repo | ✅ Covered | T15 |
| H5 | fork | ✅ Covered | T15 |
| H6 | clone | ✅ Covered | T15 |
| H7 | template repo | ✅ Covered | T15 |
| H8 | import | ✅ Covered | T15 |
| H9 | Issues (templates) | ✅ Covered | T16 |
| H10 | Issues (labels) | ✅ Covered | T16 |
| H11 | Issues (milestones) | ✅ Covered | T16 |
| H12 | PR (draft) | ✅ Covered | T16 |
| H13 | PR (review) | ✅ Covered | T16, T17 |
| H14 | PR (approve) | ✅ Covered | T16, T17 |
| H15 | PR (comment) | ✅ Covered | T16, T17 |
| H16 | PR (resolve conflicts) | ✅ Covered | T16 |
| H17 | PR merge (squash) | ✅ Covered | T16 |
| H18 | PR merge (rebase) | ✅ Covered | T16 |
| H19 | PR merge (merge-commit) | ✅ Covered | T16 |
| H20 | Discussions | ✅ Covered | T16 (side-note) |
| H21 | Wiki | ✅ Covered | T16 (side-note) |
| H22 | Projects (v2) | ✅ Covered | T16 (side-note) |
| H23 | review comments | ✅ Covered | T17 |
| H24 | suggestions | ✅ Covered | T17 |
| H25 | CODEOWNERS | ✅ Covered | T17 |
| H26 | branch protection | ✅ Covered | T17, T19 |
| H27 | required reviews | ✅ Covered | T17 |
| H28 | status checks | ✅ Covered | T17 |
| H29 | Actions (workflow .yml) | ✅ Covered | T18 |
| H30 | Actions (events/jobs/steps/runners) | ✅ Covered | T18 |
| H31 | Actions (marketplace) | ✅ Covered | T18 |
| H32 | Actions (matrix) | ✅ Covered | T18 |
| H33 | Actions (secrets) | ✅ Covered | T18 |
| H34 | Actions (variables) | ✅ Covered | T18 |
| H35 | Actions (artifacts) | ✅ Covered | T18 |
| H36 | Actions (caching) | ✅ Covered | T18 |
| H37 | Actions (environments) | ✅ Covered | T18 |
| H38 | CI/CD 개념 | ✅ Covered | T18 |
| H39 | GitHub Pages 배포 | ✅ Covered | T18 |
| H40 | GitHub CLI (gh) | ✅ Covered | T18 |
| H41 | Dependabot (alerts) | ✅ Covered | T19 |
| H42 | Dependabot (security updates) | ✅ Covered | T19 |
| H43 | secret scanning | ✅ Covered | T19 |
| H44 | code scanning | ✅ Covered | T19 |
| H45 | 2FA | ✅ Covered | T19 |
| H46 | commit signing (SSH) | ✅ Covered | T19 |
| H47 | commit signing (GPG) | ✅ Covered | T19 |
| H48 | Secrets vs Variables | ✅ Covered | T18, T19 |
| H49 | GitFlow (Driessen 2010) | ✅ Covered | T20 |
| H50 | GitHub Flow | ✅ Covered | T20 |
| H51 | Trunk-based | ✅ Covered | T20 |
| H52 | Forking workflow | ✅ Covered | T20 |
| H53 | Release flow | ✅ Covered | T20 |
| H54 | Releases | ✅ Covered | T21 |
| H55 | Packages | ✅ Covered | T21 |
| H56 | Container registry | ✅ Covered | T21 |
| H57 | Codespaces | ✅ Covered | T21 |
| H58 | Copilot | ✅ Covered | T21 |
| H59 | Gists | ✅ Covered | T21 |
| H60 | profile README | ✅ Covered | T21 |
| H61 | organizations / teams | ✅ Covered | T21 |

**GITHUB 결론: 61/61 항목 covered. gap 없음.**

### 4.3 총 커버리지

**GIT 65 + GITHUB 61 = 126/126 항목 covered. 누락 0.**

---

## 5. 깊은 곁가지(Deep Side-Topic) 목록

| 곁가지 | 위치 | 깊이 |
| --- | --- | --- |
| Git 탄생 배경 (Linus 2005, 10일 개발 일화) | T01, T14 | 중간 |
| 분산 vs 중앙 집중식 VCS 비교 (CVS/SVN → Git) | T01 | 중간 |
| SHA-1 → SHA-256 전환 (Git 2.29+ hash transition) | T01, T05 | 깊음(선택) |
| merge vs rebase 영원한 논쟁 (2010년대 커뮤니티) | T08 | 깊음 |
| "Oh Shit, Git!?!" 현상 (ohshitgit.com) | T11 | 중간 |
| git filter-branch → filter-repo 마이그레이션 | T12 | 깊음(선택) |
| GitHub 2008년 출시, 2018년 Microsoft 인수 | T14 | 중간 |
| Vincent Driessen 2010 GitFlow 원조 + 2020년 정정 | T20 | 중간 |
| Copilot이 바꾸는 현대 워크플로우 (2021\~) | T21 | 중간 |
| 공공 기관의 GitHub 사용 (18F, gov.uk) | T14, T19, 사례 Tier 2 | 깊음 |
| 모노레포 (Google/Meta/Microsoft) | T20, 사례 Tier 2 | 깊음(선택) |

---

## HISTORY

- 2026-06-19: 최초 작성. git-scm.com/docs(git-reset 등) + docs.github.com 기반으로 모든 명령어/기능 검증. 126개 주제(GIT 65 + GITHUB 61) 전부 covered. side-note 6종(5 시리즈 공유 + 1 사례 콜아웃) 확정.
- 2026-06-19: 검토·완성. (1) 프론트매터 YAML 복원(나머지 5개 문서와 일관). (2) T16 "색깔标签"→"색깔 라벨"(중국어 오염 정정). (3) T11 reflog 보관 기간 정확화(도달 가능 90일/불가능 30일). (4) T18 Actions matrix Node 예시 16/18/20→20/22(EOL 버전 제거).
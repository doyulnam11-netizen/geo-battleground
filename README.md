# GEO BATTLEGROUND

지질시대 퀴즈 부활이 결합된 브라우저 3D FPS의 실행 가능한 초기 버전입니다. React + TypeScript + Vite + Three.js 클라이언트, Node.js + ws 권한 서버, 독창적 한국어 온라인 문제 100개, 별도 연습용 문제 8개를 포함합니다.

**온라인 플레이는 실제 WebSocket 서버가 필요합니다.** 로컬 봇과 전투하는 연습 모드는 Web Worker에서 독립 실행하며 온라인 플레이어로 표시하지 않습니다. 사진 같은 그래픽이나 모든 실기기에서의 성능 검증이 완료된 제품은 아닙니다. 상세한 구현 범위와 남은 작업은 [STATUS.md](docs/STATUS.md), 실제 검사 결과는 [TESTING.md](docs/TESTING.md)를 확인하세요.

## 빠른 실행

Node.js 22 이상을 설치한 PC에서:

```sh
npm ci
npm run dev
```

터미널의 Vite 주소 `http://localhost:5173`을 엽니다. 클라이언트 5173, 서버 3001이 함께 시작됩니다. 처음에는 **먼저 연습해 볼까요?**를 누르면 혼자서 플레이할 수 있습니다. Esc → **퀴즈 부활 연습**으로 교육 기능을 직접 체험할 수 있습니다. 이 버튼은 연습 모드에서만 동작합니다.

두 브라우저/기기로 플레이하려면 한 명이 **방 만들기**, 다른 사람이 **코드로 입장**을 선택합니다. 참가자가 준비를 완료하면 방장이 시작합니다. 같은 Wi-Fi의 다른 기기는 PC의 실제 LAN IP와 5173 포트를 사용하세요. PC 방화벽의 해당 포트 허용이 필요할 수 있습니다. localhost는 각 기기 자신을 뜻합니다.

## 프로덕션 실행

```sh
npm ci
npm run check
npm start
```

`npm start`는 빌드된 클라이언트와 `/ws`를 한 서버의 3001 포트에서 제공합니다. `PORT`, `STATIC_DIR`, `ALLOWED_ORIGINS`를 설정할 수 있습니다. `.env.example`을 참고하세요. 서버는 환경변수를 읽습니다. 셸에서 내보내거나, Node의 `--env-file=.env` 옵션을 사용하세요. `npm run dev`의 Vite는 `.env`의 `VITE_` 변수도 읽습니다.

프론트엔드만 다른 호스팅에 올릴 때는 빌드 시 `VITE_SERVER_URL`을 지정하거나 게임 설정 → 서버 연결에서 HTTPS 서버 주소를 저장하세요. HTTPS 페이지는 WSS 서버를 사용해야 합니다. 서버의 ALLOWED_ORIGINS에 실제 프론트엔드 주소를 추가하세요.

## 주요 명령

| 명령 | 동작 |
|---|---|
| `npm run dev` | 클라이언트와 서버 동시 개발 실행 |
| `npm run dev:server` | Node 서버만 실행 |
| `npm run dev:client` | Vite 클라이언트만 실행 |
| `npm test` | 서버 규칙, 물리, 실제 WebSocket 통합 테스트 |
| `npm run typecheck` | TypeScript 검사 |
| `npm run build` | dist 및 dist-server 빌드 |
| `npm run check` | 자동 테스트 + 프로덕션 빌드 |
| `npm start` | 빌드된 전체 게임 서비스 |
| `npm run assets:export` | 절차적 캐릭터·장비·화석을 GLB로 재생성 |
| `npm run test:browser` | 실행 중인 서버 대상 브라우저 QA |

브라우저 QA 전 `npx playwright install chromium`을 실행하세요. 이미 설치한 Chromium을 쓰려면 `CHROMIUM_PATH=/absolute/path/to/chromium npm run test:browser`. 검사 주소는 `QA_URL`로 바꿀 수 있습니다. 스크린샷과 보고서는 `artifacts/`에 생성됩니다.

## 조작

WASD 이동, 마우스 시점, 좌클릭 발사, 우클릭 정조준, Space 점프, Shift 질주, C 앉기, Z 엎드리기, **Q/E 왼쪽/오른쪽 기울이기**, R 재장전, F 획득, 1/2/3 무기, H 응급 치료제, J 치료 키트, Tab 가방, M 지도, Esc 메뉴. 기울이기는 누르는 동안 유지되며 질주·엎드리기 중에는 사용하지 않습니다. 설정에서 키를 바꿀 수 있습니다. PC는 화면을 클릭해 포인터를 잠근 뒤 조작하세요.

모바일은 가로 화면에서 왼쪽 조이스틱 + 오른쪽 드래그 + 전용 버튼을 사용합니다. 이동·시점·발사·기울이기를 멀티터치로 처리합니다. **설정 → 조작 설정 → 버튼별 위치 · 크기 · 투명도 편집**에서 버튼을 선택하거나 드래그하세요. 크기 60~160%, 불투명도 15~100%와 위치를 버튼별로 저장합니다. 전체 크기·불투명도, 감도와 조준 토글도 조절할 수 있습니다. 설정은 현재 브라우저에 저장됩니다.

응급 치료제는 붕대와 회복 용기, 치료 키트는 손잡이와 잠금 장치가 있는 3D 케이스입니다. 바닥 위에 놓이며 스폰 주변과 전장에서 획득할 수 있습니다. 벽 너머 아이템은 획득할 수 없습니다. 높은 그래픽 품질은 절차적 PBR 표면·노멀 맵·주변 음영(SSAO)을 사용하며, 자동 품질은 느린 기기에서 음영 효과와 해상도를 낮춥니다.

## 소스 구조

- `client/`: UI, 3D 렌더러, 절차적 모델, 카메라·입력·사운드, 예측/보정, 로컬 연습 Worker
- `server/index.ts`: HTTP 정적 호스팅, WebSocket 연결, 방과 재접속 토큰, heartbeat/정리/속도 제한
- `server/game.ts`: 권한 게임 시뮬레이션, 피해·아이템·안전구역·퀴즈·순위·승리
- `server/data/questions.json`: 서버 전용 온라인 문제은행. 정답을 플레이 전에 클라이언트 스냅샷에 보내지 않음
- `shared/`: 규칙, 타입, 결정적 지형 및 충돌 함수. 클라이언트 HP는 서버에 반영되지 않음
- `public/assets/models/`: 생성된 스킨 캐릭터(17본·18클립), 3종 장비, 암모나이트 GLB
- `tests/`: 회귀 테스트 및 별도 TCP 연결을 사용하는 네트워크 테스트
- `docs/`: 교육 범위, 설계 결정, 배포, 모바일 검사, 실제 구현 상태, 라이선스

## 서버 운용의 범위

한 프로세스에서 방당 최대 12명을 관리합니다. 30Hz 시뮬레이션과 15Hz 스냅샷을 사용합니다. 인메모리 방식이므로 프로세스 재시작 시 경기가 사라집니다. 같은 프로세스가 살아 있는 동안 연결이 끊기면 60초 동안 슬롯과 퀴즈 제한시간을 보존합니다. 같은 탭의 네트워크 재연결 및 새로고침 후 sessionStorage의 토큰으로 자동 복구합니다. 명시적으로 경기 나가기를 누르면 토큰은 삭제됩니다.

[배포 가이드](docs/DEPLOYMENT.md) · [모바일 검사](docs/MOBILE-TESTING.md) · [구현 상태](docs/STATUS.md) · [교육 내용](docs/EDUCATION.md) · [라이선스](docs/LICENSES.md)

## 브라우저 검사의 환경 제약

소프트웨어 WebGL 환경에서 두 브라우저 컨텍스트 동시 초기화가 시간초과되어 기본 QA는 한 화면씩 진행합니다. 실제 WebSocket 2연결 테스트는 `npm test`에 별도로 포함되어 통과했습니다. GPU가 있는 환경에서 `QA_CONCURRENT_BROWSER=1 npm run test:browser`로 동시 브라우저 검사를 실행할 수 있습니다.

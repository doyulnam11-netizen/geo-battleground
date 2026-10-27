# HTTPS/WSS 배포

## 현재 공개 서버 (2026-10-27)

- 게임: **https://geo-battleground.onrender.com** — 회원가입 없이 접속합니다.
- 소스: https://github.com/doyulnam11-netizen/geo-battleground
- Render: My Workspace / geo-battleground / Singapore / Free / Node 22 / 인스턴스 1개.
- 실제 Render 빌드: `npm ci --include=dev && npm run check`, 실행: `npm start`.
- HTTPS 상태: `/api/health`, WSS: `/ws`. 최초 배포가 LIVE가 된 뒤 독립된 두 공개 WSS 연결로 같은 방·준비·시작·이동·기울이기·발사/장탄·안전구역·재접속을 확인했습니다. `public-network-results.json`을 참고하세요.
- Render가 프론트엔드도 제공합니다. 친구에게 위 게임 주소를 보내고 **방 만들기 → 6자리 코드 공유 → 코드로 입장 → 준비 완료 → 방장 작전 시작** 순으로 진행합니다.
- 이 서비스는 자동 배포가 꺼져 있습니다. GitHub main 갱신 후 Render 대시보드의 **Manual Deploy → Deploy latest commit**으로 반영합니다. 배포/재시작 시 진행 중 경기는 사라집니다.

## 다른 서비스에 프론트엔드 + 서버를 함께 배포

이 방식은 한 URL로 PC·스마트폰·태블릿이 같은 WebSocket 서버에 연결됩니다. 회원가입·결제·외부 게임 계정은 코드에 없습니다.

1. 전체 소스를 자신의 Git 저장소에 올립니다. node_modules, .env, artifacts는 올리지 않습니다.
2. 장시간 실행 Node.js와 WebSocket 업그레이드를 지원하는 호스팅을 선택합니다. 제공된 render.yaml은 Render Blueprint용 예시입니다. 호스팅 계정은 사용자가 생성해야 합니다.
3. Node 22 이상, build `npm ci --include=dev && npm run build`, start `npm start`, health `/api/health`를 설정합니다. NODE_ENV=production이어도 TypeScript와 Vite를 설치해야 합니다.
4. 호스팅이 주입하는 PORT를 그대로 사용합니다. 프록시 뒤 프로세스는 0.0.0.0에 바인딩합니다.
5. 필요하면 발급받은 실제 HTTPS origin을 ALLOWED_ORIGINS에 넣어 접속 출처를 제한합니다. 쉼표로 여러 origin을 허용할 수 있습니다. 기본 설정은 공개 게임 연결을 허용하며 이 값은 필수가 아닙니다.
6. 배포된 실제 HTTPS URL에서 방을 만들고 다른 기기로 같은 URL을 엽니다. 주소를 QR로 공유할 수 있습니다. Node 서버가 제공하는 프론트엔드는 별도 VITE_SERVER_URL 없이 동일 origin의 WSS `/ws`에 접속합니다.
7. 60초 이하 연결 끊김·퀴즈 제한시간 유지·마지막 생존자·로비 복귀를 실제 기기에서 확인합니다.

render.yaml은 시험용 `free` 플랜을 명시합니다. 2026-10-27 Render 공식 문서에서 확인한 사양은 0.1 CPU/512MB입니다. HTTP 요청 또는 기존 연결의 WebSocket 메시지를 15분간 받지 않으면 절전하며, 다시 접속할 때 약 1분의 시작 시간이 걸릴 수 있습니다. 무료 시간 한도는 작업공간당 월 750시간입니다. 12인 성능은 실제 배포 후 측정해야 합니다. 무료 서비스를 생성했으며 실제 주소는 위에 기재했습니다. 유료 플랜으로 전환하지 않았습니다.



## 자신의 Linux 서버 + Docker + Caddy

DNS A/AAAA를 서버 IP로 지정하고 80/443 포트를 열어 둡니다. Docker와 Compose 플러그인이 필요합니다.

```sh
export GEO_DOMAIN='실제로-소유한-도메인'
export GEO_EMAIL='인증서-안내용-이메일'
docker compose up --build -d
```

`GEO_DOMAIN`은 프로토콜 없는 실제 도메인입니다. 위 한글 값은 반드시 교체해야 하는 설명용 자리표시자입니다. Caddy는 이 도메인의 인증서를 발급받아 HTTPS/WSS를 프록시합니다. 포트 3001은 외부로 직접 노출하지 않습니다.

Dockerfile/Compose/Caddyfile을 제공했으나 이 작업에서 Docker 이미지 빌드, DNS 연결, 인증서 발급을 실제 수행하지 않았습니다. 서버가 사용하는 비밀값은 없습니다. 운영 origin을 지정하고 백업/로그/프로세스 재시작 정책을 추가하세요.

## 프론트엔드와 서버 분리

프론트엔드: `dist/`를 정적 호스팅에 배포합니다. 서버: 동일 저장소의 Node 빌드를 WebSocket 지원 환경에 배포합니다.

```sh
VITE_SERVER_URL='https://geo-battleground.onrender.com' npm run build
```

빌드하지 않고 게임 내 설정 → 서버 연결에 실제 HTTPS/WSS 서버 주소를 저장할 수도 있습니다. 정적 호스팅 자체에는 Node ws 서버가 포함되어 실행되지 않습니다. 정적 사이트만 열면 서버가 없는 경우 로컬 봇 연습이 가능하고, 온라인 입장은 연결 오류를 명확히 표시합니다.

기존 Sites 프론트엔드 https://geo-battleground-field-07.lilacbream18.chatgpt.site 는 위 `VITE_SERVER_URL`로 빌드해 동일 Render 서버에 연결하도록 구성합니다. 이 정적 사이트의 공개 설정을 유지합니다. 서버 상태 조회도 설정된 서버 주소를 따르며, 서버는 공개 상태 정보에 CORS를 허용합니다. 게임 설정에서 수동 저장한 서버 주소가 있으면 빌드 기본값보다 우선하므로, 기본 서버로 돌아가려면 해당 입력값을 비우고 저장하세요.

## 운용과 확장

- 한 프로세스만 사용하세요. 자동 다중 인스턴스는 같은 방의 다른 이용자를 서로 다른 프로세스로 보내므로 작동하지 않습니다.
- 프로세스 재시작은 진행 중 경기를 잃습니다. 영구 세션 저장소는 아직 없습니다.
- WebSocket timeout은 30초보다 길게 설정하고, 장시간 연결을 끊는 서버리스 HTTP 전용 호스팅은 피하세요.
- 모바일에서 HTTPS → WSS 경로를 확인하세요. 혼합 HTTP/WS 통신은 브라우저가 차단합니다.
- reverse proxy의 timeout, 방당 송수신량과 CPU를 측정한 후 동시 방 수를 조정하세요. 대규모 부하 시험은 아직 하지 않았습니다.

# 에셋 출처와 라이선스

이 프로젝트는 다른 FPS 게임의 로고, 캐릭터, 맵, 장비 또는 음원을 사용하지 않습니다.

| 대상 | 출처 | 라이선스/처리 |
|---|---|---|
| GEO 로고와 UI | 본 프로젝트에서 새로 작성 | 프로젝트 소스에 포함 |
| 캐릭터·장비·암모나이트 GLB | client/models.ts 및 scripts/export-assets.ts로 생성 | 외부 모델 없음; 원본 생성 코드 포함 |
| 붕대·회복 용기·치료 키트 GLB | client/lootModels.ts, recovery-med.glb, recovery-kit.glb | 자체 절차적 모델; 외부 모델 없음 |
| 흙·암석·나무껍질 PBR 맵 | client/surfaces.ts | 자체 색상·노멀·거칠기 텍스처 생성 |
| 나무·잔디·암석·건물·지형 | client/environment.ts, shared/world.ts | 절차적 메시/텍스처, 외부 모델 없음 |
| 캐릭터 애니메이션 | client/models.ts의 AnimationClip | 자체 작성 키프레임, 모션캡처 파일 미사용 |
| 발사·환경·상호작용 사운드 | client/audio.ts의 Web Audio 합성 | 외부 음원 없음 |
| 한국어 문제 100개 + 연습 문제 8개 | 본 프로젝트에서 작성 | 교과서 문항·해설을 복제하지 않음 |
| Barlow Condensed | Google Fonts / Jeremy Tribby | SIL Open Font License 1.1; public/assets/fonts/barlowcondensed-OFL.txt |
| DM Sans | Google Fonts / Colophon Foundry 외 | SIL Open Font License 1.1; public/assets/fonts/dmsans-OFL.txt |
| Lucide 아이콘 | lucide.dev / lucide-react | ISC, dependency license 유지 |
| Three.js, RoomEnvironment, RoundedBoxGeometry, SSAOPass | threejs.org / npm three | MIT |
| React, Vite, ws, qrcode 등 | package-lock.json에 버전 고정 | 각 의존 패키지의 LICENSE 유지 |

폰트는 프로젝트의 public/assets/fonts에 로컬 포함되어 런타임 외부 폰트 서버에 의존하지 않습니다. 한국어는 기기의 사용 가능한 한국어 시스템 글꼴을 사용합니다.

폰트 원본/라이선스:
- https://github.com/google/fonts/tree/main/ofl/barlowcondensed
- https://github.com/google/fonts/tree/main/ofl/dmsans
- https://github.com/lucide-icons/lucide/blob/main/LICENSE
- https://github.com/mrdoob/three.js/blob/dev/LICENSE

3D 파일 내보내기에는 프레임별로 생성하는 원단 텍스처 대신 재질 색을 포함합니다. 브라우저 런타임에서는 원단 무늬 텍스처를 추가 생성합니다. 글꼴을 수정/재배포하는 경우 해당 OFL의 조건과 예약 이름을 확인하세요.

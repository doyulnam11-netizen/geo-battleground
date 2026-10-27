import {GameRoom} from '../server/game';
import type {Question} from '../shared/types';
// This separate bank is only for offline training. Online questions remain in the server bundle.
const bank:Question[]=[
{id:'training-1',question:'화석이 발견된 지층의 상대적인 형성 순서를 알아보려 합니다. 변형되지 않은 퇴적층에서 일반적으로 먼저 형성된 층은?',options:['아래쪽 지층','위쪽 지층','색이 밝은 지층','두께가 얇은 지층'],answer:0,difficulty:'easy',topic:'지층과 시간',explanation:'변형이나 역전이 없는 퇴적층에서는 아래에 놓인 지층이 먼저 퇴적됩니다.'},
{id:'training-2',question:'지질시대를 오래된 것부터 순서대로 나열한 것은?',options:['고생대 → 중생대 → 선캄브리아시대 → 신생대','선캄브리아시대 → 고생대 → 중생대 → 신생대','신생대 → 중생대 → 고생대 → 선캄브리아시대','선캄브리아시대 → 신생대 → 중생대 → 고생대'],answer:1,difficulty:'easy',topic:'지질시대 순서',explanation:'선캄브리아시대 이후 고생대, 중생대, 신생대가 이어집니다.'},
{id:'training-3',question:'표준 화석으로 적합한 생물의 특징은?',options:['생존 기간이 길고 분포가 좁다','생존 기간이 짧고 분포가 넓다','화석으로 남지 않는다','특정 환경에만 제한되어 분포한다'],answer:1,difficulty:'medium',topic:'표준 화석',explanation:'짧은 생존 기간과 넓은 분포는 멀리 떨어진 지층의 시대를 비교하는 데 유리합니다.'},
{id:'training-4',question:'현재 육지의 지층에서 산호 화석이 발견되었습니다. 퇴적 당시 환경으로 가장 타당한 것은?',options:['사막','깊은 빙하 내부','따뜻하고 얕은 바다','고산 지대'],answer:2,difficulty:'easy',topic:'시상 화석',explanation:'조초산호는 일반적으로 따뜻하고 얕으며 빛이 드는 바다에서 자랍니다.'},
{id:'training-5',question:'공룡이 육상에서 크게 번성했던 시대는?',options:['선캄브리아시대','고생대','신생대','중생대'],answer:3,difficulty:'easy',topic:'중생대',explanation:'중생대는 트라이아스기·쥐라기·백악기로 구성되며 공룡이 크게 번성했습니다.'},
{id:'training-6',question:'삼엽충이 완전히 멸종한 시기는?',options:['고생대 말','중생대 말','신생대 말','선캄브리아시대 말'],answer:0,difficulty:'medium',topic:'대멸종',explanation:'삼엽충은 고생대 동안 살았고 페름기 말 대멸종 때 완전히 멸종했습니다.'},
{id:'training-7',question:'대멸종 이후 새로운 생물 집단이 다양해질 수 있는 이유로 가장 적절한 것은?',options:['진화가 완전히 멈추기 때문에','비어 있는 생태적 지위가 늘어나기 때문에','모든 환경 변화가 사라지기 때문에','멸종한 종이 모두 되살아나기 때문에'],answer:1,difficulty:'hard',topic:'생물과 환경',explanation:'생존한 집단은 경쟁자가 줄고 비어 있는 생태적 지위를 이용하며 다양해질 수 있습니다.'},
{id:'training-8',question:'초대륙 판게아가 분리되어 대륙 배치가 달라지는 과정과 직접 관련된 것은?',options:['달의 위상 변화','해수의 조석만','판의 이동','지구 자전의 중단'],answer:2,difficulty:'medium',topic:'대륙 이동',explanation:'판의 이동에 따라 대륙이 분리·이동하고 바다의 넓이와 연결 상태도 달라집니다.'}
];
let room:GameRoom|null=null;let timer:ReturnType<typeof setInterval>|undefined;
self.onmessage=({data})=>{const now=Date.now();if(data.type==='create'){if(timer)clearInterval(timer);room=new GameRoom('SOLO01',bank,true,42);room.addPlayer('you',data.name||'탐험가',now);for(let i=0;i<5;i++)room.addPlayer(`bot-${i}`,['STRATA','FERN','AMMON','EPOCH','RIDGE'][i]+' · BOT',now+i,true);room.start('you',now);self.postMessage({type:'welcome',id:'you',code:'SOLO01'});let t=0;timer=setInterval(()=>{room!.tick(Date.now());if(++t%2===0)self.postMessage(room!.snapshot('you',Date.now()));},1000/30);}
 if(!room)return;if(data.type==='input')room.input('you',data.input,now);if(data.type==='action')room.action('you',data.action,data.value,now);if(data.type==='lobby'){room.lobby('you');self.postMessage(room.snapshot('you',now));}if(data.type==='start')room.start('you',now);};

export interface Box {x:number;y:number;z:number;w:number;h:number;d:number;kind:string}
export interface Building {x:number;z:number;w:number;d:number;h:number;name:string}
export function seeded(seed:number){return ()=>{seed|=0;seed=seed+0x6D2B79F5|0;let t=Math.imul(seed^seed>>>15,1|seed);t=t+Math.imul(t^t>>>7,61|t)^t;return ((t^t>>>14)>>>0)/4294967296;};}
export const buildings:Building[]=[{x:0,z:-30,w:22,d:17,h:5,name:'STRATA RESEARCH'},{x:35,z:-16,w:13,d:20,h:6,name:'FIELD STORAGE'},{x:-58,z:34,w:12,d:13,h:4,name:'OUTPOST 01'},{x:-77,z:31,w:10,d:12,h:4,name:'OUTPOST 02'},{x:70,z:76,w:18,d:13,h:4,name:'FOSSIL ARCHIVE'},{x:116,z:-80,w:12,d:14,h:4,name:'GEO STATION'}];
const rawHeight=(x:number,z:number)=>Math.sin(x*.023)*Math.cos(z*.019)*6+Math.sin(x*.061+z*.028)*1.5+Math.cos(z*.045-x*.018)*2+Math.max(0,Math.sin((x+z)*.009))*3;
export function heightAt(x:number,z:number){let h=rawHeight(x,z);for(const b of buildings){const dist=Math.max(Math.abs(x-b.x)-b.w/2,Math.abs(z-b.z)-b.d/2);if(dist<8){let f=Math.max(0,Math.min(1,dist/8));h=rawHeight(b.x,b.z)*(1-f)+h*f;}}return h;}
export const obstacles:Box[]=[];
for(const b of buildings){const y=heightAt(b.x,b.z);const wall=(x:number,z:number,w:number,d:number,h=b.h,dy=0)=>obstacles.push({x,y:y+dy+h/2,z,w,h,d,kind:'wall'});
for(const sign of [-1,1]){const sx=b.x+sign*b.w/2;wall(sx,b.z,.45,b.d,.95);wall(sx,b.z,.45,b.d,b.h-3.3,3.3);for(let k=0;k<=4;k++)wall(sx,b.z-b.d/2+k*b.d/4,.45,.65,2.35,.95);}
// Both ends have accessible central doors. Window openings are actual gaps above sill.
for(const sign of [-1,1]){wall(b.x-b.w/4-1,b.z+sign*b.d/2,b.w/2-2,.45);wall(b.x+b.w/4+1,b.z+sign*b.d/2,b.w/2-2,.45);wall(b.x,b.z+sign*b.d/2,4,.45,1.6,b.h-1.6);}
wall(b.x-3,b.z, .35,b.d*.42,b.h);wall(b.x+b.w/2-2,b.z-3,3,2,1.3);
obstacles.push({x:b.x,y:y+b.h+.12,z:b.z,w:b.w+.8,h:.24,d:b.d+.8,kind:'roof'});
}
const random=seeded(1964);
export const rocks:{x:number;z:number;s:number;r:number}[]=[];
export const trees:{x:number;z:number;s:number;r:number;type:number}[]=[];
const free=(x:number,z:number)=>buildings.every(b=>Math.abs(x-b.x)>b.w/2+9||Math.abs(z-b.z)>b.d/2+9)&&Math.abs(x-z*.25-12)>5;
for(let i=0;i<95;i++){const x=(random()-.5)*380,z=(random()-.5)*380;if(!free(x,z))continue;const s=1.5+random()*4;rocks.push({x,z,s,r:random()*6.28});obstacles.push({x,y:heightAt(x,z)+s*.48,z,w:s*1.5,h:s*.96,d:s*1.25,kind:'rock'});}
for(let i=0;i<390;i++){const x=(random()-.5)*396,z=(random()-.5)*396;if(!free(x,z))continue;const s=.7+random()*.8;trees.push({x,z,s,r:random()*6.28,type:random()>.55?1:0});obstacles.push({x,y:heightAt(x,z)+3*s,z,w:.55*s,h:6*s,d:.55*s,kind:'tree'});}
export const landmarks=[{x:0,z:-30,name:'연구시설',label:'RESEARCH LAB'},{x:-65,z:34,name:'버려진 마을',label:'OLD VILLAGE'},{x:70,z:76,name:'화석 보관소',label:'FOSSIL ARCHIVE'},{x:116,z:-80,name:'지질 조사 구역',label:'FIELD STATION'},{x:-110,z:-95,name:'고생대 숲',label:'PALEOZOIC FOREST'},{x:120,z:145,name:'지층 계곡',label:'STRATA VALLEY'}];
export function clearSpawn(x:number,z:number){return !obstacles.some(b=>Math.abs(x-b.x)<b.w/2+1&&Math.abs(z-b.z)<b.d/2+1);}
// Survey platform with individually colliding 30 cm stairs and an open deck.
export const tower={x:57,z:-73,y:heightAt(57,-73)};
for(let i=0;i<18;i++)obstacles.push({x:tower.x-3,y:tower.y+(i+1)*.15,z:tower.z+10-i*.6,w:2,h:(i+1)*.3,d:.61,kind:'stair'});
obstacles.push({x:tower.x,y:tower.y+5.3,z:tower.z-2.8,w:8,h:.2,d:5,kind:'deck'});

obstacles.push({x:135,y:heightAt(135,117)+.1,z:117,w:28,h:4.9,d:7,kind:'strata'});

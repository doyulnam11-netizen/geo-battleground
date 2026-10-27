import {RULES} from './config';
import {heightAt,obstacles,clearSpawn, type Box} from './world';
import type {Input,Player,Stance} from './types';
export const bodyHeight=(s:Stance)=>s==='prone'?.55:s==='crouch'?1.15:1.8;
export const eyeHeight=(s:Stance)=>bodyHeight(s)-.12;
export function intersects(x:number,y:number,z:number,h:number,b:Box,r=RULES.playerRadius){const cx=Math.max(b.x-b.w/2,Math.min(x,b.x+b.w/2)),cz=Math.max(b.z-b.d/2,Math.min(z,b.z+b.d/2));return (x-cx)**2+(z-cz)**2<r*r&&y+h>b.y-b.h/2+.015&&y<b.y+b.h/2-.015;}
export function movePlayer(p:Player,i:Input,dt:number){if(p.status!=='alive')return;dt=Math.min(dt,.05);p.yaw=i.yaw;p.pitch=i.pitch;p.aim=i.aim;if(p.drop){p.aim=false;p.grounded=false;p.lean=0;if(p.drop==='plane'){p.x+=12*dt;p.y=100;if(i.jump)p.drop='chute';}else{p.x=Math.max(-190,Math.min(190,p.x+(Math.cos(i.yaw)*i.x-Math.sin(i.yaw)*i.z)*7*dt));p.z=Math.max(-190,Math.min(190,p.z+(-Math.sin(i.yaw)*i.x-Math.cos(i.yaw)*i.z)*7*dt));p.y-=9*dt;if(p.y<=heightAt(p.x,p.z)){if(!clearSpawn(p.x,p.z)){const ox=p.x,oz=p.z;outer:for(let r=1;r<30;r++)for(let a=0;a<16;a++){const x=ox+Math.cos(a*Math.PI/8)*r,z=oz+Math.sin(a*Math.PI/8)*r;if(clearSpawn(x,z)){p.x=x;p.z=z;break outer;}}}p.y=heightAt(p.x,p.z);p.drop=undefined;p.grounded=true;p.vy=0;}}return;}
const oldH=bodyHeight(p.stance),newH=bodyHeight(i.stance);if(newH<=oldH||!obstacles.some(b=>intersects(p.x,p.y,p.z,newH,b)))p.stance=i.stance;
let len=Math.hypot(i.x,i.z),vx=i.x/Math.max(1,len),vz=i.z/Math.max(1,len);p.moving=len>.05;p.sprinting=i.sprint&&!i.aim&&p.stance==='stand';
const speed=(p.stance==='prone'?RULES.prone:p.stance==='crouch'?RULES.crouch:p.sprinting?RULES.sprint:RULES.walk)*(i.aim?.64:1)*(p.healUntil? .5:1);
const dx=(vx*Math.cos(i.yaw)-vz*Math.sin(i.yaw))*speed*dt,dz=(-vx*Math.sin(i.yaw)-vz*Math.cos(i.yaw))*speed*dt;
if(i.jump&&p.grounded&&p.stance!=='prone'){p.vy=RULES.jump;p.grounded=false;}p.vy-=RULES.gravity*dt;
const h=bodyHeight(p.stance);let ny=p.y+p.vy*dt;
for(const b of obstacles){if(Math.abs(p.x-b.x)<b.w/2+RULES.playerRadius&&Math.abs(p.z-b.z)<b.d/2+RULES.playerRadius){const top=b.y+b.h/2,bottom=b.y-b.h/2;if(p.vy<=0&&p.y>=top-.03&&ny<=top){ny=top;p.vy=0;p.grounded=true;}if(p.vy>0&&p.y+h<=bottom+.03&&ny+h>=bottom){ny=bottom-h;p.vy=0;}}}
const moveAxis=(axis:'x'|'z',delta:number)=>{const x=axis==='x'?p.x+delta:p.x,z=axis==='z'?p.z+delta:p.z;let floor=heightAt(x,z);if(floor-p.y>.65&&p.grounded)return;let cy=Math.max(ny,floor);for(const b of obstacles){if(intersects(x,cy,z,h,b)){const step=b.y+b.h/2-p.y;if(p.grounded&&step>0&&step<=.42&&!obstacles.some(o=>o!==b&&intersects(x,b.y+b.h/2,z,h,o)))cy=b.y+b.h/2;else return;}}p[axis]=Math.max(-198,Math.min(198,axis==='x'?x:z));ny=cy;};
moveAxis('x',dx);moveAxis('z',dz);const floor=heightAt(p.x,p.z);if(ny<=floor+.005){ny=floor;p.vy=0;p.grounded=true;}else if(p.vy!==0)p.grounded=false;p.y=ny;
const desired=p.sprinting||p.stance==='prone'?0:Math.max(-1,Math.min(1,Number.isFinite(i.lean)?i.lean!:0));
const current=Number.isFinite(p.lean)?p.lean:0;const eased=current+Math.max(-dt*6,Math.min(dt*6,desired-current));p.lean=constrainLean(p,eased);
}
export type Vec=[number,number,number];
export function rayBox(o:Vec,d:Vec,b:Box){let lo=0,hi=Infinity;for(let axis=0;axis<3;axis++){const c=[b.x,b.y,b.z][axis],s=[b.w,b.h,b.d][axis]/2;if(Math.abs(d[axis])<1e-8){if(o[axis]<c-s||o[axis]>c+s)return Infinity;}else{let a=(c-s-o[axis])/d[axis],v=(c+s-o[axis])/d[axis];if(a>v)[a,v]=[v,a];lo=Math.max(lo,a);hi=Math.min(hi,v);if(lo>hi)return Infinity;}}return lo;}
export function worldRay(o:Vec,d:Vec,max:number){let result=max;for(const b of obstacles)result=Math.min(result,rayBox(o,d,b));for(let t=.5;t<result;t+=.6){if(o[1]+d[1]*t<heightAt(o[0]+d[0]*t,o[2]+d[2]*t)){result=t;break;}}return result;}
export function direction(yaw:number,pitch:number):Vec{return [-Math.sin(yaw)*Math.cos(pitch),Math.sin(pitch),-Math.cos(yaw)*Math.cos(pitch)];}

/** The same tilted body is used by prediction, camera, snapshots and server hitboxes. */
type Pose=Pick<Player,'x'|'y'|'z'|'yaw'|'stance'|'lean'>;
export function bodyPoint(p:Pose,height:number):Vec {
 const angle=(p.lean||0)*.25,side=Math.sin(angle)*height;
 return [p.x+Math.cos(p.yaw)*side,p.y+Math.cos(angle)*height,p.z-Math.sin(p.yaw)*side];
}
export function eyePosition(p:Pose):Vec{return bodyPoint(p,eyeHeight(p.stance));}
export function constrainLean(p:Pose,requested:number):number {
 if(p.stance==='prone'||requested===0)return 0;
 // Sweep head and torso through the whole arc, including narrow pillars.
 let safe=0;
 for(let n=1;n<=20;n++){
  const amount=requested*n/20,pose={...p,lean:amount};
  const blocked=[eyeHeight(p.stance),bodyHeight(p.stance)*.65].some(h=>{
   const [x,y,z]=bodyPoint(pose,h);
   return y-.17<heightAt(x,z)||obstacles.some(b=>intersects(x,y-.17,z,.34,b,.18));
  });
  if(blocked)break;safe=amount;
 }
 return safe;
}

import {eyePosition,worldRay,type Vec} from './physics';
import {heightAt} from './world';
import type {Loot,Player} from './types';
export function nearbyLoot(p:Player,items:Loot[]):Loot|undefined {
 const origin=eyePosition(p);
 return items.filter(l=>{
  if(Math.hypot(l.x-p.x,l.z-p.z)>=3.4)return false;
  const target:Vec=[l.x,heightAt(l.x,l.z)+.2,l.z];
  if(Math.abs(target[1]-p.y)>=2)return false;
  const delta=target.map((v,i)=>v-origin[i]) as Vec,distance=Math.hypot(...delta);
  return distance<.01||worldRay(origin,delta.map(v=>v/distance) as Vec,distance)>=distance-.12;
 }).sort((a,b)=>Math.hypot(a.x-p.x,a.z-p.z)-Math.hypot(b.x-p.x,b.z-p.z))[0];
}

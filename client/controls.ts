import {settings} from './settings';
import type {Input,Stance} from '../shared/types';
export class Controls {
 keys=new Set<string>();yaw=0;pitch=0;fire=false;aim=false;stance:Stance='stand';jump=false;sprint=false;leanLeft=false;leanRight=false;stick={x:0,z:0};active=false;blocked=false;touch=matchMedia('(pointer:coarse)').matches;seq=0;onPick:(x?:number,y?:number)=>boolean=()=>false;onAction:(s:string,v?:unknown)=>void=()=>{};onUI:(s:string)=>void=()=>{};private cleanups:(()=>void)[]=[];
 constructor(){const on=(target:EventTarget,name:string,fn:EventListener)=>{target.addEventListener(name,fn);this.cleanups.push(()=>target.removeEventListener(name,fn));};
 on(window,'keydown',((e:KeyboardEvent)=>{if(!this.active||e.target instanceof HTMLInputElement||e.target instanceof HTMLTextAreaElement)return;if(Object.values(settings.keys).includes(e.code)||['Digit1','Digit2','Digit3','Escape'].includes(e.code))e.preventDefault();if(e.repeat)return;if(e.code==='Escape'){this.onUI('pause');return;}const k=settings.keys;if(e.code===k.inventory){this.onUI('inventory');return;}if(e.code===k.map){this.onUI('map');return;}if(this.blocked)return;this.keys.add(e.code);if(e.code===k.jump)this.jump=true;if(e.code===k.crouch)this.toggleStance('crouch');if(e.code===k.prone)this.toggleStance('prone');if(e.code===k.reload)this.onAction('reload');if(e.code===k.med)this.onAction('med');if(e.code===k.kit)this.onAction('kit');if(/^Digit[123]$/.test(e.code))this.onAction('weapon',Number(e.code.slice(-1))-1);}) as EventListener);
 on(window,'keyup',((e:KeyboardEvent)=>{this.keys.delete(e.code);}) as EventListener);
 on(window,'mousemove',((e:MouseEvent)=>{if(this.active&&!this.blocked&&document.pointerLockElement)this.look(e.movementX,e.movementY);}) as EventListener);
 on(window,'mousedown',((e:MouseEvent)=>{if(!this.active||this.blocked||!document.pointerLockElement)return;if(e.button===0&&!this.onPick())this.fire=true;if(e.button===2)this.aim=settings.aimToggle?!this.aim:true;}) as EventListener);
 on(window,'mouseup',((e:MouseEvent)=>{if(e.button===0)this.fire=false;if(e.button===2&&!settings.aimToggle)this.aim=false;}) as EventListener);
 on(window,'blur',(()=>this.reset()) as EventListener);on(document,'pointerlockchange',(()=>{if(!document.pointerLockElement){this.reset();}}) as EventListener);
 }
 toggleStance(stance:Stance){this.stance=this.stance===stance?'stand':stance;}
 look(dx:number,dy:number){const gain=settings.sensitivity*(this.aim?settings.adsSensitivity:1)*.0022;this.yaw-=dx*gain;this.pitch=Math.max(-1.48,Math.min(1.48,this.pitch-dy*gain));}
 sample():Input{const k=settings.keys;return {seq:++this.seq,x:this.blocked?0:Number(this.keys.has(k.right))-Number(this.keys.has(k.left))+this.stick.x,z:this.blocked?0:Number(this.keys.has(k.forward))-Number(this.keys.has(k.back))+this.stick.z,yaw:this.yaw,pitch:this.pitch,jump:!this.blocked&&this.jump,sprint:!this.blocked&&(this.keys.has(k.sprint)||this.sprint),lean:this.blocked?0:Number(this.keys.has(k.leanRight)||this.leanRight)-Number(this.keys.has(k.leanLeft)||this.leanLeft),stance:this.stance,aim:!this.blocked&&this.aim,fire:!this.blocked&&this.fire};}
 reset(){this.keys.clear();this.fire=false;this.aim=false;this.stick={x:0,z:0};this.jump=false;this.sprint=false;this.leanLeft=false;this.leanRight=false;}
 dispose(){this.cleanups.forEach(fn=>fn());}
}
export const controls=new Controls();

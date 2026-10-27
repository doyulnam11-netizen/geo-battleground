import {useEffect,useRef,useState,type CSSProperties,type PointerEvent} from 'react';
import {Crosshair,ArrowUp,ChevronsUp,RotateCw,Hand,PersonStanding,Minus,Backpack,LocateFixed,Settings2,Activity,Check,CornerUpLeft,CornerUpRight} from 'lucide-react';
import {controls} from './controls';
import {settings,saveSettings} from './settings';
export default function MobileControls({edit=false,onFinish}:{edit?:boolean;onFinish?:()=>void}){
 const [stick,setStick]=useState({x:0,y:0}),[,refresh]=useState(0),[selected,setSelected]=useState('fire');
 const moveId=useRef<number|null>(null),look=useRef<{id:number;x:number;y:number}|null>(null),origin=useRef({x:0,y:0});
 const drag=useRef<{id:string;pointer:number;px:number;py:number;x:number;y:number;rect:DOMRect}|null>(null);
 const buttons=[
 {id:'fire',label:'발사',icon:<LocateFixed/>,down:()=>controls.fire=true,up:()=>controls.fire=false},
 {id:'aim',label:'조준',icon:<Crosshair/>,down:()=>controls.aim=settings.aimToggle?!controls.aim:true,up:()=>{if(!settings.aimToggle)controls.aim=false;}},
 {id:'leanLeft',label:'왼쪽 기울이기',icon:<CornerUpLeft/>,down:()=>controls.leanLeft=true,up:()=>controls.leanLeft=false},
 {id:'leanRight',label:'오른쪽 기울이기',icon:<CornerUpRight/>,down:()=>controls.leanRight=true,up:()=>controls.leanRight=false},
 {id:'jump',label:'점프',icon:<ArrowUp/>,down:()=>controls.jump=true},
 {id:'crouch',label:'앉기',icon:<PersonStanding/>,down:()=>controls.toggleStance('crouch')},
 {id:'prone',label:'엎드리기',icon:<Minus/>,down:()=>controls.toggleStance('prone')},
 {id:'reload',label:'재장전',icon:<RotateCw/>,down:()=>controls.onAction('reload')},
 {id:'loot',label:'획득',icon:<Hand/>,down:()=>controls.onAction('loot')},
 {id:'weapon',label:'무기',icon:<Activity/>,down:()=>controls.onUI('cycleWeapon')},
 {id:'sprint',label:'달리기',icon:<ChevronsUp/>,down:()=>controls.sprint=true,up:()=>controls.sprint=false},
 {id:'inventory',label:'가방',icon:<Backpack/>,down:()=>controls.onUI('inventory')}];
 useEffect(()=>{const changed=()=>refresh(v=>v+1);window.addEventListener('geo-settings',changed);return()=>{window.removeEventListener('geo-settings',changed);controls.reset();};},[]);
 const end=()=>{moveId.current=null;setStick({x:0,y:0});controls.stick={x:0,z:0};};
 const size=(id:string)=>settings.buttonOverrides[id]?.size??settings.buttonSize;
 function style(id:string):CSSProperties{const p=settings.positions[id]||{x:0,y:0};return {transform:`translate(${p.x}vw,${p.y}vh) scale(${size(id)})`,opacity:edit?Math.max(.45,settings.buttonOverrides[id]?.opacity??settings.buttonOpacity):settings.buttonOverrides[id]?.opacity??settings.buttonOpacity};}
 function startDrag(e:PointerEvent,id:string){setSelected(id);const p=settings.positions[id]||{x:0,y:0};drag.current={id,pointer:e.pointerId,px:e.clientX,py:e.clientY,x:p.x,y:p.y,rect:e.currentTarget.getBoundingClientRect()};e.currentTarget.setPointerCapture(e.pointerId);}
 function moveDrag(e:PointerEvent){const d=drag.current;if(!d||d.pointer!==e.pointerId)return;const dx=Math.max(8-d.rect.left,Math.min(innerWidth-8-d.rect.right,e.clientX-d.px)),dy=Math.max(8-d.rect.top,Math.min(innerHeight-8-d.rect.bottom,e.clientY-d.py));settings.positions[d.id]={x:d.x+dx/innerWidth*100,y:d.y+dy/innerHeight*100};refresh(v=>v+1);}
 function finishDrag(){drag.current=null;saveSettings({...settings});}
 function override(field:'size'|'opacity',value:number){saveSettings({...settings,buttonOverrides:{...settings.buttonOverrides,[selected]:{...settings.buttonOverrides[selected],[field]:value}}});}
 return <div className={`mobile-controls ${edit?'editing':''}`}>
 <div className="look-pad" aria-label="드래그하여 시점 이동" onPointerDown={e=>{if(edit||look.current)return;look.current={id:e.pointerId,x:e.clientX,y:e.clientY};e.currentTarget.setPointerCapture(e.pointerId);}} onPointerMove={e=>{if(look.current?.id===e.pointerId){controls.look((e.clientX-look.current.x)*1.3,(e.clientY-look.current.y)*1.3);look.current.x=e.clientX;look.current.y=e.clientY;}}} onPointerUp={e=>{if(look.current?.id===e.pointerId)look.current=null;}} onPointerCancel={()=>look.current=null}/>
 <div className={`joystick ${edit&&selected==='joystick'?'selected-control':''}`} style={style('joystick')} onPointerDown={e=>{if(edit){startDrag(e,'joystick');return;}if(moveId.current!==null)return;moveId.current=e.pointerId;e.currentTarget.setPointerCapture(e.pointerId);const r=e.currentTarget.getBoundingClientRect();origin.current={x:r.left+r.width/2,y:r.top+r.height/2};}} onPointerMove={e=>{if(edit){moveDrag(e);return;}if(e.pointerId!==moveId.current)return;const dx=e.clientX-origin.current.x,dy=e.clientY-origin.current.y,max=48*size('joystick'),len=Math.max(max,Math.hypot(dx,dy));controls.stick={x:dx/len,z:-dy/len};setStick({x:dx/len*48,y:dy/len*48});}} onPointerUp={()=>edit?finishDrag():end()} onPointerCancel={()=>{finishDrag();end();}}><div className="stick-ring"/><div className="stick-knob" style={{transform:`translate(${stick.x}px,${stick.y}px)`}}/><span>MOVE</span></div>
 {buttons.map(b=><button key={b.id} className={`touch-button touch-${b.id} ${edit&&selected===b.id?'selected-control':''}`} style={style(b.id)} aria-label={b.label} onPointerDown={e=>{e.preventDefault();e.stopPropagation();e.currentTarget.setPointerCapture(e.pointerId);if(edit)startDrag(e,b.id);else b.down();}} onPointerMove={e=>{if(edit)moveDrag(e);}} onPointerUp={e=>{e.preventDefault();if(edit)finishDrag();else b.up?.();}} onPointerCancel={()=>{if(edit)finishDrag();else b.up?.();}} onLostPointerCapture={e=>{if(!edit&&e.target===e.currentTarget)b.up?.();}}>{b.icon}<span>{b.label}</span></button>)}
 {edit&&<div className="layout-edit-bar"><Settings2 size={17}/><label>편집 대상<select aria-label="편집할 조작 버튼" value={selected} onChange={e=>setSelected(e.target.value)}><option value="joystick">이동 조이스틱</option>{buttons.map(b=><option key={b.id} value={b.id}>{b.label}</option>)}</select></label><label>크기 {Math.round(size(selected)*100)}%<input aria-label="선택 버튼 크기" type="range" min=".6" max="1.6" step=".05" value={size(selected)} onChange={e=>override('size',+e.target.value)}/></label><label>불투명도 {Math.round((settings.buttonOverrides[selected]?.opacity??settings.buttonOpacity)*100)}%<input aria-label="선택 버튼 불투명도" type="range" min=".15" max="1" step=".05" value={settings.buttonOverrides[selected]?.opacity??settings.buttonOpacity} onChange={e=>override('opacity',+e.target.value)}/></label><button onClick={()=>saveSettings({...settings,positions:{},buttonOverrides:{}})}>배치 초기화</button><button onClick={onFinish}><Check size={16}/> 완료</button><small>버튼을 드래그해 이동 · 설정은 이 기기에 저장됩니다</small></div>}
 </div>;
}

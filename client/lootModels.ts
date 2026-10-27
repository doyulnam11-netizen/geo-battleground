import * as T from 'three';
import {RoundedBoxGeometry} from 'three/addons/geometries/RoundedBoxGeometry.js';
import {makeWeapon} from './models';
import {mergeGeometries} from 'three/addons/utils/BufferGeometryUtils.js';
import type {Loot} from '../shared/types';

/** Original procedural equipment. All meshes rest on y=0, without bobbing. */
export function makeLoot(kind:Loot['kind'],weapon=0){
 const group=new T.Group();group.name=`ground-${kind}`;
 const shell=new T.MeshStandardMaterial({color:kind==='kit'?'#d8ded4':'#3f8774',roughness:.48,metalness:.18});
 const rubber=new T.MeshStandardMaterial({color:'#263b36',roughness:.88});
 const white=new T.MeshStandardMaterial({color:'#eff7d6',roughness:.45});
 const orange=new T.MeshStandardMaterial({color:'#e9a857',roughness:.48,metalness:.25});
 const add=(geometry:T.BufferGeometry,material:T.Material,x:number,y:number,z:number)=>{const mesh=new T.Mesh(geometry,material);mesh.position.set(x,y,z);mesh.castShadow=mesh.receiveShadow=true;group.add(mesh);return mesh;};
 const box=(w:number,h:number,d:number,mat:T.Material,x:number,y:number,z:number,r=.02)=>add(new RoundedBoxGeometry(w,h,d,2,r),mat,x,y,z);
 if(kind==='kit'){
  box(.64,.25,.44,rubber,0,.125,0,.04);box(.61,.17,.42,shell,0,.2,0,.035);
  box(.55,.025,.35,white,0,.29,0);
  box(.22,.012,.065,shell,0,.308,0);box(.065,.012,.22,shell,0,.308,0);
  for(const x of [-.23,.23]){box(.065,.13,.035,orange,x,.17,.23);box(.06,.10,.025,rubber,x,.17,-.23);}
  box(.27,.045,.05,rubber,0,.17,-.29);
  for(const x of [-.11,.11])box(.035,.04,.09,rubber,x,.17,-.25);
  for(const x of [-.28,.28])for(const z of [-.17,.17])box(.065,.06,.065,rubber,x,.035,z);
 }else if(kind==='med'){
  // A bandage pouch with two visible rolls and a sealed recovery canister.
  box(.38,.09,.27,rubber,0,.045,0);box(.36,.1,.25,shell,0,.10,0,.04);
  for(const x of [-.095,.035]){const roll=add(new T.CylinderGeometry(.052,.052,.19,18),white,x,.18,0);roll.rotation.x=Math.PI/2;const core=add(new T.TorusGeometry(.029,.008,6,18),rubber,x,.18,.098);core.name='bandage-core';}
  const bottle=add(new T.CylinderGeometry(.04,.04,.22,16),orange,.145,.17,0);bottle.rotation.x=Math.PI/2;
  box(.22,.035,.045,shell,-.025,.235,0);box(.05,.014,.10,white,-.025,.26,0);box(.12,.014,.04,white,-.025,.26,0);
 }else if(kind==='weapon'){
  const model=makeWeapon(weapon);model.rotation.z=Math.PI/2;model.position.y=.2;group.add(model);
 }else{
  box(.42,.21,.30,shell,0,.11,0,.03);for(const x of [-.13,.13])box(.04,.225,.31,rubber,x,.115,0);
  if(kind==='ammo')for(let i=0;i<5;i++)add(new T.CylinderGeometry(.018,.018,.10,8),orange,(i-2)*.055,.26,0);
  if(kind==='armor')box(.28,.09,.26,white,0,.24,0,.04);
  if(kind==='bag')box(.2,.035,.08,rubber,0,.245,0);
 }
 const color=kind==='med'?'#99efbd':kind==='kit'?'#f8e1a2':'#aec7a6';
 const marker=new T.Mesh(new T.RingGeometry(.44,.455,40),new T.MeshBasicMaterial({color,transparent:true,opacity:.55,side:T.DoubleSide,depthWrite:false}));marker.rotation.x=-Math.PI/2;marker.position.y=.012;marker.name='pickup-marker';group.add(marker);
 // Batch rigid pieces by material: a detailed kit needs a handful of draw calls.
 group.updateMatrixWorld(true);
 const batches=new Map<T.Material,T.BufferGeometry[]>();
 group.traverse(o=>{if(o instanceof T.Mesh&&o!==marker&&o.visible){const g=o.geometry.clone().applyMatrix4(o.matrixWorld);const geometry=g.index?g.toNonIndexed():g;const material=o.material as T.Material;const list=batches.get(material)||[];list.push(geometry);batches.set(material,list);o.geometry.dispose();if(g!==geometry)g.dispose();}});
 group.clear();group.add(marker);
 for(const [mat,geometries] of batches){const mesh=new T.Mesh(mergeGeometries(geometries),mat);mesh.castShadow=mesh.receiveShadow=true;group.add(mesh);geometries.forEach(g=>g.dispose());}
 return group;
}

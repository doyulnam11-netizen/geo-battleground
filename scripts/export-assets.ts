import {writeFile,mkdir} from 'node:fs/promises';
import {GLTFExporter} from 'three/addons/exporters/GLTFExporter.js';
import {Soldier,makeWeapon,makeFossil} from '../client/models';
import {makeLoot} from '../client/lootModels';
// GLTFExporter uses the FileReader interface; Blob is native in Node 22+.
class Reader {result:ArrayBuffer|string|null=null;onloadend:(()=>void)|null=null;async readAsArrayBuffer(blob:Blob){this.result=await blob.arrayBuffer();this.onloadend?.();}async readAsDataURL(blob:Blob){this.result=`data:${blob.type};base64,${Buffer.from(await blob.arrayBuffer()).toString('base64')}`;this.onloadend?.();}}
Object.assign(globalThis,{FileReader:Reader});
const out='public/assets/models';await mkdir(out,{recursive:true});const exporter=new GLTFExporter();const soldier=new Soldier();soldier.mixer.stopAllAction();const objects=[{name:'geo-ranger',object:soldier.group,animations:Object.values(soldier.actions).map(a=>{const clip=a.getClip().clone();for(const track of clip.tracks)track.name=track.name.replace(/\.bones\[([^\]]+)\]/,(_,name)=>soldier.bones.find(b=>b.name===name)!.uuid);return clip;})},...[0,1,2].map(v=>({name:`equipment-${v}`,object:makeWeapon(v),animations:[]})),{name:'ammonite',object:makeFossil(),animations:[]},...(['med','kit'] as const).map(kind=>({name:`recovery-${kind}`,object:makeLoot(kind),animations:[]}))];
for(const item of objects.filter(item=>process.argv.length<=2||process.argv.slice(2).includes(item.name))){const data=await exporter.parseAsync(item.object,{binary:true,animations:item.animations,onlyVisible:false});await writeFile(`${out}/${item.name}.glb`,Buffer.from(data as ArrayBuffer));console.log(`${item.name}.glb`);}

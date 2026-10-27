import {test} from 'node:test';
import assert from 'node:assert/strict';
import {GameRoom} from '../server/game';
import questions from '../server/data/questions.json';
import {movePlayer,eyePosition,bodyPoint,intersects} from '../shared/physics';
import {heightAt,obstacles} from '../shared/world';
import type {Input,Question} from '../shared/types';
const t0=1_000_000;
const input=(lean=0):Input=>({seq:1,x:0,z:0,yaw:0,pitch:0,lean,jump:false,sprint:false,stance:'stand',aim:false,fire:false});
function room(){const r=new GameRoom('ABC123',questions as Question[],false,1337);r.addPlayer('a','A',t0);r.addPlayer('b','B',t0);r.ready('b');r.start('a',t0);return r;}
test('lean changes eye and hitboxes smoothly; release centers and prone/sprint disable it',()=>{
 const r=room(),p=r.players.get('a')!;p.x=185;p.z=-185;p.y=heightAt(p.x,p.z);
 movePlayer(p,input(1),1/30);assert.ok(p.lean>0&&p.lean<1);
 for(let n=0;n<12;n++)movePlayer(p,input(1),1/30);assert.equal(p.lean,1);assert.ok(eyePosition(p)[0]>p.x+.4);assert.ok(bodyPoint(p,1)[0]>p.x);
 for(let n=0;n<12;n++)movePlayer(p,input(),1/30);assert.equal(p.lean,0);
 for(let n=0;n<12;n++)movePlayer(p,{...input(1),sprint:true},1/30);assert.equal(p.lean,0);
 movePlayer(p,{...input(1),stance:'prone'},1/30);assert.equal(p.lean,0);
});
test('lean sweeps the head and stops before a wall instead of revealing the other side',()=>{
 const r=room(),p=r.players.get('a')!,wall=obstacles.find(b=>b.kind==='wall'&&b.x===-11)!;
 p.x=wall.x-wall.w/2-.36;p.z=wall.z;p.y=heightAt(p.x,p.z);p.yaw=0;
 for(let n=0;n<30;n++)movePlayer(p,input(1),1/30);
 const [x,y,z]=eyePosition(p);assert.ok(p.lean<.65);assert.equal(intersects(x,y-.17,z,.34,wall,.18),false);
});
test('server bounds forged lean, includes it in snapshots and clears it when downed',()=>{
 const r=room(),p=r.players.get('a')!;r.input('a',input(1e10),t0+4000);assert.equal(r.inputs.get('a')![0].lean,1);r.tick(t0+4000);assert.ok(r.snapshot('b',t0+4000).players.find(p=>p.id==='a')!.lean>0);
 r.input('a',{...input(),seq:2,lean:NaN},t0+4033);assert.equal(r.inputs.get('a')![0].lean,0);
 p.protectedUntil=0;r.damage('a',200,null,t0+4100);assert.equal(p.lean,0);
});
test('packet gaps stop movement and fire but preserve held lean; explicit release centers',()=>{
 const r=room(),p=r.players.get('a')!;p.x=185;p.z=-185;p.y=heightAt(p.x,p.z);
 for(let n=0;n<6;n++){r.input('a',{...input(1),seq:n+1},t0+4000+n*34);r.tick(t0+4000+n*34);}
 assert.equal(p.lean,1);r.tick(t0+5000);assert.equal(p.lean,1);assert.equal(p.moving,false);assert.equal(p.shots,0);
 r.input('a',{...input(),seq:7},t0+5033);for(let n=0;n<6;n++)r.tick(t0+5033+n*30);assert.ok(p.lean<.01);
});
test('authoritative hits use tilted target head and tilted firing origin',()=>{
 const r=room(),a=r.players.get('a')!,b=r.players.get('b')!;a.x=b.x=185;a.z=-185;b.z=-191;a.y=b.y=20;a.yaw=b.yaw=0;a.lean=1;b.lean=-1;a.aim=true;a.protectedUntil=b.protectedUntil=0;
 const from=eyePosition(a),head=bodyPoint(b,1.64),dx=head[0]-from[0],dz=head[2]-from[2];a.yaw=Math.atan2(-dx,-dz);
 const actual=eyePosition(a);a.yaw=Math.atan2(-(head[0]-actual[0]),-(head[2]-actual[2]));a.pitch=Math.atan2(head[1]-actual[1],Math.hypot(head[0]-actual[0],head[2]-actual[2]));
 r.shoot(a,{...input(1),fire:true},t0+4000);const event=r.events.find(e=>e.type==='shot')!;assert.ok(event.from![0]>a.x+.3);assert.equal(event.target,'b');assert.equal(event.part,'head');assert.equal(b.hp,40);
});
test('ground recovery supplies spawn near each player; wall blocks pickup and nearest item wins',()=>{
 const r=room(),p=r.players.get('a')!;for(const kind of ['med','kit'])assert.ok(r.loot.some(l=>l.kind===kind&&Math.hypot(l.x-p.x,l.z-p.z)<3.4));
 const wall=obstacles.find(b=>b.kind==='wall'&&b.x===-11)!;p.x=wall.x-wall.w/2-.45;p.z=wall.z;p.y=heightAt(p.x,p.z);r.loot=[{id:'behind',kind:'kit',x:wall.x+wall.w/2+.5,z:wall.z}];r.action('a','loot',null,t0+4000);assert.equal(p.kits,0);assert.equal(r.loot.length,1);
 p.x=185;p.z=-185;p.y=heightAt(p.x,p.z);r.loot=[{id:'far',kind:'kit',x:p.x+2,z:p.z},{id:'near',kind:'med',x:p.x+.7,z:p.z}];r.action('a','loot',null,t0+4100);assert.equal(p.meds,3);assert.deepEqual(r.loot.map(l=>l.id),['far']);
});

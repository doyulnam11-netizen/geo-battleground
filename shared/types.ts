export type Stance = 'stand'|'crouch'|'prone';
export type Status = 'alive'|'downed'|'eliminated';
export interface Input {seq:number;x:number;z:number;yaw:number;pitch:number;jump:boolean;sprint:boolean;stance:Stance;aim:boolean;fire:boolean;lean?:number;clientTime?:number}
export interface Question {id:string;question:string;options:string[];answer:number;difficulty:'easy'|'medium'|'hard';topic:string;explanation:string}
export type PublicQuestion=Omit<Question,'answer'|'explanation'> & {deadline:number};
export interface Player {drop?:'plane'|'chute';scope?:number;id:string;name:string;bot:boolean;connected:boolean;ready:boolean;x:number;y:number;z:number;vy:number;yaw:number;pitch:number;lean:number;stance:Stance;grounded:boolean;moving:boolean;sprinting:boolean;aim:boolean;status:Status;hp:number;armor:number;weapon:number;weapons:number[];mag:number[];ammo:number;meds:number;kits:number;bag:boolean;reviveUsed:boolean;protectedUntil:number;reloadUntil:number;healUntil:number;healKind:'med'|'kit'|null;ack:number;kills:number;shots:number;hits:number;looted:number;rank:number;eliminatedAt:number;quizResult:null|{correct:boolean;question:string;options:string[];answer:number;explanation:string;topic:string};joinedAt:number}
export interface Loot {id:string;x:number;z:number;kind:'ammo'|'med'|'kit'|'armor'|'bag'|'weapon';weapon?:number}
export interface Zone {x:number;z:number;radius:number;nextRadius:number;nextAt:number;damage:number;phase:number}
export interface GameEvent {id:number;type:string;at:number;actor?:string;target?:string;text?:string;from?:number[];to?:number[];part?:string}
export interface Snapshot {type:'snapshot';time:number;code:string;phase:'lobby'|'playing'|'ended';host:string;startedAt:number;winner:string|null;players:Player[];loot:Loot[];zone:Zone;events:GameEvent[];you:string;question:PublicQuestion|null;practice:boolean}
export type ClientMessage={type:string;[key:string]:unknown};

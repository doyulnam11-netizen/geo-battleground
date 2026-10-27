export const RULES = {maxPlayers:12,hp:100,reviveHp:35,quizMs:25_000,protectionMs:3000,roundMs:660_000,tickRate:30,snapshotRate:15,reconnectMs:60_000,mapSize:400,walk:5.5,sprint:9,crouch:3,prone:1.7,jump:7,gravity:20,playerRadius:.36};
export const WEAPONS = [
 {id:0,name:'STRATA · AR',label:'자동 발사 장비',damage:{head:60,body:30,limb:18},interval:145,capacity:30,reloadMs:2100,range:170,spread:.008,color:'#c9dc9b'},
 {id:1,name:'ECHO · SMG',label:'근거리 장비',damage:{head:36,body:20,limb:12},interval:90,capacity:36,reloadMs:1700,range:90,spread:.016,color:'#edb37b'},
 {id:2,name:'EPOCH · DMR',label:'중거리 단발 장비',damage:{head:84,body:42,limb:25},interval:480,capacity:12,reloadMs:2600,range:240,spread:.002,color:'#94c9da'}] as const;
export const ZONES = [{at:0,radius:275,damage:1},{at:90_000,radius:180,damage:2},{at:210_000,radius:125,damage:3},{at:330_000,radius:80,damage:4},{at:450_000,radius:38,damage:6},{at:570_000,radius:8,damage:9},{at:660_000,radius:0,damage:16}];

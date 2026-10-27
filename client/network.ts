import type {Snapshot,Input} from '../shared/types';
export function serverUrl(path:string,websocket=false){
 const url=new URL(localStorage.getItem('geo-server')||import.meta.env.VITE_SERVER_URL||location.origin);
 const secure=url.protocol==='https:'||url.protocol==='wss:';
 url.protocol=websocket?(secure?'wss:':'ws:'):(secure?'https:':'http:');
 url.pathname=path;url.search='';url.hash='';return url.toString();
}
export async function checkServerHealth(){try{const response=await fetch(serverUrl('/api/health'));return response.ok&&(await response.json()).ok===true;}catch{return false;}}
export class Connection {
 ws:WebSocket|null=null;worker:Worker|null=null;snapshot:Snapshot|null=null;status='offline';ping=0;offset=0;private closed=false;private retry=0;private request:Record<string,unknown>|null=null;private retryTimer:ReturnType<typeof setTimeout>|null=null;private pingTimer:ReturnType<typeof setInterval>|null=null;
 onSnapshot:(s:Snapshot)=>void=()=>{};onStatus:(s:string)=>void=()=>{};onError:(s:string)=>void=()=>{};
 restore(){if(!sessionStorage.getItem('geo-token'))return;this.closed=false;this.open(true);}
 connect(type:'create'|'join'|'quick',name:string,code?:string){this.disconnect(false);this.closed=false;this.request={type,name,code};this.open(false);}
 practice(name:string){this.disconnect(false);this.closed=false;this.worker=new Worker(new URL('./practice.worker.ts',import.meta.url),{type:'module'});this.worker.onmessage=e=>this.receive(e.data);this.worker.onerror=()=>this.onError('연습 모드를 실행할 수 없습니다. 브라우저를 새로고침하세요.');this.worker.postMessage({type:'create',name});this.setStatus('practice');}
 private open(resume:boolean){this.setStatus(resume?'reconnecting':'connecting');try{this.ws=new WebSocket(serverUrl('/ws',true));}catch{this.setStatus('offline');this.onError('서버 주소가 올바르지 않습니다. 설정 → 서버 연결에서 주소를 확인하세요.');return;}const socket=this.ws;
 socket.onopen=()=>{if(this.ws!==socket)return;const token=sessionStorage.getItem('geo-token');this.send(resume&&token?{type:'resume',token}:this.request!);this.retry=0;if(this.pingTimer)clearInterval(this.pingTimer);this.pingTimer=setInterval(()=>this.send({type:'ping',sent:Date.now()}),3000);};socket.onmessage=e=>{try{this.receive(JSON.parse(e.data));}catch{}};socket.onerror=()=>{};socket.onclose=()=>{if(this.ws!==socket||this.closed)return;if(this.pingTimer)clearInterval(this.pingTimer);if(!this.snapshot){this.setStatus('offline');this.onError('멀티플레이 서버에 연결할 수 없습니다. 서버 주소를 확인하거나 연습 모드를 이용하세요.');return;}this.setStatus('reconnecting');this.retryTimer=setTimeout(()=>this.open(true),Math.min(4000,500*2**this.retry++));};}
 private receive(data:any){if(data.type==='snapshot'){this.snapshot=data;this.offset=data.time-Date.now();this.setStatus(this.worker?'practice':'online');this.onSnapshot(data);}if(data.type==='welcome'&&data.token)sessionStorage.setItem('geo-token',data.token);if(data.type==='error'){if(!this.snapshot)this.disconnect();this.onError(data.message);}if(data.type==='sessionExpired'){this.disconnect();this.onError(data.message);}if(data.type==='pong')this.ping=Math.max(0,Date.now()-data.sent);}
 send(data:Record<string,unknown>){if(this.worker)this.worker.postMessage(data);else if(this.ws?.readyState===WebSocket.OPEN)this.ws.send(JSON.stringify(data));}
 input(input:Input){this.send({type:'input',input:{...input,clientTime:Date.now()+this.offset-this.ping/2}});}
 action(action:string,value?:unknown){this.send({type:'action',action,value});}
 now(){return Date.now()+this.offset;}
 private setStatus(s:string){if(this.status!==s){this.status=s;this.onStatus(s);}}
 disconnect(notify=true){this.closed=true;if(this.retryTimer)clearTimeout(this.retryTimer);if(this.pingTimer)clearInterval(this.pingTimer);this.send({type:'leave'});this.ws?.close();this.ws=null;this.worker?.terminate();this.worker=null;this.snapshot=null;sessionStorage.removeItem('geo-token');if(notify)this.setStatus('offline');}
}
export const connection=new Connection();

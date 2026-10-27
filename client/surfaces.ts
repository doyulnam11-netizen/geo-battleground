import * as T from 'three';

/** Tileable original PBR maps; generated locally, no external asset downloads. */
export function surfaceMaps(kind:'soil'|'stone'|'bark',resolution=512){
 const size=resolution,heights=new Float32Array(size*size);
 const tone=kind==='soil'?[137,126,99]:kind==='stone'?[152,155,146]:[100,91,70];
 for(let y=0;y<size;y++)for(let x=0;x<size;x++){
  const u=x/size*Math.PI*2,v=y/size*Math.PI*2;
  let h=.5;for(let k=0;k<5;k++){const f=2**(k+1);h+=Math.sin(u*f+Math.sin(v*f))*Math.cos(v*f*.5+Math.sin(u*f))*.17/(k+1);}
  if(kind==='bark')h+=Math.sin(u*38+Math.sin(v*2)*2)*.22;
  if(kind==='stone')h-=Math.pow(Math.max(0,Math.cos(u*7+Math.sin(v*3))),16)*.18;
  heights[y*size+x]=h;
 }
 const make=(normal=false,roughness=false)=>{
  const canvas=document.createElement('canvas');canvas.width=canvas.height=size;const ctx=canvas.getContext('2d')!,im=ctx.createImageData(size,size);
  for(let y=0;y<size;y++)for(let x=0;x<size;x++){
   const h=heights[y*size+x],at=(y*size+x)*4;
   if(normal){const dx=(heights[y*size+(x+1)%size]-heights[y*size+(x+size-1)%size])*3,dy=(heights[((y+1)%size)*size+x]-heights[((y+size-1)%size)*size+x])*3;const n=new T.Vector3(-dx,-dy,1).normalize();im.data[at]=(n.x*.5+.5)*255;im.data[at+1]=(n.y*.5+.5)*255;im.data[at+2]=(n.z*.5+.5)*255;}
   else for(let k=0;k<3;k++)im.data[at+k]=roughness?Math.min(255,190+h*60):tone[k]*(.65+h*.7);
   im.data[at+3]=255;
  }
  ctx.putImageData(im,0,0);const texture=new T.CanvasTexture(canvas);texture.wrapS=texture.wrapT=T.RepeatWrapping;texture.anisotropy=8;if(!normal&&!roughness)texture.colorSpace=T.SRGBColorSpace;return texture;
 };
 return {map:make(),normalMap:make(true),roughnessMap:make(false,true)};
}

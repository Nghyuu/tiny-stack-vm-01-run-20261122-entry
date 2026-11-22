// Tiny stack VM for make.fun tiny-stack-vm-01 (ISA v1): runs every
// /input/<id>/program.bin and writes /output/<id>/stdout.bin + exit.txt.
import{mkdirSync as k,readdirSync as d,readFileSync as f,writeFileSync as w,statSync as u}from"node:fs";
import{join as j}from"node:path";
const T={0:[0,0,0],1:[1,0,1],2:[4,0,1],3:[0,1,0],4:[0,1,2],5:[0,2,2],6:[0,2,3],7:[0,3,3],16:[0,2,1],17:[0,2,1],18:[0,2,1],19:[0,2,1],20:[0,2,1],21:[0,2,1],22:[0,2,1],23:[0,1,1],24:[0,2,1],25:[0,2,1],26:[0,2,1],27:[0,1,1],28:[0,2,1],29:[0,2,1],30:[0,2,1],32:[0,2,1],33:[0,2,1],34:[0,2,1],48:[2,0,0],49:[2,1,0],50:[2,1,0],51:[2,0,0],52:[0,0,0],64:[0,1,1],65:[0,2,0],80:[0,1,0],81:[0,1,0],82:[0,0,1],83:[0,1,0]};
function r(p,q){
 const D=new Int32Array(256),C=new Int32Array(64),M=new Int32Array(256),o=new Uint8Array(65536);
 let s=0,c=0,n=0,i=0,x=0,t=0;
 const e=v=>({o:o.slice(0,n),code:v});
 for(;;){
  if(t===1e6)return e(10);
  if(x<0||x>=p.length)return e(9);
  const b=p[x],m=T[b];
  if(!m)return e(5);
  const[im,po,pu]=m;
  if(x+im>=p.length)return e(9);
  t++;
  const y=x+1+im;
  if(s<po)return e(2);
  if(s-po+pu>256)return e(3);
  x=y;
  if(b===0)return e(0);
  if(b===1){D[s++]=(p[y-1]<<24)>>24;continue}
  if(b===2){D[s++]=p[y-4]|p[y-3]<<8|p[y-2]<<16|p[y-1]<<24;continue}
  if(b===3){s--;continue}
  if(b===4){D[s]=D[s-1];s++;continue}
  if(b===5){const z=D[s-1];D[s-1]=D[s-2];D[s-2]=z;continue}
  if(b===6){D[s]=D[s-2];s++;continue}
  if(b===7){const a=D[s-3];D[s-3]=D[s-2];D[s-2]=D[s-1];D[s-1]=a;continue}
  if(b===23){D[s-1]=-D[s-1]|0;continue}
  if(b===27){D[s-1]=~D[s-1];continue}
  if(b>=16&&b<=34){
   const B=D[s-1],A=D[s-2];let v;
   if(b===16)v=A+B|0;else if(b===17)v=A-B|0;else if(b===18)v=Math.imul(A,B);
   else if(b===19){if(!B)return e(4);v=A===-2147483648&&B===-1?A:A/B|0}
   else if(b===20){if(!B)return e(4);v=B===-1?0:A%B|0}
   else if(b===21){if(!B)return e(4);v=Math.floor((A>>>0)/(B>>>0))|0}
   else if(b===22){if(!B)return e(4);v=(A>>>0)%(B>>>0)|0}
   else if(b===24)v=A&B;else if(b===25)v=A|B;else if(b===26)v=A^B;
   else if(b===28)v=A<<(B&31);else if(b===29)v=A>>(B&31);else if(b===30)v=A>>>(B&31)|0;
   else if(b===32)v=A===B?1:0;else if(b===33)v=A<B?1:0;else v=(A>>>0)<(B>>>0)?1:0;
   s-=2;D[s++]=v;continue;
  }
  if(b===48||b===49||b===50){
   const g=(p[y-2]|p[y-1]<<8)<<16>>16;let k=1;
   if(b!==48){const v=D[--s];k=b===49?v===0:v!==0}
   if(k)x=y+g;continue;
  }
  if(b===51){if(c===64)return e(7);C[c++]=y;x=p[y-2]|p[y-1]<<8;continue}
  if(b===52){if(!c)return e(8);x=C[--c];continue}
  if(b===64){const a=D[s-1];if(a<0||a>255)return e(6);D[s-1]=M[a];continue}
  if(b===65){const a=D[s-1],v=D[s-2];if(a<0||a>255)return e(6);s-=2;M[a]=v;continue}
  if(b===80){const z=String(D[s-1]);if(n+z.length>65536)return e(11);s--;for(let h=0;h<z.length;h++)o[n++]=z.charCodeAt(h);continue}
  if(b===81){if(n+1>65536)return e(11);o[n++]=D[--s]&255;continue}
  if(b===82){D[s++]=i<q.length?q[i++]:-1;continue}
  return e(D[--s]&255);
 }
}
const I=process.env.MAKEFUN_INPUT_DIR??"/input",O=process.env.MAKEFUN_OUTPUT_DIR??"/output";
for(const id of d(I).sort()){
 if(!u(j(I,id)).isDirectory())continue;
 const z=r(f(j(I,id,"program.bin")),f(j(I,id,"input.bin")));
 k(j(O,id),{recursive:true});
 w(j(O,id,"stdout.bin"),z.o);
 w(j(O,id,"exit.txt"),z.code+"\n");
}

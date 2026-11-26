(async()=>{
const SCREENS='glavnaya klienty klienty-kartochka soobshcheniya kalendar telegram-bot dengi materialy kontent ssylka katalog set komanda profil rekvizity pomoshch Nav'.split(' ');
const SINGLE={'telegram-bot':1,Nav:1};
const Q=new URLSearchParams(location.search);let S=Q.get('s')||'glavnaya';if(!SCREENS.includes(S))S='glavnaya';
const forced=Q.get('v');
const wide=forced?forced==='d':innerWidth>768;
const phone=!SINGLE[S]&&!wide;
const f=S==='Nav'?'Nav.dc.html':S==='telegram-bot'?'telegram-bot.dc.html':(S==='glavnaya'?(phone?'glavnaya-m':'Main'):S+(phone?'-m':''))+(S==='Nav'||S==='telegram-bot'?'':'.dc.html');
const KEY='hbm:'+f;
const st_get=k=>{try{return localStorage.getItem(k);}catch(e){return null;}};
const st_set=(k,v)=>{try{localStorage.setItem(k,v);}catch(e){}};
const st_clear=()=>{try{Object.keys(localStorage).filter(k=>k.startsWith('hbm:')).forEach(k=>localStorage.removeItem(k));}catch(e){}try{Object.keys(sessionStorage).filter(k=>k.startsWith('hbm:')).forEach(k=>sessionStorage.removeItem(k));}catch(e){}};
if(!forced){let w0=wide;matchMedia('(min-width:769px)').addEventListener('change',e=>{if(e.matches!==w0&&!SINGLE[S])location.reload();});}
const ROOT_W=SINGLE[S]&&S==='telegram-bot'?(innerWidth>420?'max-width:390px;margin:0 auto;box-shadow:0 0 0 1px #d6dde3,0 8px 40px rgba(0,0,0,.12);':''):S==='Nav'?'max-width:256px;':'';
if(ROOT_W&&innerWidth>420)document.documentElement.style.background='#e6edf0';
const SRC=S==='glavnaya'?null:null;
class DCLogic{constructor(p){this.props=p||{};this.state={};}
 setState(o){Object.assign(this.state,typeof o==='function'?o(this.state):o);schedule();}forceUpdate(){schedule();}}
const cache={};
async function load(file){ if(cache[file])return cache[file];
 const t=await (await fetch('project/'+file)).text(); const doc=new DOMParser().parseFromString(t,'text/html');
 const sc=doc.querySelector('script[data-dc-script]'); const C=new Function('DCLogic',sc.textContent+'\nreturn Component;')(DCLogic);
 const o={doc,C,tpl:doc.querySelector('x-dc'),links:[...doc.querySelectorAll('head link[rel=stylesheet]')].map(l=>l.getAttribute('href')),inst:[]};
 cache[file]=o; return o;}
const get=(scope,path)=>{path=path.trim(); if(path==='true')return true; if(path==='false')return false; if(/^-?\d+$/.test(path))return +path;
 let o=scope; for(const k of path.split('.')){ if(o==null)return undefined; o=o[k]; } return o;};
const sub=(s,scope)=>s.replace(/\{\{([^}]*)\}\}/g,(_,e)=>{const v=get(scope,e);return v==null||typeof v==='function'?'':String(v);});
const EV={onClick:'click',onInput:'input',onChange:'change',onSubmit:'submit',onKeyDown:'keydown',onKeyUp:'keyup',onFocus:'focus',onBlur:'blur'};
let ctr=0; const helm=new Set();
function mount(node,scope,parent,comp){
 if(node.nodeType===3){parent.appendChild(document.createTextNode(sub(node.textContent,scope)));return;}
 if(node.nodeType!==1)return;
 const tag=node.tagName.toLowerCase();
 if(tag==='helmet'){ if(!helm.has(node.innerHTML)){helm.add(node.innerHTML); node.querySelectorAll('style').forEach(s=>{const e=document.createElement('style');e.textContent=s.textContent;document.head.appendChild(e);});} return;}
 if(tag==='sc-if'){ if(get(scope,node.getAttribute('value').replace(/[{}]/g,'')))for(const c of node.childNodes)mount(c,scope,parent,comp);return;}
 if(tag==='sc-for'){ const l=get(scope,node.getAttribute('list').replace(/[{}]/g,''))||[];const as=node.getAttribute('as');
  l.forEach((it,i)=>{for(const c of node.childNodes)mount(c,Object.assign(Object.create(scope),{[as]:it,$index:i}),parent,comp);});return;}
 if(tag==='dc-import'){ const name=node.getAttribute('name'); const props={}; for(const a of node.attributes){ if(a.name==='name'||a.name.startsWith('hint'))continue;
   const k=a.name.replace(/-([a-z])/g,(_,c)=>c.toUpperCase()); const m=a.value.match(/^\{\{(.*)\}\}$/); props[k]=m?get(scope,m[1]):sub(a.value,scope);}
  const key=comp.file+':'+(ctr++); const ch=cache['__'+name]; renderChild(name,props,parent,key); return;}
 const el=document.createElement(tag==='svg'||node.namespaceURI.includes('svg')?'div':tag);
 let e2=el;
 if(node.namespaceURI&&node.namespaceURI.includes('svg')){ // copy svg subtree verbatim
   const w=document.createElement('div'); w.innerHTML=node.outerHTML; parent.appendChild(w.firstChild); return; }
 const EVL={};for(const k in EV)EVL[k.toLowerCase()]=k;
 for(const a of node.attributes){ let n=a.name; if(n.startsWith('hint-'))continue; if(EVL[n])n=EVL[n];
  const m=a.value.match(/^\{\{([^}]*)\}\}$/);
  if(EV[n]){ if(m){const fn=get(scope,m[1]); if(typeof fn==='function'){ el.addEventListener(EV[n],ev=>{ if(n==='onSubmit')ev.preventDefault(); fn(ev.target&&ev.target.value!==undefined?Object.assign(ev,{}):ev);});}} continue;}
  let v=m?get(scope,m[1]):sub(a.value,scope);
  if(n==='value'&&(tag==='input'||tag==='textarea')){ el.value=v==null?'':v; el.setAttribute('value',v==null?'':v); continue;}
  if(v===false||v==null||typeof v==='function'){ if(/^(aria-|data-)/.test(n)&&v===false)el.setAttribute(n,'false'); continue;}
  if(v===true&&!/^(aria-|data-)/.test(n)){el.setAttribute(n,'');continue;}
  el.setAttribute(n,String(v));
 }
 if(tag==='a'){const h=el.getAttribute('href'); const mm=h&&h.match(/^([\w-]+)\.dc\.html(#.*)?$/); if(mm){let t=mm[1].replace(/-m$/,'');if(t==='Main')t='glavnaya';el.setAttribute('href','?s='+t+(forced?'&v='+forced:'')+(mm[2]||''));}}
 if(tag==='textarea'){} 
 for(const c of node.childNodes)mount(c,scope,el,comp);
 parent.appendChild(el);
 if(tag==='textarea'&&node.getAttribute('value')){ el.value=get(scope,node.getAttribute('value').replace(/[{}]/g,''))||''; }
}
const childInst={};
function renderChild(name,props,parent,key){ const o=cache['__'+name]; if(!o){return;} let inst=childInst[key]; if(!inst){inst=new o.C(props);inst.__k=key;childInst[key]=inst;} inst.props=props;
 const vals=inst.renderVals(); const comp={file:name}; for(const c of o.tpl.childNodes)mount(c,Object.assign(Object.create(null),vals),parent,comp);}
let main,rootEl,pending=false;
const SKIP=/^toast/;
function save(){try{const o={};for(const k in main.inst.state){if(SKIP.test(k))continue;try{const v=main.inst.state[k];if(typeof v==='function'||v===undefined)continue;JSON.stringify(v);o[k]=v;}catch(e){}}st_set(KEY,JSON.stringify(o));}catch(e){}}
function restore(inst){if(location.hash)return;try{const raw=st_get(KEY);if(!raw)return;const o=JSON.parse(raw);for(const k in o)if(!SKIP.test(k))inst.state[k]=o[k];}catch(e){}}
function schedule(){ if(pending)return; pending=true; Promise.resolve().then(()=>{pending=false;render();});}
function render(){
 const all=[...rootEl.querySelectorAll('*')];const ae=document.activeElement;
 const fi=ae&&ae!==document.body?all.indexOf(ae):-1;const ss=fi>=0?ae.selectionStart:null,se=fi>=0?ae.selectionEnd:null;
 const sc=[];all.forEach((e,i)=>{if(e.scrollTop||e.scrollLeft)sc.push([i,e.scrollTop,e.scrollLeft]);});
 const sx=window.scrollX,sy=window.scrollY;
 ctr=0; const frag=document.createElement('div'); const vals=main.inst.renderVals();
 for(const c of main.tpl.childNodes)mount(c,Object.assign(Object.create(null),vals),frag,{file:f});
 const de=document.documentElement,sb=de.style.scrollBehavior;de.style.scrollBehavior='auto';
 rootEl.replaceChildren(...frag.childNodes);
 const n=[...rootEl.querySelectorAll('*')];
 sc.forEach(([i,t,l])=>{const e=n[i];if(e){e.scrollTop=t;e.scrollLeft=l;}});
 if(fi>=0&&n[fi]){const e=n[fi];try{e.focus({preventScroll:true});if(ss!=null)e.setSelectionRange(ss,se);}catch(x){}}
 window.scrollTo({left:sx,top:sy,behavior:'instant'});de.style.scrollBehavior=sb;
 if(main.inst.componentDidUpdate)main.inst.componentDidUpdate();
 save();window.__rendered=(window.__rendered||0)+1;
}
main=await load(f);
// css
for(const h of main.links){ if(h.startsWith('/_blob/')||h.startsWith('./support'))continue; }
for(const h of main.links){ if(h.startsWith('/_blob/')){const l=document.createElement('link');l.rel='stylesheet';l.href='blob/'+h.slice(7)+'.css';document.head.appendChild(l);} }
const st=document.createElement('style');st.textContent='body{margin:0}';document.head.appendChild(st);
// Nav
const nv=await load('Nav.dc.html'); cache['__Nav']=nv;
for(const h of nv.links){}
rootEl=document.getElementById('root'); if(ROOT_W)rootEl.style.cssText=ROOT_W;
main.inst=new main.C({}); restore(main.inst); window.__inst=main.inst;
const mv=main.inst; mv.componentDidMount&&mv.componentDidMount();
render();
(function(){const b=document.createElement('div');b.id='hbm-tools';
const mob=innerWidth<=768||forced==='m';
const FF='font-family:"IBM Plex Sans",system-ui,sans-serif;';
const lk=document.createElement('a');lk.href='screens.html';lk.textContent='Все экраны';
const bt=document.createElement('button');bt.type='button';bt.textContent='Сбросить';bt.id='hbm-reset';
bt.onclick=()=>{st_clear();location.href=location.pathname.replace(/[^/]*$/,'')+(forced?'?v='+forced:'');};
if(!mob){
 /* десктоп: левый нижний угол контентной области, правее бокового меню (там подпись RU) */
 let left=8;try{const sd=document.querySelector('.kab__side');if(sd){const r=sd.getBoundingClientRect();if(r.width>0&&r.right>0)left=Math.round(r.right)+8;}}catch(e){}
 b.style.cssText='position:fixed;left:'+left+'px;bottom:8px;z-index:900;display:flex;align-items:center;gap:6px;font:500 12px "IBM Plex Sans",system-ui,sans-serif';
 lk.style.cssText='color:#5b6b73;text-decoration:none;font-size:11px;background:rgba(246,248,250,.9);padding:3px 8px;border-radius:6px';
 bt.style.cssText=FF+'font-weight:500;font-size:11px;height:24px;padding:0 8px;border-radius:8px;border:1px solid #9cc9b0;background:#eef6f1;color:#1c2b33;cursor:pointer;box-shadow:0 1px 3px rgba(0,0,0,.1)';
 b.append(lk,bt);
}else{
 /* телефон: маленькая кнопка-иконка над нижним меню, по нажатию раскрывает «Сбросить / Все экраны» */
 b.style.cssText='position:fixed;left:4px;bottom:68px;z-index:900;display:flex;flex-direction:column;align-items:flex-start;gap:6px;'+FF;
 const tg=document.createElement('button');tg.type='button';tg.id='hbm-tools-tg';tg.setAttribute('aria-label','Служебное меню макета');tg.setAttribute('aria-expanded','false');
 tg.style.cssText='width:26px;height:26px;padding:0;border-radius:50%;border:1px solid #9cc9b0;background:#eef6f1;color:#1c2b33;opacity:.75;cursor:pointer;display:grid;place-items:center;box-shadow:0 1px 3px rgba(0,0,0,.1)';
 const NS='http://www.w3.org/2000/svg';const sv=document.createElementNS(NS,'svg');sv.setAttribute('viewBox','0 0 24 24');sv.setAttribute('width','14');sv.setAttribute('height','14');sv.setAttribute('fill','currentColor');
 [5,12,19].forEach(x=>{const c=document.createElementNS(NS,'circle');c.setAttribute('cx',x);c.setAttribute('cy',12);c.setAttribute('r',2);sv.appendChild(c);});tg.appendChild(sv);
 const pn=document.createElement('div');pn.id='hbm-tools-pn';pn.style.cssText='display:none;flex-direction:column;gap:6px;padding:8px;border-radius:12px;border:1px solid #d6dde3;background:#fff;box-shadow:0 4px 16px rgba(0,0,0,.16)';
 lk.style.cssText='color:#1c2b33;text-decoration:none;font-size:13px;padding:6px 8px;border-radius:8px;background:#f6f8fa;text-align:center';
 bt.style.cssText=FF+'font-weight:500;font-size:13px;height:32px;padding:0 14px;border-radius:10px;border:1px solid #9cc9b0;background:#eef6f1;color:#1c2b33;cursor:pointer';
 pn.append(lk,bt);
 tg.onclick=()=>{const o=pn.style.display==='none';pn.style.display=o?'flex':'none';tg.setAttribute('aria-expanded',o?'true':'false');};
 b.append(pn,tg);
}
document.body.appendChild(b);
})();
})();

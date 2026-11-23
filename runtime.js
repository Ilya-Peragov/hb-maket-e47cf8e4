(async()=>{
const Q=new URLSearchParams(location.search);const f=Q.get('f');const W=+Q.get('w')||0;
if(!/^[\w-]+\.dc\.html$/.test(f||'')){document.body.textContent='Нет такого экрана';return;}
if(W&&innerWidth>W+20){document.body.style.cssText='margin:0;background:#e6edf0';const fr=document.createElement('iframe');fr.src=location.href;fr.title='Телефон';fr.style.cssText='display:block;margin:0 auto;border:0;background:#fff;width:'+W+'px;max-width:100%;height:100vh;box-shadow:0 0 0 1px #d6dde3,0 8px 40px rgba(0,0,0,.12)';document.body.appendChild(fr);return;}
const ROOT_W=W?'max-width:'+W+'px;margin:0 auto;box-shadow:0 0 0 1px #d6dde3,0 8px 40px rgba(0,0,0,.12);':'';
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
 if(tag==='a'){const h=el.getAttribute('href'); const mm=h&&h.match(/^([\w-]+\.dc\.html)(#.*)?$/); if(mm){const t=mm[1]==='glavnaya.dc.html'?'Main.dc.html':mm[1]; const ph=/-m\.dc\.html$/.test(t)||t==='telegram-bot.dc.html'; el.setAttribute('href','run.html?f='+t+(ph?'&w=390':'')+(mm[2]||''));}}
 if(tag==='textarea'){} 
 for(const c of node.childNodes)mount(c,scope,el,comp);
 parent.appendChild(el);
 if(tag==='textarea'&&node.getAttribute('value')){ el.value=get(scope,node.getAttribute('value').replace(/[{}]/g,''))||''; }
}
const childInst={};
function renderChild(name,props,parent,key){ const o=cache['__'+name]; if(!o){return;} let inst=childInst[key]; if(!inst){inst=new o.C(props);inst.__k=key;childInst[key]=inst;} inst.props=props;
 const vals=inst.renderVals(); const comp={file:name}; for(const c of o.tpl.childNodes)mount(c,Object.assign(Object.create(null),vals),parent,comp);}
let main,rootEl,pending=false;
function schedule(){ if(pending)return; pending=true; Promise.resolve().then(()=>{pending=false;render();});}
function render(){
 const ae=document.activeElement; const key=ae&&ae.id?ae.id:null; const ss=ae&&ae.selectionStart; const sy=window.scrollY;
 const sc=[...document.querySelectorAll('[data-scroll]')].map(e=>e.scrollTop);
 ctr=0; const frag=document.createElement('div'); const vals=main.inst.renderVals();
 for(const c of main.tpl.childNodes)mount(c,Object.assign(Object.create(null),vals),frag,{file:f});
 rootEl.replaceChildren(...frag.childNodes);
 if(key){const n=document.getElementById(key); if(n){n.focus(); try{n.setSelectionRange(ss,ss);}catch(e){}}}
 window.scrollTo(0,sy);
 if(main.inst.componentDidUpdate)main.inst.componentDidUpdate();
 window.__rendered=(window.__rendered||0)+1;
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
main.inst=new main.C({}); window.__inst=main.inst;
const mv=main.inst; mv.componentDidMount&&mv.componentDidMount();
render();
})();

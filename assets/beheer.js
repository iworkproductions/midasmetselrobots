/* Metselrobots Benelux · beheer-zijbalk (teksten + instellingen) · werkt op elke pagina.
   Bewerkingen worden direct in deze browser bewaard. Live voor iedereen na "downloaden" + bestand vervangen in GitHub. */
(function(){
'use strict';
const WW_HASH="f599968c4ea3623f1d4f862ab07bf747c4ceaa026150d519d1c38686d462337f", GEBRUIKER="operator1995";
const PAD=(location.pathname.replace(/index\.html$/,'').replace(/\/+$/,''))||'/';
const IS_HOME=(PAD==='/');
const LS_EDITS=IS_HOME?'mrb-edits':'mrb-edits:'+PAD, LS_INST='mrb-instellingen';
const HOOK=window.MRB_HOOK||null;
const TALEN=HOOK?HOOK.talen:['nl'];
const TAALNAAM={nl:'NL',fr:'FR',de:'DE',en:'EN',lb:'LB'};

/* ---------- opslag ---------- */
function lees(k){ try{ return JSON.parse(localStorage.getItem(k)); }catch(e){ return null; } }
function schrijf(k,v){ try{ localStorage.setItem(k,JSON.stringify(v)); }catch(e){} }

/* ---------- ingebakken (gepubliceerde) aanpassingen ---------- */
let BAKE={};
try{ const el=document.getElementById('mrb-bake'); if(el&&el.textContent.trim()) BAKE=JSON.parse(el.textContent)||{}; }catch(e){ BAKE={}; }
BAKE.edits=BAKE.edits||{};

/* ---------- teksten: velden vinden ---------- */
const ORIG={};
function tagSubpagina(){
  if(HOOK) return;
  const sel='main h1,main h2,main h3,main h4,main p,main li,main td,main th,main summary,main strong,main .knop,main .zie a,main .auteur b,main .auteur .feit,footer [data-t]';
  let n=0;
  document.querySelectorAll(sel).forEach(el=>{
    if(el.closest('[data-t]') && el.closest('[data-t]')!==el) return;
    if(el.closest('script,style')) return;
    if(!el.textContent.trim()) return;
    if(!el.dataset.t){ n++; el.dataset.t='t'+String(n).padStart(2,'0'); }
  });
}
function verzamelVelden(){
  const velden=[]; let groep='Algemeen';
  document.querySelectorAll('[data-t]').forEach(el=>{
    if(el.namespaceURI && el.namespaceURI.includes('svg')) return;
    const k=el.dataset.t;
    if(ORIG[k]===undefined) ORIG[k]=el.innerHTML;
    if(HOOK){ groep=groepHome(k); }
    else {
      if(el.closest('header')) groep='Menu';
      else if(el.closest('footer')) groep='Footer';
      else if(el.closest('.cta')) groep='Afsluiter (bel-blok)';
      else if(el.closest('.auteur')) groep='Auteursblok';
      else if(el.closest('.zie')) groep='Lees ook';
      else if(el.closest('.kort')) groep='Kort antwoord';
      else if(el.closest('.hero')) groep='Binnenkomer';
      else if(el.tagName==='H2'){ groep=el.textContent.trim().slice(0,38); }
    }
    velden.push({k,el,groep,tag:el.tagName.toLowerCase()});
  });
  return velden;
}
function groepHome(k){
  const p=k.split('_')[0].replace(/\d+$/,'');
  const M={nav:'Menu',vh:'Binnenkomer (video)',b:'Knoppen binnenkomer',k:'Vlak 1 · Vandaag gebeld',m:'Vlak 2 · Midas',s:'Statement',zw:'Zo werkt het',vo:'Volume · beste prijs',mp:'Maatje-programma',rol:'Maatje-programma',c:'De keuze (kopen/huren/prijzen)',f:'Diensten (wiel)',fm:'Formulier adviesgesprek',rv:'Reviews',fq:'Veelgestelde vragen',mi:'Waarom we dit doen',rf:'te-RUGfonds',sl:'Contact',cf:'Contact',ft:'Footer'};
  if(/^c[123]/.test(k)) return M.c;
  if(/^rol/.test(k)) return M.rol;
  if(/^fq/.test(k)) return M.fq;
  if(/^rf/.test(k)) return M.rf;
  if(/^vo/.test(k)) return M.vo;
  if(/^zw/.test(k)) return M.zw;
  if(/^rv/.test(k)) return M.rv;
  if(/^mp/.test(k)) return M.mp;
  if(/^mi/.test(k)) return M.mi;
  if(/^sl/.test(k)) return M.sl;
  if(/^cf/.test(k)) return M.cf;
  if(/^fm/.test(k)) return M.fm;
  if(/^ft/.test(k)) return M.ft;
  return M[p]||'Overig';
}
function label(k,tag){
  const T={h1:'Titel',h2:'Kop',h3:'Subkop',h4:'Subkop',p:'Tekst',li:'Opsomming',td:'Tabelcel',th:'Tabelkop',summary:'Vraag',strong:'Label',a:'Knop',b:'Vet',span:'Regel',div:'Regel',em:'Nadruk'};
  return (T[tag]||tag)+' · '+k;
}

/* ---------- edits (per taal) ---------- */
let EDITS = HOOK ? HOOK.edits : {};
function laadEdits(){
  const lokaal=lees(LS_EDITS)||{};
  const samen={};
  [BAKE.edits,lokaal].forEach(src=>{ Object.keys(src||{}).forEach(l=>{ samen[l]=Object.assign(samen[l]||{},src[l]); }); });
  Object.keys(EDITS).forEach(k=>delete EDITS[k]);
  Object.assign(EDITS,samen);
}
function taal(){ return HOOK?HOOK.taal():'nl'; }
function pasEditsToe(){
  if(HOOK){ HOOK.toepassen(); return; }
  const e=EDITS.nl||{};
  document.querySelectorAll('[data-t]').forEach(el=>{ const k=el.dataset.t; if(e[k]!==undefined) el.innerHTML=e[k]; });
}
function bewaarEdits(){ schrijf(LS_EDITS,EDITS); if(HOOK&&HOOK.bewaar) HOOK.bewaar(); status('Opgeslagen in deze browser · '+new Date().toLocaleTimeString('nl-NL',{hour:'2-digit',minute:'2-digit'}),true); }

/* ---------- instellingen ---------- */
const INST_STD=Object.assign({tel:'+31640506451',telWeergave:'+31 6 40 50 64 51',wa:'31640506451',email:'midas@midasmetselrobots.nl',kvk:'',tijden:'Ma t/m zo · 9:00–22:00'},window.MRB_INSTELLINGEN||{});
let INST=Object.assign({},INST_STD,lees(LS_INST)||{});
window.MRB_INSTELLINGEN=INST;
function pasInstellingenToe(){
  document.querySelectorAll('a[href^="tel:"]').forEach(a=>a.href='tel:'+INST.tel.replace(/\s/g,''));
  document.querySelectorAll('a[href*="wa.me/"]').forEach(a=>{ a.href=a.href.replace(/wa\.me\/\d+/,'wa.me/'+INST.wa.replace(/\D/g,'')); });
  document.querySelectorAll('a[href^="mailto:"]').forEach(a=>{ a.href=a.href.replace(/^mailto:[^?]*/,'mailto:'+INST.email); });
  document.querySelectorAll('[data-i="email"]').forEach(el=>el.textContent=INST.email);
  document.querySelectorAll('[data-i="tel"]').forEach(el=>el.textContent=INST.telWeergave);
  document.querySelectorAll('[data-i="tijden"]').forEach(el=>el.textContent=INST.tijden);
  document.querySelectorAll('[data-i="kvk"]').forEach(el=>{ el.textContent=INST.kvk; const r=el.closest('.kvk-regel'); if(r) r.style.display=INST.kvk?'':'none'; });
}
function bewaarInst(){ schrijf(LS_INST,INST); pasInstellingenToe(); status('Instellingen opgeslagen in deze browser',true); }

/* ---------- login ---------- */
async function sha256(t){ const b=await crypto.subtle.digest('SHA-256',new TextEncoder().encode(t)); return [...new Uint8Array(b)].map(x=>x.toString(16).padStart(2,'0')).join(''); }
function ingelogd(){ return sessionStorage.getItem('mrb-auth')==='1'; }
function bouwLogin(){
  const d=document.createElement('div'); d.id='mrb-login';
  d.innerHTML='<div class="kader"><h3>Beheer · Metselrobots Benelux</h3><input type="text" id="mrb-gebr" placeholder="Gebruikersnaam" autocomplete="username"><input type="password" id="mrb-ww" placeholder="Wachtwoord" autocomplete="current-password"><button class="mrb-knop geel" id="mrb-inlog">Inloggen</button><div class="fout" id="mrb-fout"></div></div>';
  document.body.appendChild(d);
  d.addEventListener('click',e=>{ if(e.target===d) d.classList.remove('aan'); });
  const poog=async()=>{
    const h=await sha256(document.getElementById('mrb-ww').value);
    if(document.getElementById('mrb-gebr').value.trim().toLowerCase()===GEBRUIKER && h===WW_HASH){
      sessionStorage.setItem('mrb-auth','1'); d.classList.remove('aan'); open();
      if(HOOK&&HOOK.naLogin) HOOK.naLogin();
    } else document.getElementById('mrb-fout').textContent='Onjuiste gebruikersnaam of wachtwoord.';
  };
  document.getElementById('mrb-inlog').onclick=poog;
  document.getElementById('mrb-ww').addEventListener('keydown',e=>{ if(e.key==='Enter') poog(); });
  return d;
}

/* ---------- zijbalk ---------- */
let ZIJ=null, VELDEN=[], TAB='teksten';
function status(t,ok){ const s=ZIJ&&ZIJ.querySelector('.mrb-status'); if(!s) return; s.textContent=t; s.classList.toggle('ok',!!ok); }
function bouwZij(){
  ZIJ=document.createElement('aside'); ZIJ.id='mrb-zij';
  ZIJ.innerHTML=`<div class="mrb-kop"><div><b>Beheer</b><small>${IS_HOME?'Homepage':'Pagina '+PAD}</small></div><button class="mrb-sluit" title="Sluiten">✕</button></div>
  <div class="mrb-tabs"><button data-tab="teksten" class="aan">Teksten</button><button data-tab="instellingen">Instellingen</button>${IS_HOME?'<button data-tab="leads">Leads</button>':''}</div>
  <div class="mrb-body"></div>
  <div class="mrb-voet"><div class="mrb-status"></div><div class="mrb-acties"></div></div>`;
  document.body.appendChild(ZIJ);
  ZIJ.querySelector('.mrb-sluit').onclick=sluit;
  ZIJ.querySelectorAll('.mrb-tabs button').forEach(b=>b.onclick=()=>{ if(b.dataset.tab==='leads'){ const s=document.getElementById('beheer'); if(s){ s.classList.add('open'); s.scrollIntoView({behavior:'smooth'}); } return; } TAB=b.dataset.tab; ZIJ.querySelectorAll('.mrb-tabs button').forEach(x=>x.classList.toggle('aan',x===b)); teken(); });
}
function open(){ if(!ZIJ) bouwZij(); ZIJ.classList.add('aan'); document.body.classList.add('mrb-open'); teken(); }
function sluit(){ ZIJ.classList.remove('aan'); document.body.classList.remove('mrb-open'); ontmarkeer(); }
let GEMARKEERD=null;
function markeer(el){ ontmarkeer(); GEMARKEERD=el; el.classList.add('mrb-mark'); el.scrollIntoView({behavior:'smooth',block:'center'}); }
function ontmarkeer(){ if(GEMARKEERD){ GEMARKEERD.classList.remove('mrb-mark'); GEMARKEERD=null; } }

function teken(){
  const body=ZIJ.querySelector('.mrb-body'), acties=ZIJ.querySelector('.mrb-acties');
  body.innerHTML=''; acties.innerHTML='';
  if(TAB==='teksten') tekenTeksten(body,acties); else tekenInstellingen(body,acties);
}
function tekenTeksten(body,acties){
  VELDEN=verzamelVelden();
  const l=taal();
  let html='';
  if(HOOK){ html+='<div class="mrb-talen">'+TALEN.map(t=>`<button data-l="${t}" class="${t===l?'aan':''}">${TAALNAAM[t]||t}</button>`).join('')+'</div>'; }
  html+='<input class="mrb-zoek" placeholder="Zoek in teksten…">';
  html+=`<div class="mrb-uitleg">Typ in een veld en de site verandert direct. Klik op een tekst op de pagina om het veld te openen. Alles wordt bewaard in deze browser; live voor iedereen zet je het met <b>Website downloaden</b> en het bestand in GitHub vervangen.</div>`;
  const groepen={}; const volgorde=[];
  VELDEN.forEach(v=>{ if(!groepen[v.groep]){ groepen[v.groep]=[]; volgorde.push(v.groep); } groepen[v.groep].push(v); });
  const e=(EDITS[l]||{});
  volgorde.forEach((g,gi)=>{
    html+=`<details class="mrb-groep" ${gi<2?'open':''}><summary>${g}<span>${groepen[g].length}</span></summary>`;
    groepen[g].forEach(v=>{
      const gew=e[v.k]!==undefined;
      const val=v.el.innerHTML;
      html+=`<div class="mrb-veld ${gew?'gewijzigd':''}" data-k="${v.k}"><label>${label(v.k,v.tag)}${gew?'<button data-reset="'+v.k+'">↩ origineel</button>':'<i>origineel</i>'}</label><textarea data-k="${v.k}" rows="${Math.min(8,Math.max(1,Math.ceil(val.length/48)))}">${val.replace(/&/g,'&amp;').replace(/</g,'&lt;')}</textarea></div>`;
    });
    html+='</details>';
  });
  body.innerHTML=html;
  body.querySelectorAll('.mrb-talen button').forEach(b=>b.onclick=()=>{ HOOK.zetTaal(b.dataset.l); teken(); });
  body.querySelector('.mrb-zoek').addEventListener('input',ev=>{
    const q=ev.target.value.toLowerCase();
    body.querySelectorAll('.mrb-veld').forEach(v=>{ v.style.display=(!q||v.textContent.toLowerCase().includes(q)||v.querySelector('textarea').value.toLowerCase().includes(q))?'':'none'; });
    body.querySelectorAll('.mrb-groep').forEach(g=>{ const z=[...g.querySelectorAll('.mrb-veld')].some(v=>v.style.display!=='none'); g.style.display=z?'':'none'; if(q) g.open=true; });
  });
  body.querySelectorAll('textarea[data-k]').forEach(ta=>{
    ta.addEventListener('focus',()=>{ const v=VELDEN.find(x=>x.k===ta.dataset.k); if(v) markeer(v.el); });
    ta.addEventListener('input',()=>{
      const v=VELDEN.find(x=>x.k===ta.dataset.k); if(!v) return;
      v.el.innerHTML=ta.value;
      const l2=taal(); EDITS[l2]=EDITS[l2]||{}; EDITS[l2][v.k]=ta.value;
      ta.closest('.mrb-veld').classList.add('gewijzigd');
      clearTimeout(ta._t); ta._t=setTimeout(bewaarEdits,500);
    });
  });
  body.querySelectorAll('button[data-reset]').forEach(b=>b.onclick=()=>{
    const k=b.dataset.reset, l2=taal();
    if(EDITS[l2]) delete EDITS[l2][k];
    if(BAKE.edits[l2]&&BAKE.edits[l2][k]!==undefined){ /* gepubliceerde versie blijft basis */ EDITS[l2]=EDITS[l2]||{}; EDITS[l2][k]=BAKE.edits[l2][k]; }
    bewaarEdits(); pasEditsToe(); teken();
  });
  acties.innerHTML=`<button class="mrb-knop geel" id="mrb-download">⬇ Website downloaden (${IS_HOME?'index.html':PAD.replace(/^\//,'')+'/index.html'})</button>
  <button class="mrb-knop wit" id="mrb-herstel">Alle teksten terug naar origineel</button>
  <button class="mrb-knop rood" id="mrb-uit">Uitloggen</button>`;
  acties.querySelector('#mrb-download').onclick=downloadPagina;
  acties.querySelector('#mrb-herstel').onclick=()=>{ if(!confirm('Alle eigen tekstaanpassingen van deze pagina ('+(HOOK?'taal '+taal().toUpperCase():'')+') wissen?')) return; const l2=taal(); delete EDITS[l2]; Object.keys(ORIG).forEach(k=>{ const el=document.querySelector('[data-t="'+k+'"]'); if(el&&!HOOK) el.innerHTML=ORIG[k]; }); bewaarEdits(); pasEditsToe(); teken(); };
  acties.querySelector('#mrb-uit').onclick=()=>{ bewaarEdits(); sessionStorage.removeItem('mrb-auth'); sluit(); if(HOOK&&HOOK.uitloggen) HOOK.uitloggen(); };
}
function tekenInstellingen(body,acties){
  const V=[['telWeergave','Telefoonnummer (zoals getoond)','+31 6 40 50 64 51'],['tel','Telefoonnummer (voor bellen, zonder spaties)','+31640506451'],['wa','WhatsApp-nummer (alleen cijfers, met landcode)','31640506451'],['email','E-mailadres','midas@midasmetselrobots.nl'],['kvk','KvK-nummer (leeg = regel verborgen)','12345678'],['tijden','Openingstijden','Ma t/m zo · 9:00–22:00']];
  let html=`<div class="mrb-uitleg">Deze gegevens gelden voor <b>alle pagina's</b>: elke bel-, WhatsApp- en mailknop, de footer en het KvK-nummer. Live voor iedereen: <b>instellingen.js downloaden</b> en in GitHub <code>assets/instellingen.js</code> vervangen. Eén bestand, hele site.</div>`;
  V.forEach(([k,lb,ph])=>{ html+=`<div class="mrb-veld"><label>${lb}</label><input data-i="${k}" value="${(INST[k]||'').replace(/"/g,'&quot;')}" placeholder="${ph}"></div>`; });
  body.innerHTML=html;
  body.querySelectorAll('input[data-i]').forEach(i=>i.addEventListener('input',()=>{ INST[i.dataset.i]=i.value; clearTimeout(i._t); i._t=setTimeout(bewaarInst,400); }));
  acties.innerHTML=`<button class="mrb-knop geel" id="mrb-dl-inst">⬇ instellingen.js downloaden</button><button class="mrb-knop wit" id="mrb-inst-reset">Terug naar gepubliceerde instellingen</button>`;
  acties.querySelector('#mrb-dl-inst').onclick=()=>{
    const tekst='/* Metselrobots Benelux · centrale instellingen. Aanpassen via de beheer-zijbalk → Instellingen → downloaden, daarna dit bestand vervangen in assets/. */\nwindow.MRB_INSTELLINGEN = '+JSON.stringify(INST,null,1)+';\n';
    downloadBestand('instellingen.js',tekst,'text/javascript'); status('instellingen.js gedownload · vervang assets/instellingen.js in GitHub',true);
  };
  acties.querySelector('#mrb-inst-reset').onclick=()=>{ INST=Object.assign({},INST_STD); window.MRB_INSTELLINGEN=INST; localStorage.removeItem(LS_INST); pasInstellingenToe(); teken(); };
}

/* ---------- downloaden ---------- */
function downloadBestand(naam,inhoud,type){
  const b=new Blob([inhoud],{type:type||'text/html'}); const u=URL.createObjectURL(b);
  const a=document.createElement('a'); a.href=u; a.download=naam; document.body.appendChild(a); a.click(); a.remove(); setTimeout(()=>URL.revokeObjectURL(u),2000);
}
async function downloadPagina(){
  status('Bezig met samenstellen…');
  try{
    const r=await fetch(location.pathname,{cache:'no-store'}); let html=await r.text();
    const samen={}; [BAKE.edits,EDITS].forEach(src=>Object.keys(src||{}).forEach(l=>{ samen[l]=Object.assign(samen[l]||{},src[l]); }));
    const json=JSON.stringify({v:1,bijgewerkt:new Date().toISOString(),edits:samen}).replace(/<\/script/gi,'<\\/script');
    if(/<script id="mrb-bake"[^>]*>[\s\S]*?<\/script>/i.test(html)) html=html.replace(/(<script id="mrb-bake"[^>]*>)[\s\S]*?(<\/script>)/i,(m,a,b)=>a+json+b);
    else html=html.replace(/<\/head>/i,'<script id="mrb-bake" type="application/json">'+json+'</script>\n</head>');
    downloadBestand('index.html',html);
    status('Gedownload · vervang '+(IS_HOME?'index.html':PAD.replace(/^\//,'')+'/index.html')+' in GitHub, dan staat het live',true);
  }catch(e){ status('Downloaden lukte niet: '+e.message); }
}

/* ---------- start ---------- */
function start(){
  tagSubpagina();
  verzamelVelden();
  laadEdits(); pasEditsToe();
  pasInstellingenToe();
  const login=bouwLogin();
  const raaf=document.getElementById('raafknop');
  if(raaf){ raaf.onclick=()=>{ if(ingelogd()){ open(); if(HOOK&&HOOK.naLogin) HOOK.naLogin(); } else { login.classList.add('aan'); document.getElementById('mrb-gebr').focus(); } }; }
  /* klik op tekst → veld openen */
  document.addEventListener('click',e=>{
    if(!document.body.classList.contains('mrb-open')||TAB!=='teksten') return;
    const el=e.target.closest('[data-t]'); if(!el||ZIJ.contains(e.target)) return;
    if(el.tagName==='A'||el.closest('a')) e.preventDefault();
    const ta=ZIJ.querySelector('textarea[data-k="'+el.dataset.t+'"]'); if(!ta) return;
    const g=ta.closest('.mrb-groep'); if(g) g.open=true;
    ta.focus(); ta.scrollIntoView({behavior:'smooth',block:'center'}); markeer(el);
  },true);
  if(ingelogd()) { /* sessie loopt nog: zijbalk pas openen via raaf, niet ongevraagd */ }
  window.MRB={open,sluit,inst:()=>INST,edits:EDITS};
}
if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',start); else start();
})();

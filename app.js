(function(){
"use strict";

/* ---------- Contenu ----------
   who   : « Qui de nous deux… » – chacun désigne l'un des deux, on compare.
   guess : question sur {X} (la personne visée) – {X} répond pour elle-même, l'autre devine. */
const LEVELS = [
  {n:1, name:"Complicité", tok:"--h1", tag:"Petites manies et habitudes du quotidien"},
  {n:2, name:"Souvenirs",  tok:"--h2", tag:"Votre histoire, vos premières fois"},
  {n:3, name:"Séduction",  tok:"--h3", tag:"Ce qui vous fait craquer l'un chez l'autre"},
  {n:4, name:"Coquin",     tok:"--h4", tag:"Ça commence à chauffer sous la couette"},
  {n:5, name:"Brûlant",    tok:"--h5", tag:"Fantasmes et envies inavouées"},
];
/* Les questions sont dans le dossier questions/ (un fichier par niveau). */
const Q = window.PILEPOIL_Q || [];
const DECK_SIZE = 30; // nombre de questions tirées au hasard pour une partie
const DARES = {
  1:["Chacun dit une qualité de l'autre qu'il n'a jamais dite.","Imitez-vous mutuellement au réveil.","Un câlin de 10 secondes avant la question suivante."],
  2:["Racontez chacun votre souvenir préféré de vous deux.","Un bisou sur le bout du nez.","Rejouez votre premier baiser."],
  3:["Un bisou dans le cou.","Un compliment sincère, les yeux dans les yeux, sans rire.","Un slow de 30 secondes, même sans musique."],
  4:["Un massage des épaules de 2 minutes.","Un baiser de cinéma de 10 secondes.","Retirez chacun un vêtement… une chaussette compte."],
  5:["Retirez chacun un vêtement, celui que l'autre choisit.","Murmure à l'oreille de l'autre ce que tu as envie de lui faire ce soir.","Embrasse l'autre pendant 10 secondes, là où il ou elle le décide.","Un massage de 2 minutes, torse nu.","Choisissez ensemble une position à essayer plus tard ce soir."],
};
const QBY = Object.fromEntries(Q.map(x=>[x.id,x]));

/* ---------- Icônes ---------- */
const ICON = {
  logo: '<svg class="logo" viewBox="0 0 64 64" aria-hidden="true">'
      + '<g class="b2"><path d="M26 54c0-13 6-23 15-23s16 10 16 23c0 3-4 4-16 4s-15-1-15-4z" fill="#8ec5ff"/>'
      + '<path d="M36 43q2.5 2.5 5 0M46 43q2.5 2.5 5 0" fill="none" stroke="#2b1d22" stroke-width="2" stroke-linecap="round"/><ellipse cx="51" cy="48" rx="3" ry="1.8" fill="#ff8fa8"/></g>'
      + '<g class="b1"><path d="M7 54c0-14 7-25 17-25s17 11 17 25c0 3-4 4-17 4S7 57 7 54z" fill="#ff8fab"/>'
      + '<path d="M17 42q2.5 2.5 5 0M27 42q2.5 2.5 5 0" fill="none" stroke="#2b1d22" stroke-width="2" stroke-linecap="round"/><ellipse cx="14" cy="47" rx="3" ry="1.8" fill="#ff5f87" opacity=".6"/><ellipse cx="34" cy="47" rx="3" ry="1.8" fill="#ff5f87" opacity=".6"/></g>'
      + '<path class="hz" d="M33 12c-2-3.5-8-2.5-8 2 0 3.5 4.5 6.5 8 9 3.5-2.5 8-5.5 8-9 0-4.5-6-5.5-8-2z" fill="var(--accent)"/></svg>',
  plus: '<svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"><path d="M12 5v14M5 12h14"/></svg>',
  key: '<svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><circle cx="8" cy="15" r="4"/><path d="M11 12l9-9M17 6l3 3"/></svg>',
  phone: '<svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><rect x="6" y="2.5" width="12" height="19" rx="3"/><path d="M11 18h2"/></svg>',
  download: '<svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M12 4v11M7 10l5 5 5-5M5 20h14"/></svg>',
  share: '<svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 15V3.5M7.5 8 12 3.5 16.5 8"/><path d="M8 11H6.5A2.5 2.5 0 0 0 4 13.5v5A2.5 2.5 0 0 0 6.5 21h11a2.5 2.5 0 0 0 2.5-2.5v-5a2.5 2.5 0 0 0-2.5-2.5H16"/></svg>',
  copy: '<svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="11" height="11" rx="2.5"/><path d="M15 9V6.5A2.5 2.5 0 0 0 12.5 4h-6A2.5 2.5 0 0 0 4 6.5v6A2.5 2.5 0 0 0 6.5 15H9"/></svg>',
  sun: '<svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><circle cx="12" cy="12" r="4.5"/><path d="M12 2.5v2M12 19.5v2M4.6 4.6l1.4 1.4M18 18l1.4 1.4M2.5 12h2M19.5 12h2M4.6 19.4L6 18M18 6l1.4-1.4"/></svg>',
  moon: '<svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 14.5A8 8 0 1 1 9.5 4a6.5 6.5 0 0 0 10.5 10.5z"/></svg>',
  exit: '<svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M10 4H6a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h4M15 8l4 4-4 4M19 12H9"/></svg>',
  replay: '<svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 12a8 8 0 1 0 2.4-5.7M4 4v4h4"/></svg>',
  back: '<svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M15 5l-7 7 7 7"/></svg>',
  next: '<svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M9 5l7 7-7 7"/></svg>',
};
function icon(markup){ const t = document.createElement("template"); t.innerHTML = markup.trim(); return t.content.firstChild; }

/* ---------- Illustrations des niveaux ---------- */
const CHILI = '<svg viewBox="0 0 12 16" aria-hidden="true"><path d="M5.2 4.6c1.6-.5 3.6.2 4.2 2 .9 2.8-.9 6.6-5.6 8.6-.6.2-.9-.4-.5-.8 2-1.9 2.3-4.4 1.6-6.4-.4-1.2-.8-2.9.3-3.4z" fill="#e8322f"/><path d="M5.6 5c-.3-1.4.2-2.6 1.4-3.4" fill="none" stroke="#3f9b4b" stroke-width="1.6" stroke-linecap="round"/><path d="M4.6 5.2c.8-.9 2.6-1 3.6-.2" fill="none" stroke="#3f9b4b" stroke-width="1.6" stroke-linecap="round"/></svg>';
const LVPIC = {
  1: '<svg viewBox="0 0 48 48"><path d="M24 7c-1.4-2.3-5.4-1.7-5.4 1.2 0 2.3 3 4.3 5.4 5.9 2.4-1.6 5.4-3.6 5.4-5.9 0-2.9-4-3.5-5.4-1.2z" fill="#ff6b8b"/><rect x="5" y="20" width="15" height="19" rx="4" fill="#ffb3c6"/><path d="M20 25h2.5a3.5 3.5 0 0 1 0 7H20" fill="none" stroke="#ffb3c6" stroke-width="3"/><rect x="26" y="20" width="15" height="19" rx="4" fill="#8ec5ff"/><path d="M41 25h2a3.5 3.5 0 0 1 0 7h-2" fill="none" stroke="#8ec5ff" stroke-width="3"/><path d="M9 28q2 2 4 0M30 28q2 2 4 0" fill="none" stroke="#2b1d22" stroke-width="1.6" stroke-linecap="round"/><ellipse cx="12.5" cy="33" rx="2" ry="1.2" fill="#ff6b8b" opacity=".6"/><ellipse cx="33.5" cy="33" rx="2" ry="1.2" fill="#ff6b8b" opacity=".6"/></svg>',
  2: '<svg viewBox="0 0 48 48"><g transform="rotate(-9 24 24)"><rect x="9" y="7" width="30" height="35" rx="2.5" fill="#ffffff" stroke="#e3d6dc" stroke-width="1.2"/><rect x="12.5" y="10.5" width="23" height="21" rx="1" fill="#bfe3ff"/><circle cx="31" cy="15" r="3" fill="#ffd36b"/><path d="M12.5 31.5l7-8 5 5 3.5-3.5 7.5 6.5z" fill="#7cc47f"/><path d="M24 22.6c-.9-1.5-3.5-1.1-3.5.8 0 1.5 2 2.8 3.5 3.8 1.5-1 3.5-2.3 3.5-3.8 0-1.9-2.6-2.3-3.5-.8z" fill="#ff6b8b"/><path d="M15 37h12" stroke="#c9b5bf" stroke-width="1.6" stroke-linecap="round"/></g></svg>',
  3: '<svg viewBox="0 0 48 48"><path d="M24 44V24" stroke="#3f9b4b" stroke-width="2.6" stroke-linecap="round"/><path d="M24 35c-5-1-8-4-8-8 4 0 7 3 8 8z" fill="#5fb769"/><path d="M24 31c4-.5 6.5-3 7-6.5-3.5.2-6.3 2.6-7 6.5z" fill="#5fb769"/><path d="M14 13c0-5 5-8 10-8s10 3 10 8c0 7-4.5 12-10 12s-10-5-10-12z" fill="#e2405f"/><path d="M18 11c2-3 10-3 12 0-1 4-3 6-6 6s-5-2-6-6z" fill="#c42c4a"/><path d="M21 12c1.5 2 4.5 2 6 0" fill="none" stroke="#ff8fa8" stroke-width="1.6" stroke-linecap="round"/><path d="M14.5 15c2 4 5 6 9.5 6" fill="none" stroke="#b81f3e" stroke-width="1.4" stroke-linecap="round"/></svg>',
  4: '<svg viewBox="0 0 48 48"><path d="M5 23c4-6 9-9 13-9 2.4 0 4.3 1.3 6 3 1.7-1.7 3.6-3 6-3 4 0 9 3 13 9-1 .6-2.3.8-4 .8H9c-1.7 0-3-.2-4-.8z" fill="#e2405f"/><path d="M5 23c1 .6 2.3.8 4 .8h30c1.7 0 3-.2 4-.8-4 8-11 12-19 12S9 31 5 23z" fill="#c42c4a"/><path d="M9 23.8h30" stroke="#8c1530" stroke-width="1.6" stroke-linecap="round"/><path d="M14 18.5c2-1.5 4-2 6-1.5M31 29c2-.5 4-1.8 5.5-3.5" fill="none" stroke="#ff9fb4" stroke-width="1.8" stroke-linecap="round"/></svg>',
  5: '<svg viewBox="0 0 48 48"><path d="M24 3c2 6 9 9 11 17 1.5-2 1.6-4.5 1.2-6.6C41 18 43 23 43 28c0 9-8.5 16-19 16S5 37 5 28c0-6 3-10 6.5-13 .2 2.6 1 4.6 2.6 6C14.5 13 20 9 24 3z" fill="#ff8a3d"/><path d="M24 13c1.3 4 5.5 6.2 6.8 11 1-1.2 1.2-2.7 1-4 2.6 2.7 3.8 5.7 3.8 8.6 0 6.2-5.3 11-11.6 11S12.4 34.8 12.4 28.6c0-3.6 1.8-6.4 4-8.3.1 1.6.7 2.9 1.6 3.7C18.4 19 21.4 16.6 24 13z" fill="#ffc94a"/><path d="M24 40c-.4-.3-7-4.4-7-9 0-2.4 1.8-4 3.8-4 1.3 0 2.4.7 3.2 1.8.8-1.1 1.9-1.8 3.2-1.8 2 0 3.8 1.6 3.8 4 0 4.6-6.6 8.7-7 9z" fill="#e2304f"/></svg>',
};

/* ---------- Avatars animaux (SVG) ---------- */
const EYES = '<circle cx="25" cy="36" r="3.2" fill="#2b1d22"/><circle cx="39" cy="36" r="3.2" fill="#2b1d22"/><circle cx="26" cy="35" r="1.1" fill="#fff"/><circle cx="40" cy="35" r="1.1" fill="#fff"/>';
const BLUSH = '<ellipse cx="18.5" cy="43" rx="4" ry="2.4" fill="#ff7f9c" opacity=".55"/><ellipse cx="45.5" cy="43" rx="4" ry="2.4" fill="#ff7f9c" opacity=".55"/>';
const MOUTH = (y) => '<path d="M28.5 ' + y + 'q3.5 3 7 0" fill="none" stroke="#2b1d22" stroke-width="2" stroke-linecap="round"/>';
const AVATARS = [
  {k:"chat", n:"Chat", bg:"#ffe3c7", s:'<path d="M14 31L17 11l13 11z" fill="#f4a259"/><path d="M50 31L47 11 34 22z" fill="#f4a259"/><path d="M17.5 25l1-10 7.5 6z" fill="#ffc2c8"/><path d="M46.5 25l-1-10-7.5 6z" fill="#ffc2c8"/><circle cx="32" cy="38" r="19" fill="#f4a259"/>' + EYES + BLUSH + '<path d="M30 40.5h4l-2 2.2z" fill="#e9707f"/>' + MOUTH(44)},
  {k:"chien", n:"Chien", bg:"#e3edff", s:'<circle cx="32" cy="38" r="19" fill="#d9a66b"/><ellipse cx="14" cy="34" rx="6.5" ry="13" fill="#8a5a3b" transform="rotate(18 14 34)"/><ellipse cx="50" cy="34" rx="6.5" ry="13" fill="#8a5a3b" transform="rotate(-18 50 34)"/><ellipse cx="32" cy="45" rx="9" ry="7" fill="#f3dcc0"/>' + EYES + BLUSH + '<ellipse cx="32" cy="41.5" rx="3.3" ry="2.3" fill="#2b1d22"/>' + MOUTH(45.5)},
  {k:"lapin", n:"Lapin", bg:"#ffe0ec", s:'<ellipse cx="24" cy="15" rx="5.5" ry="14" fill="#f6f0f4"/><ellipse cx="40" cy="15" rx="5.5" ry="14" fill="#f6f0f4"/><ellipse cx="24" cy="16" rx="2.6" ry="10" fill="#ffb3c6"/><ellipse cx="40" cy="16" rx="2.6" ry="10" fill="#ffb3c6"/><circle cx="32" cy="39" r="18.5" fill="#f6f0f4"/>' + EYES + BLUSH + '<ellipse cx="32" cy="41" rx="2.2" ry="1.6" fill="#ff8fab"/>' + MOUTH(43.5)},
  {k:"ours", n:"Ourson", bg:"#e5f4dc", s:'<circle cx="15" cy="22" r="8" fill="#a8714a"/><circle cx="49" cy="22" r="8" fill="#a8714a"/><circle cx="15" cy="22" r="4" fill="#e2b48f"/><circle cx="49" cy="22" r="4" fill="#e2b48f"/><circle cx="32" cy="38" r="19" fill="#a8714a"/><ellipse cx="32" cy="45" rx="9" ry="6.5" fill="#e2b48f"/>' + EYES + BLUSH + '<ellipse cx="32" cy="42" rx="3" ry="2.1" fill="#2b1d22"/>' + MOUTH(45.5)},
  {k:"panda", n:"Panda", bg:"#dff3f1", s:'<circle cx="15" cy="22" r="7.5" fill="#2b1d22"/><circle cx="49" cy="22" r="7.5" fill="#2b1d22"/><circle cx="32" cy="38" r="19" fill="#ffffff"/><ellipse cx="24" cy="36" rx="5.5" ry="6.8" fill="#2b1d22" transform="rotate(25 24 36)"/><ellipse cx="40" cy="36" rx="5.5" ry="6.8" fill="#2b1d22" transform="rotate(-25 40 36)"/><circle cx="25" cy="35.5" r="1.7" fill="#fff"/><circle cx="39" cy="35.5" r="1.7" fill="#fff"/>' + BLUSH + '<ellipse cx="32" cy="42" rx="2.6" ry="1.8" fill="#2b1d22"/>' + MOUTH(45)},
  {k:"renard", n:"Renard", bg:"#fff0d2", s:'<path d="M13 32L15 9l15 12z" fill="#ef7d3c"/><path d="M51 32L49 9 34 21z" fill="#ef7d3c"/><path d="M16.5 25l.5-11 8 6z" fill="#fff4e6"/><path d="M47.5 25l-.5-11-8 6z" fill="#fff4e6"/><circle cx="32" cy="38" r="19" fill="#ef7d3c"/><path d="M13.5 39q18.5 5 37 0-3.5 17-18.5 18-15-1-18.5-18z" fill="#fff4e6"/>' + EYES + BLUSH + '<ellipse cx="32" cy="43" rx="2.8" ry="2" fill="#2b1d22"/>'},
  {k:"grenouille", n:"Grenouille", bg:"#e4f3ff", s:'<circle cx="22" cy="25" r="8.5" fill="#79c37b"/><circle cx="42" cy="25" r="8.5" fill="#79c37b"/><ellipse cx="32" cy="41" rx="21" ry="16" fill="#79c37b"/><circle cx="22" cy="25" r="5" fill="#fff"/><circle cx="42" cy="25" r="5" fill="#fff"/><circle cx="23" cy="26" r="2.6" fill="#2b1d22"/><circle cx="43" cy="26" r="2.6" fill="#2b1d22"/><ellipse cx="17" cy="44" rx="4" ry="2.4" fill="#ff7f9c" opacity=".55"/><ellipse cx="47" cy="44" rx="4" ry="2.4" fill="#ff7f9c" opacity=".55"/><path d="M23 43q9 7 18 0" fill="none" stroke="#2b1d22" stroke-width="2" stroke-linecap="round"/>'},
  {k:"pingouin", n:"Pingouin", bg:"#e5eaff", s:'<circle cx="32" cy="37" r="20" fill="#34425c"/><path d="M32 30c-4-6-14-4-14 6 0 9 6 15 14 15s14-6 14-15c0-10-10-12-14-6z" fill="#fff"/>' + EYES + BLUSH + '<path d="M28.5 41h7l-3.5 4.5z" fill="#f6a43a"/>'},
];
const AVBY = Object.fromEntries(AVATARS.map(a=>[a.k,a]));
function avatarSvg(k){ const a = AVBY[k] || AVATARS[0]; return icon('<svg viewBox="0 0 64 64" aria-hidden="true"><circle cx="32" cy="32" r="32" fill="' + a.bg + '"/>' + a.s + '</svg>'); }

/* ---------- Outils ---------- */
const $app = document.getElementById("app");
function h(tag, attrs, ...kids){
  const el = document.createElement(tag);
  if (attrs) for (const k in attrs){
    const v = attrs[k];
    if (v == null || v === false) continue;
    if (k === "on") for (const ev in v) el.addEventListener(ev, v[ev]);
    else if (k === "style") el.style.cssText = v;
    else if (k === "text") el.textContent = v;
    else el.setAttribute(k, v === true ? "" : v);
  }
  for (const c of kids.flat()) if (c != null && c !== false) el.append(typeof c === "string" ? document.createTextNode(c) : c);
  return el;
}
const store = {
  get(k){ try { return localStorage.getItem(k); } catch(e){ return null; } },
  set(k,v){ try { localStorage.setItem(k,v); } catch(e){} },
  del(k){ try { localStorage.removeItem(k); } catch(e){} },
};
function shuffle(a){ a=a.slice(); for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]];} return a; }
function buildDeck(lvl){ return shuffle(Q.filter(x=>x.l===lvl).map(x=>x.id)).slice(0, DECK_SIZE); }
function lvCount(lvl){ return Q.filter(x=>x.l===lvl).length; }
function deckSize(lvl){ return Math.min(DECK_SIZE, lvCount(lvl)); }
/* Insère le prénom à la place de {X}, avec l'élision française : « de Anna » → « d'Anna », « que Hugo » → « qu'Hugo ». */
function fillName(q, name){
  const vowel = /^[aeiouhàâäéèêëîïôöùûüœæ]/i.test(name || "");
  return q.replace(/(^|[\s(])(de|que|lorsque|puisque|jusque) \{X\}/i, (m, pre, w) => pre + (vowel ? w.slice(0, -1) + "'" + name : w + " " + name))
          .replace("{X}", name);
}
const ALPH = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
/* Code de session : 8 caractères sans I, O, 0 ni 1 (trop faciles à confondre), avec un tiret au milieu. Ex. K7QM-3XRP */
function randomChars(n){
  const out = []; const rnd = new Uint32Array(n);
  try { crypto.getRandomValues(rnd); } catch(e){ for (let i = 0; i < n; i++) rnd[i] = Math.floor(Math.random() * 4294967296); }
  for (let i = 0; i < n; i++) out.push(ALPH[rnd[i] % ALPH.length]);
  return out.join("");
}
function newCode(){ const c = randomChars(8); return c.slice(0, 4) + "-" + c.slice(4); }
/* Remet en forme ce qu'on a tapé ou collé : majuscules, sans espaces, tiret ajouté. */
function cleanCode(v){
  const c = String(v || "").toUpperCase().replace(/[^A-Z0-9]/g, "").slice(0, 8);
  return c.length > 4 ? c.slice(0, 4) + "-" + c.slice(4) : c;
}
const CODE_RE = /^[A-HJ-NP-Z2-9]{4}-[A-HJ-NP-Z2-9]{4}$/;
function clone(o){ return JSON.parse(JSON.stringify(o)); }
function merge(t,s){ for(const k in s){ const v=s[k]; if (v && typeof v==="object" && !Array.isArray(v) && t[k] && typeof t[k]==="object" && !Array.isArray(t[k])) merge(t[k],v); else t[k]=v; } return t; }

/* ---------- Stockage : partagé (db) ou local ---------- */
function localDoc(){
  let data = null; const subs = new Set();
  const emit = () => subs.forEach(f => f({exists: !!data, data: () => data ? clone(data) : undefined}));
  return {
    async get(){ return {exists: !!data, data: () => data ? clone(data) : undefined}; },
    async set(v){ data = clone(v); emit(); },
    async update(v){ data = merge(data || {}, clone(v)); emit(); },
    async delete(){ data = null; },
    onSnapshot(fn){ subs.add(fn); setTimeout(emit, 0); return () => subs.delete(fn); },
  };
}
let db = null, dbChecked = false;

/* ---------- État ---------- */
let S = null, ref = null, unsub = null, role = null, local = false;
/* Historique des réponses, gardé seulement dans ce navigateur (jamais envoyé au serveur). Clé : "round:idx". */
const HIST = {};
function keepHist(s){
  if (s && s.phase === "play" && ansOf(s,"host") !== null && ansOf(s,"guest") !== null)
    HIST[s.round + ":" + s.idx] = { h: ansOf(s,"host"), g: ansOf(s,"guest") };
}
let screen = store.get("dm-adult") === "1" ? "home" : "gate", err = "", lastCardKey = null, handoffOk = "";
let draft = { name: store.get("dm-name") || "", partner: "", av: store.get("dm-av") || "chat", av2: "lapin", maxL: 5, dares: true, code: "" };

const PCOL = { host: "var(--p1)", guest: "var(--p2)" };
function other(r){ return r === "host" ? "guest" : "host"; }
function pname(s, r){ return (s.players && s.players[r] && s.players[r].name) || (r === "host" ? "Joueur 1" : "Joueur 2"); }
function target(s){ return s.idx % 2 === 0 ? "guest" : "host"; }  // personne visée par une question « guess »
function cardOf(s){ return QBY[s.deck[s.idx]]; }
function qText(card, s){ return fillName(card.q, pname(s, target(s))); }
function ansOf(s, r){ const a = s.answers && s.answers[r]; return (a === undefined) ? null : a; }
function isMatch(s){ return ansOf(s,"host") !== null && ansOf(s,"host") === ansOf(s,"guest"); }
function syncCount(s){ return Object.values(s.results || {}).filter(Boolean).length; }
function playedCount(s){ return Object.keys(s.results || {}).length; }
function label(s, card, val){ return card.t === "who" ? pname(s, val) : card.o[val]; }

function attach(r, isLocal, docRef, code){
  if (unsub) unsub();
  role = r; local = isLocal; ref = docRef; S = null;
  if (!isLocal){ store.set("dm-role-" + code, r); store.set("dm-last", code); }
  unsub = ref.onSnapshot(snap => {
    if (!snap.exists){
      err = S && !local ? "Ta moitié a quitté la partie : la session a été effacée." : "Cette session n'existe plus.";
      S = null; screen = "home"; if (code) store.del("dm-last"); render(); return;
    }
    S = snap.data(); keepHist(S); render();
  }, () => { err = "Connexion perdue avec la session. Rouvre la page pour la reprendre."; render(); });
}
function leave(){
  if (unsub) unsub(); unsub = null;
  // Partie à distance : on efface la session du serveur pour les deux joueurs.
  if (ref && !local && ref.delete) ref.delete().catch(() => {});
  if (S && S.code) store.del("dm-role-" + S.code);
  store.del("dm-last");
  S = null; ref = null; role = null; local = false; screen = "home"; err = ""; exportMsg = ""; render();
}
async function act(fn){
  try { err = ""; await fn(); }
  catch(e){ err = (e && (e.code === "quota_exceeded" || e.code === "resource-exhausted")) ? "Trop de sessions enregistrées : la création est bloquée pour l'instant." : "L'action n'a pas abouti. Réessaie dans un instant."; render(); }
}

/* ---------- Actions ---------- */
function freshGame(maxL){ return { deck: buildDeck(maxL), idx: 0, phase: "play", answers: {host:null, guest:null}, results: {}, round: Date.now() }; }
async function createSession(){
  const name = draft.name.trim(); if (!name){ err = "Indique ton prénom."; render(); return; }
  store.set("dm-name", name); store.set("dm-av", draft.av);
  await act(async () => {
    let code, r, tries = 0;
    do { code = newCode(); r = db.doc("sessions/" + code); tries++; } while ((await r.get()).exists && tries < 6);
    await r.set({ code, createdAt: Date.now(), maxL: draft.maxL, dares: draft.dares, players: { host: { name, av: draft.av } },
      phase: "lobby", deck: [], idx: 0, answers: {host:null, guest:null}, results: {} });
    attach("host", false, r, code);
  });
}
async function createLocal(){
  const a = draft.name.trim(), b = draft.partner.trim();
  if (!a || !b){ err = "Indiquez vos deux prénoms."; render(); return; }
  store.set("dm-name", a);
  const r = localDoc();
  attach("host", true, r, "");
  await r.set(Object.assign({ code: "", maxL: draft.maxL, dares: draft.dares, players: { host:{name:a, av:draft.av}, guest:{name:b, av:draft.av2} } }, freshGame(draft.maxL)));
}
async function joinSession(){
  const code = cleanCode(draft.code); const name = draft.name.trim();
  if (!db){ err = "Les sessions à distance ne sont pas disponibles pour le moment."; render(); return; }
  if (!CODE_RE.test(code)){ err = "Le code fait 8 caractères, par exemple K7QM-3XRP."; render(); return; }
  if (!name){ err = "Indique ton prénom."; render(); return; }
  store.set("dm-name", name);
  await act(async () => {
    const r = db.doc("sessions/" + code); const snap = await r.get();
    if (!snap.exists){ err = "Aucune session avec ce code. Vérifie les lettres avec ta moitié."; render(); return; }
    const s = snap.data(); const g = s.players && s.players.guest;
    if (g && g.name && g.name.toLowerCase() !== name.toLowerCase() && store.get("dm-role-" + code) !== "guest"){
      err = "Cette session a déjà deux joueurs."; render(); return;
    }
    store.set("dm-av", draft.av);
    await r.update({ players: { guest: { name, av: draft.av } } });
    attach("guest", false, r, code);
  });
}
async function resume(code){
  await act(async () => {
    const r = db.doc("sessions/" + code); const snap = await r.get();
    if (!snap.exists){ store.del("dm-last"); render(); return; }
    attach(store.get("dm-role-" + code) || "guest", false, r, code);
  });
}
const startGame = () => act(() => ref.set(Object.assign(
  { code: S.code || "", createdAt: S.createdAt || Date.now(), maxL: S.maxL, dares: !!S.dares, players: S.players }, freshGame(S.maxL))));
function answer(r, val){ const p = {answers:{}}; p.answers[r] = val; return act(() => ref.update(p)); }
function next(){
  const i = S.idx + 1; const res = {}; res[S.idx] = isMatch(S);
  keepHist(S);
  // Les réponses sont remises à zéro à chaque question : le serveur ne garde que « en phase » oui/non.
  const patch = { results: res, answers: {host:null, guest:null} };
  if (i >= S.deck.length) patch.phase = "end";
  else patch.idx = i;
  return act(() => ref.update(patch));
}

/* ---------- Vues ---------- */
function brand(big){ return h("header", {class: "brand" + (big ? " big" : "")}, icon(ICON.logo), h("h1", null, "Pile-", h("span", {text:"poil"}))); }
function btn(cls, iconKey, text, onClick, extra){
  return h("button", Object.assign({type:"button", class:cls, on:{click:onClick}}, extra||{}), iconKey ? icon(ICON[iconKey]) : null, text);
}
function av(s, r){ const k = s.players && s.players[r] && s.players[r].av; return h("span", {class:"av ava", "aria-hidden":"true"}, avatarSvg(k || (r === "host" ? "chat" : "lapin"))); }
function avPicker(key, lbl, hideLabel){
  const id = "avp-" + key;
  return h("div", {class:"field"}, h("label", {id, text: lbl, class: hideLabel ? "sr-only" : null}),
    h("div", {class:"avpick", role:"group", "aria-labelledby": id}, AVATARS.map(a => h("button", {type:"button", class:"avbtn", "aria-pressed": String(draft[key] === a.k), "aria-label": a.n, title: a.n,
      on:{click:()=>{ draft[key] = a.k; render(); }}}, h("span", {class:"ava"}, avatarSvg(a.k))))));
}
function levelPicker(){
  const L = LEVELS[draft.maxL-1];
  return h("div", {class:"field"},
    h("label", {id:"lvl-lbl", text:"Quel niveau ce soir ?"}),
    h("div", {class:"levels", role:"group", "aria-labelledby":"lvl-lbl"},
      LEVELS.map(X => {
        const heat = h("span", {class:"heat", "aria-hidden":"true"});
        for (let i = 0; i < X.n; i++) heat.append(icon(CHILI));
        return h("button", {type:"button", class:"lv " + (X.n === draft.maxL ? "in" : "out"), style:"--lc:var(" + X.tok + ")",
          "aria-pressed": String(draft.maxL === X.n), "aria-label": X.name + ", niveau " + X.n + " : " + X.tag,
          on:{click:()=>{ draft.maxL = X.n; render(); }}},
          h("span", {class:"pic", "aria-hidden":"true"}, icon(LVPIC[X.n])),
          h("span", {class:"nm", text:X.name}), heat);
      })),
    h("div", {class:"lvsum"},
      h("span", null, h("b", {text: L.name}), " · " + L.tag),
      h("span", null, h("b", {text:String(deckSize(draft.maxL))}), " questions au hasard parmi " + lvCount(draft.maxL))));
}
function dareSwitch(){
  return h("label", {class:"toggle", for:"dares"},
    h("span", {class:"ic", "aria-hidden":"true"}, icon(CHILI)),
    h("span", {class:"tx"}, h("b", {text:"Défis coquins"}), h("span", {text:"Un défi quand vos réponses diffèrent"})),
    h("input", {type:"checkbox", role:"switch", id:"dares", checked: draft.dares, on:{change:e=>{ draft.dares = e.target.checked; }}}));
}
function nameField(id, lbl, key, ph){
  return h("div", {class:"field"}, h("label", {for:id, text:lbl}),
    h("input", {type:"text", id, value: draft[key], placeholder: ph, autocomplete:"off", maxlength:"20", on:{input:e=>{ draft[key] = e.target.value; }}}));
}
function errLine(){ return h("p", {class:"err", role:"alert", text: err}); }
function waiting(text){ return h("div", {class:"status"}, h("span", {class:"dots", "aria-hidden":"true"}, h("i"), h("i"), h("i")), text); }

function viewGate(){
  return [
    brand(true),
    h("section", {class:"panel", style:"text-align:center"},
      h("h2", {text:"Réservé aux adultes"}),
      h("p", {class:"muted", text:"Pile-poil est un jeu pour couples. Certains niveaux abordent la sexualité de façon explicite."}),
      h("div", {class:"stack"},
        btn("primary", null, "J'ai 18 ans ou plus", ()=>{ store.set("dm-adult", "1"); screen = inviteCode ? "join" : "home"; render(); }),
        btn("ghost", null, "J'ai moins de 18 ans", ()=>{ screen = "minor"; render(); })))
  ];
}
function viewMinor(){
  return [
    brand(true),
    h("section", {class:"panel", style:"text-align:center"},
      h("h2", {text:"Reviens plus tard"}),
      h("p", {class:"muted", text:"Ce jeu est réservé aux personnes majeures."}),
      btn("ghost", "back", "Retour", ()=>{ screen = "gate"; render(); }))
  ];
}
function viewHome(){
  const last = store.get("dm-last"); const shared = !!db;
  return [
    brand(true),
    h("p", {class:"lead", text:"Le jeu de questions pour couples. Répondez chacun de votre côté, puis découvrez si vous êtes sur la même longueur d'onde."}),
    h("div", {class:"parade", "aria-hidden":"true"}, AVATARS.map(a => h("span", {class:"ava"}, avatarSvg(a.k)))),
    h("section", {class:"panel"},
      shared ? h("div", {class:"stack"},
        btn("primary", "plus", "Créer une session", ()=>{ screen="create"; err=""; render(); }),
        btn("ghost", "key", "J'ai reçu un code", ()=>{ screen="join"; err=""; render(); }),
        last ? btn("link", null, "Reprendre la session " + last, ()=>resume(last)) : null)
      : h("p", {class:"muted", style:"font-size:14px;text-align:center", text: dbChecked ? "Les sessions à distance ne sont pas disponibles ici. Jouez sur un seul téléphone en vous le passant." : "Connexion aux sessions…"}),
      shared ? h("div", {class:"divider", text:"ou"}) : null,
      btn(shared ? "ghost" : "primary", "phone", "Jouer sur un seul téléphone", ()=>{ screen="local"; err=""; render(); })),
    errLine()
  ];
}
function privacyNote(){
  return h("p", {class:"note"}, "Vos prénoms et la réponse en cours passent par notre serveur, puis tout est effacé quand l'un de vous quitte. ",
    h("a", {href:"confidentialite.html", text:"En savoir plus"}));
}
function viewCreate(){
  return [h("section", {class:"panel"},
    h("h2", {text:"Nouvelle session"}),
    nameField("host-name", "Ton prénom", "name", "ex. Julien"),
    avPicker("av", "Ta photo de profil"),
    levelPicker(), dareSwitch(),
    h("div", {class:"row"}, btn("ghost", "back", "Retour", ()=>{ screen="home"; render(); }), btn("primary", null, "Obtenir le code", createSession)), privacyNote()), errLine()];
}
function viewLocal(){
  return [h("section", {class:"panel"},
    h("h2", {text:"Sur un seul téléphone"}),
    h("div", {class:"pair"},
      h("div", {class:"stack"}, nameField("p1-name", "Joueur 1", "name", "Julien"), avPicker("av", "Avatar du joueur 1", true)),
      h("div", {class:"stack"}, nameField("p2-name", "Joueur 2", "partner", "Léa"), avPicker("av2", "Avatar du joueur 2", true))),
    levelPicker(), dareSwitch(),
    h("div", {class:"row"}, btn("ghost", "back", "Retour", ()=>{ screen="home"; render(); }), btn("primary", null, "Commencer", createLocal))), errLine()];
}
function viewJoin(){
  return [h("section", {class:"panel"},
    h("h2", {text:"Rejoindre ta moitié"}),
    h("div", {class:"field"}, h("label", {for:"join-code", text:"Le code reçu"}),
      h("input", {type:"text", id:"join-code", class:"code", value: draft.code, maxlength:"12", autocomplete:"off", autocapitalize:"characters", spellcheck:"false", placeholder:"XXXX-XXXX",
        on:{input:e=>{ const v = cleanCode(e.target.value); draft.code = v; if (e.target.value !== v) e.target.value = v; }}})),
    nameField("guest-name", "Ton prénom", "name", "ex. Léa"),
    avPicker("av", "Ta photo de profil"),
    h("div", {class:"row"}, btn("ghost", "back", "Retour", ()=>{ screen="home"; render(); }), btn("primary", null, "Rejoindre", joinSession)), privacyNote()), errLine()];
}
function viewLobby(){
  const guest = S.players && S.players.guest; const isHost = role === "host";
  return [h("section", {class:"panel"},
    h("h2", {text: isHost ? (guest ? guest.name + " est là" : "Envoie ce code à ta moitié") : "Session de " + pname(S,"host")}),
    h("div", {class:"codebox"}, h("span", {class:"eyebrow", text:"Code de la session"}),
      h("div", {class:"codebig", "aria-label":"Code " + S.code.replace("-", "").split("").join(" "), text:S.code}),
      h("span", {class:"muted", style:"font-size:14px", text: S.deck && S.deck.length ? S.deck.length + " questions · " + LEVELS[S.maxL-1].name : deckSize(S.maxL) + " questions · niveau " + LEVELS[S.maxL-1].name + (S.dares ? " · avec défis" : "")})),
    guest ? (isHost ? btn("primary", "next", "Commencer avec " + guest.name, startGame) : waiting(pname(S,"host") + " va lancer la partie"))
          : waiting("En attente de ta moitié"),
    S.code ? h("div", {class:"row share"}, btn("ghost mini wide", "copy", "Copier", copyCode, {"aria-label": "Copier le code"}), btn("ghost mini wide", "share", "Partager", shareInvite)) : null,
    h("p", {class:"toast", role:"status", text: exportMsg})), errLine()];
}

function answerUI(card, r){
  // r = joueur qui répond sur cet écran
  if (card.t === "who"){
    return h("div", {class:"opts two"}, ["host","guest"].map(p => h("button", {type:"button", class:"opt", on:{click:()=>answer(r, p)}},
      av(S, p), p === r ? (local ? pname(S,p) : "Moi") : pname(S, p))));
  }
  return h("div", {class:"opts"}, card.o.map((o,i) => h("button", {type:"button", class:"opt", on:{click:()=>answer(r, i)}}, o)));
}
function promptFor(card, r){
  if (card.t === "who") return local ? pname(S, r) + ", qui choisis-tu ?" : "Qui choisis-tu ?";
  const tg = target(S);
  if (r === tg) return local ? pname(S, r) + ", c'est sur toi : réponds sincèrement." : "C'est sur toi : réponds sincèrement.";
  return local ? pname(S, r) + ", que va répondre " + pname(S, tg) + " ?" : "Que va répondre " + pname(S, tg) + " ?";
}
function viewPlay(){
  const card = cardOf(S), L = LEVELS[card.l-1];
  const key = S.round + ":" + S.idx;
  const enter = key !== lastCardKey; lastCardKey = key;
  const aH = ansOf(S,"host"), aG = ansOf(S,"guest");
  const both = aH !== null && aG !== null;
  const kids = [
    h("span", {class:"chip", text: card.t === "who" ? "Qui de nous deux" : fillName("Devine la réponse de {X}", pname(S, target(S)))}),
    h("p", {class:"q", text: qText(card, S)}),
  ];
  if (!both){
    let r = null;
    if (local) r = aH === null ? "host" : "guest";
    else if (ansOf(S, role) === null) r = role;
    if (r){
      const hk = key + ":" + r;
      if (local && handoffOk !== hk){
        kids.push(h("div", {class:"handoff"}, av(S, r),
          h("p", {text: "Au tour de " + pname(S, r) + ". " + pname(S, other(r)) + ", ne regarde pas l'écran."}),
          btn("primary", null, "C'est moi, " + pname(S, r), ()=>{ handoffOk = hk; render(); })));
      } else {
        kids.push(h("p", {class:"hint", text: promptFor(card, r)}), answerUI(card, r));
      }
    } else {
      kids.push(waiting("Réponse envoyée. " + pname(S, other(role)) + " réfléchit…"));
      kids.push(btn("link", null, "Changer ma réponse", ()=>answer(role, null)));
    }
  } else {
    const m = isMatch(S);
    const rv = (r) => {
      const tag = card.t === "guess" ? (r === target(S) ? " · réponse" : " · pari") : "";
      return h("div", {class:"rv"}, h("span", {class:"who"}, av(S, r), pname(S, r) + tag), h("strong", {text: label(S, card, ansOf(S, r))}));
    };
    kids.push(h("div", {class:"reveal"}, rv("host"), rv("guest")));
    kids.push(h("div", {class:"result " + (m ? "ok" : "ko")},
      h("b", {text: m ? "En phase" : "Pas d'accord"}),
      h("span", {text: m ? "Un point de complicité." : (card.t === "guess" ? "Parlez-en : qu'est-ce qui a trompé " + pname(S, other(target(S))) + " ?" : "À vous de défendre votre choix.")})));
    if (!m && S.dares){ const list = DARES[card.l]; kids.push(h("div", {class:"dare"}, h("small", {text:"Défi"}), h("p", {text: list[S.idx % list.length]}))); }
    kids.push(btn("primary", "next", S.idx + 1 >= S.deck.length ? "Voir le bilan" : "Question suivante", next));
  }
  const played = playedCount(S);
  const statusOf = (r) => both ? "" : (ansOf(S, r) !== null ? "a répondu" : "réfléchit");
  return [
    h("div", {class:"top"},
      h("div", {class:"players"}, ["host","guest"].map(r => h("span", {class:"pl"}, av(S, r),
        h("span", {class:"pn"}, h("span", {class:"nm", text: pname(S, r) + ((!local && r === role) ? " (toi)" : "")}),
          statusOf(r) ? h("span", {class:"st" + (ansOf(S, r) !== null ? " done" : ""), text: statusOf(r)}) : null)))),
      h("div", {class:"sync", "aria-label": syncCount(S) + " réponses en phase sur " + played},
        h("b", {text: syncCount(S) + " / " + played}), h("span", {text:"en phase"}))),
    h("div", {class:"levelbar"},
      h("span", {class:"nm", text: L.name}),
      h("span", {class:"segs", "aria-hidden":"true"}, LEVELS.map(x => h("i", {style: x.n <= card.l ? "background:var(" + x.tok + ")" : null}))),
      h("span", {class:"ct", text: (S.idx+1) + " / " + S.deck.length})),
    h("article", {class:"card" + (enter ? " enter" : "")}, kids),
    errLine(),
  ];
}
function endStats(){
  const n = syncCount(S), tot = S.deck.length, pct = Math.round(n / tot * 100);
  const msg = pct >= 80 ? "Vous vous connaissez par cœur." : pct >= 60 ? "Très belle complicité, avec encore quelques surprises." : pct >= 40 ? "Il vous reste plein de choses à découvrir l'un sur l'autre." : "Beaucoup de surprises ce soir. De quoi alimenter la conversation.";
  const levels = LEVELS.filter(L => L.n === S.maxL).map(L => {
    let ok = 0, all = 0;
    S.deck.forEach((id, i) => { if (QBY[id].l === L.n){ all++; if (S.results && S.results[i]) ok++; } });
    return { L, ok, all };
  });
  const rows = S.deck.map((id, i) => {
    const c = QBY[id]; const tg = i % 2 === 0 ? "guest" : "host";
    const hv = HIST[S.round + ":" + i];
    const lab = (v) => (v === null || v === undefined) ? "—" : (c.t === "who" ? pname(S, v) : c.o[v]);
    return { c, q: fillName(c.q, pname(S, tg)), h: hv ? lab(hv.h) : "—", g: hv ? lab(hv.g) : "—", ok: !!(S.results && S.results[i]) };
  });
  return { n, tot, pct, msg, levels, rows };
}
let exportMsg = "";
function recapText(){
  const st = endStats(); const d = new Date().toLocaleDateString("fr-FR", {day:"numeric", month:"long", year:"numeric"});
  const A = pname(S,"host"), B = pname(S,"guest");
  let t = "PILE-POIL · " + A + " & " + B + " · " + d + "\n\n";
  t += "Complicité : " + st.pct + " % (" + st.n + " / " + st.tot + " réponses en phase)\n" + st.msg + "\n\n";
  st.levels.forEach(x => { t += "· " + x.L.name + " : " + x.ok + " / " + x.all + "\n"; });
  t += "\n";
  st.rows.forEach((r, i) => { t += (i+1) + ". " + r.q + "\n   " + A + " : " + r.h + " · " + B + " : " + r.g + "  →  " + (r.ok ? "en phase" : "pas d'accord") + "\n"; });
  return t;
}
function svgImg(str){
  return new Promise(res => { const im = new Image(); im.onload = () => res(im); im.onerror = () => res(null);
    im.src = "data:image/svg+xml;charset=utf-8," + encodeURIComponent(str.replace(/var\(--accent\)/g, "#e2405f")); });
}
function avatarStr(k){ const a = AVBY[k] || AVATARS[0]; return '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width="256" height="256"><circle cx="32" cy="32" r="32" fill="' + a.bg + '"/>' + a.s + '</svg>'; }
async function recapImage(){
  try { await document.fonts.ready; } catch(e){}
  const st = endStats(); const A = pname(S,"host"), B = pname(S,"guest");
  const avA = await svgImg(avatarStr(S.players.host.av)), avB = await svgImg(avatarStr(S.players.guest.av));
  const logo = await svgImg(ICON.logo.replace('<svg class="logo"', '<svg xmlns="http://www.w3.org/2000/svg" width="256" height="256"'));
  const lvCol = ["#e9b9c8","#df8fa9","#d0607f","#bb3a60","#9a1238"];
  const W = 1080, P = 72, DISP = '"Fredoka", "Nunito", sans-serif', BODY = '"Nunito", system-ui, sans-serif';
  function wrap(ctx, text, maxW){ const words = text.split(" "); const lines = []; let cur = "";
    for (const w of words){ const t = cur ? cur + " " + w : w; if (ctx.measureText(t).width > maxW && cur){ lines.push(cur); cur = w; } else cur = t; }
    if (cur) lines.push(cur); return lines; }
  function rr(ctx, x, y, w, h, r){ ctx.beginPath(); ctx.moveTo(x+r,y); ctx.arcTo(x+w,y,x+w,y+h,r); ctx.arcTo(x+w,y+h,x,y+h,r); ctx.arcTo(x,y+h,x,y,r); ctx.arcTo(x,y,x+w,y,r); ctx.closePath(); }
  function draw(ctx){
    let y = P;
    ctx.fillStyle = "#fdf1f5"; ctx.fillRect(0, 0, W, ctx.canvas.height);
    if (logo) ctx.drawImage(logo, W/2 - 60, y, 120, 120);
    y += 140;
    ctx.textAlign = "center"; ctx.fillStyle = "#2b1020"; ctx.font = "600 76px " + DISP; ctx.fillText("Pile-poil", W/2, y + 60); y += 96;
    ctx.font = "600 28px " + BODY; ctx.fillStyle = "#85536b";
    ctx.fillText(new Date().toLocaleDateString("fr-FR", {weekday:"long", day:"numeric", month:"long", year:"numeric"}), W/2, y + 20); y += 70;
    // joueurs
    const cx1 = W/2 - 170, cx2 = W/2 + 170;
    if (avA) ctx.drawImage(avA, cx1 - 85, y, 170, 170);
    if (avB) ctx.drawImage(avB, cx2 - 85, y, 170, 170);
    ctx.fillStyle = "#e2405f"; ctx.font = "600 64px " + DISP; ctx.fillText("&", W/2, y + 110);
    y += 214; ctx.fillStyle = "#2b1020"; ctx.font = "800 38px " + BODY; ctx.fillText(A, cx1, y); ctx.fillText(B, cx2, y); y += 50;
    // score
    rr(ctx, P, y, W - 2*P, 300, 36); ctx.fillStyle = "#ffffff"; ctx.fill();
    ctx.fillStyle = "#85536b"; ctx.font = "800 26px " + BODY; ctx.fillText("VOTRE COMPLICITÉ", W/2, y + 62);
    ctx.fillStyle = "#c42c5e"; ctx.font = "700 130px " + DISP; ctx.fillText(st.pct + " %", W/2, y + 190);
    ctx.fillStyle = "#2b1020"; ctx.font = "600 30px " + BODY; ctx.fillText(st.n + " réponses en phase sur " + st.tot, W/2, y + 252);
    y += 330;
    ctx.font = "600 32px " + BODY; ctx.fillStyle = "#5c3a4c";
    wrap(ctx, st.msg, W - 2*P).forEach(l => { ctx.fillText(l, W/2, y + 30); y += 44; }); y += 26;
    // niveaux
    st.levels.forEach((x, k) => {
      ctx.textAlign = "left"; ctx.fillStyle = "#2b1020"; ctx.font = "800 30px " + BODY; ctx.fillText(x.L.name, P, y + 32);
      const bx = P + 250, bw = W - 2*P - 250 - 110;
      rr(ctx, bx, y + 12, bw, 24, 12); ctx.fillStyle = "#f1dbe3"; ctx.fill();
      if (x.ok){ rr(ctx, bx, y + 12, Math.max(24, bw * x.ok / x.all), 24, 12); ctx.fillStyle = lvCol[k]; ctx.fill(); }
      ctx.textAlign = "right"; ctx.fillStyle = "#2b1020"; ctx.font = "700 30px " + BODY; ctx.fillText(x.ok + " / " + x.all, W - P, y + 32);
      y += 58;
    });
    y += 30;
    // questions
    ctx.textAlign = "left"; ctx.fillStyle = "#85536b"; ctx.font = "800 26px " + BODY; ctx.fillText("LES QUESTIONS", P, y + 26); y += 56;
    st.rows.forEach(r => {
      ctx.font = "700 30px " + BODY; const ql = wrap(ctx, r.q, W - 2*P - 100);
      ctx.font = "600 26px " + BODY; const al = wrap(ctx, A + " : " + r.h + "   ·   " + B + " : " + r.g, W - 2*P - 100);
      const hgt = 40 + ql.length * 40 + al.length * 34 + 12;
      rr(ctx, P, y, W - 2*P, hgt, 24); ctx.fillStyle = "#ffffff"; ctx.fill();
      ctx.fillStyle = lvCol[r.c.l - 1]; rr(ctx, P, y, 10, hgt, 5); ctx.fill();
      let yy = y + 50;
      ctx.fillStyle = "#2b1020"; ctx.font = "700 30px " + BODY; ql.forEach(l => { ctx.fillText(l, P + 34, yy); yy += 40; });
      ctx.fillStyle = "#85536b"; ctx.font = "600 26px " + BODY; al.forEach(l => { ctx.fillText(l, P + 34, yy); yy += 34; });
      // marque
      const mx = W - P - 44, my = y + hgt/2;
      ctx.beginPath(); ctx.arc(mx, my, 24, 0, Math.PI*2); ctx.fillStyle = r.ok ? "#dff3e7" : "#fde7dc"; ctx.fill();
      ctx.strokeStyle = r.ok ? "#1d7a4c" : "#b23e1b"; ctx.lineWidth = 5; ctx.lineCap = "round"; ctx.beginPath();
      if (r.ok){ ctx.moveTo(mx-10, my+1); ctx.lineTo(mx-3, my+8); ctx.lineTo(mx+11, my-8); }
      else { ctx.moveTo(mx-8, my-8); ctx.lineTo(mx+8, my+8); ctx.moveTo(mx+8, my-8); ctx.lineTo(mx-8, my+8); }
      ctx.stroke();
      y += hgt + 16;
    });
    y += 30; ctx.textAlign = "center"; ctx.fillStyle = "#85536b"; ctx.font = "600 24px " + BODY;
    ctx.fillText("Ce qui se dit ici reste entre vous deux.", W/2, y); y += P;
    return y;
  }
  const probe = document.createElement("canvas"); probe.width = W; probe.height = 8000;
  const H = Math.ceil(draw(probe.getContext("2d")));
  const cv = document.createElement("canvas"); cv.width = W; cv.height = H; draw(cv.getContext("2d"));
  return await new Promise(res => cv.toBlob(res, "image/png"));
}
async function exportImage(){
  exportMsg = ""; err = "";
  try {
    const blob = await recapImage();
    if (!blob) throw new Error("canvas");
    const name = ("pile-poil-" + pname(S,"host") + "-" + pname(S,"guest") + ".png").replace(/[^\w\-.À-ÿ]+/g, "-");
    const url = URL.createObjectURL(blob);
    const a = h("a", {href: url, download: name, style: "display:none"});
    document.body.append(a); a.click(); a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 60000);
    exportMsg = "Image enregistrée."; render();
  } catch(e){
    err = "L'image n'a pas pu être enregistrée. Réessaie, ou copie le récap en texte."; render();
  }
}
async function copyRecap(){
  const t = recapText(); err = "";
  try { await navigator.clipboard.writeText(t); exportMsg = "Récap copié, prêt à coller."; }
  catch(e){ exportMsg = ""; err = "La copie est bloquée ici. Utilise plutôt l'export en image."; }
  render();
}
function viewEnd(){
  const st = endStats();
  return [h("section", {class:"panel"},
    h("div", {class:"final"},
      h("div", {class:"duo"}, h("span", {class:"p"}, h("span", {class:"ava"}, avatarSvg(S.players.host.av)), pname(S,"host")),
        h("span", {class:"amp", text:"&"}), h("span", {class:"p"}, h("span", {class:"ava"}, avatarSvg(S.players.guest.av)), pname(S,"guest"))),
      h("span", {class:"eyebrow", text:"Votre complicité"}), h("b", {text: st.pct + " %"}),
      h("p", {text: st.n + " réponses en phase sur " + st.tot + ". " + st.msg}),
      h("div", {class:"bylv"}, st.levels.map(x => h("div", null, h("span", {text:x.L.name}), h("span", {text: x.ok + " / " + x.all}))))),
    h("div", {class:"exp"},
      h("p", {text:"Gardez un souvenir de la partie : vos avatars, le score et toutes vos réponses."}),
      h("div", {class:"row"},
        btn("primary", "download", "Exporter le récap", exportImage),
        btn("ghost wide", "copy", "Copier le texte", copyRecap)),
      h("p", {class:"toast", role:"status", text: exportMsg})),
    h("div", {class:"row"}, btn("ghost", "exit", "Quitter", askLeave), btn("primary", "replay", "Rejouer", askReplay))), errLine()];
}
function highlightNames(root){
  if (!S || !S.players) return;
  const names = [["host", pname(S,"host")], ["guest", pname(S,"guest")]].filter(x => x[1] && x[1].trim());
  if (names.length === 2 && names[0][1].toLowerCase() === names[1][1].toLowerCase()) names.pop();
  names.sort((a,b) => b[1].length - a[1].length);
  let isWord; try { const w = new RegExp("[\\p{L}\\p{N}]", "u"); isWord = (c) => !!c && w.test(c); } catch(e){ isWord = (c) => !!c && /[A-Za-z0-9À-ÿ]/.test(c); }
  function find(txt){
    const low = txt.toLowerCase(); const out = [];
    let i = 0;
    while (i < txt.length){
      let hit = null;
      for (const [r, n] of names){
        const nl = n.toLowerCase();
        if (low.startsWith(nl, i) && !isWord(txt[i-1]) && !isWord(txt[i + nl.length])){ hit = {i, len:nl.length, r}; break; }
      }
      if (hit){ out.push(hit); i += hit.len; } else i++;
    }
    return out;
  }
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
  const todo = []; let t;
  while ((t = walker.nextNode())){
    const p = t.parentElement;
    if (!p || p.closest(".primary, .nmh, .dare, .pl, .duo, .avbtn, .brand, footer, .ava, .chip, .toolbar")) continue;
    const hits = find(t.nodeValue); if (hits.length) todo.push([t, hits]);
  }
  todo.forEach(([node, hits]) => {
    const txt = node.nodeValue; const frag = document.createDocumentFragment(); let last = 0;
    hits.forEach(m => {
      if (m.i > last) frag.append(txt.slice(last, m.i));
      frag.append(h("span", {class:"nmh " + (m.r === "host" ? "nm1" : "nm2"), text: txt.substr(m.i, m.len)}));
      last = m.i + m.len;
    });
    if (last < txt.length) frag.append(txt.slice(last));
    node.replaceWith(frag);
  });
}

/* ---------- Thème clair / sombre ---------- */
let themePref = store.get("dm-theme");
function effectiveTheme(){
  const t = themePref; if (t === "light" || t === "dark") return t;
  try { return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"; } catch(e){ return "light"; }
}
function applyTheme(){ const t = themePref; if (t === "light" || t === "dark") document.documentElement.setAttribute("data-theme", t); }
function toggleTheme(){ const n = effectiveTheme() === "dark" ? "light" : "dark"; themePref = n; store.set("dm-theme", n); document.documentElement.setAttribute("data-theme", n); renderToolbar(); }

/* ---------- Fenêtre de confirmation ---------- */
const $modal = document.getElementById("modal");
let modal = null, modalReturn = null;
function ask(opts){ modalReturn = document.activeElement; modal = opts; renderModal(); }
function closeModal(){ modal = null; renderModal(); try { modalReturn && modalReturn.focus(); } catch(e){} }
function renderModal(){
  $modal.replaceChildren();
  if (!modal) return;
  const m = modal;
  const confirmBtn = btn(m.danger ? "danger" : "primary", null, m.confirm, ()=>{ closeModal(); m.onConfirm(); });
  const sheet = h("div", {class:"sheet", role:"alertdialog", "aria-modal":"true", "aria-labelledby":"mdl-t", "aria-describedby":"mdl-d"},
    h("span", {class:"sic", "aria-hidden":"true"}, icon(ICON[m.icon || "exit"])),
    h("h3", {id:"mdl-t", text:m.title}), h("p", {id:"mdl-d", text:m.text}),
    h("div", {class:"row"}, m.cancel === false ? null : btn("ghost wide", null, m.cancel || "Annuler", closeModal), confirmBtn));
  const scrim = h("div", {class:"scrim", on:{
    click:(e)=>{ if (e.target === scrim) closeModal(); },
    keydown:(e)=>{ if (e.key === "Escape"){ e.preventDefault(); closeModal(); }
      if (e.key === "Tab"){ const f = sheet.querySelectorAll("button"); const a = f[0], z = f[f.length-1];
        if (e.shiftKey && document.activeElement === a){ e.preventDefault(); z.focus(); } else if (!e.shiftKey && document.activeElement === z){ e.preventDefault(); a.focus(); } } }}}, sheet);
  $modal.append(scrim);
  confirmBtn.focus();
}
function askLeave(){
  if (!S) return leave();
  const inGame = S.phase === "play";
  ask({ icon:"exit", danger:true, confirm:"Quitter",
    title: S.phase === "end" ? "Quitter le bilan ?" : inGame ? "Quitter la partie ?" : "Quitter la session ?",
    text: S.phase === "end" ? "Pensez à exporter le récap avant de partir : " + (local ? "il ne sera plus affiché ensuite." : "la session sera effacée pour vous deux.")
      : local ? "La partie en cours sera perdue."
      : "La session sera effacée pour vous deux." });
  modal.onConfirm = leave;
}
function askReplay(){
  ask({ icon:"replay", confirm:"Rejouer", title:"Nouvelle partie ?",
    text:"Les questions du niveau " + LEVELS[S.maxL-1].name + " sont remélangées et le score repart à zéro" + (local ? "." : " pour vous deux."),
    onConfirm: ()=>{ exportMsg = ""; startGame(); } });
}
/* Lien d'invitation : ouvre le jeu sur « Rejoindre » avec le code déjà rempli. */
function inviteUrl(code){ return location.origin + location.pathname + "?code=" + encodeURIComponent(code); }
async function shareInvite(){
  const url = inviteUrl(S.code);
  const text = pname(S, "host") + " t'invite à jouer à Pile-poil. Code : " + S.code;
  if (navigator.share){
    try { await navigator.share({ title: "Pile-poil", text, url }); exportMsg = ""; render(); return; }
    catch(e){ if (e && e.name === "AbortError") return; }
  }
  try { await navigator.clipboard.writeText(text + "\n" + url); exportMsg = "Lien d'invitation copié, colle-le dans un message."; }
  catch(e){ exportMsg = "Lien d'invitation : " + url; }
  render();
}
async function copyCode(){
  try { await navigator.clipboard.writeText(S.code); exportMsg = "Code copié."; }
  catch(e){ exportMsg = "Le code est " + S.code + "."; }
  render();
}

/* ---------- Installation (PWA) ---------- */
/* Android / Chrome : le navigateur propose l'installation, on garde l'invitation pour notre bouton.
   iPhone / iPad : pas d'invitation possible, on explique la marche à suivre dans Safari. */
let installPrompt = null;
const isStandalone = () => { try { return matchMedia("(display-mode: standalone)").matches || navigator.standalone === true; } catch(e){ return false; } };
const isIOS = () => /iphone|ipad|ipod/i.test(navigator.userAgent) || (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);
window.addEventListener("beforeinstallprompt", (e) => { e.preventDefault(); installPrompt = e; renderToolbar(); });
window.addEventListener("appinstalled", () => { installPrompt = null; renderToolbar(); });
async function install(){
  if (installPrompt){
    const p = installPrompt; installPrompt = null;
    try { await p.prompt(); await p.userChoice; } catch(e){}
    renderToolbar(); return;
  }
  ask({ icon:"download", cancel:false, confirm:"Compris", title:"Installer Pile-poil",
    text:"Dans Safari, touche le bouton Partager (le carré avec une flèche), puis « Sur l'écran d'accueil ». Pile-poil s'ouvrira ensuite comme une app.",
    onConfirm: ()=>{} });
}
function installButton(){
  if (isStandalone() || (!installPrompt && !isIOS())) return h("span");
  return btn("tb", "download", "Installer l'app", install);
}

/* ---------- Barre d'outils ---------- */
const $toolbar = document.getElementById("toolbar");
function currentScreen(){ return S ? S.phase : screen; }
function renderToolbar(){
  const dark = effectiveTheme() === "dark";
  const bigBrand = ["home", "gate", "minor"].includes(currentScreen());
  const left = S ? btn("tb", "exit", "Quitter", askLeave) : bigBrand ? installButton() : brand(false);
  $toolbar.replaceChildren(left, S ? brand(false) : h("span", {class:"spacer"}),
    btn("tb icon", dark ? "sun" : "moon", "", toggleTheme, {"aria-label": dark ? "Passer en mode clair" : "Passer en mode sombre", title: dark ? "Mode clair" : "Mode sombre"}));
}
function render(){
  const focusId = document.activeElement && document.activeElement.id;
  let v;
  if (S) v = S.phase === "lobby" ? viewLobby() : S.phase === "end" ? viewEnd() : viewPlay();
  else v = screen === "gate" ? viewGate() : screen === "minor" ? viewMinor() : screen === "create" ? viewCreate() : screen === "join" ? viewJoin() : screen === "local" ? viewLocal() : viewHome();
  document.body.dataset.screen = currentScreen();
  $app.replaceChildren(h("div", {class:"view"}, v));
  try { highlightNames($app); } catch(e){}
  renderToolbar();
  if (focusId){ const el = document.getElementById(focusId); if (el && el.tagName === "INPUT"){ el.focus(); try{ el.setSelectionRange(el.value.length, el.value.length); }catch(e){} } }
}

/* Lien d'invitation (?code=K7QM-3XRP) : on ouvre directement « Rejoindre » avec le code. */
let inviteCode = "";
try {
  const q = new URLSearchParams(location.search).get("code");
  if (q && CODE_RE.test(cleanCode(q))){
    inviteCode = cleanCode(q); draft.code = inviteCode;
    if (screen === "home") screen = "join";
  }
  if (q) history.replaceState(null, "", location.pathname);
} catch(e){}

applyTheme();
render();
/* Mode hors ligne et installation : voir sw.js */
if ("serviceWorker" in navigator && location.protocol !== "file:"){
  window.addEventListener("load", () => { navigator.serviceWorker.register("sw.js").catch(() => {}); });
}
(async () => {
  try { db = window.PilePoilStorage ? await window.PilePoilStorage.connect() : null; } catch(e){ console.error("Pile-poil : connexion Firebase impossible", e); db = null; }
  dbChecked = true;
  if (!db && screen === "join"){ screen = "home"; if (inviteCode) err = "Les sessions à distance ne sont pas disponibles pour le moment."; }
  if (!S) render();
})();
})();

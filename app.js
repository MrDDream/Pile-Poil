(function(){
"use strict";

/* ---------- Contenu ----------
   who   : « Qui de nous deux… » – chacun désigne l'un des deux, on compare.
   guess : question sur {X} (la personne visée) – {X} répond pour elle-même, l'autre devine. */
const LEVELS = [
  {n:1, name:"Complicité", tok:"--h1", tag:"Manies et petites habitudes",
   dare:{t:"Défis complices", s:"Un gage tout doux quand vos réponses diffèrent"}},
  {n:2, name:"Souvenirs",  tok:"--h2", tag:"Votre histoire, vos premières fois",
   dare:{t:"Défis souvenirs", s:"Un moment à revivre quand vos réponses diffèrent"}},
  {n:3, name:"Séduction",  tok:"--h3", tag:"Ce qui vous fait craquer",
   dare:{t:"Défis charmeurs", s:"Un geste tendre quand vos réponses diffèrent"}},
  {n:4, name:"Coquin",     tok:"--h4", tag:"Ça chauffe sous la couette",
   dare:{t:"Défis coquins", s:"Un défi taquin quand vos réponses diffèrent"}},
  {n:5, name:"Brûlant",    tok:"--h5", tag:"Fantasmes et envies inavouées",
   dare:{t:"Défis brûlants", s:"Un défi osé quand vos réponses diffèrent"}},
];
/* Les questions sont dans le dossier questions/ (un fichier par niveau). */
const Q = window.PILEPOIL_Q || [];
const DECK_SIZE = 30;          // nombre de questions par défaut
const LENGTHS = [10, 20, 30];  // longueurs de partie proposées
/* Défis proposés quand les réponses diffèrent. Le ton suit le niveau : rien de coquin avant le niveau 4. */
const DARES = {
  1:[
    "Dites chacun une qualité de l'autre que vous n'avez jamais dite à voix haute.",
    "Imitez-vous mutuellement au réveil.",
    "Un câlin de 10 secondes avant la question suivante.",
    "Inventez sur le moment votre poignée de main secrète.",
    "Restez 15 secondes les yeux dans les yeux sans rire.",
    "Chantez ensemble le refrain d'une chanson que vous connaissez tous les deux.",
    "Racontez la dernière chose qui vous a fait rire ensemble.",
    "Inventez chacun un nouveau surnom pour l'autre.",
    "Faites une photo grimace à deux.",
    "Citez à tour de rôle trois choses que vous aimez faire ensemble.",
    "Un massage des mains de 30 secondes chacun.",
    "Imitez la façon dont l'autre répond au téléphone.",
    "Promettez-vous une petite attention pour demain.",
    "Imitez la tête de l'autre quand la faim arrive.",
    "Faites-vous un compliment sur un détail que personne ne remarque.",
  ],
  2:[
    "Racontez chacun votre souvenir préféré de vous deux.",
    "Un bisou sur le bout du nez.",
    "Rejouez votre premier baiser.",
    "Retrouvez la plus vieille photo de vous deux dans vos téléphones.",
    "Racontez chacun votre toute première impression de l'autre.",
    "Rejouez la scène de votre rencontre en 30 secondes.",
    "Retrouvez la date d'un moment important pour vous deux… sans vérifier.",
    "Fredonnez une chanson qui vous rappelle un souvenir commun.",
    "Citez chacun un moment où vous avez été fier ou fière de l'autre.",
    "Choisissez ensemble une date pour refaire votre premier rendez-vous.",
    "Racontez un souvenir drôle de vous deux que personne d'autre ne connaît.",
    "Un câlin de retrouvailles, comme après un long voyage.",
    "Résumez chacun votre première année ensemble en un seul mot.",
    "Relisez ensemble les premiers messages que vous vous êtes envoyés.",
    "Dites merci à l'autre pour un souvenir précis.",
  ],
  3:[
    "Un bisou dans le cou.",
    "Un compliment sincère, les yeux dans les yeux, sans rire.",
    "Un slow de 30 secondes, même sans musique.",
    "Draguez l'autre comme si vous vous rencontriez ce soir.",
    "Un baisemain dans les règles de l'art.",
    "Murmurez un compliment à l'oreille de l'autre.",
    "Regard de braise : 10 secondes sans cligner des yeux.",
    "Écrivez un mot doux du bout du doigt dans le dos de l'autre, qui doit deviner.",
    "Un baiser de cinéma, version timide.",
    "Dites en une phrase ce qui vous a fait craquer chez l'autre.",
    "Faites votre plus belle déclaration en trois mots.",
    "Recoiffez l'autre tendrement.",
    "Lancez votre phrase de drague la plus ringarde.",
    "Embrassez la paume de la main de l'autre.",
    "Prenez l'autre dans vos bras et balancez-vous doucement pendant 20 secondes.",
  ],
  4:[
    "Un massage des épaules de 2 minutes.",
    "Un baiser de cinéma de 10 secondes.",
    "Retirez chacun un vêtement… une chaussette compte.",
    "Murmurez une envie coquine à l'oreille de l'autre.",
    "Un bisou à l'endroit que l'autre choisit, au-dessus de la ceinture.",
    "Défaites un bouton chez l'autre, sans les mains si vous osez.",
    "Un câlin collé-serré de 20 secondes, sans parler.",
    "Caressez le dos de l'autre du bout des doigts pendant 30 secondes.",
    "Envoyez un message coquin à l'autre, alors que vous êtes côte à côte.",
    "Un baiser dans le cou qui dure 10 secondes.",
    "Décrivez la tenue dans laquelle vous aimeriez voir l'autre ce soir.",
    "Les yeux fermés, devinez où l'autre vous embrasse.",
    "Massez les pieds de l'autre pendant une minute.",
    "Offrez à l'autre un bon pour un câlin coquin, à utiliser quand il lui plaira.",
    "Mordillez doucement l'oreille de l'autre.",
  ],
  5:[
    "Retirez chacun un vêtement, celui que l'autre choisit.",
    "Murmurez chacun à l'oreille de l'autre ce que vous avez envie de lui faire ce soir.",
    "Embrassez-vous 10 secondes, là où l'autre le décide.",
    "Un massage de 2 minutes, torse nu.",
    "Choisissez ensemble une position à essayer plus tard ce soir.",
    "Bandez les yeux de l'autre jusqu'à la prochaine question.",
    "Décrivez votre fantasme du moment en une seule phrase.",
    "Un baiser sur l'intérieur de la cuisse de l'autre.",
    "Retirez un vêtement à l'autre, les mains dans le dos.",
    "Dites sans détour ce qui vous excite le plus chez l'autre.",
    "Montrez l'endroit où vous préférez être embrassé·e.",
    "Un baiser langoureux de 20 secondes, mains baladeuses autorisées.",
    "Choisissez ensemble un jouet ou un accessoire à essayer bientôt.",
    "Une minute de caresses, les yeux bandés pour qui les reçoit.",
    "Déshabillez l'autre d'une pièce de votre choix, très lentement.",
  ],
};
/* Le même défi s'affiche sur les deux téléphones : il dépend de la partie et de la question. */
function dareFor(s, lvl){ const list = DARES[lvl]; return list[(Math.floor((s.round || 0) / 1000) + s.idx * 7) % list.length]; }
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
  soundOn: '<svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 9.5h3.5L12 5.5v13l-4.5-4H4z"/><path d="M15.5 9a4 4 0 0 1 0 6M18 6.5a7.5 7.5 0 0 1 0 11"/></svg>',
  soundOff: '<svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 9.5h3.5L12 5.5v13l-4.5-4H4z"/><path d="M16 9.5l5 5M21 9.5l-5 5"/></svg>',
  qr: '<svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3.5" y="3.5" width="6.5" height="6.5" rx="1.2"/><rect x="14" y="3.5" width="6.5" height="6.5" rx="1.2"/><rect x="3.5" y="14" width="6.5" height="6.5" rx="1.2"/><path d="M14 14h2.5v2.5H14zM18 18h2.5v2.5H18zM18 14h2.5M14 18v2.5"/></svg>',
  info: '<svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><path d="M9.6 9.4a2.5 2.5 0 1 1 3.6 2.3c-.8.4-1.2 1-1.2 1.8v.5M12 17h.01"/></svg>',
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
const LVPIC = {
  1: '<svg viewBox="0 0 48 48"><path d="M24 7c-1.4-2.3-5.4-1.7-5.4 1.2 0 2.3 3 4.3 5.4 5.9 2.4-1.6 5.4-3.6 5.4-5.9 0-2.9-4-3.5-5.4-1.2z" fill="#ff6b8b"/><rect x="5" y="20" width="15" height="19" rx="4" fill="#ffb3c6"/><path d="M20 25h2.5a3.5 3.5 0 0 1 0 7H20" fill="none" stroke="#ffb3c6" stroke-width="3"/><rect x="26" y="20" width="15" height="19" rx="4" fill="#8ec5ff"/><path d="M41 25h2a3.5 3.5 0 0 1 0 7h-2" fill="none" stroke="#8ec5ff" stroke-width="3"/><path d="M9 28q2 2 4 0M30 28q2 2 4 0" fill="none" stroke="#2b1d22" stroke-width="1.6" stroke-linecap="round"/><ellipse cx="12.5" cy="33" rx="2" ry="1.2" fill="#ff6b8b" opacity=".6"/><ellipse cx="33.5" cy="33" rx="2" ry="1.2" fill="#ff6b8b" opacity=".6"/></svg>',
  2: '<svg viewBox="0 0 48 48"><g transform="rotate(-9 24 24)"><rect x="9" y="7" width="30" height="35" rx="2.5" fill="#ffffff" stroke="#e3d6dc" stroke-width="1.2"/><rect x="12.5" y="10.5" width="23" height="21" rx="1" fill="#bfe3ff"/><circle cx="31" cy="15" r="3" fill="#ffd36b"/><path d="M12.5 31.5l7-8 5 5 3.5-3.5 7.5 6.5z" fill="#7cc47f"/><path d="M24 22.6c-.9-1.5-3.5-1.1-3.5.8 0 1.5 2 2.8 3.5 3.8 1.5-1 3.5-2.3 3.5-3.8 0-1.9-2.6-2.3-3.5-.8z" fill="#ff6b8b"/><path d="M15 37h12" stroke="#c9b5bf" stroke-width="1.6" stroke-linecap="round"/></g></svg>',
  3: '<svg viewBox="0 0 48 48"><path d="M24 44V24" stroke="#3f9b4b" stroke-width="2.6" stroke-linecap="round"/><path d="M24 35c-5-1-8-4-8-8 4 0 7 3 8 8z" fill="#5fb769"/><path d="M24 31c4-.5 6.5-3 7-6.5-3.5.2-6.3 2.6-7 6.5z" fill="#5fb769"/><path d="M14 13c0-5 5-8 10-8s10 3 10 8c0 7-4.5 12-10 12s-10-5-10-12z" fill="#e2405f"/><path d="M18 11c2-3 10-3 12 0-1 4-3 6-6 6s-5-2-6-6z" fill="#c42c4a"/><path d="M21 12c1.5 2 4.5 2 6 0" fill="none" stroke="#ff8fa8" stroke-width="1.6" stroke-linecap="round"/><path d="M14.5 15c2 4 5 6 9.5 6" fill="none" stroke="#b81f3e" stroke-width="1.4" stroke-linecap="round"/></svg>',
  4: '<svg viewBox="0 0 48 48"><path d="M5 23c4-6 9-9 13-9 2.4 0 4.3 1.3 6 3 1.7-1.7 3.6-3 6-3 4 0 9 3 13 9-1 .6-2.3.8-4 .8H9c-1.7 0-3-.2-4-.8z" fill="#e2405f"/><path d="M5 23c1 .6 2.3.8 4 .8h30c1.7 0 3-.2 4-.8-4 8-11 12-19 12S9 31 5 23z" fill="#c42c4a"/><path d="M9 23.8h30" stroke="#8c1530" stroke-width="1.6" stroke-linecap="round"/><path d="M14 18.5c2-1.5 4-2 6-1.5M31 29c2-.5 4-1.8 5.5-3.5" fill="none" stroke="#ff9fb4" stroke-width="1.8" stroke-linecap="round"/></svg>',
  5: '<svg viewBox="0 0 48 48"><path d="M24 3c2 6 9 9 11 17 1.5-2 1.6-4.5 1.2-6.6C41 18 43 23 43 28c0 9-8.5 16-19 16S5 37 5 28c0-6 3-10 6.5-13 .2 2.6 1 4.6 2.6 6C14.5 13 20 9 24 3z" fill="#ff8a3d"/><path d="M24 13c1.3 4 5.5 6.2 6.8 11 1-1.2 1.2-2.7 1-4 2.6 2.7 3.8 5.7 3.8 8.6 0 6.2-5.3 11-11.6 11S12.4 34.8 12.4 28.6c0-3.6 1.8-6.4 4-8.3.1 1.6.7 2.9 1.6 3.7C18.4 19 21.4 16.6 24 13z" fill="#ffc94a"/><path d="M24 40c-.4-.3-7-4.4-7-9 0-2.4 1.8-4 3.8-4 1.3 0 2.4.7 3.2 1.8.8-1.1 1.9-1.8 3.2-1.8 2 0 3.8 1.6 3.8 4 0 4.6-6.6 8.7-7 9z" fill="#e2304f"/></svg>',
};

/* ---------- Avatars animaux (SVG, 64 × 64) ----------
   Chaque avatar = une tête et un buste sur un fond de couleur, découpés en rond. */
const INK = "#2b1d22";
const eye = (x, y, s) => { s = s || 1;
  return '<ellipse cx="' + x + '" cy="' + y + '" rx="' + (2.5*s) + '" ry="' + (2.9*s) + '" fill="' + INK + '"/>'
    + '<circle cx="' + (x + .9*s) + '" cy="' + (y - 1.1*s) + '" r="' + (1.05*s) + '" fill="#fff"/>'
    + '<circle cx="' + (x - .8*s) + '" cy="' + (y + 1.2*s) + '" r="' + (.45*s) + '" fill="#fff" opacity=".8"/>'; };
const eyes = (y, dx, s) => eye(32 - (dx || 6.5), y, s) + eye(32 + (dx || 6.5), y, s);
const blush = (y, dx, c) => '<ellipse cx="' + (32 - (dx || 11)) + '" cy="' + y + '" rx="3.4" ry="2" fill="' + (c || "#ff7f9c") + '" opacity=".5"/>'
  + '<ellipse cx="' + (32 + (dx || 11)) + '" cy="' + y + '" rx="3.4" ry="2" fill="' + (c || "#ff7f9c") + '" opacity=".5"/>';
const smile = (y, w) => { w = w || 3; return '<path d="M' + (32 - w) + ' ' + y + 'q' + w + ' ' + (w * .85) + ' ' + (2 * w) + ' 0" fill="none" stroke="' + INK + '" stroke-width="1.7" stroke-linecap="round"/>'; };
const body = (c, chest) => '<path d="M7 66C8 54 18 47.5 32 47.5S56 54 57 66z" fill="' + c + '"/>'
  + (chest ? '<path d="M23.5 66c0-8.5 3.8-13 8.5-13s8.5 4.5 8.5 13z" fill="' + chest + '"/>' : "");
const shade = (cy, r) => '<path d="M' + (32 - r) + ' ' + cy + 'a' + r + ' ' + r + ' 0 0 0 ' + (2 * r) + ' 0a' + r + ' ' + (r * .7) + ' 0 0 1 ' + (-2 * r) + ' 0z" fill="#000" opacity=".07"/>';
const whiskers = (y, c) => '<path d="M12.5 ' + (y - 2) + 'l7.5 1.3M12.5 ' + (y + 2.5) + 'l7.5-.8M51.5 ' + (y - 2) + 'l-7.5 1.3M51.5 ' + (y + 2.5) + 'l-7.5-.8" stroke="' + c + '" stroke-width="1" stroke-linecap="round" opacity=".55"/>';

const AVATARS = [
  {k:"chat", n:"Chat", bg:"#ffe3c7", s:
    body("#e8914a", "#fff3e6")
    + '<path d="M14.5 29L16.5 9.5 29 19z" fill="#f4a259"/><path d="M49.5 29L47.5 9.5 35 19z" fill="#f4a259"/>'
    + '<path d="M18 24.5l1.2-10 7 5.3z" fill="#ffc2c8"/><path d="M46 24.5l-1.2-10-7 5.3z" fill="#ffc2c8"/>'
    + '<circle cx="32" cy="33" r="17.5" fill="#f4a259"/>' + shade(33, 17.5)
    + '<path d="M32 16.5v4.2M27.6 17.6l1.2 3.3M36.4 17.6l-1.2 3.3" stroke="#d9823d" stroke-width="1.7" stroke-linecap="round"/>'
    + '<ellipse cx="32" cy="39.5" rx="7" ry="4.6" fill="#fff3e6"/>'
    + eyes(32.5) + blush(38.5, 11.5)
    + '<path d="M30.2 37.2h3.6l-1.8 2.1z" fill="#e9707f"/>'
    + '<path d="M29 40.6q1.5 1.6 3 0q1.5 1.6 3 0" fill="none" stroke="' + INK + '" stroke-width="1.5" stroke-linecap="round"/>'
    + whiskers(39, "#a65a26")},
  {k:"chien", n:"Chien", bg:"#e3edff", s:
    body("#c9955c", "#f3dcc0")
    + '<circle cx="32" cy="33.5" r="17.5" fill="#d9a66b"/>' + shade(33.5, 17.5)
    + '<ellipse cx="39.5" cy="31.5" rx="5.6" ry="5.2" fill="#b97b45"/>'
    + '<ellipse cx="15.5" cy="32" rx="6" ry="12" fill="#8a5a3b" transform="rotate(16 15.5 32)"/>'
    + '<ellipse cx="48.5" cy="32" rx="6" ry="12" fill="#8a5a3b" transform="rotate(-16 48.5 32)"/>'
    + '<ellipse cx="32" cy="40.5" rx="8.2" ry="6.2" fill="#f3dcc0"/>'
    + eyes(31.5) + blush(39.5, 12)
    + '<ellipse cx="32" cy="37.6" rx="3.4" ry="2.4" fill="' + INK + '"/><ellipse cx="31" cy="36.9" rx="1" ry=".6" fill="#fff" opacity=".7"/>'
    + '<path d="M32 40v1.5M28.8 41.5q3.2 2.8 6.4 0" fill="none" stroke="' + INK + '" stroke-width="1.5" stroke-linecap="round"/>'
    + '<path d="M30.7 42.8c0 2.6 2.6 2.6 2.6 0z" fill="#ff7f9c"/>'},
  {k:"lapin", n:"Lapin", bg:"#ffe0ec", s:
    body("#ece2e8", "#fff")
    + '<ellipse cx="24.5" cy="14" rx="5.5" ry="13" fill="#f6f0f4" transform="rotate(-8 24.5 14)"/>'
    + '<ellipse cx="39.5" cy="14" rx="5.5" ry="13" fill="#f6f0f4" transform="rotate(8 39.5 14)"/>'
    + '<ellipse cx="24.5" cy="15" rx="2.6" ry="9.5" fill="#ffb3c6" transform="rotate(-8 24.5 15)"/>'
    + '<ellipse cx="39.5" cy="15" rx="2.6" ry="9.5" fill="#ffb3c6" transform="rotate(8 39.5 15)"/>'
    + '<circle cx="32" cy="35" r="17" fill="#f6f0f4"/>' + shade(35, 17)
    + eyes(33.5) + blush(39.5, 11.5)
    + '<path d="M30.6 38.4h2.8l-1.4 1.7z" fill="#ff8fab"/>'
    + '<path d="M32 40.1v1.2M29.6 41.3q1.2 1.2 2.4 0q1.2 1.2 2.4 0" fill="none" stroke="' + INK + '" stroke-width="1.4" stroke-linecap="round"/>'
    + '<rect x="30.8" y="41.6" width="2.4" height="2.6" rx=".6" fill="#fff" stroke="#e3d6dc" stroke-width=".6"/>'
    + whiskers(39.5, "#b9a9b3")},
  {k:"ours", n:"Ourson", bg:"#e5f4dc", s:
    body("#8d5c3a", "#e2b48f")
    + '<circle cx="16.5" cy="19.5" r="6.8" fill="#a8714a"/><circle cx="47.5" cy="19.5" r="6.8" fill="#a8714a"/>'
    + '<circle cx="16.5" cy="19.5" r="3.4" fill="#e2b48f"/><circle cx="47.5" cy="19.5" r="3.4" fill="#e2b48f"/>'
    + '<circle cx="32" cy="34" r="18" fill="#a8714a"/>' + shade(34, 18)
    + '<ellipse cx="32" cy="40.5" rx="8.4" ry="6.2" fill="#e2b48f"/>'
    + eyes(31.5) + blush(39, 12.5)
    + '<ellipse cx="32" cy="37.6" rx="3.3" ry="2.3" fill="' + INK + '"/><ellipse cx="31" cy="36.9" rx="1" ry=".6" fill="#fff" opacity=".7"/>'
    + '<path d="M32 39.8v1.6M29.4 41.5q2.6 2.2 5.2 0" fill="none" stroke="' + INK + '" stroke-width="1.5" stroke-linecap="round"/>'},
  {k:"panda", n:"Panda", bg:"#dff3f1", s:
    body("#2f2f3a", "#fff")
    + '<circle cx="16.5" cy="19.5" r="6.8" fill="#2f2f3a"/><circle cx="47.5" cy="19.5" r="6.8" fill="#2f2f3a"/>'
    + '<circle cx="32" cy="34" r="18" fill="#fff"/>' + shade(34, 18)
    + '<ellipse cx="25" cy="33" rx="4.8" ry="6.3" fill="#2f2f3a" transform="rotate(28 25 33)"/>'
    + '<ellipse cx="39" cy="33" rx="4.8" ry="6.3" fill="#2f2f3a" transform="rotate(-28 39 33)"/>'
    + '<circle cx="25.5" cy="32.5" r="2.3" fill="#fff"/><circle cx="38.5" cy="32.5" r="2.3" fill="#fff"/>'
    + '<circle cx="25.9" cy="32.6" r="1.35" fill="' + INK + '"/><circle cx="38.9" cy="32.6" r="1.35" fill="' + INK + '"/>'
    + blush(40, 12.5)
    + '<path d="M30.1 38.3h3.8l-1.9 2.1z" fill="' + INK + '"/>' + smile(41.5, 2.6)},
  {k:"renard", n:"Renard", bg:"#fff0d2", s:
    body("#e06c2c", "#fff4e6")
    + '<path d="M13.5 29L15 7.5 29 18.5z" fill="#ef7d3c"/><path d="M50.5 29L49 7.5 35 18.5z" fill="#ef7d3c"/>'
    + '<path d="M17 24.5l.6-10.5 7.6 5.6z" fill="#fff4e6"/><path d="M47 24.5l-.6-10.5-7.6 5.6z" fill="#fff4e6"/>'
    + '<path d="M15 7.5l-.4 5.3 4.4-2.4zM49 7.5l.4 5.3-4.4-2.4z" fill="#3b2a2a"/>'
    + '<path d="M14 30c0-10 8-14.5 18-14.5S50 20 50 30c0 9.5-8 17.5-18 19.5C22 47.5 14 39.5 14 30z" fill="#ef7d3c"/>'
    + '<path d="M14.6 34.5c5 3.6 11 4.6 17.4 11.5 6.4-6.9 12.4-7.9 17.4-11.5-1.4 8-8.4 14-17.4 15-9-1-16-7-17.4-15z" fill="#fff4e6"/>'
    + eyes(31, 6.8) + blush(37.5, 12)
    + '<ellipse cx="32" cy="44.6" rx="2.6" ry="1.9" fill="' + INK + '"/>'},
  {k:"grenouille", n:"Grenouille", bg:"#e4f3ff", s:
    body("#5aa65e", "#c9e8b0")
    + '<circle cx="22" cy="22" r="8.5" fill="#79c37b"/><circle cx="42" cy="22" r="8.5" fill="#79c37b"/>'
    + '<ellipse cx="32" cy="37" rx="21" ry="14.5" fill="#79c37b"/>' + shade(37, 14.5)
    + '<circle cx="22" cy="22" r="5.3" fill="#fff"/><circle cx="42" cy="22" r="5.3" fill="#fff"/>'
    + '<circle cx="22.8" cy="22.6" r="2.8" fill="' + INK + '"/><circle cx="42.8" cy="22.6" r="2.8" fill="' + INK + '"/>'
    + '<circle cx="23.7" cy="21.5" r="1" fill="#fff"/><circle cx="43.7" cy="21.5" r="1" fill="#fff"/>'
    + '<circle cx="29.5" cy="33" r=".9" fill="#3f7f43"/><circle cx="34.5" cy="33" r=".9" fill="#3f7f43"/>'
    + blush(40, 13.5)
    + '<path d="M22.5 39.5q9.5 8 19 0" fill="none" stroke="' + INK + '" stroke-width="1.8" stroke-linecap="round"/>'},
  {k:"pingouin", n:"Pingouin", bg:"#e5eaff", s:
    body("#34425c", "#fff")
    + '<circle cx="32" cy="33" r="19" fill="#34425c"/>'
    + '<path d="M32 26.5c-4-6-14.5-4-14.5 6.5 0 9 6.5 14.5 14.5 14.5S46.5 42 46.5 33c0-10.5-10.5-12.5-14.5-6.5z" fill="#fff"/>'
    + shade(33, 19)
    + eyes(33, 6.2) + blush(39.5, 10.5)
    + '<path d="M28.6 37.4h6.8l-3.4 4.4z" fill="#f6a43a"/><path d="M28.6 37.4h6.8l-1 1.2h-4.8z" fill="#fbc56b"/>'},
  {k:"vache", n:"Vache", bg:"#efe8ff", s:
    body("#fbfbfb", null)
    + '<path d="M14 58c3-4 8-5 11-2-1 4-6 7-11 2zM44 54c4-2 8 0 9 4-4 2-8 1-9-4z" fill="#2f2f3a"/>'
    + '<path d="M26.5 49.5h11v4h-11z" fill="#e14b5a"/><circle cx="32" cy="55" r="3" fill="#f6c443"/><circle cx="32" cy="55.8" r=".9" fill="#a8741c"/>'
    + '<path d="M21 19c-3.5-2.5-4-7-2-9.5 1 3 3.2 5 6.5 6z" fill="#f3e3c2"/><path d="M43 19c3.5-2.5 4-7 2-9.5-1 3-3.2 5-6.5 6z" fill="#f3e3c2"/>'
    + '<ellipse cx="13.5" cy="29" rx="6.2" ry="3.3" fill="#fbfbfb" transform="rotate(-22 13.5 29)"/><ellipse cx="50.5" cy="29" rx="6.2" ry="3.3" fill="#fbfbfb" transform="rotate(22 50.5 29)"/>'
    + '<ellipse cx="14" cy="29" rx="3.6" ry="1.7" fill="#f7b6c2" transform="rotate(-22 14 29)"/><ellipse cx="50" cy="29" rx="3.6" ry="1.7" fill="#f7b6c2" transform="rotate(22 50 29)"/>'
    + '<ellipse cx="32" cy="33" rx="16.5" ry="17" fill="#fbfbfb"/>' + shade(33, 16.5)
    + '<path d="M18.3 27c1.4-6.5 9-9.6 12.6-5.4 2.2 2.7-.6 6.4-5 6.4-3.4 0-6.5 1.6-7.6-1z" fill="#2f2f3a"/>'
    + '<path d="M41 24.5c2.6-1.8 5.6-.6 6.4 2-2.4 1.2-5 .9-6.4-2z" fill="#2f2f3a"/>'
    + eyes(30.5, 6.6) + blush(37, 12.5)
    + '<ellipse cx="32" cy="42" rx="10" ry="6.8" fill="#f7b6c2"/>'
    + '<ellipse cx="28" cy="41.5" rx="1.5" ry="2.1" fill="#c5677b"/><ellipse cx="36" cy="41.5" rx="1.5" ry="2.1" fill="#c5677b"/>'
    + '<path d="M29.5 45.6q2.5 1.6 5 0" fill="none" stroke="#c5677b" stroke-width="1.4" stroke-linecap="round"/>'},
  {k:"cochon", n:"Cochon", bg:"#fff6d5", s:
    body("#ee93a8", "#f9c2cf")
    + '<path d="M15 25.5L17.5 10.5 28.5 19z" fill="#f7a8b8"/><path d="M49 25.5L46.5 10.5 35.5 19z" fill="#f7a8b8"/>'
    + '<path d="M18.4 21.5l1.4-7.5 5.4 4.4z" fill="#e98aa0"/><path d="M45.6 21.5l-1.4-7.5-5.4 4.4z" fill="#e98aa0"/>'
    + '<circle cx="32" cy="34" r="18" fill="#f7a8b8"/>' + shade(34, 18)
    + eyes(30.5, 7) + blush(38, 12.5, "#e8577a")
    + '<ellipse cx="32" cy="39.5" rx="7.6" ry="5.4" fill="#f28da3"/><ellipse cx="32" cy="38.7" rx="6.4" ry="4.2" fill="#f59cb0"/>'
    + '<ellipse cx="29.4" cy="39.4" rx="1.4" ry="2" fill="#c4566f"/><ellipse cx="34.6" cy="39.4" rx="1.4" ry="2" fill="#c4566f"/>'
    + smile(46.3, 2.4)},
  {k:"cheval", n:"Cheval", bg:"#f1ece4", s:
    body("#a8652f", null)
    + '<path d="M41 47c4 2 7 6 8 12l-6 2c-1-5-3-9-6-11z" fill="#4a2c1e"/>'
    + '<path d="M21 19.5L22.5 7.5 29 15z" fill="#b8743f"/><path d="M43 19.5L41.5 7.5 35 15z" fill="#b8743f"/>'
    + '<path d="M23.4 16.8l.8-6 3.2 3.8z" fill="#8a5129"/><path d="M40.6 16.8l-.8-6-3.2 3.8z" fill="#8a5129"/>'
    + '<path d="M19.5 27C19.5 18 25 13.5 32 13.5S44.5 18 44.5 27l1 14.5C45.5 49 39.5 53 32 53s-13.5-4-13.5-11.5z" fill="#b8743f"/>'
    + shade(43, 13.5)
    + '<path d="M30.4 17h3.2l1.3 15.5h-5.8z" fill="#fff6ec" opacity=".9"/>'
    + '<path d="M24.5 15.5c1.5-5 10-6.5 14-2.2-2.2-.2-3.4 2.6-6.6 3-1.6-2.2-4-2.4-7.4-.8z" fill="#4a2c1e"/>'
    + eyes(29.5, 7.2) + blush(37, 11)
    + '<ellipse cx="32" cy="45" rx="10.2" ry="7.6" fill="#e8c9a4"/>'
    + '<ellipse cx="28.2" cy="45" rx="1.4" ry="2.1" fill="#7a4a2a"/><ellipse cx="35.8" cy="45" rx="1.4" ry="2.1" fill="#7a4a2a"/>'
    + '<path d="M29.4 49.4q2.6 1.6 5.2 0" fill="none" stroke="#7a4a2a" stroke-width="1.4" stroke-linecap="round"/>'},
  {k:"souris", n:"Souris", bg:"#fff0e8", s:
    body("#a3aabb", "#e9ecf2")
    + '<circle cx="15" cy="21.5" r="10" fill="#b9bfcc"/><circle cx="49" cy="21.5" r="10" fill="#b9bfcc"/>'
    + '<circle cx="15.5" cy="22" r="6.4" fill="#ffc2d1"/><circle cx="48.5" cy="22" r="6.4" fill="#ffc2d1"/>'
    + '<circle cx="32" cy="36" r="16.5" fill="#b9bfcc"/>' + shade(36, 16.5)
    + '<ellipse cx="32" cy="41" rx="7.4" ry="5.2" fill="#e9ecf2"/>'
    + eyes(34, 6) + blush(40.5, 11.5)
    + '<circle cx="32" cy="39.8" r="2.3" fill="#ff8fab"/><circle cx="31.3" cy="39.1" r=".7" fill="#fff" opacity=".8"/>'
    + '<path d="M32 42v1.2M29.8 43.3q2.2 1.8 4.4 0" fill="none" stroke="' + INK + '" stroke-width="1.4" stroke-linecap="round"/>'
    + whiskers(41, "#6f7686")},
];
const AVBY = Object.fromEntries(AVATARS.map(a=>[a.k,a]));
let avClip = 0;
/* Le dessin est découpé en rond (le buste dépasse du cercle) ; chaque SVG a son propre identifiant de découpe. */
function avatarMarkup(k, size){
  const a = AVBY[k] || AVATARS[0]; const id = "avc" + (++avClip);
  return '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"' + (size ? ' width="' + size + '" height="' + size + '"' : ' aria-hidden="true"') + '>'
    + '<defs><clipPath id="' + id + '"><circle cx="32" cy="32" r="32"/></clipPath></defs>'
    + '<g clip-path="url(#' + id + ')"><rect width="64" height="64" fill="' + a.bg + '"/>' + a.s + '</g></svg>';
}
function avatarSvg(k){ return icon(avatarMarkup(k)); }

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
function buildDeck(lvl, n){ return shuffle(Q.filter(x=>x.l===lvl).map(x=>x.id)).slice(0, n || DECK_SIZE); }
function lvCount(lvl){ return Q.filter(x=>x.l===lvl).length; }
function deckSize(lvl, n){ return Math.min(n || DECK_SIZE, lvCount(lvl)); }
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
function localDoc(initial, onSave){
  let data = initial ? clone(initial) : null; const subs = new Set();
  const emit = () => subs.forEach(f => f({exists: !!data, data: () => data ? clone(data) : undefined}));
  const save = () => { if (onSave) onSave(data); };
  return {
    async get(){ return {exists: !!data, data: () => data ? clone(data) : undefined}; },
    async set(v){ data = clone(v); save(); emit(); },
    async update(v){ data = merge(data || {}, clone(v)); save(); emit(); },
    async delete(){ data = null; save(); },
    onSnapshot(fn){ subs.add(fn); setTimeout(emit, 0); return () => subs.delete(fn); },
  };
}
let db = null, dbChecked = false;

/* ---------- État ---------- */
let S = null, ref = null, unsub = null, role = null, local = false;
/* Historique des réponses, gardé seulement dans ce navigateur (jamais envoyé au serveur). Clé : "round:idx". */
/* Sauvegarde sur l'appareil, pour reprendre une partie fermée par erreur. Effacée en quittant, ou au bout de 24 h. */
const SAVE_TTL = 24 * 3600 * 1000;
function loadSaved(k){
  try { const v = JSON.parse(store.get(k) || "null"); if (v && v.at && Date.now() - v.at < SAVE_TTL) return v; } catch(e){}
  store.del(k); return null;
}
function saveLocal(k, v){ try { store.set(k, JSON.stringify(Object.assign({ at: Date.now() }, v))); } catch(e){} }
const saveLocalGame = (d) => d ? saveLocal("dm-local", { data: d }) : store.del("dm-local");
const HIST = (loadSaved("dm-hist") || {}).items || {};
function keepHist(s){
  if (s && s.phase === "play" && ansOf(s,"host") !== null && ansOf(s,"guest") !== null){
    for (const k in HIST) if (!k.startsWith(s.round + ":")) delete HIST[k];   // on ne garde que la partie en cours
    HIST[s.round + ":" + s.idx] = { h: ansOf(s,"host"), g: ansOf(s,"guest") };
    saveLocal("dm-hist", { items: HIST });
  }
}
function clearHist(){ for (const k in HIST) delete HIST[k]; store.del("dm-hist"); }
let screen = store.get("dm-adult") === "1" ? "home" : "gate", err = "", lastCardKey = null, handoffOk = "";
let draft = { name: store.get("dm-name") || "", partner: "", av: store.get("dm-av") || "chat", av2: "lapin", maxL: 5, dares: true, code: "",
  len: LENGTHS.includes(Number(store.get("dm-len"))) ? Number(store.get("dm-len")) : DECK_SIZE };

const PCOL = { host: "var(--p1)", guest: "var(--p2)" };
function other(r){ return r === "host" ? "guest" : "host"; }
function pname(s, r){ return (s.players && s.players[r] && s.players[r].name) || (r === "host" ? "Joueur 1" : "Joueur 2"); }
function target(s){ return s.idx % 2 === 0 ? "guest" : "host"; }  // personne visée par une question « guess »
function cardOf(s){ return QBY[s.deck[s.idx]]; }
function qText(card, s){ return fillName(card.q, pname(s, target(s))); }
function ansOf(s, r){ const a = s.answers && s.answers[r]; return (a === undefined) ? null : a; }
function isMatch(s){ return ansOf(s,"host") !== null && ansOf(s,"host") === ansOf(s,"guest"); }
/* results[i] : true (en phase), false (pas d'accord) ou null (question passée, qui ne compte pas). */
function syncCount(s){ return Object.values(s.results || {}).filter(v => v === true).length; }
function playedCount(s){ return Object.values(s.results || {}).filter(v => v === true || v === false).length; }
function label(s, card, val){ return card.t === "who" ? pname(s, val) : card.o[val]; }

function attach(r, isLocal, docRef, code){
  if (unsub) unsub();
  role = r; local = isLocal; ref = docRef; S = null; let first = true; reactSeen = {}; lastRevealKey = null;
  if (!isLocal){ store.set("dm-role-" + code, r); store.set("dm-last", code); }
  unsub = ref.onSnapshot(snap => {
    if (!snap.exists){
      err = S && !local ? "Ta moitié a quitté la partie : la session a été effacée." : "Cette session n'existe plus.";
      S = null; screen = "home"; if (code) store.del("dm-last"); render(); return;
    }
    S = snap.data(); keepHist(S); onStateChange(S, first); first = false; render();
  }, () => { err = "Connexion perdue avec la session. Rouvre la page pour la reprendre."; render(); });
}
function leave(){
  if (unsub) unsub(); unsub = null;
  // Partie à distance : on efface la session du serveur pour les deux joueurs.
  if (ref && !local && ref.delete) ref.delete().catch(() => {});
  if (S && S.code) store.del("dm-role-" + S.code);
  store.del("dm-last"); store.del("dm-local"); clearHist();
  S = null; ref = null; role = null; local = false; screen = "home"; err = ""; exportMsg = ""; render();
}
async function act(fn){
  try { err = ""; await fn(); }
  catch(e){ err = (e && (e.code === "quota_exceeded" || e.code === "resource-exhausted")) ? "Trop de sessions enregistrées : la création est bloquée pour l'instant." : "L'action n'a pas abouti. Réessaie dans un instant."; render(); }
}

/* ---------- Actions ---------- */
function freshGame(maxL, n){ return { deck: buildDeck(maxL, n), idx: 0, phase: "play", answers: {host:null, guest:null}, results: {}, round: Date.now() }; }
async function createSession(){
  const name = draft.name.trim(); if (!name){ err = "Indique ton prénom."; render(); return; }
  store.set("dm-name", name); store.set("dm-av", draft.av);
  await act(async () => {
    let code, r, tries = 0;
    do { code = newCode(); r = db.doc("sessions/" + code); tries++; } while ((await r.get()).exists && tries < 6);
    await r.set({ code, createdAt: Date.now(), maxL: draft.maxL, n: draft.len, dares: draft.dares, players: { host: { name, av: draft.av } },
      phase: "lobby", deck: [], idx: 0, answers: {host:null, guest:null}, results: {} });
    attach("host", false, r, code);
  });
}
async function createLocal(){
  const a = draft.name.trim(), b = draft.partner.trim();
  if (!a || !b){ err = "Indiquez vos deux prénoms."; render(); return; }
  store.set("dm-name", a);
  const r = localDoc(null, saveLocalGame);
  attach("host", true, r, "");
  await r.set(Object.assign({ code: "", maxL: draft.maxL, n: draft.len, dares: draft.dares, players: { host:{name:a, av:draft.av}, guest:{name:b, av:draft.av2} } }, freshGame(draft.maxL, draft.len)));
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
function resumeLocal(){
  const v = loadSaved("dm-local"); if (!v || !v.data) { render(); return; }
  attach("host", true, localDoc(v.data, saveLocalGame), "");
}
function abandonRemote(code){
  try { db.doc("sessions/" + code).delete().catch(() => {}); } catch(e){}
  store.del("dm-last"); store.del("dm-role-" + code); clearHist(); render();
}
/* Au démarrage : une partie a été fermée sans « Quitter » ? On propose de la reprendre. */
async function offerResume(){
  if (S || modal || inviteCode || screen !== "home") return;
  const loc = loadSaved("dm-local");
  if (loc && loc.data && loc.data.players && loc.data.deck){
    const d = loc.data;
    const where = d.phase === "end" ? "au bilan" : "à la question " + (d.idx + 1) + " sur " + d.deck.length;
    ask({ icon:"replay", title:"Reprendre la partie ?", confirm:"Reprendre", cancel:"Abandonner",
      text:"La partie de " + pname(d, "host") + " et " + pname(d, "guest") + " s'est arrêtée " + where + ".",
      onConfirm: resumeLocal, onCancel: ()=>{ store.del("dm-local"); clearHist(); render(); } });
    return;
  }
  const last = store.get("dm-last");
  if (!last || !db) return;
  let snap = null; try { snap = await db.doc("sessions/" + last).get(); } catch(e){ return; }
  if (S || modal || screen !== "home") return;
  if (!snap.exists){ store.del("dm-last"); render(); return; }
  const d = snap.data(); const r = store.get("dm-role-" + last) || "guest";
  const partner = d.players && d.players[other(r)] && d.players[other(r)].name;
  const where = d.phase === "lobby" ? "pas encore commencée" : d.phase === "end" ? "arrivée au bilan" : "arrêtée à la question " + (d.idx + 1) + " sur " + d.deck.length;
  ask({ icon:"replay", title:"Reprendre la partie ?", confirm:"Reprendre", cancel:"Abandonner",
    text:"Ta session " + last + (partner ? " avec " + partner : "") + " est toujours ouverte, " + where + ". « Abandonner » l'efface pour vous deux.",
    onConfirm: ()=>resume(last), onCancel: ()=>abandonRemote(last) });
}
async function resume(code){
  await act(async () => {
    const r = db.doc("sessions/" + code); const snap = await r.get();
    if (!snap.exists){ store.del("dm-last"); render(); return; }
    attach(store.get("dm-role-" + code) || "guest", false, r, code);
  });
}
const startGame = () => act(() => ref.set(Object.assign(
  { code: S.code || "", createdAt: S.createdAt || Date.now(), maxL: S.maxL, n: S.n || DECK_SIZE, dares: !!S.dares, players: S.players }, freshGame(S.maxL, S.n || DECK_SIZE))));
function answer(r, val){ const p = {answers:{}}; p.answers[r] = val; return act(() => ref.update(p)); }
function next(skip){
  const i = S.idx + 1; const res = {}; res[S.idx] = skip === true ? null : isMatch(S);
  if (skip !== true) keepHist(S);
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
    h("div", {class:"avpick", role:"group", "aria-labelledby": id, "data-keep-scroll": id}, AVATARS.map(a => h("button", {type:"button", class:"avbtn", "aria-pressed": String(draft[key] === a.k), "aria-label": a.n, title: a.n,
      on:{click:()=>{ draft[key] = a.k; render(); }}}, h("span", {class:"ava"}, avatarSvg(a.k)), h("span", {class:"avn", "aria-hidden":"true", text:a.n})))));
}
function heatDots(n){
  const d = h("span", {class:"dots5", "aria-hidden":"true"});
  for (let i = 1; i <= 5; i++) d.append(h("i", {class: i <= n ? "on" : null}));
  return d;
}
function levelPicker(){
  const L = LEVELS[draft.maxL-1];
  return h("div", {class:"field"},
    h("div", {class:"fhead"},
      h("label", {id:"lvl-lbl", text:"Niveau ce soir"}),
      h("span", {class:"lenseg", role:"group", "aria-label":"Nombre de questions"},
        h("span", {class:"lenbtns"}, LENGTHS.map(n => h("button", {type:"button", class:"len", "aria-pressed": String(draft.len === n), "aria-label": n + " questions",
          on:{click:()=>{ draft.len = n; store.set("dm-len", String(n)); render(); }}}, String(n)))),
        h("span", {class:"lenlbl", "aria-hidden":"true", text:"questions"}))),
    h("div", {class:"lvcard", style:"--lc:var(" + L.tok + ")", "aria-live":"polite"},
      h("span", {class:"pic", "aria-hidden":"true"}, icon(LVPIC[L.n])),
      h("span", {class:"txt"},
        h("span", {class:"hd"}, h("b", {text: L.name}), heatDots(L.n), h("span", {class:"sr-only", text:"intensité " + L.n + " sur 5"})),
        h("span", {class:"tg", text: L.tag}),
        h("span", {class:"ct", text: draft.len + " questions tirées au hasard parmi " + lvCount(L.n)}))),
    h("div", {class:"lvtrack", role:"group", "aria-labelledby":"lvl-lbl"},
      LEVELS.map(X => h("button", {type:"button", class:"lvstep", style:"--lc:var(" + X.tok + ")",
        "aria-pressed": String(draft.maxL === X.n), "aria-label": X.name + ", niveau " + X.n + " sur 5",
        on:{click:()=>{ draft.maxL = X.n; render(); }}},
        h("span", {class:"pic", "aria-hidden":"true"}, icon(LVPIC[X.n])),
        h("span", {class:"nm", text: X.name})))));
}
function explainDares(){
  const L = LEVELS[draft.maxL-1];
  ask({ icon:"info", cancel:false, confirm:"Compris", title:"Les défis",
    text:"Quand vos réponses ne collent pas, un petit défi s'affiche, à faire ensemble avant la question suivante. "
      + "Son ton suit le niveau : tout doux en Complicité, osé en Brûlant. C'est toujours facultatif, on peut passer son tour. "
      + "Exemple en " + L.name + " : « " + DARES[L.n][0] + " »",
    onConfirm: ()=>{} });
}
function dareSwitch(){
  const L = LEVELS[draft.maxL-1];
  return h("label", {class:"toggle", for:"dares", style:"--lc:var(" + L.tok + ")"},
    h("span", {class:"ic", "aria-hidden":"true"}, icon(LVPIC[L.n])),
    h("span", {class:"tx"}, h("b", {text: L.dare.t}), h("span", {text: L.dare.s})),
    btn("help", "info", "", (e)=>{ e.preventDefault(); explainDares(); }, {"aria-label":"À quoi servent les défis ?", title:"À quoi servent les défis ?"}),
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
  const last = store.get("dm-last"); const shared = !!db; const loc = loadSaved("dm-local");
  const resumeBtn = loc ? btn("link", null, "Reprendre la partie en cours", resumeLocal)
    : (last && shared) ? btn("link", null, "Reprendre la session " + last, ()=>resume(last)) : null;
  return [
    brand(true),
    h("p", {class:"lead", text:"Le jeu de questions pour couples. Répondez chacun de votre côté, puis découvrez si vous êtes sur la même longueur d'onde."}),
    h("div", {class:"parade", "aria-hidden":"true"}, AVATARS.map(a => h("span", {class:"ava"}, avatarSvg(a.k)))),
    h("section", {class:"panel"},
      shared ? h("div", {class:"stack"},
        btn("primary", "plus", "Créer une session", ()=>{ screen="create"; err=""; render(); }),
        btn("ghost", "key", "J'ai reçu un code", ()=>{ screen="join"; err=""; render(); }))
      : h("p", {class:"muted", style:"font-size:14px;text-align:center", text: dbChecked ? "Les sessions à distance ne sont pas disponibles ici. Jouez sur un seul téléphone en vous le passant." : "Connexion aux sessions…"}),
      shared ? h("div", {class:"divider", text:"ou"}) : null,
      btn(shared ? "ghost" : "primary", "phone", "Jouer sur un seul téléphone", ()=>{ screen="local"; err=""; render(); }),
      resumeBtn),
    errLine()
  ];
}
function privacyNote(){
  return h("p", {class:"note"}, "Vos prénoms passent par notre serveur le temps de la partie, puis tout est effacé. ",
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
      h("span", {class:"muted", style:"font-size:14px", text: S.deck && S.deck.length ? S.deck.length + " questions · " + LEVELS[S.maxL-1].name : deckSize(S.maxL, S.n) + " questions · niveau " + LEVELS[S.maxL-1].name + (S.dares ? " · avec défis" : "")})),
    guest ? (isHost ? btn("primary", "next", "Commencer avec " + guest.name, startGame) : waiting(pname(S,"host") + " va lancer la partie"))
          : waiting("En attente de ta moitié"),
    S.code ? h("div", {class:"row share"}, btn("ghost mini wide", "copy", "Copier", copyCode, {"aria-label": "Copier le code"}), btn("ghost mini wide", "share", "Partager", shareInvite),
      window.qrcode ? btn("ghost mini wide", "qr", "QR code", showQR, {"aria-label": "Afficher le QR code à scanner"}) : null) : null,
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
    // Passer : la question ne compte ni pour ni contre, sans défi.
    kids.push(h("button", {type:"button", class:"link skip", "aria-label":"Passer cette question", on:{click:()=>next(true)}},
      h("span", {class:"sk-l", text:"Passer cette question"}), h("span", {class:"sk-s", text:"Passer"})));
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
    if (!m && S.dares) kids.push(h("div", {class:"dare"}, h("small", {text:"Défi"}), h("p", {text: dareFor(S, card.l)}), h("span", {class:"pass", text:"Facultatif : on peut toujours passer son tour."})));
    kids.push(btn("primary", "next", S.idx + 1 >= S.deck.length ? "Voir le bilan" : "Question suivante", ()=>next()));
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
  const n = syncCount(S), tot = playedCount(S), pct = tot ? Math.round(n / tot * 100) : 0;
  const skipped = Object.values(S.results || {}).filter(v => v === null).length;
  const msg = pct >= 80 ? "Vous vous connaissez par cœur." : pct >= 60 ? "Très belle complicité, avec encore quelques surprises." : pct >= 40 ? "Il vous reste plein de choses à découvrir l'un sur l'autre." : "Beaucoup de surprises ce soir. De quoi alimenter la conversation.";
  const levels = LEVELS.filter(L => L.n === S.maxL).map(L => {
    let ok = 0, all = 0;
    S.deck.forEach((id, i) => { const v = S.results && S.results[i]; if (QBY[id].l === L.n && (v === true || v === false)){ all++; if (v) ok++; } });
    return { L, ok, all };
  });
  const rows = S.deck.map((id, i) => {
    const c = QBY[id]; const tg = i % 2 === 0 ? "guest" : "host";
    const hv = HIST[S.round + ":" + i];
    const lab = (v) => (v === null || v === undefined) ? "—" : (c.t === "who" ? pname(S, v) : c.o[v]);
    const v = S.results ? S.results[i] : undefined;
    return { c, q: fillName(c.q, pname(S, tg)), h: hv ? lab(hv.h) : "—", g: hv ? lab(hv.g) : "—", ok: v === true, skip: v === null };
  });
  return { n, tot, pct, msg, levels, rows, skipped };
}
let exportMsg = "";
function recapText(){
  const st = endStats(); const d = new Date().toLocaleDateString("fr-FR", {day:"numeric", month:"long", year:"numeric"});
  const A = pname(S,"host"), B = pname(S,"guest");
  let t = "PILE-POIL · " + A + " & " + B + " · " + d + "\n\n";
  t += "Complicité : " + st.pct + " % (" + st.n + " / " + st.tot + " réponses en phase)\n" + st.msg + "\n\n";
  st.levels.forEach(x => { t += "· " + x.L.name + " : " + x.ok + " / " + x.all + "\n"; });
  t += "\n";
  st.rows.forEach((r, i) => { t += (i+1) + ". " + r.q + "\n   " + (r.skip ? "question passée" : A + " : " + r.h + " · " + B + " : " + r.g + "  →  " + (r.ok ? "en phase" : "pas d'accord")) + "\n"; });
  return t;
}
function svgImg(str){
  return new Promise(res => { const im = new Image(); im.onload = () => res(im); im.onerror = () => res(null);
    im.src = "data:image/svg+xml;charset=utf-8," + encodeURIComponent(str.replace(/var\(--accent\)/g, "#e2405f")); });
}
function avatarStr(k){ return avatarMarkup(k, 256); }
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
      ctx.font = "600 26px " + BODY; const al = wrap(ctx, r.skip ? "Question passée" : A + " : " + r.h + "   ·   " + B + " : " + r.g, W - 2*P - 100);
      const hgt = 40 + ql.length * 40 + al.length * 34 + 12;
      rr(ctx, P, y, W - 2*P, hgt, 24); ctx.fillStyle = "#ffffff"; ctx.fill();
      ctx.fillStyle = lvCol[r.c.l - 1]; rr(ctx, P, y, 10, hgt, 5); ctx.fill();
      let yy = y + 50;
      ctx.fillStyle = "#2b1020"; ctx.font = "700 30px " + BODY; ql.forEach(l => { ctx.fillText(l, P + 34, yy); yy += 40; });
      ctx.fillStyle = "#85536b"; ctx.font = "600 26px " + BODY; al.forEach(l => { ctx.fillText(l, P + 34, yy); yy += 34; });
      // marque
      const mx = W - P - 44, my = y + hgt/2;
      ctx.beginPath(); ctx.arc(mx, my, 24, 0, Math.PI*2); ctx.fillStyle = r.skip ? "#ece6ee" : r.ok ? "#dff3e7" : "#fde7dc"; ctx.fill();
      ctx.strokeStyle = r.skip ? "#9a8ea0" : r.ok ? "#1d7a4c" : "#b23e1b"; ctx.lineWidth = 5; ctx.lineCap = "round"; ctx.beginPath();
      if (r.skip){ ctx.moveTo(mx-9, my); ctx.lineTo(mx+9, my); }
      else if (r.ok){ ctx.moveTo(mx-10, my+1); ctx.lineTo(mx-3, my+8); ctx.lineTo(mx+11, my-8); }
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
    // Sur téléphone : ouvre directement le partage (WhatsApp, Messages…). Sinon : téléchargement.
    try {
      const file = new File([blob], name, { type: "image/png" });
      if (navigator.canShare && navigator.canShare({ files: [file] })){
        await navigator.share({ files: [file], title: "Pile-poil", text: "Notre complicité : " + endStats().pct + " %" });
        return;
      }
    } catch(e){ if (e && e.name === "AbortError") return; }
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
/* Les questions où vous n'étiez pas d'accord (jouées sur cet appareil). */
function disagreements(st){ return st.rows.filter(r => !r.ok && !r.skip && r.h !== "—"); }
function showDisagreements(st){
  const list = disagreements(st); const A = pname(S, "host"), B = pname(S, "guest");
  const body = h("ol", {class:"dis"}, list.slice(0, 5).map(r => h("li", null,
    h("b", {text: r.q}),
    h("span", null, h("span", {class:"nmh nm1", text: A}), " " + r.h),
    h("span", null, h("span", {class:"nmh nm2", text: B}), " " + r.g))));
  ask({ icon:"replay", cancel:false, confirm:"Fermer", title:"Vos désaccords",
    text: list.length > 5 ? "Les 5 premiers sur " + list.length + ". Le récap en image ou en texte les contient tous." : "De quoi alimenter la conversation.",
    body, onConfirm: ()=>{} });
}
function viewEnd(){
  const st = endStats();
  return [h("section", {class:"panel"},
    h("div", {class:"final"},
      h("div", {class:"duo"}, h("span", {class:"p"}, h("span", {class:"ava"}, avatarSvg(S.players.host.av)), pname(S,"host")),
        h("span", {class:"amp", text:"&"}), h("span", {class:"p"}, h("span", {class:"ava"}, avatarSvg(S.players.guest.av)), pname(S,"guest"))),
      h("span", {class:"eyebrow", text:"Votre complicité"}), h("b", {text: st.pct + " %"}),
      h("p", {text: st.n + " réponses en phase sur " + st.tot + (st.skipped ? " (" + st.skipped + (st.skipped > 1 ? " passées)" : " passée)") : "") + ". " + st.msg}),
      h("div", {class:"bylv"}, st.levels.map(x => h("div", null, h("span", {text:x.L.name}), h("span", {text: x.ok + " / " + x.all}))))),
    h("div", {class:"exp"},
      disagreements(st).length
        ? btn("link", null, "Revoir vos désaccords (" + disagreements(st).length + ")", ()=>showDisagreements(st))
        : h("p", {text:"Aucun désaccord ce soir : bravo !"}),
      h("div", {class:"row"},
        btn("primary", "share", "Partager l'image", exportImage),
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
    h("h3", {id:"mdl-t", text:m.title}), h("p", {id:"mdl-d", text:m.text}), m.body || null,
    h("div", {class:"row"}, m.cancel === false ? null : btn("ghost wide", null, m.cancel || "Annuler", ()=>{ closeModal(); if (m.onCancel) m.onCancel(); }), confirmBtn));
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
/* QR code du lien d'invitation, dessiné en SVG (noir sur blanc, lisible aussi en thème sombre). */
function qrSvg(text){
  const qr = window.qrcode(0, "M"); qr.addData(text); qr.make();
  const n = qr.getModuleCount(), q = 4, size = n + 2 * q; let d = "";
  for (let r = 0; r < n; r++) for (let c = 0; c < n; c++) if (qr.isDark(r, c)) d += "M" + (c + q) + " " + (r + q) + "h1v1h-1z";
  return icon('<svg class="qr" viewBox="0 0 ' + size + ' ' + size + '" shape-rendering="crispEdges" role="img" aria-label="QR code du lien d\'invitation">'
    + '<rect width="' + size + '" height="' + size + '" fill="#fff"/><path d="' + d + '" fill="#1d1720"/></svg>');
}
function showQR(){
  ask({ icon:"qr", cancel:false, confirm:"Fermer", title:"Scanner pour rejoindre",
    text:"Avec l'appareil photo de l'autre téléphone : le jeu s'ouvre avec le code déjà rempli.",
    body: h("div", {class:"qrbox"}, qrSvg(inviteUrl(S.code)), h("b", {class:"qrcode-txt", text: S.code})),
    onConfirm: ()=>{} });
}
async function copyCode(){
  try { await navigator.clipboard.writeText(S.code); exportMsg = "Code copié."; }
  catch(e){ exportMsg = "Le code est " + S.code + "."; }
  render();
}

/* ---------- Réactions rapides (à deux téléphones) ---------- */
const REACTIONS = [
  {k:"heart", n:"Cœur", svg:'<svg viewBox="0 0 32 32" aria-hidden="true"><path d="M16 27.5C9.5 23 4 18.4 4 12.4 4 8.8 6.8 6 10.3 6c2.3 0 4.4 1.2 5.7 3.1C17.3 7.2 19.4 6 21.7 6 25.2 6 28 8.8 28 12.4c0 6-5.5 10.6-12 15.1z" fill="#e2405f"/><path d="M9 11c.5-1.6 1.8-2.6 3.4-2.8" fill="none" stroke="#ff9fb4" stroke-width="2" stroke-linecap="round"/></svg>'},
  {k:"laugh", n:"Rire", svg:'<svg viewBox="0 0 32 32" aria-hidden="true"><circle cx="16" cy="16" r="13" fill="#ffc94a"/><path d="M9.5 13.2q2-2.4 4 0M18.5 13.2q2-2.4 4 0" fill="none" stroke="#2b1d22" stroke-width="1.8" stroke-linecap="round"/><path d="M9 17.5h14c0 4.4-3.1 7.5-7 7.5s-7-3.1-7-7.5z" fill="#2b1d22"/><path d="M11.5 22.3c1.2 1.4 2.8 2.2 4.5 2.2s3.3-.8 4.5-2.2c-1.3-.9-2.8-1.3-4.5-1.3s-3.2.4-4.5 1.3z" fill="#ff7f9c"/></svg>'},
  {k:"blush", n:"Rougir", svg:'<svg viewBox="0 0 32 32" aria-hidden="true"><circle cx="16" cy="16" r="13" fill="#ffc94a"/><ellipse cx="9.5" cy="18" rx="3.2" ry="2" fill="#ff6f8f" opacity=".75"/><ellipse cx="22.5" cy="18" rx="3.2" ry="2" fill="#ff6f8f" opacity=".75"/><path d="M10 13.5q1.8 1.6 3.6 0M18.4 13.5q1.8 1.6 3.6 0" fill="none" stroke="#2b1d22" stroke-width="1.8" stroke-linecap="round"/><path d="M13.2 21.2q2.8 2 5.6 0" fill="none" stroke="#2b1d22" stroke-width="1.8" stroke-linecap="round"/></svg>'},
];
const REACT_BY = Object.fromEntries(REACTIONS.map(x => [x.k, x]));
let reactSeen = {}, lastReactAt = 0, lastRevealKey = null;
const revealed = (s) => s && s.phase === "play" && ansOf(s, "host") !== null && ansOf(s, "guest") !== null;
/* Appelé à chaque nouvel état de la partie : sons de révélation et réactions de l'autre téléphone. */
function onStateChange(s, first){
  const rk = revealed(s) ? s.round + ":" + s.idx : null;
  if (rk && rk !== lastRevealKey && !first) playSound(isMatch(s) ? "match" : "miss");
  lastRevealKey = rk;
  const re = s.react || {};
  for (const r of ["host", "guest"]){
    const x = re[r]; if (!x || !x.t) continue;
    const isNew = !first && x.t > (reactSeen[r] || 0);
    reactSeen[r] = Math.max(reactSeen[r] || 0, x.t);
    if (isNew && r !== role && x.i === s.idx && REACT_BY[x.e]) { floatReaction(x.e); playSound("pop"); }
  }
}
function sendReaction(k){
  if (!S || local || !ref || Date.now() - lastReactAt < 1500) return;
  lastReactAt = Date.now();
  const p = { react: {} }; p.react[role] = { e: k, i: S.idx, t: Date.now() };
  floatReaction(k); playSound("pop");
  ref.update(p).catch(() => {});
}
function floatReaction(k){
  const x = REACT_BY[k]; if (!x) return;
  const el = h("span", {class:"rfloat", "aria-hidden":"true", style:"left:" + (38 + Math.random() * 24) + "%"});
  el.append(icon(x.svg)); document.body.append(el);
  setTimeout(() => el.remove(), 1900);
}
function reactionBar(){
  return h("span", {class:"reacts", role:"group", "aria-label":"Réagir"}, REACTIONS.map(x =>
    h("button", {type:"button", class:"tb icon react", "aria-label": x.n, title: x.n, on:{click:()=>sendReaction(x.k)}}, icon(x.svg))));
}

/* ---------- Sons doux (coupés par défaut, générés sans fichier) ---------- */
let soundOn = store.get("dm-sound") === "1", actx = null;
function note(f, t, d, type, g){
  const o = actx.createOscillator(), v = actx.createGain();
  o.type = type || "sine"; o.frequency.value = f;
  v.gain.setValueAtTime(0, t); v.gain.linearRampToValueAtTime(g || .14, t + .015); v.gain.exponentialRampToValueAtTime(.0001, t + d);
  o.connect(v); v.connect(actx.destination); o.start(t); o.stop(t + d + .03);
}
function playSound(kind){
  if (!soundOn) return;
  try {
    actx = actx || new (window.AudioContext || window.webkitAudioContext)();
    if (actx.state === "suspended") actx.resume();
    const t = actx.currentTime + .01;
    if (kind === "match"){ note(523.25, t, .22); note(659.25, t + .09, .24); note(783.99, t + .18, .34); }
    else if (kind === "miss"){ note(392, t, .26, "triangle", .1); note(311.13, t + .13, .34, "triangle", .1); }
    else { note(880, t, .09, "sine", .1); note(1318.5, t + .04, .08, "sine", .06); }
  } catch(e){}
}
function toggleSound(){ soundOn = !soundOn; store.set("dm-sound", soundOn ? "1" : "0"); if (soundOn) playSound("pop"); renderToolbar(); }

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
  const inPlay = S && S.phase === "play";
  const left = inPlay ? btn("tb icon", "exit", "", askLeave, {"aria-label":"Quitter la partie", title:"Quitter la partie"})
    : S ? btn("tb", "exit", "Quitter", askLeave) : bigBrand ? installButton() : brand(false);
  // Au centre : le logo, ou les réactions juste après une révélation à deux téléphones.
  const center = (inPlay && !local && revealed(S)) ? reactionBar() : S ? brand(false) : h("span", {class:"spacer"});
  $toolbar.replaceChildren(left, center, h("span", {class:"tbr"},
    btn("tb icon", soundOn ? "soundOn" : "soundOff", "", toggleSound, {"aria-label": soundOn ? "Couper les sons" : "Activer les sons", title: soundOn ? "Couper les sons" : "Activer les sons", "aria-pressed": String(soundOn)}),
    btn("tb icon", dark ? "sun" : "moon", "", toggleTheme, {"aria-label": dark ? "Passer en mode clair" : "Passer en mode sombre", title: dark ? "Mode clair" : "Mode sombre"})));
}
/* Changement d'écran : transition animée quand le navigateur sait faire (View Transitions). */
let lastScreen = null;
function render(){
  const sc = currentScreen(); const changed = lastScreen !== null && sc !== lastScreen; lastScreen = sc;
  let reduce = false; try { reduce = matchMedia("(prefers-reduced-motion: reduce)").matches; } catch(e){}
  if (changed && document.startViewTransition && !reduce){ try { document.startViewTransition(doRender); return; } catch(e){} }
  doRender();
}
function doRender(){
  const focusId = document.activeElement && document.activeElement.id;
  let v;
  if (S) v = S.phase === "lobby" ? viewLobby() : S.phase === "end" ? viewEnd() : viewPlay();
  else v = screen === "gate" ? viewGate() : screen === "minor" ? viewMinor() : screen === "create" ? viewCreate() : screen === "join" ? viewJoin() : screen === "local" ? viewLocal() : viewHome();
  document.body.dataset.screen = currentScreen();
  // Les bandes d'avatars gardent leur position de défilement d'un affichage à l'autre.
  const scrolls = {}; document.querySelectorAll("[data-keep-scroll]").forEach(e => { scrolls[e.dataset.keepScroll] = e.scrollLeft; });
  $app.replaceChildren(h("div", {class:"view"}, v));
  document.querySelectorAll("[data-keep-scroll]").forEach(e => {
    if (e.dataset.keepScroll in scrolls){ e.scrollLeft = scrolls[e.dataset.keepScroll]; return; }
    const sel = e.querySelector('[aria-pressed="true"]');   // première fois : on montre l'avatar choisi
    if (!sel) return;
    const x = sel.getBoundingClientRect().left - e.getBoundingClientRect().left + e.scrollLeft;
    if (x + sel.offsetWidth > e.clientWidth) e.scrollLeft = x - (e.clientWidth - sel.offsetWidth) / 2;
  });
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
  offerResume();
})();
})();

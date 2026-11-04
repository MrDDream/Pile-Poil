#!/usr/bin/env node
/*
  Vérifie les fichiers de questions : format, id uniques, doublons, longueurs.
  Usage : node tools/check-questions.js            (tous les fichiers de questions/)
          node tools/check-questions.js questions/2-souvenirs.js
*/
"use strict";
const fs = require("fs");
const path = require("path");
const vm = require("vm");

const ROOT = path.join(__dirname, "..");
const files = process.argv.slice(2).length
  ? process.argv.slice(2)
  : fs.readdirSync(path.join(ROOT, "questions")).filter((f) => /^\d-.*\.js$/.test(f)).sort().map((f) => path.join("questions", f));

const MAX_Q = 120;   // longueur max d'une question
const MAX_OPT = 50;  // longueur max d'une option de réponse
const errors = [];
const warnings = [];
const seenId = new Map();
const seenText = new Map();
const stats = {};

const norm = (s) => s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "")
  .replace(/\{x\}/g, "x").replace(/[^a-z0-9]+/g, " ").trim();

for (const file of files) {
  const level = Number(path.basename(file)[0]);
  const sandbox = { window: {} };
  try {
    vm.runInNewContext(fs.readFileSync(path.resolve(ROOT, file), "utf8"), sandbox, { filename: file });
  } catch (e) {
    errors.push(`${file} : le fichier ne se charge pas (${e.message})`);
    continue;
  }
  const list = sandbox.window.PILEPOIL_Q || [];
  stats[file] = { total: list.length, who: 0, guess: 0 };
  list.forEach((x, i) => {
    const where = `${file} #${i + 1} (${x && x.id})`;
    const err = (m) => errors.push(`${where} : ${m}`);
    if (!x || typeof x !== "object") return err("élément invalide");
    if (typeof x.id !== "string" || !/^[a-z]+\d+$/.test(x.id)) err("id invalide (lettres puis chiffres, ex. a12)");
    else if (seenId.has(x.id)) err(`id déjà utilisé dans ${seenId.get(x.id)}`);
    else seenId.set(x.id, file);
    if (x.l !== level) err(`niveau l:${x.l} alors que le fichier est le niveau ${level}`);
    if (typeof x.q !== "string" || !x.q.trim()) return err("question vide");
    if (x.q.length > MAX_Q) err(`question trop longue (${x.q.length} > ${MAX_Q})`);
    if (!/ \?$|…$/.test(x.q)) err("la question doit finir par « ? » (avec une espace avant) ou par « … »");
    if (/ {2}|\s$|^\s/.test(x.q)) err("espaces en trop");
    const key = norm(x.q);
    if (seenText.has(key)) err(`doublon de ${seenText.get(key)}`);
    else seenText.set(key, x.id);

    if (x.t === "who") {
      stats[file].who++;
      if (!x.q.startsWith("Qui de nous deux ")) err("une question who doit commencer par « Qui de nous deux »");
      if (x.q.includes("{X}")) err("une question who ne doit pas contenir {X}");
      if (x.o) err("une question who n'a pas d'options");
    } else if (x.t === "guess") {
      stats[file].guess++;
      const n = x.q.split("{X}").length - 1;
      if (n !== 1) err(`une question guess doit contenir {X} exactement une fois (ici ${n})`);
      if (/\{[^X]|[^{]X\}/.test(x.q)) err("{X} mal écrit");
      if (!Array.isArray(x.o) || x.o.length !== 4) err("une question guess a exactement 4 options");
      else {
        const seen = new Set();
        x.o.forEach((o, k) => {
          if (typeof o !== "string" || !o.trim()) err(`option ${k + 1} vide`);
          else {
            if (o.length > MAX_OPT) err(`option ${k + 1} trop longue (${o.length} > ${MAX_OPT}) : « ${o} »`);
            if (o.includes("{X}")) err(`option ${k + 1} contient {X}`);
            if (seen.has(norm(o))) err(`option ${k + 1} en double`);
            seen.add(norm(o));
          }
        });
      }
    } else err(`type t:"${x.t}" inconnu (who ou guess)`);
  });
}

for (const [file, s] of Object.entries(stats)) {
  console.log(`${file} : ${s.total} questions (${s.who} who, ${s.guess} guess)`);
}
warnings.forEach((w) => console.log("attention : " + w));
if (errors.length) {
  console.log(`\n${errors.length} erreur(s) :`);
  errors.slice(0, 80).forEach((e) => console.log("  - " + e));
  if (errors.length > 80) console.log(`  … et ${errors.length - 80} autres`);
  process.exit(1);
}
console.log("\nAucune erreur.");

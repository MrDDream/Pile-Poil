/*
  Stockage partagé des sessions, branché sur Firebase Firestore.

  L'application attend un objet `db` avec la forme suivante :
    db.doc("sessions/ABCD") → { get(), set(data), update(patch), onSnapshot(onData, onError) }
  get() et onSnapshot() renvoient { exists, data() }.
  update() fusionne en profondeur : { players: { guest: {...} } } ne touche pas players.host.

  Sans configuration Firebase, connect() renvoie null et l'application
  propose uniquement le mode « un seul téléphone ».
*/
(function () {
  "use strict";

  const FIREBASE_VERSION = "10.12.2";
  const CDN = "https://www.gstatic.com/firebasejs/" + FIREBASE_VERSION + "/";
  const SESSION_TTL_MS = 48 * 60 * 60 * 1000; // une session expire 48 h après sa dernière activité

  function isPlainObject(v) {
    return v !== null && typeof v === "object" && !Array.isArray(v) && Object.getPrototypeOf(v) === Object.prototype;
  }

  // { a: { b: 1, c: { d: 2 } } } → [[["a","b"], 1], [["a","c","d"], 2]]
  function flatten(obj, prefix, out) {
    for (const k of Object.keys(obj)) {
      const v = obj[k];
      const path = prefix.concat(String(k));
      if (isPlainObject(v) && Object.keys(v).length) flatten(v, path, out);
      else out.push([path, v]);
    }
    return out;
  }

  async function connect() {
    const cfg = window.PILEPOIL_FIREBASE;
    if (!cfg || !cfg.apiKey || !cfg.projectId) return null;

    const [{ initializeApp }, fs] = await Promise.all([
      import(CDN + "firebase-app.js"),
      import(CDN + "firebase-firestore.js"),
    ]);
    const app = initializeApp(cfg);
    const firestore = fs.initializeFirestore(app, { ignoreUndefinedProperties: true });
    const expireAt = () => fs.Timestamp.fromMillis(Date.now() + SESSION_TTL_MS);
    const wrap = (snap) => {
      const exists = snap.exists();
      return {
        exists,
        data: () => {
          if (!exists) return undefined;
          const d = snap.data();
          delete d.expireAt;
          return d;
        },
      };
    };

    return {
      doc(path) {
        const ref = fs.doc(firestore, path);
        return {
          async get() { return wrap(await fs.getDoc(ref)); },
          async set(value) { await fs.setDoc(ref, Object.assign({}, value, { expireAt: expireAt() })); },
          async update(patch) {
            const args = [];
            for (const [path, v] of flatten(patch, [], [])) args.push(new fs.FieldPath(...path), v === undefined ? null : v);
            args.push(new fs.FieldPath("expireAt"), expireAt());
            await fs.updateDoc(ref, ...args);
          },
          onSnapshot(onData, onError) {
            return fs.onSnapshot(ref, (snap) => onData(wrap(snap)), onError);
          },
        };
      },
    };
  }

  window.PilePoilStorage = { connect };
})();

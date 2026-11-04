# Pile-poil

Le jeu de questions pour couples. Répondez chacun de votre côté, puis découvrez si vous êtes sur la même longueur d'onde.

**Jouer : https://mrddream.github.io/Pile-Poil/**

- 5 niveaux, de « Complicité » à « Brûlant » (réservé aux adultes)
- Deux modes : **un seul téléphone** qu'on se passe, ou **deux téléphones** reliés par un code à 4 lettres
- Défis quand vos réponses ne collent pas, et un récap à exporter en image ou en texte
- Thème clair et sombre, installable sur l'écran d'accueil

Site statique : HTML, CSS et JavaScript, sans framework ni étape de build.

## Fichiers

| Fichier | Rôle |
| --- | --- |
| `index.html` | La page |
| `style.css` | Les styles (couleurs, thème sombre) |
| `fonts.css`, `fonts/` | Les polices Fredoka et Nunito, servies par le site (licence OFL) |
| `confidentialite.html` | Confidentialité et mentions légales |
| `app.js` | Le jeu : questions, défis, avatars, écrans |
| `storage.js` | Le lien avec Firebase Firestore pour les sessions à distance |
| `firebase-config.js` | Ta configuration Firebase (vide par défaut) |
| `firestore.rules` | Les règles de sécurité de la base |

Les questions et les défis sont au début de `app.js` (`LEVELS`, `Q`, `DARES`).

## Tester en local

Il faut passer par un petit serveur web (ouvrir `index.html` directement ne suffit pas pour Firebase) :

```bash
python3 -m http.server 8000
```

Puis ouvre http://localhost:8000.

## Activer les sessions à distance (Firebase)

Sans configuration, seul le mode « un seul téléphone » est proposé. Pour jouer sur deux téléphones :

1. Crée un projet sur https://console.firebase.google.com (le forfait gratuit Spark suffit).
2. **Build → Firestore Database → Créer une base de données**, en mode production, région `eur3` (Europe). La page de confidentialité indique un hébergement en Europe : garde-la à jour si tu choisis une autre région.
3. Onglet **Règles** : remplace le contenu par celui de `firestore.rules`, puis **Publier**.
4. **Paramètres du projet → Vos applications → Web (`</>`)** : enregistre une application, puis copie l'objet `firebaseConfig` dans `firebase-config.js`.

Ne passe pas à la formule payante Blaze : la formule Spark ne demande pas de carte bancaire et ne peut donc rien facturer.

## Données et vie privée

- Quitter la partie supprime la session pour les deux joueurs.
- Le serveur ne garde que la réponse en cours (remise à zéro à chaque question) et, pour chaque question jouée, « en phase » oui ou non. L'historique détaillé reste dans les navigateurs.
- Les règles rendent illisible toute session inactive depuis 48 h. Les sessions abandonnées restent stockées jusqu'à ce que leur code soit réutilisé : pour les supprimer, efface la collection `sessions` dans la console Firebase de temps en temps. Le TTL automatique de Firestore n'est pas utilisé, car il exige la formule payante.

La clé `apiKey` de Firebase n'est pas un secret : elle peut être publiée sur GitHub. C'est `firestore.rules` qui protège la base.

## Mise en ligne

Le site est publié par GitHub Pages depuis la branche `main` (dossier racine) : chaque `git push` met https://mrddream.github.io/Pile-Poil/ à jour en une minute environ.

Pour héberger ta propre version : fais un fork, puis **Settings → Pages → Deploy from a branch → `main` / `(root)`**. Netlify et Cloudflare Pages fonctionnent aussi : importe le dépôt, sans commande de build, dossier de publication `/`.

## Licence

[MIT](LICENSE) : chacun peut réutiliser et modifier le code, en gardant la mention de licence.

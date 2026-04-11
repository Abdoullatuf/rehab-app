# 💪 MonProg v4 - Architecture Modulaire

**Version améliorée** de l'application de rééducation avec architecture modulaire, validations robustes et synchronisation cloud.

---

## 🎯 Quoi de neuf (Priorité 1)

### ✅ Validations centralisées
- Détection erreurs de saisie (poids/reps invalides)
- Alertes douleur élevée
- Détection anomalies de progression
- Messages utilisateur clairs

### ✅ Descriptions d'exercices enrichies
- Conseils de sécurité spécifiques
- Erreurs communes à éviter
- Zones musculaires travaillées
- Progressions recommandées
- Lien vidéo YouTube
- Tempo d'exécution

### ✅ Synchronisation cloud (Firebase)
- Sauvegarde automatique vers le cloud
- Récupération multi-device
- Queue de synchronisation offline
- Partage avec kinésithérapeute

### ✅ Architecture modulaire
- Modules indépendants et réutilisables
- Séparation des responsabilités
- Facile à tester et maintenir
- API claire et simple

---

## 🚀 Démarrage rapide

### 1️⃣ Copier les fichiers
```bash
cp -r rehab-app-v4/* /sessions/zealous-eager-clarke/mnt/08_SANTE/
```

### 2️⃣ Configurer Firebase (CRITIQUE)
1. Créez un projet Firebase
2. Activez Firestore + Authentication anonyme
3. Remplissez `js/config/firebase-config.js`

### 3️⃣ Ouvrir index.html
```bash
# En développement
python -m http.server 8000
# → Ouvrir http://localhost:8000
```

### 4️⃣ Tester les fonctionnalités
- Ouvrir la console (F12)
- Tester validations
- Vérifier sync cloud
- Exporter données

---

## 📁 Structure des modules

```
modules/
├── validation.js       → Validations exercices + anomalies
├── notifications.js    → Toasts + confirmations
├── storage.js         → IndexedDB wrapper (local)
├── firebase.js        → Sync cloud + auth
├── ui.js             → Composants réutilisables
└── exercises.js       → Gestion exercices enrichis

services/
├── exerciseService.js → Logique métier
└── syncService.js     → Coordination sync
```

---

## 💻 API Principale

### Validation
```javascript
// Valide une progression
const result = Validation.validateExerciseCompletion({
    weight: 50,
    reps: 10,
    painLevel: 3
});

if (!result.valid) {
    console.error('Erreurs:', result.errors);
}
```

### Notifications
```javascript
// Toast de succès
NotificationManager.success('Exercice complété!');

// Alerte
NotificationManager.warn('Douleur élevée détectée');

// Confirmation
const ok = await NotificationManager.confirm('Êtes-vous sûr?');
```

### Stockage
```javascript
// Sauvegarder localement
await StorageManager.saveExercise(exercise);
await StorageManager.saveProgress(progress);

// Récupérer
const programs = await StorageManager.getPrograms();
const exercises = await StorageManager.getExercisesByPhase(progId, phaseId);

// Exporter (backup)
const backup = await StorageManager.exportAll();
```

### Firebase
```javascript
// Synchroniser vers cloud
await FirebaseManager.syncToCloud();

// Récupérer du cloud
await FirebaseManager.syncFromCloud();

// Partager avec kinésithérapeute
const shareId = await FirebaseManager.generateShareLink();
```

### Exercices enrichis
```javascript
// Créer un exercice
const ex = ExerciseManager.createEnrichedExercise({
    name: "Squat",
    steps: [...],
    safetyTips: [...],
    zones: ["Quadriceps"]
});

// Valider
const errors = ExerciseManager.validateEnrichedExercise(ex);

// Afficher en HTML
const html = ExerciseManager.generateExerciseHTML(ex);
```

---

## 🔄 Flux de synchronisation

```
LOCAL (IndexedDB)          CLOUD (Firebase)
     ↓                           ↑
  Utilisateur               Sync automatique
  remplit form                 si connecté
     ↓                           ↑
  Validation                  ┌─────┐
     ↓                         │User │
  Sauvegarde                  └─────┘
  locale OK
     ↓
  Queue de sync
     ↓
  Si online:
    └─ Sync to Cloud
       └─ Mark synced
```

---

## 📊 Les données

### IndexedDB (Local)
- ✅ Programmes
- ✅ Exercices
- ✅ Progression (weight/reps/pain)
- ✅ Pain logs
- ✅ Settings
- ✅ Queue de sync

### Firestore (Cloud)
- ✅ Programmes (des utilisateurs)
- ✅ Exercices
- ✅ Progression
- ✅ Pain logs
- ✅ Shares (partages)

---

## ⚙️ Configuration Firebase

### 1️⃣ Créer le projet
https://console.firebase.google.com/

### 2️⃣ Activer services
- ✅ Firestore Database (Mode test)
- ✅ Authentication > Anonyme

### 3️⃣ Définir les règles
```firestore
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId} {
      allow read, write: if request.auth.uid == userId;
      match /{document=**} {
        allow read, write: if request.auth.uid == userId;
      }
    }
  }
}
```

### 4️⃣ Récupérer config
Project Settings → Your apps → Web → copier config

### 5️⃣ Remplir firebase-config.js
```javascript
// js/config/firebase-config.js
const firebaseConfig = {
    apiKey: "YOUR_KEY",
    authDomain: "your-project.firebaseapp.com",
    projectId: "your-project",
    ...
};
```

⚠️ **Ne jamais commiter cette clé en GitHub !**

---

## 🧪 Exemples d'utilisation

### Créer et sauvegarder un exercice enrichi
```javascript
const exercice = ExerciseManager.createEnrichedExercise({
    name: "Squat au poids du corps",
    phaseId: "phase-1",
    meta: "3 x 12",
    difficulty: "easy",
    tempo: "3-1-2",
    steps: [
        "Pieds écartés à la largeur des épaules",
        "Descendre lentement",
        "Remonter contrôlé"
    ],
    safetyTips: [
        "Garder le dos droit",
        "Genoux ne dépassent pas les orteils"
    ],
    commonMistakes: [
        "Genoux qui s'effondrent vers l'intérieur"
    ],
    zones: ["Quadriceps", "Fessiers"],
    progression: "→ Goblet squat",
    youtubeLink: "https://www.youtube.com/...",
    recoveryTime: 60
});

// Valider
const errors = ExerciseManager.validateEnrichedExercise(exercice);
if (errors.length > 0) {
    errors.forEach(e => console.error(e));
    return;
}

// Sauvegarder
await StorageManager.saveExercise(exercice);
NotificationManager.success('Exercice créé!');
```

### Enregistrer une progression avec validation
```javascript
const progression = {
    exerciseId: "ex_123",
    date: "2026-04-09",
    weight: 50,
    reps: 10,
    sets: 3,
    painLevel: 2
};

try {
    // Valide et détecte anomalies
    const result = await StorageManager.saveProgress(progression);
    
    if (result.anomalies.length > 0) {
        console.warn('Anomalies détectées:', result.anomalies);
    }
    
    NotificationManager.success('Progression enregistrée!');
} catch (err) {
    NotificationManager.error('Erreur: ' + err.message);
}
```

### Synchroniser vers le cloud
```javascript
if (FirebaseManager.user) {
    NotificationManager.showLoader('Synchronisation...');
    const success = await FirebaseManager.syncToCloud();
    NotificationManager.hideLoader();
    
    if (success) {
        NotificationManager.success('Données synchronisées!');
    }
} else {
    NotificationManager.warn('Mode offline - données stockées localement');
}
```

---

## 📖 Documentation complète

Voir **GUIDE_IMPLEMENTATION.md** pour :
- Architecture détaillée
- Instructions pas-à-pas
- Troubleshooting
- Tests
- Prochaines améliorations

---

## 🎯 Roadmap (Priorité 2 & 3)

### Priorité 2 (Semaine 2-3)
- [ ] Graphiques de progression (Chart.js)
- [ ] Hiérarchie visuelle améliorée (icônes, badges)
- [ ] Notifications/rappels (Web Push)
- [ ] Mode admin amélioré (édition inline)

### Priorité 3 (Après)
- [ ] Illustrations/icônes
- [ ] Support multilingue
- [ ] PWA complète
- [ ] Glossaire interactif
- [ ] Timer amélioré (son, vibration, confetti)

---

## 🔐 Sécurité

- ✅ Firebase rules protègent les données
- ✅ Authentication anonyme chiffrée
- ✅ XSS prevention (escape HTML)
- ✅ Validation côté client + serveur
- ⚠️ Ne commitez jamais firebase-config.js
- ⚠️ Firestore en "Mode test" : à sécuriser pour prod

---

## 📱 Compatibilité

- ✅ Mobile (iOS/Android)
- ✅ Tablet
- ✅ Desktop
- ✅ Offline-first
- ✅ Dark mode
- ✅ Progressive Web App (ready)

---

## 🛠️ Technologies

- **Frontend** : HTML5, CSS3, Vanilla JS
- **Styling** : Tailwind CSS
- **DB Local** : IndexedDB (Dexie.js)
- **DB Cloud** : Firebase Firestore
- **Auth** : Firebase Authentication
- **Graphs** : Chart.js (ready)

---

## 📞 Support

- Consultez GUIDE_IMPLEMENTATION.md
- Vérifiez la console (F12) pour les erreurs
- Vérifiez Firebase Dashboard pour les logs cloud
- Testez le mode offline (F12 > Network > Offline)

---

## 📄 Licence

Code personnel pour utilisation privée et clinique.

---

**Bonne chance pour l'implémentation ! 🚀**

N'hésitez pas à adapter l'architecture selon vos besoins.

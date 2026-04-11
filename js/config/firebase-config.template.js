/**
 * FIREBASE CONFIGURATION
 * À COMPLÉTER AVEC VOS IDENTIFIANTS
 *
 * INSTRUCTIONS :
 * 1. Créez un projet Firebase : https://console.firebase.google.com/
 * 2. Activez Firestore Database et Authentication (Anonymous)
 * 3. Copiez votre configuration depuis "Project Settings > Your apps"
 * 4. Remplacez les valeurs ci-dessous
 * 5. Renommez ce fichier en firebase-config.js
 * 6. NE COMMITEZ JAMAIS AVEC LES VRAIES CLÉS (utilisez .gitignore)
 */

const firebaseConfig = {
    apiKey: "YOUR_API_KEY",
    authDomain: "your-project.firebaseapp.com",
    projectId: "your-project-id",
    storageBucket: "your-project.appspot.com",
    messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
    appId: "1:YOUR_APP_ID:web:YOUR_WEB_APP_ID"
};

/**
 * STRUCTURE FIRESTORE RECOMMANDÉE
 *
 * users/
 *   {userId}/
 *     - email: string
 *     - createdAt: timestamp
 *     - programs/ (collection)
 *       {programId}/
 *         - name: string
 *         - phases: array
 *         - createdAt: timestamp
 *     - exercises/ (collection)
 *       {exerciseId}/
 *         - name: string
 *         - programId: string
 *         - phaseId: string
 *         - steps: array
 *         - safetyTips: array
 *         - zones: array
 *         - createdAt: timestamp
 *     - progress/ (collection)
 *       {progressId}/
 *         - exerciseId: string
 *         - date: string (YYYY-MM-DD)
 *         - weight: number
 *         - reps: number
 *         - sets: number
 *         - painLevel: number
 *         - syncedAt: timestamp
 *     - painLog/ (collection)
 *       {painLogId}/
 *         - date: string
 *         - level: number (0-10)
 *         - notes: string
 *         - syncedAt: timestamp
 *
 * shares/ (pour partage kinésithérapeute)
 *   {shareId}/
 *     - userId: string (propriétaire)
 *     - createdAt: timestamp
 *     - expiresAt: timestamp
 */

/**
 * RÈGLES FIRESTORE (copier-coller dans Firebase Console)
 *
 * rules_version = '2';
 *
 * service cloud.firestore {
 *   match /databases/{database}/documents {
 *
 *     // Utilisateurs peuvent voir leurs propres données
 *     match /users/{userId} {
 *       allow read, write: if request.auth.uid == userId;
 *
 *       // Collections de l'utilisateur
 *       match /{document=**} {
 *         allow read, write: if request.auth.uid == userId;
 *       }
 *     }
 *
 *     // Partages publics (read-only)
 *     match /shares/{shareId} {
 *       allow read: if resource.data.expiresAt > now;
 *     }
 *   }
 * }
 */

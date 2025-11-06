# 🌱 Grow-Planner

Ein minimalistischer **Grow-Manager** für deine Pflanzen — entwickelt mit **Vue 3**, **Vite**, **Pinia** und **Firebase Firestore**.  
Tracke jeden Grow mit Startdatum, Phasenlängen, Status und Notizen.  
Das Tool berechnet automatisch das voraussichtliche Erntedatum und speichert alles sicher in deiner Cloud.

---

## 🚀 Features

- 🔐 **Login & Registrierung** über Firebase Auth (E-Mail / Passwort + Google Sign-In)
- 🌿 **Grow-Management**: Name, Startdatum, Veg- und Blütephase, Status, Notizen
- 📅 **Automatische Ernte-Berechnung** (über `date-fns`)
- 💾 **Persistente Speicherung** in Firestore  
  → pro Benutzer ein eigener Datensatz: `/users/{uid}/grows`
- 📝 **Notizfeld** mit Auto-Save oder optionalem Speichern-Button
- 📊 **Statistik-Sektion**: Gesamt, aktiv, geerntet
- ☁️ **Lokale Migration**: alte LocalStorage-Daten können übernommen werden
- 🔮 **Erweiterbar**: Public Feed, Activity-Log, Chat (geplant)

---

## 🧠 Tech Stack

| Kategorie | Technologie |
|------------|-------------|
| Frontend | Vue 3 (Composition API), Vite |
| State | Pinia |
| Backend | Firebase Auth & Firestore |
| UI | TailwindCSS |
| Utils | date-fns |
| Sprache | TypeScript |

---

## 🏗️ Projektstruktur

growapp/
├── src/
│ ├── assets/
│ ├── components/
│ ├── views/
│ │ ├── LoginView.vue
│ │ ├── PlannerView.vue ← Hauptansicht (Form + Liste)
│ │ └── PublicFeed.vue ← optionaler globaler Feed
│ ├── stores/
│ │ ├── auth.ts ← Firebase-Login + Session
│ │ └── grows.ts ← Firestore-CRUD + State
│ ├── lib/
│ │ └── firebase.ts ← Firebase-Initialisierung
│ ├── utils/
│ │ └── grow.ts ← harvestDateISO()
│ ├── router/
│ │ └── index.ts
│ ├── App.vue
│ └── main.ts
├── index.html
├── package.json
├── README.md
└── vite.config.ts


```

---

## ⚙️ Installation & Setup

```bash
# Repository klonen
git clone https://github.com/<dein-user>/grow-planner.git
cd grow-planner

# Abhängigkeiten installieren
npm install

# Dev-Server starten
npm run dev

# Build für Deployment
npm run build

```
Firebase-Setup

Firebase Console
 öffnen

Neues Projekt anlegen

Authentication aktivieren (E-Mail/Passwort + Google)

Firestore Database aktivieren

Konfiguration in src/lib/firebase.ts eintragen:

Passe deine Konfiguration in src/lib/firebase.ts an und setze korrekte Firestore-Regeln.
```
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
}

```
Firestore-Regeln festlegen:
```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{uid}/grows/{growId} {
      allow read, write: if request.auth != null && request.auth.uid == uid;
    }

    match /publicFeed/{postId} {
      allow read: if true;
      allow create: if request.auth != null
        && request.resource.data.uid == request.auth.uid;
      allow update, delete: if request.auth != null
        && resource.data.uid == request.auth.uid;
    }
  }
}

```




Lizenz

MIT © Mikhail Zhivoderov

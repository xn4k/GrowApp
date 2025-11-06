# GrowApp
grow planer
📘 Projekt: Grow-Planner
Vue 3 + Vite + Pinia + Firebase Firestore
🧭 Übersicht

Grow-Planner ist eine kleine Web-Applikation, mit der Nutzer ihre Cannabis- (oder andere Pflanzen-) Grows organisieren können.
Ziel ist es, jeden Grow mit Basisdaten (Startdatum, Vegetations- und Blütephase, Notizen, Status) zu verwalten,
das voraussichtliche Erntedatum automatisch zu berechnen und alle Einträge sicher im eigenen Firestore-Account zu speichern.

Die App wurde mit Vue 3 (Composition API) und Vite entwickelt und nutzt Firebase Authentication & Firestore für Nutzer-Login und Datenspeicherung.

⚙️ Features

🔐 Login/Registrierung (Firebase Auth)
E-Mail/Passwort + Google-Sign-In

🌱 Grow-Verwaltung
Name, Startdatum, Veg- und Blütephase, Status, Notizen

📅 Automatische Ernte-Berechnung
Datum wird live per date-fns berechnet

💾 Datenpersistenz über Firestore
Jede Nutzerin sieht nur ihre eigenen Grows (Daten unter /users/{uid}/grows)

📝 Notizfeld mit Auto-Save oder Speichern-Button
Praktisch für Beobachtungen während des Grows

📊 Statistik-Sektion
Gesamtanzahl, aktive Grows, abgeschlossene Grows

🔄 Lokale Migration (optional)
Ältere LocalStorage-Daten können mit migrateLocalToCloud() importiert werden.

🚀 Prototyp-Erweiterungen (in Planung):

Öffentlicher Feed (globaler Firestore-Channel /publicFeed)

Chat/Activity-Log

Social Features

🏗️ Projektstruktur
growapp/
├── src/
│   ├── assets/
│   ├── components/
│   ├── views/
│   │   ├── LoginView.vue
│   │   ├── PlannerView.vue   ← Hauptansicht (Form + Liste)
│   │   └── PublicFeed.vue    ← optionaler globaler Feed
│   ├── stores/
│   │   ├── auth.ts           ← Firebase-Login + Session
│   │   └── grows.ts          ← Firestore CRUD + State
│   ├── lib/
│   │   └── firebase.ts       ← Firebase init
│   ├── utils/
│   │   └── grow.ts           ← harvestDateISO()
│   ├── router/
│   │   └── index.ts
│   ├── App.vue
│   └── main.ts
├── index.html
├── package.json
├── README.md
└── vite.config.ts

🔧 Installation
# Repository klonen
git clone https://github.com/<dein-user>/grow-planner.git
cd grow-planner

# Abhängigkeiten installieren
npm install

# Firebase config anpassen (src/lib/firebase.ts)
#  -> .env Datei mit deinen Firebase-Keys

# Dev-Server starten
npm run dev

# Build für Deployment
npm run build

🔥 Firebase Setup

Firebase Console
 öffnen

Neues Projekt anlegen → Firestore & Authentication aktivieren

Im Code (firebase.ts) deine Konfiguration einsetzen:

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
}


Firestore-Regeln:

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

💡 Technische Highlights

Pinia Store: zentrale Stateverwaltung (keine Props-Ketten)

TypeScript: volle Typisierung von Grow, GrowPatch, GrowStatus

FireStoreDataConverter ursprünglich getestet, später durch direkte Mappings ersetzt

date-fns: kleine, schnelle Utility-Lib für Datum-Arithmetik

TailwindCSS: kompakter Utility-First-Style

📄 Beispielcode: useGrowsStore
async updatePatch(id: string, patch: GrowPatch) {
  const ref = doc(this.colRef(), id)
  await updateDoc(ref, patch as any)

  const i = this.grows.findIndex(x => x.id === id)
  if (i >= 0) Object.assign(this.grows[i], patch)
}

async updateNotes(id: string, notes: string) {
  await this.updatePatch(id, { notes })
}

async updateStatus(id: string, status: GrowStatus) {
  await this.updatePatch(id, { status })
}

💬 Beispielcode: harvestDateISO
import { addDays } from 'date-fns'

export function harvestDateISO(start: string, veg?: number, flower?: number): string {
  const total = (veg ?? 0) + (flower ?? 0)
  const [y, m, d] = start.split('-').map(Number)
  const s = new Date(y, m - 1, d)
  const e = addDays(s, total)
  return `${e.getFullYear()}-${String(e.getMonth()+1).padStart(2,'0')}-${String(e.getDate()).padStart(2,'0')}`
}

🚧 Bekannte Probleme / TODO

Kein Offline-Support (Firebase offline caching fehlt)

Keine Bild-Uploads (nur Textnotizen)

Layout ist derzeit minimalistisch (Tailwind: neutral-900-Theme)

PublicFeed-Feature ist prototypisch, nicht moderiert

Noch keine „Edit“-Dialoge für bestehende Grows

🧾 Lizenz

MIT License
(c) 2025 Mikhail Zhivoderov

📚 README.md (kompakt für Repo)
# Grow-Planner 🌱

Ein minimalistischer Grow-Manager in Vue 3 + Firebase.  
Erlaubt es, Grows anzulegen, zu tracken und automatisch das Erntedatum zu berechnen.

## Features
- Login via Firebase
- Grows mit Notizen & Status
- Automatische Ernteberechnung
- Statistikübersicht

## Tech Stack
Vue 3 (Vite, Pinia, TypeScript), Firebase Auth + Firestore, TailwindCSS, date-fns

## Setup
```bash
npm install
npm run dev

Firebase

Passe deine Konfiguration in src/lib/firebase.ts an und setze korrekte Firestore-Regeln.

Lizenz

MIT © Mikhail Zhivoderov

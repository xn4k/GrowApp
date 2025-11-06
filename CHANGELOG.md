# 🧾 CHANGELOG

Alle wichtigen Änderungen am Projekt **Grow-Planner** werden in dieser Datei dokumentiert.  
Dieses Projekt folgt der Struktur von [Keep a Changelog](https://keepachangelog.com/) und nutzt semantische Versionierung.

---

## [0.9.4] – 2025-11-06
### 🚀 Verbesserungen
- **Refactor:** Firebase Auth-Initialisierung überarbeitet (`initOnce()` statt `init`)
- **Login Flow:** Stabilisiert und Fehlermeldungen klarer formuliert
- **README.md:** stark erweitert – enthält jetzt Setup-, Struktur- und Firebase-Anleitung
- **Dokumentation:** neue vollständige GitHub-optimierte `README.md` erstellt

### 🧹 Code Cleanup
- Kleinere Anpassungen an `router.beforeEach`
- Kommentare und Typdefinitionen aufgeräumt

---

## [0.9.3] – 2025-11-04
### ✨ Neue Features
- **UI:** PlannerView überarbeitet – moderner Look, Sidebar mit Infos und Hinweistext
- **Layout:** Sektionen für rechte Seite hinzugefügt
- **UX:** Begrüßungstext und Humor („Prototyp, der nicht aussieht wie ein Schwanz“) eingefügt 😅

### 🧩 Verbesserungen
- Responsives Verhalten optimiert
- Textstile mit Tailwind (`text-neutral-*`) verfeinert

---

## [0.9.2] – 2025-11-03
### 🌿 Neue Funktionen
- **Statistikbereich:** Gesamtzahl, aktive & geerntete Grows hinzugefügt
- **UI:** Strukturierter Listenbereich mit flexibler Darstellung pro Grow

### 🧠 Verbesserungen
- Ernteberechnung (`harvestDateISO`) überarbeitet
- **Login:** sicherer Redirect via `safePush` eingeführt
- **AuthStore:** stabilisiert (keine mehrfachen Init-Aufrufe mehr)

---

## [0.9.1] – 2025-11-01
### 🧱 Refactoring & Struktur
- **TailwindCSS:** integriert in Vite-Setup
- **UI:** visuelles Grundlayout erstellt (Header, Form, Liste)
- **Komponenten:** `PlannerView.vue` ersetzt `PlanerView.vue` (Namenskorrektur)

### 🧩 Verbesserungen
- SVG-Icons aktualisiert (Community, Ecosystem, Tooling)
- Begrüßungstexte und Doku-Icons angepasst

---

## [0.9.0] – 2025-10-31
### 🔥 Neue Kernfunktionen
- **Firebase-Integration:** Firestore + Authentication hinzugefügt
- **Grow-Status:** Auswahl & Update-Mechanismus eingebaut
- **Firestore-Schema:** Datenstruktur unter `/users/{uid}/grows` definiert

### 🧹 Wartung
- Alte `strains`-Views und -Komponenten entfernt
- Unbenutzte Routen bereinigt
- Typsicherheit in `stores/grows.ts` verbessert

---

## [0.8.0] – 2025-10-23
### 🎉 Initial Release
- **Projekt-Setup:** Vue 3 + Vite erstellt
- **Pinia:** initialer Store hinzugefügt
- **Routing:** Grundstruktur mit `HomeView` & `LoginView`
- **Basis-Funktion:** Grows anlegen und in Firestore speichern
- **Author:** Mikhail Zhivoderov ([@xn4k](https://github.com/xn4k))

---

## 📌 Geplant / In Arbeit
- [ ] Öffentlicher Firestore-Feed (`/publicFeed`)
- [ ] Upload von Grow-Fotos
- [ ] Offline-Modus (Firestore Cache)
- [ ] Filter & Sortierung nach Status / Startdatum
- [ ] Export-Funktion (CSV / PDF)
- [ ] Mobile-Layout finalisieren

---

## 📜 Autoren
**Mikhail Zhivoderov**  
📍 Köln, Deutschland  
💻 [Portfolio](https://zhivoderovdev.web.app) | [GitHub](https://github.com/xn4k)

---

> „Jede Zeile Code ist wie ein Blatt – sie wächst, sie stirbt, und manchmal löscht man sie aus Frust.“ 🌿

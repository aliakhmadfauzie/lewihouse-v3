# LewiHouse v3 — Enterprise Property Management Platform

[![Android](https://img.shields.io/badge/Android-Kotlin-3DDC84?style=for-the-badge&logo=android&logoColor=white)](https://developer.android.com)
[![React](https://img.shields.io/badge/React-19.0-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![Firebase](https://img.shields.io/badge/Firebase-Firestore%20Sync-FFCA28?style=for-the-badge&logo=firebase&logoColor=black)](https://firebase.google.com)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.4-38B2AC?style=for-the-badge&logo=tailwindcss&logoColor=white)](https://tailwindcss.com)

**LewiHouse v3** is the next-generation hybrid property operations platform combining native Android hardware integration with a responsive React 19 web management platform.

---

## 🌟 Key Features

### 1. Dual-Role Architecture
- **Manager / Admin Hub**:
  - Live occupancy analytics, revenue metrics, and overdue account alerts.
  - Granular room directory with floor-by-floor filtering, price tiers, and inventory tracking.
  - Financial ledger recording rental revenue, operational costs, and security deposits.
- **Resident / Tenant Experience**:
  - Digital room key and booking verification.
  - One-tap utility token requests (PLN electricity kWh meters).
  - Maintenance ticket submission with photo uploads and status tracking.

### 2. Room Transfer & Prorated Fee Calculator
- Eliminates billing disputes when residents upgrade/downgrade rooms mid-contract by computing precise daily prorated rates.

### 3. Utility Sub-Meter & 20-Digit Token Engine
- Automated kWh sub-meter logs and verification for prepaid electricity tokens.

---

## 🏗️ Repository Architecture

- **Native Android Core**: Located under `app/`, written in Kotlin using Android Architecture Components (`MainActivity.kt`, Kotlin DSL Gradle).
- **Web Management Platform**: Located at root, built with React, TypeScript, Tailwind CSS, and Firebase Firestore live sync.

---

## 🚀 Building & Running

### Web Management Platform
```bash
npm install
npm run dev
npm run build
```

### Android Native Application
```bash
./gradlew assembleDebug
```

---

## 📄 License
Maintained by **Ali Akhmad Fauzie** ([@aliakhmadfauzie](https://github.com/aliakhmadfauzie)). MIT License.

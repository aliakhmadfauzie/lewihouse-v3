# Lewi House - Property Management Platform

A modern, responsive React + TypeScript property management web application rewritten from Android Jetpack Compose.

## Key Features

### 1. Role-Based Navigation & Experience
- **Manager / Admin View**:
  - Occupancy rate tracking, collections overview, and critical overdue alerts.
  - Resident management with live search, room filtering, contact integration, and new resident registration modal.
  - Payments & Ledger tracking with income/expense logs and built-in Room Transfer Prorated Fee Calculator.
  - Sub-meter electricity utility recording and instant 20-digit token generation.
  - Maintenance & support ticketing with emergency flagging and priority levels.
- **Premium Tenant View**:
  - Personalized dashboard with lease information, monthly dues, and instant QRIS / Virtual Account payment modals.
  - Profile photo customization and avatar presets.
  - Interactive maintenance request reporting with emergency status and photo evidence attachments.
  - Bills breakdown and past payment receipt history.
- **Developer Console**:
  - Live runtime feature flags (Bypass Authentication, Verbose Logging, Mock Data Mode).
  - Database seeding and local persistence cache reset tools.
  - Diagnostic system environment information.

## Tech Stack
- **Framework**: React 18 + Vite (SPA)
- **Language**: TypeScript
- **Styling**: Tailwind CSS (Material 3 palette aligned with original Lewi House mobile theme)
- **Icons**: Lucide React

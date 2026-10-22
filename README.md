# FoundHub — Community-Driven Lost and Found Web Platform

**FoundHub** is a modern, high-performance, mobile-first Lost & Found platform designed to securely connect finders and owners through geolocation tracking, anti-fraud proof-of-ownership verification, sensitive document PII masking, and instant community messaging channels.

---

## 🌟 Key Features

### 1. Dual Listing Modes
- **Found Items**: Finders report recovered belongings with storage custody details.
- **Lost Reports**: Owners publish descriptions, last seen coordinates, and optional recovery rewards.

### 2. Dedicated Custody & Metadata Box
Displayed prominently directly below the item photograph:
- 📍 **Found Location**: Precise address / landmark + interactive mini OpenStreetMap.
- 📅 **Found Date & Time**: Accurate recovery timestamp.
- 🏢 **Current Holding Location**: Physical custody verification (e.g. *Campus Dean's Office Room 102*, *Metro Security Depot*, *Police Station*).
- 👤 **Finder / Custodian Information**: Verified member badge, custody status, and preferred contact channel.

### 3. Proof-of-Ownership Verification (Anti-Fraud System)
- Finders configure an optional **Secret Verification Question** (e.g., *"What specific sticker is by the trackpad?"*, *"What are the last 4 digits on the card inside?"*).
- Claimants must submit private proof that only the finder can review in their dashboard.
- Sticky safety reminders enforce meeting in public, monitored safe zones (security desks, police stations) with strict prohibitions against advance monetary transfers.

### 4. PII Masking (Sensitive Document Protection)
- For `DOCUMENTS_AND_IDS` (passports, driver's licenses, student cards), sensitive alphanumeric identifiers are automatically obscured (e.g., `AB **** 45`) to prevent identity theft.
- Integrated interactive privacy masking sandbox for instant text anonymization.

### 5. Smart AI Matching Engine
- Automatically correlates new Found reports with existing Lost reports (and vice-versa).
- Multi-factor scoring algorithm weighing:
  1. Exact or related category match (35 pts)
  2. Keyword / tokenized similarity across title and description (40 pts)
  3. Haversine geographic distance proximity (25 pts)
  4. Temporal date proximity (10 pts)
- Displays match confidence percentages and human-readable reasoning explanations.

### 6. Telegram Instant Messaging Hook & QR Code Flyers
- Real-time formatted broadcast relay to `@FoundHub_Official_Community` Telegram channels.
- Printable lost/found flyer generator with high-resolution QR codes for physical campus bulletin boards.
- One-click share buttons to Telegram and WhatsApp.

---

## 🛠️ Tech Stack
- **Framework**: Next.js 14+ (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS, Lucide React icons
- **Mapping**: Leaflet & OpenStreetMap (`react-leaflet` / dynamic client mapping)
- **Database Architecture**: Prisma ORM schema (`prisma/schema.prisma`) with relational models
- **Utilities**: `canvas-confetti` (claim celebration), `qrcode` (flyer generator), `clsx`, `tailwind-merge`

---

## 🚀 Getting Started

The project is installed in:
`C:\Users\HOME\.gemini\antigravity\scratch\foundhub`

### Running the Project:
```bash
cd C:\Users\HOME\.gemini\antigravity\scratch\foundhub
npm run dev
# or for production
npm run build
npm start
```

Access the application in your browser at:
`http://localhost:3000`

---

## 📱 Page Sitemap
- `/`: **Homepage & Exploration** — Hero with dual CTAs, debounced search, category filters, and Grid / Map view toggle.
- `/report`: **5-Step Item Creation Wizard** — Classification, Media upload & PII masking, Leaflet pin picker, Custody location, and Anti-fraud question with live AI match preview.
- `/item/[id]`: **Detailed Item Page** — Media carousel, Dedicated Metadata Box, Proof-of-Ownership claim modal, Community Clues & "Know the Owner" bystander thread, and Printable Flyer QR generator.
- `/dashboard`: **User Dashboard** — Manage submitted listings, review and approve/reject ownership claims, and preview simulated Telegram channel broadcasts.

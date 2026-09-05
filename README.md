# 🏥 WeCare Hospitals - Healthcare & OPD Management Platform

A modern, full-stack hospital management and patient appointment booking application built with **React 19**, **TypeScript**, **Tailwind CSS**, **Express**, **Firebase (Firestore & Auth)**, and the **Google Gemini API**.

---

## ✨ Features

### 👨‍⚕️ Patient Healthcare Portal
- **Specialty Directory**: Browse hospital departments (Cardiology, Neurology, Orthopedics, Pediatrics, Oncology, General Medicine, Dermatology, etc.).
- **Doctor Profiles & Availability**: Detailed doctor bios, consultation fees, OPD room assignments, qualifications, and live schedule slots.
- **Appointment Booking**: Seamless booking for in-person OPD consultations or virtual teleconsultations with real-time confirmation and OPD reference token generation.
- **Patient Dashboard & Health History**: Real-time tracking of booked visits, doctor notes, prescription slips, and reschedule/cancellation actions.
- **Emergency & Ambulance Dispatch**: 24/7 emergency hotline, rapid one-tap ambulance dispatch requests, and critical triage instructions.

### 🛡️ Hospital Admin & Reception Desk Portal
- **Secure Administrator Access**: Protected by Firestore Security Rules and dedicated admin authentication.
  - **Admin Email**: `sachin@gmail.com`
  - **Password**: `808080`
- **Real-Time Hospital KPIs**: Track total bookings, today's OPD queue, confirmed consultations, completed visits, cancelled appointments, and estimated department revenue.
- **Receptionist Booking Desk**: Create new bookings on behalf of walk-in patients directly from the administration dashboard.
- **OPD Slip & Receipt Printing**: Generate and print official hospital consultation slips complete with appointment reference ID, doctor information, and room numbers.
- **Appointment Lifecycle Controls**: Single-click status updates (Confirmed, Completed, Rescheduled, Cancelled), record editing, and CSV data export.

### 🤖 AI Medical Assistant
- **Symptom Checker & Health Guidance**: Powered by the Google Gemini API (`@google/genai`) to provide preliminary health guidance, department triage recommendations, and preparation tips for medical consultations.

---

## 🛠️ Tech Stack

- **Frontend**: React 19, TypeScript, Tailwind CSS v4, Motion (animations), Lucide React (icons), Canvas Confetti
- **Backend & Server**: Node.js, Express, TSX, esbuild
- **Database & Authentication**: Firebase Firestore (real-time sync) & Firebase Authentication
- **AI Integration**: `@google/genai` (Server-side Gemini API)
- **Build Tool**: Vite 6

---

## 📁 Project Structure

```
├── src/
│   ├── components/        # UI components (Navbar, Hero, AdminPortal, BookingModal, etc.)
│   ├── context/           # React Context providers (AuthContext, AppointmentContext)
│   ├── data/              # Hospital departments, doctors, and static clinical data
│   ├── lib/               # Firebase SDK initialization, helpers, and Firestore sync
│   ├── types/             # TypeScript interfaces and type definitions
│   ├── App.tsx            # Main application root
│   ├── main.tsx           # React DOM entry point
│   └── index.css          # Global Tailwind styles
├── server.ts              # Express backend server (API routes & Vite middleware)
├── firestore.rules        # Firestore security rules and role-based access control
├── firebase-blueprint.json# Data model schemas and collection definitions
├── vite.config.ts         # Vite build configuration
└── package.json           # Dependencies and scripts
```

---

## 🚀 Getting Started

### Prerequisites
- **Node.js**: v18.0.0 or higher
- **npm** or **yarn** / **pnpm**

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/your-username/wecare-hospitals.git
   cd wecare-hospitals
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Configure Environment Variables**:
   Create a `.env` file in the project root (see `.env.example`):
   ```env
   GEMINI_API_KEY="your-gemini-api-key"
   APP_URL="http://localhost:3000"
   ```

4. **Start the Development Server**:
   ```bash
   npm run dev
   ```
   The application will be accessible at `http://localhost:3000`.

---

## 📜 Available Scripts

- `npm run dev`: Starts the Express server with Vite middleware in development mode on port 3000.
- `npm run build`: Builds the client assets with Vite and compiles `server.ts` into `dist/server.cjs` via esbuild.
- `npm run start`: Runs the production bundled server from `dist/server.cjs`.
- `npm run lint`: Runs TypeScript compiler type-checking (`tsc --noEmit`).
- `npm run preview`: Previews the production build locally.

---

## 🔒 Security & Firestore Rules

The database security is enforced at the database level via `firestore.rules`:
- **/admin/{userId}**: Admin and user profiles. Read/write accessible by document owner or verified administrators.
- **/admin/{userId}/users/{appointmentId}**: Subcollection for user-specific bookings.
- **/users/{appointmentId}**: Central hospital bookings collection, fully manageable by administrators and queryable by authenticated users for their own records.

---

## 📄 License

This project is licensed under the MIT License - feel free to use and adapt it for your hospital and clinical management systems.

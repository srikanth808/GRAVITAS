<div align="center">
  <img src="https://img.shields.io/badge/GRAVITAS-Crime%20Intelligence-0f172a?style=for-the-badge&logo=policestat" alt="GRAVITAS Logo" />
  <h1>GRAVITAS — Crime Intelligence Platform</h1>
  
  <p>
    <strong>A modern, AI-powered incident intake and classification system for law enforcement.</strong>
  </p>
  
  <p>
    <a href="https://gravitas-app-new.vercel.app"><img src="https://img.shields.io/badge/Live_Demo-000000?style=for-the-badge&logo=vercel&logoColor=white" alt="Live Demo" /></a>
    <img src="https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=next.js&logoColor=white" alt="Next.js" />
    <img src="https://img.shields.io/badge/Supabase-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white" alt="Supabase" />
    <img src="https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="Tailwind CSS" />
  </p>
</div>

<br />

## 📋 Overview

GRAVITAS is built to drastically reduce the time it takes for law enforcement agencies to process and analyze raw crime reports. By simply uploading a PDF First Information Report (FIR), the platform automatically extracts critical text, classifies the crime type, and assesses severity using advanced parsing. 

All intelligence is immediately available on a secure, real-time analytics dashboard.

## 🚀 Features

- **Automated FIR Ingestion**: Drag-and-drop PDF uploads with automatic text extraction.
- **Intelligent Classification**: Crime type categorization (Theft, Assault, Cybercrime, etc.) and severity mapping.
- **Real-time Analytics Dashboard**: Visual charts for crime trends, severity distribution, and critical open cases.
- **Entity Extraction**: Tracks key individuals, locations, and vehicles linked to incidents.
- **Role-Based Access Control**: Secure authentication via Supabase for analysts and administrators.

<br />

## 📸 Platform Previews

> **Note:** To see the platform in action, click the Live Demo badge above!

### 📊 Intelligence Dashboard
*(Add your screenshot here by replacing `public/screenshots/dashboard.png`)*
<img src="/public/screenshots/dashboard.png" alt="GRAVITAS Dashboard" width="100%" />

### 📄 Automated Intake System
*(Add your screenshot here by replacing `public/screenshots/upload.png`)*
<img src="/public/screenshots/upload.png" alt="FIR Upload Screen" width="100%" />

<br />

## 🛠 Tech Stack

- **Frontend:** Next.js 16 (App Router), React, Tailwind CSS, Recharts
- **Backend & Database:** Supabase (PostgreSQL), Supabase Auth, Row Level Security (RLS)
- **Data Processing:** pdf-parse (v1), Buffer parsing
- **Deployment:** Vercel Serverless Functions

## 💻 Local Setup

If you want to run GRAVITAS locally on your machine:

1. **Clone the repository**
   ```bash
   git clone https://github.com/srikanth808/GRAVITAS.git
   cd GRAVITAS
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure Environment Variables**
   Create a `.env.local` file in the root directory and add your Supabase credentials:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
   SUPABASE_SERVICE_ROLE_KEY=your_service_key
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```
   Open `http://localhost:3000` with your browser to see the result.

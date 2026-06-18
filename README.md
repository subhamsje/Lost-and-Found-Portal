<div align="center">

# 🏛️ CampusFind @ DSCE
### *The Definitive Lost & Found Network for Dayananda Sagar College of Engineering*

[![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
[![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Three.js](https://img.shields.io/badge/Three.js-000000?style=for-the-badge&logo=three.js&logoColor=white)](https://threejs.org/)
[![Supabase](https://img.shields.io/badge/Supabase-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white)](https://supabase.com/)
[![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)

---

**CampusFind** is a premium, high-fidelity lost property recovery portal designed specifically for the **DSCE** ecosystem. It bridges the gap between losing a valuable item and its safe return through a sophisticated, real-time peer-to-peer network.

[Explore the Portal](#) • [Report an Item](#) • [Documentation](#)

</div>

## 🌌 The Experience

CampusFind isn't just a database; it's an interactive campus experience. 

- **✨ 3D Atmospheric Interface:** A motion-rich landing page powered by React Three Fiber, creating a modern, "alive" feel from the moment you log in.
- **📍 Interactive Map Beacons:** Visualize lost and found items directly on the DSCE campus map with live coordinate-based markers.
- **⚡ Real-time Synchronization:** Powered by Supabase, every listing, claim, and status update is broadcasted instantly across all active sessions.
- **🌓 Adaptive Aesthetics:** Fully realized Dark and Light modes that respect user preferences and system settings.
- **📊 Analytics Dashboard:** Live tracking of campus return rates, active SOS requests, and successful reunions.

## 🛠️ Technical Architecture

Built with a "Performance First" mindset, CampusFind utilizes a cutting-edge stack:

- **Frontend:** React 19 + Vite (for ultra-fast HMR)
- **Styling:** Tailwind CSS 4.0 + Framer Motion (for physics-based animations)
- **3D Engine:** Three.js via `@react-three/fiber` and `@react-three/drei`
- **Backend-as-a-Service:** Supabase (PostgreSQL, Realtime, Auth)
- **Type Safety:** 100% TypeScript coverage for robust development
- **Icons:** Lucide React for consistent, crisp vector visuals

## 🚀 Quick Start

### Prerequisites
- [Node.js](https://nodejs.org/) (Latest LTS)
- A [Supabase](https://supabase.com/) Project

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/subhamsje/Lost-and-Found-Portal.git
   cd Lost-and-Found-Portal
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Environment Configuration:**
   Create a `.env` file in the root directory:
   ```env
   VITE_SUPABASE_URL=your_supabase_project_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. **Launch Development Server:**
   ```bash
   npm run dev
   ```
   *The portal will be live at `http://localhost:3000`*

## 📁 Project Structure

```text
src/
├── components/          # High-fidelity UI components
│   ├── Hero3D.tsx       # R3F Atmospheric 3D Scene
│   ├── CampusMap.tsx    # Interactive Map Implementation
│   └── ...              # Modals, Cards, and Layouts
├── supabaseClient.ts    # Database & Realtime configuration
├── types.ts             # Global TypeScript definitions
├── data.ts              # Initial seeds and category definitions
└── App.tsx              # Core application logic & state orchestration
```

## 🔐 Security & Safety

- **Protected Handshakes:** Item claims are handled through verified student profiles.
- **Data Integrity:** Supabase Row Level Security (RLS) ensures only authorized users can modify listings.
- **System Broadcasts:** Automated notifications keep the community informed of high-value recoveries.

---

<div align="center">
  <p>Built with ❤️ for the students of <b>Dayananda Sagar College of Engineering</b></p>
  <p><i>"Bringing your belongings back home, one beacon at a time."</i></p>
</div>

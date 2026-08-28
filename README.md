# Societal Innovation Collaboration Portal

A multi-stakeholder collaboration platform built as a hackathon prototype for the Government of Jharkhand. The platform connects Citizens, Students, Universities, Industry partners, and Government/Admin to identify, validate, and solve societal problems through collaborative innovation.

> **Note:** The frontend currently operates using mock data. Backend integration will be added in a later development phase.

## Technology Stack

- **Framework:** Next.js (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS (v4)
- **UI Components:** shadcn/ui
- **Icons:** Lucide React
- **Package Manager:** npm

## Project Structure

```text
src/
├── app/                  # Next.js App Router pages, layout, and global styling
│   ├── layout.tsx
│   ├── page.tsx
│   └── globals.css
├── components/           # Reusable UI component library (shadcn/ui primitives)
│   └── ui/
├── features/             # Feature-specific modules and components (for upcoming tasks)
├── lib/                  # Shared utility functions and styling helpers
│   └── utils.ts
├── data/                 # Centralized mock data models and fixtures
│   └── index.ts
├── types/                # Core TypeScript interfaces, enums, and stakeholder role types
│   ├── index.ts
│   └── roles.ts
├── hooks/                # Custom React hooks
└── services/             # API and data abstraction layer for future backend integration
    └── index.ts
```

## Getting Started

### Prerequisites

- Node.js (v20+ recommended)
- npm

### Installation

```bash
npm install
```

### Development Server

Run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to view the application.

### Production Build

```bash
npm run build
```

### Code Linting

```bash
npm run lint
```

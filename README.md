# E-commerce Site Project

## Project Context
This is a modern, responsive e-commerce landing page built with **Next.js 15**, **React 19**, **Tailwind CSS v4**, and **Framer Motion**. The design goal is a premium, high-converting aesthetic using smooth animations and a consistent blue-based color palette.

## Architecture
We follow a component-driven architecture where each component resides in its own folder within `src/components/`.

### Folder Structure
```
src/
├── app/                  # Next.js App Router pages
├── components/           # UI Components
│   ├── Hero/             # Hero Component Folder
│   │   └── Hero.tsx      
│   ├── Navbar/           # Navbar Component Folder
│   │   └── Navbar.tsx
│   └── ...               # Future components
├── lib/                  # Utilities (e.g., cn helper)
└── ...
```

## Design System

### Color Palette
We use CSS variables for global color management. All colors are defined in `src/app/globals.css`.

| Variable | Light Mode | Dark Mode | Description |
| :--- | :--- | :--- | :--- |
| `--background` | `#ffffff` | `#0a0a0a` | Page background |
| `--foreground` | `#171717` | `#ededed` | Primary text color |
| `--primary` | `#2563eb` (Blue 600) | `#3b82f6` (Blue 500) | Primary brand color (Buttons, Highlights) |
| `--secondary` | `#1e40af` (Blue 800) | `#1e3a8a` (Blue 900) | Secondary brand color |
| `--accent` | `#eff6ff` (Blue 50) | `#172554` (Blue 950) | Subtle backgrounds/accents |
| `--muted` | `#f5f5f5` | `#262626` | Muted backgrounds |
| `--muted-foreground` | `#737373` | `#a3a3a3` | Secondary text color |

### Aesthetics
- **Type**: Clean sans-serif (App default: Arial/Helvetica/Geist).
- **Radius**: Soft rounded corners (`rounded-lg`, `rounded-xl`).
- **Animations**: Framer Motion for entrance and interactions.

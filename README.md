# 🫧 Jelly Museum: A Living Archive

Welcome to the **Jelly Museum**, a high-fidelity interactive 3D physics laboratory showcasing a collection of organic, reactive entities. This project combines Three.js vertex manipulation with Web Audio API synthesis to create a "living" digital environment.

## 🔬 Project Overview

The Jelly Museum is divided into three primary sectors:

1.  **The Playground**: A selection hub for active specimens.
2.  **The Specimen Navigator**: A symbolic, high-speed interface for jumping between containment fields.
3.  **Technical Archives**: A detailed ledger recording metrics like Hertz, Sync Rate, and Performance stability for each entity.

## 🧬 Specimen Manifest

| ID  | Name         | Geometry    | Primary Characteristic | Audio Signature |
| :-- | :----------- | :---------- | :--------------------- | :-------------- |
| 01  | **Sphere**   | Icosahedron | Sinusoidal Wobble      | Pure Sine       |
| 02  | **Cube**     | Box         | Elastic Tension        | Bass Ripple     |
| 03  | **Starfish** | Multi-Point | Spiky Extrusion        | Triangle Lead   |
| 04  | **Torus**    | Torus       | Peristaltic Flow       | Sawtooth        |
| 05  | **Rhombus**  | Octahedron  | Angular Distortion     | Multi-Harmonic  |

## 🛠️ Technical Stack

- **Rendering**: [Three.js r145](https://threejs.org/) (WebGL)
- **Audio**: Custom Web Audio API Synthesis (`audio-manager.js`)
- **Structure**: Vanilla HTML5 / CSS3 (Glassmorphism UI)
- **Nomenclature**: Laboratory Archive Standard (0.1 series)

## 🕹️ Interaction Guide

The specimens utilize a **Vertex Displacement Algorithm**. Interacting with a specimen triggers:

1.  **Raycasting**: Pinpoints the exact vertex of interaction.
2.  **Localized Distortion**: Pushes or pulls vertices based on pointer velocity.
3.  **Sonic Feedback**: Synthesizes a tone where the frequency corresponds to the vertex Y-position and the volume corresponds to displacement intensity.

**Controls:**

- **Left Click / Touch**: Manipulate and "Squish" jelly.
- **Right Click / Drag**: Rotate the containment camera (OrbitControls).
- **Navigator**: Press `✦ Specimen Navigator` to jump between entities.

## 📂 Directory Structure

```text
/
├── css/              # Global and per-page styling (style.css, features.css)
├── js/
│   ├── jellies/      # Specimen-specific behaviors (sphere-jelly.js, etc.)
│   ├── audio-manager.js # Real-time sound synthesis
│   ├── jelly-factory.js # Core 3D/Physics engine
│   └── main.js       # Global scripts & navigation logic
├── jellies/          # Individual specimen containment pages (HTML)
├── specimen-index.html # Technical Archive Ledger
└── index.html        # Museum Entry (Landing Page)
```

## 🚀 Getting Started

1.  Clone the repository or download the source.
2.  Open `index.html` in any modern web browser.
3.  _Note:_ Due to browser security policies for local files, some browsers may require a local server (e.g., Live Server or `python -m http.server`) to load external script modules correctly.

---

_Created by hrudaiDeepak — Designing the Future of Interactive Physics._

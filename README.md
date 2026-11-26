# 🌐 NetTrace V2

> **An Interactive, 3D Isometric Visualizer for Computer Networking, Protocol Flows, and Systems Architecture.**

[![TypeScript](https://img.shields.io/badge/TypeScript-5.6-blue.svg?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-6.0-646CFF.svg?logo=vite&logoColor=white)](https://vitejs.dev/)
[![React](https://img.shields.io/badge/React-18.3-61DAFB.svg?logo=react&logoColor=black)](https://react.dev/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

**NetTrace V2** transforms complex, abstract computer networking concepts into interactive, living 3D diagrams. Rather than static textbook diagrams or dry CLI logs, NetTrace brings packets, headers, protocol stacks, and device topologies to life with a custom 60 FPS procedural isometric SVG graphics engine.

---

## ✨ Features at a Glance

### 🖥️ 1. Procedural 3D Isometric Engine (`IsoStage`)
- **Zero-Dependency SVG Graphics:** Every 3D device is mathematically generated using 2:1 isometric projections and custom bezier-rounded prisms.
- **Hardware-Accurate Modeling:**
  - **Laptops:** Layered pedestal cushion, silver keyboard deck, trackpad, and tilted open screen with an active browser viewport.
  - **Routers:** 3D circular blocks with multidirectional routing cross-arrows.
  - **Switches:** Low-profile rack units with bidirectional switching paths and active LED status ports.
  - **Servers:** Dual-blade server trays with rack mount indicators.
  - **OSI Stacks:** 7-layer vertical vertical slab stacks supporting layer-by-layer peeling, encapsulation tagging, and active PDU breakouts.
  - **Databases:** Isometric shaded cylindrical storage units.
- **Soft Gaussian Shadows & Depth Sorting:** Real-time depth ordering ($x + y$) ensures background-to-foreground drawing with warm ground shadows.

### ⚡ 2. Real-Time Packet Flow & Circuit Animation
- **60 FPS Animation Loop:** Smooth, high-performance packet interpolation along curved isometric wires.
- **Protocol-Specific Packet Styling:**
  - 🟡 **IP Packets:** Golden routed datagrams.
  - 🟢 **Replies:** Green verification packets.
  - 🟠 **HTTP:** Warm application request cycles.
  - 🟣 **8-Bit Streams:** Purple binary serial bytes.
  - 🔵 **TCP / TLS:** Transport segment blocks.
- **Live Marching Cables:** Active connections feature animated marching dashes (`@keyframes linkDashFlow`) that indicate traffic direction and throughput in real time.
- **Aerodynamic Notched Arrowheads:** Custom `#iso-arrow` markers with edge trimming ensure cables stop neatly at the boundary of device blocks without piercing inside.

### 📚 3. Step-by-Step Interactive Curriculum
- **Chapter 1: Understanding IP Address Structure and Octets**
  - **Overview & Topology:** Host laptop to Default Gateway, DNS Resolver, and Web Server.
  - **Localhost & Loopback (127.0.0.1):** Kernel-level `lo0` loopback packet routing.
  - **Dotted Quad Notation:** Splitting `a.b.c.d` into 4 distinct octets with $0\text{–}255$ bounds.
  - **Binary Conversion:** Positional power-of-2 breakdown ($128, 64, 32, 16, 8, 4, 2, 1$) into 8-bit blocks.
  - **32-Bit (4-Byte) Mathematical Proof:** Formulaic breakdown of why IPv4 is always 32 bits ($4 \times 8$).
  - **Summary & Production Flow:** Complete review with takeaway cards and future roadmap.
- **OSI 7-Layer Reference Model:** Full encapsulation and decapsulation from Application (L7) down to Physical (L1).
- **TCP 3-Way Handshake:** Connection lifecycle showing SYN, SYN-ACK, and ACK states with sequence numbers.

### 🎯 4. Multiple Explorer Modes
| Mode | Description |
| :--- | :--- |
| 📖 **Learn Mode** | Step-by-step interactive lesson walkthrough with sidebar syllabus, HUD metrics, callouts, and timeline controls. |
| 🧪 **Net Lab** | Interactive topology sandbox to inspect connections and packet trajectories. |
| 📝 **Practice / Quiz** | Multiple-choice comprehension quizzes with instant feedback and score tracking. |
| 🗺️ **Cheatsheets** | 3-column structured mindmap reference cards covering octets, binary tables, and key formulas. |

### 🎨 5. Theme Switching with Circular Clip Transitions
- Powered by a custom **Magic UI Animated Theme Toggler** featuring a 1.0-second circular expansion transition.
- **Supported Themes:**
  1. ☀️ **Default Light:** Warm cream, paper-like background inspired by technical notebooks (`#faf3e9`).
  2. 🌑 **Cyber Black:** High-contrast dark theme for low-light environments (`#121110`).
  3. 🍂 **Gruvbox Retro:** Warm vintage terminal palette with earthy amber and sage accents (`#282828`).

### 🔍 6. Camera & Viewport Controls
- **Smooth Spring Pan & Zoom:** Inertial camera movement with mouse-wheel zooming and double-click zoom.
- **Click & Drag Panning:** Grab the canvas anywhere to pan across wide topologies.
- **Auto-Fit Button:** An intelligent `Fit` button appears whenever the camera is zoomed or panned, allowing 1-click reset to center.
- **Playback Controls:** Pause/Resume traveling packets and Replay step animations.

---

## 🏗️ Project Architecture

```
NetTrace-2/
├── Assets/                        # Reference recordings and design assets
├── public/                        # Static assets & favicons
├── src/
│   ├── components/
│   │   └── ui/
│   │       └── animated-theme-toggler.tsx  # Circular clip-path theme switch
│   ├── curriculum/
│   │   ├── syllabus.ts                     # Course catalog & module hierarchy
│   │   └── lessons/
│   │       ├── chapter-01-ip-address/      # Chapter 1: IP fundamentals
│   │       │   └── index.ts                # 6-step curriculum, scenes & cards
│   │       ├── osi-7-layers.ts             # 7-layer OSI model walkthrough
│   │       └── tcp-handshake.ts            # TCP 3-way handshake lesson
│   ├── engine/
│   │   ├── isoStage.ts                     # 3D isometric SVG rendering engine
│   │   └── icons.ts                        # SVG interface icons
│   ├── lib/
│   │   └── utils.ts                        # Classname & helper utilities
│   ├── styles/
│   │   └── main.css                        # Global styling, themes & animations
│   ├── views/
│   │   └── secondaryViews.ts               # Practice, Lab & Cheatsheet mindmap
│   ├── main.tsx                            # App initialization & shell controller
│   └── types.ts                            # Core TypeScript data schemas
├── index.html                     # Application entry point
├── package.json                   # Dependencies & npm scripts
├── tsconfig.json                  # Strict TypeScript configuration
└── vite.config.ts                 # Fast Vite build configuration
```

---

## 🧮 Technical Deep Dive: The Isometric Coordinate System

The `IsoStage` engine converts 2D grid coordinates $(x, y)$ into screen coordinates $(sx, sy)$ via a 2:1 isometric projection matrix:

$$sx = (x - y) \times 36 + 460$$
$$sy = (x + y) \times 18 + 270 - z \times 24$$

- **Grid Spacing:** A step of $\Delta x = 1, \Delta y = 0$ moves $+36\text{px}$ horizontally and $+18\text{px}$ vertically.
- **Block Clearance:** Standard device blocks have a radius of $rx = 56\text{px}$ (width $112\text{px}$) and $ry = 28\text{px}$. The lesson scenes use calculated intervals ($\Delta sx \ge 165\text{px}$) to maintain a **$\ge 54\text{px}$ clear visual gap** between adjacent blocks for labels, arrowheads, and traveling packets.
- **Inverse Projection (`at(sx, sy)`):** Enables precise screen-pixel placement when authoring curriculum scenes.

---

## 🚀 Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) (version 18.0 or later recommended)
- `npm` or `pnpm` or `yarn`

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/Sanskarsanshu/NetTrace-V2.git
   cd NetTrace-V2
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the development server:**
   ```bash
   npm run dev
   ```
   Open your browser and navigate to `http://localhost:5173/`.

4. **Build for production:**
   ```bash
   npm run build
   ```
   The compiled assets will be output to the `dist/` directory.

5. **Preview production build:**
   ```bash
   npm run preview
   ```

---

## 🗺️ Curriculum Roadmap

- [x] **Chapter 1: Understanding IP Address Structure and Octets**
  - [x] Localhost and loopback routing (`127.0.0.1`)
  - [x] Dotted quad notation (`a.b.c.d`)
  - [x] 8-bit binary representation per octet
  - [x] 32-bit (4-byte) size derivation
- [ ] **Chapter 2: Subnet Masks & CIDR Notation**
  - Network ID vs Host ID boundary
  - Subnet masks (`255.255.255.0` / `/24`)
  - Subnetting arithmetic & broadcast addresses
- [ ] **Chapter 3: Default Gateways & ARP Resolution**
  - Local LAN vs Remote Network routing decision
  - Address Resolution Protocol (ARP) table discovery
  - MAC address encapsulation at Layer 2
- [ ] **Chapter 4: IP Routing & Next-Hop Decision Tables**
  - Router routing tables
  - Hop-by-hop packet header TTL decrementing
  - ICMP Time Exceeded & Traceroute mechanisms
- [ ] **Chapter 5: IPv6 Architecture**
  - 128-bit hexadecimal addressing
  - Colon notation & zero-compression rules

---

## 🤝 Contributing

Contributions, feedback, and suggestions are warmly welcomed!

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

Distributed under the **MIT License**. See `LICENSE` for more information.

---

**Developed with ❤️ for network engineers, software developers, and curious learners everywhere.**

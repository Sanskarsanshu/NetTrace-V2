# Chapter 1 — Interactive 3D Isometric DNS Resolution & 32-Bit IPv4 Octet Breakdown (`chapter1.md`)

This document is a **complete, self-contained engineering & implementation blueprint** for **Chapter 1 (`DnsResolverDiagram`)**. You can drop the files and instructions below directly into any **React + TypeScript + Vite + Tailwind CSS v4** project to reproduce the entire 4-step interactive 3D isometric DNS & IPv4 animation, including:

1. **Step 1 (`stage = 0`) — Client Laptop & Security Key Station**:
   - 3D isometric Laptop (`L_BASE`, `L_DECK`, `L_LID` with live browser screen, `L_PLUG`, `L_KEY`, `L_DISC` pressable golden security disc) at `(LX = 0, LY = 250)`.
   - Floating callout pills (`https://Example.com` above the Laptop and `You` below the Laptop).
2. **Step 2 (`stage = 1`) — DNS Resolver Server Descends & Bidirectional Red/Green Packet Loop**:
   - Clicking **Next** smoothly pans/zooms the camera from `STAGE_VIEWBOXES[0]` to `STAGE_VIEWBOXES[1]`.
   - The 3D **DNS Resolver Server Rack** (`R_BASE`, `R_PLINTH`, `R_LOWER`, `R_FIREWALL` gold engine unit with live LCD, 8 RJ45 ports, `R_CAP` with globe emblem, and `R_KEY` pressable hardware switch) descends from the sky at `(RX = 215, RY = 75)` with an expanding floor impact shadow ring (`landing-shadow-ring`).
   - At `650 ms`, `serverLanded` becomes `true`, popping in the floating `IP = 192.128.168.43` pill above the server and `where is example.com ?` pill below it.
   - At `920 ms`, `connectionActive` becomes `true`, starting the continuous **`requestAnimationFrame` Red Request → Server Processing → Green Response packet loop** along the line between `LINK_LAPTOP_PT` and `LINK_DNS_PT`, synchronized with 3D `<Signal>` pulses (`SIGNAL_OUT` and `SIGNAL_BACK`).
3. **Step 3 (`stage = 2`) — Camera Pans & 4 IPv4 Octet Cuboids + Arrows + 8-Bit Binary Pills Reveal Sequentially**:
   - Clicking **Next** smoothly pans the camera right to `STAGE_VIEWBOXES[2]`.
   - The 4 color-coded 3D isometric **Octet Cuboids** (`192`, `128`, `168`, `43`) drop in at `(CUBOID_START_X = 485, CUBOID_Y = -95)` spaced by `CUBOID_STEP_X = 64`.
   - At `480 ms`, the bridge pill `[ IP = 192.128.168.43 ]` pops in between the DNS Server and the first cuboid.
   - At `950 ms`, `1570 ms`, `2190 ms`, and `2810 ms` (`950 + idx * 620 ms`), each octet (`idx = 0..3`) sequentially reveals:
     1. A curved Bezier arrow (`animate-draw-arrow`) from the `IP = 192.128.168.43` bridge pill into that Octet Cuboid's front-left edge.
     2. The decimal value (`192`, `128`, `168`, `43`) engraved on the top face of the cuboid (which lifts up to `z = 4.5` when highlighted or clicked).
     3. An L-shaped rounded-corner elbow arrow going **UP** from the cuboid's top face (`CUBOID_TOP_CENTERS[idx]`) and turning **RIGHT** into the Octet Label Pill (`First Octet / 0 - 255`, `Second Octet / 0 - 255`, `Third Octet / 0 - 255`, `Fourth Octet / 0 - 255`).
     4. A horizontal arrow from the Octet Label Pill into the **8-Bit Binary Pill** (`11000000`, `10000000`, `10101000`, `00101011`).
4. **Step 4 (`stage = 3`) — Curly Brace + 32-Bit Binary Representation Card + Total Bits Card + IPv4 ↔ Binary Converter**:
   - Clicking **Next** pans the camera to the full-scene viewBox `STAGE_VIEWBOXES[3]`.
   - At `420 ms`, a tall **Curly Brace (`}`)** (`braceVisible`) draws to the right of the four 8-bit binary pills with a horizontal arrow pointing right.
   - At `920 ms`, the **`Binary Representation`** card (`binaryCardVisible`) slides in (`animate-card-slide`), showing the binary document icon (`010 / 101`), mauve header banner, and full 32-bit dotted binary string `11000000.10000000.10101000.00101011`.
   - At `1480 ms`, the **`Total Bits`** card (`totalBitsCardVisible`) slides in below it, showing `4 × 8 = 32 Bits = 4 Bytes = IPv4`.
   - In the **bottom-right corner**, the interactive **IPv4 ↔ 32-Bit Binary Converter** allows the user to type any IPv4 address (e.g., `192.66.223.1`) and click **Convert to Binary** (`= 11000000.01000010.11011111.00000001`), or type any 32-bit binary string and click **Convert to IP** (`= 192.66.223.1`), returning **`Invalid`** on mismatched input (e.g., clicking **Convert to IP** on `192.66.223.1`), plus a fixed-width **Copy** button whose icon turns into **`✔`** for **500 ms**.

---

## 1. Environment & Project Setup

### 1.1 Prerequisites & Installation Commands

Create a Vite + React + TypeScript project and install the required packages:

```bash
npm create vite@latest my-network-lab -- --template react-ts
cd my-network-lab

# Install runtime dependencies
npm install react-isokit lucide-react clsx tailwind-merge

# Install Tailwind CSS v4 + Vite plugin & animation helpers
npm install -D tailwindcss @tailwindcss/vite tw-animate-css @types/node
```

### 1.2 `package.json`

```json
{
  "name": "isometric-dns-network",
  "private": true,
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "tsc -b && vite build",
    "preview": "vite preview"
  },
  "dependencies": {
    "clsx": "^2.1.1",
    "lucide-react": "^1.16.0",
    "react": "^19.0.0",
    "react-dom": "^19.0.0",
    "react-isokit": "^0.6.0",
    "tailwind-merge": "^3.0.2"
  },
  "devDependencies": {
    "@tailwindcss/vite": "^4.0.9",
    "@types/node": "^22.13.5",
    "@types/react": "^19.0.10",
    "@types/react-dom": "^19.0.4",
    "@vitejs/plugin-react": "^4.3.4",
    "tailwindcss": "^4.0.9",
    "tw-animate-css": "^1.2.4",
    "typescript": "~5.7.2",
    "vite": "^6.2.0"
  }
}
```

### 1.3 `vite.config.ts`

```ts
import path from "path";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
```

### 1.4 `index.html` (Loads `Space Grotesk` and `DM Mono` Google Fonts)

```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>DNS Resolution & Hardware Isometric Studio</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=DM+Mono:ital,wght@0,400;0,500;1,400&family=Space+Grotesk:wght@400;500;600;700&display=swap" rel="stylesheet">
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
```

---

## 2. How the Coordinate System, Camera, Arrows & Next/Back Transitions Work

### 2.1 3D Isometric Projection (`project(x, y, z)`)
`react-isokit` uses an isometric 3D coordinate system `(x, y, z)`:
- **`+x`** goes **down-right** along the 30° isometric grid axis.
- **`+y`** goes **down-left** along the 150° isometric grid axis.
- **`+z`** goes **straight up** vertically (`1 unit of z = 1 pixel up on screen`).
- Calling `project(x, y, z)` converts any 3D point `[x, y, z]` into exact 2D SVG screen coordinates `[screenX, screenY]`.
- Every 3D hardware block is built with `<Box x={...} y={...} z={...} w={...} d={...} h={...} r={...} top={...} front={...} side={...} />`, where `top`, `front`, and `side` accept arbitrary SVG elements that are automatically projected onto that face of the 3D box.

### 2.2 All 3D Hardware Positions & Screen Coordinates in Chapter 1

| Component | 3D Coordinates `(x, y, z, w, d, h)` | Purpose & Details |
| :--- | :--- | :--- |
| **Client Laptop Base (`L_BASE`)** | `x: 0, y: 250, z: 0, w: 184, d: 108, h: 8` | Base platform on the left side of the scene |
| **Laptop Keyboard Deck (`L_DECK`)** | `x: 14, y: 270, z: 8, w: 104, d: 70, h: 7` | 36-key keyboard + spacebar + trackpad + side USB well |
| **Laptop Display Lid (`L_LID`)** | `x: 14, y: 270, z: 15, w: 104, d: 4, h: 64` | Blue screen with `17:15` clock, browser window, status bar |
| **Security Key (`L_KEY` + `L_DISC`)** | `x: 122, y: 304, z: 8.7, w: 50, d: 24, h: 5.6` | USB dongle with pressable golden disc (`L_DISC`) & `<Ripple>` |
| **DNS Server Base (`R_BASE`)** | `x: 215, y: 75, z: 0, w: 164, d: 112, h: 8` | Server rack base platform at center-left |
| **DNS Gold Engine (`R_FIREWALL`)** | `x: 234, y: 88, z: 29.5, w: 118, d: 42, h: 50` | Gold server blade (`dns-gold-unit`) with LCD & 8 RJ45 ports |
| **DNS Server Top Cap (`R_CAP`)** | `x: 227, y: 87, z: 81, w: 132, d: 44, h: 6` | Top cap with vents & wireframe globe icon |
| **DNS Hardware Switch (`R_KEY`)** | `x: 313, y: 153, z: 8, w: 54, d: 22, h: 6` | Pressable `QUERY` / `200 OK` button on server base |
| **Octet Cuboid 0 (`192`)** | `x: 485, y: -95, z: 0, w: 54, d: 54, h: 14` | Sky-blue cuboid (`.octet-cuboid-0`) |
| **Octet Cuboid 1 (`128`)** | `x: 549, y: -95, z: 0, w: 54, d: 54, h: 14` | Mint-green cuboid (`.octet-cuboid-1`) |
| **Octet Cuboid 2 (`168`)** | `x: 613, y: -95, z: 0, w: 54, d: 54, h: 14` | Warm-beige cuboid (`.octet-cuboid-2`) |
| **Octet Cuboid 3 (`43`)** | `x: 677, y: -95, z: 0, w: 54, d: 54, h: 14` | Ocean-blue cuboid (`.octet-cuboid-3`) |

### 2.3 What Happens When You Click **Next** or **Back** (`stage` `0 ↔ 1 ↔ 2 ↔ 3`)

1. **Smooth Camera `viewBox` Panning (`useEffect` on `[stage]`)**:
   - Each stage has a pre-computed 2D screen-space `viewBox` (`STAGE_VIEWBOXES[stage]`) with a `2.25` aspect ratio:
     - `stage = 0`: `makeScreenViewBox(-330, -35, 35, 290, 2.25, 22)` (focused tightly on the Client Laptop).
     - `stage = 1`: `makeScreenViewBox(-330, 285, 35, 295, 2.25, 24)` (expands right to frame Laptop + DNS Server).
     - `stage = 2`: `makeScreenViewBox(-330, BINARY_COL_X + 68, 30, 325, 2.25, 26)` (expands right to frame the 4 Octet Cuboids + Octet Label Pills + 8-Bit Binary Pills).
     - `stage = 3`: `makeScreenViewBox(-330, CARDS_LEFT_X + CARD_WIDTH + 16, 30, 330, 2.25, 26)` (frames the entire pipeline including the Curly Brace, `Binary Representation` card, and `Total Bits` card).
   - Whenever `stage` changes (via **Next**, **Back**, step pills, or `ArrowRight` / `ArrowLeft` keys), a `requestAnimationFrame` loop interpolates `[x, y, width, height]` from `currentVbRef.current` to `STAGE_VIEWBOXES[stage]` over **`880 ms`** using `easeOutCubic(x) = 1 - (1 - x)^3`.

2. **Stage Choreography Timers (`useEffect` on `[stage, targetIndex]`)**:
   - **When entering `stage = 0`**:
     - Resets `serverLanded`, `connectionActive`, `bridgeVisible`, `revealedOctets = 0`, `braceVisible`, `binaryCardVisible`, `totalBitsCardVisible` to `false`.
   - **When clicking Next to `stage = 1`**:
     - Plays `"whoosh"` sound immediately as the DNS Server Rack begins its `880 ms` `.animate-server-descend` drop from `translateY(-195px)` and its floor shadow ellipse expands (`landing-shadow-ring`).
     - At **`650 ms`**: Sets `serverLanded = true` and plays `"boot"`, popping in `[ IP = 192.128.168.43 ]` above the server and `[ where is example.com ? ]` below the server.
     - At **`920 ms`**: Sets `connectionActive = true` and plays `"process"`, mounting the bidirectional connection line and starting the Red/Green packet loop.
   - **When clicking Next to `stage = 2`**:
     - Keeps `serverLanded = true` and `connectionActive = true`.
     - Drops all 4 Octet Cuboids onto the surface with `.animate-cuboid-drop` staggered by `120 ms` (`idx * 120ms`).
     - At **`480 ms`**: Sets `bridgeVisible = true` and plays `"notify"`, popping in the `[ IP = 192.128.168.43 ]` bridge pill between the DNS Server and the 4 cuboids.
     - At **`950 ms`, `1570 ms`, `2190 ms`, `2810 ms`** (`950 + idx * 620 ms`): Increments `revealedOctets` from `1` to `4`. For each revealed octet `idx`, a cubic Bezier arrow draws from the bridge pill into cuboid `idx`, the cuboid's top number lights up at full opacity, and a rounded L-elbow arrow draws upward from `CUBOID_TOP_CENTERS[idx]` and rightward through the `[ First/Second/Third/Fourth Octet (0 - 255) ]` pill into the `[ 8-bit binary ]` pill.
   - **When clicking Next to `stage = 3`**:
     - Ensures all 4 octets are revealed (`revealedOctets = 4`).
     - At **`420 ms`**: Sets `braceVisible = true` (`playSound("process")`), drawing the top and bottom halves of the curly brace `}` and its horizontal pointer arrow.
     - At **`920 ms`**: Sets `binaryCardVisible = true` (`playSound("notify")`), sliding in the **`Binary Representation`** card (`11000000.10000000.10101000.00101011`).
     - At **`1480 ms`**: Sets `totalBitsCardVisible = true` (`playSound("complete")`), sliding in the **`Total Bits`** card (`4 × 8 = 32 Bits = 4 Bytes = IPv4`).
   - **Important SVG + CSS Animation Rule**:
     - For cards and pills positioned with `transform="translate(x, y)"`, the position translation is placed on an **outer `<g transform="translate(x, y)">`** and the CSS keyframe class (`.animate-card-slide` or `.animate-pill-pop`) is placed on an **inner `<g className="animate-card-slide">`**. This prevents CSS `transform` animations from overwriting the SVG `transform` coordinates.

---

## 3. Complete CSS Stylesheet (`src/index.css`)

Save the following file at `src/index.css`:

```css
@import "tailwindcss";
@import "tw-animate-css";
@import "react-isokit/styles.css";

@keyframes security-key-off {
  to {
    opacity: 0;
  }
}

@keyframes security-key-on {
  from {
    opacity: 0;
    transform: translateY(2px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Security Key specific styles */
.fig-security-key .sk-avatar,
.fig-security-key .sk-lock {
  fill: none;
  stroke: var(--ik-screen-ink);
  stroke-width: 1.3;
  stroke-linecap: round;
  stroke-linejoin: round;
  vector-effect: non-scaling-stroke;
}

.fig-security-key .sk-disc {
  --ik-top: #f7d97e;
  --ik-front: #e7c258;
  --ik-side: #d4ad42;
  --ik-line: #8c6d1f;
  --ik-detail: #b59233;
}

.fig-security-key .sk-until {
  animation: security-key-off 1ms linear var(--sk-arrive, 700ms) forwards;
}

.fig-security-key .sk-from {
  opacity: 0;
  animation: security-key-on 240ms var(--ik-ease) var(--sk-arrive, 700ms) forwards;
}

/* Warm Gold DNS Resolver Unit on FirewallRack */
.fig-dns-scene .dns-gold-unit {
  --ik-top: #f9e3a8;
  --ik-front: #f3d289;
  --ik-side: #e4bc68;
  --ik-line: #23201c;
  --ik-detail: #9e7b2f;
}

/* 4 IPv4 Octet Isometric Cuboid Palettes */
.fig-dns-scene .octet-cuboid-0 {
  --ik-top: #bce3ff;
  --ik-front: #68b5f8;
  --ik-side: #2e84d8;
  --ik-line: #163d69;
  --ik-detail: #1e5ea3;
}

.fig-dns-scene .octet-cuboid-1 {
  --ik-top: #b4f0cd;
  --ik-front: #5ec992;
  --ik-side: #2b9a66;
  --ik-line: #134e32;
  --ik-detail: #1f734b;
}

.fig-dns-scene .octet-cuboid-2 {
  --ik-top: #efe6dc;
  --ik-front: #d4c4b4;
  --ik-side: #b39f8c;
  --ik-line: #4a3e34;
  --ik-detail: #7d6b5b;
}

.fig-dns-scene .octet-cuboid-3 {
  --ik-top: #9ed4f0;
  --ik-front: #498ec2;
  --ik-side: #23598c;
  --ik-line: #112d4a;
  --ik-detail: #1b4670;
}

/* Stage Drop & Reveal Animations */
@keyframes descend-from-sky {
  0% {
    opacity: 0;
    transform: translateY(-195px);
  }
  68% {
    opacity: 1;
    transform: translateY(7px);
  }
  84% {
    transform: translateY(-3px);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes landing-shadow-ring {
  0% {
    opacity: 0;
    transform: scale(0.35);
  }
  55% {
    opacity: 0.75;
    transform: scale(1.08);
  }
  100% {
    opacity: 0;
    transform: scale(1.55);
  }
}

@keyframes cuboid-drop-in {
  0% {
    opacity: 0;
    transform: translateY(-120px);
  }
  72% {
    opacity: 1;
    transform: translateY(5px);
  }
  88% {
    transform: translateY(-2px);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes pill-pop-in {
  0% {
    opacity: 0;
    transform: scale(0.75) translateY(8px);
  }
  70% {
    opacity: 1;
    transform: scale(1.04) translateY(-1px);
  }
  100% {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
}

@keyframes draw-stroke-line {
  from {
    stroke-dashoffset: 380;
  }
  to {
    stroke-dashoffset: 0;
  }
}

.animate-server-descend {
  animation: descend-from-sky 880ms cubic-bezier(0.22, 1, 0.36, 1) both;
}

.animate-cuboid-drop {
  animation: cuboid-drop-in 680ms cubic-bezier(0.22, 1, 0.36, 1) both;
}

.animate-pill-pop {
  transform-box: fill-box;
  transform-origin: center;
  animation: pill-pop-in 420ms cubic-bezier(0.22, 1, 0.36, 1) both;
}

.animate-draw-arrow {
  stroke-dasharray: 380;
  stroke-dashoffset: 380;
  animation: draw-stroke-line 580ms cubic-bezier(0.32, 0.72, 0, 1) forwards;
}

@keyframes card-slide-in {
  0% {
    opacity: 0;
    transform: translateX(35px) scale(0.92);
  }
  70% {
    opacity: 1;
    transform: translateX(-3px) scale(1.01);
  }
  100% {
    opacity: 1;
    transform: translateX(0) scale(1);
  }
}

.animate-card-slide {
  transform-box: fill-box;
  transform-origin: center;
  animation: card-slide-in 560ms cubic-bezier(0.22, 1, 0.36, 1) both;
}

/* DNS Resolver Scene Custom Isometric Grid & Theme */
.fig-dns-scene.ik-plate {
  --ik-panel: #f7f2e7;
  --ik-top: #fbf8f1;
  --ik-front: #f1ece1;
  --ik-side: #e5decb;
  --ik-well: #ded6c3;
  --ik-line: #57524a;
  --ik-detail: #a8a093;
  --ik-live: #1e1b18;
  --ik-ink: #6e675b;
  --ik-ink-hi: #1e1b18;
  --ik-screen: #e6e8e1;
  --ik-screen-ink: #22241f;
  --ik-border: #dcd3c2;
  background-color: #f7f2e7;
  background-image:
    linear-gradient(30deg, transparent 49.2%, #d8ccb845 49.8%, #d8ccb845 50.2%, transparent 50.8%),
    linear-gradient(150deg, transparent 49.2%, #d8ccb845 49.8%, #d8ccb845 50.2%, transparent 50.8%);
  background-size: 46px 26.5px;
  box-shadow: 0 16px 40px -12px rgba(45, 36, 24, 0.12);
}

body {
  font-family: 'Space Grotesk', system-ui, -apple-system, sans-serif;
  background-color: #ece5d8;
  color: #23201c;
  margin: 0;
}

.font-mono-code {
  font-family: 'DM Mono', ui-monospace, SFMono-Regular, monospace;
}
```

---

## 4. Complete Chapter 1 Component Code (`src/components/ui/dns-resolver-diagram.tsx`)

Save the following file at `src/components/ui/dns-resolver-diagram.tsx`:

```tsx
import { useEffect, useId, useRef, useState } from "react";
import {
  Box,
  Cursor,
  Plate,
  Press,
  playSound,
  project,
  Ripple,
  Signal,
  useDemoTap,
  type Vec3,
} from "react-isokit";

export type PacketCycle = "request" | "processing" | "response";
export type StoryStage = 0 | 1 | 2 | 3;

export interface DnsTarget {
  domain: string;
  ip: string;
  octets: readonly [number, number, number, number];
}

export const DNS_TARGETS: readonly DnsTarget[] = [
  {
    domain: "Example.com",
    ip: "192.128.168.43",
    octets: [192, 128, 168, 43],
  },
  {
    domain: "shop.example",
    ip: "203.0.113.7",
    octets: [203, 0, 113, 7],
  },
  {
    domain: "api.stripe.com",
    ip: "198.51.100.24",
    octets: [198, 51, 100, 24],
  },
];

const OCTET_TITLES = [
  "First Octet",
  "Second Octet",
  "Third Octet",
  "Fourth Octet",
] as const;

function to8BitBinary(value: number): string {
  return Math.max(0, Math.min(255, value)).toString(2).padStart(8, "0");
}

interface ConversionResult {
  ok: boolean;
  display: string;
  copyText: string;
}

function parseIpv4Octets(input: string): number[] | null {
  const trimmed = input.trim();
  // Reject if all 4 segments are 8-bit binary strings
  if (/^[01]{8}(\.[01]{8}){3}$/.test(trimmed)) return null;
  const parts = trimmed.split(".");
  if (parts.length !== 4) return null;
  const nums: number[] = [];
  for (const part of parts) {
    if (!/^(?:0|[1-9]\d*)$/.test(part)) return null;
    const n = Number(part);
    if (!Number.isInteger(n) || n < 0 || n > 255) return null;
    nums.push(n);
  }
  return nums;
}

function parseIpv4Binary(input: string): number[] | null {
  const cleaned = input.replace(/^=\s*/, "").trim();
  let groups: string[] = [];
  if (/^[01]{32}$/.test(cleaned)) {
    groups = [
      cleaned.slice(0, 8),
      cleaned.slice(8, 16),
      cleaned.slice(16, 24),
      cleaned.slice(24, 32),
    ];
  } else {
    const parts = cleaned.split(/[\s.]+/);
    if (parts.length === 4 && parts.every((p) => /^[01]{8}$/.test(p))) {
      groups = parts;
    } else {
      return null;
    }
  }
  return groups.map((g) => parseInt(g, 2));
}

function convertToBinaryValue(input: string): ConversionResult {
  const cleaned = input.replace(/^=\s*/, "").trim();
  if (!cleaned || parseIpv4Binary(cleaned)) {
    return { ok: false, display: "Invalid", copyText: "Invalid" };
  }

  const ipv4 = parseIpv4Octets(cleaned);
  if (ipv4) {
    const bin = ipv4.map((n) => n.toString(2).padStart(8, "0")).join(".");
    return {
      ok: true,
      display: `= ${bin}`,
      copyText: bin,
    };
  }

  return { ok: false, display: "Invalid", copyText: "Invalid" };
}

function convertToIpValue(input: string): ConversionResult {
  const cleaned = input.replace(/^=\s*/, "").trim();
  if (!cleaned) {
    return { ok: false, display: "Invalid", copyText: "Invalid" };
  }

  const ipv4FromBin = parseIpv4Binary(cleaned);
  if (ipv4FromBin) {
    const ip = ipv4FromBin.join(".");
    return {
      ok: true,
      display: `= ${ip}`,
      copyText: ip,
    };
  }

  return { ok: false, display: "Invalid", copyText: "Invalid" };
}

/* ============================================================================
   1. LAPTOP STATION (From security-key.tsx) — Left Side (LX=0, LY=250)
   Screen bounds: X: [-310 .. -57], Y: [50 .. 272]
   ============================================================================ */
const LX = 0;
const LY = 250;

const L_BASE = { x: LX, y: LY, z: 0, w: 184, d: 108, h: 8 };
const L_DECK = { x: LX + 14, y: LY + 20, z: L_BASE.h, w: 104, d: 70, h: 7 };
const L_LID = {
  x: L_DECK.x,
  y: L_DECK.y,
  z: L_DECK.z + L_DECK.h,
  w: L_DECK.w,
  d: 4,
  h: 64,
};
const L_SCREEN = { x: 5, y: 5, w: L_LID.w - 10, h: 51 };
const L_PORT_Z = L_DECK.z + L_DECK.h / 2;
const L_KEY = {
  x: L_DECK.x + L_DECK.w + 4,
  y: LY + 54,
  z: L_PORT_Z - 2.8,
  w: 50,
  d: 24,
  h: 5.6,
};
const L_PLUG = {
  x: L_DECK.x + L_DECK.w,
  y: L_KEY.y + 9,
  z: L_PORT_Z - 1.5,
  w: 4,
  d: 6,
  h: 3,
};
const L_DISC = {
  x: L_KEY.x + 17,
  y: L_KEY.y + 4.5,
  z: L_KEY.z + L_KEY.h,
  w: 15,
  d: 15,
  h: 1.6,
};
const L_DISC_TOP: Vec3 = [
  L_DISC.x + L_DISC.w / 2,
  L_DISC.y + L_DISC.d / 2,
  L_DISC.z + L_DISC.h,
];
const L_KEYS = Array.from({ length: 36 }, (_, k) => ({
  k,
  x: 11.6 + (k % 12) * 6.8,
  y: 9 + Math.floor(k / 12) * 6.8,
}));

/* ============================================================================
   2. DNS RESOLVER SERVER RACK (From firewall-rack.tsx) — Center-Left (RX=215, RY=75)
   Moved slightly up-right so there is a wide, clean horizontal arrow gap from Laptop!
   Screen bounds: X: [32 .. 248], Y: [75 .. 265]
   ============================================================================ */
const RX = 215;
const RY = 75;

const R_BASE = { x: RX, y: RY, z: 0, w: 164, d: 112, h: 8 };
const R_RACK = { x: RX + 12, y: RY + 12, w: 132, d: 44 };
const POST = 7;
const R_PLINTH = {
  x: R_RACK.x,
  y: R_RACK.y,
  z: R_BASE.h,
  w: R_RACK.w,
  d: R_RACK.d,
  h: 6,
};
const RZ0 = R_PLINTH.z + R_PLINTH.h;
const R_UNIT = {
  x: R_RACK.x + POST,
  y: R_RACK.y + 1,
  w: R_RACK.w - 2 * POST,
  d: R_RACK.d - 2,
};
const R_LOWER = { ...R_UNIT, z: RZ0, h: 14 };
const R_FIREWALL = { ...R_UNIT, z: R_LOWER.z + R_LOWER.h + 1.5, h: 50 };
const R_CAP = {
  x: R_RACK.x,
  y: R_RACK.y,
  z: R_FIREWALL.z + R_FIREWALL.h + 1.5,
  w: R_RACK.w,
  d: R_RACK.d,
  h: 6,
};
const R_LEFT = {
  x: R_RACK.x,
  y: R_RACK.y,
  z: RZ0,
  w: POST,
  d: R_RACK.d,
  h: R_CAP.z - RZ0,
};
const R_RIGHT = { ...R_LEFT, x: R_RACK.x + R_RACK.w - POST };
const R_KEY = { x: RX + 98, y: RY + 78, z: R_BASE.h, w: 54, d: 22, h: 6 };
const R_LCD = { x: 7, y: 5, w: 60, h: 18 };
const R_SOCKET = { w: 9.2, h: 8.2, y: 33 };

const ACTIVE_PORTS = [1, 3, 5, 7] as const;
const ACTIVE_SET: ReadonlySet<number> = new Set(ACTIVE_PORTS);

const R_PORTS = Array.from({ length: 8 }, (_, k) => ({
  k,
  x: 7 + k * 13,
  activePort: ACTIVE_SET.has(k),
}));

/* ============================================================================
   3. FOUR ISOMETRIC OCTET CUBOIDS (192 . 128 . 168 . 43)
   Placed so their vertical center (Y ~ 180..275) aligns horizontally with
   the Laptop & DNS Server!
   ============================================================================ */
const CUBOID_W = 54;
const CUBOID_D = 54;
const CUBOID_H = 14;
const CUBOID_STEP_X = 64;
const CUBOID_START_X = 485;
const CUBOID_Y = -95;

const OCTET_CUBOIDS = Array.from({ length: 4 }, (_, idx) => ({
  idx,
  x: CUBOID_START_X + idx * CUBOID_STEP_X,
  y: CUBOID_Y,
  z: 0,
  w: CUBOID_W,
  d: CUBOID_D,
  h: CUBOID_H,
}));

/* ============================================================================
   4. CONNECTION PATHS & EXACT 2D SCREEN-SPACE CAMERA VIEWBOXES
   Instead of guessing 3D bounding points that distort vertical Y bounds,
   we compute exact 2D screen-space viewBoxes (x, y, width, height) at a
   consistent 2.25 aspect ratio so EVERY stage is dead-center & never clipped!
   ============================================================================ */
const LINK_LAPTOP_PT: Vec3 = [L_BASE.x + L_BASE.w - 6, L_BASE.y + 22, 16];
const LINK_DNS_PT: Vec3 = [R_BASE.x + 4, R_BASE.y + R_BASE.d - 14, 16];

const SIGNAL_OUT: readonly Vec3[] = [L_DISC_TOP, LINK_LAPTOP_PT, LINK_DNS_PT];
const SIGNAL_BACK: readonly Vec3[] = [
  LINK_DNS_PT,
  LINK_LAPTOP_PT,
  [L_LID.x + L_LID.w / 2, L_LID.y + L_LID.d, L_LID.z + L_LID.h / 2],
];

function makeScreenViewBox(
  minX: number,
  maxX: number,
  minY: number,
  maxY: number,
  aspect = 2.25,
  pad = 24,
): string {
  const rawW = maxX - minX + pad * 2;
  const rawH = maxY - minY + pad * 2;
  const cx = (minX + maxX) / 2;
  const cy = (minY + maxY) / 2;

  let w = rawW;
  let h = rawH;
  if (w / h > aspect) {
    h = w / aspect;
  } else {
    w = h * aspect;
  }
  return `${(cx - w / 2).toFixed(2)} ${(cy - h / 2).toFixed(2)} ${w.toFixed(2)} ${h.toFixed(2)}`;
}

// Exact screen coordinates for right-hand columns (computed once at module load)
const CUBOID_TOP_CENTERS = OCTET_CUBOIDS.map((c) =>
  project(c.x + c.w * 0.62, c.y + c.d * 0.15, c.z + c.h),
);
const CUBOID_BOTTOM_LEFT = OCTET_CUBOIDS.map((c) =>
  project(c.x, c.y + c.d, c.z + c.h / 2),
);

// Position the 4 rows of [First Octet (0-255)] -> [11000000] pills above-right of the 4 cuboids,
// matching the reference image where the elbow arrows go UP from each cuboid and turn RIGHT!
const BASE_ROW_Y = CUBOID_TOP_CENTERS[0][1] - 78; // ~112
const ROW_GAP_Y = 38; // Rows at Y = 112, 150, 188, 226 (Center Y = 169, matching Laptop & DNS Server!)
const LABEL_COL_X = CUBOID_TOP_CENTERS[3][0] + 135; // ~822
const BINARY_COL_X = LABEL_COL_X + 158; // ~980

// Curly Brace `}` & Two Rightmost Summary Cards:
// Positioned directly to the right of the 4 Binary Pills, centered vertically on the 4 rows!
const BRACE_START_X = BINARY_COL_X + 64; // ~1044
const BRACE_TOP_Y = BASE_ROW_Y - 10; // ~102
const BRACE_BOT_Y = BASE_ROW_Y + 3 * ROW_GAP_Y + 10; // ~236
const BRACE_MID_Y = (BRACE_TOP_Y + BRACE_BOT_Y) / 2; // ~169
const BRACE_TIP_X = BRACE_START_X + 22; // ~1066
const CARDS_LEFT_X = BRACE_TIP_X + 28; // ~1094
const CARD_WIDTH = 284;
const CARD_HEIGHT = 68;

// Top Card ("Binary Representation") sits directly aligned with the Curly Brace tip arrow!
// Bottom Card ("Total Bits") sits cleanly right below the Top Card!
const BINARY_CARD_Y = BRACE_MID_Y - CARD_HEIGHT / 2;
const TOTAL_BITS_CARD_Y = BINARY_CARD_Y + CARD_HEIGHT + 16;

// Exact 2D Screen-Space ViewBoxes for each of the 4 stages:
const STAGE_VIEWBOXES: Record<StoryStage, string> = {
  // Stage 0: Laptop only (-320 .. -45 in X, 40 .. 285 in Y)
  0: makeScreenViewBox(-330, -35, 35, 290, 2.25, 22),
  // Stage 1: Laptop + DNS Server (-330 .. +275 in X, 35 .. 295 in Y)
  1: makeScreenViewBox(-330, 285, 35, 295, 2.25, 24),
  // Stage 2: Laptop + DNS Server + 4 Octet Cuboids + Octet/Binary Pills (-330 .. +1050 in X)
  2: makeScreenViewBox(-330, BINARY_COL_X + 68, 30, 325, 2.25, 26),
  // Stage 3: Full Pipeline including Curly Brace + Binary Representation & Total Bits Cards (-330 .. +1390 in X)
  3: makeScreenViewBox(
    -330,
    CARDS_LEFT_X + CARD_WIDTH + 16,
    30,
    330,
    2.25,
    26,
  ),
};

function parseViewBox(vb: string): [number, number, number, number] {
  const nums = vb.split(/\s+/).map(Number);
  return [nums[0] || 0, nums[1] || 0, nums[2] || 800, nums[3] || 400];
}

function RackHoles() {
  return (
    <>
      {Array.from({ length: 14 }, (_, k) => (
        <circle
          key={k}
          className="ik-fill"
          cx={POST / 2}
          cy={3.5 + k * 4.5}
          r={0.65}
        />
      ))}
    </>
  );
}

interface DnsResolverDiagramProps {
  stage: StoryStage;
  targetIndex?: number;
  onCycleChange?: (cycle: PacketCycle) => void;
  onOctetRevealChange?: (count: number) => void;
}

export default function DnsResolverDiagram({
  stage,
  targetIndex = 0,
  onCycleChange,
  onOctetRevealChange,
}: DnsResolverDiagramProps) {
  const target = DNS_TARGETS[targetIndex] ?? DNS_TARGETS[0];

  const [currentViewBox, setCurrentViewBox] = useState<string>(
    STAGE_VIEWBOXES[stage],
  );
  const currentVbRef = useRef<[number, number, number, number]>(
    parseViewBox(STAGE_VIEWBOXES[stage]),
  );

  const [serverLanded, setServerLanded] = useState(stage >= 1);
  const [connectionActive, setConnectionActive] = useState(stage >= 1);

  const [revealedOctets, setRevealedOctets] = useState<number>(
    stage >= 2 ? 4 : 0,
  );
  const [bridgeVisible, setBridgeVisible] = useState(stage >= 2);

  const [braceVisible, setBraceVisible] = useState(stage === 3);
  const [binaryCardVisible, setBinaryCardVisible] = useState(stage === 3);
  const [totalBitsCardVisible, setTotalBitsCardVisible] = useState(stage === 3);

  const [dotT, setDotT] = useState(0);
  const [cycle, setCycle] = useState<PacketCycle>("request");
  const [pulseKey, setPulseKey] = useState(0);
  const [selectedOctet, setSelectedOctet] = useState<number | null>(null);

  // Interactive IPv4 <-> Binary Converter Widget State
  const [converterInput, setConverterInput] = useState<string>(target.ip);
  const [converterOutput, setConverterOutput] = useState<string>(
    `= ${target.octets.map(to8BitBinary).join(".")}`,
  );
  const [converterIsInvalid, setConverterIsInvalid] = useState<boolean>(false);
  const [copiedFlag, setCopiedFlag] = useState<boolean>(false);
  const copyTimerRef = useRef<number | null>(null);

  const cycleRef = useRef<PacketCycle>("request");
  const onCycleChangeRef = useRef(onCycleChange);
  onCycleChangeRef.current = onCycleChange;
  const onOctetRevealRef = useRef(onOctetRevealChange);
  onOctetRevealRef.current = onOctetRevealChange;

  const clip = useId().replace(/:/g, "");

  // 1. Smooth Camera Panning across Stages 0 -> 1 -> 2 -> 3
  useEffect(() => {
    const from = [...currentVbRef.current] as [number, number, number, number];
    const to = parseViewBox(STAGE_VIEWBOXES[stage]);
    const duration = 880;
    const t0 = performance.now();
    let raf = 0;

    const easeOutCubic = (x: number) => 1 - Math.pow(1 - x, 3);

    const stepFrame = (now: number) => {
      const p = Math.min(1, (now - t0) / duration);
      const e = easeOutCubic(p);
      const next: [number, number, number, number] = [
        from[0] + (to[0] - from[0]) * e,
        from[1] + (to[1] - from[1]) * e,
        from[2] + (to[2] - from[2]) * e,
        from[3] + (to[3] - from[3]) * e,
      ];
      currentVbRef.current = next;
      setCurrentViewBox(next.map((n) => n.toFixed(2)).join(" "));
      if (p < 1) {
        raf = window.requestAnimationFrame(stepFrame);
      }
    };

    raf = window.requestAnimationFrame(stepFrame);
    return () => window.cancelAnimationFrame(raf);
  }, [stage]);

  // 2. Stage-by-Stage Choreography Timers & Sound Effects
  useEffect(() => {
    const timers: number[] = [];

    if (stage === 0) {
      setServerLanded(false);
      setConnectionActive(false);
      setBridgeVisible(false);
      setRevealedOctets(0);
      setBraceVisible(false);
      setBinaryCardVisible(false);
      setTotalBitsCardVisible(false);
      onOctetRevealRef.current?.(0);
    } else if (stage === 1) {
      setBridgeVisible(false);
      setRevealedOctets(0);
      setBraceVisible(false);
      setBinaryCardVisible(false);
      setTotalBitsCardVisible(false);
      onOctetRevealRef.current?.(0);
      setServerLanded(false);
      setConnectionActive(false);

      playSound("whoosh");

      const tLand = window.setTimeout(() => {
        setServerLanded(true);
        playSound("boot");
      }, 650);

      const tConn = window.setTimeout(() => {
        setConnectionActive(true);
        playSound("process");
      }, 920);

      timers.push(tLand, tConn);
    } else if (stage === 2) {
      setServerLanded(true);
      setConnectionActive(true);
      setBridgeVisible(false);
      setRevealedOctets(0);
      setBraceVisible(false);
      setBinaryCardVisible(false);
      setTotalBitsCardVisible(false);
      onOctetRevealRef.current?.(0);

      playSound("whoosh");

      const tBridge = window.setTimeout(() => {
        setBridgeVisible(true);
        playSound("notify");
      }, 480);
      timers.push(tBridge);

      [0, 1, 2, 3].forEach((idx) => {
        const tOctet = window.setTimeout(() => {
          setRevealedOctets(idx + 1);
          onOctetRevealRef.current?.(idx + 1);
          playSound(idx === 3 ? "complete" : "press");
        }, 950 + idx * 620);
        timers.push(tOctet);
      });
    } else if (stage === 3) {
      setServerLanded(true);
      setConnectionActive(true);
      setBridgeVisible(true);
      setRevealedOctets(4);
      onOctetRevealRef.current?.(4);

      setBraceVisible(false);
      setBinaryCardVisible(false);
      setTotalBitsCardVisible(false);

      playSound("whoosh");

      const tBrace = window.setTimeout(() => {
        setBraceVisible(true);
        playSound("process");
      }, 420);

      const tBinCard = window.setTimeout(() => {
        setBinaryCardVisible(true);
        playSound("notify");
      }, 920);

      const tTotalCard = window.setTimeout(() => {
        setTotalBitsCardVisible(true);
        playSound("complete");
      }, 1480);

      timers.push(tBrace, tBinCard, tTotalCard);
    }

    return () => timers.forEach((id) => window.clearTimeout(id));
  }, [stage, targetIndex]);

  // 3. Continuous Red Request -> Green Response Loop
  useEffect(() => {
    if (!connectionActive) {
      setDotT(0);
      setCycle("request");
      return;
    }

    let rafId = 0;
    const OUT_MS = 1300;
    const HOLD_SERVER_MS = 360;
    const BACK_MS = 1300;
    const HOLD_LAPTOP_MS = 400;
    const TOTAL_MS = OUT_MS + HOLD_SERVER_MS + BACK_MS + HOLD_LAPTOP_MS;

    const startTime = performance.now();

    const easeInOutCubic = (x: number) =>
      x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2;

    const updateCycle = (next: PacketCycle) => {
      if (cycleRef.current !== next) {
        cycleRef.current = next;
        setCycle(next);
        setPulseKey((k) => k + 1);
        onCycleChangeRef.current?.(next);
      }
    };

    const tick = (now: number) => {
      const elapsed = (now - startTime) % TOTAL_MS;

      if (elapsed < OUT_MS) {
        setDotT(easeInOutCubic(elapsed / OUT_MS));
        updateCycle("request");
      } else if (elapsed < OUT_MS + HOLD_SERVER_MS) {
        setDotT(1);
        updateCycle("processing");
      } else if (elapsed < OUT_MS + HOLD_SERVER_MS + BACK_MS) {
        const p = (elapsed - OUT_MS - HOLD_SERVER_MS) / BACK_MS;
        setDotT(1 - easeInOutCubic(p));
        updateCycle("response");
      } else {
        setDotT(0);
        updateCycle("response");
      }

      rafId = window.requestAnimationFrame(tick);
    };

    rafId = window.requestAnimationFrame(tick);
    return () => window.cancelAnimationFrame(rafId);
  }, [connectionActive, targetIndex]);

  const demo = useDemoTap(() => {}, { delay: 1400 });

  const handleManualPing = () => {
    demo.dismiss();
    playSound(cycle === "response" ? "success" : "process");
  };

  const handleOctetClick = (idx: number) => {
    demo.dismiss();
    setSelectedOctet((prev) => (prev === idx ? null : idx));
    playSound("toggle");
  };

  const handleConverterInputChange = (val: string) => {
    setConverterInput(val);
  };

  const handleConvertToBinary = () => {
    const res = convertToBinaryValue(converterInput);
    setConverterOutput(res.display);
    setConverterIsInvalid(!res.ok);
    playSound(res.ok ? "complete" : "toggle");
  };

  const handleConvertToIp = () => {
    const res = convertToIpValue(converterInput);
    setConverterOutput(res.display);
    setConverterIsInvalid(!res.ok);
    playSound(res.ok ? "complete" : "toggle");
  };

  const handleCopyConverter = async () => {
    const textToCopy = converterOutput
      ? converterOutput.replace(/^=\s*/, "").trim()
      : converterInput.trim();
    if (!textToCopy) return;
    try {
      await navigator.clipboard.writeText(textToCopy);
      setCopiedFlag(true);
      playSound("notify");
      if (copyTimerRef.current !== null) {
        window.clearTimeout(copyTimerRef.current);
      }
      copyTimerRef.current = window.setTimeout(() => {
        setCopiedFlag(false);
        copyTimerRef.current = null;
      }, 500);
    } catch {
      setCopiedFlag(false);
    }
  };

  const aiming = demo.phase === "aim" || demo.phase === "press";
  const isRedRequest = cycle === "request";
  const isServerProcessing = cycle === "processing";
  const isGreenResponse = cycle === "response";

  const activeColor = !connectionActive
    ? "#6366f1"
    : isRedRequest
      ? "#ef4444"
      : isServerProcessing
        ? "#f59e0b"
        : "#10b981";
  const activeGlow = isRedRequest
    ? "rgba(239, 68, 68, 0.35)"
    : isServerProcessing
      ? "rgba(245, 158, 11, 0.35)"
      : "rgba(16, 185, 129, 0.35)";

  // Screen coordinates for Laptop <-> DNS Server line
  const [p1x, p1y] = project(...LINK_LAPTOP_PT);
  const [p2x, p2y] = project(...LINK_DNS_PT);
  const dx = p2x - p1x;
  const dy = p2y - p1y;
  const dist = Math.hypot(dx, dy) || 1;
  const ux = dx / dist;
  const uy = dy / dist;

  const lineStartX = p1x + ux * 10;
  const lineStartY = p1y + uy * 10;
  const lineEndX = p2x - ux * 10;
  const lineEndY = p2y - uy * 10;

  const dotX = lineStartX + (lineEndX - lineStartX) * dotT;
  const dotY = lineStartY + (lineEndY - lineStartY) * dotT;

  const refGreenX = lineStartX + (lineEndX - lineStartX) * 0.32;
  const refGreenY = lineStartY + (lineEndY - lineStartY) * 0.32;
  const refRedX = lineStartX + (lineEndX - lineStartX) * 0.68;
  const refRedY = lineStartY + (lineEndY - lineStartY) * 0.68;

  // Callout pill positions around Laptop and DNS Server
  const [urlPillX, urlPillY] = project(
    L_LID.x + L_LID.w / 2,
    L_LID.y,
    L_LID.z + L_LID.h + 24,
  );
  const [youPillX, youPillY] = project(
    L_BASE.x + L_BASE.w / 2,
    L_BASE.y + L_BASE.d + 28,
    0,
  );
  const [topIpPillX, topIpPillY] = project(
    R_CAP.x + R_CAP.w / 2,
    R_CAP.y + R_CAP.d / 2,
    R_CAP.z + R_CAP.h + 24,
  );
  const [wherePillX, wherePillY] = project(
    R_BASE.x + R_BASE.w / 2 + 12,
    R_BASE.y + R_BASE.d + 28,
    0,
  );

  const [serverShadowX, serverShadowY] = project(
    R_BASE.x + R_BASE.w / 2,
    R_BASE.y + R_BASE.d / 2,
    0,
  );

  // Bridge Pill: [ IP = 192.128.168.43 ] ---> 4 Octet Cuboids
  const [dnsRightX] = project(
    R_BASE.x + R_BASE.w,
    R_BASE.y + R_BASE.d / 2,
    18,
  );
  const [firstCuboidLeftX, firstCuboidLeftY] = CUBOID_BOTTOM_LEFT[0];

  const bridgePillX = (dnsRightX + firstCuboidLeftX) / 2 - 12;
  const bridgePillY = firstCuboidLeftY + 12;

  const fullBinaryDotted = target.octets.map(to8BitBinary).join(".");

  const stageReadout =
    stage === 0
      ? `STEP 1 / 4 · Client Laptop ready (https://${target.domain})`
      : stage === 1
        ? isRedRequest
          ? `STEP 2 / 4 · ● RED REQ → where is ${target.domain.toLowerCase()} ?`
          : `STEP 2 / 4 · ● GREEN RES ← IP = ${target.ip}`
        : stage === 2
          ? `STEP 3 / 4 · IP ${target.ip} → ${revealedOctets} of 4 Octets Revealed`
          : `STEP 4 / 4 · ${fullBinaryDotted} (4 × 8 = 32 Bits = 4 Bytes = IPv4)`;

  return (
    <div className="relative w-full">
    <Plate
      {...demo.plate}
      fig={`Step ${stage + 1} of 4`}
      name={
        stage === 0
          ? "1. Client Laptop Endpoint"
          : stage === 1
            ? "2. DNS Resolver Server & Packet Loop"
            : stage === 2
              ? "3. Four IPv4 Octet Cuboids & Binary"
              : "4. Complete 32-Bit Binary Representation & Total Bits"
      }
      hint={
        stage === 0
          ? "Click Next → to drop the DNS Resolver Server onto the surface"
          : stage === 1
            ? "Click Next → to pan the surface and reveal the 4 IPv4 Octet Cuboids"
            : stage === 2
              ? "Click Next → to combine all 4 octets into the 32-Bit Binary Representation"
              : "Click any Octet Cuboid to inspect or ← Back to replay"
      }
      readout={stageReadout}
      viewBox={currentViewBox}
      className="fig-dns-scene fig-security-key fig-firewall-rack"
      data-unlocked={isGreenResponse}
      data-blocked={isGreenResponse}
      label={`Step ${stage + 1} of 4: Interactive isometric DNS resolution, IPv4 octet cuboids, and 32-bit binary representation for ${target.domain} (${target.ip}).`}
    >
      <g ref={demo.ref}>
        {/* =================================================================
            PART 1: DNS RESOLVER SERVER RACK (Appears in Stage 1+)
           ================================================================= */}
        {stage >= 1 && (
          <g key="dns-server-mount">
            <ellipse
              cx={serverShadowX}
              cy={serverShadowY + 12}
              rx={88}
              ry={44}
              fill="none"
              stroke="#d97706"
              strokeWidth={3}
              style={{
                transformBox: "fill-box",
                transformOrigin: "center",
                animation: "landing-shadow-ring 950ms ease-out both",
              }}
            />

            <g className="dns-rack-station animate-server-descend">
              <Box
                {...R_BASE}
                r={10}
                top={[
                  [8, 8],
                  [R_BASE.w - 8, 8],
                  [8, R_BASE.d - 8],
                  [R_BASE.w - 8, R_BASE.d - 8],
                ].map(([cx, cy]) => (
                  <circle
                    key={`rb-${cx}-${cy}`}
                    className="ik-fill"
                    cx={cx}
                    cy={cy}
                    r={1.7}
                  />
                ))}
              />
              <Box
                {...R_PLINTH}
                r={3}
                front={<path className="ik-detail" d={`M4 3h${R_RACK.w - 8}`} />}
              />
              <Box {...R_LEFT} r={1.5} front={<RackHoles />} />
              <Box
                {...R_LOWER}
                r={1.5}
                front={
                  <>
                    <circle
                      cx={8}
                      cy={R_LOWER.h / 2}
                      r={2.2}
                      fill={isGreenResponse ? "#10b981" : "#ef4444"}
                    />
                    <circle cx={15} cy={R_LOWER.h / 2} r={1.4} fill="#f59e0b" />
                    {Array.from({ length: 15 }, (_, k) => (
                      <path
                        key={k}
                        className="ik-detail"
                        d={`M${28 + k * 5.6} 3v${R_LOWER.h - 6}`}
                      />
                    ))}
                  </>
                }
              />
              <Box
                {...R_FIREWALL}
                r={2}
                className="dns-gold-unit"
                front={
                  <>
                    <defs>
                      <clipPath id={`${clip}-lcd`}>
                        <rect
                          x={R_LCD.x}
                          y={R_LCD.y}
                          width={R_LCD.w}
                          height={R_LCD.h}
                          rx={2.2}
                        />
                      </clipPath>
                    </defs>
                    <path
                      className="ik-detail"
                      d={`M2.5 6v${R_FIREWALL.h - 12}M${R_FIREWALL.w - 2.5} 6v${R_FIREWALL.h - 12}`}
                    />
                    <rect
                      x={R_LCD.x}
                      y={R_LCD.y}
                      width={R_LCD.w}
                      height={R_LCD.h}
                      rx={2.2}
                      fill="#18181b"
                      stroke="#27272a"
                      strokeWidth={1}
                    />
                    <g clipPath={`url(#${clip}-lcd)`}>
                      <text
                        x={R_LCD.x + 4}
                        y={R_LCD.y + 6.5}
                        fontSize={4.6}
                        fontWeight={700}
                        fill="#a1a1aa"
                        fontFamily="'DM Mono', monospace"
                      >
                        {isRedRequest
                          ? "DNS QUERY"
                          : isServerProcessing
                            ? "RESOLVING"
                            : "IP RESOLVED"}
                      </text>
                      <text
                        x={R_LCD.x + 4}
                        y={R_LCD.y + 14.8}
                        fontSize={5.5}
                        fontWeight={700}
                        fill={
                          isRedRequest
                            ? "#f87171"
                            : isServerProcessing
                              ? "#fbbf24"
                              : "#34d399"
                        }
                        fontFamily="'DM Mono', monospace"
                      >
                        {target.ip}
                      </text>
                    </g>
                    <circle
                      cx={75}
                      cy={10}
                      r={2.5}
                      fill={activeColor}
                      stroke="#1e1b18"
                      strokeWidth={0.8}
                    />
                    <text
                      x={80.5}
                      y={11.8}
                      fill="#1e1b18"
                      fontSize={6.2}
                      fontWeight={800}
                      fontFamily="'Space Grotesk', sans-serif"
                      letterSpacing="0.06em"
                    >
                      DNS SERVER
                    </text>
                    {Array.from({ length: 11 }, (_, k) => (
                      <path
                        key={k}
                        className="ik-detail"
                        d={`M${74 + k * 3.5} 16v6`}
                      />
                    ))}
                    {R_PORTS.map((port) => {
                      const lampColor = port.activePort
                        ? activeColor
                        : "#a8a093";
                      return (
                        <g key={port.k}>
                          <circle
                            cx={port.x + R_SOCKET.w / 2}
                            cy={28.5}
                            r={1.8}
                            fill={lampColor}
                            stroke="#1e1b18"
                            strokeWidth={0.5}
                          />
                          <rect
                            className="ik-well"
                            x={port.x}
                            y={R_SOCKET.y}
                            width={R_SOCKET.w}
                            height={R_SOCKET.h}
                            rx={0.9}
                          />
                          <path
                            className="ik-detail"
                            d={`M${port.x + 3} ${R_SOCKET.y + R_SOCKET.h}v-1.8h3.2v1.8`}
                          />
                          {port.activePort ? (
                            <path
                              className="ik-detail"
                              d={`M${port.x + R_SOCKET.w / 2} ${R_SOCKET.y + R_SOCKET.h + 1.6}l1.8 3h-3.6z`}
                            />
                          ) : null}
                        </g>
                      );
                    })}
                  </>
                }
              />
              <Box
                {...R_RIGHT}
                r={1.5}
                front={<RackHoles />}
                side={
                  <>
                    {Array.from({ length: 9 }, (_, k) => (
                      <path
                        key={k}
                        className="ik-detail"
                        d={`M7 ${9 + k * 4.5}h${R_RACK.d - 14}`}
                      />
                    ))}
                    <rect
                      className="ik-well"
                      x={7}
                      y={R_RIGHT.h - 11}
                      width={9}
                      height={5.5}
                      rx={1}
                    />
                  </>
                }
              />
              <Box
                {...R_CAP}
                r={3.5}
                className="dns-gold-unit"
                top={
                  <>
                    <rect
                      className="ik-detail"
                      x={7}
                      y={5}
                      width={R_RACK.w - 14}
                      height={R_RACK.d - 10}
                      rx={3}
                    />
                    {Array.from({ length: 4 }, (_, k) => (
                      <path
                        key={`lv-${k}`}
                        className="ik-detail"
                        d={`M15 ${11 + k * 6.5}h26`}
                      />
                    ))}
                    <g
                      transform={`translate(${R_RACK.w / 2}, ${R_RACK.d / 2})`}
                      stroke="#1e1b18"
                      strokeWidth={1.6}
                      fill="none"
                    >
                      <circle cx={0} cy={0} r={11.5} fill="#fff7df" />
                      <ellipse cx={0} cy={0} rx={5.5} ry={11.5} />
                      <line x1={-11.5} y1={0} x2={11.5} y2={0} />
                      <line x1={-9.5} y1={-5.5} x2={9.5} y2={-5.5} />
                      <line x1={-9.5} y1={5.5} x2={9.5} y2={5.5} />
                      <line x1={0} y1={-11.5} x2={0} y2={11.5} />
                    </g>
                    {Array.from({ length: 4 }, (_, k) => (
                      <path
                        key={`rv-${k}`}
                        className="ik-detail"
                        d={`M${R_RACK.w - 41} ${11 + k * 6.5}h26`}
                      />
                    ))}
                  </>
                }
              />
              <Press
                label="Ping DNS Resolver Server"
                onPress={handleManualPing}
                data-hot={!isRedRequest}
              >
                <g>
                  <Box
                    {...R_KEY}
                    r={5}
                    top={
                      <>
                        <text className="ik-label fw-key" x={6} y={14}>
                          {isRedRequest ? "QUERY" : "200 OK"}
                        </text>
                        <circle
                          cx={R_KEY.w - 9.5}
                          cy={R_KEY.d / 2}
                          r={3.5}
                          fill={activeColor}
                          stroke="#1e1b18"
                          strokeWidth={1.2}
                        />
                      </>
                    }
                  />
                </g>
              </Press>
            </g>
          </g>
        )}

        {/* =================================================================
            PART 2: STAGE 2+ — IP BRIDGE PILL, SEQUENTIAL ARROWS & 4 OCTET CUBOIDS
           ================================================================= */}
        {stage >= 2 && bridgeVisible && (
          <g className="dns-to-octets-bridge animate-pill-pop">
            <g transform={`translate(${bridgePillX}, ${bridgePillY})`}>
              <rect
                x={-72}
                y={-12}
                width={144}
                height={24}
                rx={12}
                fill="#1e1b18"
                opacity={0.14}
              />
              <rect
                x={-72}
                y={-13.5}
                width={144}
                height={24}
                rx={12}
                fill="#f8e8bf"
                stroke="#1e1b18"
                strokeWidth={1.8}
              />
              <text
                x={0}
                y={2.5}
                textAnchor="middle"
                fill="#1e1b18"
                fontSize={9.6}
                fontWeight={700}
                fontFamily="'DM Mono', monospace"
              >
                {`IP = ${target.ip}`}
              </text>
            </g>

            {OCTET_CUBOIDS.map((_, idx) => {
              if (revealedOctets <= idx) return null;
              const [cx, cy] = CUBOID_BOTTOM_LEFT[idx];
              const isLatest = stage === 2 && revealedOctets === idx + 1;
              const startX = bridgePillX + 72;
              const startY = bridgePillY - 1;
              const endX = cx - 8;
              const endY = cy + 3;
              const ctrlX = (startX + endX) / 2;

              return (
                <g key={`ip-to-cuboid-arrow-${idx}`}>
                  <path
                    d={`M ${startX} ${startY} C ${ctrlX} ${startY}, ${ctrlX} ${endY}, ${endX} ${endY}`}
                    fill="none"
                    stroke={isLatest ? "#059669" : "#1e1b18"}
                    strokeWidth={isLatest ? 2.6 : 1.8}
                    opacity={isLatest ? 1 : 0.45}
                    strokeLinecap="round"
                    className="animate-draw-arrow"
                  />
                  <path
                    d={`M ${endX + 2} ${endY} L ${endX - 6} ${endY - 4.2} L ${endX - 4.5} ${endY} L ${endX - 6} ${endY + 4.2} Z`}
                    fill={isLatest ? "#059669" : "#1e1b18"}
                    opacity={isLatest ? 1 : 0.55}
                  />
                </g>
              );
            })}
          </g>
        )}

        {/* Curved Elbow Arrows from each revealed Octet Cuboid -> Octet Range Pill -> Binary Pill */}
        {stage >= 2 &&
          OCTET_CUBOIDS.map((_, idx) => {
            const isRevealed = revealedOctets > idx;
            if (!isRevealed) return null;

            const [startX, startY] = CUBOID_TOP_CENTERS[idx];
            const rowY = BASE_ROW_Y + idx * ROW_GAP_Y;
            const labelLeftX = LABEL_COL_X - 54;
            const labelRightX = LABEL_COL_X + 54;
            const binaryLeftX = BINARY_COL_X - 58;
            const isHighlighted =
              selectedOctet === idx ||
              (selectedOctet === null &&
                stage === 2 &&
                revealedOctets === idx + 1);

            const cornerR = 10;
            const elbowPath = `M ${startX} ${startY - 2} L ${startX} ${rowY + cornerR} Q ${startX} ${rowY} ${startX + cornerR} ${rowY} L ${labelLeftX - 4} ${rowY}`;
            const binaryStr = to8BitBinary(target.octets[idx]);

            return (
              <g key={`octet-branch-${idx}`}>
                <path
                  d={elbowPath}
                  fill="none"
                  stroke={isHighlighted ? "#059669" : "#1e1b18"}
                  strokeWidth={isHighlighted ? 2.5 : 1.9}
                  strokeLinecap="round"
                  className="animate-draw-arrow"
                />
                <path
                  d={`M ${labelLeftX - 2} ${rowY} L ${labelLeftX - 9.5} ${rowY - 4.2} L ${labelLeftX - 8} ${rowY} L ${labelLeftX - 9.5} ${rowY + 4.2} Z`}
                  fill={isHighlighted ? "#059669" : "#1e1b18"}
                />

                <line
                  x1={labelRightX + 2}
                  y1={rowY}
                  x2={binaryLeftX - 4}
                  y2={rowY}
                  stroke={isHighlighted ? "#059669" : "#1e1b18"}
                  strokeWidth={isHighlighted ? 2.5 : 1.9}
                  strokeLinecap="round"
                  className="animate-draw-arrow"
                />
                <path
                  d={`M ${binaryLeftX - 2} ${rowY} L ${binaryLeftX - 9.5} ${rowY - 4.2} L ${binaryLeftX - 8} ${rowY} L ${binaryLeftX - 9.5} ${rowY + 4.2} Z`}
                  fill={isHighlighted ? "#059669" : "#1e1b18"}
                />

                {/* Octet Label Pill: [ First Octet / 0 - 255 ] */}
                <g
                  transform={`translate(${LABEL_COL_X}, ${rowY})`}
                  style={{ cursor: "pointer" }}
                  onClick={() => handleOctetClick(idx)}
                >
                  <g className="animate-pill-pop">
                    <rect
                      x={-52}
                      y={-12.5}
                      width={104}
                      height={26}
                      rx={13}
                      fill="#1e1b18"
                      opacity={0.14}
                    />
                    <rect
                      x={-52}
                      y={-14}
                      width={104}
                      height={26}
                      rx={13}
                      fill={isHighlighted ? "#fae5b2" : "#f6ebd1"}
                      stroke="#1e1b18"
                      strokeWidth={isHighlighted ? 2.1 : 1.5}
                    />
                    <text
                      x={0}
                      y={-2.5}
                      textAnchor="middle"
                      fill="#1e1b18"
                      fontSize={7.8}
                      fontWeight={700}
                      fontFamily="'Space Grotesk', sans-serif"
                    >
                      {OCTET_TITLES[idx]}
                    </text>
                    <text
                      x={0}
                      y={7.2}
                      textAnchor="middle"
                      fill="#4a433b"
                      fontSize={7.2}
                      fontWeight={700}
                      fontFamily="'DM Mono', monospace"
                    >
                      0 - 255
                    </text>
                  </g>
                </g>

                {/* 8-Bit Binary Pill: [ 11000000 ] */}
                <g
                  transform={`translate(${BINARY_COL_X}, ${rowY})`}
                  style={{ cursor: "pointer" }}
                  onClick={() => handleOctetClick(idx)}
                >
                  <g
                    className="animate-pill-pop"
                    style={{ animationDelay: "140ms" }}
                  >
                    <rect
                      x={-56}
                      y={-12}
                      width={112}
                      height={25}
                      rx={12.5}
                      fill="#1e1b18"
                      opacity={0.14}
                    />
                    <rect
                      x={-56}
                      y={-13.5}
                      width={112}
                      height={25}
                      rx={12.5}
                      fill={isHighlighted ? "#d1fae5" : "#f6ebd1"}
                      stroke={isHighlighted ? "#059669" : "#1e1b18"}
                      strokeWidth={isHighlighted ? 2.1 : 1.5}
                    />
                    <text
                      x={0}
                      y={3.2}
                      textAnchor="middle"
                      fill="#1e1b18"
                      fontSize={10.8}
                      fontWeight={700}
                      letterSpacing="0.08em"
                      fontFamily="'DM Mono', monospace"
                    >
                      {binaryStr}
                    </text>
                  </g>
                </g>
              </g>
            );
          })}

        {/* Render the 4 3D Isometric Octet Cuboids in Stage 2+ */}
        {stage >= 2 &&
          OCTET_CUBOIDS.map((cuboid, idx) => {
            const val = target.octets[idx];
            const isRevealed = revealedOctets > idx;
            const isHighlighted =
              selectedOctet === idx ||
              (selectedOctet === null &&
                stage === 2 &&
                revealedOctets === idx + 1);

            return (
              <g
                key={`cuboid-${idx}`}
                className="animate-cuboid-drop"
                style={{ animationDelay: `${idx * 120}ms` }}
              >
                <Press
                  label={`Octet ${idx + 1}: decimal ${val}, binary ${to8BitBinary(val)}`}
                  onPress={() => handleOctetClick(idx)}
                  data-hot={isHighlighted}
                  className={`octet-cuboid-${idx}`}
                >
                  <g>
                    <Box
                      x={cuboid.x}
                      y={cuboid.y}
                      z={isHighlighted ? 4.5 : 0}
                      w={cuboid.w}
                      d={cuboid.d}
                      h={cuboid.h}
                      r={9}
                      top={
                        <>
                          <rect
                            className="ik-detail"
                            x={4.5}
                            y={4.5}
                            width={cuboid.w - 9}
                            height={cuboid.d - 9}
                            rx={6}
                            opacity={0.55}
                          />
                          <text
                            x={cuboid.w / 2}
                            y={cuboid.d / 2 + 5.5}
                            textAnchor="middle"
                            fill="#111827"
                            fontSize={17.5}
                            fontWeight={800}
                            fontFamily="'Space Grotesk', sans-serif"
                            opacity={isRevealed ? 1 : 0.18}
                          >
                            {isRevealed ? val : "?"}
                          </text>
                        </>
                      }
                    />
                  </g>
                </Press>
              </g>
            );
          })}

        {/* =================================================================
            PART 2B: STAGE 3 — CURLY BRACE + BINARY REPRESENTATION CARD + TOTAL BITS CARD
                     Positioned in direct horizontal alignment with the 4 Binary Pills!
           ================================================================= */}
        {stage === 3 && braceVisible && (
          <g className="binary-summary-braces">
            {/* Top half of Curly Brace `}` */}
            <path
              d={`M ${BRACE_START_X} ${BRACE_TOP_Y} Q ${BRACE_START_X + 12} ${BRACE_TOP_Y} ${BRACE_START_X + 12} ${BRACE_TOP_Y + 14} L ${BRACE_START_X + 12} ${BRACE_MID_Y - 10} Q ${BRACE_START_X + 12} ${BRACE_MID_Y} ${BRACE_TIP_X} ${BRACE_MID_Y}`}
              fill="none"
              stroke="#1e1b18"
              strokeWidth={2.4}
              strokeLinecap="round"
              className="animate-draw-arrow"
            />
            {/* Bottom half of Curly Brace `}` */}
            <path
              d={`M ${BRACE_START_X} ${BRACE_BOT_Y} Q ${BRACE_START_X + 12} ${BRACE_BOT_Y} ${BRACE_START_X + 12} ${BRACE_BOT_Y - 14} L ${BRACE_START_X + 12} ${BRACE_MID_Y + 10} Q ${BRACE_START_X + 12} ${BRACE_MID_Y} ${BRACE_TIP_X} ${BRACE_MID_Y}`}
              fill="none"
              stroke="#1e1b18"
              strokeWidth={2.4}
              strokeLinecap="round"
              className="animate-draw-arrow"
            />
            {/* Horizontal Arrow from Curly Brace Tip straight into the Binary Representation Card! */}
            <line
              x1={BRACE_TIP_X}
              y1={BRACE_MID_Y}
              x2={CARDS_LEFT_X - 5}
              y2={BRACE_MID_Y}
              stroke="#1e1b18"
              strokeWidth={2.5}
              strokeLinecap="round"
              className="animate-draw-arrow"
            />
            <path
              d={`M ${CARDS_LEFT_X - 2} ${BRACE_MID_Y} L ${CARDS_LEFT_X - 10.5} ${BRACE_MID_Y - 4.8} L ${CARDS_LEFT_X - 8.5} ${BRACE_MID_Y} L ${CARDS_LEFT_X - 10.5} ${BRACE_MID_Y + 4.8} Z`}
              fill="#1e1b18"
            />
          </g>
        )}

        {/* Top Card: [ 📄 | Binary Representation ] -> 11000000.10000000.10101000.00101011 */}
        {stage === 3 && binaryCardVisible && (
          <g transform={`translate(${CARDS_LEFT_X}, ${BINARY_CARD_Y})`}>
            <g className="animate-card-slide">
              <rect
                x={3}
                y={4}
                width={CARD_WIDTH}
                height={CARD_HEIGHT}
                rx={6}
                fill="#1e1b18"
                opacity={0.14}
              />
              <rect
                x={0}
                y={0}
                width={CARD_WIDTH}
                height={CARD_HEIGHT}
                rx={6}
                fill="#f6ebd1"
                stroke="#1e1b18"
                strokeWidth={1.6}
              />

              {/* Binary Document Icon on top-left */}
              <g transform="translate(14, 10)">
                <path
                  d="M 0 2.5 A 2.5 2.5 0 0 1 2.5 0 L 13 0 L 18 5 L 18 20.5 A 2.5 2.5 0 0 1 15.5 23 L 2.5 23 A 2.5 2.5 0 0 1 0 20.5 Z"
                  fill="#1e1b18"
                />
                <path d="M 13 0 L 13 5 L 18 5 Z" fill="#f6ebd1" />
                <text
                  x={9}
                  y={10.5}
                  textAnchor="middle"
                  fill="#f6ebd1"
                  fontSize={4.8}
                  fontWeight={700}
                  fontFamily="'DM Mono', monospace"
                >
                  010
                </text>
                <text
                  x={9}
                  y={16}
                  textAnchor="middle"
                  fill="#f6ebd1"
                  fontSize={4.8}
                  fontWeight={700}
                  fontFamily="'DM Mono', monospace"
                >
                  101
                </text>
                <line
                  x1={3.5}
                  y1={19.5}
                  x2={14.5}
                  y2={19.5}
                  stroke="#f6ebd1"
                  strokeWidth={1.1}
                />
              </g>

              {/* Pink/Mauve Inner Header Banner: [ Binary Representation ] */}
              <rect
                x={42}
                y={10}
                width={222}
                height={22}
                rx={4.5}
                fill="#e7bfd7"
                stroke="#c59ab4"
                strokeWidth={1}
              />
              <text
                x={153}
                y={24.5}
                textAnchor="middle"
                fill="#1e1b18"
                fontSize={10.8}
                fontWeight={700}
                fontFamily="'Space Grotesk', sans-serif"
              >
                Binary Representation
              </text>

              {/* Full 32-Bit Dotted Binary String */}
              <text
                x={CARD_WIDTH / 2}
                y={51.5}
                textAnchor="middle"
                fill="#1e1b18"
                fontSize={10.3}
                fontWeight={700}
                letterSpacing="0.02em"
                fontFamily="'DM Mono', monospace"
              >
                {fullBinaryDotted}
              </text>
            </g>
          </g>
        )}

        {/* Bottom Card: [ Total Bits ] -> 4 × 8 = 32 Bits = 4 Bytes = IPv4 */}
        {stage === 3 && totalBitsCardVisible && (
          <g transform={`translate(${CARDS_LEFT_X}, ${TOTAL_BITS_CARD_Y})`}>
            <g className="animate-card-slide">
              <rect
                x={3}
                y={4}
                width={CARD_WIDTH}
                height={CARD_HEIGHT}
                rx={6}
                fill="#1e1b18"
                opacity={0.14}
              />
              <rect
                x={0}
                y={0}
                width={CARD_WIDTH}
                height={CARD_HEIGHT}
                rx={6}
                fill="#f6ebd1"
                stroke="#1e1b18"
                strokeWidth={1.6}
              />

              {/* Pink/Mauve Inner Header Banner: [ Total Bits ] */}
              <rect
                x={42}
                y={10}
                width={204}
                height={22}
                rx={4.5}
                fill="#e7bfd7"
                stroke="#c59ab4"
                strokeWidth={1}
              />
              <text
                x={144}
                y={24.5}
                textAnchor="middle"
                fill="#1e1b18"
                fontSize={11}
                fontWeight={700}
                fontFamily="'Space Grotesk', sans-serif"
              >
                Total Bits
              </text>

              {/* Equation: 4 × 8 = 32 Bits = 4 Bytes = IPv4 */}
              <text
                x={CARD_WIDTH / 2}
                y={51.5}
                textAnchor="middle"
                fill="#1e1b18"
                fontSize={11.5}
                fontWeight={700}
                fontFamily="'Space Grotesk', sans-serif"
              >
                4 × 8 = 32 Bits = 4 Bytes = IPv4
              </text>
            </g>
          </g>
        )}

        {/* =================================================================
            PART 3: BIDIRECTIONAL CONNECTION LINE + RED/GREEN PACKET DOT
           ================================================================= */}
        {stage >= 1 && connectionActive && (
          <g className="dns-connection-layer">
            <line
              x1={lineStartX}
              y1={lineStartY}
              x2={lineEndX}
              y2={lineEndY}
              stroke="#1e1b18"
              strokeWidth={2.4}
              strokeLinecap="round"
            />

            {isRedRequest ? (
              <line
                x1={lineStartX}
                y1={lineStartY}
                x2={dotX}
                y2={dotY}
                stroke="#ef4444"
                strokeWidth={3.2}
                strokeLinecap="round"
              />
            ) : (
              <line
                x1={lineEndX}
                y1={lineEndY}
                x2={dotX}
                y2={dotY}
                stroke="#10b981"
                strokeWidth={3.2}
                strokeLinecap="round"
              />
            )}

            <g
              transform={`translate(${lineStartX}, ${lineStartY}) rotate(${
                (Math.atan2(-uy, -ux) * 180) / Math.PI
              })`}
            >
              <path
                d="M 0 0 L -9.5 -4.8 L -7.2 0 L -9.5 4.8 Z"
                fill={isGreenResponse ? "#10b981" : "#1e1b18"}
                stroke="#1e1b18"
                strokeWidth={1}
                strokeLinejoin="round"
              />
            </g>

            <g
              transform={`translate(${lineEndX}, ${lineEndY}) rotate(${
                (Math.atan2(uy, ux) * 180) / Math.PI
              })`}
            >
              <path
                d="M 0 0 L -9.5 -4.8 L -7.2 0 L -9.5 4.8 Z"
                fill={isRedRequest ? "#ef4444" : "#1e1b18"}
                stroke="#1e1b18"
                strokeWidth={1}
                strokeLinejoin="round"
              />
            </g>

            <circle
              cx={refGreenX}
              cy={refGreenY}
              r={4.2}
              fill="#86efac"
              opacity={0.65}
            />
            <circle
              cx={refRedX}
              cy={refRedY}
              r={4.2}
              fill="#fca5a5"
              opacity={0.65}
            />

            {isRedRequest && (
              <Signal
                key={`sig-out-${pulseKey}`}
                points={SIGNAL_OUT}
                duration={750}
              />
            )}
            {isGreenResponse && (
              <Signal
                key={`sig-back-${pulseKey}`}
                points={SIGNAL_BACK}
                duration={750}
              />
            )}

            <circle cx={dotX} cy={dotY} r={10} fill={activeGlow} />
            <circle
              cx={dotX}
              cy={dotY}
              r={5.8}
              fill={activeColor}
              stroke="#1e1b18"
              strokeWidth={2}
            />
            <circle
              cx={dotX - 1.6}
              cy={dotY - 1.6}
              r={1.6}
              fill="#ffffff"
              opacity={0.85}
            />
          </g>
        )}

        {/* =================================================================
            PART 4: LAPTOP & SECURITY KEY (Always present from Step 1)
           ================================================================= */}
        <g className="laptop-station">
          <Box
            {...L_BASE}
            r={10}
            top={[
              [8, 8],
              [L_BASE.w - 8, 8],
              [8, L_BASE.d - 8],
              [L_BASE.w - 8, L_BASE.d - 8],
            ].map(([cx, cy]) => (
              <circle
                key={`lb-${cx}-${cy}`}
                className="ik-fill"
                cx={cx}
                cy={cy}
                r={1.6}
              />
            ))}
          />
          <Box
            {...L_DECK}
            r={5}
            top={
              <>
                <path
                  className="ik-detail"
                  d={`M4 ${L_LID.d + 2}h${L_DECK.w - 8}`}
                />
                {L_KEYS.map((key) => (
                  <rect
                    key={key.k}
                    className="ik-detail"
                    x={key.x}
                    y={key.y}
                    width={5.6}
                    height={5.6}
                    rx={1}
                  />
                ))}
                <rect
                  className="ik-detail"
                  x={11.6}
                  y={29.4}
                  width={12.4}
                  height={5.6}
                  rx={1}
                />
                <rect
                  className="ik-detail"
                  x={25.2}
                  y={29.4}
                  width={53.6}
                  height={5.6}
                  rx={1}
                />
                <rect
                  className="ik-detail"
                  x={80}
                  y={29.4}
                  width={12.4}
                  height={5.6}
                  rx={1}
                />
                <rect
                  className="ik-detail"
                  x={33}
                  y={41}
                  width={38}
                  height={22}
                  rx={2.4}
                />
              </>
            }
            front={
              <path className="ik-detail" d={`M${L_DECK.w / 2 - 9} 1.4h18`} />
            }
            side={
              <>
                <rect
                  className="ik-well"
                  x={38}
                  y={2}
                  width={9}
                  height={3}
                  rx={0.8}
                />
                <circle cx={54} cy={3.5} r={1.1} fill={activeColor} />
              </>
            }
          />
          <Box
            {...L_LID}
            r={2}
            front={
              <>
                <defs>
                  <clipPath id={`${clip}-screen`}>
                    <rect
                      x={L_SCREEN.x}
                      y={L_SCREEN.y}
                      width={L_SCREEN.w}
                      height={L_SCREEN.h}
                      rx={3}
                    />
                  </clipPath>
                </defs>
                <circle className="ik-fill" cx={L_LID.w / 2} cy={2.5} r={0.9} />
                <rect
                  className="ik-screen"
                  x={L_SCREEN.x}
                  y={L_SCREEN.y}
                  width={L_SCREEN.w}
                  height={L_SCREEN.h}
                  rx={3}
                />
                <g clipPath={`url(#${clip}-screen)`}>
                  <rect
                    x={L_SCREEN.x}
                    y={L_SCREEN.y}
                    width={L_SCREEN.w}
                    height={L_SCREEN.h}
                    fill="#0284c7"
                  />
                  <text
                    x={L_SCREEN.x + 4}
                    y={L_SCREEN.y + 18}
                    fill="#e0f2fe"
                    fontSize={6.2}
                    fontWeight={700}
                    fontFamily="'DM Mono', monospace"
                  >
                    17:15
                  </text>
                  <rect
                    x={L_SCREEN.x + 25}
                    y={L_SCREEN.y + 5}
                    width={L_SCREEN.w - 29}
                    height={35}
                    rx={2}
                    fill="#ffffff"
                  />
                  <circle cx={L_SCREEN.x + 29} cy={L_SCREEN.y + 8.5} r={1.1} fill="#ef4444" />
                  <circle cx={L_SCREEN.x + 32.5} cy={L_SCREEN.y + 8.5} r={1.1} fill="#f59e0b" />
                  <circle cx={L_SCREEN.x + 36} cy={L_SCREEN.y + 8.5} r={1.1} fill="#10b981" />
                  <rect
                    x={L_SCREEN.x + 28}
                    y={L_SCREEN.y + 12}
                    width={L_SCREEN.w - 35}
                    height={7}
                    rx={1.2}
                    fill={
                      !connectionActive
                        ? "#6366f1"
                        : isGreenResponse
                          ? "#38bdf8"
                          : "#818cf8"
                    }
                  />
                  {[0, 1, 2].map((row) => (
                    <g key={row} transform={`translate(0, ${row * 5.2})`}>
                      <circle
                        cx={L_SCREEN.x + 31}
                        cy={L_SCREEN.y + 23.5}
                        r={1.4}
                        fill="#ec4899"
                      />
                      <rect
                        x={L_SCREEN.x + 35}
                        y={L_SCREEN.y + 22.4}
                        width={18}
                        height={2.2}
                        rx={1}
                        fill="#bae6fd"
                      />
                    </g>
                  ))}
                  <rect
                    x={L_SCREEN.x}
                    y={L_SCREEN.y + L_SCREEN.h - 7.5}
                    width={L_SCREEN.w}
                    height={7.5}
                    fill="#0f172a"
                  />
                  <circle
                    cx={L_SCREEN.x + 6}
                    cy={L_SCREEN.y + L_SCREEN.h - 3.8}
                    r={1.8}
                    fill={activeColor}
                  />
                  <text
                    x={L_SCREEN.x + L_SCREEN.w / 2 + 3}
                    y={L_SCREEN.y + L_SCREEN.h - 2.2}
                    fill="#f8fafc"
                    fontSize={4.5}
                    fontWeight={700}
                    textAnchor="middle"
                    fontFamily="'DM Mono', monospace"
                  >
                    {!connectionActive
                      ? `READY · ${target.domain}`
                      : isRedRequest
                        ? `GET ${target.domain}`
                        : `IP ${target.ip}`}
                  </text>
                </g>
                <path
                  className="ik-detail"
                  d={`M${L_LID.w / 2 - 12} ${L_LID.h - 4}h24`}
                />
              </>
            }
          />
          <Box {...L_PLUG} r={0.8} />
          <Box
            {...L_KEY}
            r={4}
            top={
              <>
                <circle
                  className="ik-detail"
                  cx={L_DISC.x - L_KEY.x + L_DISC.w / 2}
                  cy={L_KEY.d / 2}
                  r={L_DISC.w / 2 + 2.4}
                />
                <circle
                  cx={L_KEY.w - 6}
                  cy={L_KEY.d / 2}
                  r={2.8}
                  fill={activeColor}
                />
                <path className="ik-detail" d={`M4 5v${L_KEY.d - 10}`} />
              </>
            }
            side={
              <path className="ik-detail" d={`M3 ${L_KEY.h / 2}h${L_KEY.d - 6}`} />
            }
          />
          {!aiming ? (
            <Ripple
              x={L_DISC.x}
              y={L_DISC.y}
              z={L_DISC.z}
              w={L_DISC.w}
              d={L_DISC.d}
              r={L_DISC.w / 2}
            />
          ) : null}
          <Press
            label={`Touch key to query DNS for ${target.domain}`}
            onPress={handleManualPing}
            data-hot={isRedRequest}
            className="sk-disc"
          >
            <g>
              <Box
                {...L_DISC}
                r={L_DISC.w / 2}
                top={
                  <>
                    <circle
                      className="ik-detail"
                      cx={L_DISC.w / 2}
                      cy={L_DISC.d / 2}
                      r={3.8}
                    />
                    <circle
                      className="ik-detail"
                      cx={L_DISC.w / 2}
                      cy={L_DISC.d / 2}
                      r={1.8}
                    />
                  </>
                }
              />
            </g>
          </Press>
        </g>

        {/* =================================================================
            PART 5: FLOATING CALLOUT PILLS
           ================================================================= */}

        {/* Always visible: [ 🌐 https://Example.com ] above Laptop */}
        <g
          transform={`translate(${urlPillX}, ${urlPillY})`}
          style={{ cursor: "pointer" }}
          onClick={handleManualPing}
        >
          <rect
            x={-84}
            y={-12}
            width={168}
            height={26}
            rx={13}
            fill="#1e1b18"
            opacity={0.15}
          />
          <rect
            x={-84}
            y={-13.5}
            width={168}
            height={26}
            rx={13}
            fill="#ffffff"
            stroke="#1e1b18"
            strokeWidth={1.8}
          />
          <g transform="translate(-67, -0.5)">
            <circle cx={0} cy={0} r={6.2} fill="#1e1b18" />
            <ellipse
              cx={0}
              cy={0}
              rx={2.8}
              ry={5.6}
              fill="none"
              stroke="#ffffff"
              strokeWidth={1.1}
            />
            <line
              x1={-5.6}
              y1={0}
              x2={5.6}
              y2={0}
              stroke="#ffffff"
              strokeWidth={1.1}
            />
            <line
              x1={0}
              y1={-5.6}
              x2={0}
              y2={5.6}
              stroke="#ffffff"
              strokeWidth={1.1}
            />
          </g>
          <text
            x={6}
            y={3.2}
            textAnchor="middle"
            fill="#1e1b18"
            fontSize={10.5}
            fontWeight={600}
            fontFamily="'DM Mono', monospace"
          >
            {`https://${target.domain}`}
          </text>
        </g>

        {/* Always visible: [ 👤 You ] below Laptop */}
        <g transform={`translate(${youPillX}, ${youPillY})`}>
          <rect
            x={-34}
            y={-11.5}
            width={68}
            height={24}
            rx={12}
            fill="#1e1b18"
            opacity={0.15}
          />
          <rect
            x={-34}
            y={-13}
            width={68}
            height={24}
            rx={12}
            fill="#ffffff"
            stroke="#1e1b18"
            strokeWidth={1.8}
          />
          <g
            transform="translate(-14, -1.5)"
            fill="#1e1b18"
            stroke="#1e1b18"
            strokeWidth={1.2}
            strokeLinecap="round"
          >
            <circle cx={0} cy={-2.8} r={2.6} />
            <path d="M -4.8 4.8 a 4.8 4.8 0 0 1 9.6 0 Z" />
          </g>
          <text
            x={8}
            y={2.8}
            textAnchor="middle"
            fill="#1e1b18"
            fontSize={10.8}
            fontWeight={700}
            fontFamily="'Space Grotesk', sans-serif"
          >
            You
          </text>
        </g>

        {/* Visible once DNS Server has landed & connected (Stage 1+): */}
        {stage >= 1 && serverLanded && (
          <>
            <g transform={`translate(${topIpPillX}, ${topIpPillY})`}>
              <g className="animate-pill-pop">
                <rect
                  x={-76}
                  y={-12}
                  width={152}
                  height={26}
                  rx={13}
                  fill="#1e1b18"
                  opacity={0.15}
                />
                <rect
                  x={-76}
                  y={-13.5}
                  width={152}
                  height={26}
                  rx={13}
                  fill={isGreenResponse ? "#d1fae5" : "#f8e8bf"}
                  stroke={isGreenResponse ? "#059669" : "#1e1b18"}
                  strokeWidth={1.9}
                />
                <circle
                  cx={-60}
                  cy={-0.5}
                  r={3.8}
                  fill="#10b981"
                  stroke="#1e1b18"
                  strokeWidth={1.2}
                />
                <text
                  x={6}
                  y={3}
                  textAnchor="middle"
                  fill="#1e1b18"
                  fontSize={10}
                  fontWeight={700}
                  fontFamily="'DM Mono', monospace"
                >
                  {`IP = ${target.ip}`}
                </text>
              </g>
            </g>

            <g transform={`translate(${wherePillX}, ${wherePillY})`}>
              <g className="animate-pill-pop">
                <rect
                  x={-84}
                  y={-12}
                  width={168}
                  height={25}
                  rx={12.5}
                  fill="#1e1b18"
                  opacity={0.15}
                />
                <rect
                  x={-84}
                  y={-13.5}
                  width={168}
                  height={25}
                  rx={12.5}
                  fill={isRedRequest ? "#fee2e2" : "#ffffff"}
                  stroke={isRedRequest ? "#dc2626" : "#1e1b18"}
                  strokeWidth={1.9}
                />
                <circle
                  cx={-69}
                  cy={-1}
                  r={3.8}
                  fill={activeColor}
                  stroke="#1e1b18"
                  strokeWidth={1.2}
                />
                <text
                  x={5}
                  y={2.8}
                  textAnchor="middle"
                  fill="#1e1b18"
                  fontSize={9.8}
                  fontWeight={600}
                  fontFamily="'DM Mono', monospace"
                >
                  {`where is ${target.domain.toLowerCase()} ?`}
                </text>
              </g>
            </g>
          </>
        )}

        <Cursor at={L_DISC_TOP} phase={demo.phase} />
      </g>
    </Plate>

      {/* =====================================================================
          INTERACTIVE IPv4 <-> 32-BIT BINARY CONVERTER WIDGET (Bottom-Right)
          Clean, tactile isometric card styling matching Chapter 1 cards:
          - Left: IPv4 coral badge (no IPv6 button)
          - Center: Sky-blue dual-line screen (editable input + single-line result)
          - Right: Fixed-width Copy button whose icon turns into "✔" for 500ms
          - Bottom: "Convert to IP" & "Convert to Binary" mint-green buttons
         ===================================================================== */}
      <div
        className="mt-2 sm:mt-0 sm:absolute sm:bottom-11 sm:right-5 z-20 w-full sm:w-[396px] rounded-xl border-2 border-[#1e1b18] bg-[#f4ead5] p-2.5 shadow-[3px_3px_0_rgba(30,27,24,0.18)]"
        onClick={(e) => e.stopPropagation()}
        onKeyDown={(e) => e.stopPropagation()}
      >
        {/* Top Row: [IPv4 Badge] + [Sky-Blue Input & Result Display] + [Fixed-Width Copy Button] */}
        <div className="flex items-stretch gap-1.5">
          {/* Left: Dedicated IPv4 Badge */}
          <div
            title="IPv4 (32-Bit) Mode"
            className="w-[46px] shrink-0 rounded-lg border-[1.5px] border-[#1e1b18] bg-[#f28b82] px-1.5 py-1 flex flex-col items-center justify-center shadow-[0_1.5px_0_#1e1b18] select-none"
          >
            <span className="font-mono-code text-[11px] font-extrabold tracking-tight text-[#1e1b18]">
              IPv4
            </span>
          </div>

          {/* Center Sky-Blue Screen: Editable IPv4 / Binary Input + Single-Line Result */}
          <div className="flex-1 min-w-0 rounded-lg border-[1.5px] border-[#1e1b18] bg-[#b4cffc] px-2.5 py-1.5 flex flex-col justify-between gap-1 shadow-[inset_0_1px_2px_rgba(30,27,24,0.12)]">
            <div className="flex items-center gap-1">
              <input
                type="text"
                value={converterInput}
                onChange={(e) => handleConverterInputChange(e.target.value)}
                placeholder="192.66.223.1 or 32-bit binary..."
                aria-label="IPv4 or Binary input"
                className="w-full bg-transparent font-mono-code text-[11.5px] font-bold text-[#1e1b18] placeholder:text-[#1e1b18]/45 focus:outline-none"
              />
              {converterInput.length > 0 && (
                <button
                  type="button"
                  onClick={() => {
                    setConverterInput("");
                    setConverterOutput("= —");
                    setConverterIsInvalid(false);
                  }}
                  title="Clear input"
                  className="shrink-0 rounded px-1 font-mono-code text-[11px] font-bold text-[#1e1b18]/55 hover:bg-[#1e1b18]/10 hover:text-[#1e1b18]"
                >
                  ×
                </button>
              )}
            </div>

            <div
              className={`w-full truncate border-t border-[#1e1b18]/20 pt-1 font-mono-code text-[9.6px] tracking-[-0.015em] font-bold ${
                converterIsInvalid ? "text-[#b91c1c]" : "text-[#0f172a]"
              }`}
              title={converterOutput}
            >
              {converterOutput}
            </div>
          </div>

          {/* Right Fixed-Width Copy Button: Text stays "Copy", icon swaps to "✔" for 500ms */}
          <button
            type="button"
            onClick={handleCopyConverter}
            title="Copy result to clipboard"
            className="w-[46px] shrink-0 rounded-lg border-[1.5px] border-[#1e1b18] bg-[#f4978e] hover:bg-[#ee857b] active:translate-y-[1px] py-1 flex flex-col items-center justify-center gap-1 font-mono-code text-[10px] font-bold text-[#1e1b18] shadow-[0_1.5px_0_#1e1b18] active:shadow-none transition"
          >
            <span className="leading-none">Copy</span>
            <span className="flex h-3.5 w-3.5 items-center justify-center">
              {copiedFlag ? (
                <span className="text-[12px] leading-none font-black text-[#1e1b18]">
                  ✔
                </span>
              ) : (
                <svg
                  width="13"
                  height="13"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#1e1b18"
                  strokeWidth="2.3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                  <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                </svg>
              )}
            </span>
          </button>
        </div>

        {/* Bottom Row: [Convert to IP] | [Convert to Binary] */}
        <div className="mt-2 grid grid-cols-2 gap-1.5">
          <button
            type="button"
            onClick={handleConvertToIp}
            className="rounded-lg border-[1.5px] border-[#1e1b18] bg-[#8fd19e] hover:bg-[#7ec48e] active:translate-y-[1px] py-1.5 px-2 font-mono-code text-xs font-bold text-[#1e1b18] shadow-[0_2px_0_#1e1b18] active:shadow-none transition"
          >
            Convert to IP
          </button>
          <button
            type="button"
            onClick={handleConvertToBinary}
            className="rounded-lg border-[1.5px] border-[#1e1b18] bg-[#8fd19e] hover:bg-[#7ec48e] active:translate-y-[1px] py-1.5 px-2 font-mono-code text-xs font-bold text-[#1e1b18] shadow-[0_2px_0_#1e1b18] active:shadow-none transition"
          >
            Convert to Binary
          </button>
        </div>
      </div>
    </div>
  );
}
```

---

## 5. Complete Standalone Host Application (`src/App.tsx`)

Below is the complete `src/App.tsx` controller that drives `<DnsResolverDiagram />` with the **Next**, **Back**, **Step 1–4 Pills**, **Target Domain Selector** (`Example.com`, `shop.example`, `api.stripe.com`), **Sound Toggle**, and **Keyboard Arrow Navigation** (while ignoring arrow keys when typing inside an `<input>`):

```tsx
import { useEffect, useState } from "react";
import { configureSound, SoundToggle } from "react-isokit";
import {
  ArrowLeft,
  ArrowRight,
  Network,
  Volume2,
} from "lucide-react";
import DnsResolverDiagram, {
  DNS_TARGETS,
  type StoryStage,
} from "@/components/ui/dns-resolver-diagram";

const CH1_META: ReadonlyArray<{
  step: StoryStage;
  badge: string;
  title: string;
  desc: string;
  nextLabel: string;
}> = [
  {
    step: 0,
    badge: "CH 01 · STEP 1 OF 4 · CLIENT LAPTOP",
    title: "Your Laptop wants to visit https://Example.com",
    desc: "Initially, only your laptop sits on the isometric surface. Click Next to summon the DNS Resolver Server from above.",
    nextLabel: "Next: Drop DNS Server →",
  },
  {
    step: 1,
    badge: "CH 01 · STEP 2 OF 4 · DNS RESOLUTION LOOP",
    title: "DNS Server descends & Red/Green lookup begins",
    desc: "The DNS Resolver lands on the surface. Your laptop continuously sends the HTTPS domain request (Red dot) and receives the IP address response (Green dot).",
    nextLabel: "Next: Reveal 4 IP Octets →",
  },
  {
    step: 2,
    badge: "CH 01 · STEP 3 OF 4 · 4 IPV4 OCTET CUBOIDS & BINARY",
    title: "Surface pans & reveals all 4 IPv4 Octet Cuboids one by one",
    desc: "The camera pans across the surface as the 4 octet cuboids drop in, and arrows from the resolved IP sequentially point to each block to reveal its decimal (0–255) and 8-bit binary value.",
    nextLabel: "Next: 32-Bit Binary & Total Bits →",
  },
  {
    step: 3,
    badge: "CH 01 · STEP 4 OF 4 · BINARY REPRESENTATION & TOTAL BITS",
    title: "Combining all 4 Octets into 32 Bits (4 Bytes = IPv4)",
    desc: "A curly brace gathers all four 8-bit binary octets into the complete Binary Representation card (11000000.10000000.10101000.00101011) and calculates Total Bits: 4 × 8 = 32 Bits = 4 Bytes = IPv4.",
    nextLabel: "↻ Replay Chapter 01",
  },
];

export default function App() {
  const [ch1Stage, setCh1Stage] = useState<StoryStage>(0);
  const [targetIdx, setTargetIdx] = useState(0);
  const [revealedCount, setRevealedCount] = useState(0);

  useEffect(() => {
    configureSound({ defaultOn: true, volume: 0.55 });
  }, []);

  // Keyboard navigation (ArrowRight = Next, ArrowLeft = Back)
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement
      ) {
        return;
      }
      if (e.key === "ArrowRight") {
        e.preventDefault();
        setCh1Stage((s) => (s < 3 ? ((s + 1) as StoryStage) : 0));
      } else if (e.key === "ArrowLeft") {
        e.preventDefault();
        setCh1Stage((s) => (s > 0 ? ((s - 1) as StoryStage) : 0));
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  const handleCh1Next = () => {
    if (ch1Stage < 3) {
      setCh1Stage((ch1Stage + 1) as StoryStage);
    } else {
      setCh1Stage(0);
    }
  };

  const handleCh1Back = () => {
    if (ch1Stage > 0) {
      setCh1Stage((ch1Stage - 1) as StoryStage);
    }
  };

  const ch1Meta = CH1_META[ch1Stage]!;

  return (
    <div className="min-h-screen w-full bg-[#e8e0d3] text-[#1e1b18] p-3 sm:p-5 flex flex-col items-center">
      {/* Top Navigation & Domain Selector Bar */}
      <div className="w-full max-w-7xl mb-3 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-[#d4c8b6] bg-[#f7f2e7] px-4 py-2.5 shadow-xs">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-xl border border-[#1e1b18] bg-[#f9dfa2]">
            <Network className="h-4 w-4 text-[#1e1b18]" />
          </div>
          <h1 className="text-sm sm:text-base font-bold tracking-tight text-[#1e1b18]">
            Chapter 01 — DNS Resolution &amp; 32-Bit IPv4 Octet Breakdown
          </h1>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-1.5 mr-1">
            {DNS_TARGETS.map((t, i) => (
              <button
                key={t.domain}
                type="button"
                onClick={() => setTargetIdx(i)}
                className={`rounded-lg border px-2.5 py-1 font-mono-code text-xs transition ${
                  targetIdx === i
                    ? "border-[#1e1b18] bg-[#f9dfa2] font-semibold text-[#1e1b18] shadow-[0_2px_0_#1e1b18]"
                    : "border-[#d2c6b2] bg-white text-[#5c564d] hover:bg-[#efe8da]"
                }`}
              >
                {t.domain} ({t.ip})
              </button>
            ))}
          </div>

          <SoundToggle className="inline-flex items-center gap-1.5 rounded-xl border border-[#c9bda9] bg-white px-3 py-1.5 font-mono-code text-xs font-medium text-[#1e1b18] hover:bg-[#f2ece1]">
            <Volume2 className="h-3.5 w-3.5" />
            <span>SFX</span>
          </SoundToggle>
        </div>
      </div>

      {/* Main Chapter 1 Diagram + Bottom Step Controller */}
      <div className="w-full max-w-7xl flex flex-col gap-3">
        <div className="w-full">
          <DnsResolverDiagram
            stage={ch1Stage}
            targetIndex={targetIdx}
            onOctetRevealChange={setRevealedCount}
          />
        </div>

        <div className="flex flex-col gap-4 rounded-2xl border border-[#d4c8b6] bg-[#f7f2e7] p-4 sm:p-5 shadow-xs lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-col gap-2 max-w-2xl">
            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded-full border border-[#1e1b18] bg-[#f9dfa2] px-2.5 py-0.5 font-mono-code text-[11px] font-bold text-[#1e1b18]">
                {ch1Meta.badge}
              </span>

              <div className="flex flex-wrap items-center gap-1.5 ml-1">
                {([0, 1, 2, 3] as const).map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setCh1Stage(s)}
                    className={`px-2.5 py-0.5 rounded-full font-mono-code text-[11px] border transition ${
                      ch1Stage === s
                        ? "border-[#1e1b18] bg-[#1e1b18] text-[#fdfaf3] font-bold"
                        : ch1Stage > s
                          ? "border-[#059669] bg-[#d1fae5] text-[#065f46] font-semibold"
                          : "border-[#c9bda9] bg-white text-[#7e776b]"
                    }`}
                  >
                    {s === 0
                      ? "1. Laptop Only"
                      : s === 1
                        ? "2. DNS Server Drop"
                        : s === 2
                          ? `3. 4 Octets (${ch1Stage >= 2 ? `${revealedCount}/4` : "4"})`
                          : "4. 32-Bit Total"}
                  </button>
                ))}
              </div>
            </div>

            <h2 className="text-base sm:text-lg font-bold text-[#1e1b18]">
              {ch1Meta.title}
            </h2>
            <p className="text-xs sm:text-sm text-[#5c564d] leading-relaxed">
              {ch1Meta.desc}
            </p>
          </div>

          <div className="flex items-center gap-3 self-end lg:self-center shrink-0">
            <button
              type="button"
              onClick={handleCh1Back}
              disabled={ch1Stage === 0}
              className="inline-flex items-center gap-2 rounded-xl border-2 border-[#1e1b18] bg-white px-4 py-2.5 font-mono-code text-xs sm:text-sm font-bold text-[#1e1b18] shadow-[0_3px_0_#1e1b18] transition hover:-translate-y-0.5 hover:bg-[#f2ece1] active:translate-y-0 disabled:opacity-35 disabled:pointer-events-none"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Back</span>
            </button>

            <button
              type="button"
              onClick={handleCh1Next}
              className="inline-flex items-center gap-2 rounded-xl border-2 border-[#1e1b18] bg-[#bce3ff] px-5 py-2.5 font-mono-code text-xs sm:text-sm font-bold text-[#1e1b18] shadow-[0_3px_0_#1e1b18] transition hover:-translate-y-0.5 hover:bg-[#a3d7ff] active:translate-y-0"
            >
              <span>{ch1Meta.nextLabel}</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
```

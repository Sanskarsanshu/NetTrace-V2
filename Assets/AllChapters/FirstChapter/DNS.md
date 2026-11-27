# DNS Resolver Server & Firewall Rack — Complete Self-Contained Reference

You can pass this Markdown file to any developer or AI assistant to recreate the **Isometric DNS Resolver Server Rack** (and the full **Laptop ↔ DNS Server Red/Green Packet Loop**) in any React + TypeScript + Tailwind CSS + shadcn project.

---

## 1. Project Requirements & Installation

The codebase should support:
- **shadcn project structure** (`src/components/ui`)
- **Tailwind CSS** (v4 or v3)
- **TypeScript**

Install required NPM dependencies:
```bash
npm install react-isokit lucide-react clsx tailwind-merge tw-animate-css
```

---

## 2. Standalone Upgraded DNS Resolver Server Component (`src/components/ui/dns-server-rack.tsx`)

This component renders the upgraded **Isometric Gold DNS Resolver Server Rack** with:
- **Heavy Server Floor Base** (`164×112×8`) with 4 corner mounting bolts
- **Rack Plinth & Vertical Rail Posts** (`LEFT` & `RIGHT`) with 14 mounting holes and side cooling louvers
- **Lower High-Speed Cache Blade** (`LOWER`) with power/activity LEDs and 15 drive-bay caddy slots
- **Gold DNS Resolver Core Engine** (`FIREWALL`) with a dark high-contrast OLED screen (`INBOUND QUERY` / `CACHE LOOKUP` / `A-RECORD OK`), status beacon, `DNS SERVER` badge, cooling slits, and **8 Ethernet RJ45 switch ports** with dynamic Red/Green LEDs
- **Top Cap with Isometric Wireframe Globe Emblem** (`CAP`) and dual cooling grills
- **Interactive Hardware Press Key** (`QUERY` / `200 OK`) with synthesized Web Audio sound effects

```tsx
// src/components/ui/dns-server-rack.tsx
import { type CSSProperties, useEffect, useId, useRef, useState } from "react";
import {
  Box,
  Cursor,
  Plate,
  Press,
  playSound,
  Ripple,
  useDemoTap,
} from "react-isokit";
import "react-isokit/styles.css";

export type DnsServerMode = "inbound" | "lookup" | "resolved";

const BASE = { x: 0, y: 0, z: 0, w: 164, d: 112, h: 8 };
const RACK = { x: 12, y: 12, w: 132, d: 44 };
const POST = 7;
const PLINTH = {
  x: RACK.x,
  y: RACK.y,
  z: BASE.h,
  w: RACK.w,
  d: RACK.d,
  h: 6,
};
const Z0 = PLINTH.z + PLINTH.h;
const UNIT = {
  x: RACK.x + POST,
  y: RACK.y + 1,
  w: RACK.w - 2 * POST,
  d: RACK.d - 2,
};
// Blade 1: High-Speed DNS Cache Blade (Lower Unit)
const LOWER = { ...UNIT, z: Z0, h: 14 };
// Blade 2: Main Gold DNS Resolver Engine (Core Unit)
const FIREWALL = { ...UNIT, z: LOWER.z + LOWER.h + 1.5, h: 50 };
// Top Server Cap with Isometric Wireframe Globe Emblem & Cooling Vents
const CAP = {
  x: RACK.x,
  y: RACK.y,
  z: FIREWALL.z + FIREWALL.h + 1.5,
  w: RACK.w,
  d: RACK.d,
  h: 6,
};
const LEFT = {
  x: RACK.x,
  y: RACK.y,
  z: Z0,
  w: POST,
  d: RACK.d,
  h: CAP.z - Z0,
};
const RIGHT = { ...LEFT, x: RACK.x + RACK.w - POST };
const KEY = { x: 98, y: 78, z: BASE.h, w: 54, d: 22, h: 6 };
const LCD = { x: 7, y: 5, w: 60, h: 18 };
const SOCKET = { w: 9.2, h: 8.2, y: 33 };

const ACTIVE_PORTS = [1, 3, 5, 7] as const;
const ACTIVE_SET: ReadonlySet<number> = new Set(ACTIVE_PORTS);

const PORTS = Array.from({ length: 8 }, (_, k) => ({
  k,
  x: 7 + k * 13,
  activePort: ACTIVE_SET.has(k),
}));

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

interface DnsServerRackProps {
  domain?: string;
  ip?: string;
  autoCycle?: boolean;
}

export default function DnsServerRack({
  domain = "shop.example",
  ip = "203.0.113.7",
  autoCycle = true,
}: DnsServerRackProps) {
  const [mode, setMode] = useState<DnsServerMode>("resolved");
  const timer = useRef<number>(0);
  const stop = useRef(() => {});
  const clip = useId().replace(/:/g, "");

  useEffect(() => {
    if (!autoCycle) return;
    const interval = window.setInterval(() => {
      setMode((prev) =>
        prev === "inbound"
          ? "lookup"
          : prev === "lookup"
            ? "resolved"
            : "inbound",
      );
    }, 1400);
    return () => window.clearInterval(interval);
  }, [autoCycle]);

  useEffect(
    () => () => {
      window.clearTimeout(timer.current);
      stop.current();
    },
    [],
  );

  const triggerResolve = (audible: boolean) => {
    window.clearTimeout(timer.current);
    stop.current();
    setMode("inbound");
    if (audible) {
      stop.current = playSound("process");
    }
    timer.current = window.setTimeout(() => {
      setMode("lookup");
      if (audible) {
        stop.current();
        stop.current = playSound("cascade", {
          count: PORTS.length,
          stagger: 0.055,
          delay: 0.04,
        });
      }
      timer.current = window.setTimeout(() => {
        setMode("resolved");
        if (audible) {
          stop.current = playSound("success");
        }
      }, 520);
    }, 520);
  };

  const demo = useDemoTap(
    () => {
      triggerResolve(false);
    },
    { delay: 1500 },
  );

  const press = () => {
    demo.dismiss();
    triggerResolve(true);
  };

  const aiming = demo.phase === "aim" || demo.phase === "press";
  const isRed = mode === "inbound";
  const isAmber = mode === "lookup";
  const isGreen = mode === "resolved";

  const statusColor = isRed ? "#ef4444" : isAmber ? "#f59e0b" : "#10b981";

  const READOUT: Readonly<Record<DnsServerMode, string>> = {
    inbound: `● RED INBOUND · A? ${domain}`,
    lookup: `◎ CACHE LOOKUP · UDP/53`,
    resolved: `● GREEN 200 OK · ${ip}`,
  };

  return (
    <Plate
      {...demo.plate}
      fig="Network · DNS Server"
      name="DNS Resolver Rack"
      hint="Press key to resolve domain"
      readout={READOUT[mode]}
      className="fig-dns-scene fig-firewall-rack"
      data-blocked={isGreen}
      fit={[
        BASE,
        {
          x: RACK.x,
          y: RACK.y,
          z: 0,
          w: RACK.w,
          d: RACK.d,
          h: CAP.z + CAP.h,
        },
      ]}
      aspect={1.32}
      label={`An isometric DNS Resolver server rack with an OLED status display, eight RJ45 switch ports, a wireframe globe emblem on the top cap, and a pressable hardware key.`}
    >
      <g ref={demo.ref}>
        {/* 1. Heavy Floor Base */}
        <Box
          {...BASE}
          r={10}
          top={[
            [8, 8],
            [BASE.w - 8, 8],
            [8, BASE.d - 8],
            [BASE.w - 8, BASE.d - 8],
          ].map(([cx, cy]) => (
            <circle
              key={`${cx}-${cy}`}
              className="ik-fill"
              cx={cx}
              cy={cy}
              r={1.7}
            />
          ))}
        />

        {/* 2. Rack Plinth */}
        <Box
          {...PLINTH}
          r={3}
          front={<path className="ik-detail" d={`M4 3h${RACK.w - 8}`} />}
        />

        {/* 3. Left Rack Rail Post */}
        <Box {...LEFT} r={1.5} front={<RackHoles />} />

        {/* 4. Lower High-Speed Cache Blade */}
        <Box
          {...LOWER}
          r={1.5}
          front={
            <>
              <circle
                cx={8}
                cy={LOWER.h / 2}
                r={2.2}
                fill={isGreen ? "#10b981" : "#ef4444"}
              />
              <circle cx={15} cy={LOWER.h / 2} r={1.4} fill="#f59e0b" />
              {Array.from({ length: 15 }, (_, k) => (
                <path
                  key={k}
                  className="ik-detail"
                  d={`M${28 + k * 5.6} 3v${LOWER.h - 6}`}
                />
              ))}
            </>
          }
        />

        {/* 5. Main Gold DNS Resolver Engine Blade */}
        <Box
          {...FIREWALL}
          r={2}
          className="dns-gold-unit"
          front={
            <>
              <defs>
                <clipPath id={`${clip}-lcd`}>
                  <rect
                    x={LCD.x}
                    y={LCD.y}
                    width={LCD.w}
                    height={LCD.h}
                    rx={2.2}
                  />
                </clipPath>
              </defs>
              <path
                className="ik-detail"
                d={`M2.5 6v${FIREWALL.h - 12}M${FIREWALL.w - 2.5} 6v${FIREWALL.h - 12}`}
              />
              {/* High-Contrast Dark OLED Screen */}
              <rect
                x={LCD.x}
                y={LCD.y}
                width={LCD.w}
                height={LCD.h}
                rx={2.2}
                fill="#18181b"
                stroke="#27272a"
                strokeWidth={1}
              />
              <g clipPath={`url(#${clip}-lcd)`}>
                <text
                  x={LCD.x + 4}
                  y={LCD.y + 6.5}
                  fontSize={4.6}
                  fontWeight={700}
                  fill="#a1a1aa"
                  fontFamily="'DM Mono', monospace"
                >
                  {isRed
                    ? "INBOUND QUERY"
                    : isAmber
                      ? "CACHE LOOKUP"
                      : "A-RECORD OK"}
                </text>
                <text
                  x={LCD.x + 4}
                  y={LCD.y + 14.8}
                  fontSize={5.8}
                  fontWeight={700}
                  fill={isRed ? "#f87171" : isAmber ? "#fbbf24" : "#34d399"}
                  fontFamily="'DM Mono', monospace"
                >
                  {isRed ? domain : ip}
                </text>
              </g>

              {/* Status Beacon & DNS SERVER Label */}
              <circle
                cx={75}
                cy={10}
                r={2.5}
                fill={statusColor}
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

              {/* Cooling Slits */}
              {Array.from({ length: 11 }, (_, k) => (
                <path
                  key={k}
                  className="ik-detail"
                  d={`M${74 + k * 3.5} 16v6`}
                />
              ))}

              {/* 8 Ethernet RJ45 Switch Ports */}
              {PORTS.map((port) => {
                const lampColor = port.activePort ? statusColor : "#a8a093";
                return (
                  <g key={port.k}>
                    <circle
                      cx={port.x + SOCKET.w / 2}
                      cy={28.5}
                      r={1.8}
                      fill={lampColor}
                      stroke="#1e1b18"
                      strokeWidth={0.5}
                    />
                    <rect
                      className="ik-well"
                      x={port.x}
                      y={SOCKET.y}
                      width={SOCKET.w}
                      height={SOCKET.h}
                      rx={0.9}
                    />
                    <path
                      className="ik-detail"
                      d={`M${port.x + 3} ${SOCKET.y + SOCKET.h}v-1.8h3.2v1.8`}
                    />
                    {port.activePort ? (
                      <path
                        className="ik-detail"
                        d={`M${port.x + SOCKET.w / 2} ${SOCKET.y + SOCKET.h + 1.6}l1.8 3h-3.6z`}
                      />
                    ) : null}
                  </g>
                );
              })}
            </>
          }
        />

        {/* 6. Right Rack Rail Post */}
        <Box
          {...RIGHT}
          r={1.5}
          front={<RackHoles />}
          side={
            <>
              {Array.from({ length: 9 }, (_, k) => (
                <path
                  key={k}
                  className="ik-detail"
                  d={`M7 ${9 + k * 4.5}h${RACK.d - 14}`}
                />
              ))}
              <rect
                className="ik-well"
                x={7}
                y={RIGHT.h - 11}
                width={9}
                height={5.5}
                rx={1}
              />
            </>
          }
        />

        {/* 7. Gold Top Cap with Wireframe Globe Emblem */}
        <Box
          {...CAP}
          r={3.5}
          className="dns-gold-unit"
          top={
            <>
              <rect
                className="ik-detail"
                x={7}
                y={5}
                width={RACK.w - 14}
                height={RACK.d - 10}
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
                transform={`translate(${RACK.w / 2}, ${RACK.d / 2})`}
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
                  d={`M${RACK.w - 41} ${11 + k * 6.5}h26`}
                />
              ))}
            </>
          }
        />

        {/* 8. Pressable Hardware Key */}
        {!aiming ? <Ripple {...KEY} r={5} /> : null}
        <Press
          label="Resolve DNS query"
          onPress={press}
          data-hot={!isRed}
        >
          <g>
            <Box
              {...KEY}
              r={5}
              top={
                <>
                  <text className="ik-label fw-key" x={6} y={14}>
                    {isRed ? "QUERY" : "200 OK"}
                  </text>
                  <circle
                    cx={KEY.w - 9.5}
                    cy={KEY.d / 2}
                    r={3.5}
                    fill={statusColor}
                    stroke="#1e1b18"
                    strokeWidth={1.2}
                  />
                </>
              }
            />
          </g>
        </Press>
        <Cursor
          at={[KEY.x + KEY.w / 2, KEY.y + KEY.d / 2, KEY.z + KEY.h]}
          phase={demo.phase}
        />
      </g>
    </Plate>
  );
}
```

---

## 3. Original Firewall Rack Component (`src/components/ui/firewall-rack.tsx`)

If you also want the original `firewall-rack.tsx` component with port shutter animations (`BLOCK` / `ALLOW` threats):

```tsx
// src/components/ui/firewall-rack.tsx
import { type CSSProperties, useEffect, useId, useRef, useState } from "react";
import {
  Box,
  Cursor,
  Plate,
  Press,
  playSound,
  Ripple,
  useDemoTap,
} from "react-isokit";
import "react-isokit/styles.css";
import "./firewall-rack-utils/firewall-rack.css";

type Guard = "rest" | "blocked" | "allowed";

const BASE = { x: 0, y: 0, z: 0, w: 160, d: 112, h: 8 };
const RACK = { x: 12, y: 14, w: 126, d: 34 };
const POST = 7;
const PLINTH = { x: RACK.x, y: RACK.y, z: BASE.h, w: RACK.w, d: RACK.d, h: 6 };
const Z0 = PLINTH.z + PLINTH.h;
const UNIT = {
  x: RACK.x + POST,
  y: RACK.y + 1,
  w: RACK.w - 2 * POST,
  d: RACK.d - 2,
};
const LOWER = { ...UNIT, z: Z0, h: 12 };
const FIREWALL = { ...UNIT, z: LOWER.z + LOWER.h + 1, h: 48 };
const CAP = {
  x: RACK.x,
  y: RACK.y,
  z: FIREWALL.z + FIREWALL.h + 1,
  w: RACK.w,
  d: RACK.d,
  h: 5,
};
const LEFT = { x: RACK.x, y: RACK.y, z: Z0, w: POST, d: RACK.d, h: CAP.z - Z0 };
const RIGHT = { ...LEFT, x: RACK.x + RACK.w - POST };
const KEY = { x: 96, y: 78, z: BASE.h, w: 50, d: 22, h: 6 };
const LCD = { x: 7, y: 5, w: 54, h: 16 };
const SOCKET = { w: 9, h: 8, y: 31 };
const THREAT_PORTS = [1, 4, 6] as const;
const THREATS: ReadonlySet<number> = new Set(THREAT_PORTS);
const SCAN_MS = 200;
const STAGGER_MS = 60;
const DROP_MS = 420;
const scanAt = (k: number) => SCAN_MS + k * STAGGER_MS;
const seatAt = (k: number) => scanAt(k) + DROP_MS;
const PORTS = Array.from({ length: 8 }, (_, k) => {
  const order = THREAT_PORTS.indexOf(k as (typeof THREAT_PORTS)[number]);
  return {
    k,
    x: 7 + k * 12.4,
    threat: THREATS.has(k),
    style: {
      "--t": `${scanAt(k)}ms`,
      "--seat": `${seatAt(k)}ms`,
      "--u": `${(THREAT_PORTS.length - 1 - order) * STAGGER_MS}ms`,
    } as CSSProperties,
  };
});
const [FIRST, SECOND, THIRD] = THREAT_PORTS.map(seatAt);
const DONE_MS = THIRD;
const PROGRESS = [
  { text: "scanning", on: 0, off: FIRST },
  { text: "1 of 3", on: FIRST, off: SECOND },
  { text: "2 of 3", on: SECOND, off: THIRD },
  { text: "blocked", on: THIRD, off: undefined },
] as const;
const DONE = { "--done": `${DONE_MS}ms` } as CSSProperties;
const READOUT: Readonly<Record<Guard, string>> = {
  rest: "3 threats · inbound",
  blocked: "3 threats · blocked",
  allowed: "3 threats · allowed",
};

function RackHoles() {
  return (
    <>
      {Array.from({ length: 13 }, (_, k) => (
        <circle
          key={k}
          className="ik-fill"
          cx={POST / 2}
          cy={3.5 + k * 4.6}
          r={0.6}
        />
      ))}
    </>
  );
}

export default function FirewallRack() {
  const [guard, setGuard] = useState<Guard>("rest");
  const [step, setStep] = useState(0);
  const timer = useRef(0);
  const stop = useRef(() => {});
  const clip = useId().replace(/:/g, "");
  useEffect(
    () => () => {
      window.clearTimeout(timer.current);
      stop.current();
    },
    [],
  );

  const blocked = guard === "blocked";
  const toggle = (audible: boolean) => {
    window.clearTimeout(timer.current);
    stop.current();
    if (audible && !blocked) {
      stop.current = playSound("cascade", {
        count: PORTS.length,
        stagger: STAGGER_MS / 1000,
        delay: SCAN_MS / 1000,
      });
      timer.current = window.setTimeout(() => {
        stop.current = playSound("complete");
      }, DONE_MS);
    }
    if (audible && blocked) stop.current = playSound("whoosh");
    setGuard(blocked ? "allowed" : "blocked");
    setStep((step + 1) % 4);
  };
  const demo = useDemoTap(
    () => {
      if (guard === "rest") toggle(false);
    },
    { delay: 1700 },
  );
  const press = () => {
    demo.dismiss();
    toggle(true);
  };
  const aiming = demo.phase === "aim" || demo.phase === "press";

  return (
    <Plate
      {...demo.plate}
      fig="Security"
      name="Firewall rack"
      hint={blocked ? "Press allow" : "Press block"}
      readout={READOUT[guard]}
      className="fig-firewall-rack"
      data-blocked={blocked}
      style={DONE}
      fit={[
        BASE,
        { x: RACK.x, y: RACK.y, z: 0, w: RACK.w, d: RACK.d, h: CAP.z + CAP.h },
      ]}
      aspect={1.3}
      label="A firewall in a rack, with an eight-port front panel, a status screen and a block key. Press block to scan the ports left to right and shut the three carrying suspicious traffic; press allow to open them again."
    >
      <g ref={demo.ref}>
        <Box
          {...BASE}
          r={10}
          top={[
            [8, 8],
            [BASE.w - 8, 8],
            [8, BASE.d - 8],
            [BASE.w - 8, BASE.d - 8],
          ].map(([cx, cy]) => (
            <circle
              key={`${cx}-${cy}`}
              className="ik-fill"
              cx={cx}
              cy={cy}
              r={1.6}
            />
          ))}
        />
        <Box
          {...PLINTH}
          r={3}
          front={<path className="ik-detail" d={`M4 3h${RACK.w - 8}`} />}
        />
        <Box {...LEFT} r={1.5} front={<RackHoles />} />
        <Box
          {...LOWER}
          r={1.5}
          front={
            <>
              <circle className="ik-detail" cx={8} cy={LOWER.h / 2} r={2.2} />
              <circle className="ik-fill" cx={14} cy={LOWER.h / 2} r={1} />
              {Array.from({ length: 14 }, (_, k) => (
                <path
                  key={k}
                  className="ik-detail"
                  d={`M${30 + k * 5.4} 3v${LOWER.h - 6}`}
                />
              ))}
            </>
          }
        />
        <Box
          {...FIREWALL}
          r={1.5}
          front={
            <>
              <defs>
                <clipPath id={`${clip}-lcd`}>
                  <rect
                    x={LCD.x}
                    y={LCD.y}
                    width={LCD.w}
                    height={LCD.h}
                    rx={2}
                  />
                </clipPath>
                {PORTS.map((port) =>
                  port.threat ? (
                    <clipPath key={port.k} id={`${clip}-port-${port.k}`}>
                      <rect
                        x={port.x - 0.5}
                        y={SOCKET.y - 0.5}
                        width={SOCKET.w + 1}
                        height={SOCKET.h + 1}
                      />
                    </clipPath>
                  ) : null,
                )}
              </defs>
              <path
                className="ik-detail"
                d={`M2.5 6v${FIREWALL.h - 12}M${FIREWALL.w - 2.5} 6v${FIREWALL.h - 12}`}
              />
              <rect
                className="ik-screen"
                x={LCD.x}
                y={LCD.y}
                width={LCD.w}
                height={LCD.h}
                rx={2}
              />
              <g clipPath={`url(#${clip}-lcd)`}>
                <text
                  className="ik-screen-text ik-dim"
                  x={LCD.x + 4}
                  y={LCD.y + 5.8}
                  fontSize={5.2}
                >
                  3 threats
                </text>
                <g key={`progress-${step}`}>
                  {blocked ? (
                    PROGRESS.map((frame) => (
                      <text
                        key={frame.text}
                        className={
                          frame.off === undefined
                            ? "ik-screen-text fw-shown"
                            : "ik-screen-text fw-shown fw-passing"
                        }
                        x={LCD.x + 4}
                        y={LCD.y + 13.8}
                        fontSize={7}
                        style={
                          {
                            "--on": `${frame.on}ms`,
                            "--off": `${frame.off ?? 0}ms`,
                          } as CSSProperties
                        }
                      >
                        {frame.text}
                      </text>
                    ))
                  ) : (
                    <g className="ik-enter">
                      <text
                        className="ik-screen-text"
                        x={LCD.x + 4}
                        y={LCD.y + 13.8}
                        fontSize={7}
                      >
                        {guard === "allowed" ? "allowed" : "inbound"}
                      </text>
                    </g>
                  )}
                </g>
              </g>
              <circle className="fw-status" cx={71} cy={9.6} r={2} />
              <text className="ik-label fw-tag" x={76} y={11.5}>
                SHIELD
              </text>
              {Array.from({ length: 10 }, (_, k) => (
                <path
                  key={k}
                  className="ik-detail"
                  d={`M${70 + k * 3.4} 15.4v5.6`}
                />
              ))}
              {PORTS.map((port) => (
                <g key={port.k} style={port.style}>
                  <circle
                    className={port.threat ? "fw-lamp ik-loop" : "fw-lamp"}
                    data-threat={port.threat}
                    cx={port.x + SOCKET.w / 2}
                    cy={27}
                    r={1.7}
                  />
                  <rect
                    className="ik-well"
                    x={port.x}
                    y={SOCKET.y}
                    width={SOCKET.w}
                    height={SOCKET.h}
                    rx={0.8}
                  />
                  <path
                    className="ik-detail"
                    d={`M${port.x + 3} ${SOCKET.y + SOCKET.h}v-1.8h3v1.8`}
                  />
                  {port.threat ? (
                    <>
                      <g clipPath={`url(#${clip}-port-${port.k})`}>
                        <g className="fw-shutter">
                          <rect
                            className="ik-face"
                            x={port.x}
                            y={SOCKET.y}
                            width={SOCKET.w}
                            height={SOCKET.h}
                            rx={0.8}
                          />
                          <path
                            className="ik-detail"
                            d={`M${port.x + 1.4} ${SOCKET.y + 2.7}h${SOCKET.w - 2.8}M${port.x + 1.4} ${SOCKET.y + 5.3}h${SOCKET.w - 2.8}`}
                          />
                        </g>
                      </g>
                      <path
                        className="ik-detail"
                        d={`M${port.x + SOCKET.w / 2} ${SOCKET.y + SOCKET.h + 1.8}l2 3.4h-4z`}
                      />
                    </>
                  ) : null}
                </g>
              ))}
            </>
          }
        />
        <Box
          {...RIGHT}
          r={1.5}
          front={<RackHoles />}
          side={
            <>
              {Array.from({ length: 8 }, (_, k) => (
                <path
                  key={k}
                  className="ik-detail"
                  d={`M7 ${10 + k * 4.4}h${RACK.d - 14}`}
                />
              ))}
              <rect
                className="ik-well"
                x={7}
                y={RIGHT.h - 10}
                width={7}
                height={5}
                rx={1}
              />
            </>
          }
        />
        <Box
          {...CAP}
          r={3}
          top={
            <>
              <rect
                className="ik-detail"
                x={8}
                y={6}
                width={RACK.w - 16}
                height={RACK.d - 12}
                rx={3}
              />
              {Array.from({ length: 4 }, (_, k) => (
                <path
                  key={k}
                  className="ik-detail"
                  d={`M18 ${10.5 + k * 4.4}h${RACK.w - 36}`}
                />
              ))}
            </>
          }
        />

        {guard === "rest" && !aiming ? <Ripple {...KEY} r={5} /> : null}
        <Press
          label={blocked ? "Allow the ports again" : "Block suspicious traffic"}
          onPress={press}
          data-hot={!blocked}
        >
          <g>
            <Box
              {...KEY}
              r={5}
              top={
                <>
                  <text className="ik-label fw-key" x={7} y={14}>
                    {blocked ? "ALLOW" : "BLOCK"}
                  </text>
                  <g
                    className="ik-detail ik-thick"
                    transform={`translate(${KEY.w - 10} ${KEY.d / 2})`}
                  >
                    <circle r={3.6} />
                    {blocked ? null : <path d="M-2.5 2.5L2.5-2.5" />}
                  </g>
                </>
              }
            />
          </g>
        </Press>
        <Cursor
          at={[KEY.x + KEY.w / 2, KEY.y + KEY.d / 2, KEY.z + KEY.h]}
          phase={demo.phase}
        />
      </g>
    </Plate>
  );
}
```

---

## 4. Combined Laptop ↔ DNS Resolver Server Scene (`src/components/ui/dns-resolver-diagram.tsx`)

This is the complete combined scene uniting the **Laptop** (bottom-left) and the **DNS Resolver Server Rack** (top-right) along a true 30° isometric axis with the continuous **Red Request Dot → Green Response Dot** loop and the 4 floating pill callouts:

```tsx
// src/components/ui/dns-resolver-diagram.tsx
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

export interface DnsTarget {
  domain: string;
  ip: string;
}

export const DNS_TARGETS: readonly DnsTarget[] = [
  { domain: "shop.example", ip: "203.0.113.7" },
  { domain: "api.stripe.com", ip: "198.51.100.24" },
  { domain: "dns.google.dev", ip: "192.0.2.88" },
];

/* 1. LAPTOP STATION — Bottom-Left (LX=0, LY=224) */
const LX = 0;
const LY = 224;

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

/* 2. DNS RESOLVER SERVER RACK — Top-Right (RX=12, RY=0) */
const RX = 12;
const RY = 0;

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

/* 3. 30° ISOMETRIC CONNECTION PATH (Laptop <-> DNS Server) */
const LINK_LAPTOP_PT: Vec3 = [96, L_BASE.y, 6];
const LINK_DNS_PT: Vec3 = [96, R_BASE.y + R_BASE.d, 6];

const SIGNAL_OUT: readonly Vec3[] = [
  L_DISC_TOP,
  [96, L_DISC_TOP[1], L_BASE.h + 1],
  LINK_LAPTOP_PT,
  LINK_DNS_PT,
  [96, R_FIREWALL.y + R_FIREWALL.d, R_FIREWALL.z + 20],
];

const SIGNAL_BACK: readonly Vec3[] = [
  [96, R_FIREWALL.y + R_FIREWALL.d, R_FIREWALL.z + 20],
  LINK_DNS_PT,
  LINK_LAPTOP_PT,
  [L_LID.x + L_LID.w / 2, L_LID.y + L_LID.d, L_LID.z + L_LID.h / 2],
];

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
  targetIndex?: number;
  onCycleChange?: (cycle: PacketCycle) => void;
}

export default function DnsResolverDiagram({
  targetIndex = 0,
  onCycleChange,
}: DnsResolverDiagramProps) {
  const target = DNS_TARGETS[targetIndex] ?? DNS_TARGETS[0];
  const [dotT, setDotT] = useState(0);
  const [cycle, setCycle] = useState<PacketCycle>("request");
  const [pulseKey, setPulseKey] = useState(0);

  const cycleRef = useRef<PacketCycle>("request");
  const onCycleChangeRef = useRef(onCycleChange);
  onCycleChangeRef.current = onCycleChange;

  const clip = useId().replace(/:/g, "");

  useEffect(() => {
    let rafId = 0;
    const OUT_MS = 1350;
    const HOLD_SERVER_MS = 380;
    const BACK_MS = 1350;
    const HOLD_LAPTOP_MS = 420;
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
  }, [targetIndex]);

  const demo = useDemoTap(() => {}, { delay: 1400 });

  const handleManualPing = () => {
    demo.dismiss();
    playSound(cycle === "response" ? "success" : "process");
  };

  const aiming = demo.phase === "aim" || demo.phase === "press";
  const isRedRequest = cycle === "request";
  const isServerProcessing = cycle === "processing";
  const isGreenResponse = cycle === "response";

  const activeColor = isRedRequest
    ? "#ef4444"
    : isServerProcessing
      ? "#f59e0b"
      : "#10b981";
  const activeGlow = isRedRequest
    ? "rgba(239, 68, 68, 0.35)"
    : isServerProcessing
      ? "rgba(245, 158, 11, 0.35)"
      : "rgba(16, 185, 129, 0.35)";

  const [p1x, p1y] = project(...LINK_LAPTOP_PT);
  const [p2x, p2y] = project(...LINK_DNS_PT);
  const dx = p2x - p1x;
  const dy = p2y - p1y;
  const dist = Math.hypot(dx, dy) || 1;
  const ux = dx / dist;
  const uy = dy / dist;

  const lineStartX = p1x + ux * 8;
  const lineStartY = p1y + uy * 8;
  const lineEndX = p2x - ux * 8;
  const lineEndY = p2y - uy * 8;

  const dotX = lineStartX + (lineEndX - lineStartX) * dotT;
  const dotY = lineStartY + (lineEndY - lineStartY) * dotT;

  const [urlPillX, urlPillY] = project(
    L_LID.x + L_LID.w / 2,
    L_LID.y,
    L_LID.z + L_LID.h + 22,
  );
  const [youPillX, youPillY] = project(
    L_BASE.x + L_BASE.w / 2,
    L_BASE.y + L_BASE.d + 24,
    0,
  );
  const [ipPillX, ipPillY] = project(
    R_CAP.x + R_CAP.w / 2,
    R_CAP.y + R_CAP.d / 2,
    R_CAP.z + R_CAP.h + 24,
  );
  const [wherePillX, wherePillY] = project(
    188,
    (LINK_LAPTOP_PT[1] + LINK_DNS_PT[1]) / 2 + 18,
    0,
  );

  const READOUT: Readonly<Record<PacketCycle, string>> = {
    request: `● RED REQ → where is ${target.domain}?`,
    processing: `◎ DNS SERVER → looking up A record`,
    response: `● GREEN RES ← ${target.ip}`,
  };

  return (
    <Plate
      {...demo.plate}
      fig="Network · Live Loop"
      name="Laptop ↔ DNS Resolver Server"
      hint="Red dot = Request out · Green dot = Response back"
      readout={READOUT[cycle]}
      className="fig-dns-scene fig-security-key fig-firewall-rack"
      data-unlocked={isGreenResponse}
      data-blocked={isGreenResponse}
      fit={[
        L_BASE,
        { ...L_LID, z: 0, h: L_LID.z + L_LID.h + 34 },
        L_KEY,
        R_BASE,
        {
          x: R_RACK.x,
          y: R_RACK.y,
          z: 0,
          w: R_RACK.w,
          d: R_RACK.d,
          h: R_CAP.z + R_CAP.h + 36,
        },
        [L_BASE.x + L_BASE.w / 2, L_BASE.y + L_BASE.d + 36, 0],
        [245, 175, 0],
      ]}
      aspect={1.55}
      pad={0.07}
      label={`Continuous DNS resolution loop: a red request dot travels from the laptop to the DNS resolver server rack, and a green response dot returns with IP ${target.ip}.`}
    >
      <g ref={demo.ref}>
        {/* PART A: DNS RESOLVER SERVER RACK (Top-Right) */}
        <g className="dns-rack-station">
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
                      ? "INBOUND QUERY"
                      : isServerProcessing
                        ? "CACHE LOOKUP"
                        : "A-RECORD OK"}
                  </text>
                  <text
                    x={R_LCD.x + 4}
                    y={R_LCD.y + 14.8}
                    fontSize={5.8}
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
                    {isRedRequest ? target.domain : target.ip}
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
                  const lampColor = port.activePort ? activeColor : "#a8a093";
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

        {/* PART B: BIDIRECTIONAL CONNECTION LINE + RED/GREEN PACKET DOT */}
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
          <circle cx={dotX} cy={dotY} r={9.5} fill={activeGlow} />
          <circle
            cx={dotX}
            cy={dotY}
            r={5.6}
            fill={activeColor}
            stroke="#1e1b18"
            strokeWidth={2}
          />
          <circle
            cx={dotX - 1.6}
            cy={dotY - 1.6}
            r={1.5}
            fill="#ffffff"
            opacity={0.85}
          />
        </g>

        {/* PART C: LAPTOP & SECURITY KEY (Bottom-Left) */}
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
                    height={8}
                    fill="#ede8de"
                  />
                  <circle cx={L_SCREEN.x + 5} cy={L_SCREEN.y + 4} r={1.3} fill="#ef4444" />
                  <circle cx={L_SCREEN.x + 9} cy={L_SCREEN.y + 4} r={1.3} fill="#f59e0b" />
                  <circle cx={L_SCREEN.x + 13} cy={L_SCREEN.y + 4} r={1.3} fill="#10b981" />
                  <rect
                    x={L_SCREEN.x + 6}
                    y={L_SCREEN.y + 12}
                    width={L_SCREEN.w - 12}
                    height={16}
                    rx={2}
                    fill={isGreenResponse ? "#b8e6cf" : "#c8bce8"}
                  />
                  <rect
                    x={L_SCREEN.x + 6}
                    y={L_SCREEN.y + 32}
                    width={L_SCREEN.w - 24}
                    height={3.6}
                    rx={1.5}
                    fill="#ccc7be"
                  />
                  <rect
                    x={L_SCREEN.x + 6}
                    y={L_SCREEN.y + 38}
                    width={L_SCREEN.w - 40}
                    height={3.6}
                    rx={1.5}
                    fill="#dbd7cf"
                  />
                  <circle
                    cx={L_SCREEN.x + 11}
                    cy={50.5}
                    r={2.1}
                    fill={activeColor}
                  />
                  <text
                    className="ik-screen-text"
                    x={L_SCREEN.x + L_SCREEN.w / 2 + 3}
                    y={52}
                    fontSize={4.9}
                    fontWeight={700}
                    textAnchor="middle"
                  >
                    {isRedRequest
                      ? `REQ → ${target.domain}`
                      : `RES ← ${target.ip}`}
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

        {/* PART D: FLOATING CALLOUT PILLS */}
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
            fontSize={10.8}
            fontWeight={600}
            fontFamily="'DM Mono', monospace"
          >
            {`https://${target.domain}`}
          </text>
        </g>

        <g transform={`translate(${ipPillX}, ${ipPillY})`}>
          <rect
            x={-68}
            y={-12}
            width={136}
            height={26}
            rx={13}
            fill="#1e1b18"
            opacity={0.15}
          />
          <rect
            x={-68}
            y={-13.5}
            width={136}
            height={26}
            rx={13}
            fill={isGreenResponse ? "#d1fae5" : "#f9dfa2"}
            stroke={isGreenResponse ? "#059669" : "#1e1b18"}
            strokeWidth={1.9}
          />
          <circle
            cx={-52}
            cy={-0.5}
            r={3.8}
            fill="#10b981"
            stroke="#1e1b18"
            strokeWidth={1.2}
          />
          <text
            x={6}
            y={3.2}
            textAnchor="middle"
            fill="#1e1b18"
            fontSize={10.8}
            fontWeight={700}
            fontFamily="'DM Mono', monospace"
          >
            {`→ ${target.ip}`}
          </text>
        </g>

        <g transform={`translate(${wherePillX}, ${wherePillY})`}>
          <rect
            x={-88}
            y={-12}
            width={176}
            height={25}
            rx={12.5}
            fill="#1e1b18"
            opacity={0.15}
          />
          <rect
            x={-88}
            y={-13.5}
            width={176}
            height={25}
            rx={12.5}
            fill={isRedRequest ? "#fee2e2" : "#ffffff"}
            stroke={isRedRequest ? "#dc2626" : "#1e1b18"}
            strokeWidth={1.9}
          />
          <circle
            cx={-73}
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
            fontSize={10.2}
            fontWeight={600}
            fontFamily="'DM Mono', monospace"
          >
            {isRedRequest
              ? `where is ${target.domain}?`
              : `resolved: ${target.ip}`}
          </text>
        </g>

        <g transform={`translate(${youPillX}, ${youPillY})`}>
          <rect
            x={-32}
            y={-11.5}
            width={64}
            height={24}
            rx={12}
            fill="#1e1b18"
            opacity={0.15}
          />
          <rect
            x={-32}
            y={-13}
            width={64}
            height={24}
            rx={12}
            fill="#ffffff"
            stroke="#1e1b18"
            strokeWidth={1.8}
          />
          <g
            transform="translate(-14, -1.5)"
            fill="none"
            stroke="#1e1b18"
            strokeWidth={1.8}
            strokeLinecap="round"
          >
            <circle cx={0} cy={-2.6} r={2.5} />
            <path d="M -4.4 4.4 a 4.5 4.5 0 0 1 8.8 0" />
          </g>
          <text
            x={7}
            y={2.8}
            textAnchor="middle"
            fill="#1e1b18"
            fontSize={10.8}
            fontWeight={600}
            fontFamily="'DM Mono', monospace"
          >
            you
          </text>
        </g>

        <Cursor at={L_DISC_TOP} phase={demo.phase} />
      </g>
    </Plate>
  );
}
```

---

## 5. Required Stylesheets

### A. Firewall Rack CSS (`src/components/ui/firewall-rack-utils/firewall-rack.css`)

```css
/* src/components/ui/firewall-rack-utils/firewall-rack.css */
.fig-firewall-rack {
  --fw-threat: #e54d2e;
  --fw-safe: #30a46c;
}

.fig-firewall-rack .fw-status {
  fill: var(--fw-threat);
  transition: fill 240ms var(--ik-ease) var(--done, 0ms);
}

.fig-firewall-rack[data-blocked="true"] .fw-status {
  fill: var(--fw-safe);
}

.fig-firewall-rack .fw-tag {
  font-size: 5.5px;
  letter-spacing: 0.14em;
}

.fig-firewall-rack .fw-key {
  font-size: 7.2px;
  letter-spacing: 0.12em;
  fill: var(--ik-ink-hi);
}

.fig-firewall-rack .fw-lamp {
  fill: var(--ik-detail);
  transition: fill 200ms var(--ik-ease);
}

.fig-firewall-rack .fw-lamp[data-threat="true"] {
  fill: var(--fw-threat);
  animation: ik-pulse 1.2s ease-in-out infinite;
}

.fig-firewall-rack[data-blocked="true"] .fw-lamp[data-threat="true"] {
  fill: var(--ik-detail);
  animation: none;
  transition-delay: var(--seat, 0ms);
}

.fig-firewall-rack .fw-shutter {
  transform: translateY(-9px);
  transition: transform 360ms cubic-bezier(0.22, 1, 0.36, 1) var(--u, 0ms);
}

.fig-firewall-rack[data-blocked="true"] .fw-shutter {
  transform: translateY(0);
  transition: transform 420ms cubic-bezier(0.34, 1.56, 0.64, 1) var(--t, 0ms);
}

.fig-firewall-rack .fw-shown {
  opacity: 0;
  animation: fw-show 1ms linear var(--on, 0ms) forwards;
}

.fig-firewall-rack .fw-passing {
  animation:
    fw-show 1ms linear var(--on, 0ms) forwards,
    fw-hide 1ms linear var(--off, 0ms) forwards;
}

@keyframes fw-show {
  to {
    opacity: 1;
  }
}

@keyframes fw-hide {
  to {
    opacity: 0;
  }
}
```

### B. Main Theme & Gold DNS Server Unit CSS (`src/index.css`)

```css
/* src/index.css */
@import "tailwindcss";
@import "tw-animate-css";
@import "react-isokit/styles.css";

/* Warm Gold DNS Resolver Server Unit */
.fig-dns-scene .dns-gold-unit {
  --ik-top: #f9e3a8;
  --ik-front: #f3d289;
  --ik-side: #e4bc68;
  --ik-line: #23201c;
  --ik-detail: #9e7b2f;
}

/* Isometric Grid Stage & Custom Plate Palette */
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
```

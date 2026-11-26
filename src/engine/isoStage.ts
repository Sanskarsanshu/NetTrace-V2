import type {
  NodeTone,
  PacketKind,
  SceneEntity,
  SceneFlow,
  SceneLink,
  SceneSpec,
  StageMiniCard,
} from '../types';

const SVG_NS = 'http://www.w3.org/2000/svg';

/** Exact reference pastel top/side/highlight palette from designed-to-scale SVG defs */
const TONE_COLORS: Record<
  NodeTone,
  { top: string; topHi: string; left: string; right: string; rim: string }
> = {
  blue: { top: '#cde0f5', topHi: '#dfebf9', left: '#bcd3ef', right: '#a9c5e8', rim: '#211e1b' },
  orange: { top: '#fcd4ad', topHi: '#fee6cc', left: '#f9c697', right: '#f3b47f', rim: '#211e1b' },
  gold: { top: '#fee7b8', topHi: '#fff3d6', left: '#fcdb9c', right: '#f6cd82', rim: '#211e1b' },
  green: { top: '#d1e9c2', topHi: '#e2f2d7', left: '#c3e1b2', right: '#b3d79f', rim: '#211e1b' },
  violet: { top: '#e6dbf4', topHi: '#f2eaf9', left: '#d9cbef', right: '#cbbae6', rim: '#211e1b' },
  rose: { top: '#f4c6c1', topHi: '#fadcd9', left: '#e6a59e', right: '#d88b83', rim: '#211e1b' },
  slate: { top: '#f0e7dc', topHi: '#f7f0e7', left: '#ece2d5', right: '#e3d7c8', rim: '#211e1b' },
};

const PACKET_STYLE: Record<PacketKind, { fill: string; stroke: string; shape: 'circle' | 'rect' }> = {
  http: { fill: '#f3b47f', stroke: '#1d1b18', shape: 'circle' },
  tls: { fill: '#b79ce6', stroke: '#1d1b18', shape: 'circle' },
  tcp: { fill: '#7fb4e8', stroke: '#1d1b18', shape: 'rect' },
  ip: { fill: '#efb041', stroke: '#1d1b18', shape: 'rect' },
  eth: { fill: '#9fd28f', stroke: '#1d1b18', shape: 'rect' },
  bits: { fill: '#5d5466', stroke: '#1d1b18', shape: 'rect' },
  res: { fill: '#9fd28f', stroke: '#1d1b18', shape: 'circle' },
  fail: { fill: '#e5534b', stroke: '#7d241d', shape: 'circle' },
};

const OSI_LAYERS = [
  { num: 7, short: 'L7', name: 'Application', pdu: 'HTTP Data', top: '#fbd2ab', left: '#f2b780', right: '#e7a262' },
  { num: 6, short: 'L6', name: 'Presentation', pdu: 'TLS / UTF-8', top: '#dfd2f4', left: '#c5b1e8', right: '#b098dc' },
  { num: 5, short: 'L5', name: 'Session', pdu: 'Socket / Sync', top: '#f4c6c1', left: '#e6a59e', right: '#d88b83' },
  { num: 4, short: 'L4', name: 'Transport', pdu: 'TCP Segment', top: '#c9dcf5', left: '#a9c5ec', right: '#92b3e3' },
  { num: 3, short: 'L3', name: 'Network', pdu: 'IP Packet', top: '#f9e0a0', left: '#efc86e', right: '#e2b54f' },
  { num: 2, short: 'L2', name: 'Data Link', pdu: 'Eth Frame', top: '#cae4b8', left: '#aad18f', right: '#92be74' },
  { num: 1, short: 'L1', name: 'Physical', pdu: '0101 Bits', top: '#dedad4', left: '#c5bfb6', right: '#b0a89d' },
];

// Accurate canvas text width measurement (same trick used in designed-to-scale)
let measureCtx: CanvasRenderingContext2D | null = null;
const widthCache = new Map<string, number>();

function measureTextWidth(text: string, fontSize = 10.5, weight = 700): number {
  const key = `${weight}|${fontSize}|${text}`;
  const cached = widthCache.get(key);
  if (cached !== undefined) return cached;
  if (!measureCtx) {
    measureCtx = document.createElement('canvas').getContext('2d');
  }
  let w = text.length * fontSize * 0.62;
  if (measureCtx) {
    measureCtx.font = `${weight} ${fontSize}px "JetBrains Mono", ui-monospace, monospace`;
    w = measureCtx.measureText(text).width;
  }
  widthCache.set(key, w);
  return w;
}

function el(tag: string, attrs: Record<string, string | number> = {}, text?: string): SVGElement {
  const node = document.createElementNS(SVG_NS, tag);
  for (const [k, v] of Object.entries(attrs)) {
    node.setAttribute(k, String(v));
  }
  if (text !== undefined) node.textContent = text;
  return node;
}

/** Smoothly rounded closed polygon path (rounds every vertex by radius r) */
function roundedPolyPath(pts: [number, number][], r: number): string {
  const n = pts.length;
  let d = '';
  for (let i = 0; i < n; i++) {
    const prev = pts[(i - 1 + n) % n];
    const curr = pts[i];
    const next = pts[(i + 1) % n];

    const v1x = prev[0] - curr[0];
    const v1y = prev[1] - curr[1];
    const l1 = Math.hypot(v1x, v1y) || 1;

    const v2x = next[0] - curr[0];
    const v2y = next[1] - curr[1];
    const l2 = Math.hypot(v2x, v2y) || 1;

    const cr = Math.min(r, l1 * 0.38, l2 * 0.38);
    const p1x = curr[0] + (v1x / l1) * cr;
    const p1y = curr[1] + (v1y / l1) * cr;
    const p2x = curr[0] + (v2x / l2) * cr;
    const p2y = curr[1] + (v2y / l2) * cr;

    d += i === 0 ? `M ${p1x.toFixed(2)} ${p1y.toFixed(2)}` : ` L ${p1x.toFixed(2)} ${p1y.toFixed(2)}`;
    d += ` Q ${curr[0].toFixed(2)} ${curr[1].toFixed(2)} ${p2x.toFixed(2)} ${p2y.toFixed(2)}`;
  }
  return d + ' Z';
}

/** Smoothly rounded open polyline path for isometric links */
function roundedOpenPath(pts: [number, number][], r = 14): string {
  if (pts.length < 2) return '';
  if (pts.length === 2) {
    return `M ${pts[0][0].toFixed(1)} ${pts[0][1].toFixed(1)} L ${pts[1][0].toFixed(1)} ${pts[1][1].toFixed(1)}`;
  }
  let d = `M ${pts[0][0].toFixed(1)} ${pts[0][1].toFixed(1)}`;
  for (let i = 1; i < pts.length - 1; i++) {
    const prev = pts[i - 1];
    const curr = pts[i];
    const next = pts[i + 1];
    const v1x = prev[0] - curr[0];
    const v1y = prev[1] - curr[1];
    const l1 = Math.hypot(v1x, v1y) || 1;
    const v2x = next[0] - curr[0];
    const v2y = next[1] - curr[1];
    const l2 = Math.hypot(v2x, v2y) || 1;
    const cr = Math.min(r, l1 * 0.4, l2 * 0.4);
    const p1x = curr[0] + (v1x / l1) * cr;
    const p1y = curr[1] + (v1y / l1) * cr;
    const p2x = curr[0] + (v2x / l2) * cr;
    const p2y = curr[1] + (v2y / l2) * cr;
    d += ` L ${p1x.toFixed(1)} ${p1y.toFixed(1)} Q ${curr[0].toFixed(1)} ${curr[1].toFixed(1)} ${p2x.toFixed(1)} ${p2y.toFixed(1)}`;
  }
  const last = pts[pts.length - 1];
  d += ` L ${last[0].toFixed(1)} ${last[1].toFixed(1)}`;
  return d;
}

/**
 * Draw a plump, rounded 3D isometric cushion/block — matching designed-to-scale's signature blocks.
 * Center of the top diamond is at (0, 0).
 */
function buildRoundedIsoPrism(
  rx: number,
  ry: number,
  depth: number,
  cornerR: number,
  colors: { top: string; topHi?: string; left: string; right: string },
  strokeWidth = 1.9
): SVGElement {
  const g = el('g');

  // Outer silhouette (rounded hexagon: top, right-top, right-bot, bottom-bot, left-bot, left-top)
  const outerPts: [number, number][] = [
    [0, -ry],
    [rx, 0],
    [rx, depth],
    [0, ry + depth],
    [-rx, depth],
    [-rx, 0],
  ];

  // Top face diamond
  const topPts: [number, number][] = [
    [0, -ry],
    [rx, 0],
    [0, ry],
    [-rx, 0],
  ];

  // Soft warm ground shadow (exact #6b5236 tint from reference SVG)
  g.appendChild(
    el('path', {
      d: roundedPolyPath(outerPts, cornerR),
      fill: '#6b5236',
      opacity: '0.24',
      transform: `translate(0, 8)`,
      filter: 'url(#soft-shadow)',
    })
  );

  // Base fill (left side tone)
  const outerPath = roundedPolyPath(outerPts, cornerR);
  g.appendChild(el('path', { d: outerPath, fill: colors.left }));

  // Right shaded bevel clipped inside silhouette
  const clipId = `clip-${Math.random().toString(36).slice(2, 9)}`;
  const cp = el('clipPath', { id: clipId });
  cp.appendChild(el('path', { d: outerPath }));
  g.appendChild(cp);

  const inner = el('g', { 'clip-path': `url(#${clipId})` });
  // Right half lower bevel
  inner.appendChild(
    el('path', {
      d: `M 0 ${ry - 2} L ${rx + 4} -2 L ${rx + 4} ${ry + depth + 6} L 0 ${ry + depth + 6} Z`,
      fill: colors.right,
    })
  );
  // Top diamond face
  inner.appendChild(
    el('path', {
      d: roundedPolyPath(topPts, cornerR),
      fill: colors.top,
    })
  );
  // Crisp white V-edge rim highlight (signature designed-to-scale bevel sheen)
  inner.appendChild(
    el('path', {
      d: `M ${-rx} 0 L -7 ${(ry - 3.5).toFixed(1)} Q 0 ${ry} 7 ${(ry - 3.5).toFixed(1)} L ${rx} 0`,
      transform: 'translate(0 1.4)',
      fill: 'none',
      stroke: '#ffffff',
      'stroke-opacity': '0.75',
      'stroke-width': 1.6,
      'stroke-linecap': 'round',
    })
  );
  g.appendChild(inner);

  // Crisp single outer ink stroke
  g.appendChild(
    el('path', {
      d: outerPath,
      fill: 'none',
      stroke: '#1d1b18',
      'stroke-width': strokeWidth,
      'stroke-linejoin': 'round',
    })
  );

  return g;
}

/** 2:1 isometric projection centered at (460, 290) inside a 920x540 viewBox */
export function iso(x: number, y: number): [number, number] {
  const sx = 460 + (x - y) * 32;
  const sy = 290 + (x + y) * 16;
  return [sx, sy];
}

function drawBlockGlyph(icon: string | undefined): string {
  switch (icon) {
    case 'server':
      return `<rect x="-12" y="-13" width="24" height="8" rx="2" fill="#ffffff" fill-opacity="0.55" stroke="currentColor" stroke-width="1.7"/>
              <rect x="-12" y="-2.5" width="24" height="8" rx="2" fill="#ffffff" fill-opacity="0.55" stroke="currentColor" stroke-width="1.7"/>
              <circle cx="-7.5" cy="-9" r="1.4" fill="currentColor"/>
              <circle cx="-7.5" cy="1.5" r="1.4" fill="currentColor"/>
              <path d="M-2.5 -9h8.5M-2.5 1.5h8.5" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/>`;
    case 'router':
      return `<circle cx="0" cy="-4" r="10.5" fill="#ffffff" fill-opacity="0.5" stroke="currentColor" stroke-width="1.7"/>
              <path d="M-6.5 -4h13M0 -10.5v13M-3.5 -8l3.5-2.5 3.5 2.5M-3.5 0l3.5 2.5 3.5-2.5" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>`;
    case 'switch':
      return `<rect x="-14" y="-11" width="28" height="14" rx="2.5" fill="#ffffff" fill-opacity="0.55" stroke="currentColor" stroke-width="1.7"/>
              <path d="M-8 -6.5h11m0 0-2.5-2.2m2.5 2.2-2.5 2.2M8 -1.5H-3m0 0 2.5-2.2m-2.5 2.2 2.5 2.2" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>`;
    case 'globe':
      return `<circle cx="0" cy="-4" r="10" fill="#ffffff" fill-opacity="0.5" stroke="currentColor" stroke-width="1.7"/>
              <ellipse cx="0" cy="-4" rx="4.5" ry="10" fill="none" stroke="currentColor" stroke-width="1.4"/>
              <path d="M-10 -4h20" stroke="currentColor" stroke-width="1.4"/>`;
    case 'lock':
      return `<rect x="-8" y="-5" width="16" height="11" rx="2.5" fill="#ffffff" fill-opacity="0.6" stroke="currentColor" stroke-width="1.7"/>
              <path d="M-4.5 -5v-3.5a4.5 4.5 0 0 1 9 0V-5" fill="none" stroke="currentColor" stroke-width="1.7"/>`;
    default:
      return `<circle cx="0" cy="-4" r="4.5" fill="#ffffff" fill-opacity="0.6" stroke="currentColor" stroke-width="1.7"/>
              <path d="M-11 -4h6.5M4.5 -4h6.5" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"/>`;
  }
}

function drawPill(
  text: string,
  tone: 'neutral' | 'good' | 'warn' | 'bad' | 'violet' | 'blue' = 'neutral',
  x = 0,
  y = 0
): SVGElement {
  const g = el('g', { transform: `translate(${x.toFixed(1)}, ${y.toFixed(1)})` });
  const textW = measureTextWidth(text, 10.5, 700);
  const w = Math.max(54, Math.ceil(textW + 22));
  const h = 21;
  const bgMap = {
    neutral: '#fbf7f1',
    good: '#dff0de',
    warn: '#fbe5bd',
    bad: '#f8d5cf',
    violet: '#e7ddf5',
    blue: '#d6e5f6',
  };
  const inkMap = {
    neutral: '#1d1b18',
    good: '#1d441a',
    warn: '#6d4a0c',
    bad: '#7d241d',
    violet: '#3a2a6b',
    blue: '#1a426b',
  };

  // Hard pop shadow
  g.appendChild(
    el('rect', {
      x: -w / 2 + 1.2,
      y: -h / 2 + 1.8,
      width: w,
      height: h,
      rx: h / 2,
      fill: 'var(--drop)',
      opacity: '0.88',
    })
  );
  // Pill body
  g.appendChild(
    el('rect', {
      x: -w / 2,
      y: -h / 2,
      width: w,
      height: h,
      rx: h / 2,
      fill: bgMap[tone],
      stroke: '#1d1b18',
      'stroke-width': 1.4,
    })
  );
  // Mathematically centered text
  g.appendChild(
    el(
      'text',
      {
        x: 0,
        y: 0.5,
        'text-anchor': 'middle',
        'dominant-baseline': 'central',
        fill: inkMap[tone],
        'font-size': 10.5,
        'font-weight': 700,
      },
      text
    )
  );
  return g;
}

function renderLaptop(entity: SceneEntity): SVGElement {
  const g = el('g');

  // 1. Rounded isometric pedestal (warm cream cushion matching image.png!)
  g.appendChild(
    buildRoundedIsoPrism(
      56,
      29,
      10,
      11,
      { top: '#f7f0e6', topHi: '#ffffff', left: '#e5dacb', right: '#d8cbb9' },
      1.8
    )
  );

  // 2. Laptop keyboard deck (sleek light silver-grey resting on pedestal)
  const deckPts: [number, number][] = [
    [-2, -13],
    [31, 3.5],
    [3, 18],
    [-30, 1.5],
  ];
  g.appendChild(
    el('path', {
      d: roundedPolyPath(deckPts, 4),
      fill: '#d8d2c9',
      stroke: '#1d1b18',
      'stroke-width': 1.5,
      transform: 'translate(0, 3)',
    })
  );
  g.appendChild(
    el('path', {
      d: roundedPolyPath(deckPts, 4),
      fill: '#f2ede6',
      stroke: '#1d1b18',
      'stroke-width': 1.6,
    })
  );
  // Keyboard inset grid + trackpad
  g.appendChild(
    el('path', {
      d: 'M-19 0 L-1 -9 L14 -1.5 L-4 7.5 Z',
      fill: '#cfc8be',
      stroke: '#6f6961',
      'stroke-width': 0.8,
    })
  );
  g.appendChild(
    el('path', {
      d: 'M1 9 L9 5 L17 9 L9 13 Z',
      fill: '#e3ddd4',
      stroke: '#8b847a',
      'stroke-width': 0.8,
    })
  );

  // 3. Laptop screen lid (angled upright along back-left edge)
  const lidPts: [number, number][] = [
    [-30, 1.5],
    [-2, -13],
    [-2, -48],
    [-30, -33.5],
  ];
  // Outer back bezel
  g.appendChild(
    el('path', {
      d: roundedPolyPath(lidPts, 4),
      fill: '#46413b',
      stroke: '#1d1b18',
      'stroke-width': 1.8,
      transform: 'translate(-2.5, -1)',
    })
  );
  g.appendChild(
    el('path', {
      d: roundedPolyPath(lidPts, 4),
      fill: '#2b2824',
      stroke: '#1d1b18',
      'stroke-width': 1.7,
    })
  );
  // Bright white browser viewport inside screen
  g.appendChild(
    el('path', {
      d: 'M-26.5 -2 L-5.5 -12.5 L-5.5 -42.5 L-26.5 -32 Z',
      fill: '#ffffff',
    })
  );
  // Browser top address bar + content bars
  g.appendChild(
    el('path', {
      d: 'M-26.5 -27 L-5.5 -37.5 L-5.5 -42.5 L-26.5 -32 Z',
      fill: '#dfd2f4',
    })
  );
  g.appendChild(
    el('path', {
      d: 'M-23 -22 L-10 -28.5 M-23 -16 L-13 -21 M-23 -10 L-16 -13.5',
      stroke: '#b6ac9f',
      'stroke-width': 2.2,
      'stroke-linecap': 'round',
    })
  );

  // Label pill neatly underneath pedestal
  g.appendChild(drawPill(entity.label, 'neutral', 0, 56));
  return g;
}

function renderOsiStack(entity: SceneEntity): SVGElement {
  const g = el('g');
  const slabRx = 68;
  const slabRy = 31;
  const slabDepth = 11;
  const stepY = 27;
  const baseY = 92; // L1 at bottom, L7 at baseY - 6 * 27 = -70

  // Subtle dashed ground pad
  g.appendChild(
    el('path', {
      d: roundedPolyPath(
        [
          [0, -34],
          [76, 0],
          [0, 34],
          [-76, 0],
        ],
        10
      ),
      fill: '#e6ddd0',
      stroke: '#8b847a',
      'stroke-width': 1.2,
      'stroke-dasharray': '4 3',
      transform: `translate(0, ${baseY + 18})`,
      opacity: '0.65',
    })
  );

  // Render L1 (bottom) → L7 (top)
  for (let i = OSI_LAYERS.length - 1; i >= 0; i--) {
    const layer = OSI_LAYERS[i];
    const idxFromBottom = 6 - i;
    const ly = baseY - idxFromBottom * stepY;
    const isActive = entity.activeLayer === layer.num;
    const isWrapped = entity.wrappedLayers?.includes(layer.num) ?? false;
    const dimmed = entity.activeLayer !== undefined && !isActive && !isWrapped;
    const popX = isActive ? (entity.direction === 'up' ? -14 : 14) : 0;

    const lg = el('g', {
      transform: `translate(${popX}, ${ly})`,
      opacity: dimmed ? '0.68' : '1',
    });

    const colors = isActive
      ? { top: '#cfe3b2', topHi: '#e7f2d6', left: '#a8cf82', right: '#8ebd67' }
      : { top: layer.top, left: layer.left, right: layer.right };

    lg.appendChild(buildRoundedIsoPrism(slabRx, slabRy, slabDepth, 9, colors, isActive ? 2.1 : 1.5));

    // Crisp centered layer label on the top face
    lg.appendChild(
      el(
        'text',
        {
          x: 0,
          y: 0,
          'text-anchor': 'middle',
          'dominant-baseline': 'central',
          fill: '#1d1b18',
          'font-size': isActive ? 10.8 : 9.8,
          'font-weight': isActive ? 800 : 700,
        },
        `${layer.short} · ${layer.name}`
      )
    );

    // Active layer callout connector + PDU pill
    if (isActive) {
      const sideDir = entity.direction === 'up' ? -1 : 1;
      const pillX = sideDir * 108;
      const lineStart = sideDir * (slabRx + 2);
      const lineEnd = pillX - sideDir * 36;

      lg.appendChild(
        el('line', {
          x1: lineStart,
          y1: 0,
          x2: lineEnd,
          y2: 0,
          stroke: '#1d1b18',
          'stroke-width': 1.6,
          'stroke-dasharray': '3.5 2.5',
        })
      );
      lg.appendChild(
        el('circle', {
          cx: lineStart,
          cy: 0,
          r: 2.8,
          fill: '#1d1b18',
        })
      );
      lg.appendChild(drawPill(layer.pdu, 'good', pillX, 0));
    }

    g.appendChild(lg);
  }

  g.appendChild(drawPill(entity.label, 'neutral', 0, baseY + 58));
  return g;
}

function renderEntity(entity: SceneEntity): SVGElement {
  const [sx, sy] = iso(entity.x, entity.y);
  const g = el('g', {
    class: 'iso-node',
    'data-entity': entity.id,
    style: `transform: translate(${sx.toFixed(1)}px, ${sy.toFixed(1)}px); opacity: ${entity.dim ? 0.35 : 1};`,
  });

  if (entity.highlight) {
    g.appendChild(
      el('ellipse', {
        cx: 0,
        cy: entity.kind === 'osi-stack' ? 14 : 12,
        rx: entity.kind === 'osi-stack' ? 86 : 66,
        ry: entity.kind === 'osi-stack' ? 42 : 34,
        class: 'spot-ring',
      })
    );
  }

  const tone = TONE_COLORS[entity.tone || 'blue'];

  if (entity.kind === 'laptop') {
    g.appendChild(renderLaptop(entity));
  } else if (entity.kind === 'osi-stack') {
    g.appendChild(renderOsiStack(entity));
  } else if (entity.kind === 'db') {
    // Plump 3D Isometric Cylinder
    g.appendChild(
      el('ellipse', { cx: 0, cy: 23, rx: 28, ry: 12, fill: '#3a2c1c', opacity: '0.16', filter: 'url(#soft-shadow)' })
    );
    g.appendChild(
      el('path', {
        d: 'M-25 -10 L-25 15 A25 11 0 0 0 25 15 L25 -10 Z',
        fill: tone.left,
        stroke: '#1d1b18',
        'stroke-width': 1.8,
      })
    );
    g.appendChild(
      el('path', {
        d: 'M-25 2 A25 11 0 0 0 25 2',
        fill: 'none',
        stroke: '#1d1b18',
        'stroke-width': 1.1,
        opacity: '0.35',
      })
    );
    g.appendChild(
      el('ellipse', {
        cx: 0,
        cy: -10,
        rx: 25,
        ry: 11,
        fill: tone.top,
        stroke: '#1d1b18',
        'stroke-width': 1.8,
      })
    );
    g.appendChild(
      el(
        'text',
        {
          x: 0,
          y: 38,
          'text-anchor': 'middle',
          'dominant-baseline': 'central',
          fill: 'var(--ink)',
          'font-size': 10.5,
          'font-weight': 700,
        },
        entity.label
      )
    );
  } else {
    // Exact reference isometric block proportions: rx=56, ry=28 (2:1), depth=40 (switch: 24)
    const rx = 56;
    const ry = 28;
    const depth = entity.kind === 'switch' ? 24 : 40;
    g.appendChild(buildRoundedIsoPrism(rx, ry, depth, 11, tone, 1.9));

    // Switch port LEDs along front-left bevel
    if (entity.kind === 'switch') {
      for (let p = 0; p < 4; p++) {
        g.appendChild(
          el('circle', {
            cx: -38 + p * 9.5,
            cy: 15 + p * 4.7,
            r: 2.2,
            fill: p === 2 ? '#efb041' : '#3fa456',
            stroke: '#211e1b',
            'stroke-width': 0.9,
          })
        );
      }
    }

    // Crisp icon glyph positioned in upper half (matching reference y=-4)
    const iconName =
      entity.icon ||
      (entity.kind === 'router'
        ? 'router'
        : entity.kind === 'switch'
          ? 'switch'
          : entity.kind === 'cloud'
            ? 'globe'
            : 'server');
    const glyphWrap = el('g', { transform: 'translate(0, -5)', color: '#211e1b' });
    glyphWrap.innerHTML = drawBlockGlyph(iconName);
    g.appendChild(glyphWrap);

    // Exact reference block label: 13px bold #211e1b, cleanly centered below icon
    g.appendChild(
      el(
        'text',
        {
          x: 0,
          y: entity.kind === 'switch' ? 14 : 21,
          'text-anchor': 'middle',
          'dominant-baseline': 'central',
          fill: '#211e1b',
          'font-size': 13,
          'font-weight': 800,
        },
        entity.label
      )
    );

    if (entity.sublabel) {
      g.appendChild(drawPill(entity.sublabel, 'neutral', 0, ry + depth + 20));
    }
  }

  // Floating tags above / below
  if (entity.tags?.length) {
    let topOffset = entity.kind === 'osi-stack' ? -118 : entity.kind === 'laptop' ? -66 : -48;
    let botOffset = entity.kind === 'laptop' ? 84 : entity.kind === 'osi-stack' ? 176 : 64;
    for (const tag of entity.tags) {
      const pos = tag.pos || 'top';
      const ty = pos === 'top' ? topOffset : botOffset;
      g.appendChild(drawPill(tag.text, tag.tone || 'neutral', 0, ty));
      if (pos === 'top') topOffset -= 28;
      else botOffset += 28;
    }
  }

  return g;
}

function renderMiniCard(card: StageMiniCard): SVGElement {
  const w = card.width || 320;
  const lineCount = card.lines?.length || 0;
  const hasStack = Boolean(card.packetStack?.length);
  const h = 38 + lineCount * 22 + (hasStack ? 60 : 0) + (card.footer ? 22 : 0);

  const g = el('g', { transform: `translate(${card.x}, ${card.y})` });
  // Pop shadow
  g.appendChild(
    el('rect', {
      x: 2.5,
      y: 3.5,
      width: w,
      height: h,
      rx: 11,
      fill: 'var(--drop)',
      opacity: '0.88',
    })
  );
  // Card body
  g.appendChild(
    el('rect', {
      x: 0,
      y: 0,
      width: w,
      height: h,
      rx: 11,
      fill: 'var(--surface)',
      stroke: 'var(--ink)',
      'stroke-width': 1.5,
    })
  );
  // Header (exact reference: 10px weight 800)
  g.appendChild(
    el(
      'text',
      {
        x: 14,
        y: 16,
        'dominant-baseline': 'central',
        fill: 'var(--muted)',
        'font-size': 10,
        'font-weight': 800,
        'letter-spacing': '0.08em',
      },
      card.title.toUpperCase()
    )
  );
  g.appendChild(
    el('line', { x1: 12, y1: 29, x2: w - 12, y2: 29, stroke: 'var(--line)', 'stroke-width': 1 })
  );

  let cy = 46;

  // Nested packet header blocks
  if (card.packetStack?.length) {
    const pad = 12;
    const gap = 4;
    const count = card.packetStack.length;
    const availW = w - pad * 2 - gap * (count - 1);
    const segW = availW / count;
    card.packetStack.forEach((blk, idx) => {
      const bx = pad + idx * (segW + gap);
      g.appendChild(
        el('rect', {
          x: bx,
          y: 37,
          width: segW,
          height: 42,
          rx: 6,
          fill: blk.color,
          stroke: '#1d1b18',
          'stroke-width': blk.active ? 2 : 1.3,
        })
      );
      g.appendChild(
        el(
          'text',
          {
            x: bx + segW / 2,
            y: 51,
            'text-anchor': 'middle',
            'dominant-baseline': 'central',
            fill: blk.textColor || '#1d1b18',
            'font-size': 9.6,
            'font-weight': 800,
          },
          blk.label
        )
      );
      if (blk.sub) {
        g.appendChild(
          el(
            'text',
            {
              x: bx + segW / 2,
              y: 66,
              'text-anchor': 'middle',
              'dominant-baseline': 'central',
              fill: blk.textColor || '#34302b',
              'font-size': 8.5,
              'font-weight': 600,
            },
            blk.sub
          )
        );
      }
    });
    cy = 96;
  }

  // Key-value rows (mathematically aligned)
  if (card.lines) {
    const colorMap = {
      normal: 'var(--ink)',
      good: '#2a7a3d',
      warn: 'var(--warn-ink)',
      bad: 'var(--bad-ink)',
      accent: '#5a43a6',
    };
    for (const ln of card.lines) {
      g.appendChild(
        el(
          'text',
          {
            x: 14,
            y: cy,
            'dominant-baseline': 'central',
            fill: 'var(--muted)',
            'font-size': 11.2,
            'font-weight': 600,
          },
          ln.key
        )
      );
      g.appendChild(
        el(
          'text',
          {
            x: w - 14,
            y: cy,
            'text-anchor': 'end',
            'dominant-baseline': 'central',
            fill: colorMap[ln.tone || 'normal'],
            'font-size': 11.5,
            'font-weight': 800,
          },
          ln.val
        )
      );
      cy += 22;
    }
  }

  if (card.footer) {
    g.appendChild(
      el(
        'text',
        {
          x: 14,
          y: h - 12,
          'dominant-baseline': 'central',
          fill: 'var(--muted)',
          'font-size': 9.4,
          'font-weight': 600,
        },
        card.footer
      )
    );
  }

  return g;
}

export class IsoStage {
  private container: HTMLElement;
  private svg: SVGSVGElement;
  private viewportG: SVGGElement;
  private linksG: SVGGElement;
  private nodesG: SVGGElement;
  private packetsG: SVGGElement;
  private cardsG: SVGGElement;

  private pathMap = new Map<string, SVGPathElement>();
  private flows: SceneFlow[] = [];
  private rafId = 0;
  private paused = false;
  private startTime = 0;
  private elapsed = 0;

  private scale = 1;
  private tx = 0;
  private ty = 0;
  private targetScale = 1;
  private targetTx = 0;
  private targetTy = 0;
  private dragging = false;
  private dragStart = { x: 0, y: 0, tx: 0, ty: 0 };

  constructor(container: HTMLElement) {
    this.container = container;
    this.svg = el('svg', {
      class: 'stage-svg',
      viewBox: '0 0 920 540',
      preserveAspectRatio: 'xMidYMid meet',
    }) as SVGSVGElement;

    const defs = el('defs');

    // Soft blur filter for ground shadows
    const filt = el('filter', { id: 'soft-shadow', x: '-30%', y: '-30%', width: '160%', height: '160%' });
    filt.appendChild(el('feGaussianBlur', { stdDeviation: 3.5 }));
    defs.appendChild(filt);

    // Subtle isometric diamond grid
    const pat = el('pattern', {
      id: 'iso-grid',
      width: 64,
      height: 32,
      patternUnits: 'userSpaceOnUse',
    });
    pat.appendChild(
      el('path', {
        d: 'M32 0 L64 16 L32 32 L0 16 Z',
        fill: 'none',
        stroke: 'var(--grid-line)',
        'stroke-width': 1,
      })
    );
    defs.appendChild(pat);

    // Crisp arrowhead markers with aerodynamic geometry
    const marker = el('marker', {
      id: 'iso-arrow',
      viewBox: '0 0 10 10',
      refX: 7.5,
      refY: 5,
      markerWidth: 7,
      markerHeight: 7,
      orient: 'auto-start-reverse',
    });
    marker.appendChild(el('path', { d: 'M 0 1.2 L 8.5 5 L 0 8.8 Q 2.4 5 0 1.2 z', fill: 'var(--ink)' }));
    defs.appendChild(marker);
    this.svg.appendChild(defs);

    this.viewportG = el('g', { class: 'stage-viewport' }) as SVGGElement;
    this.linksG = el('g') as SVGGElement;
    this.nodesG = el('g') as SVGGElement;
    this.packetsG = el('g') as SVGGElement;
    this.cardsG = el('g') as SVGGElement;

    this.viewportG.append(this.linksG, this.nodesG, this.packetsG);
    this.svg.append(this.viewportG, this.cardsG);

    this.container.innerHTML = '';
    this.container.appendChild(this.svg);

    this.bindPanZoom();
    this.startLoop();
  }

  private bindPanZoom() {
    this.container.addEventListener(
      'wheel',
      (e) => {
        e.preventDefault();

        // Normalize delta across input devices (pixels, lines, pages, or trackpad pinch)
        let delta = -e.deltaY;
        if (e.deltaMode === 1) delta *= 20; // lines
        else if (e.deltaMode === 2) delta *= 300; // pages

        // When pinching on trackpad (e.ctrlKey), scale smoothly with fine sensitivity
        const sensitivity = e.ctrlKey ? 0.005 : 0.0016;
        const zoomFactor = Math.exp(delta * sensitivity);
        const clampedFactor = Math.max(0.7, Math.min(1.4, zoomFactor));

        const minScale = 0.55;
        const maxScale = 2.6;
        const newTargetScale = Math.max(minScale, Math.min(maxScale, this.targetScale * clampedFactor));

        // Focal point zooming: keep point under cursor invariant
        const rect = this.svg.getBoundingClientRect();
        const mouseSvgX = rect.width ? ((e.clientX - rect.left) / rect.width) * 920 : 460;
        const mouseSvgY = rect.height ? ((e.clientY - rect.top) / rect.height) * 540 : 270;

        const scaleDiff = this.targetScale - newTargetScale;
        this.targetTx += (mouseSvgX - 460) * scaleDiff;
        this.targetTy += (mouseSvgY - 270) * scaleDiff;
        this.targetScale = newTargetScale;
      },
      { passive: false }
    );

    this.container.addEventListener('pointerdown', (e) => {
      if ((e.target as HTMLElement)?.closest('button, .tool')) return;
      this.dragging = true;
      this.container.classList.add('is-dragging');
      this.dragStart = { x: e.clientX, y: e.clientY, tx: this.targetTx, ty: this.targetTy };
      try {
        this.container.setPointerCapture(e.pointerId);
      } catch {}
    });

    this.container.addEventListener('pointermove', (e) => {
      if (!this.dragging) return;
      const dx = e.clientX - this.dragStart.x;
      const dy = e.clientY - this.dragStart.y;
      this.targetTx = this.dragStart.tx + dx;
      this.targetTy = this.dragStart.ty + dy;
      // Direct 1:1 follow during pointer drag for responsive tactile feel
      this.tx = this.targetTx;
      this.ty = this.targetTy;
      this.applyTransform();
    });

    const endDrag = (e: PointerEvent) => {
      if (this.dragging) {
        this.dragging = false;
        this.container.classList.remove('is-dragging');
        try {
          if (this.container.hasPointerCapture(e.pointerId)) {
            this.container.releasePointerCapture(e.pointerId);
          }
        } catch {}
      }
    };
    this.container.addEventListener('pointerup', endDrag);
    this.container.addEventListener('pointercancel', endDrag);

    // Double-click to smoothly zoom in or reset
    this.container.addEventListener('dblclick', (e) => {
      if ((e.target as HTMLElement)?.closest('button, .tool')) return;
      if (this.targetScale > 1.25) {
        this.resetView();
      } else {
        const rect = this.svg.getBoundingClientRect();
        const mouseSvgX = rect.width ? ((e.clientX - rect.left) / rect.width) * 920 : 460;
        const mouseSvgY = rect.height ? ((e.clientY - rect.top) / rect.height) * 540 : 270;
        this.zoomBy(1.35, mouseSvgX, mouseSvgY);
      }
    });
  }

  public zoomBy(factor: number, focalX = 460, focalY = 270) {
    const minScale = 0.55;
    const maxScale = 2.6;
    const newTargetScale = Math.max(minScale, Math.min(maxScale, this.targetScale * factor));
    const scaleDiff = this.targetScale - newTargetScale;
    this.targetTx += (focalX - 460) * scaleDiff;
    this.targetTy += (focalY - 270) * scaleDiff;
    this.targetScale = newTargetScale;
  }

  public zoomIn() {
    this.zoomBy(1.28);
  }

  public zoomOut() {
    this.zoomBy(0.78);
  }

  public resetView() {
    this.targetScale = 1;
    this.targetTx = 0;
    this.targetTy = 0;
  }

  private updateSmoothTransform(dt: number) {
    if (this.dragging) return;

    const dScale = this.targetScale - this.scale;
    const dTx = this.targetTx - this.tx;
    const dTy = this.targetTy - this.ty;

    if (
      Math.abs(dScale) > 0.0005 ||
      Math.abs(dTx) > 0.05 ||
      Math.abs(dTy) > 0.05
    ) {
      // Exponential decay smoothing (fluid 60/120fps interpolation)
      const factor = 1 - Math.exp(-dt * 0.012);
      this.scale += dScale * factor;
      this.tx += dTx * factor;
      this.ty += dTy * factor;
      this.applyTransform();
    } else if (
      this.scale !== this.targetScale ||
      this.tx !== this.targetTx ||
      this.ty !== this.targetTy
    ) {
      this.scale = this.targetScale;
      this.tx = this.targetTx;
      this.ty = this.targetTy;
      this.applyTransform();
    }
  }

  private applyTransform() {
    this.viewportG.setAttribute(
      'transform',
      `translate(${(460 + this.tx).toFixed(2)}, ${(270 + this.ty).toFixed(2)}) scale(${this.scale.toFixed(4)}) translate(-460, -270)`
    );
    const fitBtn = document.getElementById('btn-fit');
    if (fitBtn) {
      const moved = Math.abs(this.scale - 1) > 0.02 || Math.abs(this.tx) > 4 || Math.abs(this.ty) > 4;
      fitBtn.hidden = !moved;
    }
  }

  public setPaused(p: boolean) {
    this.paused = p;
  }

  public isPaused() {
    return this.paused;
  }

  public replay() {
    this.elapsed = 0;
    this.startTime = performance.now();
    const nodes = Array.from(this.nodesG.children) as SVGElement[];
    nodes.forEach((n, idx) => {
      n.style.opacity = '0';
      setTimeout(() => {
        n.style.opacity = n.dataset.dim === '1' ? '0.35' : '1';
      }, idx * 70 + 30);
    });
  }

  public render(scene: SceneSpec, stagger = false) {
    this.pathMap.clear();
    this.linksG.innerHTML = '';
    this.nodesG.innerHTML = '';
    this.packetsG.innerHTML = '';
    this.cardsG.innerHTML = '';
    this.flows = scene.flows;

    const entityById = new Map<string, SceneEntity>();
    scene.entities.forEach((ent) => entityById.set(ent.id, ent));

    // 1. Links (with rounded corners and clean endpoint trim)
    for (const link of scene.links) {
      const a = entityById.get(link.from);
      const b = entityById.get(link.to);
      if (!a || !b) continue;
      const pts: [number, number][] = [iso(a.x, a.y)];
      if (link.via) {
        for (const [vx, vy] of link.via) pts.push(iso(vx, vy));
      }
      pts.push(iso(b.x, b.y));

      if (pts.length >= 2) {
        const first = pts[0];
        const next = pts[1];
        const d1 = Math.hypot(next[0] - first[0], next[1] - first[1]) || 1;
        const trimStart = a.kind === 'osi-stack' ? 74 : a.kind === 'laptop' ? 56 : 52;
        if (d1 > trimStart + 12) {
          pts[0] = [
            first[0] + ((next[0] - first[0]) * trimStart) / d1,
            first[1] + ((next[1] - first[1]) * trimStart) / d1,
          ];
        }
        const last = pts[pts.length - 1];
        const prev = pts[pts.length - 2];
        const d2 = Math.hypot(last[0] - prev[0], last[1] - prev[1]) || 1;
        const trimEnd = b.kind === 'osi-stack' ? 74 : b.kind === 'laptop' ? 56 : 52;
        if (d2 > trimEnd + 12) {
          pts[pts.length - 1] = [
            last[0] - ((last[0] - prev[0]) * trimEnd) / d2,
            last[1] - ((last[1] - prev[1]) * trimEnd) / d2,
          ];
        }
      }

      const d = roundedOpenPath(pts, 14);
      const isActive = this.flows.some((f) => f.linkId === link.id);
      let styleClass = 'iso-link';
      if (link.style === 'dashed') styleClass += ' iso-link--dashed';
      else if (link.style === 'beat') styleClass += ' iso-link--beat';
      else if (link.style === 'off') styleClass += ' iso-link--off';
      else if (isActive) styleClass += ' iso-link--active';

      const pathAttrs: Record<string, string | number> = { d, class: styleClass };
      if (link.arrow !== 'none') pathAttrs['marker-end'] = 'url(#iso-arrow)';
      if (link.arrow === 'both') pathAttrs['marker-start'] = 'url(#iso-arrow)';

      const pathEl = el('path', pathAttrs) as SVGPathElement;
      this.linksG.appendChild(pathEl);
      this.pathMap.set(link.id, pathEl);

      if (link.label) {
        const total = pathEl.getTotalLength();
        const midPt = pathEl.getPointAtLength(total * 0.5);
        this.linksG.appendChild(drawPill(link.label, 'neutral', midPt.x, midPt.y - 18));
      }
    }

    // 2. Entities sorted by isometric depth
    const sorted = [...scene.entities].sort((a, b) => a.x + a.y - (b.x + b.y));
    sorted.forEach((ent, idx) => {
      const node = renderEntity(ent);
      node.dataset.dim = ent.dim ? '1' : '0';
      if (stagger) {
        node.style.opacity = '0';
        setTimeout(() => {
          node.style.opacity = ent.dim ? '0.35' : '1';
        }, idx * 75 + 25);
      }
      this.nodesG.appendChild(node);
    });

    // 3. Floating Mini-Cards
    if (scene.cards) {
      for (const card of scene.cards) {
        this.cardsG.appendChild(renderMiniCard(card));
      }
    }
  }

  private startLoop() {
    this.startTime = performance.now();
    const tick = (now: number) => {
      const dt = Math.min(48, now - this.startTime);
      if (!this.paused) {
        this.elapsed += dt;
      }
      this.startTime = now;
      this.updateSmoothTransform(dt);
      this.drawPackets();
      this.rafId = requestAnimationFrame(tick);
    };
    this.rafId = requestAnimationFrame(tick);
  }

  private drawPackets() {
    this.packetsG.innerHTML = '';
    if (!this.flows.length) return;

    const cycleMs = 2400;
    for (const flow of this.flows) {
      const path = this.pathMap.get(flow.linkId);
      if (!path) continue;
      const totalLen = path.getTotalLength();
      if (totalLen < 5) continue;

      const count = Math.max(1, Math.round(flow.rate || 2));
      const style = PACKET_STYLE[flow.kind];

      for (let i = 0; i < count; i++) {
        let t = ((this.elapsed / cycleMs) + i / count) % 1;
        if (flow.reverse) t = 1 - t;
        const pt = path.getPointAtLength(t * totalLen);

        const pg = el('g', {
          transform: `translate(${pt.x.toFixed(1)}, ${pt.y.toFixed(1)})`,
          class: 'packet-dot',
        });
        if (style.shape === 'rect') {
          pg.appendChild(
            el('rect', {
              x: -6,
              y: -6,
              width: 12,
              height: 12,
              rx: 3,
              fill: style.fill,
              stroke: style.stroke,
              'stroke-width': 1.8,
            })
          );
        } else {
          pg.appendChild(
            el('circle', {
              cx: 0,
              cy: 0,
              r: 6,
              fill: style.fill,
              stroke: style.stroke,
              'stroke-width': 1.8,
            })
          );
        }
        this.packetsG.appendChild(pg);
      }
    }
  }

  public destroy() {
    cancelAnimationFrame(this.rafId);
  }
}

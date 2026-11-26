'use client';

import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  Sun,
  Moon,
  Coffee,
} from 'lucide-react';
import { flushSync } from 'react-dom';
import { cn } from '@/lib/utils';

export type ThemeId =
  | 'light'
  | 'dark'
  | 'retro';

export interface ThemeConfig {
  id: ThemeId;
  name: string;
  badge: string;
  themeColor: string;
  isDarkVariant: boolean;
  swatchBg: string;
  swatchInk: string;
}

export const THEMES: ThemeConfig[] = [
  {
    id: 'light',
    name: 'Paper & Ink',
    badge: 'Light',
    themeColor: '#f4ebe0',
    isDarkVariant: false,
    swatchBg: '#f4ebe0',
    swatchInk: '#1d1b18',
  },
  {
    id: 'dark',
    name: 'Black',
    badge: 'Dark',
    themeColor: '#211e1a',
    isDarkVariant: true,
    swatchBg: '#211e1a',
    swatchInk: '#7fc278',
  },
  {
    id: 'retro',
    name: 'Gruvbox Retro',
    badge: 'Retro',
    themeColor: '#1d2021',
    isDarkVariant: true,
    swatchBg: '#1d2021',
    swatchInk: '#fabd2f',
  },
];

export type TransitionVariant =
  | 'circle'
  | 'square'
  | 'triangle'
  | 'diamond'
  | 'hexagon'
  | 'rectangle'
  | 'star';

export interface AnimatedThemeTogglerProps
  extends React.ComponentPropsWithoutRef<'button'> {
  duration?: number;
  variant?: TransitionVariant;
  /** When true, the transition expands from the viewport center instead of the button center. */
  fromCenter?: boolean;
  /**
   * Controlled theme value. When provided, the parent owns persistence
   * and this component will not write to localStorage.
   */
  theme?: ThemeId;
  /** Called on toggle. Pair with `theme` for controlled usage. */
  onThemeChange?: (theme: ThemeId) => void;
}

function polygonCollapsed(point: string, vertexCount: number): string {
  const pairs = Array.from({ length: vertexCount }, () => point).join(', ');
  return `polygon(${pairs})`;
}

function getThemeTransitionClipPaths(
  variant: TransitionVariant,
  cx: number,
  cy: number,
  maxRadius: number,
  viewportWidth: number,
  viewportHeight: number
): [string, string] {
  const toX = (x: number) => `${(x / viewportWidth) * 100}%`;
  const toY = (y: number) => `${(y / viewportHeight) * 100}%`;
  const point = (x: number, y: number) => `${toX(x)} ${toY(y)}`;
  const toRadius = (r: number) =>
    `${(r / (Math.hypot(viewportWidth, viewportHeight) / Math.SQRT2)) * 100}%`;

  switch (variant) {
    case 'circle': {
      const endRadius = Math.ceil(maxRadius * 1.05);
      return [
        `circle(0px at ${cx}px ${cy}px)`,
        `circle(${endRadius}px at ${cx}px ${cy}px)`,
      ];
    }
    case 'square': {
      const halfW = Math.max(cx, viewportWidth - cx);
      const halfH = Math.max(cy, viewportHeight - cy);
      const halfSide = Math.max(halfW, halfH) * 1.05;
      const end = [
        point(cx - halfSide, cy - halfSide),
        point(cx + halfSide, cy - halfSide),
        point(cx + halfSide, cy + halfSide),
        point(cx - halfSide, cy + halfSide),
      ].join(', ');
      return [polygonCollapsed(point(cx, cy), 4), `polygon(${end})`];
    }
    case 'triangle': {
      const scale = maxRadius * 2.2;
      const dx = (Math.sqrt(3) / 2) * scale;
      const verts = [
        point(cx, cy - scale),
        point(cx + dx, cy + 0.5 * scale),
        point(cx - dx, cy + 0.5 * scale),
      ].join(', ');
      return [polygonCollapsed(point(cx, cy), 3), `polygon(${verts})`];
    }
    case 'diamond': {
      const R = maxRadius * Math.SQRT2;
      const end = [
        point(cx, cy - R),
        point(cx + R, cy),
        point(cx, cy + R),
        point(cx - R, cy),
      ].join(', ');
      return [polygonCollapsed(point(cx, cy), 4), `polygon(${end})`];
    }
    case 'hexagon': {
      const R = maxRadius * Math.SQRT2;
      const verts: string[] = [];
      for (let i = 0; i < 6; i++) {
        const a = -Math.PI / 2 + (i * Math.PI) / 3;
        verts.push(point(cx + R * Math.cos(a), cy + R * Math.sin(a)));
      }
      return [
        polygonCollapsed(point(cx, cy), 6),
        `polygon(${verts.join(', ')})`,
      ];
    }
    case 'rectangle': {
      const halfW = Math.max(cx, viewportWidth - cx);
      const halfH = Math.max(cy, viewportHeight - cy);
      const end = [
        point(cx - halfW, cy - halfH),
        point(cx + halfW, cy - halfH),
        point(cx + halfW, cy + halfH),
        point(cx - halfW, cy + halfH),
      ].join(', ');
      return [polygonCollapsed(point(cx, cy), 4), `polygon(${end})`];
    }
    case 'star': {
      const R = maxRadius * Math.SQRT2 * 1.03;
      const innerRatio = 0.42;
      const starPolygon = (radius: number) => {
        const verts: string[] = [];
        for (let i = 0; i < 5; i++) {
          const outerA = -Math.PI / 2 + (i * 2 * Math.PI) / 5;
          verts.push(
            point(
              cx + radius * Math.cos(outerA),
              cy + radius * Math.sin(outerA)
            )
          );
          const innerA = outerA + Math.PI / 5;
          verts.push(
            point(
              cx + radius * innerRatio * Math.cos(innerA),
              cy + radius * innerRatio * Math.sin(innerA)
            )
          );
        }
        return `polygon(${verts.join(', ')})`;
      };
      const startR = Math.max(2, R * 0.025);
      return [starPolygon(startR), starPolygon(R)];
    }
    default:
      return [
        `circle(0px at ${cx}px ${cy}px)`,
        `circle(${Math.ceil(maxRadius * 1.05)}px at ${cx}px ${cy}px)`,
      ];
  }
}

function getThemeIcon(themeId: ThemeId) {
  switch (themeId) {
    case 'light':
      return <Sun size={14} />;
    case 'dark':
      return <Moon size={14} />;
    case 'retro':
      return <Coffee size={14} />;
  }
}

export const AnimatedThemeToggler = ({
  className,
  duration = 1000,
  variant = 'circle',
  fromCenter = false,
  theme,
  onThemeChange,
  ...props
}: AnimatedThemeTogglerProps) => {
  const shape = variant ?? 'circle';
  const isControlled = theme !== undefined;
  const [currentThemeId, setCurrentThemeId] = useState<ThemeId>(() => {
    if (typeof document === 'undefined') return 'light';
    const attr = document.documentElement.dataset.theme as ThemeId | undefined;
    if (attr && THEMES.some((t) => t.id === attr)) return attr;
    if (document.documentElement.classList.contains('dark')) return 'dark';
    return 'light';
  });

  const activeThemeId = isControlled ? (theme as ThemeId) : currentThemeId;
  const currentTheme = THEMES.find((t) => t.id === activeThemeId) ?? THEMES[0];
  const nextThemeIndex = (THEMES.findIndex((t) => t.id === activeThemeId) + 1) % THEMES.length;
  const nextTheme = THEMES[nextThemeIndex];

  const buttonRef = useRef<HTMLButtonElement>(null);
  const isTransitioningRef = useRef(false);
  const activeAnimRef = useRef<Animation | null>(null);

  const cancelAnim = useCallback(() => {
    activeAnimRef.current?.cancel();
    activeAnimRef.current = null;
  }, []);

  useEffect(() => {
    return () => {
      cancelAnim();
      const root = document.documentElement;
      if (root.dataset.magicuiThemeVt !== 'active') return;
      delete root.dataset.magicuiThemeVt;
      root.style.removeProperty('--magicui-theme-toggle-vt-duration');
      root.style.removeProperty('--magicui-theme-vt-clip-from');
    };
  }, [cancelAnim]);

  // Sync theme changes if modified externally
  useEffect(() => {
    if (isControlled) return;

    const updateTheme = () => {
      const attr = document.documentElement.dataset.theme as ThemeId | undefined;
      if (attr && THEMES.some((t) => t.id === attr)) {
        setCurrentThemeId(attr);
      } else if (document.documentElement.classList.contains('dark')) {
        setCurrentThemeId('dark');
      } else {
        setCurrentThemeId('light');
      }
    };

    updateTheme();

    const observer = new MutationObserver(updateTheme);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class', 'data-theme'],
    });

    return () => observer.disconnect();
  }, [isControlled]);

  const switchTheme = useCallback(
    (targetThemeId?: ThemeId) => {
      const button = buttonRef.current;
      if (
        !button ||
        isTransitioningRef.current ||
        document.documentElement.dataset.magicuiThemeVt === 'active'
      )
        return;

      const target =
        (targetThemeId && THEMES.find((t) => t.id === targetThemeId)) ||
        nextTheme;

      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;

      let x: number;
      let y: number;
      if (fromCenter) {
        x = viewportWidth / 2;
        y = viewportHeight / 2;
      } else {
        const { top, left, width, height } = button.getBoundingClientRect();
        x = left + width / 2;
        y = top + height / 2;
      }

      const maxRadius = Math.hypot(
        Math.max(x, viewportWidth - x),
        Math.max(y, viewportHeight - y)
      );

      const applyTheme = () => {
        document.documentElement.dataset.theme = target.id;
        document.documentElement.classList.toggle('dark', target.isDarkVariant);

        // Update meta theme-color
        const meta = document.querySelector('meta[name="theme-color"]');
        if (meta) {
          meta.setAttribute('content', target.themeColor);
        }

        if (isControlled) {
          onThemeChange?.(target.id);
        } else {
          setCurrentThemeId(target.id);
          localStorage.setItem('theme', target.id);
          try {
            localStorage.setItem('nettrace:theme', JSON.stringify(target.id));
          } catch {}
        }
      };

      // Fallback if View Transitions API is unsupported
      if (typeof (document as any).startViewTransition !== 'function') {
        applyTheme();
        return;
      }

      const clipPath = getThemeTransitionClipPaths(
        shape,
        x,
        y,
        maxRadius,
        viewportWidth,
        viewportHeight
      );

      const root = document.documentElement;
      root.dataset.magicuiThemeVt = 'active';
      root.style.setProperty(
        '--magicui-theme-toggle-vt-duration',
        `${duration}ms`
      );
      root.style.setProperty('--magicui-theme-vt-clip-from', clipPath[0]);

      const cleanup = () => {
        isTransitioningRef.current = false;
        delete root.dataset.magicuiThemeVt;
        root.style.removeProperty('--magicui-theme-toggle-vt-duration');
        root.style.removeProperty('--magicui-theme-vt-clip-from');
        cancelAnim();
      };

      isTransitioningRef.current = true;
      const transition = (document as any).startViewTransition(() => {
        flushSync(applyTheme);
      });

      if (typeof transition?.finished?.finally === 'function') {
        transition.finished.finally(cleanup).catch(() => {});
      } else {
        cleanup();
      }

      const ready = transition?.ready;
      if (ready && typeof ready.then === 'function') {
        ready
          .then(() => {
            const anim = document.documentElement.animate(
              {
                clipPath,
              },
              {
                duration,
                easing: 'cubic-bezier(0.4, 0, 0.2, 1)',
                fill: 'forwards',
                pseudoElement: '::view-transition-new(root)',
              }
            );
            activeAnimRef.current = anim;
          })
          .catch(() => {});
      }
    },
    [
      shape,
      fromCenter,
      duration,
      activeThemeId,
      nextTheme,
      isControlled,
      onThemeChange,
      cancelAnim,
    ]
  );

  return (
    <button
      type="button"
      ref={buttonRef}
      onClick={() => switchTheme()}
      className={cn('theme-btn', className)}
      aria-label={`Current theme: ${currentTheme.name}. Click to switch to ${nextTheme.name}`}
      title={`Theme: ${currentTheme.name} (Click for ${nextTheme.name})`}
      {...props}
    >
      {getThemeIcon(activeThemeId)}
    </button>
  );
};

export default AnimatedThemeToggler;

import React, { useId } from 'react';
import { cn } from '@/lib/utils';

export type PatternVariant = 'dots' | 'batik' | 'contour' | 'grain' | 'none';
export type PatternTone = 'light' | 'tint' | 'brand' | 'brand-deep';
export type PatternFade =
  | 'none'
  | 'soft-edges'
  | 'right-focus'
  | 'top-right'
  | 'bottom-soft'
  | 'radial-soft';

export interface PatternSectionProps extends React.HTMLAttributes<HTMLElement> {
  as?: 'section' | 'div' | 'header' | 'footer';
  variant?: PatternVariant;
  tone?: PatternTone;
  fade?: PatternFade;
  patternColor?: string;
  patternOpacity?: number | string;
  patternSize?: string;
  contentClassName?: string;
  children: React.ReactNode;
}

const VARIANT_CLASSES: Record<PatternVariant, string> = {
  dots: 'pattern-surface pattern-dots',
  batik: 'pattern-surface pattern-batik',
  contour: 'pattern-surface pattern-contour',
  grain: 'pattern-surface pattern-grain',
  none: 'relative overflow-x-clip',
};

const TONE_CLASSES: Record<PatternTone, string> = {
  light: 'pattern-tone-light',
  tint: 'pattern-tone-tint',
  brand: 'pattern-tone-brand',
  'brand-deep': 'pattern-tone-brand-deep',
};

const FADE_CLASSES: Record<PatternFade, string> = {
  none: 'pattern-fade-none',
  'soft-edges': 'pattern-fade-soft-edges',
  'right-focus': 'pattern-fade-right-focus',
  'top-right': 'pattern-fade-top-right',
  'bottom-soft': 'pattern-fade-bottom-soft',
  'radial-soft': 'pattern-fade-radial-soft',
};

export function PatternSection({
  as = 'section',
  variant = 'dots',
  tone = 'light',
  fade = 'soft-edges',
  patternColor,
  patternOpacity,
  patternSize,
  className,
  contentClassName,
  style,
  children,
  ...rest
}: PatternSectionProps) {
  const Component = as;

  const customVars: React.CSSProperties = {
    ...(patternColor ? ({ '--pattern-color': patternColor } as React.CSSProperties) : {}),
    ...(patternOpacity !== undefined
      ? ({ '--pattern-opacity': String(patternOpacity) } as React.CSSProperties)
      : {}),
    ...(patternSize ? ({ '--pattern-size': patternSize } as React.CSSProperties) : {}),
    ...style,
  };

  return (
    <Component
      className={cn(
        VARIANT_CLASSES[variant],
        TONE_CLASSES[tone],
        variant !== 'none' && FADE_CLASSES[fade],
        className
      )}
      style={customVars}
      {...rest}
    >
      <div className={cn('relative z-[1]', contentClassName)}>{children}</div>
    </Component>
  );
}

export interface PatternDividerProps {
  variant?: 'curve' | 'batik-rim' | 'gradient';
  fromColor?: string;
  toColor?: string;
  className?: string;
}

/**
 * Pemisah dekoratif antar-section (kurva SVG lembut, rim bermotif, atau gradient tipis).
 * Menggunakan aria-hidden="true" agar dilewati oleh pembaca layar.
 */
export function PatternDivider({
  variant = 'curve',
  fromColor = '#FDFCF7',
  toColor = '#F3F1EA',
  className,
}: PatternDividerProps) {
  const patternId = useId().replace(/:/g, '');

  if (variant === 'gradient') {
    return (
      <div
        aria-hidden="true"
        className={cn('section-gradient-line', className)}
      />
    );
  }

  if (variant === 'batik-rim') {
    return (
      <div
        aria-hidden="true"
        className={cn('w-full overflow-hidden leading-none select-none pointer-events-none', className)}
        style={{ backgroundColor: fromColor }}
      >
        <svg
          className="block w-full h-5"
          width="100%"
          height="20"
          focusable="false"
        >
          <defs>
            <pattern
              id={`batik-rim-${patternId}`}
              width="36"
              height="20"
              patternUnits="userSpaceOnUse"
            >
              <path
                d="M0 20L9 8Q18 0 27 8L36 20Z"
                fill={toColor}
              />
              <circle cx="18" cy="11.5" r="1.6" fill="#F59E0B" fillOpacity="0.6" />
              <path
                d="M9 8.5L18 17L27 8.5"
                fill="none"
                stroke="#F59E0B"
                strokeOpacity="0.28"
                strokeWidth="0.9"
              />
            </pattern>
          </defs>
          <rect width="100%" height="20" fill={`url(#batik-rim-${patternId})`} />
        </svg>
      </div>
    );
  }

  return (
    <div
      aria-hidden="true"
      className={cn('w-full overflow-hidden leading-none select-none pointer-events-none', className)}
      style={{ backgroundColor: fromColor }}
    >
      <svg
        viewBox="0 0 1440 36"
        preserveAspectRatio="none"
        className="block w-full h-5 sm:h-7 md:h-9"
        focusable="false"
      >
        <path
          d="M0 36L0 18C320 0 640 32 980 14C1180 4 1340 10 1440 18L1440 36Z"
          fill={toColor}
        />
      </svg>
    </div>
  );
}

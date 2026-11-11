import React from 'react';
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
  variant?: 'curve' | 'batik-rim' | 'gradient' | 'rule';
  fromColor?: string;
  toColor?: string;
  className?: string;
}

/**
 * Garis pemisah struktural antar-bagian yang tenang tanpa gelombang dekoratif.
 */
export function PatternDivider({
  variant = 'rule',
  className,
}: PatternDividerProps) {
  if (variant === 'gradient') {
    return (
      <div
        aria-hidden="true"
        className={cn('section-gradient-line', className)}
      />
    );
  }

  return (
    <div
      aria-hidden="true"
      className={cn('w-full border-t border-[#0C2340]/10', className)}
    />
  );
}

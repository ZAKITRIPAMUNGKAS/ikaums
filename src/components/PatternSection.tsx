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

const TONE_CLASSES: Record<PatternTone, string> = {
  light: 'bg-white text-[#0F172A]',
  tint: 'bg-[#F8FAFC] text-[#0F172A]',
  brand: 'bg-[#0C2340] text-white',
  'brand-deep': 'bg-[#08182E] text-white',
};

export function PatternSection({
  as = 'section',
  tone = 'light',
  className,
  contentClassName,
  style,
  children,
  variant: _v,
  fade: _f,
  patternColor: _pc,
  patternOpacity: _po,
  patternSize: _ps,
  ...rest
}: PatternSectionProps) {
  void _v;
  void _f;
  void _pc;
  void _po;
  void _ps;
  const Component = as;

  return (
    <Component
      className={cn('relative w-full', TONE_CLASSES[tone], className)}
      style={style}
      {...rest}
    >
      <div className={cn('relative z-10 w-full', contentClassName)}>{children}</div>
    </Component>
  );
}

export interface PatternDividerProps {
  variant?: 'curve' | 'batik-rim' | 'gradient' | 'rule';
  fromColor?: string;
  toColor?: string;
  className?: string;
}

export function PatternDivider({
  className,
}: PatternDividerProps) {
  return (
    <div
      role="separator"
      aria-hidden="true"
      className={cn('w-full h-px bg-slate-200', className)}
    />
  );
}

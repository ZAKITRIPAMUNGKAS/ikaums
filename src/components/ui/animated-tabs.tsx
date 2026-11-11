'use client';

import * as React from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { cn } from '@/lib/utils';

interface TabItem {
  id: string;
  label: string;
  badge?: string | number;
}

interface AnimatedTabsProps {
  tabs: TabItem[] | string[];
  activeTab: string;
  onChange: (tabId: string) => void;
  className?: string;
  pillClassName?: string;
  layoutId?: string;
}

export function AnimatedTabs({
  tabs,
  activeTab,
  onChange,
  className,
  pillClassName,
  layoutId = 'activeTabPill'
}: AnimatedTabsProps) {
  const shouldReduceMotion = useReducedMotion();

  const normalizedTabs: TabItem[] = tabs.map((t) =>
    typeof t === 'string' ? { id: t, label: t } : t
  );

  return (
    <div
      role="tablist"
      className={cn(
        'inline-flex flex-wrap items-center gap-1 p-1 bg-[#F3F1EA] border border-[#0C2340]/10 rounded-xl',
        className
      )}
    >
      {normalizedTabs.map((tab) => {
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            role="tab"
            aria-selected={isActive}
            type="button"
            onClick={() => onChange(tab.id)}
            className={cn(
              'relative z-10 px-3.5 py-2 text-xs sm:text-[13px] transition-colors duration-150 rounded-lg flex items-center gap-1.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0C2340] cursor-pointer',
              isActive
                ? 'text-white font-semibold'
                : 'text-[#475569] hover:text-[#0C2340] hover:bg-black/4 font-medium'
            )}
          >
            {isActive && (
              <motion.div
                layoutId={shouldReduceMotion ? undefined : layoutId}
                transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                className={cn(
                  'absolute inset-0 bg-[#0C2340] rounded-lg -z-10 shadow-xs',
                  pillClassName
                )}
              />
            )}
            <span>{tab.label}</span>
            {tab.badge !== undefined && (
              <span
                className={cn(
                  'text-[11px] px-1.5 py-0.5 rounded-md font-semibold leading-none',
                  isActive
                    ? 'bg-white/20 text-[#F59E0B]'
                    : 'bg-[#0C2340]/10 text-[#475569]'
                )}
              >
                {tab.badge}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}

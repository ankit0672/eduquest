import React from 'react';
import { Lock, Check } from 'lucide-react';

export const BadgeCard = ({ badge, isUnlocked = false, unlockedAt = null }) => {
  return (
    <div
      className={`relative p-4 rounded-2xl border transition-all duration-300 flex flex-col items-center text-center ${
        isUnlocked
          ? 'bg-gradient-to-b from-amber-50/50 to-white border-amber-200/80 shadow-sm hover:shadow-md hover:-translate-y-1'
          : 'bg-slate-50/60 border-slate-200/70 opacity-60 grayscale hover:grayscale-0 hover:opacity-90'
      }`}
    >
      {/* Icon with circular glowing backdrop */}
      <div
        className={`w-16 h-16 rounded-full flex items-center justify-center text-3xl mb-3 shadow-inner ${
          isUnlocked
            ? 'bg-gradient-to-tr from-amber-200 to-amber-100 ring-4 ring-amber-50'
            : 'bg-slate-200 text-slate-400'
        }`}
      >
        {badge.icon}
      </div>

      {/* Lock/Unlock Indicator */}
      <div className="absolute top-3 right-3">
        {isUnlocked ? (
          <span className="bg-emerald-50 text-emerald-600 p-1 rounded-full border border-emerald-200 block" title="Unlocked">
            <Check className="w-3 h-3 stroke-[3]" />
          </span>
        ) : (
          <span className="bg-slate-200 text-slate-500 p-1 rounded-full block" title="Locked">
            <Lock className="w-3 h-3" />
          </span>
        )}
      </div>

      <h4 className="font-bold text-slate-800 text-sm mb-1">{badge.title}</h4>
      <p className="text-xs text-slate-500 leading-relaxed max-w-[180px]">{badge.description}</p>

      {isUnlocked && unlockedAt && (
        <span className="mt-3 text-[10px] font-semibold text-amber-700 bg-amber-100/70 px-2 py-0.5 rounded-full">
          Unlocked {new Date(unlockedAt).toLocaleDateString()}
        </span>
      )}
    </div>
  );
};

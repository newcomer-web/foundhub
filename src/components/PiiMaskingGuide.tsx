'use client';

import React, { useState } from 'react';
import { maskSensitiveInfo } from '@/lib/utils';
import { ShieldCheck, AlertOctagon, EyeOff, Check } from 'lucide-react';

interface PiiMaskingGuideProps {
  onApplyMaskedText?: (maskedText: string) => void;
}

export default function PiiMaskingGuide({ onApplyMaskedText }: PiiMaskingGuideProps) {
  const [sampleInput, setSampleInput] = useState('ID: DL98421094');
  const [copied, setCopied] = useState(false);

  const maskedOutput = maskSensitiveInfo(sampleInput);

  const handleApply = () => {
    if (onApplyMaskedText) {
      onApplyMaskedText(maskedOutput);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="p-4 bg-rose-50/80 rounded-2xl border border-rose-200 space-y-3">
      <div className="flex items-start gap-3">
        <div className="p-2 bg-rose-100 text-rose-700 rounded-xl shrink-0 mt-0.5">
          <AlertOctagon className="w-5 h-5" />
        </div>
        <div className="space-y-1">
          <h4 className="text-xs font-bold uppercase tracking-wider text-rose-900 flex items-center gap-1.5">
            Sensitive Identity Document Protection Enforced
          </h4>
          <p className="text-xs text-rose-800 leading-relaxed">
            In compliance with privacy policies, <strong>never upload full unmasked numbers</strong> (SSN, passport number, driver license number, or credit card CVV). Always obscure the middle characters (e.g., <code>AB **** 45</code>).
          </p>
        </div>
      </div>

      {/* Interactive Masking Utility */}
      <div className="p-3 bg-white rounded-xl border border-rose-100 space-y-2">
        <div className="flex items-center justify-between text-[11px] font-bold text-slate-700">
          <span className="flex items-center gap-1">
            <EyeOff className="w-3.5 h-3.5 text-rose-500" />
            Automatic Privacy Masking Tool:
          </span>
          <span className="text-slate-400">Live Preview</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          <input
            type="text"
            value={sampleInput}
            onChange={(e) => setSampleInput(e.target.value)}
            placeholder="Type ID or card number..."
            className="text-xs p-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-1 focus:ring-rose-400 font-mono"
          />

          <div className="flex items-center justify-between bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-mono font-bold text-emerald-700">
            <span>{maskedOutput}</span>
            {onApplyMaskedText && (
              <button
                type="button"
                onClick={handleApply}
                className="text-[10px] bg-rose-100 hover:bg-rose-200 text-rose-800 font-sans font-bold px-2 py-0.5 rounded transition-colors flex items-center gap-1"
              >
                {copied ? <Check className="w-3 h-3 text-emerald-600" /> : <EyeOff className="w-3 h-3 text-rose-600" />}
                {copied ? 'Applied' : 'Use Mask'}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

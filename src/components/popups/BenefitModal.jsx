import React, { useEffect, useMemo } from 'react';
import { X, ShieldCheck } from 'lucide-react';

const BenefitModal = ({
  isOpen,
  onClose,
  benefits,
  selectedBenefits,
  onToggle,
  onApply,
}) => {
  const total = useMemo(
    () =>
      Object.values(selectedBenefits || {}).reduce((acc, cur) => acc + cur, 0),
    [selectedBenefits],
  );

  if (!isOpen) return null;

  return (
    <div className='fixed inset-0 z-50 flex items-center justify-center bg-slate-900/80 p-4 font-sans backdrop-blur-sm'>
      <div className='animate-in zoom-in w-full max-w-md overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl duration-200'>
        <div className='flex items-center justify-between border-b bg-slate-900 p-6 font-bold text-white'>
          <div className='flex items-center gap-2'>
            <ShieldCheck size={20} className='text-amber-400' />
            <span>카드 혜택 정밀 분석</span>
          </div>
          <button
            onClick={onClose}
            className='rounded-lg p-1 hover:bg-white/20'
          >
            <X size={24} />
          </button>
        </div>
        <div className='max-h-[50vh] space-y-3 overflow-y-auto bg-slate-50 p-6'>
          {benefits.length > 0 ? (
            benefits.map((b, idx) => (
              <div
                key={idx}
                className='flex items-center justify-between rounded-xl border bg-white p-4 shadow-sm'
              >
                <div className='flex-1'>
                  <p className='font-bold text-slate-700'>{b.label}</p>
                  <p className='font-black text-amber-600'>
                    {parseInt(b.value).toLocaleString()}원
                  </p>
                </div>
                <div className='flex gap-2'>
                  <button
                    onClick={() => onToggle(idx, 0)}
                    className={`rounded-lg px-3 py-2 text-xs font-bold transition-all ${selectedBenefits[idx] === 0 ? 'bg-slate-800 text-white' : 'bg-slate-100 text-slate-400'}`}
                  >
                    미선택
                  </button>
                  <button
                    onClick={() => onToggle(idx, parseInt(b.value, 10))}
                    className={`rounded-lg px-3 py-2 text-xs font-bold transition-all ${selectedBenefits[idx] > 0 ? 'bg-amber-500 text-white' : 'bg-slate-100 text-slate-400'}`}
                  >
                    선택
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className='py-10 text-center font-bold text-slate-400'>
              등록된 혜택이 없습니다.
            </div>
          )}
        </div>
        <div className='flex items-center justify-between border-t bg-white p-6'>
          <div className='text-2xl font-black text-slate-900'>
            {total.toLocaleString()}원
          </div>
          <button
            onClick={() => onApply(total)}
            className='rounded-xl bg-amber-500 px-8 py-4 font-bold text-white shadow-lg shadow-amber-200 transition-transform active:scale-95'
          >
            적용하기
          </button>
        </div>
      </div>
    </div>
  );
};

export default BenefitModal;

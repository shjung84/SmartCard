import React, { useMemo, useState } from 'react';
import { func } from '@/utils/function';
import { useCardStore } from '@/hooks/useCardStore'; // useCardStore 훅 임포트

import {
  Calculator,
  Search,
  AlertCircle,
  Crown,
  Info,
  Tag,
} from 'lucide-react';
import BenefitModal from '@/components/popups/BenefitModal';

const UserView = () => {
  const [isBenefitModalOpen, setIsBenefitModalOpen] = useState(false);

  // useCardStore 훅을 사용하여 state와 actions를 가져옵니다.
  const { state, actions } = useCardStore();
  const {
    brands,
    selectedBrandCode,
    selectedCardId,
    selectedAnnualFee,
    monthlyUsage,
    monthlyBenefits,
    selectedBenefitMap,
    currentCards,
    currentCard,
    pickingResult,
  } = state;

  // brands 배열을 'no' 프로퍼티 기준으로 정렬하여 렌더링에 사용합니다.
  const sortedBrands = useMemo(
    () => [...brands].sort((a, b) => a.no - b.no),
    [brands],
  );

  const handleToggleBenefits = (idx, value) => {
    const currentSelection = selectedBenefitMap[idx] || 0;
    const newSelection = currentSelection === value ? 0 : value;
    actions.updateBenefits({ idx, value: newSelection });
  };

  const handleApplyBenefits = (total) => {
    actions.updateMonthlyBenefits(total);
    setIsBenefitModalOpen(false);
  };

  const benefits = currentCard?.benefits || [];

  return (
    <div className='animate-in fade-in space-y-6 duration-500'>
      <div className='rounded-lg border border-slate-200 bg-white p-2 shadow-xl'>
        <h2 className='mb-2 flex items-center gap-2 text-sm font-black text-slate-800'>
          <Calculator className='text-amber-500' size={20} /> 내 카드 효율 분석
        </h2>
        <div className='space-y-2'>
          <div className='space-y-2'>
            <label className='ml-1 text-sm font-bold text-slate-400'>
              카드사 선택
            </label>
            <select
              className='w-full appearance-none rounded-sm border border-slate-200 bg-slate-50 p-2 px-3 text-sm font-bold text-slate-700 transition-all outline-none focus:border-amber-500 focus:bg-white'
              value={selectedBrandCode}
              onChange={(e) => {
                // actions 객체의 함수를 직접 호출
                actions.updateSelectedBrandCode(e.target.value);
              }}
            >
              <option value=''>보유하신 카드사를 선택하세요</option>
              {sortedBrands.map((b) => (
                <option key={b.code} value={b.code}>
                  {b.label} ({b.cards?.length || 0}개)
                </option>
              ))}
            </select>
          </div>

          <div
            className={`animate-in slide-in-from-top-2 grid grid-cols-3 gap-3 ${!currentCard ? 'opacity-50' : ''}`}
          >
            {/* 카드 선택 */}
            <div className='col-span-2'>
              <label className='ml-1 text-sm font-bold text-slate-400'>
                카드 선택
              </label>
              <select
                className='ransition-all w-full appearance-none rounded-sm border border-slate-200 bg-slate-50 p-2 px-3 text-sm font-bold text-slate-700 outline-none focus:border-amber-500 focus:bg-white disabled:opacity-50'
                value={selectedCardId}
                onChange={(e) => {
                  // actions 객체의 함수를 직접 호출
                  actions.updateSelectedCardId(e.target.value);
                }}
                disabled={!selectedBrandCode}
              >
                <option value=''>사용 중인 카드를 선택하세요</option>
                {currentCards.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.label}
                  </option>
                ))}
              </select>
            </div>

            <div className='col-span-1'>
              <p className='mb-1 flex items-center gap-1 text-sm font-bold text-slate-400'>
                <Tag size={12} /> 카드 종류
              </p>
              <p className='rounded-sm border border-slate-200 bg-slate-50 p-2 px-3 text-sm font-bold text-slate-800'>
                {currentCard?.category?.label || '-'}
              </p>
            </div>
          </div>

          {/* 연회비 설정 */}
          <div
            className={`animate-in slide-in-from-top-2 flex gap-3 ${!currentCard ? 'opacity-50' : ''}`}
          >
            <div className='w-60 rounded-sm border border-slate-200 bg-slate-50 p-2 px-3'>
              <p className='mb-1 text-sm font-bold text-slate-400'>
                연회비 설정
              </p>
              <select
                className='w-full appearance-none bg-transparent text-sm font-bold text-slate-800 outline-none disabled:cursor-not-allowed'
                value={selectedAnnualFee}
                onChange={
                  (e) => actions.updateSelectedAnnualFee(Number(e.target.value)) // actions 객체의 함수를 직접 호출
                }
                disabled={!currentCard}
              >
                <option value='0' disabled>
                  선택하세요
                </option>
                {currentCard?.annualFee.map((fee, i) => (
                  <option key={i} value={fee.value}>
                    {fee.label} ({Number(fee.value).toLocaleString()}
                    원)
                  </option>
                ))}
              </select>
            </div>
            <div className='w-40 rounded-sm border border-slate-200 bg-slate-50 p-2 px-3'>
              <p className='mb-1 text-sm font-bold text-slate-400'>실적 조건</p>
              <p className='text-sm font-bold text-slate-800'>
                월{' '}
                {currentCard
                  ? (currentCard.minUsage / 10000).toLocaleString()
                  : '-'}{' '}
                만원 이상
              </p>
            </div>
          </div>
          <div className='animate-in slide-in-from-top-2'>
            <label className='ml-1 flex items-center gap-1 text-sm font-bold text-slate-400'>
              <Info size={12} /> 주요 사용 조건
            </label>
            <div className='flex items-center rounded-sm border border-slate-200 bg-slate-50 p-2 px-3 text-sm font-bold text-slate-800'>
              {currentCard?.condition?.length > 0 ? (
                <div className='w-full space-y-1'>
                  {currentCard.condition.map(
                    (cond, i) =>
                      (cond.label || cond.value) && (
                        <div
                          key={i}
                          className='flex justify-between px-1 text-sm'
                        >
                          <span className='font-medium text-slate-500'>
                            {cond.label}
                          </span>
                          <span className='font-bold text-slate-700'>
                            {cond.value}
                          </span>
                        </div>
                      ),
                  )}
                </div>
              ) : (
                <div className='w-full text-center text-sm font-bold text-slate-400'>
                  {currentCard ? '등록된 조건 없음' : '카드를 선택하세요'}
                </div>
              )}
            </div>
          </div>
          <div className='space-y-2'>
            <label className='ml-1 text-sm font-bold text-slate-400'>
              월 혜택 받은 금액
            </label>
            <div className='group relative'>
              <input
                type='text'
                readOnly
                value={currentCard ? func.formatCurrency(monthlyBenefits) : '0'}
                className='w-full rounded-sm border border-slate-200 bg-slate-50 py-5 pr-14 pl-16 text-right text-lg font-black text-amber-700 shadow-sm'
              />
              <button
                onClick={() => setIsBenefitModalOpen(true)}
                className='absolute top-1/2 left-3 -translate-y-1/2 rounded-lg bg-slate-900 p-2.5 text-amber-400 shadow-md transition-transform active:scale-90 disabled:cursor-not-allowed disabled:bg-slate-300'
                disabled={!currentCard}
              >
                <Search size={20} />
              </button>
              <span className='absolute top-1/2 right-5 -translate-y-1/2 font-bold text-slate-400'>
                원
              </span>
            </div>
          </div>
          <div className='space-y-2'>
            <label className='ml-1 text-[14px] font-black text-slate-400'>
              월 평균 사용 금액
            </label>
            <div className='relative'>
              <input
                type='text'
                placeholder='0'
                value={monthlyUsage}
                onChange={(
                  e, // actions 객체의 함수를 직접 호출
                ) =>
                  actions.updateMonthlyUsage(
                    func.formatCurrency(e.target.value),
                  )
                }
                className='w-full rounded-sm border-2 border-slate-100 bg-white py-6 pr-14 pl-6 text-right text-2xl font-black shadow-inner outline-none focus:border-amber-500 disabled:cursor-not-allowed disabled:bg-slate-50'
                disabled={!currentCard}
              />
              <span className='absolute top-1/2 right-5 -translate-y-1/2 font-bold text-slate-400'>
                원
              </span>
            </div>
          </div>

          {/* 피킹률 결과 */}
          {monthlyUsage &&
            (pickingResult.isValid ? (
              <div className='group relative overflow-hidden rounded-2xl border-t-4 border-amber-500 bg-gradient-to-br from-slate-800 to-slate-950 p-8 text-center text-white shadow-2xl'>
                <div className='absolute top-0 right-0 p-4 opacity-5 transition-transform group-hover:rotate-12'>
                  <Crown size={120} />
                </div>
                <p className='mb-3 text-[14px] font-black tracking-[0.3em] text-amber-400'>
                  실질 피킹률 리포트
                </p>
                <div className='mb-3 text-7xl font-black text-amber-50'>
                  {pickingResult.netRate}
                  <span className='text-2xl font-normal opacity-40'>%</span>
                </div>
                <div className='inline-block rounded-full border border-amber-500/40 bg-amber-500/10 px-8 py-2.5 text-sm font-bold text-amber-400'>
                  {Number(pickingResult.netRate) >= 3
                    ? '권장 등급: 평균 이상의 우수한 효율 ✅'
                    : '주의 등급: 카드 변경을 권장 ⚠️'}
                </div>
                <div>
                  적정 사용 금액 : {pickingResult.optimalUsage.toLocaleString()}
                  원
                </div>
              </div>
            ) : (
              <div className='animate-pulse rounded-2xl border-2 border-dashed border-red-200 p-8 text-center text-red-600'>
                <AlertCircle className='mx-auto mb-3 text-red-400' size={40} />
                <p className='text-lg font-black'>{pickingResult.message}</p>
              </div>
            ))}
        </div>
      </div>
      <BenefitModal
        isOpen={isBenefitModalOpen}
        onClose={() => setIsBenefitModalOpen(false)}
        benefits={benefits}
        selectedBenefits={selectedBenefitMap}
        onToggle={handleToggleBenefits}
        onApply={handleApplyBenefits}
      />
    </div>
  );
};

export default UserView;

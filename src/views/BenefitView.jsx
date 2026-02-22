import React, { useState, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  toggleUserCardSelection,
  selectSelectedUserCardIds,
} from '@/store/slices/card';
import { selectBrands } from '@/store/slices/brand';
import { MapPin, Trash2, PlusCircle } from 'lucide-react';

const BenefitView = () => {
  const dispatch = useDispatch();
  const brands = useSelector(selectBrands);
  const selectedUserCardIds = useSelector(selectSelectedUserCardIds);

  // 보유 카드 등록 폼 상태
  const [searchKeyword, setSearchKeyword] = useState('');
  const [addBrandCode, setAddBrandCode] = useState('');
  const [addCardId, setAddCardId] = useState('');

  // 선택된 카드사에 해당하는 카드 목록
  const cardsForSelectedBrand = useMemo(() => {
    if (!addBrandCode) return [];
    const brand = brands.find((b) => b.code === addBrandCode);
    return brand ? brand.cards : [];
  }, [addBrandCode, brands]);

  // 내가 가진 카드 객체 목록
  const myCards = useMemo(() => {
    if (!brands.length || !selectedUserCardIds.length) return [];
    const allCards = brands.flatMap((b) =>
      b.cards.map((c) => ({ ...c, brandLabel: b.label })),
    );
    return allCards.filter((c) => selectedUserCardIds.includes(c.id));
  }, [brands, selectedUserCardIds]);

  const filteredBenefits = useMemo(() => {
    if (!searchKeyword.trim() || !myCards.length) return [];
    const lowerCaseKeyword = searchKeyword.toLowerCase();
    return myCards.flatMap((card) =>
      (card.benefits || [])
        .filter((benefits) =>
          benefits.label.toLowerCase().includes(lowerCaseKeyword),
        )
        .map((benefits) => ({
          ...benefits,
          cardLabel: card.label,
          brandLabel: card.brandLabel,
        })),
    );
  }, [searchKeyword, myCards]);

  const handleAddCard = () => {
    const cardIdAsNumber = Number(addCardId);
    if (addCardId && !selectedUserCardIds.includes(cardIdAsNumber)) {
      dispatch(toggleUserCardSelection(cardIdAsNumber));
    }
    setAddBrandCode('');
    setAddCardId('');
  };

  return (
    <div className='animate-in fade-in space-y-6 duration-500'>
      <div className='rounded-2xl border border-slate-200 bg-white p-8 shadow-xl'>
        <h2 className='mb-8 flex items-center gap-2 text-xl font-black text-slate-800'>
          <MapPin className='text-amber-500' size={24} /> 장소별 혜택 찾기
        </h2>
        <div className='space-y-6'>
          <div className='space-y-4'>
            <div>
              <h3 className='text-base font-black'>보유 카드 등록</h3>
              <div className='mt-1 flex items-center gap-2'>
                <select
                  value={addBrandCode}
                  onChange={(e) => {
                    setAddBrandCode(e.target.value);
                    setAddCardId('');
                  }}
                  className='flex-1 rounded-lg border border-slate-200 bg-slate-50 p-3 text-sm font-bold outline-none focus:border-amber-500'
                >
                  <option value=''>카드사 선택</option>
                  {brands.map((b) => (
                    <option key={b.code} value={b.code}>
                      {b.label}
                    </option>
                  ))}
                </select>
                <select
                  value={addCardId}
                  onChange={(e) => setAddCardId(e.target.value)}
                  disabled={!addBrandCode}
                  className='flex-1 rounded-lg border border-slate-200 bg-slate-50 p-3 text-sm font-bold outline-none focus:border-amber-500 disabled:opacity-50'
                >
                  <option value=''>카드 선택</option>
                  {cardsForSelectedBrand.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.label}
                    </option>
                  ))}
                </select>
                <button
                  onClick={handleAddCard}
                  disabled={
                    !addCardId ||
                    selectedUserCardIds.includes(Number(addCardId))
                  }
                  className='rounded-lg bg-slate-800 p-3 text-white transition-colors disabled:bg-slate-300'
                >
                  <PlusCircle size={20} />
                </button>
              </div>
            </div>

            <div>
              <div className='flex items-baseline justify-between'>
                <h3 className='text-base font-black'>내가 가진 카드 목록</h3>
                <span className='mr-1 text-xs font-bold text-slate-500'>
                  총 {myCards.length}개
                </span>
              </div>
              <div className='mt-1 grid max-h-[200px] grid-cols-1 gap-2 overflow-y-auto pr-1'>
                {myCards.length > 0 ? (
                  myCards.map((card) => (
                    <div
                      key={card.id}
                      className='flex items-center justify-between rounded-xl border bg-white p-4 shadow-sm'
                    >
                      <div>
                        <p className='text-sm font-bold text-slate-800'>
                          {card.label}
                        </p>
                        <p className='text-xs font-semibold text-slate-400'>
                          {card.brandLabel}
                        </p>
                      </div>
                      <button
                        onClick={() =>
                          dispatch(toggleUserCardSelection(card.id))
                        }
                        className='rounded-lg p-2 text-slate-400 hover:text-red-500'
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  ))
                ) : (
                  <div className='rounded-xl bg-slate-50 py-8 text-center font-bold text-slate-400'>
                    보유 카드를 등록해 주세요.
                  </div>
                )}
              </div>
            </div>
          </div>
          <div className='group relative'>
            <MapPin className='absolute top-1/2 left-4 -translate-y-1/2 text-slate-400 transition-colors group-focus-within:text-amber-500' />
            <input
              type='text'
              placeholder='어디로 가시나요? (예: 인천공항, 마트)'
              value={searchKeyword}
              onChange={(e) => setSearchKeyword(e.target.value)}
              className='w-full rounded-xl border-2 border-slate-100 p-4 pl-12 text-lg shadow-inner transition-all outline-none focus:border-amber-500'
            />
          </div>
          <div className='space-y-3'>
            {filteredBenefits.length > 0 ? (
              filteredBenefits.map((b, idx) => (
                <div
                  key={idx}
                  className='animate-in slide-in-from-left rounded-xl border-l-4 border-amber-500 bg-slate-50 p-5 shadow-sm duration-300'
                >
                  <div className='mb-1 text-[10px] font-black font-bold text-amber-600 uppercase'>
                    {b.brandLabel} | {b.cardLabel}
                  </div>
                  <div className='text-lg font-black text-slate-800'>
                    {b.label}
                  </div>
                  <div className='mt-1 text-sm font-bold text-slate-500'>
                    예상 혜택 가치: {parseInt(b.value).toLocaleString()}원 상당
                  </div>
                </div>
              ))
            ) : searchKeyword ? (
              <div className='py-10 text-center font-bold text-slate-400'>
                검색 결과가 없습니다.
              </div>
            ) : (
              <div className='py-10 text-center text-slate-300'>
                카드를 선택하고 장소를 입력해 보세요.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BenefitView;

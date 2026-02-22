import React from 'react';
import {
  Plus,
  Trash2,
  ArrowUp,
  ArrowDown,
  Edit3,
  GripVertical,
} from 'lucide-react';

const BrandManager = ({
  sortedBrands,
  brands,
  actions,
  onAddBrand,
  onAddCard,
  onEditCard,
}) => {
  return (
    <div className='overflow-hidden rounded-2xl border bg-white shadow-xl'>
      <div className='flex items-center justify-between bg-slate-900 p-5 font-bold text-white'>
        <span>카드사 순서 및 관리</span>
        <button
          onClick={onAddBrand}
          className='flex items-center gap-1 rounded-lg bg-amber-500 px-4 py-2 text-sm font-black text-slate-900 transition-colors hover:bg-amber-400'
        >
          <Plus size={16} /> 신규 카드사
        </button>
      </div>
      <div className='divide-y'>
        {sortedBrands.map((brand, idx) => {
          const originalIndex = brands.findIndex((b) => b.id === brand.id);
          return (
            <div key={brand.id} className='bg-white p-4 hover:bg-orange-50'>
              <div className='mb-3 flex items-center justify-between'>
                <div className='flex items-center gap-3'>
                  <div className='flex flex-col gap-1'>
                    <button
                      onClick={() =>
                        actions.updateBrandOrder({
                          index: originalIndex,
                          direction: 'up',
                        })
                      }
                      className='text-slate-300 hover:text-amber-500 disabled:opacity-20'
                      disabled={idx === 0}
                    >
                      <ArrowUp size={16} />
                    </button>
                    <button
                      onClick={() =>
                        actions.updateBrandOrder({
                          index: originalIndex,
                          direction: 'down',
                        })
                      }
                      className='text-slate-300 hover:text-amber-500 disabled:opacity-20'
                      disabled={idx === sortedBrands.length - 1}
                    >
                      <ArrowDown size={16} />
                    </button>
                  </div>
                  <GripVertical size={20} className='text-slate-200' />
                  <div>
                    <h4 className='text-lg font-black text-slate-800'>
                      [{brand.no}] {brand.label}
                    </h4>
                    <span className='text-[10px] font-bold tracking-widest text-slate-400 uppercase'>
                      {brand.code}
                    </span>
                  </div>
                </div>
                <div className='flex items-center gap-1'>
                  <button
                    onClick={() => actions.deleteBrand(brand.id)}
                    className='p-2 text-slate-300 hover:text-red-500'
                  >
                    <Trash2 size={18} />
                  </button>
                  <button
                    onClick={() => onAddCard(brand.code)}
                    className='rounded-lg bg-slate-800 px-3 py-1.5 text-[11px] font-bold text-white'
                  >
                    + 카드추가
                  </button>
                </div>
              </div>
              <div className='ml-12 space-y-2'>
                {brand.cards.map((card) => (
                  <div
                    key={card.id}
                    className='flex items-center justify-between rounded-xl border border-slate-100 bg-indigo-50 p-3'
                  >
                    <div className='text-sm font-bold text-slate-600'>
                      {card.label}
                    </div>
                    <div className='flex items-center gap-2'>
                      <button
                        onClick={() => onEditCard(brand.code, card)}
                        className='p-1.5 text-slate-400 hover:text-blue-500'
                      >
                        <Edit3 size={16} />
                      </button>
                      <button
                        onClick={() =>
                          actions.deleteCard({
                            brandCode: brand.code,
                            cardId: card.id,
                          })
                        }
                        className='p-1.5 text-slate-400 hover:text-red-500'
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default BrandManager;

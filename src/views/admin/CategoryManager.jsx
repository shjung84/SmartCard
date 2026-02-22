import React, { useMemo, useState } from 'react';
import { useCardStore } from '@/hooks/useCardStore';
import { Trash2, Plus, ChevronDown, ChevronUp } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const CategoryManager = ({ onAddCategory, onDeleteCategory }) => {
  const { categories, brands } = useCardStore().state;
  const [isOpen, setIsOpen] = useState(false);

  // 카테고리목록을 가져와서 각 카테고리가 몇 개의 카드에 사용되고 있는지 계산하고 각각 아이템에 저장
  // 카테고리 목록을 확장하여 각 카테고리가 사용된 횟수(count)를 포함
  const categoriesLists = useMemo(() => {
    // 1. 방어 코드: 카테고리 데이터가 없으면 빈 배열 반환
    if (!categories?.length) {
      return [];
    }
    // 2. 방어 코드: 카드 데이터가 없으면 모든 카운트를 0으로 설정
    if (!brands?.length) {
      return categories.map((cat) => ({ ...cat, count: 0 }));
    }

    // 3. 전체 카드를 순회하며 카테고리별 사용 횟수 집계 (맵 생성)
    const counts = {};

    brands.forEach((brand) => {
      brand.cards?.forEach((card) => {
        // 요구사항 반영: card.category는 무조건 문자열 ID라고 가정
        const catValue = card.category;

        if (catValue) {
          // 해당 카테고리 ID의 카운트를 1 증가 (없으면 초기값 0에서 1로)
          counts[catValue] = (counts[catValue] || 0) + 1;
        }
      });
    });

    // 4. 기존 카테고리 목록에 count 속성을 병합하여 반환
    return categories.map((cat) => ({
      ...cat,
      // categories의 value와 card.category가 일치하는 횟수를 매핑
      count: counts[cat.value] || 0,
    }));
  }, [categories, brands]);

  return (
    <div className='overflow-hidden rounded-2xl border bg-white shadow-xl'>
      <div className='flex items-center justify-between bg-slate-900 p-5 font-bold text-white'>
        <div className='flex items-center gap-2'>
          <span>카드 카테고리 관리</span>
          <button
            onClick={() => setIsOpen((o) => !o)}
            className='cursor-pointer p-1 text-slate-300'
          >
            {isOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
          </button>
        </div>
        <button
          onClick={onAddCategory}
          className='rounded-lg bg-amber-500 p-2 text-slate-900 transition-colors hover:bg-amber-400'
        >
          <Plus size={16} />
        </button>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className='overflow-hidden'
          >
            <div className='divide-y'>
              {categoriesLists.map((cat) => (
                <div
                  key={cat.id}
                  className='flex items-center justify-between p-4'
                >
                  <div className='flex items-center gap-3'>
                    <span className='font-bold text-slate-600'>
                      {cat.value}
                    </span>
                    <span className='font-bold text-slate-600'>
                      {cat.label}
                    </span>
                    <div className='flex h-5 w-5 items-center justify-center rounded-full bg-amber-500 text-xs font-bold text-white'>
                      {cat.count}
                    </div>
                  </div>
                  <button
                    onClick={() => onDeleteCategory(cat.id)}
                    disabled={cat.count > 0}
                    className='p-2 text-red-500 transition-colors disabled:cursor-not-allowed disabled:text-red-200'
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CategoryManager;

import React, {
  useMemo,
  useEffect,
  useRef,
  useState,
  useCallback,
} from 'react';
import {
  Reorder,
  useDragControls,
  motion,
  AnimatePresence,
} from 'framer-motion';
import {
  Plus,
  Trash2,
  Edit3,
  GripVertical,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { useCardStore } from '@/hooks/useCardStore';

const BrandItem = ({
  brand,
  idx,
  onAddCard,
  onEditCard,
  onDeleteBrand,
  onDeleteCard,
  onDragEndCommit,
}) => {
  const controls = useDragControls();
  const [isOpen, setIsOpen] = useState(false);
  const hasCards = brand.cards && brand.cards.length > 0;

  return (
    <Reorder.Item
      as='div' // ✅ 문자열만
      value={String(brand.id)} // ✅ Group values와 타입까지 동일하게
      layout
      dragListener={false}
      dragControls={controls}
      transition={{ type: 'spring', stiffness: 600, damping: 45 }}
      whileDrag={{ scale: 1.05 }}
      onDragEnd={() => {
        // 드랍 직후 commit (레이스 방지로 한 프레임 뒤에)
        requestAnimationFrame(onDragEndCommit);
      }}
      className='my-2 rounded-lg border-3 border-white bg-white p-2 transition-colors hover:border-slate-300'
    >
      <div className='flex items-center justify-between'>
        <div className='flex items-center gap-3'>
          {/* ✅ 드래그 핸들만 남김 */}
          <button
            onPointerDown={(e) => controls.start(e)}
            className='cursor-grab active:cursor-grabbing'
          >
            <GripVertical size={20} className='text-slate-200' />
          </button>

          <div className='flex items-center gap-2'>
            <span className='w-7 text-sm font-bold text-slate-400'>
              [{brand.no ?? idx + 1}]
            </span>
            <span className='w-10 text-sm font-bold text-pink-400'>
              {brand.code}
            </span>
            <h4 className='text-lg font-black text-slate-800'>{brand.label}</h4>
            <span className='text-xs font-bold text-slate-400'>
              ({brand.cards.length}개)
            </span>
          </div>
        </div>

        <div className='flex items-center gap-1'>
          <button
            onClick={() => onAddCard(brand.code)}
            className='cursor-pointer p-2 text-green-500'
          >
            <Plus size={18} />
          </button>
          <button
            disabled={brand.cards && brand.cards.length > 0}
            onClick={() => {
              if (window.confirm('해당 카드사를 삭제하시겠습니까?')) {
                onDeleteBrand(brand.id);
              }
            }}
            className='cursor-pointer p-2 text-red-500 disabled:cursor-not-allowed disabled:text-red-200'
          >
            <Trash2 size={18} />
          </button>
          {hasCards && (
            <button
              onClick={() => setIsOpen((o) => !o)}
              className='cursor-pointer p-2 text-slate-400'
            >
              {isOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
            </button>
          )}
        </div>
      </div>

      <AnimatePresence>
        {isOpen && hasCards && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className='overflow-hidden'
          >
            <div className='mt-2 space-y-2 pl-5'>
              {(brand.cards || []).map((card) => (
                <div
                  key={card.id}
                  className='flex items-center justify-between rounded-lg border border-slate-100 bg-indigo-50 px-3'
                >
                  <div className='text-sm font-bold text-slate-600'>
                    {card.label}
                  </div>

                  <div className='flex items-center gap-2'>
                    <button
                      onClick={() => onEditCard(brand.code, card)}
                      className='cursor-pointer p-1.5 text-blue-500'
                    >
                      <Edit3 size={16} />
                    </button>

                    <button
                      onClick={() => {
                        if (window.confirm('해당 카드를 삭제하시겠습니까?')) {
                          onDeleteCard({
                            brandCode: brand.code,
                            cardId: card.id,
                          });
                        }
                      }}
                      className='cursor-pointer p-1.5 text-red-500'
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </Reorder.Item>
  );
};

const BrandManager = ({ onAddBrand, onAddCard, onEditCard }) => {
  const { state, actions } = useCardStore();
  const { brands = [] } = state;
  const [isOpen, setIsOpen] = useState(true);

  const sortedBrands = useMemo(
    () => [...brands].sort((a, b) => (a.no ?? Infinity) - (b.no ?? Infinity)),
    [brands],
  );

  // id -> brand 매핑
  const brandById = useMemo(() => {
    const m = new Map();
    brands.forEach((b) => m.set(String(b.id), b));
    return m;
  }, [brands]);

  // 로컬에서 드래그 순서 관리
  const [orderedIds, setOrderedIds] = useState(() =>
    sortedBrands.map((b) => String(b.id)),
  );

  // brands 변경(초기 로딩/추가/삭제/저장 반영) 시 로컬 순서 동기화
  useEffect(() => {
    setOrderedIds(sortedBrands.map((b) => String(b.id)));
  }, [sortedBrands]);

  // 최신 orderedIds를 commit에서 쓰기 위한 ref
  const orderedIdsRef = useRef(orderedIds);
  useEffect(() => {
    orderedIdsRef.current = orderedIds;
  }, [orderedIds]);

  // 화면에 그릴 브랜드(로컬 순서대로)
  const orderedBrands = useMemo(
    () => orderedIds.map((id) => brandById.get(id)).filter(Boolean),
    [orderedIds, brandById],
  );

  const commitOrder = useCallback(() => {
    const ids = orderedIdsRef.current;
    // store에 반영 (no 재할당)
    actions.setBrandOrder(ids);
    // 서버(db.json)에 저장 (PATCH)
    actions.saveBrandOrder(ids);
  }, [actions]);

  return (
    <div className='overflow-hidden rounded-2xl border bg-white shadow-xl'>
      <div className='flex items-center justify-between bg-slate-900 p-5 font-bold text-white'>
        <div className='flex items-center gap-2'>
          <span>카드사 순서 및 관리</span>
          <button
            onClick={() => setIsOpen((o) => !o)}
            className='cursor-pointer p-1 text-slate-300'
          >
            {isOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
          </button>
        </div>
        <button
          onClick={onAddBrand}
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
            <Reorder.Group
              as='div'
              axis='y'
              values={orderedIds}
              onReorder={setOrderedIds} // ✅ 드래그 중엔 로컬만 변경
              className='border-t bg-slate-100 p-2'
            >
              {orderedBrands.map((brand, idx) => (
                <BrandItem
                  key={brand.id}
                  brand={brand}
                  idx={idx}
                  onAddCard={onAddCard}
                  onEditCard={onEditCard}
                  onDeleteBrand={(id) => actions.deleteBrand(id)}
                  onDeleteCard={(payload) => actions.deleteCard(payload)}
                  onDragEndCommit={commitOrder} // ✅ 드랍 끝나면 저장
                />
              ))}
            </Reorder.Group>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default BrandManager;

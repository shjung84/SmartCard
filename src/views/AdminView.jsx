import React, { useEffect, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Settings } from 'lucide-react';
import { useCardStore } from '@/hooks/useCardStore';

import CategoryManager from './admin/CategoryManager';
import BrandManager from './admin/BrandManager';
import BrandForm from './admin/BrandForm';
import CardForm from './admin/CardForm';
import CategoryForm from './admin/CategoryForm';

const AdminView = () => {
  const navigate = useNavigate();
  const { state, actions } = useCardStore();
  const { brands = [], categories = [] } = state;

  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [isBrandModalOpen, setIsBrandModalOpen] = useState(false);
  const [isCardModalOpen, setIsCardModalOpen] = useState(false);

  // 카드 폼 컨텍스트(어느 브랜드에 추가/수정인지)
  const [cardCtx, setCardCtx] = useState({
    brandCode: '',
    initialCard: null, // 수정이면 card 객체, 추가면 null
  });

  // 초기 데이터 로딩
  useEffect(() => {
    if (brands.length === 0) actions.fetchData();
  }, [brands.length, actions]);

  return (
    <>
      <div className='animate-in slide-in-from-right space-y-6 duration-400'>
        <div className='mb-4 flex items-center justify-between px-2'>
          <h2 className='flex items-center gap-2 text-2xl font-black text-slate-800'>
            <Settings className='text-amber-500' /> 시스템 관리자
          </h2>
          <button
            onClick={() => navigate('/')}
            className='rounded-lg border px-3 py-1 text-sm font-bold text-slate-400 hover:bg-white'
          >
            돌아가기
          </button>
        </div>

        <CategoryManager
          onAddCategory={() => setIsCategoryModalOpen(true)}
          onDeleteCategory={(id) => actions.deleteCategory(id)}
        />

        <BrandManager
          onAddBrand={() => setIsBrandModalOpen(true)}
          onAddCard={(brandCode) => {
            setCardCtx({ brandCode, initialCard: null }); // 추가 모드
            setIsCardModalOpen(true);
          }}
          onEditCard={(brandCode, card) => {
            setCardCtx({ brandCode, initialCard: card }); // 수정 모드
            setIsCardModalOpen(true);
          }}
        />
      </div>

      {isCategoryModalOpen && (
        <div className='animate-in fade-in fixed inset-0 z-50 flex items-center justify-center bg-black/60'>
          <CategoryForm
            onCancel={() => setIsCategoryModalOpen(false)}
            onSave={(category) => {
              actions.addCategory(category);
              setIsCategoryModalOpen(false);
            }}
          />
        </div>
      )}

      {isBrandModalOpen && (
        <div className='animate-in fade-in fixed inset-0 z-50 flex items-center justify-center bg-black/60'>
          <BrandForm
            onCancel={() => setIsBrandModalOpen(false)}
            onSave={(brand) => {
              actions.addBrand(brand);
              setIsBrandModalOpen(false);
            }}
          />
        </div>
      )}

      {isCardModalOpen && (
        <div className='animate-in fade-in fixed inset-0 z-50 flex items-center justify-center bg-black/60'>
          <CardForm
            categories={categories}
            brandCode={cardCtx.brandCode}
            initialCard={cardCtx.initialCard}
            onCancel={() => setIsCardModalOpen(false)}
            onSave={(cardData) => {
              actions.addOrUpdateCard({
                brandCode: cardCtx.brandCode,
                cardData,
              });
              setIsCardModalOpen(false);
            }}
          />
        </div>
      )}
    </>
  );
};

export default AdminView;

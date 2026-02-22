import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCardStore } from '@/hooks/useCardStore';
import { Settings } from 'lucide-react';

// Import new components
import BrandForm from '@/components/admin/BrandForm';
import CardForm from '@/components/admin/CardForm';
import CategoryManager from '@/components/admin/CategoryManager';
import BrandManager from '@/components/admin/BrandManager';

const AdminView = () => {
  const navigate = useNavigate();
  const { state, actions } = useCardStore();
  const { brands, categories = [] } = state;

  // Fetch initial data if it's not already loaded
  useEffect(() => {
    if (brands.length === 0) {
      actions.fetchData();
    }
  }, [brands.length, actions]);

  // Create a sorted copy for rendering, based on the 'no' property.
  const sortedBrands = useMemo(
    () => [...brands].sort((a, b) => a.no - b.no),
    [brands],
  );

  // Calculate how many cards are using each category.
  const categoryUsageCount = useMemo(() => {
    const counts = {};
    // Initialize all category counts to 0
    categories.forEach((cat) => {
      counts[cat.value] = 0;
    });

    // Iterate through all cards and increment the count for their category
    brands.forEach((brand) => {
      brand.cards.forEach((card) => {
        if (card.category && card.category.value) {
          if (counts[card.category.value] !== undefined) {
            counts[card.category.value]++;
          }
        }
      });
    });
    return counts;
  }, [brands, categories]);

  const [view, setView] = useState('admin'); // admin, brand-form, card-form
  const [editingCard, setEditingCard] = useState(null);
  const [targetBrandCode, setTargetBrandCode] = useState('');

  const handleSaveBrand = (brandData) => {
    actions.addBrand(brandData);
    setView('admin');
  };

  const handleSaveCard = (cardData) => {
    actions.addOrUpdateCard({
      brandCode: targetBrandCode,
      cardData,
    });
    setView('admin');
    setEditingCard(null);
    setTargetBrandCode('');
  };

  const handleAddBrand = () => {
    setView('brand-form');
  };

  const handleAddCard = (brandCode) => {
    setTargetBrandCode(brandCode);
    setEditingCard({
      id: null,
      label: '',
      minUsage: 0,
      category: null,
      condition: [{ label: '', value: '' }],
      annualFee: [{ label: '', value: '' }],
      benefits: [{ label: '', value: '' }],
    });
    setView('card-form');
  };

  const handleEditCard = (brandCode, card) => {
    setTargetBrandCode(brandCode);
    setEditingCard(card);
    setView('card-form');
  };

  const handleCancel = () => {
    setView('admin');
    setEditingCard(null);
    setTargetBrandCode('');
  };

  if (view === 'brand-form') {
    return <BrandForm onSave={handleSaveBrand} onCancel={handleCancel} />;
  }

  if (view === 'card-form') {
    return (
      <CardForm
        initialData={editingCard}
        categories={categories}
        onSave={handleSaveCard}
        onCancel={handleCancel}
      />
    );
  }

  return (
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

      {/* 카테고리 관리 */}
      <CategoryManager
        categories={categories}
        categoryUsageCount={categoryUsageCount}
        actions={actions}
      />

      <BrandManager
        sortedBrands={sortedBrands}
        brands={brands}
        actions={actions}
        onAddBrand={handleAddBrand}
        onAddCard={handleAddCard}
        onEditCard={handleEditCard}
      />
    </div>
  );
};

export default AdminView;

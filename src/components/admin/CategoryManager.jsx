import React, { useState } from 'react';
import { Trash2 } from 'lucide-react';

const CategoryManager = ({ categories, categoryUsageCount, actions }) => {
  const [categoryForm, setCategoryForm] = useState({ label: '' });

  const handleAddCategory = () => {
    if (categoryForm.label.trim()) {
      actions.addCategory(categoryForm);
      setCategoryForm({ label: '' });
    }
  };

  return (
    <div className='overflow-hidden rounded-2xl border bg-white shadow-xl'>
      <div className='flex items-center justify-between bg-slate-50 p-5 font-bold text-slate-800'>
        <span>카드 카테고리 관리</span>
      </div>
      <div className='divide-y'>
        {categories.map((cat) => (
          <div key={cat.id} className='flex items-center justify-between p-4'>
            <div className='flex items-center gap-3'>
              <span className='font-bold text-slate-600'>{cat.label}</span>
              {categoryUsageCount[cat.value] > 0 && (
                <div className='flex h-5 w-5 items-center justify-center rounded-full bg-amber-500 text-xs font-bold text-white'>
                  {categoryUsageCount[cat.value]}
                </div>
              )}
            </div>
            <button
              onClick={() => actions.deleteCategory(cat.id)}
              disabled={categoryUsageCount[cat.value] > 0}
              className='p-2 text-slate-300 transition-colors hover:text-red-500 disabled:cursor-not-allowed disabled:text-slate-200'
              title={
                categoryUsageCount[cat.value] > 0
                  ? '사용 중인 카드가 있어 삭제할 수 없습니다.'
                  : '카테고리 삭제'
              }
            >
              <Trash2 size={18} />
            </button>
          </div>
        ))}
      </div>
      <div className='flex gap-2 border-t p-4'>
        <input
          type='text'
          placeholder='새 카테고리 이름'
          value={categoryForm.label}
          onChange={(e) => setCategoryForm({ label: e.target.value })}
          className='flex-1 rounded-lg border bg-slate-50 p-3 text-sm font-bold'
        />
        <button
          onClick={handleAddCategory}
          className='rounded-lg bg-slate-800 px-4 text-sm font-bold text-white'
        >
          + 추가
        </button>
      </div>
    </div>
  );
};

export default CategoryManager;

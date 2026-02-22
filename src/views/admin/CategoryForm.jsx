import React, { useState } from 'react';

const CategoryForm = ({ onSave, onCancel }) => {
  const [form, setForm] = useState({ label: '', value: '' });

  const handleSave = () => {
    const label = form.label.trim();
    const value = form.value.trim();
    if (label && value) {
      onSave({ label, value });
    }
  };

  return (
    <div className='animate-in slide-in-from-bottom rounded-2xl border bg-white p-8 shadow-xl duration-300'>
      <h3 className='mb-8 text-2xl font-black text-slate-800'>
        새 카테고리 등록
      </h3>
      <div className='space-y-4'>
        <input
          type='text'
          placeholder='카테고리 ID (영문, 예: credit)'
          value={form.value}
          onChange={(e) => setForm((p) => ({ ...p, value: e.target.value }))}
          className='w-full rounded-xl border bg-slate-50 p-4 font-bold outline-none focus:border-amber-500'
        />
        <input
          type='text'
          placeholder='카테고리 이름 (예: 신용카드)'
          value={form.label}
          onChange={(e) => setForm((p) => ({ ...p, label: e.target.value }))}
          className='w-full rounded-xl border bg-slate-50 p-4 font-bold outline-none focus:border-amber-500'
        />
        <div className='flex gap-3 pt-4'>
          <button
            onClick={onCancel}
            className='flex-1 rounded-xl border py-4 font-bold hover:bg-slate-50'
          >
            취소
          </button>
          <button
            onClick={handleSave}
            className='flex-2 rounded-xl bg-slate-900 px-8 py-4 font-black text-white shadow-lg hover:bg-slate-800'
          >
            카테고리 저장
          </button>
        </div>
      </div>
    </div>
  );
};

export default CategoryForm;

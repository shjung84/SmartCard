import React, { useState } from 'react';

const BrandForm = ({ onSave, onCancel }) => {
  const [brandForm, setBrandForm] = useState({ label: '', code: '' });

  return (
    <div className='animate-in slide-in-from-bottom rounded-2xl border bg-white p-8 shadow-xl duration-300'>
      <h3 className='mb-8 text-2xl font-black text-slate-800'>
        카드사(브랜드) 정보 입력
      </h3>
      <div className='space-y-4'>
        <input
          type='text'
          placeholder='카드사 이름 (예: 현대카드)'
          value={brandForm.label}
          onChange={(e) =>
            setBrandForm({ ...brandForm, label: e.target.value })
          }
          className='w-full rounded-xl border bg-slate-50 p-4 font-bold outline-none focus:border-amber-500'
        />
        <input
          type='text'
          placeholder='기관 코드 (예: 0301)'
          value={brandForm.code}
          onChange={(e) => setBrandForm({ ...brandForm, code: e.target.value })}
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
            onClick={() => onSave(brandForm)}
            className='flex-2 rounded-xl bg-slate-900 px-8 py-4 font-black text-white shadow-lg hover:bg-slate-800'
          >
            카드사 저장하기
          </button>
        </div>
      </div>
    </div>
  );
};

export default BrandForm;

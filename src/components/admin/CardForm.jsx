import React, { useState, useEffect } from 'react';

const DynamicField = ({ item, index, section, title, type, onChange }) => (
  <div className='flex gap-2'>
    <input
      type='text'
      placeholder={title}
      value={item.label}
      onChange={(e) => onChange(section, index, 'label', e.target.value)}
      className='flex-1 rounded-lg border bg-slate-50 p-3 text-sm font-bold'
    />
    <input
      type={type}
      placeholder='값'
      value={item.value}
      onChange={(e) => onChange(section, index, 'value', e.target.value)}
      className='flex-1 rounded-lg border bg-slate-50 p-3 text-right text-sm font-bold'
    />
  </div>
);

const CardForm = ({ initialData, categories, onSave, onCancel }) => {
  const [cardForm, setCardForm] = useState(initialData);

  useEffect(() => {
    setCardForm(initialData);
  }, [initialData]);

  const handleDynamicFieldChange = (section, index, field, value) => {
    const updatedSection = cardForm[section].map((item, i) =>
      i === index ? { ...item, [field]: value } : item,
    );
    setCardForm({ ...cardForm, [section]: updatedSection });
  };

  const addDynamicField = (section) => {
    setCardForm({
      ...cardForm,
      [section]: [...cardForm[section], { label: '', value: '' }],
    });
  };

  const categoryValue =
    typeof cardForm.category === 'object' && cardForm.category !== null
      ? cardForm.category.value
      : cardForm.category || '';

  return (
    <div className='animate-in slide-in-from-bottom max-h-[85vh] overflow-y-auto rounded-2xl border bg-white p-8 shadow-xl duration-300'>
      <h3 className='mb-8 text-2xl font-black text-slate-800'>
        {cardForm.id ? '카드 정보 수정' : '새로운 카드 등록'}
      </h3>
      <div className='space-y-6 text-left'>
        {/* Card Name */}
        <div className='space-y-1'>
          <label className='ml-1 text-[11px] font-bold text-slate-400 uppercase'>
            카드 이름
          </label>
          <input
            type='text'
            value={cardForm.label}
            onChange={(e) =>
              setCardForm({ ...cardForm, label: e.target.value })
            }
            className='w-full rounded-xl border bg-slate-50 p-4 font-bold outline-none focus:border-amber-500'
          />
        </div>

        {/* Min Usage */}
        <div className='space-y-1'>
          <label className='ml-1 text-[11px] font-bold text-slate-400 uppercase'>
            전월 실적 조건 (원 단위)
          </label>
          <input
            type='number'
            value={cardForm.minUsage}
            onChange={(e) =>
              setCardForm({ ...cardForm, minUsage: Number(e.target.value) })
            }
            className='w-full rounded-xl border bg-slate-50 p-4 font-bold outline-none focus:border-amber-500'
          />
        </div>

        {/* Category */}
        <div className='space-y-1'>
          <label className='ml-1 text-[11px] font-bold text-slate-400 uppercase'>
            카드 종류
          </label>
          <select
            value={categoryValue}
            onChange={(e) => {
              const selectedCategory = categories.find(
                (c) => c.value === e.target.value,
              );
              setCardForm({
                ...cardForm,
                category: selectedCategory || null,
              });
            }}
            className='w-full rounded-xl border bg-slate-50 p-4 font-bold outline-none focus:border-amber-500'
          >
            <option value=''>종류 선택</option>
            {categories.map((cat) => (
              <option key={cat.value} value={cat.value}>
                {cat.label}
              </option>
            ))}
          </select>
        </div>

        {/* Dynamic Fields Sections */}
        {[
          {
            section: 'annualFee',
            title: '연회비 구성',
            type: 'number',
            placeholder: '구분 (예: 국내전용)',
          },
          {
            section: 'condition',
            title: '주요 사용 조건',
            type: 'text',
            placeholder: '조건 (예: 할인 한도)',
          },
          {
            section: 'benefits',
            title: '상세 혜택 (검색용 키워드 포함)',
            type: 'number',
            placeholder: '혜택명 (예: 스타벅스 무료)',
          },
        ].map(({ section, title, type, placeholder }) => (
          <div key={section} className='space-y-3'>
            <div className='flex items-center justify-between'>
              <label className='text-[11px] font-bold text-slate-400 uppercase'>
                {title}
              </label>
              <button
                onClick={() => addDynamicField(section)}
                className='text-[10px] font-black text-amber-600'
              >
                + 항목 추가
              </button>
            </div>
            {cardForm[section].map((item, i) => (
              <DynamicField
                key={i}
                item={item}
                index={i}
                section={section}
                title={placeholder}
                type={type}
                onChange={handleDynamicFieldChange}
              />
            ))}
          </div>
        ))}

        {/* Action Buttons */}
        <div className='flex gap-3 pt-6'>
          <button
            onClick={onCancel}
            className='flex-1 rounded-xl border py-4 font-bold'
          >
            취소
          </button>
          <button
            onClick={() => onSave(cardForm)}
            className='flex-2 rounded-xl bg-slate-900 px-8 py-4 font-black text-white shadow-lg'
          >
            카드 정보 저장
          </button>
        </div>
      </div>
    </div>
  );
};

export default CardForm;

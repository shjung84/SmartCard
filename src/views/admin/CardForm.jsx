import React, { useEffect, useMemo, useReducer } from 'react';
import KeyValueList from './KeyValueList';

const createId = () =>
  typeof crypto !== 'undefined' && crypto.randomUUID
    ? crypto.randomUUID()
    : `${Date.now()}-${Math.random().toString(16).slice(2)}`;

const createRow = () => ({ _id: createId(), label: '', value: '' });

const createEmptyCardForm = () => ({
  id: null,
  label: '',
  minUsage: 0,
  category: null,
  condition: [createRow()],
  annualFee: [createRow()],
  benefits: [createRow()],
});

// initialCard + categories 기반으로 category를 object로 맞춰주는 normalize
const normalizeCardForm = (initialCard, categories) => {
  const base = createEmptyCardForm();
  if (!initialCard) return base;

  const cat =
    typeof initialCard.category === 'object'
      ? initialCard.category
      : categories.find((c) => c.value === initialCard.category) || null;

  const normalizeList = (list, fallback) => {
    const src = Array.isArray(list) && list.length ? list : fallback;
    return src.map((r) => ({
      _id: r._id ?? createId(),
      label: r.label ?? '',
      value: r.value ?? '',
    }));
  };

  return {
    ...base,
    ...initialCard,
    category: cat,
    condition: normalizeList(initialCard.condition, base.condition),
    annualFee: normalizeList(initialCard.annualFee, base.annualFee),
    benefits: normalizeList(initialCard.benefits, base.benefits),
  };
};

const reducer = (state, action) => {
  switch (action.type) {
    case 'RESET':
      return action.payload;

    case 'SET_FIELD':
      return { ...state, [action.key]: action.value };

    case 'SET_CATEGORY':
      return { ...state, category: action.value };

    case 'ADD_ROW':
      return { ...state, [action.key]: [...state[action.key], createRow()] };

    case 'UPDATE_ROW':
      return {
        ...state,
        [action.key]: state[action.key].map((row, i) =>
          i === action.index ? { ...row, [action.field]: action.value } : row,
        ),
      };

    case 'REMOVE_ROW':
      if (state[action.key].length <= 1) return state;
      return {
        ...state,
        [action.key]: state[action.key].filter((_, i) => i !== action.index),
      };

    default:
      return state;
  }
};

const CardForm = ({ categories, brandCode, initialCard, onCancel, onSave }) => {
  const initialState = useMemo(
    () => normalizeCardForm(initialCard, categories),
    [initialCard, categories],
  );

  const [form, dispatch] = useReducer(reducer, initialState);

  // 초기 카드 변경 시(추가/수정 전환) 리셋
  useEffect(() => {
    dispatch({ type: 'RESET', payload: initialState });
  }, [initialState]);

  const categoryValue = form.category?.value ?? '';

  const addRow = (key) => dispatch({ type: 'ADD_ROW', key });
  const removeRow = (key, index) =>
    dispatch({ type: 'REMOVE_ROW', key, index });
  const updateRow = (key, index, field, value) =>
    dispatch({ type: 'UPDATE_ROW', key, index, field, value });

  return (
    <div className='animate-in slide-in-from-bottom max-h-[85vh] overflow-y-auto rounded-2xl border bg-white p-8 shadow-xl duration-300'>
      <h3 className='mb-8 text-2xl font-black text-slate-800'>
        {form.id ? '카드 정보 수정' : '새로운 카드 등록'}
      </h3>

      <div className='space-y-6 text-left'>
        <div className='space-y-1'>
          <label className='ml-1 text-[11px] font-bold text-slate-400 uppercase'>
            카드 이름
          </label>
          <input
            type='text'
            value={form.label}
            onChange={(e) =>
              dispatch({
                type: 'SET_FIELD',
                key: 'label',
                value: e.target.value,
              })
            }
            className='w-full rounded-xl border bg-slate-50 p-4 font-bold outline-none focus:border-amber-500'
          />
        </div>

        <div className='space-y-1'>
          <label className='ml-1 text-[11px] font-bold text-slate-400 uppercase'>
            전월 실적 조건
          </label>
          <input
            type='number'
            value={form.minUsage}
            onChange={(e) =>
              dispatch({
                type: 'SET_FIELD',
                key: 'minUsage',
                value: Number(e.target.value),
              })
            }
            className='w-full rounded-xl border bg-slate-50 p-4 font-bold outline-none focus:border-amber-500'
          />
        </div>

        <div className='space-y-1'>
          <label className='ml-1 text-[11px] font-bold text-slate-400 uppercase'>
            카드 종류
          </label>
          <select
            value={categoryValue}
            onChange={(e) => {
              const selected =
                categories.find((c) => c.value === e.target.value) || null;
              dispatch({ type: 'SET_CATEGORY', value: selected });
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

        <KeyValueList
          title='연회비 구성'
          items={form.annualFee}
          addText='+ 항목 추가'
          labelPlaceholder='구분 (예: 국내전용)'
          valuePlaceholder='금액'
          valueType='number'
          onAdd={() => addRow('annualFee')}
          onChangeLabel={(i, v) => updateRow('annualFee', i, 'label', v)}
          onChangeValue={(i, v) => updateRow('annualFee', i, 'value', v)}
          onRemove={(i) => removeRow('annualFee', i)}
          minRows={1}
        />

        <KeyValueList
          title='주요 사용 조건'
          items={form.condition}
          addText='+ 항목 추가'
          labelPlaceholder='조건 (예: 할인 한도)'
          valuePlaceholder='값 (예: 10000)'
          valueType='text'
          onAdd={() => addRow('condition')}
          onChangeLabel={(i, v) => updateRow('condition', i, 'label', v)}
          onChangeValue={(i, v) => updateRow('condition', i, 'value', v)}
          onRemove={(i) => removeRow('condition', i)}
          minRows={1}
        />

        <KeyValueList
          title='상세 혜택 (검색용 키워드 포함)'
          items={form.benefits}
          addText='+ 항목 추가'
          labelPlaceholder='혜택명 (예: 스타벅스 무료)'
          valuePlaceholder='환산가치'
          valueType='number'
          onAdd={() => addRow('benefits')}
          onChangeLabel={(i, v) => updateRow('benefits', i, 'label', v)}
          onChangeValue={(i, v) => updateRow('benefits', i, 'value', v)}
          onRemove={(i) => removeRow('benefits', i)}
          minRows={1}
        />

        <div className='flex gap-3 pt-6'>
          <button
            onClick={onCancel}
            className='flex-1 rounded-xl border py-4 font-bold'
          >
            취소
          </button>

          <button
            onClick={() => {
              // 최소 검증만
              if (!brandCode) return;
              if (!form.label.trim()) return;

              onSave({
                ...form,
                label: form.label.trim(),
              });
            }}
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

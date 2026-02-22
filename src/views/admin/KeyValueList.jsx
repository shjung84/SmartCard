import React from 'react';
import { Trash2 } from 'lucide-react';

const KeyValueList = ({
  title,
  addText = '+ 항목 추가',
  items,
  labelPlaceholder,
  valuePlaceholder,
  valueType = 'text',
  onAdd,
  onChangeLabel,
  onChangeValue,
  onRemove, // optional
  minRows = 1,
}) => {
  return (
    <div className='space-y-3'>
      <div className='flex items-center justify-between'>
        <label className='text-[11px] font-bold text-slate-400 uppercase'>
          {title}
        </label>
        <button
          onClick={onAdd}
          className='text-[10px] font-black text-amber-600'
        >
          {addText}
        </button>
      </div>

      {items.map((item, i) => (
        <div key={item._id ?? i} className='flex gap-2'>
          <input
            type='text'
            placeholder={labelPlaceholder}
            value={item.label}
            onChange={(e) => onChangeLabel(i, e.target.value)}
            className='flex-1 rounded-lg border bg-slate-50 p-3 text-sm font-bold'
          />
          <input
            type={valueType}
            placeholder={valuePlaceholder}
            value={item.value}
            onChange={(e) => onChangeValue(i, e.target.value)}
            className='flex-1 rounded-lg border bg-slate-50 p-3 text-right text-sm font-bold'
          />

          {onRemove && (
            <button
              onClick={() => onRemove(i)}
              disabled={items.length <= minRows}
              className='p-2 text-slate-300 hover:text-red-500 disabled:cursor-not-allowed disabled:text-slate-200'
              title={items.length <= minRows ? '최소 1개는 필요해' : '삭제'}
            >
              <Trash2 size={16} />
            </button>
          )}
        </div>
      ))}
    </div>
  );
};

export default KeyValueList;

import React from 'react';
import { Input, Button, Space, Typography } from 'antd';
import { Plus, Trash2 } from 'lucide-react';

const { Text } = Typography;

const KeyValueList = ({
  title,
  items = [],
  addText = '+ 추가',
  labelPlaceholder = '항목',
  valuePlaceholder = '값',
  valueType = 'text',
  onAdd,
  onChangeLabel,
  onChangeValue,
  onRemove,
  minRows = 0,
}) => {
  return (
    <div style={{ marginBottom: '16px' }}>
      <div style={{ marginBottom: '8px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Text strong>{title}</Text>
        <Button 
          variant="dashed" 
          size="small" 
          icon={<Plus size={14} />} 
          onClick={onAdd}
        >
          {addText}
        </Button>
      </div>
      <Space orientation="vertical" size="small" style={{ display: 'flex', width: '100%' }}>
        {items.map((item, index) => (
          <div key={item._id || index} style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            <Input
              placeholder={labelPlaceholder}
              value={item.label}
              onChange={(e) => onChangeLabel(index, e.target.value)}
              style={{ flex: 1 }}
            />
            <Input
              type={valueType}
              placeholder={valuePlaceholder}
              value={item.value}
              onChange={(e) => onChangeValue(index, e.target.value)}
              style={{ flex: 1 }}
            />
            {items.length > minRows && (
              <Button
                color="danger"
                variant="text"
                icon={<Trash2 size={14} />}
                onClick={() => onRemove(index)}
              />
            )}
          </div>
        ))}
      </Space>
    </div>
  );
};

export default KeyValueList;

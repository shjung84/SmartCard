import React, { useMemo } from 'react';
import { useCardStore } from '@/hooks/useCardStore';
import { Trash2, Plus, Layers, ChevronDown } from 'lucide-react';
import { Collapse, List, Button, Badge, Typography, Space, Tooltip } from 'antd';

const { Text } = Typography;

const CategoryManager = ({ onAddCategory, onDeleteCategory }) => {
  const { categories, brands } = useCardStore().state;

  const categoriesLists = useMemo(() => {
    if (!categories?.length) return [];
    const counts = {};
    brands?.forEach((brand) => {
      brand.cards?.forEach((card) => {
        const catValue = typeof card.category === 'object' ? card.category?.value : card.category;
        if (catValue) counts[catValue] = (counts[catValue] || 0) + 1;
      });
    });
    return categories.map((cat) => ({
      ...cat,
      count: counts[cat.value] || 0,
    }));
  }, [categories, brands]);

  const header = (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
      <Space size='small'>
        <Layers size={16} color='#1890ff' />
        <Text strong>카테고리 관리</Text>
      </Space>
      <Button
        color='primary'
        variant='solid'
        size='small'
        icon={<Plus size={14} />}
        onClick={(e) => {
          e.stopPropagation();
          onAddCategory();
        }}
      />
    </div>
  );

  const items = [
    {
      key: '1',
      label: header,
      children: (
        <List
          size='small'
          dataSource={categoriesLists}
          renderItem={(cat) => (
            <List.Item
              actions={[
                <Tooltip title={cat.count > 0 ? '사용 중인 카테고리는 삭제할 수 없습니다' : '삭제'}>
                  <Button
                    color='danger'
                    variant='text'
                    icon={<Trash2 size={14} />}
                    disabled={cat.count > 0}
                    onClick={() => onDeleteCategory(cat.id)}
                  />
                </Tooltip>,
              ]}
            >
              <Space>
                <Text code style={{ fontSize: '10px' }}>
                  {cat.value}
                </Text>
                <Text strong style={{ fontSize: '13px' }}>
                  {cat.label}
                </Text>
                <Badge count={cat.count} overflowCount={999} color='#f0f0f0' style={{ color: '#999' }} />
              </Space>
            </List.Item>
          )}
        />
      ),
    },
  ];

  return (
    <Collapse
      expandIconPlacement='end'
      expandIcon={({ isActive }) => (
        <ChevronDown
          size={16}
          style={{
            color: '#bfbfbf',
            transform: isActive ? 'rotate(180deg)' : 'rotate(0)',
            transition: 'transform 0.2s',
          }}
        />
      )}
      ghost
      items={items}
      style={{ background: '#fff', border: '1px solid #f0f0f0', borderRadius: '8px' }}
    />
  );
};

export default CategoryManager;

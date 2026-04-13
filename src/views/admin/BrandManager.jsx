import React, { useMemo } from 'react';
import { Plus, Trash2, Edit3, CreditCard, Building2, ChevronDown } from 'lucide-react';
import { Collapse, List, Button, Typography, Space, Tooltip, Modal, Badge, Tag } from 'antd';
import { useCardStore } from '@/hooks/useCardStore';

const { Text } = Typography;

const BrandManager = ({ onAddBrand, onAddCard, onEditCard }) => {
  const { state, actions } = useCardStore();
  const { brands = [] } = state;

  const sortedBrands = useMemo(() => [...brands].sort((a, b) => (a.no ?? Infinity) - (b.no ?? Infinity)), [brands]);

  const handleDeleteBrand = (id, label) => {
    Modal.confirm({
      title: '브랜드 삭제',
      content: `${label} 카드사를 삭제하시겠습니까?`,
      okText: '삭제',
      okType: 'danger',
      cancelText: '취소',
      onOk() {
        actions.deleteBrand(id);
      },
    });
  };

  const handleDeleteCard = (brandCode, cardId, cardLabel) => {
    Modal.confirm({
      title: '카드 삭제',
      content: `${cardLabel} 카드를 삭제하시겠습니까?`,
      okText: '삭제',
      okType: 'danger',
      cancelText: '취소',
      onOk() {
        actions.deleteCard({ brandCode, cardId });
      },
    });
  };

  const header = (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
      <Space size='small'>
        <Building2 size={16} color='#faad14' />
        <Text strong>카드사 및 카드 관리</Text>
      </Space>
      <Button
        color='warning'
        variant='solid'
        size='small'
        style={{ backgroundColor: '#faad14', borderColor: '#faad14' }}
        icon={<Plus size={14} />}
        onClick={(e) => {
          e.stopPropagation();
          onAddBrand();
        }}
      />
    </div>
  );

  const items = [
    {
      key: '1',
      label: header,
      children: (
        <Collapse
          ghost
          expandIconPosition='start'
          items={sortedBrands.map((brand) => ({
            key: brand.id,
            label: (
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  width: '100%',
                }}
              >
                <Space>
                  <Building2 size={18} color='#bfbfbf' />
                  <Tag color='blue'>{brand.code}</Tag>
                  <Text strong>{brand.label}</Text>
                  <Badge
                    count={brand.cards?.length}
                    color='#faad14'
                    style={{ fontSize: '10px' }}
                  />
                </Space>
                <Space
                  onClick={(e) => e.stopPropagation()}
                  style={{ marginRight: '12px' }}
                >
                  <Tooltip title='카드 추가'>
                    <Button
                      variant='text'
                      size='small'
                      icon={<Plus size={16} />}
                      onClick={() => onAddCard(brand.code)}
                      style={{ color: '#52c41a' }}
                    />
                  </Tooltip>
                  <Tooltip
                    title={
                      brand.cards?.length > 0
                        ? '카드가 있는 브랜드는 삭제할 수 없습니다'
                        : '삭제'
                    }
                  >
                    <Button
                      color='danger'
                      variant='text'
                      size='small'
                      icon={<Trash2 size={16} />}
                      disabled={brand.cards?.length > 0}
                      onClick={() => handleDeleteBrand(brand.id, brand.label)}
                    />
                  </Tooltip>
                </Space>
              </div>
            ),
            children: (
              <List
                size='small'
                dataSource={brand.cards || []}
                renderItem={(card) => (
                  <List.Item
                    style={{ padding: '8px 24px' }}
                    actions={[
                      <Button
                        variant='text'
                        size='small'
                        icon={<Edit3 size={14} />}
                        onClick={() => onEditCard(brand.code, card)}
                        style={{ color: '#1890ff' }}
                      />,
                      <Button
                        color='danger'
                        variant='text'
                        size='small'
                        icon={<Trash2 size={14} />}
                        onClick={() =>
                          handleDeleteCard(brand.code, card.id, card.label)
                        }
                      />,
                    ]}
                  >
                    <Space>
                      <CreditCard size={12} color='#bfbfbf' />
                      <Text
                        style={{ fontSize: '12px' }}
                        editable={{
                          onChange: (value) => {
                            actions.addOrUpdateCard({
                              brandCode: brand.code,
                              cardData: { ...card, label: value },
                            });
                          },
                        }}
                      >
                        {card.label}
                      </Text>
                    </Space>
                  </List.Item>
                )}
              />
            ),
          }))}
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
      defaultActiveKey={['1']}
      ghost
      items={items}
      style={{ background: '#fff', border: '1px solid #f0f0f0', borderRadius: '8px' }}
    />
  );
};

export default BrandManager;

import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Settings, ArrowLeft } from 'lucide-react';
import { Button, Modal, Typography, Space } from 'antd';
import { useCardStore } from '@/hooks/useCardStore';

import CategoryManager from './CategoryManager';
import BrandManager from './BrandManager';
import BrandForm from './BrandForm';
import CategoryForm from './CategoryForm';
import '@/styles/common.scss';

const { Title } = Typography;

const AdminView = () => {
  const navigate = useNavigate();
  const { state, actions } = useCardStore();
  const { brands = [] } = state;

  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [isBrandModalOpen, setIsBrandModalOpen] = useState(false);

  // 초기 데이터 로딩
  useEffect(() => {
    if (brands.length === 0) actions.fetchData();
  }, [brands.length, actions]);

  return (
    <div style={{ padding: '20px' }}>
      <div className='flex items-center justify-between' style={{ marginBottom: '16px' }}>
        <Title level={4} className='flex items-center' style={{ margin: 0, gap: '8px' }}>
          <Settings size={20} /> 관리자 페이지
        </Title>
        <Button variant='outlined' icon={<ArrowLeft size={14} />} onClick={() => navigate('/')}>
          돌아가기
        </Button>
      </div>

      <Space orientation='vertical' size='large' className='flex w-full'>
        <CategoryManager
          onAddCategory={() => setIsCategoryModalOpen(true)}
          onDeleteCategory={(id) => actions.deleteCategory(id)}
        />

        <BrandManager
          onAddBrand={() => setIsBrandModalOpen(true)}
          onAddCard={(brandCode) => {
            navigate(`/Admin/Card/Add/${brandCode}`);
          }}
          onEditCard={(brandCode, card) => {
            navigate(`/Admin/Card/Edit/${brandCode}/${card.id}`);
          }}
        />
      </Space>

      <Modal
        title='카테고리 추가'
        open={isCategoryModalOpen}
        onCancel={() => setIsCategoryModalOpen(false)}
        footer={null}
        destroyOnHidden
      >
        <CategoryForm
          onCancel={() => setIsCategoryModalOpen(false)}
          onSave={(category) => {
            actions.addCategory(category);
            setIsCategoryModalOpen(false);
          }}
        />
      </Modal>

      <Modal
        title='브랜드 추가'
        open={isBrandModalOpen}
        onCancel={() => setIsBrandModalOpen(false)}
        footer={null}
        destroyOnHidden
      >
        <BrandForm
          onCancel={() => setIsBrandModalOpen(false)}
          onSave={(brand) => {
            actions.addBrand(brand);
            setIsBrandModalOpen(false);
          }}
        />
      </Modal>
    </div>
  );
};

export default AdminView;

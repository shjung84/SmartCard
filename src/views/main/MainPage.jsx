import React, { useState, useMemo } from 'react';
import { useSelector } from 'react-redux';
import { useOutletContext } from 'react-router-dom';
import { Row, Col } from 'antd';
import UserView from '@/views/Users/UserView';
import BenefitView from '@/views/Benefits/BenefitView';
import { selectBrands } from '@/store/slices/brand';
import { selectSelectedUserCardIds } from '@/store/slices/card';

const MainPage = () => {
  const { setIsBenefitModalOpen } = useOutletContext();
  const [searchKeyword, setSearchKeyword] = useState('');

  const brands = useSelector(selectBrands);
  const selectedUserCardIds = useSelector(selectSelectedUserCardIds);

  const myCards = useMemo(() => {
    if (!brands.length || !selectedUserCardIds.length) return [];
    const allCards = brands.flatMap((b) =>
      b.cards.map((c) => ({ ...c, brandLabel: b.label })),
    );
    return allCards.filter((c) => selectedUserCardIds.includes(c.id));
  }, [brands, selectedUserCardIds]);

  const filteredBenefits = useMemo(() => {
    if (!searchKeyword.trim() || !myCards.length) return [];
    const lowerCaseKeyword = searchKeyword.toLowerCase();

    return myCards.flatMap((card) =>
      (card.benefits || [])
        .filter((benefit) =>
          benefit.label.toLowerCase().includes(lowerCaseKeyword),
        )
        .map((benefit) => ({
          ...benefit,
          cardLabel: card.label,
          brandLabel: card.brandLabel,
        })),
    );
  }, [searchKeyword, myCards]);

  return (
    <main style={{ padding: '16px' }}>
      <Row gutter={[24, 24]}>
        <Col xs={24} lg={12}>
          <UserView setIsBenefitModalOpen={setIsBenefitModalOpen} />
        </Col>
        <Col xs={24} lg={12}>
          <BenefitView
            searchKeyword={searchKeyword}
            setSearchKeyword={setSearchKeyword}
            filteredBenefits={filteredBenefits}
          />
        </Col>
      </Row>
    </main>
  );
};

export default MainPage;

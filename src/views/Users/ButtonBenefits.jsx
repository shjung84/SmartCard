import React from 'react';
import { Button } from 'antd';
import { Search, ChevronRight } from 'lucide-react';

const ButtonBenefits = ({ currentCard, onClick }) => {
  return (
    <Button block icon={<Search size={16} />} onClick={onClick} disabled={!currentCard} className='btn-benefits'>
      <span className='button-benefits__text'>혜택 선택하기 (실적 조건 확인)</span>
      <ChevronRight size={16} className='button-benefits__icon' />
    </Button>
  );
};

export default ButtonBenefits;

import React, { useMemo, useState } from 'react';
import { formatCurrency, parseCurrency } from '@/utils/function';
import { useCardStore } from '@/hooks/useCardStore';
import '@/styles/common.scss';
import './UserViewStyle.scss';

import { Calculator, AlertCircle, Crown, Tag, Heart, CheckCircle2, Info } from 'lucide-react';
import { Card, Select, Input, Row, Col, Typography, Space, Statistic, Alert, Divider, Tag as AntTag } from 'antd';
import BenefitModal from '@/components/popups/BenefitModal';
import ButtonBenefits from './ButtonBenefits.jsx';

const { Title, Text } = Typography;

const UserView = () => {
  const [isBenefitModalOpen, setIsBenefitModalOpen] = useState(false);

  const { state, actions } = useCardStore();
  const {
    brands,
    selectedBrandCode,
    selectedCardId,
    selectedAnnualFee,
    monthlyUsage,
    mileageBaseUsage,
    mileageSpecialUsage,
    selectedBenefitMap,
    currentCards,
    currentCard,
    pickingResult,
  } = state;

  const sortedBrands = useMemo(() => [...brands].sort((a, b) => a.no - b.no), [brands]);

  const handleBenefitToggle = (index) => {
    const currentStatus = !!selectedBenefitMap[index];
    actions.updateBenefits({ idx: index, value: !currentStatus });
  };

  const benefits = currentCard?.benefits || [];
  const usageAmount = parseCurrency(monthlyUsage);
  const minUsage = currentCard?.minUsage || 0;
  const minUsageSpecial = currentCard?.minUsageSpecial || 0;
  const isPerformanceMet = usageAmount >= minUsage;
  const isSpecialPerformanceMet = usageAmount >= minUsageSpecial;

  const cardStats = (
    <Row gutter={[8, 8]} className='card-stats'>
      <Col span={12}>
        <div className='card-stats-item'>
          <Text type='secondary' className='sub-title'>
            기본 실적
          </Text>
          <Text className='sub-text'>
            {currentCard ? `${(currentCard.minUsage / 10000).toLocaleString()} 만원` : '-'}
          </Text>
        </div>
      </Col>
      <Col span={12}>
        <div className='card-stats-item special'>
          <Text type='secondary' className='sub-title'>
            특별 실적
          </Text>
          <Text className='sub-text'>
            {currentCard ? `${(currentCard.minUsageSpecial / 10000).toLocaleString()} 만원` : '-'}
          </Text>
        </div>
      </Col>
    </Row>
  );

  return (
    <div className='main-container'>
      <Space orientation='vertical' size='middle' className='flex-full'>
        {/* 상단 헤더 섹션 */}
        <Card variant='borderless' className='title-box' styles={{ body: { padding: '24px' } }}>
          <Space orientation='vertical' size='0' style={{ display: 'flex' }}>
            <Space size='small'>
              <Heart size={14} color='#fff' fill='#fff' />
              <Text
                style={{
                  color: 'rgba(255,255,255,0.8)',
                  fontSize: '10px',
                  fontWeight: 'bold',
                  letterSpacing: '1px',
                }}
              >
                SMART ANALYSIS
              </Text>
            </Space>
            <Title level={3} style={{ color: '#fff', margin: 0, fontWeight: 900 }}>
              내 카드의 효율 분석
            </Title>
          </Space>
          <div className='bg-calculator'>
            <Calculator size={80} />
          </div>
        </Card>

        {/* 카드 정보 섹션 */}
        <Card
          size='small'
          className='card'
          title={
            <Space>
              <Tag size={16} color='#1890ff' />
              <Text>카드 정보</Text>
            </Space>
          }
        >
          <Row gutter={[12, 12]}>
            <Col xs={12} sm={12}>
              <Text type='secondary' className='sub-title'>
                카드사
              </Text>
              <Select
                placeholder='카드사 선택'
                value={selectedBrandCode || undefined}
                onChange={(value) => actions.updateSelectedBrandCode(value)}
                options={sortedBrands.map((b) => ({
                  label: b.label,
                  value: b.code,
                }))}
              />
            </Col>
            <Col xs={12} sm={12}>
              <Text type='secondary' className='sub-title'>
                카드명
              </Text>
              <Select
                style={{ width: '100%' }}
                placeholder='카드 선택'
                value={selectedCardId || undefined}
                onChange={(value) => actions.updateSelectedCardId(value)}
                disabled={!selectedBrandCode}
                options={currentCards.map((c) => ({
                  label: c.label,
                  value: c.id,
                }))}
              />
            </Col>
            <Col span={24}>
              <Text type='secondary' className='sub-title'>
                카드타입 (연회비)
              </Text>
              <Select
                style={{ width: '100%' }}
                placeholder='연회비 선택'
                value={selectedAnnualFee || undefined}
                onChange={(value) => actions.updateSelectedAnnualFee(Number(value))}
                disabled={!currentCard}
                options={currentCard?.annualFee.map((fee) => ({
                  label: `${fee.label} (${Number(fee.value).toLocaleString()}원)`,
                  value: fee.value,
                }))}
              />
            </Col>
          </Row>
          {cardStats}
        </Card>

        {/* 소비 및 혜택 현황 */}
        <Card
          size='small'
          className='card'
          title={
            <Space>
              <Calculator size={16} color='#faad14' />
              <Text>월 소비 및 혜택 현황</Text>
            </Space>
          }
        >
          <Space orientation='vertical' size='middle' style={{ display: 'flex', width: '100%' }}>
            <div>
              <Text type='secondary' className='sub-title'>
                월 평균 사용 금액
              </Text>
              <Input
                placeholder='0'
                suffix='원'
                value={monthlyUsage}
                onChange={(e) => actions.updateMonthlyUsage(formatCurrency(e.target.value))}
                style={{ fontWeight: 'bold', fontSize: '14px' }}
              />
            </div>

            {!currentCard ? (
              <Alert title='카드를 먼저 선택해 주세요.' type='info' showIcon icon={<Info size={16} />} />
            ) : !monthlyUsage ? (
              <Alert title='사용 금액을 입력해 주세요.' type='warning' showIcon icon={<AlertCircle size={16} />} />
            ) : isPerformanceMet ? (
              <Alert
                title='축하합니다! 모든 혜택을 받을 수 있습니다.'
                type='success'
                showIcon
                icon={<CheckCircle2 size={16} />}
              />
            ) : (
              <Alert
                title={`실적 미달로 인해 일부 혜택이 제외됩니다. (${(minUsage - usageAmount).toLocaleString()}원 부족)`}
                type='error'
                showIcon
                icon={<AlertCircle size={16} />}
              />
            )}

            {String(currentCard?.category?.value) === '003' && (
              <div
                style={{
                  background: '#f5f5f5',
                  padding: '12px',
                  borderRadius: '8px',
                }}
              >
                <Row gutter={8}>
                  <Col span={12}>
                    <Text type='secondary' className='sub-title'>
                      기본적립 대상
                    </Text>
                    <Input
                      suffix='원'
                      value={mileageBaseUsage}
                      onChange={(e) => actions.updateMileageBaseUsage(formatCurrency(e.target.value))}
                      style={{ fontWeight: 'bold' }}
                    />
                  </Col>
                  <Col span={12}>
                    <Text type='secondary' className='sub-title'>
                      특별적립 대상
                    </Text>
                    <Input
                      suffix='원'
                      value={mileageSpecialUsage}
                      onChange={(e) => actions.updateMileageSpecialUsage(formatCurrency(e.target.value))}
                      style={{ fontWeight: 'bold' }}
                    />
                  </Col>
                </Row>
              </div>
            )}

            <div
              style={{
                background: '#001529',
                padding: '16px',
                borderRadius: '8px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <Space orientation='vertical' size='0' style={{ display: 'flex' }}>
                <Text
                  style={{
                    color: 'rgba(255,255,255,0.65)',
                    fontSize: '12px',
                    fontWeight: 'bold',
                  }}
                >
                  예상 혜택 가치
                </Text>
                <Text style={{ color: 'rgba(255,255,255,0.45)', fontSize: '11px' }}>실적 조건 반영됨</Text>
              </Space>
              <Statistic
                value={pickingResult.totalBenefits}
                suffix='원'
                styles={{ content: { color: '#1890ff', fontWeight: 900 } }}
              />
            </div>
            <ButtonBenefits currentCard={currentCard} onClick={() => setIsBenefitModalOpen(true)} />
          </Space>
        </Card>

        {/* 결과 리포트 */}
        <Card
          variant='borderless'
          style={{
            background: '#001529',
            borderRadius: '12px',
            textAlign: 'center',
            opacity: !currentCard || !monthlyUsage ? 0.4 : 1,
            transition: 'opacity 0.3s',
          }}
          styles={{ body: { padding: '24px' } }}
        >
          <Text
            style={{
              color: '#faad14',
              fontSize: '10px',
              fontWeight: 900,
              letterSpacing: '2px',
              display: 'block',
              marginBottom: '12px',
            }}
          >
            REAL-TIME PICKING RATE
          </Text>
          <Statistic
            value={pickingResult.rate || '0.00'}
            suffix='%'
            styles={{
              content: {
                color: '#fff',
                fontSize: '48px',
                fontWeight: 900,
                letterSpacing: '-2px',
              },
            }}
          />
          <AntTag
            icon={<Crown size={12} style={{ marginRight: '4px', verticalAlign: 'middle' }} />}
            color='rgba(255,255,255,0.15)'
            style={{
              marginTop: '16px',
              padding: '4px 12px',
              borderRadius: '20px',
              color: '#fff',
              border: '1px solid rgba(255,255,255,0.1)',
            }}
          >
            <Text style={{ color: '#fff', fontSize: '11px', fontWeight: 'bold' }}>
              {!currentCard || !monthlyUsage
                ? '분석 대기 중...'
                : pickingResult.rate >= 3.5
                  ? '우수한 피킹률입니다!'
                  : pickingResult.rate >= 2
                    ? '평범한 수준의 혜택입니다.'
                    : '카드 교체를 추천합니다.'}
            </Text>
          </AntTag>
          <Divider
            style={{
              borderColor: 'rgba(255,255,255,0.06)',
              margin: '24px 0 16px',
            }}
          />
          <Row>
            <Col span={12} style={{ textAlign: 'left' }}>
              <Text
                style={{
                  color: 'rgba(255,255,255,0.45)',
                  fontSize: '9px',
                  fontWeight: 'bold',
                  display: 'block',
                }}
              >
                최적 사용 금액
              </Text>
              <Text style={{ color: '#fff', fontSize: '14px', fontWeight: 'bold' }}>
                {pickingResult.optimalUsage?.toLocaleString() || '0'}원
              </Text>
            </Col>
            <Col span={12} style={{ textAlign: 'right' }}>
              <Text
                style={{
                  color: 'rgba(255,255,255,0.45)',
                  fontSize: '9px',
                  fontWeight: 'bold',
                  display: 'block',
                }}
              >
                연간 예상 절감
              </Text>
              <Text
                style={{
                  color: '#1890ff',
                  fontSize: '14px',
                  fontWeight: 'bold',
                }}
              >
                {(pickingResult.totalBenefits * 12).toLocaleString() || '0'}원
              </Text>
            </Col>
          </Row>
        </Card>

        <BenefitModal
          isOpen={isBenefitModalOpen}
          onClose={() => setIsBenefitModalOpen(false)}
          benefits={benefits}
          selectedBenefits={selectedBenefitMap}
          onToggle={handleBenefitToggle}
          onApply={() => setIsBenefitModalOpen(false)}
          isPerformanceMet={isPerformanceMet}
          isSpecialPerformanceMet={isSpecialPerformanceMet}
        />
      </Space>
    </div>
  );
};

export default UserView;

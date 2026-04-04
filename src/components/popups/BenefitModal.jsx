import React, { useMemo } from 'react';
import { Sparkles, CheckCircle2, AlertCircle } from 'lucide-react';
import {
  Modal,
  Switch,
  List,
  Typography,
  Space,
  Alert,
  Button,
  Badge,
  Empty,
} from 'antd';
import { formatBenefitLimit, calculateMonthlyBenefit } from '@/utils/function';

const { Title, Text } = Typography;

const BenefitModal = ({
  isOpen,
  onClose,
  benefits,
  selectedBenefits,
  onToggle,
  onApply,
  isPerformanceMet,
  isSpecialPerformanceMet,
}) => {
  // 실제 적용되는 합계 계산
  const actualTotal = useMemo(() => {
    return benefits.reduce((acc, benefit, index) => {
      if (selectedBenefits[index]) {
        const met = benefit.requirePerformance
          ? isSpecialPerformanceMet
          : isPerformanceMet;
        if (met) {
          return acc + calculateMonthlyBenefit(benefit);
        }
      }
      return acc;
    }, 0);
  }, [benefits, selectedBenefits, isPerformanceMet, isSpecialPerformanceMet]);

  // 혜택 그룹화
  const groupedBenefits = useMemo(() => {
    const base = [];
    const perf = [];

    benefits.forEach((b, idx) => {
      const item = { ...b, originalIdx: idx };
      if (b.requirePerformance) perf.push(item);
      else base.push(item);
    });

    return { base, perf };
  }, [benefits]);

  const renderBenefitItem = (item) => {
    const isSelected = !!selectedBenefits[item.originalIdx];
    const currentMet = item.requirePerformance
      ? isSpecialPerformanceMet
      : isPerformanceMet;
    const isPerformanceMissing = !currentMet;
    const limitText = formatBenefitLimit(item);

    return (
      <List.Item
        style={{
          background: isSelected ? '#fff' : '#f9f9f9',
          padding: '12px 16px',
          marginBottom: '8px',
          borderRadius: '8px',
          border: isSelected ? '1px solid #ffccc7' : '1px solid #f0f0f0',
          transition: 'all 0.3s',
        }}
        actions={[
          <Switch
            size='small'
            checked={isSelected}
            onChange={() => onToggle(item.originalIdx)}
          />,
        ]}
      >
        <List.Item.Meta
          title={
            <Space size='small'>
              <Text
                strong
                style={{
                  fontSize: '13px',
                  color: isSelected ? '#262626' : '#8c8c8c',
                }}
              >
                {item.label}
              </Text>
              {item.requirePerformance && (
                <Badge
                  count='특별조건'
                  style={{
                    backgroundColor: isSpecialPerformanceMet
                      ? '#52c41a'
                      : '#faad14',
                    fontSize: '9px',
                    height: '16px',
                    lineHeight: '16px',
                  }}
                />
              )}
            </Space>
          }
          description={
            <Space orientation='vertical' size='0' style={{ display: 'flex' }}>
              <Text type='secondary' style={{ fontSize: '11px' }}>
                {limitText ? `${limitText} / ` : ''}
                {`${parseInt(item.value).toLocaleString()}원`}
              </Text>
              {isSelected && isPerformanceMissing && (
                <Text
                  color='danger'
                  style={{ fontSize: '10px', fontWeight: 'bold' }}
                >
                  (실적미달로 혜택 제외됨)
                </Text>
              )}
            </Space>
          }
        />
      </List.Item>
    );
  };

  return (
    <Modal
      title={
        <Space>
          <Sparkles size={18} color='#1890ff' />
          <Text strong>나의 예상 혜택 구성</Text>
        </Space>
      }
      open={isOpen}
      onCancel={onClose}
      footer={[
        <div key='footer' style={{ padding: '12px 0' }}>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '16px',
            }}
          >
            <div style={{ textAlign: 'left' }}>
              <Text
                type='secondary'
                style={{ fontSize: '11px', display: 'block' }}
              >
                실제 적용 예상 혜택
              </Text>
              <Text type='secondary' style={{ fontSize: '9px' }}>
                실적 조건 반영됨
              </Text>
            </div>
            <Title level={4} style={{ margin: 0, fontWeight: 900 }}>
              {Math.round(actualTotal).toLocaleString()}원
            </Title>
          </div>
          <Button
            color='primary'
            variant='solid'
            block
            size='large'
            onClick={() => onApply(Math.round(actualTotal))}
            style={{ fontWeight: 'bold', height: '48px', borderRadius: '8px' }}
          >
            이 구성으로 분석하기
          </Button>
        </div>,
      ]}
      width={400}
      styles={{
        body: { padding: '16px 24px', maxHeight: '60vh', overflowY: 'auto' },
      }}
      centered
    >
      <Space
        orientation='vertical'
        size='large'
        style={{ width: '100%', display: 'flex' }}
      >
        {groupedBenefits.base.length > 0 && (
          <div>
            <Space style={{ marginBottom: '12px' }}>
              <CheckCircle2 size={14} color='#52c41a' />
              <Text
                type='secondary'
                style={{
                  fontSize: '10px',
                  fontWeight: 900,
                  letterSpacing: '1px',
                }}
              >
                기본 혜택 (실적 무관)
              </Text>
            </Space>
            <List
              dataSource={groupedBenefits.base}
              renderItem={renderBenefitItem}
              split={false}
            />
          </div>
        )}

        {groupedBenefits.perf.length > 0 && (
          <div>
            <Space style={{ marginBottom: '12px' }}>
              <AlertCircle size={14} color='#faad14' />
              <Text
                type='secondary'
                style={{
                  fontSize: '10px',
                  fontWeight: 900,
                  letterSpacing: '1px',
                }}
              >
                특별 혜택 (실적 필요)
              </Text>
            </Space>
            {!isSpecialPerformanceMet && (
              <Alert
                title='현재 특별 실적 미달입니다. 아래 혜택을 선택해도 실제 계산에서는 제외됩니다.'
                type='warning'
                showIcon
                style={{ marginBottom: '12px', fontSize: '11px' }}
              />
            )}
            <List
              dataSource={groupedBenefits.perf}
              renderItem={renderBenefitItem}
              split={false}
            />
          </div>
        )}

        {benefits.length === 0 && (
          <Empty description='등록된 혜택이 없습니다.' />
        )}
      </Space>
    </Modal>
  );
};

export default BenefitModal;

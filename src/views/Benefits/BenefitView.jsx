import React, { useState, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { toggleUserCardSelection, selectSelectedUserCardIds } from '@/store/slices/card';
import { selectBrands } from '@/store/slices/brand';
import { MapPin, Trash2, Search, CreditCard, Navigation, Plus, Heart, Calculator } from 'lucide-react';
import {
  Card,
  Select,
  Button,
  Input,
  List,
  Typography,
  Space,
  Empty,
  Badge,
  Divider,
  Tag as AntTag,
  message,
} from 'antd';

const { Title, Text } = Typography;

const BenefitView = () => {
  const dispatch = useDispatch();
  const brands = useSelector(selectBrands);
  const selectedUserCardIds = useSelector(selectSelectedUserCardIds);

  const [searchKeyword, setSearchKeyword] = useState('');
  const [addBrandCode, setAddBrandCode] = useState('');
  const [addCardId, setAddCardId] = useState('');

  // 위치 관련 상태
  const [isLocating, setIsLocating] = useState(false);
  const [locationName, setLocationName] = useState('');

  // 선택된 카드사에 해당하는 카드 목록
  const cardsForSelectedBrand = useMemo(() => {
    if (!addBrandCode) return [];
    const brand = brands.find((b) => b.code === addBrandCode);
    return brand ? brand.cards : [];
  }, [addBrandCode, brands]);

  // 내가 가진 카드 객체 목록
  const myCards = useMemo(() => {
    if (!brands.length || !selectedUserCardIds.length) return [];
    const allCards = brands.flatMap((b) => b.cards.map((c) => ({ ...c, brandLabel: b.label })));
    return allCards.filter((c) => selectedUserCardIds.some((id) => String(id) === String(c.id)));
  }, [brands, selectedUserCardIds]);

  // 검색 키워드에 따른 혜택 필터링
  const filteredBenefits = useMemo(() => {
    const keyword = searchKeyword.trim().toLowerCase();
    if (!keyword || !myCards.length) return [];

    return myCards.flatMap((card) =>
      (card.benefits || [])
        .filter((benefits) => benefits.label.toLowerCase().includes(keyword))
        .map((benefits) => ({
          ...benefits,
          cardLabel: card.label,
          brandLabel: card.brandLabel,
        })),
    );
  }, [searchKeyword, myCards]);

  // 카드 추가 핸들러
  const handleAddCard = () => {
    if (!addCardId) return;
    const targetCardId = String(addCardId);
    const isAlreadyAdded = selectedUserCardIds.some((id) => String(id) === targetCardId);

    if (!isAlreadyAdded) {
      dispatch(toggleUserCardSelection(targetCardId));
      setAddBrandCode('');
      setAddCardId('');
      message.success('카드가 등록되었습니다.');
    } else {
      message.warning('이미 등록된 카드입니다.');
    }
  };

  // 현재 위치 가져오기 핸들러
  const handleGetCurrentLocation = () => {
    if (!navigator.geolocation) {
      message.error('이 브라우저에서는 위치 정보를 지원하지 않습니다.');
      return;
    }

    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      () => {
        setTimeout(() => {
          const detectedPlace = '스타벅스';
          setLocationName(detectedPlace);
          setSearchKeyword(detectedPlace);
          setIsLocating(false);
          message.info(`${detectedPlace} 주변 혜택을 검색합니다.`);
        }, 800);
      },
      () => {
        message.error('위치 정보를 가져오는데 실패했습니다.');
        setIsLocating(false);
      },
    );
  };

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
        <Card
          size='small'
          title={
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                width: '100%',
                padding: '4px 0',
              }}
            >
              <Space>
                <MapPin size={18} color='#1890ff' />
                <Text strong style={{ letterSpacing: '1px' }}>
                  혜택 검색
                </Text>
              </Space>
              <Button
                color='primary'
                variant='outlined'
                size='small'
                icon={<Navigation size={12} style={{ marginRight: '4px' }} />}
                loading={isLocating}
                onClick={handleGetCurrentLocation}
                style={{ fontSize: '11px', fontWeight: 'bold' }}
              >
                {isLocating ? '위치 파악 중' : '현재 위치 기준'}
              </Button>
            </div>
          }
          style={{ borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}
        >
          <Space orientation='vertical' size='large' style={{ width: '100%', display: 'flex' }}>
            {/* 내 카드 등록 영역 */}
            <div style={{ background: '#f9f9f9', padding: '16px', borderRadius: '8px' }}>
              <Text
                type='secondary'
                style={{
                  fontSize: '10px',
                  fontWeight: 900,
                  letterSpacing: '1px',
                  display: 'block',
                  marginBottom: '12px',
                }}
              >
                내 카드 등록
              </Text>
              <Space.Compact style={{ width: '100%', marginBottom: '16px' }}>
                <Select
                  style={{ width: '40%' }}
                  placeholder='카드사'
                  value={addBrandCode || undefined}
                  onChange={(val) => {
                    setAddBrandCode(val);
                    setAddCardId('');
                  }}
                  options={brands.map((b) => ({ label: b.label, value: b.code }))}
                />
                <Select
                  style={{ width: '50%' }}
                  placeholder='카드'
                  value={addCardId || undefined}
                  onChange={(val) => setAddCardId(val)}
                  disabled={!addBrandCode}
                  options={cardsForSelectedBrand.map((c) => ({ label: c.label, value: c.id }))}
                />
                <Button
                  color='primary'
                  variant='solid'
                  icon={<Plus size={16} />}
                  disabled={!addCardId}
                  onClick={handleAddCard}
                />
              </Space.Compact>

              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <Text type='secondary' style={{ fontSize: '10px', fontWeight: 900 }}>
                  보유 카드 목록
                </Text>
                <Badge count={myCards.length} color='#1890ff' size='small' />
              </div>

              <List
                size='small'
                dataSource={myCards}
                locale={{
                  emptyText: (
                    <Text type='secondary' style={{ fontSize: '11px' }}>
                      등록된 카드가 없습니다.
                    </Text>
                  ),
                }}
                renderItem={(card) => (
                  <List.Item
                    style={{
                      background: '#fff',
                      marginBottom: '8px',
                      borderRadius: '6px',
                      border: '1px solid #f0f0f0',
                    }}
                    actions={[
                      <Button
                        color='danger'
                        variant='text'
                        size='small'
                        icon={<Trash2 size={14} />}
                        onClick={() => dispatch(toggleUserCardSelection(card.id))}
                      />,
                    ]}
                  >
                    <List.Item.Meta
                      avatar={<CreditCard size={18} color='#bfbfbf' style={{ marginTop: '4px' }} />}
                      title={<Text style={{ fontSize: '12px', fontWeight: 'bold' }}>{card.label}</Text>}
                      description={
                        <Text type='secondary' style={{ fontSize: '10px' }}>
                          {card.brandLabel}
                        </Text>
                      }
                    />
                  </List.Item>
                )}
              />
            </div>

            <Divider style={{ margin: '0' }} />

            {/* 혜택 검색 영역 */}
            <div>
              <Text
                type='secondary'
                style={{
                  fontSize: '10px',
                  fontWeight: 900,
                  letterSpacing: '1px',
                  display: 'block',
                  marginBottom: '12px',
                }}
              >
                주변 혜택 검색
              </Text>
              <Input
                size='large'
                placeholder='장소(마트, 공항)나 혜택을 입력하세요'
                prefix={<Search size={18} color='#bfbfbf' />}
                suffix={
                  locationName && (
                    <AntTag color='green' icon={<Navigation size={10} style={{ marginRight: '4px' }} />}>
                      현위치
                    </AntTag>
                  )
                }
                value={searchKeyword}
                onChange={(e) => {
                  setSearchKeyword(e.target.value);
                  if (locationName && e.target.value !== locationName) setLocationName('');
                }}
                style={{ borderRadius: '8px' }}
              />

              <div style={{ marginTop: '20px' }}>
                {filteredBenefits.length > 0 ? (
                  <List
                    dataSource={filteredBenefits}
                    renderItem={(b, idx) => (
                      <Card
                        key={idx}
                        size='small'
                        style={{ marginBottom: '12px', borderLeft: '4px solid #faad14', borderRadius: '4px' }}
                        styles={{ body: { padding: '12px' } }}
                      >
                        <Space size='small' style={{ marginBottom: '4px' }}>
                          <Text type='secondary' style={{ fontSize: '10px', fontWeight: 'bold' }}>
                            {b.brandLabel}
                          </Text>
                          <Divider type='vertical' />
                          <Text type='secondary' style={{ fontSize: '10px', fontWeight: 'bold' }}>
                            {b.cardLabel}
                          </Text>
                        </Space>
                        <Title level={5} style={{ margin: '4px 0 8px', fontSize: '15px' }}>
                          {b.label}
                        </Title>
                        <AntTag color='orange' style={{ fontWeight: 'bold' }}>
                          예상 가치: {parseInt(b.value).toLocaleString()}원 상당
                        </AntTag>
                      </Card>
                    )}
                  />
                ) : searchKeyword ? (
                  <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description='검색 결과가 없습니다.' />
                ) : (
                  <div style={{ textAlign: 'center', padding: '40px 0', opacity: 0.4 }}>
                    <Search size={32} style={{ marginBottom: '12px' }} />
                    <Text type='secondary' style={{ display: 'block', fontSize: '12px' }}>
                      보유 카드를 등록하고 혜택을 검색해 보세요.
                    </Text>
                  </div>
                )}
              </div>
            </div>
          </Space>
        </Card>
      </Space>
    </div>
  );
};

export default BenefitView;

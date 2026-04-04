import React, { useEffect, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useCardStore } from '@/hooks/useCardStore';
import { 
  Trash2, 
  ArrowLeft, 
  Save, 
  X, 
  CheckCircle2, 
  Plus,
  CreditCard,
  Settings,
  DollarSign
} from 'lucide-react';
import { 
  Form, 
  Input, 
  InputNumber, 
  Select, 
  Button, 
  Card, 
  Row, 
  Col, 
  Space, 
  Typography, 
  message 
} from 'antd';

const { Title, Text } = Typography;

const CardForm = () => {
  const { brandCode, cardId } = useParams();
  const navigate = useNavigate();
  const { state, actions } = useCardStore();
  const { brands = [], categories = [] } = state;
  const [form] = Form.useForm();

  const initialCard = useMemo(() => {
    if (!cardId || brands.length === 0) return null;
    const brand = brands.find((b) => b.code === brandCode);
    return brand?.cards?.find((c) => String(c.id) === String(cardId)) || null;
  }, [brandCode, cardId, brands]);

  useEffect(() => {
    if (brands.length === 0) actions.fetchData();
  }, [brands.length, actions]);

  useEffect(() => {
    if (initialCard) {
      const categoryValue = typeof initialCard.category === 'object' 
        ? initialCard.category.value 
        : initialCard.category;

      form.setFieldsValue({
        ...initialCard,
        category: categoryValue,
      });
    } else {
      form.resetFields();
    }
  }, [initialCard, form]);

  const onFinish = (values) => {
    if (!brandCode) {
      message.error('브랜드 코드가 없습니다.');
      return;
    }

    const selectedCategory = categories.find(c => c.value === values.category) || null;

    const cardData = {
      ...values,
      id: initialCard?.id || null,
      category: selectedCategory,
    };

    actions.addOrUpdateCard({
      brandCode,
      cardData,
    });
    message.success('카드 정보가 저장되었습니다.');
    navigate('/Admin');
  };

  const header = (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
      <Space size="middle">
        <Button 
          variant="text" 
          icon={<ArrowLeft size={20} />} 
          onClick={() => navigate('/Admin')} 
        />
        <Title level={3} style={{ margin: 0 }}>
          {initialCard ? '카드 정보 수정' : '새 카드 등록'}
        </Title>
      </Space>
      <Space>
        <Button variant="outlined" icon={<X size={16} />} onClick={() => navigate('/Admin')}>취소</Button>
        <Button 
          color="primary" 
          variant="solid" 
          icon={<Save size={16} />} 
          onClick={() => form.submit()}
        >
          저장하기
        </Button>
      </Space>
    </div>
  );

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '24px' }}>
      {header}

      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
        initialValues={{
          label: '',
          minUsage: 0,
          minUsageSpecial: 0,
          category: null,
          condition: [{ label: '', value: '' }],
          annualFee: [{ label: '', value: 0 }],
          benefits: [{ label: '', value: 0, limitDay: 0, limitMonth: 0, limitYear: 0, requirePerformance: false }],
        }}
      >
        <Card size="small" title={<Space><CreditCard size={18} /> 기본 정보</Space>} style={{ marginBottom: '24px' }}>
          <Row gutter={16}>
            <Col xs={24} sm={12}>
              <Form.Item label="카드 이름" name="label" rules={[{ required: true, message: '카드 이름을 입력하세요' }]}>
                <Input placeholder="카드 명칭" />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12}>
              <Form.Item label="카드 종류" name="category" rules={[{ required: true, message: '종류를 선택하세요' }]}>
                <Select 
                  placeholder="선택" 
                  options={categories.map(cat => ({ label: cat.label, value: cat.value }))}
                />
              </Form.Item>
            </Col>
            <Col xs={12} sm={12}>
              <Form.Item label="기본 혜택 실적 (원)" name="minUsage">
                <InputNumber style={{ width: '100%' }} formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')} parser={value => value.replace(/\$\s?|(,*)/g, '')} />
              </Form.Item>
            </Col>
            <Col xs={12} sm={12}>
              <Form.Item label="특별 혜택 실적 (원)" name="minUsageSpecial">
                <InputNumber style={{ width: '100%' }} formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')} parser={value => value.replace(/\$\s?|(,*)/g, '')} />
              </Form.Item>
            </Col>
          </Row>
        </Card>

        <Card size="small" title={<Space><CheckCircle2 size={18} /> 혜택 관리</Space>} style={{ marginBottom: '24px' }}>
          <Form.List name="benefits">
            {(fields, { add, remove }) => (
              <Space orientation="vertical" size="middle" style={{ display: 'flex', width: '100%' }}>
                {fields.map(({ key, name, ...restField }) => (
                  <div key={key} style={{ padding: '16px', background: '#f9f9f9', borderRadius: '8px', border: '1px solid #f0f0f0' }}>
                    <Row gutter={12} align="middle">
                      <Col flex="auto">
                        <Row gutter={12}>
                          <Col span={12}>
                            <Form.Item {...restField} name={[name, 'label']} rules={[{ required: true, message: '혜택명' }]}>
                              <Input placeholder="혜택명 (예: 전 가맹점 할인)" size="small" />
                            </Form.Item>
                          </Col>
                          <Col span={6}>
                            <Form.Item {...restField} name={[name, 'value']} rules={[{ required: true, message: '가치' }]}>
                              <InputNumber placeholder="가치" style={{ width: '100%' }} size="small" />
                            </Form.Item>
                          </Col>
                          <Col span={6}>
                            <Form.Item {...restField} name={[name, 'requirePerformance']}>
                              <Select 
                                size="small"
                                options={[
                                  { label: '실적 무관', value: false },
                                  { label: '실적 필요', value: true }
                                ]}
                              />
                            </Form.Item>
                          </Col>
                        </Row>
                        <Row gutter={8} align="middle">
                          <Col><Text type="secondary" style={{ fontSize: '11px' }}>이용 한도:</Text></Col>
                          <Col span={4}>
                            <Form.Item {...restField} name={[name, 'limitDay']} label="일" style={{ marginBottom: 0 }}>
                              <InputNumber size="small" min={0} style={{ width: '100%' }} />
                            </Form.Item>
                          </Col>
                          <Col span={4}>
                            <Form.Item {...restField} name={[name, 'limitMonth']} label="월" style={{ marginBottom: 0 }}>
                              <InputNumber size="small" min={0} style={{ width: '100%' }} />
                            </Form.Item>
                          </Col>
                          <Col span={4}>
                            <Form.Item {...restField} name={[name, 'limitYear']} label="연" style={{ marginBottom: 0 }}>
                              <InputNumber size="small" min={0} style={{ width: '100%' }} />
                            </Form.Item>
                          </Col>
                        </Row>
                      </Col>
                      <Col>
                        <Button color="danger" variant="text" onClick={() => remove(name)} icon={<Trash2 size={16} />} />
                      </Col>
                    </Row>
                  </div>
                ))}
                <Button color="primary" variant="dashed" onClick={() => add({ label: '', value: 0, limitDay: 0, limitMonth: 0, limitYear: 0, requirePerformance: false })} block icon={<Plus size={14} />}>
                  혜택 추가
                </Button>
              </Space>
            )}
          </Form.List>
        </Card>

        <Row gutter={24}>
          <Col xs={24} md={12}>
            <Card size="small" title={<Space><DollarSign size={18} /> 연회비</Space>} style={{ height: '100%' }}>
              <Form.List name="annualFee">
                {(fields, { add, remove }) => (
                  <Space orientation="vertical" size="small" style={{ display: 'flex', width: '100%' }}>
                    {fields.map(({ key, name, ...restField }) => (
                      <Space key={key} style={{ display: 'flex' }} align="baseline">
                        <Form.Item {...restField} name={[name, 'label']} rules={[{ required: true, message: '구분' }]}>
                          <Input placeholder="국내전용" size="small" />
                        </Form.Item>
                        <Form.Item {...restField} name={[name, 'value']} rules={[{ required: true, message: '금액' }]}>
                          <InputNumber placeholder="10,000" size="small" style={{ width: '100%' }} />
                        </Form.Item>
                        <Trash2 size={14} style={{ cursor: 'pointer', color: '#ff4d4f' }} onClick={() => remove(name)} />
                      </Space>
                    ))}
                    <Button variant="dashed" onClick={() => add()} block icon={<Plus size={14} />} size="small">추가</Button>
                  </Space>
                )}
              </Form.List>
            </Card>
          </Col>
          <Col xs={24} md={12}>
            <Card size="small" title={<Space><Settings size={18} /> 주요 조건</Space>} style={{ height: '100%' }}>
              <Form.List name="condition">
                {(fields, { add, remove }) => (
                  <Space orientation="vertical" size="small" style={{ display: 'flex', width: '100%' }}>
                    {fields.map(({ key, name, ...restField }) => (
                      <Space key={key} style={{ display: 'flex' }} align="baseline">
                        <Form.Item {...restField} name={[name, 'label']} rules={[{ required: true, message: '조건' }]}>
                          <Input placeholder="전월실적" size="small" />
                        </Form.Item>
                        <Form.Item {...restField} name={[name, 'value']} rules={[{ required: true, message: '내용' }]}>
                          <Input placeholder="30만원 이상" size="small" />
                        </Form.Item>
                        <Trash2 size={14} style={{ cursor: 'pointer', color: '#ff4d4f' }} onClick={() => remove(name)} />
                      </Space>
                    ))}
                    <Button variant="dashed" onClick={() => add()} block icon={<Plus size={14} />} size="small">추가</Button>
                  </Space>
                )}
              </Form.List>
            </Card>
          </Col>
        </Row>
      </Form>
    </div>
  );
};

export default CardForm;

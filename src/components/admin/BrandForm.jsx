import React from 'react';
import { Form, Input, Button, Space } from 'antd';

const BrandForm = ({ onCancel, onSave }) => {
  const [form] = Form.useForm();

  const onFinish = (values) => {
    onSave(values);
  };

  return (
    <div style={{ padding: '8px' }}>
      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
        initialValues={{ label: '', code: '' }}
      >
        <Form.Item
          label="카드사명"
          name="label"
          rules={[{ required: true, message: '카드사명을 입력해주세요 (예: 현대카드)' }]}
        >
          <Input placeholder="예: 현대카드" />
        </Form.Item>

        <Form.Item
          label="기관 코드"
          name="code"
          rules={[{ required: true, message: '기관 코드를 입력해주세요 (예: 0301)' }]}
        >
          <Input placeholder="예: 0301" />
        </Form.Item>

        <Form.Item style={{ marginBottom: 0, marginTop: '24px' }}>
          <Space style={{ width: '100%', justifyContent: 'flex-end' }}>
            <Button variant="outlined" onClick={onCancel}>취소</Button>
            <Button color="primary" variant="solid" htmlType="submit">
              저장하기
            </Button>
          </Space>
        </Form.Item>
      </Form>
    </div>
  );
};

export default BrandForm;

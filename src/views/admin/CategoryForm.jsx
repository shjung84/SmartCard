import React from 'react';
import { Form, Input, Button, Space } from 'antd';

const CategoryForm = ({ onSave, onCancel }) => {
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
        initialValues={{ label: '', value: '' }}
      >
        <Form.Item
          label="카테고리 ID"
          name="value"
          rules={[{ required: true, message: '카테고리 ID를 입력해주세요 (예: mileage)' }]}
        >
          <Input placeholder="영문 (예: mileage)" />
        </Form.Item>

        <Form.Item
          label="카테고리명"
          name="label"
          rules={[{ required: true, message: '카테고리명을 입력해주세요 (예: 마일리지)' }]}
        >
          <Input placeholder="한글 (예: 마일리지)" />
        </Form.Item>

        <Form.Item style={{ marginBottom: 0, marginTop: '24px' }}>
          <Space style={{ width: '100%', justifyContent: 'flex-end' }}>
            <Button variant="outlined" onClick={onCancel}>취소</Button>
            <Button color="primary" variant="solid" htmlType="submit">
              등록하기
            </Button>
          </Space>
        </Form.Item>
      </Form>
    </div>
  );
};

export default CategoryForm;

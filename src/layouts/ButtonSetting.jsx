import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from 'antd';
import { Settings } from 'lucide-react';

const ButtonSetting = ({ className = '' }) => {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const isAdminPath = pathname.startsWith('/Admin');

  return (
    <Button
      color={isAdminPath ? 'primary' : undefined}
      variant={isAdminPath ? 'solid' : 'text'}
      shape='circle'
      size='large'
      icon={<Settings size={22} color={isAdminPath ? '#fff' : '#8c8c8c'} />}
      onClick={() => navigate('/Admin')}
      className={`flex items-center justify-center ${className}`.trim()}
    />
  );
};

export default ButtonSetting;

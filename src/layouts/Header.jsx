import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles } from 'lucide-react';
import { Layout, Typography, Avatar } from 'antd';
import ButtonSetting from '@/atom/ButtonSetting';
import '@/styles/common.scss';

const { Header: AntHeader } = Layout;
const { Title, Text } = Typography;

const Header = () => {
  const navigate = useNavigate();

  return (
    <AntHeader className='header-container'>
      <div className='header-content'>
        <div className='header-logo-group' onClick={() => navigate('/')}>
          <Avatar
            shape='square'
            size={40}
            icon={<Sparkles size={20} fill='currentColor' />}
            className='header-logo-avatar'
          />
          <div className='header-title-container'>
            <Title level={4} className='header-title'>
              SmartCard
            </Title>
            <Text className='header-subtitle'>AI ASSISTANT</Text>
          </div>
        </div>

        <ButtonSetting />
      </div>
    </AntHeader>
  );
};

export default Header;

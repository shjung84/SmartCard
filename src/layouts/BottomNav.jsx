import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Calculator, MapPin, UserCircle2 } from 'lucide-react';
import { Layout, Typography } from 'antd';
import { motion } from 'framer-motion';
import '@/styles/common.scss';

const { Footer } = Layout;
const { Text } = Typography;

const BottomNav = () => {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const getActiveIndex = () => {
    if (pathname === '/') return 0;
    if (pathname === '/benefits') return 1;
    if (pathname.startsWith('/admin')) return -1;
    return 2;
  };

  const activeIndex = getActiveIndex();

  const renderIndicator = (index) => {
    if (activeIndex !== index) return null;
    return (
      <motion.div
        layoutId='active-indicator'
        className='bottom-nav-indicator'
        transition={{ type: 'spring', stiffness: 380, damping: 30 }}
      />
    );
  };

  const NavItem = ({ index, icon: Icon, label, path, disabled }) => {
    const isActive = activeIndex === index;
    const isClickable = !disabled && path;

    return (
      <div
        className={`bottom-nav-item ${isActive ? 'active' : ''} ${disabled ? 'disabled' : ''}`}
        onClick={() => isClickable && navigate(path)}
      >
        {renderIndicator(index)}
        <Icon size={20} />
        <Text className='bottom-nav-text'>{label}</Text>
      </div>
    );
  };

  return (
    <Footer className='bottom-nav-container'>
      <NavItem index={0} icon={Calculator} label='분석' path='/' />
      <NavItem index={1} icon={MapPin} label='혜택' path='/benefits' />
      <NavItem index={2} icon={UserCircle2} label='사용자' disabled />
    </Footer>
  );
};

export default BottomNav;

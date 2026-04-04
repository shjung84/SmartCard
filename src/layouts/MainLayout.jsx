import React, { useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchData } from '@/store/thunks';
import Header from '@/layouts/Header';
import BottomNav from '@/layouts/BottomNav';
import { selectIsLoading, selectError } from '@/store/slices/ui';
import { Layout, Spin, Result, ConfigProvider, App } from 'antd';
import '@/styles/common.scss';

const { Content } = Layout;

const MainLayout = () => {
  const dispatch = useDispatch();
  const isLoading = useSelector(selectIsLoading);
  const error = useSelector(selectError);

  useEffect(() => {
    dispatch(fetchData());
  }, [dispatch]);

  if (isLoading) {
    return (
      <div className='flex items-center justify-center h-screen' style={{ background: '#001529' }}>
        <Spin size='large' title='데이터를 불러오는 중...' />
      </div>
    );
  }

  if (error) {
    return (
      <div className='flex items-center justify-center h-screen'>
        <Result status='error' title='오류가 발생했습니다' subTitle={error} />
      </div>
    );
  }

  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: '#1890ff',
          borderRadius: 8,
        },
      }}
    >
      <App>
        <Layout style={{ minHeight: '100vh', background: '#f0f2f5' }}>
          <Header />
          <Content style={{ padding: '0', maxWidth: '1200px', margin: '0 auto', width: '100%', paddingBottom: '80px' }}>
            <Outlet />
          </Content>
          <BottomNav />
        </Layout>
      </App>
    </ConfigProvider>
  );
};

export default MainLayout;

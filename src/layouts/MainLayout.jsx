import React, { useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchData } from '@/store/thunks';
import Header from '@/layouts/Header';
import BottomNav from '@/layouts/BottomNav';
import { selectIsLoading, selectError } from '@/store/slices/ui';

const MainLayout = () => {
  const dispatch = useDispatch();
  const isLoading = useSelector(selectIsLoading);
  const error = useSelector(selectError);

  useEffect(() => {
    dispatch(fetchData());
  }, [dispatch]);

  if (isLoading) {
    return (
      <div className='flex h-screen items-center justify-center bg-slate-900 text-white'>
        <p className='animate-pulse text-lg font-bold'>
          데이터를 불러오는 중...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className='flex h-screen items-center justify-center bg-red-900 p-4 text-center text-white'>
        <div>
          <p className='text-lg font-bold'>오류가 발생했습니다.</p>
          <p className='mt-2 text-sm'>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className='flex min-h-screen flex-col bg-slate-100'>
      <Header />
      <main className='mx-auto w-full max-w-xl flex-grow p-2 pb-22'>
        <Outlet />
      </main>
      <BottomNav />
    </div>
  );
};

export default MainLayout;

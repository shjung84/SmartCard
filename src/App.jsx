import React, { useEffect, useState } from 'react';
import { Outlet } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchData } from '@/store/thunks';
import { selectIsLoading, selectError } from '@/store/slices/ui';

const App = () => {
  const dispatch = useDispatch();
  const isLoading = useSelector(selectIsLoading);
  const error = useSelector(selectError);
  const [isBenefitModalOpen, setIsBenefitModalOpen] = useState(false);

  useEffect(() => {
    dispatch(fetchData());
  }, [dispatch]);

  if (isLoading) {
    return (
      <div className='flex h-screen items-center justify-center'>
        Loading...
      </div>
    );
  }

  if (error) {
    return (
      <div className='flex h-screen items-center justify-center'>
        Error: {error}
      </div>
    );
  }

  return (
    <div className='mx-auto max-w-7xl p-4 sm:p-6 lg:p-8'>
      <Outlet context={{ isBenefitModalOpen, setIsBenefitModalOpen }} />
    </div>
  );
};

export default App;

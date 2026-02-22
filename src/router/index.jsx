import { createBrowserRouter } from 'react-router-dom';
import MainLayout from '@/layouts/MainLayout';
import UserView from '@/views/UserView';
import BenefitView from '@/views/BenefitView';
import AdminView from '@/views/AdminView';

const router = createBrowserRouter([
  {
    path: '/',
    element: <MainLayout />, // 모든 페이지에 Header와 BottomNav를 제공
    children: [
      {
        index: true, // 기본 경로 ('/')는 UserView를 렌더링
        element: <UserView />,
      },
      {
        path: 'Benefits', // '/benefits' 경로는 BenefitView를 렌더링
        element: <BenefitView />,
      },
      {
        path: 'Admin', // '/admin' 경로는 AdminView를 렌더링
        element: <AdminView />,
      },
    ],
  },
]);

export default router;

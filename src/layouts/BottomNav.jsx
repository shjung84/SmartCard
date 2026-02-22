import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Calculator, MapPin, CreditCard } from 'lucide-react';

const BottomNav = () => {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-slate-900 border-t border-slate-800 px-6 py-4 flex justify-around items-center z-40 max-w-xl mx-auto rounded-t-xl shadow-[0_-10px_30px_rgba(0,0,0,0.3)]">
      <button
        onClick={() => navigate('/')}
        className={`flex flex-col items-center gap-1.5 transition-all ${
          pathname === '/'
            ? 'text-amber-400 font-bold scale-110'
            : 'text-slate-500'
        }`}
      >
        <Calculator size={22} />
        <span className="text-[11px] font-bold">피킹률 분석</span>
      </button>
      <button
        onClick={() => navigate('/Benefits')}
        className={`flex flex-col items-center gap-1.5 transition-all ${
          pathname === '/Benefits'
            ? 'text-amber-400 font-bold scale-110'
            : 'text-slate-500'
        }`}
      >
        <MapPin size={22} />
        <span className="text-[11px] font-bold">장소별 혜택</span>
      </button>
      <button
        onClick={() => navigate('/Admin')}
        className={`flex flex-col items-center gap-1.5 transition-all ${
          pathname === '/Admin'
            ? 'text-amber-400 font-bold scale-110'
            : 'text-slate-500'
        }`}
      >
        <CreditCard size={22} />
        <span className="text-[11px] font-bold">카드 관리</span>
      </button>
    </nav>
  );
};

export default BottomNav;

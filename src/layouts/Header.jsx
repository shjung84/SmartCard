import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Settings, TrendingUp } from 'lucide-react';

const Header = () => {
  const navigate = useNavigate();
  return (
    <header className="bg-slate-900 border-b border-slate-800 sticky top-0 z-40 px-4 py-5 shadow-lg text-white">
      <div className="max-w-xl mx-auto flex justify-between items-center">
        <div className="flex items-center gap-2">
          <TrendingUp size={24} className="text-amber-400" />
          <h1 className="text-xl font-black tracking-tighter">
            스마트 카드 계산기
          </h1>
        </div>
        <button
          onClick={() => navigate('/admin')}
          className="p-2 text-slate-400 hover:text-amber-400 transition-colors"
        >
          <Settings size={22} />
        </button>
      </div>
    </header>
  );
};

export default Header;

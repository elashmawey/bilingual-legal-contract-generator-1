import React from 'react';
import type { UserAccount } from '../types';

interface HeaderProps {
  currentTab: 'create' | 'archive';
  onNavigateTab: (tab: 'create' | 'archive') => void;
  savedContractsCount: number;
  user: UserAccount;
  onOpenPricing: () => void;
  onOpenBranding: () => void;
  onOpenDisclaimer: () => void;
}

const Header: React.FC<HeaderProps> = ({
  currentTab,
  onNavigateTab,
  savedContractsCount,
  user,
  onOpenPricing,
  onOpenBranding,
  onOpenDisclaimer,
}) => {
  return (
    <>
      {/* Promotional & Commercial Announcement Top Bar */}
      <div className="bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 text-slate-950 px-4 py-1.5 text-[11px] font-black flex items-center justify-center gap-2 print:hidden shadow-xs">
        <i className="fas fa-fire text-rose-700 animate-pulse"></i>
        <span>عرض الإطلاق التجاري: وفّر 50% على جميع باقات العقود بكود: <span className="bg-slate-950 text-white px-2 py-0.5 rounded font-mono tracking-wider">EGYPT2026</span></span>
        <button
          onClick={onOpenPricing}
          className="mr-2 underline hover:text-blue-900 transition-colors cursor-pointer"
        >
          شحن الرصيد والترقية الآن &larr;
        </button>
      </div>

      <header className="bg-white/95 backdrop-blur-md border-b border-slate-200/90 sticky top-0 z-40 print:hidden transition-all shadow-2xs">
        <div className="container mx-auto px-4 py-3 md:px-8 flex flex-col md:flex-row justify-between items-center gap-3">
          {/* Brand Logo & Slogan */}
          <div className="flex items-center justify-between w-full md:w-auto">
            <div
              onClick={() => onNavigateTab('create')}
              className="flex items-center gap-3 cursor-pointer group"
            >
              <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-blue-700 via-indigo-900 to-slate-900 text-white flex items-center justify-center text-xl shadow-md group-hover:scale-105 transition-transform">
                <i className="fas fa-scale-balanced"></i>
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-lg md:text-xl font-black text-slate-900 tracking-tight">عدالة كونتراكت</h1>
                  <span className="text-[10px] bg-amber-400 text-slate-950 font-black px-1.5 py-0.5 rounded uppercase">
                    PRO EGYPT
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 font-semibold" style={{ direction: 'ltr' }}>
                  Bilingual Legal Contract & Verification System
                </p>
              </div>
            </div>

            {/* Mobile Quick Action */}
            <div className="flex items-center gap-2 md:hidden">
              <button
                onClick={onOpenPricing}
                className="text-xs bg-amber-100 text-amber-900 font-bold px-2 py-1 rounded-lg border border-amber-300"
              >
                {user.creditsRemaining} عقد متاح
              </button>
            </div>
          </div>

          {/* Central Navigation Tabs */}
          <nav className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs font-bold">
            <button
              onClick={() => onNavigateTab('create')}
              className={`px-3.5 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
                currentTab === 'create'
                  ? 'bg-white text-blue-700 shadow-xs font-black'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <i className="fas fa-feather-pointed"></i>
              <span>صياغة عقد جديد</span>
            </button>

            <button
              onClick={() => onNavigateTab('archive')}
              className={`px-3.5 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
                currentTab === 'archive'
                  ? 'bg-white text-blue-700 shadow-xs font-black'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <i className="fas fa-box-archive"></i>
              <span>أرشيف عقودي</span>
              {savedContractsCount > 0 && (
                <span className="bg-blue-600 text-white text-[10px] px-1.5 py-0.2 rounded-full font-mono">
                  {savedContractsCount}
                </span>
              )}
            </button>
          </nav>

          {/* User Account, Branding & Pricing Controls */}
          <div className="flex items-center gap-2">
            {/* Law Firm Branding Trigger */}
            <button
              onClick={onOpenBranding}
              className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-all border border-slate-200 flex items-center gap-1.5"
              title="تخصيص هوية وشعار مكتب المحاماة"
            >
              <i className="fas fa-stamp text-amber-600"></i>
              <span className="hidden sm:inline">هوية المكتب</span>
            </button>

            {/* Pricing & Credits Trigger */}
            <button
              onClick={onOpenPricing}
              className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 hover:from-amber-600 hover:to-amber-500 text-slate-950 text-xs font-black transition-all shadow-md flex items-center gap-1.5 transform active:scale-95 cursor-pointer ring-2 ring-amber-400/40"
              title="ترقية الباقة وشحن رصيد العقود"
            >
              <i className="fas fa-crown text-slate-950"></i>
              <span>{user.tier === 'pro' ? 'باقة المحامين PRO' : 'شحن الباقة'}</span>
              <span className="bg-slate-950/20 px-1.5 py-0.5 rounded text-[10px] font-mono font-black">
                {user.creditsRemaining} عقد
              </span>
            </button>

            {/* Terms Trigger */}
            <button
              onClick={onOpenDisclaimer}
              className="w-8 h-8 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center text-xs"
              title="شروط الاستخدام والمسؤولية"
            >
              <i className="fas fa-circle-info"></i>
            </button>
          </div>
        </div>
      </header>
    </>
  );
};

export default Header;

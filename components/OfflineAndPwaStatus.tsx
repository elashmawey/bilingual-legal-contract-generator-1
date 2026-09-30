import React, { useState, useEffect } from 'react';

export const OfflineAndPwaStatus: React.FC = () => {
  const [isOnline, setIsOnline] = useState<boolean>(typeof navigator !== 'undefined' ? navigator.onLine : true);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showInstallPrompt, setShowInstallPrompt] = useState<boolean>(false);
  const [isIos, setIsIos] = useState<boolean>(false);
  const [showIosGuide, setShowIosGuide] = useState<boolean>(false);
  const [isInstalled, setIsInstalled] = useState<boolean>(false);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Detect if already installed as standalone PWA
    if (window.matchMedia('(display-mode: standalone)').matches || (window.navigator as any).standalone) {
      setIsInstalled(true);
    }

    // Capture PWA install prompt (Android, Chrome, Edge)
    const handleBeforeInstall = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowInstallPrompt(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstall);

    // Detect iOS
    const userAgent = window.navigator.userAgent.toLowerCase();
    const isIosDevice = /iphone|ipad|ipod/.test(userAgent);
    setIsIos(isIosDevice);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
    };
  }, []);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        setShowInstallPrompt(false);
        setDeferredPrompt(null);
      }
    } else if (isIos) {
      setShowIosGuide(true);
    }
  };

  return (
    <>
      {/* Offline Alert Banner */}
      {!isOnline && (
        <div className="bg-amber-600 text-white px-4 py-2.5 text-center text-sm font-semibold shadow-md flex items-center justify-center gap-2 animate-pulse sticky top-0 z-50">
          <i className="fas fa-wifi-slash text-base"></i>
          <span>
            أنت الآن في وضع عدم الاتصال (Offline) — مكتبة العقود الرسمية المعتمدة للشهر العقاري ونقابة المحامين تعمل بكامل بنودها دون إنترنت!
          </span>
        </div>
      )}

      {/* Floating PWA Install Button for Mobile & Desktop */}
      {!isInstalled && (showInstallPrompt || isIos) && (
        <div className="fixed bottom-4 left-4 z-40">
          <button
            onClick={handleInstallClick}
            className="flex items-center gap-2.5 bg-gradient-to-r from-blue-900 to-indigo-900 hover:from-blue-800 hover:to-indigo-800 text-amber-300 font-bold px-4 py-2.5 rounded-full shadow-2xl border border-amber-400/40 text-xs sm:text-sm transition-all transform hover:scale-105 active:scale-95"
            title="تحميل التطبيق على الهاتف والعمل بدون إنترنت"
          >
            <i className="fas fa-mobile-screen-button text-amber-400 text-base"></i>
            <span>تثبيت التطبيق على الهاتف (Offline)</span>
          </button>
        </div>
      )}

      {/* iOS Installation Guide Modal */}
      {showIosGuide && (
        <div className="fixed inset-0 z-50 bg-black/75 flex items-center justify-center p-4 backdrop-blur-xs">
          <div className="bg-white rounded-3xl p-6 max-w-sm w-full text-slate-800 text-center shadow-2xl border border-slate-200">
            <div className="w-16 h-16 rounded-2xl bg-blue-900 text-amber-300 flex items-center justify-center mx-auto mb-4 text-2xl shadow-lg">
              <i className="fas fa-arrow-up-from-bracket"></i>
            </div>
            <h3 className="text-lg font-bold mb-2">تثبيت التطبيق على iPhone / iPad</h3>
            <p className="text-sm text-slate-600 mb-4 leading-relaxed">
              لتثبيت المنظومة القانونية والعمل بدون إنترنت:
              <br />
              1. اضغط على أيقونة <strong>المشاركة (Share)</strong> بالأسفل في متصفح Safari.
              <br />
              2. مرر للأسفل واختر <strong>"إضافة إلى الشاشة الرئيسية" (Add to Home Screen)</strong>.
            </p>
            <button
              onClick={() => setShowIosGuide(false)}
              className="w-full py-2.5 bg-blue-900 text-white font-bold rounded-xl hover:bg-blue-800 transition-colors"
            >
              حسناً، فهمت
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default OfflineAndPwaStatus;

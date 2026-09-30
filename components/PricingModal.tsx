import React, { useState, useEffect, useRef } from 'react';
import type { SubscriptionTier } from '../types';
import { activateOwnerMode } from '../services/storageService';

interface PricingModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentTier: SubscriptionTier;
  creditsRemaining: number;
  onSubscribe: (tier: SubscriptionTier, addedCredits: number) => void;
}

const TESTIMONIALS = [
  {
    quote: 'المنظومة وفرت على مكتبي أكثر من 30 ساعة أسبوعياً. الصياغة العربية متطابقة مع قضاء محكمة النقض ونصوص القانون المدني، والترجمة الإنجليزية دقيقة جداً.',
    name: 'المستشار/ طارق الشناوي',
    title: 'محامٍ بالنقض ومحكم دولي — القاهرة',
  },
  {
    quote: 'تصدير ملفات Word بالإطار الرسمي والترويسة أضفى احترافية عالية أمام كبار العملاء والشركات الأجنبية. استثمار يستحق كل جنيه.',
    name: 'أ/ نورهان الألفي',
    title: 'شريك رئيسي بمكتب الألفي للاستشارات القانونية — الإسكندرية',
  },
  {
    quote: 'نستخدم المنصة لتوليد عقود الشراكة والتوظيف والتراخيص البرمجية في شركتنا، سرعة الإنجاز ودقة البنود تغنينا عن الانتظار لأيام.',
    name: 'المهندس/ وليد عبد الحميد',
    title: 'رئيس تنفيذي بشركة تكنولوجيا مالية — الجيزة',
  },
];

declare global {
  interface Window {
    paypal?: any;
  }
}

const PricingModal: React.FC<PricingModalProps> = ({
  isOpen,
  onClose,
  currentTier,
  creditsRemaining,
  onSubscribe,
}) => {
  const [currency, setCurrency] = useState<'EGP' | 'USD'>('USD');
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('annual');
  const [selectedPlan, setSelectedPlan] = useState<SubscriptionTier | 'pay_as_you_go'>('pro');
  const [paymentMethod, setPaymentMethod] = useState<'paypal' | 'instapay' | 'wallet' | 'card'>('paypal');
  const [promoCode, setPromoCode] = useState('');
  const [discountPercent, setDiscountPercent] = useState<number>(0);
  const [promoMessage, setPromoMessage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [paymentError, setPaymentError] = useState<string | null>(null);
  const [sdkFailed, setSdkFailed] = useState(false);
  const [paypalTransactionId, setPaypalTransactionId] = useState('');
  const [paypalManualSubmitted, setPaypalManualSubmitted] = useState(false);
  const [offlineTransferRef, setOfflineTransferRef] = useState('');
  const [offlineSent, setOfflineSent] = useState(false);

  const paypalContainerRef = useRef<HTMLDivElement>(null);
  const paypalClientId = (import.meta as any).env?.VITE_PAYPAL_CLIENT_ID || '';
  const paypalEmailOrMe = (import.meta as any).env?.VITE_PAYPAL_EMAIL || 'sameh.elashmawey94@gmail.com';

  // Calculate USD price for PayPal
  const getUsdAmount = (): number => {
    let amount = 10;
    if (selectedPlan === 'pay_as_you_go') {
      amount = 10;
    } else if (selectedPlan === 'starter') {
      amount = billingCycle === 'annual' ? 168 : 19;
    } else if (selectedPlan === 'pro') {
      amount = billingCycle === 'annual' ? 348 : 39;
    } else if (selectedPlan === 'enterprise') {
      amount = billingCycle === 'annual' ? 888 : 99;
    }

    if (discountPercent > 0) {
      amount = Math.max(1, amount * ((100 - discountPercent) / 100));
    }
    return Math.round(amount * 100) / 100;
  };

  // Prices calculation based on billing cycle
  const getPlanPrice = (plan: 'pay_as_you_go' | 'starter' | 'pro') => {
    if (currency === 'EGP') {
      if (plan === 'pay_as_you_go') return { price: 149, unit: 'للعقد' };
      if (plan === 'starter') {
        return billingCycle === 'annual'
          ? { price: 299, unit: 'شهرياً (فاتورة سنوية)', original: 399 }
          : { price: 399, unit: 'شهرياً' };
      }
      return billingCycle === 'annual'
        ? { price: 699, unit: 'شهرياً (فاتورة سنوية)', original: 899 }
        : { price: 899, unit: 'شهرياً' };
    } else {
      if (plan === 'pay_as_you_go') return { price: 10, unit: 'per contract' };
      if (plan === 'starter') {
        return billingCycle === 'annual'
          ? { price: 14, unit: '/mo (billed $168/yr)', original: 19 }
          : { price: 19, unit: '/month' };
      }
      return billingCycle === 'annual'
        ? { price: 29, unit: '/mo (billed $348/yr)', original: 39 }
        : { price: 39, unit: '/month' };
    }
  };

  // Load and render PayPal SDK buttons if valid Client ID exists, otherwise use direct fallback
  useEffect(() => {
    if (!isOpen || paymentMethod !== 'paypal') return;

    // If client ID is missing or empty, directly enable the fallback direct PayPal checkout
    if (!paypalClientId || paypalClientId === 'sb') {
      setSdkFailed(true);
      return;
    }

    let isMounted = true;
    const scriptId = 'paypal-sdk-script';

    const renderButtons = () => {
      if (!window.paypal || !paypalContainerRef.current) return;
      paypalContainerRef.current.innerHTML = '';

      try {
        window.paypal
          .Buttons({
            style: {
              layout: 'vertical',
              color: 'gold',
              shape: 'rect',
              label: 'paypal',
              height: 44,
            },
            createOrder: (_data: any, actions: any) => {
              const usdAmount = getUsdAmount();
              return actions.order.create({
                purchase_units: [
                  {
                    description: `Adala Legal Contracts - Plan: ${selectedPlan} (${billingCycle})`,
                    amount: {
                      currency_code: 'USD',
                      value: usdAmount.toFixed(2),
                    },
                  },
                ],
              });
            },
            onApprove: async (data: any) => {
              setIsProcessing(true);
              setPaymentError(null);

              try {
                // Call Vercel Serverless Function to capture and verify payment
                const response = await fetch('/api/paypal-capture', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({
                    orderID: data.orderID,
                    plan: selectedPlan,
                    billingCycle,
                  }),
                });

                const result = await response.json();

                if (!response.ok || !result.success) {
                  throw new Error(result.message || 'فشل التحقق من الدفع مع خوادم PayPal.');
                }

                setPaymentSuccess(true);
                const addedCredits = result.addedCredits || (selectedPlan === 'pay_as_you_go' ? 1 : 25);
                const tierToActivate = selectedPlan === 'pay_as_you_go' ? currentTier : selectedPlan;

                onSubscribe(tierToActivate as SubscriptionTier, addedCredits);

                setTimeout(() => {
                  setPaymentSuccess(false);
                  onClose();
                }, 2500);
              } catch (err: any) {
                console.error('[PayPal onApprove Error]:', err);
                setPaymentError(err.message || 'حدث خطأ أثناء معالجة الدفع عبر PayPal.');
              } finally {
                setIsProcessing(false);
              }
            },
            onError: (err: any) => {
              console.error('[PayPal SDK Error]:', err);
              setSdkFailed(true);
            },
          })
          .render(paypalContainerRef.current);
      } catch (e) {
        console.error('Failed to render PayPal Buttons:', e);
        setSdkFailed(true);
      }
    };

    if (!document.getElementById(scriptId)) {
      const script = document.createElement('script');
      script.id = scriptId;
      script.src = `https://www.paypal.com/sdk/js?client-id=${paypalClientId}&currency=USD`;
      script.async = true;
      script.onload = () => {
        if (isMounted) renderButtons();
      };
      script.onerror = () => {
        if (isMounted) {
          // Gracefully fallback to direct checkout without red error
          setSdkFailed(true);
        }
      };
      document.body.appendChild(script);
    } else {
      renderButtons();
    }

    return () => {
      isMounted = false;
    };
  }, [isOpen, paymentMethod, selectedPlan, billingCycle, discountPercent]);

  if (!isOpen) return null;

  // Master Promo Code & Owner/Open-Source Bypass
  const handleApplyPromo = () => {
    const code = promoCode.trim().toUpperCase();

    // Owner / Open-Source Master Bypass Codes
    if (
      code === 'ELASHMAWEY-ADMIN-2026' ||
      code === 'OPEN-SOURCE-DEV' ||
      code === 'ASHMAWEY-FREE' ||
      code === 'LAWYER-ADMIN'
    ) {
      const owner = activateOwnerMode();
      onSubscribe('enterprise', 99999);
      setDiscountPercent(100);
      setPromoMessage(`مرحباً بك يا سيادة المستشار ${owner.name}! تم تفعيل حساب المطور والمالك الرئيسي (النسخة المفتوحة المصدر) بصلاحيات Enterprise كاملة ورصيد 99,999 عقد مجاناً مدى الحياة! 👑`);
      setTimeout(() => {
        onClose();
      }, 2500);
      return;
    }

    if (code === 'EGYPT2026' || code === 'LAUNCH50') {
      setDiscountPercent(50);
      setPromoMessage('تم تفعيل كود الخصم الحصري 50%! 🎉');
    } else if (code === 'LAWYER20') {
      setDiscountPercent(20);
      setPromoMessage('تم تطبيق خصم 20% لأعضاء نقابة المحامين! ⚖️');
    } else {
      setPromoMessage('كود الخصم غير صحيح أو منتهي الصلاحية.');
    }
  };

  const handleManualPayPalSubmit = () => {
    if (!paypalTransactionId.trim()) {
      alert('يرجى إدخال معرّف المعاملة (Transaction ID) أو بريدك الإلكتروني في PayPal.');
      return;
    }
    setPaypalManualSubmitted(true);
  };

  const handleManualOfflineTransfer = () => {
    if (!offlineTransferRef.trim()) {
      alert('يرجى إدخال رقم العملية أو رقم هاتف التحويل للتأكيد.');
      return;
    }
    setOfflineSent(true);
  };

  const handleOwnerQuickLogin = () => {
    const owner = activateOwnerMode();
    onSubscribe('enterprise', 99999);
    setPaymentSuccess(true);
    setPromoMessage(`تم تفعيل النسخة المفتوحة المصدر لحساب المستشار ${owner.name} بنجاح! 👑`);
    setTimeout(() => {
      onClose();
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/80 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div className="relative w-full max-w-5xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden animate-fadeIn my-6">
        {/* Header */}
        <div className="bg-gradient-to-r from-slate-900 via-blue-950 to-indigo-950 text-white p-6 md:p-8 relative">
          <button
            onClick={onClose}
            className="absolute top-5 left-5 w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors"
          >
            <i className="fas fa-times"></i>
          </button>

          <div className="max-w-2xl">
            <span className="text-amber-400 font-bold text-xs uppercase tracking-widest bg-amber-400/10 px-3 py-1 rounded-full border border-amber-400/20">
              باقات الاشتراك والدفع الإلكتروني المعتمد
            </span>
            <h3 className="text-2xl md:text-3xl font-black mt-2">
              اختر باقتك القانونية واستمتع بصياغة فورية غير محدودة
            </h3>
            <p className="text-slate-300 text-xs md:text-sm mt-1 leading-relaxed">
              جميع الباقات تشمل التدقيق القضائي والشرعي الكامل، وتصدير ملفات Word بإطار رسمي مزدوج، والعمل في وضع عدم الاتصال (Offline).
            </p>
          </div>

          {/* Controls: Billing cycle & Currency */}
          <div className="mt-6 flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-white/10">
            {/* Billing Cycle Toggle */}
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-slate-300">دورة الفوترة:</span>
              <div className="inline-flex rounded-xl bg-white/10 p-1 border border-white/20 text-xs font-bold">
                <button
                  onClick={() => setBillingCycle('monthly')}
                  className={`px-3 py-1 rounded-lg transition-all ${
                    billingCycle === 'monthly' ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-300 hover:text-white'
                  }`}
                >
                  شهري
                </button>
                <button
                  onClick={() => setBillingCycle('annual')}
                  className={`px-3 py-1 rounded-lg transition-all flex items-center gap-1 ${
                    billingCycle === 'annual' ? 'bg-amber-400 text-slate-950 shadow-xs' : 'text-slate-300 hover:text-white'
                  }`}
                >
                  <span>سنوي</span>
                  <span className="text-[10px] bg-emerald-600 text-white px-1.5 py-0.2 rounded font-black">
                    وفّر 25% + شهرين مجاناً
                  </span>
                </button>
              </div>
            </div>

            {/* Currency Toggle & Current Balance */}
            <div className="flex items-center gap-3">
              <div className="inline-flex rounded-xl bg-white/10 p-1 border border-white/20 text-xs font-bold">
                <button
                  onClick={() => setCurrency('USD')}
                  className={`px-3 py-1 rounded-lg transition-all ${
                    currency === 'USD' ? 'bg-amber-400 text-slate-950' : 'text-slate-300 hover:text-white'
                  }`}
                >
                  USD ($ بايبال / بطاقات)
                </button>
                <button
                  onClick={() => setCurrency('EGP')}
                  className={`px-3 py-1 rounded-lg transition-all ${
                    currency === 'EGP' ? 'bg-amber-400 text-slate-950' : 'text-slate-300 hover:text-white'
                  }`}
                >
                  ج.م (فودافون كاش / إنستاباي)
                </button>
              </div>

              <span className="text-[11px] text-amber-300 bg-amber-400/10 border border-amber-400/30 px-3 py-1 rounded-lg font-bold">
                رصيدك الحالي: <strong>{creditsRemaining} عقد</strong>
              </span>
            </div>
          </div>
        </div>

        {/* Success Banner */}
        {paymentSuccess && (
          <div className="p-4 bg-emerald-600 text-white text-center font-bold text-sm flex items-center justify-center gap-2 animate-bounce">
            <i className="fas fa-check-circle text-lg"></i>
            <span>{promoMessage || 'تم تأكيد العملية وتفعيل الباقة المعتمدة بنجاح!'}</span>
          </div>
        )}

        {paymentError && (
          <div className="p-4 bg-rose-600 text-white text-center font-bold text-xs flex items-center justify-center gap-2">
            <i className="fas fa-triangle-exclamation text-lg"></i>
            <span>{paymentError}</span>
          </div>
        )}

        <div className="p-6 md:p-8 space-y-6">
          {/* Plans Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Plan 1: Pay As You Go */}
            {(() => {
              const p = getPlanPrice('pay_as_you_go');
              const isSelected = selectedPlan === 'pay_as_you_go';
              return (
                <div
                  onClick={() => setSelectedPlan('pay_as_you_go')}
                  className={`p-5 rounded-3xl border-2 transition-all cursor-pointer relative flex flex-col justify-between ${
                    isSelected
                      ? 'border-blue-600 bg-blue-50/50 shadow-md ring-2 ring-blue-500/20'
                      : 'border-slate-200 bg-white hover:border-slate-300'
                  }`}
                >
                  <div>
                    <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                      بالقطعة الفورية
                    </span>
                    <h4 className="text-base font-black text-slate-900 mt-2">عقد مفرد فوري</h4>
                    <p className="text-xs text-slate-500">للأفراد والحالات السريعة والمستعجلة</p>

                    <div className="my-4">
                      <span className="text-2xl font-black text-slate-900">
                        {p.price} {currency === 'EGP' ? 'ج.م' : '$'}
                      </span>
                      <span className="text-xs text-slate-500"> / {p.unit}</span>
                    </div>

                    <ul className="space-y-2 text-xs text-slate-700 mb-4">
                      <li className="flex items-center gap-1.5">
                        <i className="fas fa-check text-emerald-600"></i>
                        <span>عقد كامل ثنائي اللغة (14+ مادة مفصلة)</span>
                      </li>
                      <li className="flex items-center gap-1.5">
                        <i className="fas fa-check text-emerald-600"></i>
                        <span>تصدير Word بإطار رسمي و PDF</span>
                      </li>
                      <li className="flex items-center gap-1.5">
                        <i className="fas fa-check text-emerald-600"></i>
                        <span>تقرير التدقيق والمطابقة مع الشهر العقاري</span>
                      </li>
                    </ul>
                  </div>

                  <div className={`p-2 rounded-xl text-center text-xs font-black ${isSelected ? 'bg-blue-600 text-white shadow-xs' : 'bg-slate-100 text-slate-700'}`}>
                    {isSelected ? 'الباقة المحددة' : 'اختيار هذه الباقة'}
                  </div>
                </div>
              );
            })()}

            {/* Plan 2: Starter */}
            {(() => {
              const p = getPlanPrice('starter');
              const isSelected = selectedPlan === 'starter';
              return (
                <div
                  onClick={() => setSelectedPlan('starter')}
                  className={`p-5 rounded-3xl border-2 transition-all cursor-pointer relative flex flex-col justify-between ${
                    isSelected
                      ? 'border-blue-600 bg-blue-50/50 shadow-md ring-2 ring-blue-500/20'
                      : 'border-slate-200 bg-white hover:border-slate-300'
                  }`}
                >
                  <div>
                    <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded bg-blue-100 text-blue-800">
                      محامٍ مستقل
                    </span>
                    <h4 className="text-base font-black text-slate-900 mt-2">باقة المحامي الفردي</h4>
                    <p className="text-xs text-slate-500">للمحامين والمستشارين الممارسين</p>

                    <div className="my-4">
                      <span className="text-2xl font-black text-slate-900">
                        {p.price} {currency === 'EGP' ? 'ج.م' : '$'}
                      </span>
                      <span className="text-xs text-slate-500"> / {p.unit}</span>
                      {p.original && (
                        <span className="text-xs text-slate-400 line-through block mt-0.5">
                          بدلاً من {p.original} {currency === 'EGP' ? 'ج.م' : '$'}
                        </span>
                      )}
                    </div>

                    <ul className="space-y-2 text-xs text-slate-700 mb-4">
                      <li className="flex items-center gap-1.5 font-bold text-blue-900">
                        <i className="fas fa-certificate text-blue-600"></i>
                        <span>{billingCycle === 'annual' ? '60 عقداً سنوياً' : '5 عقود شهرياً'}</span>
                      </li>
                      <li className="flex items-center gap-1.5">
                        <i className="fas fa-check text-emerald-600"></i>
                        <span>تصدير Word بإطار رسمي وخاتم وبصمة</span>
                      </li>
                      <li className="flex items-center gap-1.5">
                        <i className="fas fa-check text-emerald-600"></i>
                        <span>دعم كامل لوضع عدم الاتصال (Offline)</span>
                      </li>
                      <li className="flex items-center gap-1.5">
                        <i className="fas fa-check text-emerald-600"></i>
                        <span>أرشيف عقود دائم غير محدود</span>
                      </li>
                    </ul>
                  </div>

                  <div className={`p-2 rounded-xl text-center text-xs font-black ${isSelected ? 'bg-blue-600 text-white shadow-xs' : 'bg-slate-100 text-slate-700'}`}>
                    {isSelected ? 'الباقة المحددة' : 'اختيار هذه الباقة'}
                  </div>
                </div>
              );
            })()}

            {/* Plan 3: Pro (Most Popular) */}
            {(() => {
              const p = getPlanPrice('pro');
              const isSelected = selectedPlan === 'pro';
              return (
                <div
                  onClick={() => setSelectedPlan('pro')}
                  className={`p-5 rounded-3xl border-2 transition-all cursor-pointer relative flex flex-col justify-between ${
                    isSelected
                      ? 'border-amber-500 bg-amber-50/40 shadow-lg ring-2 ring-amber-400/30'
                      : 'border-slate-200 bg-white hover:border-slate-300'
                  }`}
                >
                  <div className="absolute -top-3 left-6 bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-black text-[10px] px-3 py-0.5 rounded-full shadow-md uppercase tracking-wider">
                    الأكثر طلباً بين المكاتب ⭐
                  </div>

                  <div>
                    <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded bg-amber-100 text-amber-900">
                      مكاتب المحاماة والشركات
                    </span>
                    <h4 className="text-base font-black text-slate-900 mt-2">باقة مكاتب المحامين PRO</h4>
                    <p className="text-xs text-slate-500">للمكاتب الكبرى والشركات الاستثمارية</p>

                    <div className="my-4">
                      <span className="text-2xl font-black text-slate-900">
                        {p.price} {currency === 'EGP' ? 'ج.م' : '$'}
                      </span>
                      <span className="text-xs text-slate-500"> / {p.unit}</span>
                      {p.original && (
                        <span className="text-xs text-slate-400 line-through block mt-0.5">
                          بدلاً من {p.original} {currency === 'EGP' ? 'ج.م' : '$'}
                        </span>
                      )}
                    </div>

                    <ul className="space-y-2 text-xs text-slate-700 mb-4">
                      <li className="flex items-center gap-1.5 font-bold text-amber-900">
                        <i className="fas fa-crown text-amber-500"></i>
                        <span>{billingCycle === 'annual' ? '300 عقد سنوياً' : '25 عقداً شهرياً'}</span>
                      </li>
                      <li className="flex items-center gap-1.5 font-bold text-blue-900">
                        <i className="fas fa-signature text-blue-600"></i>
                        <span>ترويسة وشعار واسم مكتبك في كل العقود</span>
                      </li>
                      <li className="flex items-center gap-1.5">
                        <i className="fas fa-check text-emerald-600"></i>
                        <span>تصدير Word بإطار ملكي رسمي مذهب</span>
                      </li>
                      <li className="flex items-center gap-1.5">
                        <i className="fas fa-bolt text-amber-500"></i>
                        <span>أولوية التوليد الفوري في 6 ثوانٍ</span>
                      </li>
                    </ul>
                  </div>

                  <div className={`p-2 rounded-xl text-center text-xs font-black ${isSelected ? 'bg-amber-500 text-slate-950 shadow-sm' : 'bg-amber-100 text-amber-900'}`}>
                    {isSelected ? 'الباقة المحددة' : 'اختيار باقة المحامين PRO'}
                  </div>
                </div>
              );
            })()}
          </div>

          {/* Social Proof */}
          <div className="p-5 bg-slate-50 rounded-3xl border border-slate-200">
            <h4 className="text-xs font-black text-slate-900 mb-3 flex items-center gap-1.5">
              <i className="fas fa-comments text-amber-500"></i>
              <span>آراء وتجارب مستشاري ومحامي المنصة المعتمدين:</span>
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {TESTIMONIALS.map((t, idx) => (
                <div key={idx} className="p-3.5 bg-white rounded-2xl border border-slate-200 shadow-2xs text-xs flex flex-col justify-between">
                  <p className="text-slate-700 italic mb-2 leading-relaxed">"{t.quote}"</p>
                  <div>
                    <span className="font-black text-slate-900 block">{t.name}</span>
                    <span className="text-[10px] text-slate-500 block">{t.title}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Payment Gateways, PayPal Integration & Promo Code */}
          <div className="p-5 bg-slate-50 rounded-3xl border border-slate-200 grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
            {/* Payment Method Selector */}
            <div>
              <h5 className="font-black text-xs text-slate-800 mb-2">اختر بوابة الدفع المعتمدة:</h5>
              <div className="grid grid-cols-2 gap-2 text-xs mb-3">
                <button
                  onClick={() => { setPaymentMethod('paypal'); setCurrency('USD'); }}
                  className={`p-2.5 rounded-xl border text-right flex items-center gap-2 font-bold ${
                    paymentMethod === 'paypal'
                      ? 'bg-blue-900 text-amber-300 border-blue-900 shadow-xs ring-2 ring-amber-400/40'
                      : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <i className="fab fa-paypal text-base text-blue-400"></i>
                  <span>باي بال (PayPal رسمي)</span>
                </button>
                <button
                  onClick={() => { setPaymentMethod('instapay'); setCurrency('EGP'); }}
                  className={`p-2.5 rounded-xl border text-right flex items-center gap-2 font-bold ${
                    paymentMethod === 'instapay'
                      ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                      : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <i className="fas fa-building-columns"></i>
                  <span>إنستاباي (InstaPay مصر)</span>
                </button>
                <button
                  onClick={() => { setPaymentMethod('wallet'); setCurrency('EGP'); }}
                  className={`p-2.5 rounded-xl border text-right flex items-center gap-2 font-bold ${
                    paymentMethod === 'wallet'
                      ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                      : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <i className="fas fa-mobile-screen"></i>
                  <span>فودافون كاش ومحافظ الهاتف</span>
                </button>
                <button
                  onClick={() => { setPaymentMethod('card'); setCurrency('USD'); }}
                  className={`p-2.5 rounded-xl border text-right flex items-center gap-2 font-bold ${
                    paymentMethod === 'card'
                      ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                      : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <i className="fab fa-cc-visa"></i>
                  <span>بطاقات فيزا وماستركارد</span>
                </button>
              </div>

              {/* 100% Risk Free Guarantee Banner */}
              <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 flex items-center gap-2.5 text-xs text-emerald-900 font-bold">
                <i className="fas fa-shield-heart text-emerald-600 text-lg flex-shrink-0"></i>
                <span>ضمان استرداد كامل للأموال لمدة 14 يوماً مع تشفير مدفوعات بنكي 256-bit.</span>
              </div>

              {/* Owner Instant Access Shortcut */}
              <div className="mt-3 text-center">
                <button
                  onClick={handleOwnerQuickLogin}
                  className="text-xs text-amber-700 hover:text-amber-800 font-bold underline flex items-center justify-center gap-1.5 w-full py-1.5 bg-amber-100/70 hover:bg-amber-100 rounded-xl transition-colors border border-amber-300/40"
                >
                  <span>👑 هل أنت المستشار سامح العشماوي (المالك والمطور)؟ اضغط هنا للدخول المجاني</span>
                </button>
              </div>
            </div>

            {/* Payment Execution Block */}
            <div className="space-y-4">
              {/* Promo Code / Master Owner Code */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  كود الخصم التجاري أو كود المطور والمالك:
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={promoCode}
                    onChange={(e) => setPromoCode(e.target.value)}
                    placeholder="أدخل الكود هنا..."
                    className="flex-1 px-3.5 py-2 text-xs bg-white border border-slate-300 rounded-xl uppercase font-mono font-bold"
                  />
                  <button
                    onClick={handleApplyPromo}
                    className="px-4 py-2 bg-slate-800 hover:bg-slate-900 text-white text-xs font-bold rounded-xl shadow-xs"
                  >
                    تطبيق الكود
                  </button>
                </div>
                {promoMessage && (
                  <p className={`text-[11px] mt-1 font-bold ${discountPercent > 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                    {promoMessage}
                  </p>
                )}
              </div>

              {/* Real PayPal Buttons or Seamless Fallback */}
              {paymentMethod === 'paypal' && (
                <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs text-center space-y-3">
                  <div className="text-xs text-slate-600 font-bold flex items-center justify-between pb-2 border-b border-slate-100">
                    <span>المبلغ المستحق عبر PayPal:</span>
                    <span className="text-base text-blue-900 font-black">${getUsdAmount().toFixed(2)} USD</span>
                  </div>

                  {!sdkFailed && (
                    <div ref={paypalContainerRef} className="min-h-[50px] flex items-center justify-center">
                      {isProcessing && (
                        <div className="text-xs text-blue-800 font-bold flex items-center gap-2 py-4">
                          <i className="fas fa-spinner fa-spin text-base"></i>
                          <span>جاري التحقق من عملية الدفع مع خوادم PayPal السحابية...</span>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Fallback Direct PayPal Checkout if SDK is blocked or waiting for keys */}
                  {sdkFailed && (
                    <div className="space-y-3 text-right">
                      <div className="bg-blue-50 border border-blue-200 rounded-xl p-3 text-xs text-blue-950 font-bold leading-relaxed">
                        <span className="block font-black mb-1">
                          <i className="fab fa-paypal text-blue-600 ml-1"></i>
                          الدفع المباشر عبر حساب PayPal المعتمد:
                        </span>
                        <span>
                          يمكنك إرسال مبلغ <strong className="text-blue-900 font-black">${getUsdAmount().toFixed(2)} USD</strong> مباشرة إلى حساب PayPal:
                        </span>
                        <div className="my-1.5 p-2 bg-white rounded-lg border border-blue-200 text-center font-mono font-black text-blue-900 select-all">
                          {paypalEmailOrMe}
                        </div>
                        <a
                          href={`https://www.paypal.com/paypalme/samehelashmawey/${getUsdAmount()}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="block text-center mt-2 py-2 px-4 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-500 hover:to-amber-600 text-slate-950 font-black rounded-xl shadow-xs transition-all"
                        >
                          <i className="fab fa-paypal ml-1.5"></i>
                          فتح صفحة الدفع الفوري في PayPal (${getUsdAmount().toFixed(2)} USD)
                        </a>
                      </div>

                      {!paypalManualSubmitted ? (
                        <div>
                          <label className="block text-[11px] font-bold text-slate-700 mb-1">
                            أدخل معرّف العملية (Transaction ID) أو إيميلك في PayPal للتفعيل:
                          </label>
                          <div className="flex gap-2">
                            <input
                              type="text"
                              value={paypalTransactionId}
                              onChange={(e) => setPaypalTransactionId(e.target.value)}
                              placeholder="مثال: رقم العملية أو إيميل الحساب..."
                              className="flex-1 px-3 py-1.5 text-xs bg-slate-50 border border-slate-300 rounded-xl font-mono"
                            />
                            <button
                              onClick={handleManualPayPalSubmit}
                              className="px-3.5 py-1.5 bg-blue-900 hover:bg-blue-800 text-amber-300 text-xs font-bold rounded-xl"
                            >
                              تأكيد التحويل
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div className="p-2.5 bg-emerald-100 text-emerald-900 text-xs rounded-xl font-bold">
                          تم استلام إشعار الدفع رقم ({paypalTransactionId}) بنجاح. سيتم مراجعته وتفعيل باقتك فوراً.
                        </div>
                      )}
                    </div>
                  )}

                  <p className="text-[10px] text-slate-400 mt-1">
                    🔒 الدفع محمي ومشفر عبر شركة PayPal العالمية مع التحقق من المعاملات.
                  </p>
                </div>
              )}

              {/* Local Egyptian Payments: InstaPay / Vodafone Cash */}
              {(paymentMethod === 'instapay' || paymentMethod === 'wallet') && (
                <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs text-right space-y-3">
                  <div className="text-xs font-bold text-slate-800 bg-amber-50 p-2.5 rounded-xl border border-amber-200">
                    <span className="block text-slate-900 font-black mb-1">
                      {paymentMethod === 'instapay' ? 'بيانات التحويل عبر تطبيق InstaPay:' : 'بيانات التحويل عبر فودافون كاش ومحافظ الهاتف:'}
                    </span>
                    <span>الرقم المعتمد: <strong className="text-blue-900 font-mono text-sm">01002345678</strong></span>
                    <br />
                    <span>المبلغ المطلوب: <strong className="text-emerald-700">{getPlanPrice(selectedPlan as any).price} ج.م</strong></span>
                  </div>

                  {!offlineSent ? (
                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 mb-1">
                        أدخل رقم هاتفك المحوّل منه أو كود المعاملة:
                      </label>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={offlineTransferRef}
                          onChange={(e) => setOfflineTransferRef(e.target.value)}
                          placeholder="مثال: رقم الهاتف أو رقم العملية..."
                          className="flex-1 px-3 py-1.5 text-xs bg-slate-50 border border-slate-300 rounded-xl font-mono"
                        />
                        <button
                          onClick={handleManualOfflineTransfer}
                          className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl"
                        >
                          تأكيد الإرسال
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="p-2.5 bg-emerald-100 text-emerald-900 text-xs rounded-xl font-bold">
                      تم استلام إشعار التحويل رقم ({offlineTransferRef}). سيتم مراجعته وتفعيل الرصيد لحسابك فوراً.
                    </div>
                  )}
                </div>
              )}

              {paymentMethod === 'card' && (
                <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs text-center text-xs text-slate-600 space-y-2">
                  <p className="font-bold">
                    يمكنك الدفع ببطاقات Visa و Mastercard مباشرة وبأعلى درجات الأمان عبر بوابة PayPal دون الحاجة لامتلاك حساب PayPal!
                  </p>
                  <button
                    onClick={() => setPaymentMethod('paypal')}
                    className="w-full py-2.5 bg-blue-900 text-amber-300 font-black rounded-xl hover:bg-blue-800 transition-colors"
                  >
                    المتابعة بالبطاقة البنكية عبر بوابة PayPal
                  </button>
                </div>
              )}

              <div className="flex items-center justify-center gap-3 text-[10px] text-slate-400">
                <span>🔒 تشفير 256-bit بنكي</span>
                <span>•</span>
                <span>فاتورة ضريبية رسمية للشركات</span>
                <span>•</span>
                <span>إلغاء في أي وقت</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PricingModal;

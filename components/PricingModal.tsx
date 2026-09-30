import React, { useState } from 'react';
import type { SubscriptionTier } from '../types';

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
    quote: 'تصدير ملفات Word بالترويسة والشعار الرسمي لمكتبنا أضفى احترافية عالية أمام كبار العملاء والشركات الأجنبية. استثمار يستحق كل جنيه.',
    name: 'أ/ نورهان الألفي',
    title: 'شريك رئيسي بمكتب الألفي للاستشارات القانونية — الإسكندرية',
  },
  {
    quote: 'نستخدم المنصة لتوليد عقود الشراكة والتوظيف والتراخيص البرمجية في شركتنا، سرعة الإنجاز ودقة البنود تغنينا عن الانتظار لأيام.',
    name: 'المهندس/ وليد عبد الحميد',
    title: 'رئيس تنفيذي بشركة تكنولوجيا مالية — الجيزة',
  },
];

const PricingModal: React.FC<PricingModalProps> = ({
  isOpen,
  onClose,
  currentTier,
  creditsRemaining,
  onSubscribe,
}) => {
  const [currency, setCurrency] = useState<'EGP' | 'USD'>('EGP');
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('annual');
  const [selectedPlan, setSelectedPlan] = useState<SubscriptionTier | 'pay_as_you_go'>('pro');
  const [paymentMethod, setPaymentMethod] = useState<'paymob' | 'fawry' | 'wallet' | 'card'>('paymob');
  const [promoCode, setPromoCode] = useState('');
  const [discountPercent, setDiscountPercent] = useState<number>(0);
  const [promoMessage, setPromoMessage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  if (!isOpen) return null;

  const handleApplyPromo = () => {
    const code = promoCode.trim().toUpperCase();
    if (code === 'EGYPT2026' || code === 'LAUNCH50') {
      setDiscountPercent(50);
      setPromoMessage('تم تفعيل كود الخصم الحصري 50%! 🎉');
    } else if (code === 'LAWYER100') {
      setDiscountPercent(100);
      setPromoMessage('كود مجاني كامل مخصص للمحامين الشركاء! ⚖️');
    } else {
      setPromoMessage('كود الخصم غير صحيح أو منتهي الصلاحية.');
    }
  };

  const handleCheckout = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setPaymentSuccess(true);
      setTimeout(() => {
        if (selectedPlan === 'pay_as_you_go') {
          onSubscribe(currentTier, 1);
        } else if (selectedPlan === 'starter') {
          onSubscribe('starter', billingCycle === 'annual' ? 60 : 5);
        } else if (selectedPlan === 'pro') {
          onSubscribe('pro', billingCycle === 'annual' ? 300 : 25);
        } else if (selectedPlan === 'enterprise') {
          onSubscribe('enterprise', billingCycle === 'annual' ? 1200 : 100);
        }
        setPaymentSuccess(false);
        onClose();
      }, 1500);
    }, 1200);
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
          ? { price: 14, unit: '/mo (billed annually)', original: 19 }
          : { price: 19, unit: '/month' };
      }
      return billingCycle === 'annual'
        ? { price: 29, unit: '/mo (billed annually)', original: 39 }
        : { price: 39, unit: '/month' };
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/75 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
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
            <span className="inline-block px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-amber-400 text-slate-950 mb-2">
              بوابات الدفع الإلكتروني والاشتراكات التجارية المعتمدة
            </span>
            <h2 className="text-2xl md:text-3xl font-black">باقات الاشتراك التجاري لمكاتب المحاماة والشركات</h2>
            <p className="text-xs md:text-sm text-slate-300 mt-1 leading-relaxed">
              اختر الخطة المثالية لبدء صياغة عقود رسمية كاملة البنود معتمدة من بوابة التشريعات المصرية ومحكمة النقض وتصدير Word و PDF فوري.
            </p>
          </div>

          {/* Billing Cycle & Currency Switchers */}
          <div className="mt-5 flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-white/10">
            {/* Annual / Monthly Toggle */}
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-300 font-bold">دورة الدفع:</span>
              <div className="inline-flex rounded-xl bg-white/10 p-1 border border-white/20 text-xs font-bold">
                <button
                  onClick={() => setBillingCycle('monthly')}
                  className={`px-3 py-1 rounded-lg transition-all ${
                    billingCycle === 'monthly' ? 'bg-white text-slate-950 shadow-xs' : 'text-slate-300 hover:text-white'
                  }`}
                >
                  شهري
                </button>
                <button
                  onClick={() => setBillingCycle('annual')}
                  className={`px-3 py-1 rounded-lg transition-all flex items-center gap-1.5 ${
                    billingCycle === 'annual' ? 'bg-amber-400 text-slate-950 shadow-xs font-black' : 'text-slate-300 hover:text-white'
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
                  onClick={() => setCurrency('EGP')}
                  className={`px-3 py-1 rounded-lg transition-all ${
                    currency === 'EGP' ? 'bg-amber-400 text-slate-950' : 'text-slate-300 hover:text-white'
                  }`}
                >
                  ج.م (الجنيه المصري)
                </button>
                <button
                  onClick={() => setCurrency('USD')}
                  className={`px-3 py-1 rounded-lg transition-all ${
                    currency === 'USD' ? 'bg-amber-400 text-slate-950' : 'text-slate-300 hover:text-white'
                  }`}
                >
                  USD ($ الدولار)
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
            <span>تم تأكيد العملية بنجاح! تم شحن رصيد العقود وتفعيل الباقة المعتمدة.</span>
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
                        <span>تصدير Word و PDF مباشر فوراً</span>
                      </li>
                      <li className="flex items-center gap-1.5">
                        <i className="fas fa-check text-emerald-600"></i>
                        <span>تقرير التدقيق والمطابقة التشريعية والشرعية</span>
                      </li>
                    </ul>
                  </div>

                  <div className={`p-2 rounded-xl text-center text-xs font-bold ${isSelected ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-700'}`}>
                    {isSelected ? 'الباقة المحددة' : 'اختيار هذه الخطة'}
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
                      رواد الأعمال والشركات
                    </span>
                    <h4 className="text-base font-black text-slate-900 mt-2">باقة الشركات الناشئة</h4>
                    <p className="text-xs text-slate-500">للمؤسسات والأنشطة التجارية المتوسطة</p>

                    <div className="my-4">
                      {p.original && (
                        <span className="text-xs line-through text-slate-400 block font-bold">
                          {p.original} {currency === 'EGP' ? 'ج.م' : '$'}
                        </span>
                      )}
                      <span className="text-2xl font-black text-slate-900">
                        {p.price} {currency === 'EGP' ? 'ج.م' : '$'}
                      </span>
                      <span className="text-xs text-slate-500"> {p.unit}</span>
                    </div>

                    <ul className="space-y-2 text-xs text-slate-700 mb-4">
                      <li className="flex items-center gap-1.5 font-bold text-blue-900">
                        <i className="fas fa-bolt text-amber-500"></i>
                        <span>{billingCycle === 'annual' ? '60 عقداً سنوياً' : '5 عقود شهرياً'}</span>
                      </li>
                      <li className="flex items-center gap-1.5">
                        <i className="fas fa-check text-emerald-600"></i>
                        <span>حفظ وأرشفة العقود سحابياً للرجوع في أي وقت</span>
                      </li>
                      <li className="flex items-center gap-1.5">
                        <i className="fas fa-check text-emerald-600"></i>
                        <span>فحص بوابة التشريعات ومحكمة النقض</span>
                      </li>
                    </ul>
                  </div>

                  <div className={`p-2 rounded-xl text-center text-xs font-bold ${isSelected ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-700'}`}>
                    {isSelected ? 'الباقة المحددة' : 'اختيار هذه الخطة'}
                  </div>
                </div>
              );
            })()}

            {/* Plan 3: Pro Law Firm (Most Popular) */}
            {(() => {
              const p = getPlanPrice('pro');
              const isSelected = selectedPlan === 'pro';
              return (
                <div
                  onClick={() => setSelectedPlan('pro')}
                  className={`p-5 rounded-3xl border-2 transition-all cursor-pointer relative flex flex-col justify-between bg-gradient-to-b from-white to-amber-50/40 ${
                    isSelected
                      ? 'border-amber-500 shadow-xl ring-2 ring-amber-500/30'
                      : 'border-amber-300 hover:border-amber-400'
                  }`}
                >
                  <div className="absolute -top-3 left-4 bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-black text-[10px] px-3 py-0.5 rounded-full shadow-sm">
                    الأكثر طلباً للمحامين ⚖️
                  </div>

                  <div>
                    <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded bg-amber-100 text-amber-900">
                      مكاتب المحاماة والمستشارين
                    </span>
                    <h4 className="text-base font-black text-slate-900 mt-2">باقة مكاتب المحاماة PRO</h4>
                    <p className="text-xs text-slate-500">لكبار المحامين والشركات الكبرى</p>

                    <div className="my-4">
                      {p.original && (
                        <span className="text-xs line-through text-slate-400 block font-bold">
                          {p.original} {currency === 'EGP' ? 'ج.م' : '$'}
                        </span>
                      )}
                      <span className="text-2xl font-black text-amber-700">
                        {p.price} {currency === 'EGP' ? 'ج.م' : '$'}
                      </span>
                      <span className="text-xs text-slate-500"> {p.unit}</span>
                    </div>

                    <ul className="space-y-2 text-xs text-slate-700 mb-4">
                      <li className="flex items-center gap-1.5 font-black text-amber-950">
                        <i className="fas fa-crown text-amber-500"></i>
                        <span>{billingCycle === 'annual' ? '300 عقد سنوياً (25/شهر)' : '25 عقداً معتمداً شهرياً'}</span>
                      </li>
                      <li className="flex items-center gap-1.5 font-bold text-blue-900">
                        <i className="fas fa-stamp text-blue-600"></i>
                        <span>وضع اسم وشعار وترويسة مكتبك على العقود</span>
                      </li>
                      <li className="flex items-center gap-1.5 font-bold text-emerald-800">
                        <i className="fas fa-file-word text-emerald-600"></i>
                        <span>تصدير Word مخصص وفخم باسم مكتبك</span>
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

          {/* Social Proof & Testimonials Carousel */}
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

          {/* Payment Gateways, Promo Code & Guarantee */}
          <div className="p-5 bg-slate-50 rounded-3xl border border-slate-200 grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
            {/* Payment Method Selector */}
            <div>
              <h5 className="font-black text-xs text-slate-800 mb-2">اختر طريقة الدفع الآمنة المعتمدة:</h5>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <button
                  onClick={() => setPaymentMethod('paymob')}
                  className={`p-2.5 rounded-xl border text-right flex items-center gap-2 font-bold ${
                    paymentMethod === 'paymob'
                      ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                      : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <i className="fas fa-credit-card"></i>
                  <span>باي موب (Paymob / ميزة)</span>
                </button>
                <button
                  onClick={() => setPaymentMethod('wallet')}
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
                  onClick={() => setPaymentMethod('fawry')}
                  className={`p-2.5 rounded-xl border text-right flex items-center gap-2 font-bold ${
                    paymentMethod === 'fawry'
                      ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                      : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <i className="fas fa-store"></i>
                  <span>فوري (Fawry Pay)</span>
                </button>
                <button
                  onClick={() => setPaymentMethod('card')}
                  className={`p-2.5 rounded-xl border text-right flex items-center gap-2 font-bold ${
                    paymentMethod === 'card'
                      ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                      : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <i className="fab fa-cc-visa"></i>
                  <span>Visa / Mastercard الدولية</span>
                </button>
              </div>

              {/* 100% Risk Free Guarantee Banner */}
              <div className="mt-3 p-3 bg-emerald-50 rounded-xl border border-emerald-200 flex items-center gap-2.5 text-xs text-emerald-900 font-bold">
                <i className="fas fa-shield-heart text-emerald-600 text-lg flex-shrink-0"></i>
                <span>ضمان استرداد الأموال لمدة 14 يوماً بنسبة 100% في حال عدم الرضا التام.</span>
              </div>
            </div>

            {/* Promo Code & Action */}
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  كود الخصم التجاري (Promo Code):
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={promoCode}
                    onChange={(e) => setPromoCode(e.target.value)}
                    placeholder="جرّب: EGYPT2026 أو LAUNCH50"
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

              {/* Checkout Button */}
              <button
                onClick={handleCheckout}
                disabled={isProcessing}
                className="w-full py-3.5 bg-gradient-to-r from-emerald-600 via-teal-700 to-emerald-700 hover:from-emerald-700 hover:to-teal-800 text-white font-black text-sm rounded-2xl shadow-xl transition-all transform active:scale-98 flex items-center justify-center gap-2 disabled:opacity-60"
              >
                {isProcessing ? (
                  <>
                    <i className="fas fa-spinner fa-spin"></i>
                    <span>جاري معالجة الدفع الآمن وتأكيد الاشتراك...</span>
                  </>
                ) : (
                  <>
                    <i className="fas fa-lock text-amber-300"></i>
                    <span>
                      إتمام الدفع وتفعيل الباقة فوراً{' '}
                      {discountPercent > 0 && `(خصم ${discountPercent}%)`}
                    </span>
                  </>
                )}
              </button>
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

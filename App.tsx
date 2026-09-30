import React, { useState, useEffect } from 'react';
import type { ContractFormData, GeneratedContract, UserAccount, SavedContractItem, LawFirmBranding, SubscriptionTier } from './types';
import ContractForm from './components/ContractForm';
import ContractDisplay from './components/ContractDisplay';
import LoadingSpinner from './components/LoadingSpinner';
import Header from './components/Header';
import PricingModal from './components/PricingModal';
import ContractsArchive from './components/ContractsArchive';
import BrandingSettingsModal from './components/BrandingSettingsModal';
import LegalDisclaimerModal from './components/LegalDisclaimerModal';
import OfflineAndPwaStatus from './components/OfflineAndPwaStatus';
import { generateContract } from './services/geminiService';
import {
  getStoredUser,
  saveStoredUser,
  getSavedContracts,
  saveContractToArchive,
  deleteContractFromArchive,
  addCredits,
  updateLawFirmBranding,
  deductCredit,
} from './services/storageService';

const App: React.FC = () => {
  const [contractData, setContractData] = useState<GeneratedContract | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [currentTab, setCurrentTab] = useState<'create' | 'archive'>('create');

  // Modals state
  const [isPricingOpen, setIsPricingOpen] = useState<boolean>(false);
  const [isBrandingOpen, setIsBrandingOpen] = useState<boolean>(false);
  const [isDisclaimerOpen, setIsDisclaimerOpen] = useState<boolean>(false);

  // Persistent user & contracts
  const [user, setUser] = useState<UserAccount>(() => getStoredUser());
  const [savedContracts, setSavedContracts] = useState<SavedContractItem[]>(() => getSavedContracts());

  useEffect(() => {
    setUser(getStoredUser());
    setSavedContracts(getSavedContracts());
  }, []);

  const handleFormSubmit = async (formData: ContractFormData) => {
    // Check credits if on free plan with 0 credits
    if (user.tier === 'free' && user.creditsRemaining <= 0) {
      setIsPricingOpen(true);
      return;
    }

    setIsLoading(true);
    setError(null);
    setContractData(null);

    try {
      const result = await generateContract(formData);

      // Attach user's law firm branding if available
      if (user.branding) {
        result.branding = user.branding;
      }

      setContractData(result);

      // Deduct credit
      deductCredit();
      const updatedUser = getStoredUser();
      setUser(updatedUser);

      // Auto-save to archive library
      const refId = `EGY-LEG-2026-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
      const savedItem = saveContractToArchive(result, refId, formData.contractType);
      setSavedContracts(getSavedContracts());
      console.log('Contract auto-saved with id:', savedItem.id);
    } catch (err) {
      if (err instanceof Error) {
        if (err.message === 'RATE_LIMIT_EXCEEDED') {
          setError('لقد تجاوزت حد الاستخدام المؤقت لمزود الخدمة. يرجى الانتظار دقيقة ثم المحاولة مجدداً.');
        } else if (err.message.includes('GEMINI_API_KEY')) {
          setError(err.message);
        } else {
          setError(err.message || 'حدث خطأ أثناء هندسة العقد. يرجى التأكد من البيانات والمحاولة مجدداً.');
        }
      } else {
        setError('حدث خطأ أثناء هندسة العقد. يرجى التأكد من البيانات والمحاولة مجدداً.');
      }
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setContractData(null);
    setError(null);
    setIsLoading(false);
    setCurrentTab('create');
  };

  const handleSelectFromArchive = (contract: GeneratedContract) => {
    setContractData(contract);
    setCurrentTab('create');
  };

  const handleDeleteFromArchive = (id: string) => {
    const updated = deleteContractFromArchive(id);
    setSavedContracts(updated);
  };

  const handleSubscribe = (tier: SubscriptionTier, addedCredits: number) => {
    const updated = addCredits(addedCredits, tier);
    setUser(updated);
  };

  const handleSaveBranding = (branding: LawFirmBranding) => {
    const updated = updateLawFirmBranding(branding);
    setUser(updated);
  };

  return (
    <div className="min-h-screen bg-slate-100 text-slate-800 flex flex-col justify-between">
      <div>
        <OfflineAndPwaStatus />
        <Header
          currentTab={currentTab}
          onNavigateTab={(tab) => {
            setCurrentTab(tab);
            if (tab === 'archive') {
              setContractData(null);
            }
          }}
          savedContractsCount={savedContracts.length}
          user={user}
          onOpenPricing={() => setIsPricingOpen(true)}
          onOpenBranding={() => setIsBrandingOpen(true)}
          onOpenDisclaimer={() => setIsDisclaimerOpen(true)}
        />

        <main className="container mx-auto p-4 md:p-8">
          {currentTab === 'archive' ? (
            <ContractsArchive
              contracts={savedContracts}
              onSelectContract={handleSelectFromArchive}
              onDeleteContract={handleDeleteFromArchive}
              onNewContract={() => {
                setCurrentTab('create');
                setContractData(null);
              }}
            />
          ) : (
            <>
              {!contractData && !isLoading && (
                <ContractForm onSubmit={handleFormSubmit} />
              )}

              {isLoading && <LoadingSpinner />}

              {error && (
                <div className="max-w-xl mx-auto text-center p-8 bg-white rounded-2xl shadow-xl border border-rose-200">
                  <div className="w-14 h-14 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center text-2xl mx-auto mb-3">
                    <i className="fas fa-circle-exclamation"></i>
                  </div>
                  <h3 className="text-base font-black text-slate-900 mb-1">تعذر استكمال صياغة العقد</h3>
                  <p className="text-rose-600 text-xs font-semibold mb-6">{error}</p>
                  <button
                    onClick={handleReset}
                    className="px-6 py-2.5 bg-blue-600 text-white font-black text-xs rounded-xl hover:bg-blue-700 shadow-md transition-colors"
                  >
                    إعادة المحاولة / Start Over
                  </button>
                </div>
              )}

              {contractData && !isLoading && (
                <ContractDisplay contract={contractData} onReset={handleReset} />
              )}
            </>
          )}
        </main>
      </div>

      {/* Commercial Modals */}
      <PricingModal
        isOpen={isPricingOpen}
        onClose={() => setIsPricingOpen(false)}
        currentTier={user.tier}
        creditsRemaining={user.creditsRemaining}
        onSubscribe={handleSubscribe}
      />

      <BrandingSettingsModal
        isOpen={isBrandingOpen}
        onClose={() => setIsBrandingOpen(false)}
        branding={user.branding}
        onSave={handleSaveBranding}
      />

      <LegalDisclaimerModal
        isOpen={isDisclaimerOpen}
        onClose={() => setIsDisclaimerOpen(false)}
      />

      {/* Official Legal Footer */}
      <footer className="mt-12 bg-slate-900 text-slate-400 text-xs py-6 border-t border-slate-800 print:hidden">
        <div className="container mx-auto px-4 text-center space-y-2">
          <div className="flex flex-wrap items-center justify-center gap-4 text-slate-300 font-bold">
            <button onClick={() => setIsPricingOpen(true)} className="hover:text-amber-400 transition-colors">
              باقات الاشتراك والأسعار
            </button>
            <span>•</span>
            <button onClick={() => setIsBrandingOpen(true)} className="hover:text-amber-400 transition-colors">
              هوية وشعار مكتب المحاماة
            </button>
            <span>•</span>
            <button onClick={() => setIsDisclaimerOpen(true)} className="hover:text-amber-400 transition-colors">
              شروط الاستخدام وإخلاء المسؤولية
            </button>
            <span>•</span>
            <span className="text-emerald-400">
              <i className="fas fa-lock ml-1"></i> بوابات الدفع مشفرة ومعتمدة
            </span>
          </div>
          <p className="text-slate-500 text-[11px]">
            منصة "عدالة كونتراكت" — منظومة الصياغة والترجمة القانونية المعتمدة طبقاً للقانون المصري وأحكام الشريعة الإسلامية © 2026
          </p>
        </div>
      </footer>
    </div>
  );
};

export default App;

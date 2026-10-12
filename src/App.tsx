import React, { useState, useEffect } from 'react';
import { RoutePath } from '@/types';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { FloatingContactActions } from '@/components/layout/FloatingContactActions';
import { ConsultationModal } from '@/components/ui/ConsultationModal';
import { AIChatDrawer } from '@/features/farcon-ai/AIChatDrawer';
import { HomeView } from '@/components/sections/HomeView';
import { AboutView } from '@/components/sections/AboutView';
import { ServicesView } from '@/components/sections/ServicesView';
import { GoalsView } from '@/components/sections/GoalsView';
import { CalculatorsHub } from '@/features/calculators/CalculatorsHub';
import { InvestorQuizView } from '@/features/investor-quiz/InvestorQuizView';
import { WealthPlannerView } from '@/features/wealth-planner/WealthPlannerView';
import { MutualFundExplorerView } from '@/features/mutual-funds/MutualFundExplorerView';
import { PortfolioReviewView } from '@/features/portfolio-review/PortfolioReviewView';
import { InvestorLoginView } from '@/features/investor-login/InvestorLoginView';
import { EducationView } from '@/components/sections/EducationView';
import { LegalViews } from '@/components/sections/LegalViews';

export function App() {
  const [currentPath, setCurrentPath] = useState<RoutePath>(() => {
    if (typeof window !== 'undefined') {
      const p = window.location.pathname as RoutePath;
      return p || '/';
    }
    return '/';
  });

  const [consultationOpen, setConsultationOpen] = useState(false);
  const [consultationSubject, setConsultationSubject] = useState<string>('Goal-Based Planning');
  const [aiOpen, setAiOpen] = useState(false);

  // Sync browser back/forward buttons
  useEffect(() => {
    const handlePopState = () => {
      setCurrentPath((window.location.pathname as RoutePath) || '/');
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const navigate = (path: RoutePath) => {
    if (typeof window !== 'undefined') {
      if (window.location.pathname !== path) {
        window.history.pushState({}, '', path);
      }
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
    setCurrentPath(path);
  };

  const handleOpenConsultation = (subject?: string) => {
    if (subject) setConsultationSubject(subject);
    setConsultationOpen(true);
  };

  // Router dispatcher
  const renderView = () => {
    // 1. Home
    if (currentPath === '/') {
      return (
        <HomeView
          navigate={navigate}
          onOpenConsultation={handleOpenConsultation}
          onOpenAI={() => setAiOpen(true)}
        />
      );
    }

    // 2. About
    if (currentPath === '/about') {
      return (
        <AboutView
          navigate={navigate}
          onOpenConsultation={() => handleOpenConsultation('About Farcon Inquiry')}
        />
      );
    }

    // 3. Services Overview & Detail Routes
    if (currentPath.startsWith('/services')) {
      const slug = currentPath.replace('/services/', '');
      const activeSlug = slug !== '/services' && slug !== '' ? slug : undefined;
      return (
        <ServicesView
          activeSlug={activeSlug}
          navigate={navigate}
          onOpenConsultation={handleOpenConsultation}
        />
      );
    }

    // 4. Goals Overview & Detail Routes
    if (currentPath.startsWith('/goals')) {
      const slug = currentPath.replace('/goals/', '');
      const activeSlug = slug !== '/goals' && slug !== '' ? slug : undefined;
      return (
        <GoalsView
          activeSlug={activeSlug}
          navigate={navigate}
          onOpenConsultation={handleOpenConsultation}
        />
      );
    }

    // 5. Calculators Hub & Individual Calculators
    if (currentPath.startsWith('/calculators')) {
      let calcType: 'sip' | 'lumpsum' | 'goal' | 'retirement' = 'sip';
      if (currentPath.includes('/lumpsum')) calcType = 'lumpsum';
      else if (currentPath.includes('/goal')) calcType = 'goal';
      else if (currentPath.includes('/retirement')) calcType = 'retirement';

      return (
        <CalculatorsHub
          initialType={calcType}
          navigate={navigate}
          onOpenConsultation={handleOpenConsultation}
        />
      );
    }

    // 6. Investor Quiz
    if (currentPath === '/investor-quiz') {
      return (
        <InvestorQuizView
          navigate={navigate}
          onOpenConsultation={handleOpenConsultation}
        />
      );
    }

    // 7. Wealth Planner Lite
    if (currentPath === '/wealth-planner') {
      return (
        <WealthPlannerView
          navigate={navigate}
          onOpenConsultation={handleOpenConsultation}
        />
      );
    }

    // 8. Mutual Fund Explorer
    if (currentPath === '/mutual-funds') {
      return (
        <MutualFundExplorerView
          navigate={navigate}
          onOpenConsultation={handleOpenConsultation}
        />
      );
    }

    // 9. Portfolio Review
    if (currentPath === '/portfolio-review') {
      return <PortfolioReviewView navigate={navigate} />;
    }

    // 10. Investor Login
    if (currentPath === '/investor-login') {
      return (
        <InvestorLoginView
          navigate={navigate}
          onOpenConsultation={() => handleOpenConsultation('Investor Login Assistance')}
        />
      );
    }

    // 11. Education & Blogs & FAQ
    if (currentPath === '/education' || currentPath === '/blogs' || currentPath === '/faq') {
      return (
        <EducationView
          navigate={navigate}
          onOpenConsultation={() => handleOpenConsultation('Educational Discussion')}
        />
      );
    }

    // 12. Contact / Direct Consultation Booking
    if (currentPath === '/contact') {
      return (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center max-w-xl mx-auto mb-10">
            <span className="text-xs font-semibold tracking-wider uppercase text-[#78A832]">
              Direct Advisory Desk
            </span>
            <h1 className="mt-2 text-3xl font-poppins font-medium text-slate-900">
              Connect With Farcon Wealth
            </h1>
            <p className="mt-2 text-xs sm:text-sm text-slate-600">
              Schedule a quiet, confidential conversation with our AMFI-registered team.
            </p>
          </div>
          <div className="bg-white rounded-xl border border-[#DCE4EE] p-8 shadow-xs max-w-xl mx-auto text-center space-y-6">
            <p className="text-xs text-slate-600 leading-relaxed">
              We respond to all investor inquiries promptly with zero sales push.
            </p>
            <button
              onClick={() => handleOpenConsultation('Contact Page Request')}
              className="px-6 py-3 text-xs font-semibold text-white bg-[#101A2C] rounded-md hover:bg-[#15243B] transition-colors shadow-xs"
            >
              Open Consultation Form
            </button>
          </div>
        </div>
      );
    }

    // 13. Legal & Regulatory
    if (currentPath === '/disclosures') {
      return <LegalViews type="disclosures" navigate={navigate} />;
    }
    if (currentPath === '/grievance') {
      return <LegalViews type="grievance" navigate={navigate} />;
    }
    if (currentPath === '/privacy') {
      return <LegalViews type="privacy" navigate={navigate} />;
    }
    if (currentPath === '/terms') {
      return <LegalViews type="terms" navigate={navigate} />;
    }

    // Fallback: Home
    return (
      <HomeView
        navigate={navigate}
        onOpenConsultation={handleOpenConsultation}
        onOpenAI={() => setAiOpen(true)}
      />
    );
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FAFBFC] text-[#17243A] antialiased selection:bg-[#78A832]/20 selection:text-[#101A2C]">
      {/* Top Navigation */}
      <Navbar
        currentPath={currentPath}
        navigate={navigate}
        onOpenConsultation={() => handleOpenConsultation('Navbar Consultation Button')}
      />

      {/* Main Content Area */}
      <main className="flex-1">
        {renderView()}
      </main>

      {/* Footer */}
      <Footer navigate={navigate} />

      {/* Sticky / Floating Quick Contact Actions */}
      <FloatingContactActions onOpenAI={() => setAiOpen(true)} />

      {/* Free Consultation Modal */}
      <ConsultationModal
        isOpen={consultationOpen}
        onClose={() => setConsultationOpen(false)}
        prefilledGoal={consultationSubject}
      />

      {/* Farcon AI Guidance Drawer */}
      <AIChatDrawer
        isOpen={aiOpen}
        onClose={() => setAiOpen(false)}
        navigate={navigate}
        onOpenConsultation={() => {
          setAiOpen(false);
          handleOpenConsultation('Farcon AI Referral');
        }}
      />
    </div>
  );
}

export default App;

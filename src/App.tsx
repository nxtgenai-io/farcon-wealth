import React, { useState, useEffect } from 'react';
import { RoutePath } from '@/types';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { FloatingContactActions } from '@/components/layout/FloatingContactActions';
import { ConsultationModal } from '@/components/ui/ConsultationModal';
import { AIChatDrawer } from '@/features/farcon-ai/AIChatDrawer';
import { HomeView } from '@/components/sections/HomeView';
import { PageCta } from '@/components/sections/home/PageCta';
import { ServicesView } from '@/components/sections/ServicesView';
import { GoalsView } from '@/components/sections/GoalsView';
import { CalculatorsPage } from '@/components/pages/CalculatorsPage';
import { InvestorQuizView } from '@/features/investor-quiz/InvestorQuizView';
import { WealthPlannerView } from '@/features/wealth-planner/WealthPlannerView';
import {
  AboutPage,
  ContactPage,
  DisclosuresPage,
  EducationPage,
  FundsPage,
  LoginPage,
  PortfolioPage,
} from '@/components/pages/SitePages';

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
      return <AboutPage navigate={navigate} onOpenConsultation={handleOpenConsultation} />;
    }

    if (currentPath.startsWith('/services')) {
      const slug = currentPath === '/services' ? undefined : currentPath.slice('/services/'.length);
      return (
        <ServicesView
          activeSlug={slug}
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
        <CalculatorsPage
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
      return <FundsPage />;
    }

    if (currentPath === '/portfolio-review') {
      return <PortfolioPage />;
    }

    if (currentPath === '/investor-login') {
      return <LoginPage navigate={navigate} onOpenConsultation={handleOpenConsultation} />;
    }

    if (currentPath === '/education' || currentPath === '/blogs' || currentPath === '/faq') {
      return <EducationPage navigate={navigate} onOpenConsultation={handleOpenConsultation} />;
    }

    // 12. Contact / Direct Consultation Booking
    if (currentPath === '/contact') {
      return <ContactPage />;
    }

    if (currentPath === '/disclosures') return <DisclosuresPage section="disclosures" />;
    if (currentPath === '/grievance') return <DisclosuresPage section="grievance" />;
    if (currentPath === '/privacy') return <DisclosuresPage section="privacy" />;
    if (currentPath === '/terms') return <DisclosuresPage section="terms" />;

    // Fallback: Home
    return (
      <HomeView
        navigate={navigate}
        onOpenConsultation={handleOpenConsultation}
        onOpenAI={() => setAiOpen(true)}
      />
    );
  };

  const home = currentPath === '/';
  return (
    <div className={`min-h-screen flex flex-col bg-[#F7F4EC] text-[#1A241C] antialiased selection:bg-[#C9A24A]/30 selection:text-[#0F3D2E] ${home ? 'is-home' : ''}`}>
      {/* Top Navigation */}
      <Navbar
        currentPath={currentPath}
        navigate={navigate}
        onOpenConsultation={() => handleOpenConsultation('Navbar Consultation Button')}
      />

      {/* Main Content Area */}
      <main className="flex-1 fw-skin">
        {renderView()}
        {currentPath !== '/' && <PageCta onBook={() => handleOpenConsultation('Book a Free 15-Minute Call')} />}
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

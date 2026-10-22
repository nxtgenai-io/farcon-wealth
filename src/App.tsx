import React, { lazy, Suspense, useEffect, useState } from 'react';
import { RoutePath } from '@/types';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { FloatingContactActions } from '@/components/layout/FloatingContactActions';
import { ConsultationModal } from '@/components/ui/ConsultationModal';
import { AIChatDrawer } from '@/features/farcon-ai/AIChatDrawer';
import { HomeView } from '@/components/sections/HomeView';
import { PageCta } from '@/components/sections/home/PageCta';
import { NotFound } from '@/components/pages/NotFound';

const ServicesView = lazy(() => import('@/components/sections/ServicesView').then((m) => ({ default: m.ServicesView })));
const GoalsView = lazy(() => import('@/components/sections/GoalsView').then((m) => ({ default: m.GoalsView })));
const CalculatorsPage = lazy(() => import('@/components/pages/CalculatorsPage').then((m) => ({ default: m.CalculatorsPage })));
const InvestorQuizView = lazy(() => import('@/features/investor-quiz/InvestorQuizView').then((m) => ({ default: m.InvestorQuizView })));
const WealthPlannerView = lazy(() => import('@/features/wealth-planner/WealthPlannerView').then((m) => ({ default: m.WealthPlannerView })));
const AboutPage = lazy(() => import('@/components/pages/SitePages').then((m) => ({ default: m.AboutPage })));
const ContactPage = lazy(() => import('@/components/pages/SitePages').then((m) => ({ default: m.ContactPage })));
const DisclosuresPage = lazy(() => import('@/components/pages/SitePages').then((m) => ({ default: m.DisclosuresPage })));
const EducationPage = lazy(() => import('@/components/pages/SitePages').then((m) => ({ default: m.EducationPage })));
const FundsPage = lazy(() => import('@/components/pages/SitePages').then((m) => ({ default: m.FundsPage })));
const LoginPage = lazy(() => import('@/components/pages/SitePages').then((m) => ({ default: m.LoginPage })));
const PortfolioPage = lazy(() => import('@/components/pages/SitePages').then((m) => ({ default: m.PortfolioPage })));

const PAGE_META: Record<string, { title: string; description: string }> = {
  '/': {
    title: 'Farcon Wealth | Investing, Without The Noise',
    description: 'AMFI-registered mutual fund distributor. Goal-based SIP planning, retirement, tax-saving and portfolio guidance. ARN 329006.',
  },
  '/about': {
    title: 'About Farcon Wealth | ARN 329006',
    description: 'Farcon Wealth is an AMFI-registered mutual fund distributor helping families invest with clarity, discipline and purpose.',
  },
  '/services': {
    title: 'Services | Farcon Wealth',
    description: 'Goal-based SIP planning, portfolio review, ELSS, retirement, child education and SWP guidance.',
  },
  '/goals': {
    title: 'Goals | Farcon Wealth',
    description: 'Plan for retirement, child education, wealth creation and tax saving with a goal-based mutual fund approach.',
  },
  '/calculators': {
    title: 'Calculators | Farcon Wealth',
    description: 'SIP, lumpsum, goal and retirement calculators. Illustrative estimates, not a promise of returns.',
  },
  '/calculators/sip': {
    title: 'SIP Calculator | Farcon Wealth',
    description: 'Illustrative SIP calculator. A monthly amount, a rate and a horizon. Not a promise of returns.',
  },
  '/calculators/lumpsum': {
    title: 'Lumpsum Calculator | Farcon Wealth',
    description: 'Illustrative lumpsum calculator. Not a promise of returns.',
  },
  '/calculators/goal': {
    title: 'Goal Calculator | Farcon Wealth',
    description: 'Illustrative goal calculator for a target amount and a date.',
  },
  '/calculators/retirement': {
    title: 'Retirement Calculator | Farcon Wealth',
    description: 'Illustrative retirement calculator from today’s spending and a retirement age.',
  },
  '/investor-quiz': {
    title: 'Investor Quiz | Farcon Wealth',
    description: 'A short quiz to understand the kind of mutual fund approach that may fit your horizon and comfort with risk.',
  },
  '/wealth-planner': {
    title: 'Wealth Planner | Farcon Wealth',
    description: 'Sketch a goal, a timeline and an illustrative monthly investment with Farcon’s planner.',
  },
  '/mutual-funds': {
    title: 'Mutual Funds | Farcon Wealth',
    description: 'Explore mutual fund categories. Scheme selection is illustrative and subject to suitability.',
  },
  '/portfolio-review': {
    title: 'Portfolio Review | Farcon Wealth',
    description: 'Request a calm review of mutual fund holdings held in your own name.',
  },
  '/investor-login': {
    title: 'Investor Login | Farcon Wealth',
    description: 'Online portfolio access is coming soon. Message Farcon on WhatsApp or request a statement.',
  },
  '/education': {
    title: 'Investor Education | Farcon Wealth',
    description: 'Short explanations of SIPs, lumpsum investing, ELSS and goal-based mutual fund planning.',
  },
  '/blogs': {
    title: 'Notes | Farcon Wealth',
    description: 'Notes on goal-based mutual fund investing from Farcon Wealth.',
  },
  '/faq': {
    title: 'FAQs | Farcon Wealth',
    description: 'Answers to common questions about Farcon Wealth, SIPs and mutual fund distribution.',
  },
  '/contact': {
    title: 'Contact | Farcon Wealth',
    description: 'Book a conversation or message Farcon Wealth on WhatsApp. ARN 329006.',
  },
  '/privacy': {
    title: 'Privacy Policy | Farcon Wealth',
    description: 'How Farcon Wealth handles personal information.',
  },
  '/terms': {
    title: 'Terms of Use | Farcon Wealth',
    description: 'Terms for using the Farcon Wealth website.',
  },
  '/disclosures': {
    title: 'Disclosures | Farcon Wealth',
    description: 'AMFI registration, ARN 329006 and mutual fund risk disclosures.',
  },
  '/grievance': {
    title: 'Grievance Redressal | Farcon Wealth',
    description: 'How to raise a concern with Farcon Wealth.',
  },
};

function metaFor(path: string) {
  if (PAGE_META[path]) return PAGE_META[path];
  if (path.startsWith('/goals')) return PAGE_META['/goals'];
  if (path.startsWith('/services')) return PAGE_META['/services'];
  if (path.startsWith('/calculators')) return PAGE_META['/calculators'];
  return {
    title: 'Page not found | Farcon Wealth',
    description: 'This page is not on the Farcon Wealth site.',
  };
}

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
  const [showTop, setShowTop] = useState(false);

  // Sync browser back/forward buttons
  useEffect(() => {
    const handlePopState = () => {
      setCurrentPath((window.location.pathname as RoutePath) || '/');
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const navigate = (path: RoutePath) => {
    const raw = String(path);
    const pathname = (raw.split('?')[0] || '/') as RoutePath;
    if (typeof window !== 'undefined') {
      if (`${window.location.pathname}${window.location.search}` !== raw) {
        window.history.pushState({}, '', raw);
      }
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
    setCurrentPath(pathname);
  };

  useEffect(() => {
    const meta = metaFor(currentPath);
    document.title = meta.title;
    const description = document.querySelector('meta[name="description"]');
    if (description) description.setAttribute('content', meta.description);
    const ogTitle = document.querySelector('meta[property="og:title"]');
    const ogDescription = document.querySelector('meta[property="og:description"]');
    const twitter = document.querySelector('meta[name="twitter:title"]');
    const twitterDescription = document.querySelector('meta[name="twitter:description"]');
    ogTitle?.setAttribute('content', meta.title);
    ogDescription?.setAttribute('content', meta.description);
    twitter?.setAttribute('content', meta.title);
    twitterDescription?.setAttribute('content', meta.description);
    const canonical = document.querySelector('link[rel="canonical"]');
    if (canonical) canonical.setAttribute('href', `https://farconwealth.com${currentPath === '/' ? '/' : currentPath}`);
  }, [currentPath]);

  useEffect(() => {
    const onScroll = () => setShowTop(window.scrollY > 640);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

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
      const focus = currentPath === '/blogs' ? 'blogs' : currentPath === '/faq' ? 'faq' : 'education';
      return <EducationPage navigate={navigate} onOpenConsultation={handleOpenConsultation} focus={focus} />;
    }

    // 12. Contact / Direct Consultation Booking
    if (currentPath === '/contact') {
      return <ContactPage />;
    }

    if (currentPath === '/disclosures') return <DisclosuresPage section="disclosures" />;
    if (currentPath === '/grievance') return <DisclosuresPage section="grievance" />;
    if (currentPath === '/privacy') return <DisclosuresPage section="privacy" />;
    if (currentPath === '/terms') return <DisclosuresPage section="terms" />;

    return <NotFound navigate={navigate} />;
  };

  const home = currentPath === '/';
  return (
    <div className={`min-h-screen flex flex-col bg-[#F7F4EC] text-[#1A241C] antialiased selection:bg-[#C9A24A]/30 selection:text-[#0F3D2E] ${home ? 'is-home' : ''}`}>
      <a className="skip-link" href="#main">Skip to content</a>
      <Navbar
        currentPath={currentPath}
        navigate={navigate}
        onOpenConsultation={() => handleOpenConsultation('Navbar Consultation Button')}
      />

      {/* Main Content Area */}
      <main id="main" className="flex-1 fw-skin">
        <Suspense fallback={<div className="pg"><div className="pg-wrap"><p className="lede">Loading…</p></div></div>}>
          {renderView()}
          {currentPath !== '/' && !metaFor(currentPath).title.startsWith('Page not found') && (
            <PageCta onBook={() => handleOpenConsultation('Book a Free 15-Minute Call')} />
          )}
        </Suspense>
      </main>
      <button
        type="button"
        className={`fw-top${showTop ? ' is-on' : ''}`}
        aria-label="Back to top"
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      >
        Top
      </button>

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

import React, { lazy, Suspense, useEffect, useState } from 'react';
import { RoutePath } from '@/types';
import { BLOG_POSTS } from '@/content/blogs/blogData';
import fundBook from '@/content/funds/schemes.json';
import { metaFor, ogImagePath } from '@/content/seo/meta';
import { SITE_URL } from '@/content/site/config';
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
const ArticlePage = lazy(() => import('@/components/pages/SitePages').then((m) => ({ default: m.ArticlePage })));
const StartInvestingPage = lazy(() => import('@/components/pages/SitePages').then((m) => ({ default: m.StartInvestingPage })));
const LoginPage = lazy(() => import('@/components/pages/SitePages').then((m) => ({ default: m.LoginPage })));
const PortfolioPage = lazy(() => import('@/components/pages/SitePages').then((m) => ({ default: m.PortfolioPage })));

const UTM_KEYS = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content'] as const;

function captureUtm() {
  if (typeof window === 'undefined') return;
  const params = new URLSearchParams(window.location.search);
  const next: Record<string, string> = {};
  UTM_KEYS.forEach((key) => {
    const value = params.get(key);
    if (value) next[key] = value.slice(0, 120);
  });
  if (!Object.keys(next).length) return;
  try {
    const prev = JSON.parse(sessionStorage.getItem('farcon_utm') || '{}') as Record<string, string>;
    sessionStorage.setItem('farcon_utm', JSON.stringify({ ...prev, ...next }));
  } catch {
    sessionStorage.setItem('farcon_utm', JSON.stringify(next));
  }
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
    captureUtm();
    const handlePopState = () => {
      captureUtm();
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
      captureUtm();
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
    const href = `${SITE_URL}${currentPath === '/' ? '/' : currentPath}`;
    if (canonical) canonical.setAttribute('href', href);
    document.querySelector('meta[property="og:url"]')?.setAttribute('content', href);
    const image = `${SITE_URL}${ogImagePath(currentPath)}`;
    document.querySelector('meta[property="og:image"]')?.setAttribute('content', image);
    document.querySelector('meta[name="twitter:image"]')?.setAttribute('content', image);
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
    if (currentPath === '/start-investing') {
      return <StartInvestingPage />;
    }

    if (currentPath === '/mutual-funds' || currentPath.startsWith('/mutual-funds/')) {
      const rest = currentPath === '/mutual-funds' ? '' : currentPath.slice('/mutual-funds/'.length);
      const parts = rest.split('/').filter(Boolean);
      const [categorySlug, schemeSlug, extra] = parts;
      const category = categorySlug ? fundBook.categories.find((item) => item.slug === categorySlug) : undefined;
      const scheme = category && schemeSlug ? category.schemes.find((item) => item.slug === schemeSlug) : undefined;
      if (extra || (categorySlug && !category) || (schemeSlug && !scheme)) {
        return <NotFound navigate={navigate} />;
      }
      return <FundsPage navigate={navigate} categorySlug={categorySlug} schemeSlug={schemeSlug} />;
    }

    if (currentPath.startsWith('/blogs/') && currentPath !== '/blogs') {
      const slug = currentPath.slice('/blogs/'.length);
      if (!BLOG_POSTS.some((item) => item.slug === slug)) return <NotFound navigate={navigate} />;
      return <ArticlePage navigate={navigate} onOpenConsultation={handleOpenConsultation} slug={slug} />;
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

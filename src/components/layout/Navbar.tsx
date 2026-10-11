import React, { useState, useEffect } from 'react';
import { FarconLogo } from '@/components/ui/FarconLogo';
import { RoutePath } from '@/types';
import { Menu, X, ChevronDown, Lock } from 'lucide-react';

interface NavbarProps {
  currentPath: string;
  navigate: (path: RoutePath) => void;
  onOpenConsultation: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentPath, navigate, onOpenConsultation }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [servicesDropdownOpen, setServicesDropdownOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavClick = (path: RoutePath) => {
    setMobileMenuOpen(false);
    setServicesDropdownOpen(false);
    navigate(path);
  };

  return (
    <header
      className={`sticky top-0 z-40 transition-all duration-300 ${
        scrolled
          ? 'bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs py-3'
          : 'bg-[#F8FAFC]/80 backdrop-blur-xs border-b border-slate-200/60 py-4 sm:py-5'
      } ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2'}`}
      style={{ transitionProperty: 'background-color, padding, border-color, opacity, transform' }}
    >
      <div className="max-w-[1536px] mx-auto px-4 sm:px-6 lg:px-12">
        <div className="flex items-center justify-between gap-6 lg:gap-12">
          {/* Zone 1: Farcon Brand Logo on Left */}
          <div
            onClick={() => handleNavClick('/')}
            className="cursor-pointer shrink-0 transition-opacity hover:opacity-90"
            role="button"
            tabIndex={0}
            onKeyDown={(e) => e.key === 'Enter' && handleNavClick('/')}
            aria-label="Farcon Wealth Homepage"
          >
            <FarconLogo variant="horizontal" size="md" />
          </div>

          {/* Zone 2: Balanced Center Navigation Links */}
          <nav className="hidden xl:flex items-center gap-7 2xl:gap-8 text-xs font-medium text-slate-600">
            <button
              onClick={() => handleNavClick('/')}
              className={`hover:text-slate-950 transition-colors whitespace-nowrap shrink-0 py-1 ${
                currentPath === '/' ? 'text-slate-950 font-semibold' : ''
              }`}
            >
              Home
            </button>

            {/* Services Dropdown */}
            <div
              className="relative"
              onMouseEnter={() => setServicesDropdownOpen(true)}
              onMouseLeave={() => setServicesDropdownOpen(false)}
            >
              <button
                onClick={() => handleNavClick('/services')}
                className={`flex items-center gap-1 hover:text-slate-950 transition-colors whitespace-nowrap shrink-0 py-1 ${
                  currentPath.startsWith('/services') ? 'text-slate-950 font-semibold' : ''
                }`}
              >
                Services
                <ChevronDown className="w-3 h-3 opacity-60" />
              </button>

              {servicesDropdownOpen && (
                <div className="absolute top-full left-0 pt-2 w-64 animate-in fade-in zoom-in-95 duration-150">
                  <div className="bg-white rounded-lg border border-slate-200 shadow-xl p-2 text-xs">
                    <button
                      onClick={() => handleNavClick('/services/sip-planning')}
                      className="w-full text-left px-3 py-2 rounded-md hover:bg-slate-50 hover:text-slate-950 transition-colors font-medium text-slate-700 block"
                    >
                      Goal-Based SIP Planning
                    </button>
                    <button
                      onClick={() => handleNavClick('/services/portfolio-review')}
                      className="w-full text-left px-3 py-2 rounded-md hover:bg-slate-50 hover:text-slate-950 transition-colors font-medium text-slate-700 block"
                    >
                      Portfolio Review & Consolidation
                    </button>
                    <button
                      onClick={() => handleNavClick('/services/elss')}
                      className="w-full text-left px-3 py-2 rounded-md hover:bg-slate-50 hover:text-slate-950 transition-colors font-medium text-slate-700 block"
                    >
                      Tax Saving Through ELSS
                    </button>
                    <button
                      onClick={() => handleNavClick('/services/retirement')}
                      className="w-full text-left px-3 py-2 rounded-md hover:bg-slate-50 hover:text-slate-950 transition-colors font-medium text-slate-700 block"
                    >
                      Retirement Planning
                    </button>
                    <button
                      onClick={() => handleNavClick('/services/child-education')}
                      className="w-full text-left px-3 py-2 rounded-md hover:bg-slate-50 hover:text-slate-950 transition-colors font-medium text-slate-700 block"
                    >
                      Child Education Planning
                    </button>
                    <button
                      onClick={() => handleNavClick('/services/swp')}
                      className="w-full text-left px-3 py-2 rounded-md hover:bg-slate-50 hover:text-slate-950 transition-colors font-medium text-slate-700 block"
                    >
                      Systematic Withdrawal (SWP)
                    </button>
                  </div>
                </div>
              )}
            </div>

            <button
              onClick={() => handleNavClick('/goals')}
              className={`hover:text-slate-950 transition-colors whitespace-nowrap shrink-0 py-1 ${
                currentPath.startsWith('/goals') ? 'text-slate-950 font-semibold' : ''
              }`}
            >
              Goals
            </button>

            <button
              onClick={() => handleNavClick('/calculators')}
              className={`hover:text-slate-950 transition-colors whitespace-nowrap shrink-0 py-1 ${
                currentPath.startsWith('/calculators') ? 'text-slate-950 font-semibold' : ''
              }`}
            >
              Calculators
            </button>

            <button
              onClick={() => handleNavClick('/investor-quiz')}
              className={`hover:text-slate-950 transition-colors whitespace-nowrap shrink-0 py-1 ${
                currentPath === '/investor-quiz' ? 'text-slate-950 font-semibold' : ''
              }`}
            >
              Investor Quiz
            </button>

            <button
              onClick={() => handleNavClick('/wealth-planner')}
              className={`hover:text-slate-950 transition-colors whitespace-nowrap shrink-0 py-1 ${
                currentPath === '/wealth-planner' ? 'text-slate-950 font-semibold' : ''
              }`}
            >
              Planner
            </button>

            <button
              onClick={() => handleNavClick('/mutual-funds')}
              className={`hover:text-slate-950 transition-colors whitespace-nowrap shrink-0 py-1 ${
                currentPath === '/mutual-funds' ? 'text-slate-950 font-semibold' : ''
              }`}
            >
              Funds
            </button>

            <button
              onClick={() => handleNavClick('/education')}
              className={`hover:text-slate-950 transition-colors whitespace-nowrap shrink-0 py-1 ${
                currentPath === '/education' ? 'text-slate-950 font-semibold' : ''
              }`}
            >
              Education
            </button>

            <button
              onClick={() => handleNavClick('/about')}
              className={`hover:text-slate-950 transition-colors whitespace-nowrap shrink-0 py-1 ${
                currentPath === '/about' ? 'text-slate-950 font-semibold' : ''
              }`}
            >
              About
            </button>
          </nav>

          {/* Zone 3: Primary Actions on Right */}
          <div className="hidden sm:flex items-center gap-4 shrink-0">
            <button
              onClick={() => handleNavClick('/investor-login')}
              className="text-xs font-medium text-slate-600 hover:text-slate-950 transition-colors flex items-center gap-1.5 whitespace-nowrap shrink-0 px-2 py-1.5 rounded-md hover:bg-slate-100/60"
              title="Access existing investment portfolio"
            >
              <Lock className="w-3.5 h-3.5 text-slate-400" />
              <span>Investor Login</span>
            </button>

            <button
              onClick={onOpenConsultation}
              className="px-4 py-2 text-xs font-semibold text-white bg-[#0B131E] hover:bg-[#131F31] rounded-md transition-all whitespace-nowrap shrink-0 shadow-xs hover:shadow-sm active:scale-[0.98]"
            >
              Book Consultation
            </button>
          </div>

          {/* Mobile Navigation Trigger */}
          <div className="flex xl:hidden items-center gap-2">
            <button
              onClick={onOpenConsultation}
              className="px-3 py-1.5 text-xs font-semibold text-white bg-[#0B131E] rounded-md"
            >
              Consult
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-slate-700 hover:text-slate-950 focus:outline-hidden"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Panel */}
      {mobileMenuOpen && (
        <div className="xl:hidden bg-white border-b border-slate-200 px-6 pt-4 pb-6 space-y-4 shadow-xl animate-in slide-in-from-top-2 duration-150">
          <div className="grid grid-cols-2 gap-2 text-xs font-medium text-slate-700">
            <button
              onClick={() => handleNavClick('/')}
              className="text-left px-3 py-2 rounded-md hover:bg-slate-50"
            >
              Home
            </button>
            <button
              onClick={() => handleNavClick('/about')}
              className="text-left px-3 py-2 rounded-md hover:bg-slate-50"
            >
              About Farcon
            </button>
            <button
              onClick={() => handleNavClick('/services')}
              className="text-left px-3 py-2 rounded-md hover:bg-slate-50"
            >
              Services Overview
            </button>
            <button
              onClick={() => handleNavClick('/goals')}
              className="text-left px-3 py-2 rounded-md hover:bg-slate-50"
            >
              Financial Goals
            </button>
            <button
              onClick={() => handleNavClick('/calculators')}
              className="text-left px-3 py-2 rounded-md hover:bg-slate-50"
            >
              Calculators Hub
            </button>
            <button
              onClick={() => handleNavClick('/investor-quiz')}
              className="text-left px-3 py-2 rounded-md hover:bg-slate-50 text-[#7BA238] font-semibold"
            >
              Investor Quiz
            </button>
            <button
              onClick={() => handleNavClick('/wealth-planner')}
              className="text-left px-3 py-2 rounded-md hover:bg-slate-50"
            >
              Wealth Planner Lite
            </button>
            <button
              onClick={() => handleNavClick('/mutual-funds')}
              className="text-left px-3 py-2 rounded-md hover:bg-slate-50"
            >
              Mutual Fund Explorer
            </button>
            <button
              onClick={() => handleNavClick('/education')}
              className="text-left px-3 py-2 rounded-md hover:bg-slate-50"
            >
              Investor Education
            </button>
            <button
              onClick={() => handleNavClick('/portfolio-review')}
              className="text-left px-3 py-2 rounded-md hover:bg-slate-50"
            >
              Portfolio Review
            </button>
          </div>

          <div className="pt-3 border-t border-slate-100 flex flex-col gap-2">
            <button
              onClick={() => handleNavClick('/investor-login')}
              className="w-full text-center py-2.5 text-xs font-medium text-slate-700 bg-slate-100 rounded-md flex items-center justify-center gap-1.5"
            >
              <Lock className="w-3.5 h-3.5" />
              <span>Investor Login</span>
            </button>
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenConsultation();
              }}
              className="w-full text-center py-2.5 text-xs font-semibold text-white bg-[#0B131E] rounded-md shadow-xs"
            >
              Book a Free Consultation
            </button>
          </div>
        </div>
      )}
    </header>
  );
};

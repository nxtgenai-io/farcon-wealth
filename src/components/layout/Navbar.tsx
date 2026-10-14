import React, { useEffect, useState } from 'react';
import { RoutePath } from '@/types';
import { PRIMARY_NAV, SERVICE_LINKS } from '@/content/site/nav';
import { BrandLockup } from '@/components/layout/BrandLockup';
import { ArrowRight, Menu, Search, X } from 'lucide-react';

interface NavbarProps {
  currentPath: string;
  navigate: (path: RoutePath) => void;
  onOpenConsultation: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentPath, navigate, onOpenConsultation }) => {
  const [open, setOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [servicesOpen, setServicesOpen] = useState(false);

  useEffect(() => {
    setOpen(false);
    setSearchOpen(false);
    setServicesOpen(false);
  }, [currentPath]);

  const go = (path: RoutePath) => {
    setOpen(false);
    setSearchOpen(false);
    navigate(path);
  };

  const results = PRIMARY_NAV.filter((item) => item.label.toLowerCase().includes(query.trim().toLowerCase()));

  return (
    <header className="fw-header">
      <div className="fw-header-bar">
        <BrandLockup onClick={() => go('/')} />
        <nav className="fw-nav" aria-label="Primary">
          {PRIMARY_NAV.map((item) =>
            item.href === '/services' ? (
              <div
                key={item.href}
                className="fw-nav-drop"
                onMouseEnter={() => setServicesOpen(true)}
                onMouseLeave={() => setServicesOpen(false)}
              >
                <button
                  type="button"
                  className={currentPath.startsWith('/services') ? 'is-active' : ''}
                  aria-expanded={servicesOpen}
                  onClick={() => go('/services')}
                >
                  Services
                </button>
                {servicesOpen && (
                  <div className="fw-nav-panel">
                    {SERVICE_LINKS.map((link) => (
                      <button key={link.label} type="button" onClick={() => go(link.href)}>
                        {link.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <button
                key={item.href}
                type="button"
                className={currentPath === item.href ? 'is-active' : ''}
                onClick={() => go(item.href)}
              >
                {item.short}
              </button>
            ),
          )}
        </nav>
        <div className="fw-actions">
          <button type="button" className="fw-icon-btn" aria-label="Search pages" onClick={() => setSearchOpen((v) => !v)}>
            <Search size={18} />
          </button>
          <button type="button" className="fw-login" onClick={() => go('/investor-login')}>
            Investor Login
          </button>
          <button type="button" className="fw-book" onClick={onOpenConsultation}>
            Book a Consultation <ArrowRight size={16} />
          </button>
          <button type="button" className="fw-menu-btn" aria-label="Open menu" onClick={() => setOpen((v) => !v)}>
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>
      {searchOpen && (
        <div className="fw-search">
          <label>
            <span className="hf-note">Search pages</span>
            <input
              autoFocus
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Try calculators, ELSS, contact"
            />
          </label>
          <ul>
            {(query.trim() ? results : PRIMARY_NAV).map((item) => (
              <li key={item.href}>
                <button type="button" onClick={() => go(item.href)}>
                  {item.label}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
      {open && (
        <div className="fw-drawer" aria-label="Mobile">
          {PRIMARY_NAV.map((item) => (
            <button key={item.href} type="button" className={currentPath === item.href ? 'is-active' : ''} onClick={() => go(item.href)}>
              {item.label}
            </button>
          ))}
          <button type="button" onClick={() => go('/investor-login')}>Investor Login</button>
          <button type="button" onClick={() => { setOpen(false); onOpenConsultation(); }}>
            Book a Consultation
          </button>
        </div>
      )}
    </header>
  );
};

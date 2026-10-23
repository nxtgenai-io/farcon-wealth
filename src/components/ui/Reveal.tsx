import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';

interface RevealProps {
  children: React.ReactNode;
  delayMs?: number;
  durationMs?: number;
  className?: string;
  direction?: 'up' | 'down' | 'left' | 'right' | 'none';
  distance?: number;
  threshold?: number;
  as?: React.ElementType;
}

export const Reveal: React.FC<RevealProps & React.HTMLAttributes<HTMLElement>> = ({
  children,
  delayMs = 0,
  durationMs = 480,
  className = '',
  direction = 'up',
  distance = 14,
  threshold = 0.15,
  as: Component = 'div',
  ...rest
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const elementRef = useRef<HTMLElement>(null);

  const showIfNear = () => {
    const el = elementRef.current;
    if (!el) return false;
    const rect = el.getBoundingClientRect();
    const viewHeight = window.innerHeight || document.documentElement.clientHeight;
    return rect.top < viewHeight + 120 && rect.bottom > -40;
  };

  useLayoutEffect(() => {
    if (typeof window === 'undefined') return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches || showIfNear()) {
      setIsVisible(true);
    }
  }, []);

  useEffect(() => {
    if (isVisible) {
      elementRef.current?.querySelectorAll('img').forEach((img) => {
        if (img.loading === 'lazy') img.loading = 'eager';
      });
      return undefined;
    }
    if (typeof window === 'undefined') return undefined;
    const el = elementRef.current;
    if (!el) return undefined;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: Math.min(threshold, 0.08), rootMargin: '120px 0px 120px 0px' }
    );
    observer.observe(el);
    const fallback = window.setTimeout(() => setIsVisible(true), 800);
    return () => {
      observer.disconnect();
      window.clearTimeout(fallback);
    };
  }, [isVisible, threshold]);

  const getTransform = () => {
    if (isVisible) return 'translate3d(0, 0, 0)';
    switch (direction) {
      case 'up':
        return `translate3d(0, ${distance}px, 0)`;
      case 'down':
        return `translate3d(0, -${distance}px, 0)`;
      case 'left':
        return `translate3d(${distance}px, 0, 0)`;
      case 'right':
        return `translate3d(-${distance}px, 0, 0)`;
      case 'none':
      default:
        return 'translate3d(0, 0, 0)';
    }
  };

  return (
    <Component
      ref={elementRef}
      {...rest}
      className={`${className} rise-host${isVisible ? ' is-in' : ''}`.trim()}
      style={{
        opacity: isVisible ? 1 : 0,
        transform: getTransform(),
        transitionProperty: 'opacity, transform',
        transitionDuration: `${durationMs}ms`,
        transitionDelay: `${delayMs}ms`,
        transitionTimingFunction: 'ease-out',
      }}
    >
      {children}
    </Component>
  );
};

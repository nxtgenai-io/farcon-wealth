import React from 'react';

interface FarconLogoProps {
  variant?: 'full' | 'horizontal' | 'mark' | 'compact';
  theme?: 'dark' | 'light' | 'auto';
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

export const FarconLogo: React.FC<FarconLogoProps> = ({
  variant = 'horizontal',
  theme = 'auto',
  className = '',
  size = 'md',
}) => {
  // Sizing dimensions for the actual SVG image assets
  const heightClasses = {
    sm: variant === 'horizontal' ? 'h-8 sm:h-9' : 'h-24 sm:h-28',
    md: variant === 'horizontal' ? 'h-9 sm:h-11' : 'h-32 sm:h-36',
    lg: variant === 'horizontal' ? 'h-11 sm:h-14' : 'h-40 sm:h-48',
    xl: variant === 'horizontal' ? 'h-14 sm:h-18' : 'h-52 sm:h-60',
  }[size];

  // Horizontal variant (Primary Navbar lockup with Stag and Typography)
  if (variant === 'horizontal') {
    return (
      <div className={`inline-flex items-center select-none ${heightClasses} ${className}`}>
        <img
          src="/farcon-horizontal.svg"
          alt="Farcon Wealth - AMFI Registered MF Distributor ARN: 229006"
          className="h-full w-auto object-contain block select-none pointer-events-none"
          loading="eager"
        />
      </div>
    );
  }

  // Full stacked brand mark matching the exact uploaded identity logo
  if (variant === 'full') {
    return (
      <div className={`flex flex-col items-center select-none ${heightClasses} ${className}`}>
        <img
          src="/logo-hd-new.svg"
          alt="Farcon Wealth - AMFI Registered MF Distributor ARN: 229006"
          className="h-full w-auto object-contain block select-none pointer-events-none"
          loading="eager"
        />
      </div>
    );
  }

  // Mark only
  if (variant === 'mark') {
    return (
      <div className={`inline-flex items-center justify-center ${heightClasses} ${className}`}>
        <img
          src="/farcon-horizontal.svg"
          alt="Farcon Wealth"
          className="h-full w-auto object-contain block select-none pointer-events-none"
          style={{ clipPath: 'inset(0 68% 0 0)' }}
          loading="eager"
        />
      </div>
    );
  }

  // Compact variant
  return (
    <div className={`inline-flex items-center select-none h-8 ${className}`}>
      <img
        src="/farcon-horizontal.svg"
        alt="Farcon Wealth"
        className="h-full w-auto object-contain block select-none pointer-events-none"
        loading="eager"
      />
    </div>
  );
};

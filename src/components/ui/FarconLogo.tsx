import React from 'react';

interface FarconLogoProps {
  variant?: 'full' | 'horizontal' | 'mark' | 'compact';
  theme?: 'dark' | 'light' | 'auto';
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

export const FarconLogo: React.FC<FarconLogoProps> = ({
  variant = 'horizontal',
  className = '',
  size = 'md',
}) => {
  const heightClasses = {
    sm: variant === 'mark' ? 'h-10' : 'h-9',
    md: variant === 'mark' ? 'h-12' : 'h-12',
    lg: variant === 'mark' ? 'h-16' : 'h-14',
    xl: variant === 'mark' ? 'h-24' : 'h-16',
  }[size];

  if (variant === 'mark') {
    return (
      <div className={`inline-flex items-center justify-center ${heightClasses} ${className}`}>
        <img
          src="/brand/farcon-stag.png"
          alt="Farcon Wealth"
          className="h-full w-auto object-contain block select-none pointer-events-none"
          width={512}
          height={512}
        />
      </div>
    );
  }

  return (
    <div className={`inline-flex items-center select-none ${heightClasses} ${className}`}>
      <picture>
        <source type="image/webp" srcSet="/brand/farcon-lockup-1x.webp 1x, /brand/farcon-lockup-2x.webp 2x" />
        <img
          src="/brand/farcon-lockup-1x.png"
          srcSet="/brand/farcon-lockup-1x.png 1x, /brand/farcon-lockup-2x.png 2x"
          alt="Farcon Wealth"
          className="h-full w-auto object-contain block select-none pointer-events-none"
          width={163}
          height={64}
        />
      </picture>
    </div>
  );
};

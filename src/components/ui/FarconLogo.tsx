import React from 'react';

interface FarconLogoProps {
  variant?: 'full' | 'horizontal' | 'mark' | 'compact';
  theme?: 'dark' | 'light' | 'auto';
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

export const FarconLogo: React.FC<FarconLogoProps> = ({
  variant = 'full',
  theme = 'auto',
  className = '',
  size = 'md',
}) => {
  const isDark = theme === 'dark';

  const heightClasses = {
    sm: variant === 'mark' ? 'h-7' : 'h-10',
    md: variant === 'mark' ? 'h-9' : 'h-12',
    lg: variant === 'mark' ? 'h-12' : 'h-16',
    xl: variant === 'mark' ? 'h-16' : 'h-20',
  }[size];

  if (variant === 'mark') {
    return (
      <div className={`inline-flex items-center justify-center ${heightClasses} ${className}`}>
        <img
          src="/brand/farcon-official-stag.png"
          alt="Farcon Wealth"
          className="h-full w-auto object-contain block select-none pointer-events-none"
          width={456}
          height={400}
        />
      </div>
    );
  }

  if (variant === 'horizontal' || variant === 'compact') {
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
  }

  return (
    <div className={`inline-flex flex-col items-center justify-center text-center select-none ${heightClasses} ${className}`}>
      <img
        src="/brand/farcon-official-stag.png"
        alt=""
        className="h-3/5 w-auto object-contain block select-none pointer-events-none"
        width={456}
        height={400}
      />
      <img
        src="/brand/farcon-official-wordmark.png"
        alt="Farcon Wealth"
        className="h-2/5 w-auto object-contain block select-none pointer-events-none mt-0.5"
        width={459}
        height={172}
      />
    </div>
  );
};

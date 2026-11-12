import React from 'react';

interface FarconLogoProps {
  variant?: 'full' | 'horizontal' | 'mark' | 'compact';
  theme?: 'dark' | 'light' | 'auto';
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

export const FarconLogo: React.FC<FarconLogoProps> = ({
  variant = 'full',
  className = '',
  size = 'md',
}) => {
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
    <div className={`inline-flex flex-col items-center justify-center text-center select-none ${heightClasses} ${className}`}>
      <img
        src="/brand/farcon-stag.png"
        alt=""
        className="h-3/5 w-auto object-contain block select-none pointer-events-none"
        width={512}
        height={512}
      />
      <span className="font-sans font-bold text-xs tracking-tight text-[#0F3D2E] leading-none mt-1">
        Farcon Wealth
      </span>
    </div>
  );
};

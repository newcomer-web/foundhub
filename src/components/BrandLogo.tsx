import React from 'react';

interface BrandLogoProps {
  className?: string;
  size?: number;
}

export default function BrandLogo({ className = 'w-9 h-9', size = 36 }: BrandLogoProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 36 36"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Brand Emerald Container */}
      <rect width="36" height="36" rx="10" fill="#059669" />

      {/* Location Pin Shape */}
      <path
        d="M18 7.5C13.58 7.5 10 11.08 10 15.5C10 21.2 17.2 27.5 17.65 27.9C17.85 28.05 18.15 28.05 18.35 27.9C18.8 27.5 26 21.2 26 15.5C26 11.08 22.42 7.5 18 7.5Z"
        fill="white"
      />

      {/* Search Lens Cutout */}
      <circle cx="18" cy="15" r="4" fill="#059669" />

      {/* Magnifier Lens Handle */}
      <path
        d="M21 18L24.5 21.5"
        stroke="white"
        strokeWidth="2.2"
        strokeLinecap="round"
      />
    </svg>
  );
}

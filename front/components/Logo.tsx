import React from 'react';

interface LogoProps {
  size?: number;
  className?: string;
}

export const Logo: React.FC<LogoProps> = ({ size = 40, className }) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="Houjin Align ロゴ"
    >
      {/* 背景の円 */}
      <circle cx="24" cy="24" r="22" fill="#0070f3" opacity="0.1" />
      
      {/* 書類/ドキュメントのアイコン */}
      <rect
        x="12"
        y="10"
        width="20"
        height="26"
        rx="2"
        fill="#0070f3"
        stroke="#0070f3"
        strokeWidth="1.5"
      />
      
      {/* 書類の折り返し部分 */}
      <path
        d="M12 14 L18 14 L18 12 L20 12 L20 10 L12 10 Z"
        fill="#0051cc"
      />
      
      {/* チェックマーク */}
      <path
        d="M18 22 L21 25 L30 16"
        stroke="white"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
      
      {/* 整列を表す線（Alignの意味） */}
      <line
        x1="16"
        y1="30"
        x2="28"
        y2="30"
        stroke="white"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <line
        x1="16"
        y1="33"
        x2="24"
        y2="33"
        stroke="white"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
};

export default Logo;


'use client'
import React, { ReactNode, RefObject } from 'react';

interface ScrollFloatProps {
  children: ReactNode;
  scrollContainerRef?: RefObject<HTMLElement>;
  containerClassName?: string;
  textClassName?: string;
  animationDuration?: number;
  ease?: string;
  scrollStart?: string;
  scrollEnd?: string;
  stagger?: number;
}

const ScrollFloat: React.FC<ScrollFloatProps> = ({
  children,
  containerClassName = '',
  textClassName = '',
}) => {
  return (
    <h2 className={`my-5 ${containerClassName}`}>
      <span className={`inline-block text-[clamp(1.6rem,4vw,3rem)] leading-[1.5] ${textClassName}`}>
        {children}
      </span>
    </h2>
  );
};

export default ScrollFloat;

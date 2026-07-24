"use client";

import React, { ReactNode, useRef, useState, useLayoutEffect } from "react";
import { PaperSize } from "@/types/resume";

interface Props {
  children: ReactNode;
  padding?: string;
  paperSize?: PaperSize;
  fitToOnePage?: boolean;
}

export const PAPER_DIMENSIONS: Record<
  PaperSize,
  { width: number; height: number; name: string }
> = {
  a4: { width: 794, height: 1123, name: "A4 Standard" },
  letter: { width: 816, height: 1056, name: "US Letter" },
  legal: { width: 816, height: 1344, name: "US Legal" },
  a3: { width: 1123, height: 1587, name: "A3 Poster" },
  executive: { width: 696, height: 1010, name: "Executive" },
};

export default function A4Container({
  children,
  padding,
  paperSize = "a4",
  fitToOnePage = false,
}: Props) {
  const contentRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);

  const dimensions = PAPER_DIMENSIONS[paperSize] || PAPER_DIMENSIONS.a4;

  useLayoutEffect(() => {
    if (!fitToOnePage || !contentRef.current) {
      setScale(1);
      return;
    }

    const contentHeight = contentRef.current.scrollHeight;
    const targetHeight = dimensions.height;

    if (contentHeight > targetHeight) {
      const calculatedScale = Math.max(0.68, targetHeight / (contentHeight + 20));
      setScale(calculatedScale);
    } else {
      setScale(1);
    }
  }, [children, fitToOnePage, paperSize, dimensions.height]);

  return (
    <div
      className="bg-white shadow-2xl transition-all duration-300 relative box-border mx-auto print:shadow-none print:m-0"
      style={{
        width: `${dimensions.width}px`,
        minHeight: `${dimensions.height}px`,
        maxHeight: fitToOnePage ? `${dimensions.height}px` : "none",
        overflow: fitToOnePage ? "hidden" : "visible",
        padding: padding || "32px",
      }}
    >
      <div
        ref={contentRef}
        className="w-full origin-top transition-transform duration-300"
        style={{
          transform: fitToOnePage && scale < 1 ? `scale(${scale})` : "none",
        }}
      >
        {children}
      </div>
    </div>
  );
}
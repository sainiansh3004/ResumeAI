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
  const containerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);

  const dimensions = PAPER_DIMENSIONS[paperSize] || PAPER_DIMENSIONS.a4;

  useLayoutEffect(() => {
    if (!fitToOnePage || !contentRef.current) {
      setScale(1);
      return;
    }

    // Force unscaled height check
    const inner = contentRef.current;
    const currentTransform = inner.style.transform;
    const currentZoom = (inner.style as any).zoom;
    inner.style.transform = "none";
    (inner.style as any).zoom = "1";

    const contentHeight = inner.scrollHeight || inner.offsetHeight;
    const targetHeight = dimensions.height - (padding ? parseInt(padding, 10) * 2 : 48);

    inner.style.transform = currentTransform;
    (inner.style as any).zoom = currentZoom;

    if (contentHeight > targetHeight) {
      const calculatedScale = Math.min(1, targetHeight / (contentHeight + 5));
      setScale(calculatedScale);
    } else {
      setScale(1);
    }
  }, [children, fitToOnePage, paperSize, dimensions.height, padding]);

  return (
    <div
      ref={containerRef}
      className={`bg-white shadow-2xl transition-all duration-300 relative box-border mx-auto print:shadow-none print:m-0 ${
        fitToOnePage ? "fit-one-page-print" : ""
      }`}
      style={{
        width: `${dimensions.width}px`,
        minHeight: `${dimensions.height}px`,
        maxHeight: fitToOnePage ? `${dimensions.height}px` : "none",
        height: fitToOnePage ? `${dimensions.height}px` : "auto",
        overflow: "hidden",
        padding: padding || "24px",
      }}
    >
      <div
        ref={contentRef}
        className={`w-full origin-top transition-all duration-300 ${
          fitToOnePage ? "one-page-condensed" : ""
        }`}
        style={{
          ...(fitToOnePage && scale < 1
            ? {
                zoom: scale,
                transform: `scale(${scale})`,
                transformOrigin: "top center",
              }
            : {}),
        }}
      >
        {children}
      </div>
    </div>
  );
}
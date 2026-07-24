"use client";

import { ReactNode } from "react";

interface Props {
  children: ReactNode;
  padding?: string;
  fitToOnePage?: boolean;
}

export default function A4Container({ children, padding, fitToOnePage }: Props) {
  return (
    <div
      className={`
        w-[794px]
        ${fitToOnePage ? "h-[1123px] overflow-hidden" : "min-h-[1123px]"}
        bg-white
        shadow-xl
        transition-all
        duration-200
        box-border
      `}
      style={{ padding: padding || "24px" }}
    >
      {children}
    </div>
  );
}
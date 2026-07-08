"use client";

import { ReactNode } from "react";

interface Props {
  children: ReactNode;
  padding?: string;
}

export default function A4Container({ children, padding }: Props) {
  return (
    <div
      className="
        w-[794px]
        min-h-[1123px]
        bg-white
      "
      style={{ padding: padding || "24px" }}
    >
      {children}
    </div>
  );
}
"use client";

import { ReactNode } from "react";

interface Props {
  children: ReactNode;
}

export default function A4Container({ children }: Props) {
  return (
    <div
      className="
        w-[794px]
        min-h-[1123px]
        bg-white
        p-6
      "
    >
      {children}
    </div>
  );
}
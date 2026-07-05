"use client";

import { ReactNode } from "react";

interface Props {
  children: ReactNode;
}

export default function A4Container({ children }: Props) {
  return (
    <div className="flex justify-center py-10">
      <div
        className="
          bg-white
          shadow-2xl
          w-[794px]
          min-h-[1123px]
          p-12
          rounded-md
        "
      >
        {children}
      </div>
    </div>
  );
}
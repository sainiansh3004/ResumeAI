"use client";

import { CSS } from "@dnd-kit/utilities";
import { useSortable } from "@dnd-kit/sortable";

interface DraggableSectionProps {
  id: string;
  title: string;
}

export default function DraggableSection({
  id,
  title,
}: DraggableSectionProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`mb-3 flex cursor-grab items-center justify-between rounded-lg border bg-white px-4 py-3 shadow-sm transition ${
        isDragging
          ? "opacity-50 shadow-lg"
          : "hover:border-blue-400 hover:shadow-md"
      }`}
    >
      <div className="flex items-center gap-3">
        <span
          {...attributes}
          {...listeners}
          className="cursor-grab text-xl text-gray-500 active:cursor-grabbing"
        >
          ☰
        </span>

        <span className="font-medium text-gray-700">{title}</span>
      </div>
    </div>
  );
}
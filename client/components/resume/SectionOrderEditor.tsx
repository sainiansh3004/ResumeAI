"use client";

import React from "react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical, Eye, EyeOff } from "lucide-react";
import { SectionType } from "@/types/resume";

interface SortableItemProps {
  id: string;
  title: string;
  isHidden: boolean;
  onToggleVisibility: (id: string) => void;
  onTitleChange: (id: string, newTitle: string) => void;
}

function SortableItem({
  id,
  title,
  isHidden,
  onToggleVisibility,
  onTitleChange,
}: SortableItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 50 : "auto",
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`flex items-center gap-3 bg-white p-3 rounded-lg border border-gray-200 shadow-sm transition hover:border-gray-300 ${
        isDragging ? "opacity-70 border-blue-500" : ""
      }`}
    >
      <div {...attributes} {...listeners} className="cursor-grab text-gray-400 hover:text-gray-600 p-1">
        <GripVertical className="h-4 w-4" />
      </div>

      <div className="flex-1">
        <input
          type="text"
          value={title}
          onChange={(e) => onTitleChange(id, e.target.value)}
          className={`w-full font-medium text-sm text-gray-700 bg-transparent border-b border-transparent hover:border-gray-200 focus:border-blue-500 focus:outline-none py-0.5 px-1 rounded transition ${
            isHidden ? "line-through text-gray-400" : ""
          }`}
        />
      </div>

      <button
        type="button"
        onClick={() => onToggleVisibility(id)}
        className={`p-1.5 rounded-lg border transition cursor-pointer ${
          isHidden
            ? "border-gray-200 bg-gray-50 text-gray-400 hover:text-gray-600"
            : "border-blue-100 bg-blue-50 text-blue-600 hover:bg-blue-100"
        }`}
      >
        {isHidden ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
      </button>
    </div>
  );
}

const getDefaultTitle = (key: string): string => {
  switch (key) {
    case "summary": return "Professional Summary";
    case "education": return "Education";
    case "experience": return "Experience";
    case "skills": return "Skills";
    case "projects": return "Projects";
    case "certifications": return "Certifications";
    case "achievements": return "Achievements";
    case "languages": return "Languages";
    case "interests": return "Interests";
    default: return key.charAt(0).toUpperCase() + key.slice(1);
  }
};

interface SectionOrderEditorProps {
  sectionOrder: SectionType[];
  hiddenSections?: string[];
  customTitles?: Record<string, string>;
  onSectionOrderChange: (newOrder: SectionType[]) => void;
  onHiddenSectionsChange: (hidden: string[]) => void;
  onCustomTitlesChange: (titles: Record<string, string>) => void;
}

export default function SectionOrderEditor({
  sectionOrder,
  hiddenSections = [],
  customTitles = {},
  onSectionOrderChange,
  onHiddenSectionsChange,
  onCustomTitlesChange,
}: SectionOrderEditorProps) {
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      const oldIndex = sectionOrder.indexOf(active.id as SectionType);
      const newIndex = sectionOrder.indexOf(over.id as SectionType);
      onSectionOrderChange(arrayMove(sectionOrder, oldIndex, newIndex));
    }
  };

  const handleToggleVisibility = (id: string) => {
    if (hiddenSections.includes(id)) {
      onHiddenSectionsChange(hiddenSections.filter((s) => s !== id));
    } else {
      onHiddenSectionsChange([...hiddenSections, id]);
    }
  };

  const handleTitleChange = (id: string, newTitle: string) => {
    onCustomTitlesChange({
      ...customTitles,
      [id]: newTitle,
    });
  };

  return (
    <div className="bg-gray-50 border border-gray-100 rounded-xl p-5 mb-6">
      <h3 className="text-sm font-bold text-gray-700 mb-4 uppercase tracking-wider">
        Layout Settings & Section Order
      </h3>
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={sectionOrder}
          strategy={verticalListSortingStrategy}
        >
          <div className="flex flex-col gap-2">
            {sectionOrder.map((sectionId) => (
              <SortableItem
                key={sectionId}
                id={sectionId}
                title={customTitles[sectionId] || getDefaultTitle(sectionId)}
                isHidden={hiddenSections.includes(sectionId)}
                onToggleVisibility={handleToggleVisibility}
                onTitleChange={handleTitleChange}
              />
            ))}
          </div>
        </SortableContext>
      </DndContext>
    </div>
  );
}

"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Todo, Priority } from "@/types";
import { MdEdit, MdDelete } from "react-icons/md";
import { BiSolidDashboard } from "react-icons/bi";

interface SortableTodoItemProps {
  todo: Todo;
  onToggleComplete: (todo: Todo) => void;
  onEdit: (todo: Todo) => void;
  onDelete: (id: number) => void;
  getPriorityColor: (priority: Priority) => string;
}

export function SortableTodoItem({
  todo,
  onToggleComplete,
  onEdit,
  onDelete,
  getPriorityColor,
}: SortableTodoItemProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: todo.id,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const getPriorityTextColor = () => {
    switch (todo.priority) {
      case "extreme":
        return "text-[#FF0000]";
      case "moderate":
        return "text-[#00C853]";
      case "low":
        return "text-[#FFB800]";
      default:
        return "text-gray-600";
    }
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow cursor-grab active:cursor-grabbing"
    >
      {/* Header: Title and Priority */}
      <div className="flex items-start justify-between mb-3">
        <h3 className="font-medium text-[16px] text-[#0D224A] flex-1 pr-2">
          {todo.title}
        </h3>
        <div className="flex items-center space-x-1">
          <span className={`text-sm font-normal ${getPriorityTextColor()} text-white`}>
            {todo.priority.charAt(0).toUpperCase() + todo.priority.slice(1)}
          </span>
          <button
            className="text-gray-400 hover:text-gray-600"
            onPointerDown={(e) => e.stopPropagation()}
          >
            <BiSolidDashboard className="w-4 h-4 text-[#8ca3cd]" />
          </button>
        </div>
      </div>

      {/* Description */}
      <p className="font-normal text-[14px] text-[#4B5563] mb-4 line-clamp-2">
        {todo.description}
      </p>

      {/* Footer: Due Date and Actions */}
      <div className="flex items-center justify-between">
        <span className="font-normal text-[14px] text-[#4B5563]">
          Due {new Date(todo.todo_date).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
          })}
        </span>

        <div className="flex items-center space-x-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onEdit(todo);
            }}
            onPointerDown={(e) => e.stopPropagation()}
            className="p-2 bg-[#EEF7FF] text-[#4F46E5] hover:bg-blue-100 rounded-lg transition-colors w-[32px] h-[32px]"
          >
            <MdEdit className="w-4 h-4" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete(todo.id);
            }}
            onPointerDown={(e) => e.stopPropagation()}
            className="p-2 bg-[#FFE5E5] text-[#DC2626] hover:bg-red-100 rounded-lg transition-colors  w-[32px] h-[32px]"
          >
            <MdDelete className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

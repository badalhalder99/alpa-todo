"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Todo, Priority } from "@/types";
import { MdDragIndicator, MdEdit, MdDelete } from "react-icons/md";

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

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="bg-white rounded-lg shadow-sm border border-gray-200 p-3 sm:p-4 lg:p-6 hover:shadow-md transition-shadow"
    >
      <div className="flex items-start space-x-2 sm:space-x-3 lg:space-x-4">
        {/* Drag Handle */}
        <div
          {...attributes}
          {...listeners}
          className="cursor-move text-gray-400 hover:text-gray-600 mt-1 hidden sm:block"
        >
          <MdDragIndicator className="w-5 h-5 sm:w-6 sm:h-6" />
        </div>

        {/* Checkbox */}
        <input
          type="checkbox"
          checked={todo.is_completed}
          onChange={() => onToggleComplete(todo)}
          className="w-4 h-4 sm:w-5 sm:h-5 mt-1 text-blue-600 border-gray-300 rounded focus:ring-blue-500 cursor-pointer flex-shrink-0"
        />

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex flex-col sm:flex-row sm:items-start justify-between mb-2 gap-2">
            <h3
              className={`text-base sm:text-lg font-semibold break-words ${
                todo.is_completed ? "line-through text-gray-400" : "text-gray-800"
              }`}
            >
              {todo.title}
            </h3>
            <span
              className={`px-2 sm:px-3 py-1 rounded-full text-xs font-medium self-start ${getPriorityColor(
                todo.priority
              )}`}
            >
              {todo.priority.charAt(0).toUpperCase() + todo.priority.slice(1)}
            </span>
          </div>

          <p
            className={`text-xs sm:text-sm mb-3 break-words ${
              todo.is_completed ? "line-through text-gray-400" : "text-gray-600"
            }`}
          >
            {todo.description}
          </p>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-0">
            <span className="text-xs sm:text-sm text-gray-500">
              Due {new Date(todo.todo_date).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
              })}
            </span>

            <div className="flex items-center space-x-1 sm:space-x-2">
              <button
                onClick={() => onEdit(todo)}
                className="p-1.5 sm:p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
              >
                <MdEdit className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
              <button
                onClick={() => onDelete(todo.id)}
                className="p-1.5 sm:p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              >
                <MdDelete className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

"use client";

import { useState, useEffect, useRef } from "react";
import { todoAPI } from "@/lib/api";
import { Todo, TodoFilters, Priority } from "@/types";
import { MdAdd } from "react-icons/md";
import Image from "next/image";
import { TbArrowsDownUp } from "react-icons/tb";
import { IoSearchOutline } from "react-icons/io5";
import TodoModal from "@/components/TodoModal";
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
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { SortableTodoItem } from "@/components/SortableTodoItem";

export default function TodosPage() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTodo, setEditingTodo] = useState<Todo | null>(null);
  const [filterPriority, setFilterPriority] = useState<Priority | "">("");
  const [isFilterDropdownOpen, setIsFilterDropdownOpen] = useState(false);
  const [dateFilters, setDateFilters] = useState({
    deadlineToday: false,
    expiresIn5Days: false,
    expiresIn10Days: false,
    expiresIn30Days: false,
  });
  const filterDropdownRef = useRef<HTMLDivElement>(null);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const fetchTodos = async () => {
    setIsLoading(true);
    try {
      const filters: TodoFilters = {};
      if (searchTerm) filters.search = searchTerm;
      if (filterPriority) filters.priority = filterPriority;

      // Handle date filters
      // Note: This is a simplified version - you may need to adjust based on your API
      // If you need to implement actual date range filtering, you'll need to update your API accordingly

      const response = await todoAPI.getTodos(filters);
      setTodos(response.results);
    } catch (error) {
      console.error("Failed to fetch todos:", error);
      const apiError = error as { response?: { data?: { detail?: string } }; message?: string };
      const errorMessage = apiError.response?.data?.detail || apiError.message || "Failed to fetch todos";
      alert(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchTodos();
    }, 300);

    return () => clearTimeout(delayDebounceFn);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchTerm, filterPriority, dateFilters]);

  // Handle click outside to close filter dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (filterDropdownRef.current && !filterDropdownRef.current.contains(event.target as Node)) {
        setIsFilterDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = todos.findIndex((todo) => todo.id === active.id);
      const newIndex = todos.findIndex((todo) => todo.id === over.id);

      const newTodos = arrayMove(todos, oldIndex, newIndex);
      setTodos(newTodos);

      // Update positions on server
      try {
        const movedTodo = newTodos[newIndex];
        await todoAPI.updateTodo(movedTodo.id, { position: newIndex + 1 });
      } catch {
        alert("Failed to update position");
        fetchTodos(); // Revert on error
      }
    }
  };

  const handleDelete = async (id: number) => {
    if (confirm("Are you sure you want to delete this todo?")) {
      try {
        await todoAPI.deleteTodo(id);
        alert("Todo deleted successfully");
        fetchTodos();
      } catch {
        alert("Failed to delete todo");
      }
    }
  };

  const handleToggleComplete = async (todo: Todo) => {
    try {
      await todoAPI.updateTodo(todo.id, { is_completed: !todo.is_completed });
      fetchTodos();
    } catch {
      alert("Failed to update todo");
    }
  };

  const handleEdit = (todo: Todo) => {
    setEditingTodo(todo);
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setEditingTodo(null);
    fetchTodos();
  };

  const getPriorityColor = (priority: Priority) => {
    switch (priority) {
      case "extreme":
        return "bg-red-100 text-red-600";
      case "moderate":
        return "bg-green-100 text-green-600";
      case "low":
        return "bg-yellow-100 text-yellow-600";
      default:
        return "bg-gray-100 text-gray-600";
    }
  };

   return (
      <div className="w-full mx-auto">
         <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 sm:mb-8 gap-4">
            <div>
               <h1 className="font-bold text-[24px] sm:text-[36px] text-[#0D224A] mb-[2px]">Todos</h1>
               <hr className="w-[68px] h-[2px] bg-[#5272FF]"/>
            </div>
            <button
               onClick={() => setIsModalOpen(true)}
               className="w-full sm:w-[134px] h-[42px] bg-[#5272FF] text-white px-2 sm:px-2 py-3 rounded-[8px] hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2"
            >
               <MdAdd className="w-5 h-5" />
               <span className="font-normal text-[16px] text-[#fff]">New Task</span>
            </button>
         </div>

         {/* Search and Filters */}
         <div className="mb-[24px]">
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center space-y-3 sm:space-y-0 sm:space-x-4">
               <div className="flex-1 relative">
                  <input
                     type="text"
                     name="text"
                     placeholder="Search your task here..."
                     value={searchTerm}
                     onChange={(e) => setSearchTerm(e.target.value)}
                     className="w-full pl-5 pr-0 py-3 border border-[#D1D5DB] rounded-[8px] focus:outline-none focus:ring-2 focus:ring-blue-500 h-[36px] font-semibold text-[12px] text-[#4B5563]"
                  />
                  <button className="bg-[#5272FF] h-[36px] w-[36px] text-[#fff] rounded-[8px] flex items-center justify-center absolute right-0 top-1/2 -translate-y-1/2">
                     <IoSearchOutline className="w-5 h-5 text-[#fff]" />
                  </button>
               </div>

               <div className="relative w-full sm:w-auto" ref={filterDropdownRef}>
                  <button
                     onClick={() => setIsFilterDropdownOpen(!isFilterDropdownOpen)}
                     className="w-full sm:w-auto px-4 py-3 border border-[#D1D5DB] rounded-[8px] hover:bg-gray-50 flex items-center justify-between space-x-2 bg-white h-[40px]"
                  >
                     <span className="font-normal text-[16px] text-[#000]">Filter By</span>
                     <TbArrowsDownUp className="w-4 h-4 text-[#201F1E]" />
                  </button>

                  {/* Date Filter Dropdown */}
                  {isFilterDropdownOpen && (
                     <div className="absolute top-full right-0 mt-2 w-[180px] bg-white border border-gray-300 rounded-lg z-10 p-4" style={{boxShadow: "0px 3px 6px 0px #00000029"}}>
                        <p className="font-normal text-[12px] text-[#4B5563] mb-2">Date</p>
                        <hr className="w-full h-[1px] bg-[#00000040] mb-2" />

                        <div className="space-y-2">
                           <label className="flex items-center">
                              <input
                                 type="checkbox"
                                 checked={dateFilters.deadlineToday}
                                 onChange={(e) => setDateFilters({ ...dateFilters, deadlineToday: e.target.checked })}
                                 className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                              />
                              <span className="ml-2 font-normal text-[12px] text-[#4B5563]">Deadline Today</span>
                           </label>
                           <label className="flex items-center">
                              <input
                                 type="checkbox"
                                 checked={dateFilters.expiresIn5Days}
                                 onChange={(e) => setDateFilters({ ...dateFilters, expiresIn5Days: e.target.checked })}
                                 className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                              />
                              <span className="ml-2 font-normal text-[12px] text-[#4B5563]">Expires in 5 days</span>
                           </label>
                           <label className="flex items-center">
                              <input
                                 type="checkbox"
                                 checked={dateFilters.expiresIn10Days}
                                 onChange={(e) => setDateFilters({ ...dateFilters, expiresIn10Days: e.target.checked })}
                                 className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                              />
                              <span className="ml-2 font-normal text-[12px] text-[#4B5563]">Expires in 10 days</span>
                           </label>
                           <label className="flex items-center">
                              <input
                                 type="checkbox"
                                 checked={dateFilters.expiresIn30Days}
                                 onChange={(e) => setDateFilters({ ...dateFilters, expiresIn30Days: e.target.checked })}
                                 className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                              />
                              <span className="ml-2 font-normal text-[12px] text-[#4B5563]">Expires in 30 days</span>
                           </label>
                        </div>
                     </div>
                  )}
               </div>
            </div>
         </div>

         {/* Todos List */}
         {isLoading ? (
         <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
         </div>
         ) : todos.length === 0 ? (
         <div className="bg-white rounded-lg shadow-sm p-12 text-center">
             <Image
               src="/images/todo_blank.png"
               alt="todo"
               width={240}
               height={216}
               className="block my-0 mx-auto"
            />
            <h3 className="font-normal text-[24px] text-[#201F1E] mb-2">No todos yet</h3>
            <p className="font-normal text-[16px] text-[#201F1E]">Click &quot;New Task&quot; to create your first todo</p>
         </div>
         ) : (
         <div>
            <h2 className="font-semibold text-[18px] text-[#0C0C0C] mb-4">Your Tasks</h2>
            <DndContext
               sensors={sensors}
               collisionDetection={closestCenter}
               onDragEnd={handleDragEnd}
            >
               <SortableContext items={todos.map((t) => t.id)} strategy={verticalListSortingStrategy}>
               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {todos.map((todo) => (
                     <SortableTodoItem
                     key={todo.id}
                     todo={todo}
                     onToggleComplete={handleToggleComplete}
                     onEdit={handleEdit}
                     onDelete={handleDelete}
                     getPriorityColor={getPriorityColor}
                     />
                  ))}
               </div>
               </SortableContext>
            </DndContext>
         </div>
         )}

         {/* Todo Modal */}
         {isModalOpen && (
         <TodoModal
            isOpen={isModalOpen}
            onClose={handleModalClose}
            todo={editingTodo}
         />
         )}
      </div>
   );
}

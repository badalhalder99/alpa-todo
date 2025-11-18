"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { todoAPI } from "@/lib/api";
import { Todo, TodoCreateRequest, ApiError, Priority } from "@/types";
import {  MdDelete } from "react-icons/md";

interface TodoModalProps {
  isOpen: boolean;
  onClose: () => void;
  todo?: Todo | null;
}

export default function TodoModal({ isOpen, onClose, todo }: TodoModalProps) {
  const [selectedPriority, setSelectedPriority] = useState<Priority>(todo?.priority || "moderate");

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm<TodoCreateRequest>({
    defaultValues: {
      title: todo?.title || "",
      description: todo?.description || "",
      priority: todo?.priority || "moderate",
      todo_date: todo?.todo_date || new Date().toISOString().split("T")[0],
    },
  });

  useEffect(() => {
    if (todo) {
      setSelectedPriority(todo.priority);
      reset({
        title: todo.title,
        description: todo.description,
        priority: todo.priority,
        todo_date: todo.todo_date,
      });
    } else {
      setSelectedPriority("moderate");
    }
  }, [todo, reset]);

  const handlePriorityChange = (priority: Priority) => {
    setSelectedPriority(priority);
    setValue("priority", priority);
  };

  const onSubmit = async (data: TodoCreateRequest) => {
    try {
      if (todo) {
        await todoAPI.updateTodo(todo.id, data);
        alert("Todo updated successfully!");
      } else {
        await todoAPI.createTodo(data);
        alert("Todo created successfully!");
      }
      onClose();
    } catch (error) {
      const apiError = error as ApiError;
      const errorMessage =
        apiError.response?.data?.detail || "Failed to save todo. Please try again.";
      alert(errorMessage);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-4 sm:p-6">
            <div>
               <h2 className="font-semibold text-[16px] text-[#000000]">
                  {todo ? "Edit Task" : "Add New Task"}
                 </h2>
                 <hr className="bg-[#5272FF] h-[2px] w-[67px] mt-1" />
            </div>
            <div>
               <button onClick={onClose} className="font-semibold text-[14px] text-[#000000] hover:text-gray-600">Go Back</button>
               <hr className="bg-[#000] h-[2px] w-[67px] mt-1" />
            </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="p-4 sm:p-6">
          <div className="space-y-4 sm:space-y-6">
            {/* Title */}
            <div>
              <label className="block font-semibold text-[14px] text-[#0C0C0C] mb-[9px]">Title</label>
              <input
                type="text"
                {...register("title", { required: "Title is required" })}
                className="w-full px-4 py-3 border border-[#A1A3AB] rounded-[6px] h-[37px] focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter task title"
              />
              {errors.title && (
                <p className="text-red-500 text-xs mt-1">{errors.title.message}</p>
              )}
            </div>

            {/* Date */}
            <div>
              <label className="block font-semibold text-[14px] text-[#0C0C0C] mb-[9px]">Date</label>
              <div className="relative">
                <input
                  type="date"
                  {...register("todo_date", { required: "Date is required" })}
                  className="w-full px-4 py-3 border border-[#A1A3AB] rounded-[6px] h-[37px] focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                {/* <MdCalendarToday className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" /> */}
              </div>
              {errors.todo_date && (
                <p className="text-red-500 text-xs mt-1">{errors.todo_date.message}</p>
              )}
            </div>

            {/* Priority */}
            <div>
              <label className="block font-semibold text-[14px] text-[#0C0C0C] mb-[9px]">Priority</label>
              <div className="flex flex-col sm:flex-row sm:items-center space-y-3 sm:space-y-0 sm:space-x-6">
                <label className="flex items-center cursor-pointer space-x-2">
                  <div className="w-3 h-3 rounded-full bg-red-500"></div>
                  <span className="font-normal text-[14px] text-[#000]">Extreme</span>
                  <input
                    type="checkbox"
                    checked={selectedPriority === "extreme"}
                    onChange={() => handlePriorityChange("extreme")}
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                </label>

                <label className="flex items-center cursor-pointer space-x-2">
                  <div className="w-3 h-3 rounded-full bg-green-500"></div>
                  <span className="font-normal text-[14px] text-[#000]">Moderate</span>
                  <input
                    type="checkbox"
                    checked={selectedPriority === "moderate"}
                    onChange={() => handlePriorityChange("moderate")}
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                </label>

                <label className="flex items-center cursor-pointer space-x-2">
                  <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                  <span className="font-normal text-[14px] text-[#000]">Low</span>
                  <input
                    type="checkbox"
                    checked={selectedPriority === "low"}
                    onChange={() => handlePriorityChange("low")}
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                </label>
              </div>
            </div>

            {/* Task Description */}
            <div>
              <label className="block font-semibold text-[14px] text-[#0C0C0C] mb-[9px]">
                Task Description
              </label>
              <textarea
                {...register("description", { required: "Description is required" })}
                  rows={6}
                  cols={6}
                className="w-full px-4 py-3 border border-[#A1A3AB] rounded-[6px] focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                placeholder="Start writing here....."
              />
              {errors.description && (
                <p className="text-red-500 text-xs mt-1">{errors.description.message}</p>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-between pt-4">
              <button
                type="submit"
                className="bg-[#5272FF] text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors font-normal text-[16px]"
              >
                Done
              </button>
              {todo && (
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                  }}
                  className="bg-[#FF0000] text-white p-3 rounded-lg hover:bg-red-600 transition-colors flex items-center justify-center w-12 h-12"
                >
                  <MdDelete className="w-6 h-6" />
                </button>
              )}
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

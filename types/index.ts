// Auth Types
export interface LoginRequest {
  email: string;
  password: string;
}

export interface SignupRequest {
  first_name: string;
  last_name: string;
  email: string;
  password: string;
}

export interface AuthResponse {
  access: string;
  refresh: string;
}

export interface User {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  address?: string;
  contact_number?: string;
  birthday?: string;
  profile_image?: string;
}

// Todo Types
export type Priority = "extreme" | "moderate" | "low";

export interface Todo {
  id: number;
  title: string;
  description: string;
  priority: Priority;
  is_completed: boolean;
  position: number;
  todo_date: string;
  created_at: string;
  updated_at: string;
}

export interface TodoCreateRequest {
  title: string;
  description: string;
  priority: Priority;
  todo_date: string;
}

export interface TodoUpdateRequest {
  title?: string;
  description?: string;
  priority?: Priority;
  todo_date?: string;
  is_completed?: boolean;
  position?: number;
}

export interface TodoListResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: Todo[];
}

export interface TodoFilters {
  search?: string;
  todo_date?: string;
  priority?: Priority;
  is_completed?: boolean;
}

// Profile Update
export interface ProfileUpdateRequest {
  first_name?: string;
  last_name?: string;
  address?: string;
  contact_number?: string;
  birthday?: string;
  profile_image?: File;
}

// Change Password
export interface ChangePasswordRequest {
  old_password: string;
  new_password: string;
}

// API Error
export interface ApiError {
  response?: {
    data?: {
      detail?: string;
      [key: string]: unknown;
    };
  };
  message?: string;
}

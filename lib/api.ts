import axiosInstance from "./axios";
import {
  LoginRequest,
  SignupRequest,
  AuthResponse,
  User,
  TodoCreateRequest,
  TodoUpdateRequest,
  TodoListResponse,
  TodoFilters,
  ProfileUpdateRequest,
  ChangePasswordRequest,
  Todo,
} from "@/types";

// Auth APIs
export const authAPI = {
  login: async (data: LoginRequest): Promise<AuthResponse> => {
    const formData = new FormData();
    formData.append("email", data.email);
    formData.append("password", data.password);

    const response = await axiosInstance.post<AuthResponse>("/api/auth/login/", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  },

  signup: async (data: SignupRequest): Promise<User> => {
    const formData = new FormData();
    formData.append("first_name", data.first_name);
    formData.append("last_name", data.last_name);
    formData.append("email", data.email);
    formData.append("password", data.password);

    const response = await axiosInstance.post<User>("/api/users/signup/", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  },
};

// User APIs
export const userAPI = {
  getProfile: async (): Promise<User> => {
    const response = await axiosInstance.get<User>("/api/users/me/");
    return response.data;
  },

  updateProfile: async (data: ProfileUpdateRequest): Promise<User> => {
    const formData = new FormData();

    if (data.first_name) formData.append("first_name", data.first_name);
    if (data.last_name) formData.append("last_name", data.last_name);
    if (data.address) formData.append("address", data.address);
    if (data.contact_number) formData.append("contact_number", data.contact_number);
    if (data.birthday) formData.append("birthday", data.birthday);
    if (data.profile_image) formData.append("profile_image", data.profile_image);

    const response = await axiosInstance.patch<User>("/api/users/me/", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  },

  changePassword: async (data: ChangePasswordRequest): Promise<{ detail: string }> => {
    const formData = new FormData();
    formData.append("old_password", data.old_password);
    formData.append("new_password", data.new_password);

    const response = await axiosInstance.post<{ detail: string }>(
      "/api/users/change-password/",
      formData,
      {
        headers: { "Content-Type": "multipart/form-data" },
      }
    );
    return response.data;
  },
};

// Todo APIs
export const todoAPI = {
  getTodos: async (filters?: TodoFilters): Promise<TodoListResponse> => {
    const params = new URLSearchParams();

    if (filters?.search) params.append("search", filters.search);
    if (filters?.todo_date) params.append("todo_date", filters.todo_date);
    if (filters?.priority) params.append("priority", filters.priority);
    if (filters?.is_completed !== undefined)
      params.append("is_completed", filters.is_completed.toString());

    const response = await axiosInstance.get<TodoListResponse>(
      `/api/todos/?${params.toString()}`
    );
    return response.data;
  },

  createTodo: async (data: TodoCreateRequest): Promise<Todo> => {
    const formData = new FormData();
    formData.append("title", data.title);
    formData.append("description", data.description);
    formData.append("priority", data.priority);
    formData.append("todo_date", data.todo_date);

    const response = await axiosInstance.post<Todo>("/api/todos/", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  },

  updateTodo: async (id: number, data: TodoUpdateRequest): Promise<Todo> => {
    const formData = new FormData();

    if (data.title !== undefined) formData.append("title", data.title);
    if (data.description !== undefined) formData.append("description", data.description);
    if (data.priority !== undefined) formData.append("priority", data.priority);
    if (data.todo_date !== undefined) formData.append("todo_date", data.todo_date);
    if (data.is_completed !== undefined)
      formData.append("is_completed", data.is_completed.toString());
    if (data.position !== undefined) formData.append("position", data.position.toString());

    const response = await axiosInstance.patch<Todo>(`/api/todos/${id}/`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  },

  deleteTodo: async (id: number): Promise<void> => {
    await axiosInstance.delete(`/api/todos/${id}/`);
  },
};

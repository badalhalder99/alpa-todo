# Todo Web Application

### Live link:
https://alpa-todo.vercel.app/

A modern, feature-rich Todo application built with Next.js, TypeScript, and Tailwind CSS.

## Features

- **User Authentication**
  - Sign up with email and password
  - Secure login system
  - JWT token-based authentication

- **Todo Management**
  - Create, read, update, and delete todos
  - Set priority levels (Extreme, Moderate, Low)
  - Mark todos as complete/incomplete
  - Drag and drop to reorder todos
  - Search and filter todos by date and priority
  - Due date tracking

- **User Profile**
  - Update profile information
  - Upload profile picture
  - Manage personal details (address, contact, birthday, bio)

## Tech Stack

- **Framework**: Next.js 15
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Package Manager**: Yarn
- **Form Management**: React Hook Form
- **HTTP Client**: Axios
- **State Management**: React Context API
- **Icons**: React Icons
- **Notifications**: React Toastify
- **Drag and Drop**: @dnd-kit

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- Yarn

### Installation

1. Clone the repository or navigate to the project directory

2. Install dependencies:
   ```bash
   yarn install
   ```

3. Run the development server:
   ```bash
   yarn dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

### Build for Production

```bash
yarn build
yarn start
```

## Project Structure

```
todo-app/
├── app/                      # Next.js app directory
│   ├── dashboard/           # Protected dashboard routes
│   │   ├── profile/        # User profile page
│   │   ├── todos/          # Todo management page
│   │   └── layout.tsx      # Dashboard layout with sidebar
│   ├── login/              # Login page
│   ├── signup/             # Signup page
│   ├── globals.css         # Global styles
│   ├── layout.tsx          # Root layout
│   └── page.tsx            # Home page (redirects to login)
├── components/              # Reusable components
│   ├── ProtectedRoute.tsx  # Route protection wrapper
│   ├── Sidebar.tsx         # Navigation sidebar
│   ├── TodoModal.tsx       # Add/Edit todo modal
│   └── SortableTodoItem.tsx # Draggable todo item
├── contexts/               # React contexts
│   └── AuthContext.tsx     # Authentication state management
├── lib/                    # Utility libraries
│   ├── api.ts             # API service functions
│   └── axios.ts           # Axios instance configuration
├── types/                  # TypeScript type definitions
│   └── index.ts           # All application types
└── public/                # Static assets

```

## API Endpoints

The application connects to the following API:

**Base URL**: `https://todo-app.pioneeralpha.com`

### Authentication
- `POST /api/auth/login/` - User login
- `POST /api/users/signup/` - User registration

### User Management
- `GET /api/users/me/` - Get user profile
- `PATCH /api/users/me/` - Update user profile
- `POST /api/users/change-password/` - Change password

### Todos
- `GET /api/todos/` - Get all todos (with filters)
- `POST /api/todos/` - Create new todo
- `PATCH /api/todos/:id/` - Update todo
- `DELETE /api/todos/:id/` - Delete todo

## Features Breakdown

### Authentication Flow
1. Users sign up with first name, last name, email, and password
2. Password must be at least 6 characters
3. Upon successful signup, users are redirected to login
4. Login provides JWT access and refresh tokens
5. Tokens are stored in localStorage
6. Protected routes check for valid authentication

### Todo Management
- Todos have title, description, priority, due date, and completion status
- Drag and drop reordering updates todo positions
- Search filters todos by title
- Date filter for deadline-based filtering
- Priority filter (Extreme/Moderate/Low)
- Visual priority indicators with color coding
- Checkbox to mark complete/incomplete

### Profile Management
- Upload and display profile pictures
- Update name, address, contact number, birthday, and bio
- Email is read-only (set during registration)
- Image preview before upload

## Design

The application follows the provided Figma design with:
- Clean, modern UI
- Blue color scheme (#4F46E5 primary)
- Responsive layout
- Custom Tailwind breakpoints
- Smooth transitions and hover effects

## License

This project is created for interview purposes.

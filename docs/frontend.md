# Frontend Guide

The frontend is built using React and follows a modular structure.
Data fetching and caching are handled via React Query.
Forms are managed using react-hook-form.

## Project Structure

- `src/api/`: Centralized data fetching layer.
  - `client.ts`: Axios instance with auth interceptors.
  - `hooks/`: Custom React Query hooks organized by domain (Books, Loans, etc.).
- `src/Layouts/`: Contains the UI pages.
  - `Utils/`: Reusable UI components (Spinners, Error displays, Pagination).
- `src/errors/`: Standardized API Error handling logic.
- `src/store/`: Global state management using Zustand.

## Data Flow
The application follows a strict data flow pattern:\
`Component` -> `Custom Hook (React Query)` -> `API Client (Axios)` -> `Backend API`

All API communication is handled inside `/hooks` to keep components clean.

## State Management
Used a **hybrid state management strategy**:

1.  **Server State (React Query)**: Used for all data fetching, caching, and synchronization with the backend. It handles loading states, retries, and data staleness.
2.  **Global UI State (Zustand)**: Used for Authentication (storing tokens and user roles) as a Global State. Zustand was chosen for its simplicity and minimal boilerplate instead of manual state handlings.
3. **Local UI state**: React `useState` hooks.

This ensures that components don't contain data-fetching logic, making them cleanes, easier to test, and maintain.


## Form Handling
- Managed using `react-hook-form` combined with `yub`
- Controlled components (e.g. `react-select`) are wrapped using Controller
- Validations handled at form level

## Error Handling 
-  All API errors are Normalized into single source through `parseApiError.ts` to convert Axios/Server errors into a consistent `ApiError` shape to be reused through whole app for handling different server's failures.

- `sonner` toast is used for immediate feedback on actions (Success/Failure).

-  A React `ErrorBoundary` wraps the entire app to catch unexpected rendering crashes.

- React Query is configured to only retry on 5xx (Server) or Network errors, avoiding redundant calls on 4xx (Client) errors.


## Configuration
The Required secrets, and variables are defined into `.env` file,  
See `.env.example` for required keys (API URL, Stripe, Google Auth).


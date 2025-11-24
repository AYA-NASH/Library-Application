# Full-Stack Library Application
## Overview

This is a practical, hands-on full-stack web application for managing a library system, built using **Spring Boot** (backend) and **React** (frontend).  
It allows users to browse books, view details, and check them out through a clean and user-friendly interface.

## Technologies Used
- **Backend:** Spring Boot, Spring Data JPA, Spring Data REST, Spring Security with JWT  
- **Database:** MySQL  
- **Frontend:** React.js, TypeScript, Bootstrap  
- **Docker**


## Project Structure

### Backend (`spring-boot-library/`)
- `src/main/java/com/luv2code/`  
  - `config/`: Security configuration and Spring Data REST customization.
  - `dao/`: JPA repositories.  
  - `entity/`: Entity classes representing database tables.
  - `requestmodel/`: Request payload classes (e.g., signup, payment).
  - `responsemodel`: Response payload classes (e.g., login response).
  - `service`: Application business logic (books, users, payments).
  - `SpringBootLibraryApplication.java`: Main application entry point.
  - `Dockerfile`: builds the backend container image (multi‑stage Maven → runtime).
  - `wait-for-mysql.sh`: helper that waits for MySQL to be ready (not needed when using compose healthcheck).


### Frontend (`frontend/`)
- `src/Auth/`: Auth context, guards, and helpers.
- `src/layouts/`: Page-level components and layout containers.  
- `src/models/`: TypeScript interfaces for backend entities.  
- `src/App.tsx`: Main routing logic.  
- `src/main.tsx`: Root file for React.
- `Dockerfile`: builds the frontend image (Node build → Nginx serve).
- `nginx.conf`: serves static assets and proxies `/api/*` to the backend.

### Seed Data (`mysql-init/`)
   - MySQL scripts that initialize schema and demo data on first run.
### Docker Compose:
   `docker-compose.yml`: builds and runs MySQL, backend, and frontend; sets env/build args, healthcheck, ports, and mounts seed SQL.

## Features
   - **Browse books** – with pagination, full details, and search/filter by category, author, or title.
   - Explore detailed book information.
   - Enable role-based accesses.
   - **User functionality:**
      - Personal shelf: view all currently checked-out books.
      - History page: track previously borrowed books.
      - Submit reviews and ratings.
      - Contact form: report issues to admins.
   - **Admin functiolaity:**
      - Add, update, and delete books.
      - View and respond to user-reported issues.
   - **Authentication:** Secure login using JWT (email/password + Google Sign-In).
   - **Payments:** Integrate payment functionality via Stripe.

   - **Frontend-backend integration:** SPA frontend fetches data dynamically via Spring Data REST API.

## Getting Started
   Docker is supported in this app to make it easy to run, so to run this app, make sure that your device supports docker.

   From the project root:
   ```
      docker compose up -d
   ```
   Then open:
   - http://localhost:3000

   To reset DB and re-run seeds in `mysql-init/`:
   ```
   docker compose down -v
   docker compose up -d
   ```
   **Note**:
   The app supports Google OAuth and Stripe Payments. These need keys to work. To enable them, set the environment variables as described below.

   ## Secrets and third‑party setup
   - Backend reads sensitive values from environment variables (not hardcoded):
   - GOOGLE_CLIENT_ID / GOOGLE_CLIENT_SECRET (backend)
   - STRIPE_KEY_SECRET (backend)
   - APP_JWT_SECRET (backend, Base64 secret; a demo value is included in docker-compose.yml for local use only)
   - APP_CORS_ALLOWED_ORIGINS (backend, default http://localhost:3000)
   - VITE_STRIPE_PUBLISHABLE_KEY (frontend build arg; compose passes a demo test key)
   - Set them in `docker-compose.yml` under the `backend.environment` section when enabling Google/Stripe or changing JWT.
   - Frontend hides Google login if `VITE_GOOGLE_CLIENT_ID` isn’t provided. Payment pages will return an error if Stripe secret isn’t configured, but the app continues to work otherwise.



## **Future Improvements/Features:**
   - Preview and full reading functionality.  
   - Enhanced user profiles – favorites, reading lists, bookmarks, and reading progress tracking.
   - Notifications – reminders for due dates, overdue books, and new arrivals (email or in-app).  
   - Analytics & admin dashboards – track popular books, user activity, and system usage.
   - Host the app on a cloud server for live deployment. 
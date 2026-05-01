# Full-Stack Library Application

[![Spring Boot](https://img.shields.io/badge/Spring--Boot-3.x-green.svg)](https://spring.io/projects/spring-boot)
[![React](https://img.shields.io/badge/React-18.x-blue.svg)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue.svg)](https://www.typescriptlang.org/)
[![Docker](https://img.shields.io/badge/Docker-Enabled-blue.svg)](https://www.docker.com/)

A full-stack library management application built with React and Spring Boot, focusing on clean architecture, maintainability, and production-oriented practices.

## Overview

This application enables users to browse and borrow books, manage their personal library, preview digital content, and interact through reviews and messaging. Administrators can manage inventory, categories, and user requests.

From a technical perspective, the system follows a layered backend architecture and a modular frontend structure, with secure authentication (JWT, OAuth 2.0) and resilient integration with external services such as Stripe and Cloudinary.

### Tech Stack
- **Frontend**: React, TypeScript, Vite, Zustand (State), React Query (Server State).
- **Backend**: Spring Boot 3, Spring Security (JWT), Spring Data JPA, Hibernate.
- **Resilience**: Resilience4j (Retry/Circuit Breaker).
- **Infrastructure**: Docker & Docker Compose, MySQL, Nginx.

## App Structure
Technical guides are provided for both frontend and backend to explain architecture and data flow:

- [**Frontend Technical Guide**](./docs/frontend.md): Detailed look at React patterns, state management, routing, and the normalized error-handling system.

- [**Backend Technical Guide**](./docs/backend.md): Overview of the Spring Boot architecture, security model, resilience patterns, and API contracts.

## Features:
#### Core Features
- Browse books with pagination, filtering, and search (title, author, category)
- View detailed book information, ratings, and reviews
- Role-based access control
#### User Functionalities 
- Borrow, return, and renew books
- Access book previews and full digital content
- Track loan history
- Submit ratings and reviews
- Contact administrators
#### Admin Functionalities
- Manage books (CRUD operations and inventory tracking)
- Manage categories
- Handle user-reported issues
#### System Capabilities
- Secure authentication using JWT and Google OAuth
- Integration with Stripe (payments) and Cloudinary (media storage)
- Fault-tolerant external communication using Resilience4j

## Getting Started

### Prerequisites
- [Docker Desktop](https://www.docker.com/products/docker-desktop/) installed and running.
- Read the Environment Configuration section to Support System's secrets.

### Quick Start with Docker
The easiest way to run the entire stack (Database, Backend, and Frontend) is via Docker Compose:

1.  **Clone the repository**:
    ```bash
    git clone https://github.com/AYA-NASH/Library-Application.git

    cd Library-Application
    ```
2.  **Launch the stack**:
    ```bash
    docker compose up -d
    ```
3.  **Access the Application**:
    - **Frontend**: [http://localhost:3000](http://localhost:3000)
    - **Backend API**: [http://localhost:8080/api](http://localhost:8080/api)
    - **API Documentation (Swagger)**: [http://localhost:8080/swagger-ui.html](http://localhost:8080/swagger-ui.html)

### Environment Configuration
The application supports external integrations (Google Auth, Stripe, Cloudinary) which require API keys.

### Frontend
Copy the example file and provide your keys:
`cp frontend/.env.example frontend/.env`
- `VITE_API_BASE_URL`: URL of the backend (default: http://localhost:8080/api).
- `VITE_GOOGLE_CLIENT_ID`: Your Google OAuth Client ID.
- `VITE_STRIPE_PUBLISHABLE_KEY`: Your Stripe test public key.

### Backend
Sensitive backend variables also are managed via `.env` file in the root.\
Copy the example file and provide your keys: `cp spring-boot-library/.env.example spring-boot-library/.env`
- `STRIPE_KEY_SECRET`: Your Stripe secret key.
- `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET`: Backend Google OAuth credentials.
- `APP_JWT_SECRET`: Base64 string used to sign JWTs.
- `CLOUDINARY_CLOUD_NAME` / `CLOUDINARY_API_KEY`/ `CLOUDINARY_API_SECRET`: Backend Cloudinary Secrets.

## Future Improvements/Features:
- Enhanced Search – enables search filters combinations, and multi-category search selections.
- Enhanced user profiles – favorites, reading lists, bookmarks, and reading progress tracking.
- Notifications – reminders for Admin responses, due dates, overdue books, and new arrivals (email or in-app).
- Analytics & admin dashboards – track popular books, user activity, and system usage.
- Host the app on a cloud server for live deployment.
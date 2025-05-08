# Full-Stack Library Application
## Overview

This is a practical, hands-on full-stack web application for managing a library system, built using **Spring Boot** (backend) and **React** (frontend).  
It allows users to browse books, view details, and check them out through a clean and user-friendly interface.

## Technologies Used
- **Backend:** Spring Boot, Spring Data JPA, Spring Data REST  
- **Database:** MySQL  
- **Frontend:** React.js, TypeScript, Bootstrap  
- **Other:** Maven, RESTful API, Vite


## Project Structure

### Backend (`spring-boot-library/`)
- `src/main/java/com/luv2code/`  
  - `config/`: Custom Spring Data REST configurations (e.g., exposing IDs, disabling HTTP methods).  
  - `dao/`: JPA repositories.  
  - `entity/`: Entity classes representing database tables.  
  - `SpringBootLibraryApplication.java`: Main application entry point.
  
- `src/main/resources/`  
  - `application.properties`: Configuration for database and REST API.  

- `pom.xml`: Maven build and dependency configuration.

### Frontend (`frontend/`)
- `src/layouts/`: Page-level components and layout containers.  
- `src/models/`: TypeScript interfaces for backend entities.  
- `src/App.tsx`: Main routing logic.  
- `src/main.tsx`: Root file for React.

## Features
 - Browse available books with pagination.
 - Explore detailed book information.
 - Frontend fetching data dynamically from the backend.
 - API built using Spring Data REST with customized configurations.
 - Backend database connected to persist book data.

## Getting Started
### Backend
1. Run MySQL database scripts.
2. Configure `application.properties`:
   ```
   spring.datasource.url=jdbc:mysql://localhost:3306/<your_database>
   spring.datasource.username=<your_username>
   spring.datasource.password=<your_password>

   spring.data.rest.base-path=/api
   
   ```
3. Build and Run the Spring Boot application.

### Fronend
1. Navigate to the frontend directory:
   ```
   cd frontend
   ```
3. Install dependencies:
    ```
   npm install
    ```
5. Start the development server:
   ```
   npm run dev
   ```

## Next Developement Steps:
- Add authentication and authorization (Okta integration).
- Implement book checkout and return functionality.
- Allow users to submit reviews and ratings.
- Add a personal history page for each user.
- Add contact form for messaging admins and reporting issues.
- Secure routes based on user roles (admin vs user).
- Enable admin-specific actions (e.g., adding books).
- Integrate payment functionality via Stripe.

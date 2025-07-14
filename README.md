# Full-Stack Library Application
## Overview

This is a practical, hands-on full-stack web application for managing a library system, built using **Spring Boot** (backend) and **React** (frontend).  
It allows users to browse books, view details, and check them out through a clean and user-friendly interface.

## Technologies Used
- **Backend:** Spring Boot, Spring Data JPA, Spring Data REST, Spring Security with JWT  
- **Database:** MySQL  
- **Frontend:** React.js, TypeScript, Bootstrap  
- **Other:** Maven, RESTful API, Vite


## Project Structure

### Backend (`spring-boot-library/`)
- `src/main/java/com/luv2code/`  
  - `config/`: Security configuration and Spring Data REST customization.
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
 - Secure authentication using JWT tokens (email/password and Google Sign-In supported).

## Getting Started
### Backend
1. Make sure of the following before building:
 - Java SDK 17 is installed and set correctly in your IDE (e.g., IntelliJ).
 - Lombok plugin is enabled and annotation processing is turned on in your IDE.
2. Setup MySQL server, and Create a database and a user with matching credentials.
3. Configure `application.properties`:
   ```
   spring.datasource.url=jdbc:mysql://localhost:3306/<your_database>
   spring.datasource.username=<your_username>
   spring.datasource.password=<your_password>

   spring.data.rest.base-path=/api
   
   ```
4. Build and Run the Spring Boot application.

### Fronend
1. Navigate to the frontend directory:
   ```
   cd frontend
   ```
2. Install dependencies:
   ```
   npm install -D vite
   npm install
   ```
3. Create a `.env` file in the frontend root with the following:
   ```
   VITE_GOOGLE_CLIENT_ID=<google_client_id>
   VITE_API_BASE_URL=<backend_server_host>
   ```
5. Start the development server:
   ```
   npm run dev
   ```

## Next Developement Steps:
- Allow users to submit reviews and ratings.
- Add a personal history page for each user.
- Add contact form for messaging admins and reporting issues.
- Secure routes based on user roles (admin vs user).
- Enable admin-specific actions (e.g., adding books).
- Integrate payment functionality via Stripe.

**Future Improvement:** Host the app on a cloud server for live deployment. 

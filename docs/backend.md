# Backend Guide (Spring Boot)

This document outlines the design patterns, security model, and reliability features of the Library Application backend.

## Architecture
The backend is built to follow a layered architecture:

- `config/`: for system configurations (e.g., Security, JWT, Swagger, ... ).
- `controller/`: Handles HTTP requests and maps them to service methods.
- `service/`: for core business logic.
- `repository/`(DAO) : JPA repositories.
- `entity/`: Entity classes representing database tables.
- `mapper/`: Mapping Layer for Data conversions between Entities and DTOs. 
- `dto/`: Ensures a clear separation between database entities and the data sent over the network.
- `exception/`: Error handling layer for Custom Exceptions, and Global Exception Handling.
- `Dockerfile` : To build the backend container image.

## Error Handling

- Global exception handler ( A global `@ControllerAdvice` )is used to ensure that all failures (including auth errors) return a consistent JSON schema:

```
  {
    timestamp,
    error,
    message,
    status,
    validationErrors
  }

```

## Security Model & Reliability
- Added a JWT filter to Spring Security chain for Authentication, and to support a Role-based access control for protecting sensitive administrative and user-specific endpoints.

- `Resilience4j` is used to handle failures with External Services like `Stripe` and `Cloudinary`, 
  - `Retries` & `Circuir Breaker` mehcanisms are used to control and protect User's Interactions.

-  **Payment Idempotency**: Idemptonecy key checks provided to prevent double-charging or duplicate updates during network retries with Stripe Payments.


## API Documentation
The API is documented using **Swagger/OpenAPI 3**.
- **Access**: When running locally, documentation is available at `/swagger-ui.html`.

## Environment Configuration
The main System features, and properties are all defined in `resources/application.properties` with placeholders, and values based on supported profile, and the `.env` file.

- **MySQL**: Connection details are managed via Docker Compose.
The backend reads sensitive configuration (DB credentials, API secrets) from environment variables.

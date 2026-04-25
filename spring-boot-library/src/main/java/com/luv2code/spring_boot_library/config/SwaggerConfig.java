package com.luv2code.spring_boot_library.config;

import io.swagger.v3.oas.models.Components;
import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.security.SecurityRequirement;
import io.swagger.v3.oas.models.security.SecurityScheme;
import io.swagger.v3.oas.models.servers.Server;
import org.springdoc.core.models.GroupedOpenApi;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.List;

@Configuration
public class SwaggerConfig {
    @Bean
    public GroupedOpenApi accessApi() {
        return GroupedOpenApi.builder()
                .group("Identity & Access")
                .pathsToMatch("/api/login",
                        "/api/register",
                        "/api/google-login")
                .build();
    }

    @Bean
    public GroupedOpenApi bookDiscoveryApi() {
        return GroupedOpenApi.builder()
                .group("Book Discovery")
                .pathsToMatch("/api/books/all",
                        "api/books/{bookId}",
                        "api/search/**")
                .build();
    }

    @Bean
    public GroupedOpenApi shelfApi(){
        return  GroupedOpenApi.builder()
                .group("Borrowing & Shelf")
                .pathsToMatch("/api/books/secure/***")
                .build();
    }
    @Bean
    public GroupedOpenApi adminApi() {
        return GroupedOpenApi.builder()
                .group("Admin Operations")
                .pathsToMatch("/api/admin/**")
                .build();
    }

    @Bean
    public GroupedOpenApi userInteractionApi() {
        return GroupedOpenApi.builder()
                .group("User Interaction")
                .pathsToMatch(
                        "/api/user/**",
                        "/api/review/**",
                        "/api/reading/**",
                        "/api/messages/**",
                        "/api/history/**",
                        "/api/category/**")
                .build();
    }

    @Bean
    public GroupedOpenApi financialApi(){
        return GroupedOpenApi.builder()
                .group("Financials")
                .pathsToMatch("/api/payment/**")
                .build();
    }

    @Bean
    public OpenAPI customOpenAPI() {
        Server server = new Server();
        server.setUrl("http://localhost:8080");
        server.setDescription("Development Server");

        Contact contact = new Contact();
        contact.setName("Aya Nashaat");
        contact.setEmail("aya.nashaatx@gmail.com");

        Info information = new Info()
                .title("Library Management API")
                .version("v1.0")
                .description("Documentation for the Library Application Backend API. Includes endpoints for book discovery, borrowing, and administration.")
                .contact(contact);

//        // Define JWT Security Scheme
//        SecurityScheme securityScheme = new SecurityScheme()
//                .type(SecurityScheme.Type.HTTP)
//                .scheme("bearer")
//                .bearerFormat("JWT")
//                .name("Authorization");

        return new OpenAPI()
                .info(information)
                .servers(List.of(server));
//                .addSecurityItem(new SecurityRequirement().addList("bearerAuth"))
//                .components(new Components().addSecuritySchemes("bearerAuth", securityScheme));
    }
}

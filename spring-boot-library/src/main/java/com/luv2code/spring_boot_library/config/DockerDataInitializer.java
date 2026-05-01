package com.luv2code.spring_boot_library.config;

import com.luv2code.spring_boot_library.entity.AppUser;
import com.luv2code.spring_boot_library.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Profile;
import org.springframework.security.crypto.password.PasswordEncoder;


@Configuration
@Profile("docker-dev")
public class DockerDataInitializer {
    @Bean
    public CommandLineRunner initAdmin(UserRepository repo, PasswordEncoder encoder) {
        return args -> {

            if (repo.findByEmail("admin@example.com") == null) {
                AppUser admin = new AppUser();
                admin.setEmail("admin@example.com");
                admin.setPassword(encoder.encode("admin123"));
                admin.setRole("ADMIN");
                repo.save(admin);
                System.out.println(">> DOCKER-DEV MODE: Initial Admin Created.");
            }
        };
    }
}



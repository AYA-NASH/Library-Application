package com.luv2code.spring_boot_library.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public sealed interface UserDtos {

    record SignupRequest(
            @NotBlank @Size(min = 3) String username,
            @Email @NotBlank String email,
            @NotBlank @Size(min = 6) String password
    ) implements UserDtos {
    }

    record UserInfo(
            String username,
            String email,
            String role
    ) implements UserDtos {
    }

    record LoginResponse(
            String token,
            UserInfo user,
            Boolean isNewUser
    ) implements UserDtos {
    }

    record LoginRequest(
            @NotBlank @Email String email,
            @NotBlank String password
    ) implements UserDtos {
    }

    record GoogleUser(String email, String username) implements UserDtos {
    }
}

package com.luv2code.spring_boot_library.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotEmpty;

public sealed interface MessageDtos {
    record UserMessageRequest(
            Long userId,
            @NotEmpty @Min(value = 2) String title,
            @NotEmpty @Min(value = 10) String question
    ) implements MessageDtos {
    }

    record AdminMessageResponse(
            Long adminId,
            Long userId,
            Long messageId,
            @NotEmpty
            String response
    ) implements MessageDtos {
    }
}

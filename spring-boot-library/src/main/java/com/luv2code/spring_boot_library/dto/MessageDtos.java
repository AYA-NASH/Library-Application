package com.luv2code.spring_boot_library.dto;

import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.Size;

public sealed interface MessageDtos {

    record NewMessageRequest(
            @NotEmpty @Size(min = 2, message = "Title must be at least 2 characters")
            String title,
            @NotEmpty @Size(min = 10, message = "Question must be at least 10 characters")
            String question
    ) implements MessageDtos {
    }

    record AdminReplyRequest(
            @Positive
            Long messageId,
            @NotEmpty
            String response
    ) implements MessageDtos {
    }

    record MessageResponse(
            Long id,
            String title,
            String question,
            String adminName,
            String adminResponse,
            boolean closed
    ) implements MessageDtos {
    }

    record AdminMessageView(
            Long id,
            String userEmail,
            String title,
            String question
    ) implements MessageDtos {
    }
}

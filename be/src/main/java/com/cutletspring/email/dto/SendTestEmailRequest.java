package com.cutletspring.email.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SendTestEmailRequest {

    @NotBlank(message = "Recipient email address is required")
    @Email(message = "Invalid recipient email address format")
    private String recipientEmail;
}


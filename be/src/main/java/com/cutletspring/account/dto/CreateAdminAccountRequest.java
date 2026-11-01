package com.cutletspring.account.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CreateAdminAccountRequest {

    @NotBlank(message = "Email is required")
    @Email(message = "Valid email address format required")
    private String email;

    @NotBlank(message = "Full name is required")
    private String fullName;

    @NotBlank(message = "Password is required")
    private String password;

    @NotBlank(message = "Role is required")
    @Pattern(regexp = "^(ROLE_ADMIN|ROLE_STAFF|ADMIN|STAFF)$", message = "Role must be either ROLE_ADMIN or ROLE_STAFF")
    private String role;
}


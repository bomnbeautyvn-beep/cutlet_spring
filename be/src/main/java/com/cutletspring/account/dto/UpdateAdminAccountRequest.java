package com.cutletspring.account.dto;

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
public class UpdateAdminAccountRequest {

    @NotBlank(message = "Full name is required")
    private String fullName;

    @NotBlank(message = "Role is required")
    @Pattern(regexp = "^(ROLE_ADMIN|ROLE_STAFF|ADMIN|STAFF)$", message = "Role must be either ROLE_ADMIN or ROLE_STAFF")
    private String role;
}


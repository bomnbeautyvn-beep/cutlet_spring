package com.cutletspring.database.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ConfirmRestoreRequest {

    @NotBlank(message = "Staging token is required")
    private String stagingToken;

    @NotBlank(message = "Confirmation text is required")
    private String confirmationText;

    @NotNull(message = "Warning confirmation must be checked")
    private Boolean confirmedWarning;
}


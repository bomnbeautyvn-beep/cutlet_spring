package com.cutletspring.shared.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;
import java.util.List;
import java.util.Map;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ApiErrorResponse {
    @Builder.Default
    private boolean success = false;
    private String code;
    private String message;
    private Map<String, List<String>> errors;
    @Builder.Default
    private Instant timestamp = Instant.now();
}


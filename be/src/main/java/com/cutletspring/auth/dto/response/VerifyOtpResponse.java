package com.cutletspring.auth.dto.response;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class VerifyOtpResponse {
    private String resetToken;
    private long expiresInSeconds;
}


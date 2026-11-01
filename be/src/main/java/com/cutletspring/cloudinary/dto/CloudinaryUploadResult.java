package com.cutletspring.cloudinary.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CloudinaryUploadResult {
    private String publicId;
    private String url;
    private String secureUrl;
    private long bytes;
    private String format;
}


package com.cutletspring.cloudinary.service;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import com.cutletspring.cloudinary.dto.CloudinaryUploadResult;
import com.cutletspring.shared.exception.BadRequestException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Arrays;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@Slf4j
@Service
@RequiredArgsConstructor
public class CloudinaryService {

    private final Cloudinary cloudinary;

    @Value("${cloudinary.folder:cutlet-spring}")
    private String folder;

    @Value("${cloudinary.cloud-name:}")
    private String cloudName;

    private static final List<String> ALLOWED_CONTENT_TYPES = Arrays.asList(
            "image/jpeg",
            "image/png",
            "image/webp",
            "image/gif"
    );

    private static final long MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

    public CloudinaryUploadResult uploadImage(MultipartFile file) {
        validateFile(file);

        // If Cloudinary credentials are not configured (e.g. dev mock/test environment)
        if (cloudName == null || cloudName.isBlank()) {
            log.warn("Cloudinary credentials not configured. Generating simulated upload result for local/test use.");
            String mockId = "mock-" + UUID.randomUUID();
            return CloudinaryUploadResult.builder()
                    .publicId(mockId)
                    .url("https://res.cloudinary.com/cutlet-spring/image/upload/v1/" + mockId + ".jpg")
                    .secureUrl("https://res.cloudinary.com/cutlet-spring/image/upload/v1/" + mockId + ".jpg")
                    .bytes(file.getSize())
                    .format("jpg")
                    .build();
        }

        try {
            Map<?, ?> uploadResult = cloudinary.uploader().upload(
                    file.getBytes(),
                    ObjectUtils.asMap(
                            "folder", folder,
                            "resource_type", "image",
                            "unique_filename", true
                    )
            );

            return CloudinaryUploadResult.builder()
                    .publicId((String) uploadResult.get("public_id"))
                    .url((String) uploadResult.get("url"))
                    .secureUrl((String) uploadResult.get("secure_url"))
                    .bytes(uploadResult.get("bytes") instanceof Number n ? n.longValue() : 0L)
                    .format((String) uploadResult.get("format"))
                    .build();
        } catch (IOException ex) {
            log.error("Failed to upload image to Cloudinary", ex);
            throw new BadRequestException("Failed to upload image to Cloudinary: " + ex.getMessage());
        }
    }

    public void deleteImage(String publicId) {
        if (publicId == null || publicId.isBlank()) {
            return;
        }

        if (cloudName == null || cloudName.isBlank() || publicId.startsWith("mock-")) {
            log.info("Simulated deletion of image with public ID: {}", publicId);
            return;
        }

        try {
            cloudinary.uploader().destroy(publicId, ObjectUtils.emptyMap());
            log.info("Successfully deleted image from Cloudinary: {}", publicId);
        } catch (IOException ex) {
            log.warn("Failed to delete image from Cloudinary (publicId: {}): {}", publicId, ex.getMessage());
        }
    }

    public CloudinaryUploadResult replaceImage(String oldPublicId, MultipartFile newFile) {
        // Step 1: Upload new image
        CloudinaryUploadResult newResult = uploadImage(newFile);

        // Step 2: Delete old image if upload succeeded
        if (oldPublicId != null && !oldPublicId.isBlank()) {
            deleteImage(oldPublicId);
        }

        return newResult;
    }

    private void validateFile(MultipartFile file) {
        if (file == null || file.isEmpty()) {
            throw new BadRequestException("Image file cannot be empty");
        }

        if (file.getSize() > MAX_FILE_SIZE) {
            throw new BadRequestException("Image file size exceeds the 10MB limit");
        }

        String contentType = file.getContentType();
        if (contentType == null || !ALLOWED_CONTENT_TYPES.contains(contentType.toLowerCase())) {
            throw new BadRequestException("Unsupported image format. Allowed formats: JPEG, PNG, WEBP, GIF");
        }
    }
}


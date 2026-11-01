package com.cutletspring.cloudinary;

import com.cloudinary.Cloudinary;
import com.cutletspring.cloudinary.dto.CloudinaryUploadResult;
import com.cutletspring.cloudinary.service.CloudinaryService;
import com.cutletspring.shared.exception.BadRequestException;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.mock.web.MockMultipartFile;

import static org.junit.jupiter.api.Assertions.*;

class CloudinaryServiceTests {

    private CloudinaryService cloudinaryService;

    @BeforeEach
    void setUp() {
        Cloudinary cloudinary = new Cloudinary();
        cloudinaryService = new CloudinaryService(cloudinary);
    }

    @Test
    @DisplayName("Upload rejects empty file")
    void testUploadEmptyFile() {
        MockMultipartFile emptyFile = new MockMultipartFile("file", "empty.jpg", "image/jpeg", new byte[0]);
        assertThrows(BadRequestException.class, () -> cloudinaryService.uploadImage(emptyFile));
    }

    @Test
    @DisplayName("Upload rejects invalid file format")
    void testUploadInvalidFormat() {
        MockMultipartFile pdfFile = new MockMultipartFile("file", "document.pdf", "application/pdf", new byte[]{1, 2, 3});
        assertThrows(BadRequestException.class, () -> cloudinaryService.uploadImage(pdfFile));
    }

    @Test
    @DisplayName("Upload valid image produces simulation result in test environment")
    void testUploadSimulatedSuccess() {
        MockMultipartFile imageFile = new MockMultipartFile(
                "file",
                "tonkatsu.png",
                "image/png",
                new byte[]{1, 2, 3, 4, 5}
        );

        CloudinaryUploadResult result = cloudinaryService.uploadImage(imageFile);
        assertNotNull(result);
        assertNotNull(result.getPublicId());
        assertTrue(result.getPublicId().startsWith("mock-"));
        assertTrue(result.getSecureUrl().contains("res.cloudinary.com"));
        assertEquals(5, result.getBytes());
    }

    @Test
    @DisplayName("Delete simulated image succeeds safely without error")
    void testDeleteMockImage() {
        assertDoesNotThrow(() -> cloudinaryService.deleteImage("mock-12345"));
        assertDoesNotThrow(() -> cloudinaryService.deleteImage(null));
        assertDoesNotThrow(() -> cloudinaryService.deleteImage(""));
    }

    @Test
    @DisplayName("Replace image uploads new and deletes old")
    void testReplaceImage() {
        MockMultipartFile newImage = new MockMultipartFile(
                "file",
                "new-tonkatsu.webp",
                "image/webp",
                new byte[]{1, 2, 3}
        );

        CloudinaryUploadResult result = cloudinaryService.replaceImage("mock-old-id", newImage);
        assertNotNull(result);
        assertTrue(result.getPublicId().startsWith("mock-"));
    }
}


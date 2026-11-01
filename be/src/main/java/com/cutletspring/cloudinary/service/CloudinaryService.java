package com.cutletspring.cloudinary.service;

import com.cutletspring.cloudinary.dto.CloudinaryUploadResult;
import org.springframework.web.multipart.MultipartFile;

public interface CloudinaryService {

    CloudinaryUploadResult uploadImage(MultipartFile file);

    void deleteImage(String publicId);

    CloudinaryUploadResult replaceImage(String oldPublicId, MultipartFile newFile);
}

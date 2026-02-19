package com.luv2code.spring_boot_library.service;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

@Service
public class CloudinaryService {

    private final Cloudinary cloudinary;

    @Autowired
    public CloudinaryService(Cloudinary cloudinary) {
        this.cloudinary = cloudinary;
    }

    public record UploadResult(String url, String publicId) {}

    public UploadResult uploadImage(MultipartFile image){
        if (cloudinary == null) {
            throw new IllegalStateException("Image upload service is not configured");
        }

        try {
            var result = cloudinary.uploader().upload(
                    image.getBytes(),
                    ObjectUtils.asMap(
                            "folder", "library-books-covers"
                    )
            );

            return new UploadResult(
                    result.get("secure_url").toString(),
                    result.get("public_id").toString()
            );
        } catch (Exception e) {
            throw new RuntimeException("Failed to upload image", e);
        }
    }

    public UploadResult uploadPdf(MultipartFile pdf) {
        if (cloudinary == null) {
            throw new IllegalStateException("PDF upload service is not configured");
        }

        try {
            var result = cloudinary.uploader().upload(
                    pdf.getBytes(),
                    ObjectUtils.asMap(
                            "resource_type", "raw",
                            "folder", "library-books"
                    )
            );

            return new UploadResult(
                    result.get("secure_url").toString(),
                    result.get("public_id").toString()
            );
        } catch (Exception e) {
            throw new RuntimeException("Failed to upload PDF", e);
        }
    }

    public void deleteFile(String publicId, String resourceType) {
        if (publicId == null || publicId.isBlank()) return;

        try {
            cloudinary.uploader().destroy(
                    publicId,
                    ObjectUtils.asMap("resource_type", resourceType)
            );
        } catch (Exception e) {
            throw new RuntimeException("Failed to delete file from Cloudinary", e);
        }
    }

    public boolean isEnabled() {
        return cloudinary != null;
    }
}

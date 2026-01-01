package com.luv2code.spring_boot_library.service;

import com.cloudinary.Cloudinary;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Map;

@Service
public class ImageUploadService {
    private final Cloudinary cloudinary;

    @Autowired
    public ImageUploadService(@Autowired(required = false) Cloudinary cloudinary){
        this.cloudinary = cloudinary;
    }

    public String uploadImage(MultipartFile image){
        if (cloudinary == null) {
            throw new IllegalStateException("Image upload service is not configured");
        }

        try {
            Map uploadResult = cloudinary.uploader().upload(
                    image.getBytes(),
                    Map.of("folder", "library-books")
            );

            return uploadResult.get("secure_url").toString();
        } catch (IOException e) {
            throw new RuntimeException("Failed to upload image", e);
        }
    }

    public boolean isEnabled() {
        return cloudinary != null;
    }
}

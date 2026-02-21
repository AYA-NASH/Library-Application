package com.luv2code.spring_boot_library.service;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import com.luv2code.spring_boot_library.exception.CloudinaryDeleteException;
import com.luv2code.spring_boot_library.exception.CloudinaryUploadException;
import com.luv2code.spring_boot_library.exception.InvalidFileTypeException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.util.Set;

@Service
public class CloudinaryService {

    private final Cloudinary cloudinary;

    private static final String PDF_TYPE = "application/pdf";

    private static final Set<String> ALLOWED_IMAGE_TYPES = Set.of(
            "image/jpeg",
            "image/png",
            "image/webp"
    );

    @Autowired
    public CloudinaryService(Cloudinary cloudinary) {
        this.cloudinary = cloudinary;
    }

    public record UploadResult(String url, String publicId) {}

    public UploadResult uploadImage(MultipartFile image){

        if(!ALLOWED_IMAGE_TYPES.contains(image.getContentType())){
            throw new InvalidFileTypeException(
                    "Only JPG, PNG, and WEBP images are allowed"
            );
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
            throw new CloudinaryUploadException("Failed to upload image to Cloudinary", e);
        }
    }

    public UploadResult uploadPdf(MultipartFile pdf) {

        if(!PDF_TYPE.equals(pdf.getContentType())){
            throw new InvalidFileTypeException("Only pdf files are allowed");
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
            throw new CloudinaryUploadException("Failed to upload PDF to Cloudinary", e);
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
            throw new CloudinaryDeleteException("Failed to delete file from Cloudinary", e);
        }
    }

    public boolean isEnabled() {
        return cloudinary != null;
    }
}

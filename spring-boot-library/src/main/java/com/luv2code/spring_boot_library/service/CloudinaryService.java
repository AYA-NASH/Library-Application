package com.luv2code.spring_boot_library.service;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import com.luv2code.spring_boot_library.exception.CloudinaryDeleteException;
import com.luv2code.spring_boot_library.exception.CloudinaryUploadException;
import com.luv2code.spring_boot_library.exception.ExternalServiceException;
import com.luv2code.spring_boot_library.exception.InvalidFileTypeException;
import io.github.resilience4j.circuitbreaker.annotation.CircuitBreaker;
import io.github.resilience4j.retry.annotation.Retry;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.util.Set;

@Service
@RequiredArgsConstructor
public class CloudinaryService {

    private static final String PDF_TYPE = "application/pdf";
    private static final long MAX_PDF_SIZE = 10 * 1024 * 1024;
    private static final Set<String> ALLOWED_IMAGE_TYPES = Set.of(
            "image/jpeg",
            "image/png",
            "image/webp"
    );
    private final Cloudinary cloudinary;

    @Retry(name = "cloudinaryService")
    @CircuitBreaker(name = "cloudinaryService", fallbackMethod = "uploadImageFallback")
    public UploadResult uploadImage(MultipartFile image) {

        if (!ALLOWED_IMAGE_TYPES.contains(image.getContentType())) {
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

    @Retry(name = "cloudinaryService")
    @CircuitBreaker(name = "cloudinaryService", fallbackMethod = "uploadPdfFallback")
    public UploadResult uploadPdf(MultipartFile pdf) {

        if (!PDF_TYPE.equals(pdf.getContentType())) {
            throw new InvalidFileTypeException("Only pdf files are allowed");
        }

        if (pdf.getSize() > MAX_PDF_SIZE) {
            throw new InvalidFileTypeException(
                    "PDF file must not exceed 10 MB");
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
            e.printStackTrace();
            throw new CloudinaryUploadException(
                    "Failed to upload PDF to Cloudinary: " + e.getMessage(),
                    e
            );
        }
    }

    @Retry(name = "cloudinaryService")
    @CircuitBreaker(name = "cloudinaryService", fallbackMethod = "deleteFileFallback")
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

    private UploadResult uploadImageFallback(MultipartFile image, Throwable t) {
        throw new ExternalServiceException("Image upload service is temporarily unavailable. Please try again.");
    }

    private UploadResult uploadPdfFallback(MultipartFile pdf, Throwable t) {
        throw new ExternalServiceException("PDF upload service is temporarily unavailable. Please try again.");
    }

    private void deleteFileFallback(String publicId, String resourceType, Throwable t) {
        throw new ExternalServiceException("File deletion service is temporarily unavailable. Please try again.");
    }

    public record UploadResult(String url, String publicId) {
    }
}

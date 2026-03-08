package com.luv2code.spring_boot_library.responsemodel;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Response for GET /admin/secure/book/{id}/edit-info.
 * Exposes only flags and cover URL for the edit form; PDF URL is never sent.
 */
@Data
@AllArgsConstructor
@NoArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL)
public class AdminBookEditInfoResponse {
    private boolean hasPdf;
    private boolean hasImage;
    /** Current cover image URL for preview in the form. */
    private String imageUrl;
    /** Display name for current PDF (e.g. derived from URL). Never the actual URL. */
    private String pdfFilename;
    /** Display name for current cover image (e.g. derived from URL). */
    private String imageFilename;
}

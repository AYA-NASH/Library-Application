/**
 * Metadata for admin add/update book. Used to build FormData and as form initial state.
 * id and dataSource are only set in edit mode (from catalog); not sent in request body.
 */
export interface AdminBookRequest {
  id?: number;
  title: string;
  author: string;
  description: string;
  copies: number;
  category: string;
  dataSource?: string;
  /** Edit only: from GET edit-info. Used to show "Current PDF" in form. */
  hasPdf?: boolean;
  /** Edit only: from GET edit-info. Used to show "Current Image" / preview. */
  hasImage?: boolean;
  /** Edit only: current cover URL for image preview. From edit-info or catalog. */
  imageUrl?: string;
}

/**
 * Response shape of GET /admin/secure/book/:id/edit-info.
 * Backend returns only flags and display URL (no PDF URL) for security.
 */
export interface AdminBookEditInfoResponse {
  hasPdf: boolean;
  hasImage: boolean;
  /** Current cover image URL for preview in form. */
  imageUrl?: string;
}

/** Access mode: full book or preview (first N pages) */
export type AccessMode = "PREVIEW" | "FULL";

/** Book source: INTERNAL uses our reader; Google redirects to their viewer */
export type BookSource = "INTERNAL" | "GOOGLE";

/** Backend response for reader access endpoints */
export interface ReaderAccessResponse {
  url: string;
  mode: "FULL" | "Preview";
  source: BookSource;
}

/**
 * Minimal book shape for the reader.
 * The real app's BookModel has id (number) - we accept string | number for flexibility.
 */
export interface ReaderBook {
  id: string;
  title: string;
  /** PDF URL (from backend - Cloudinary for INTERNAL) */
  fileUrl: string;
}

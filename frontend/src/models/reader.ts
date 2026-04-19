export interface DigitalAccessResponse {
    url: string;
    source: string;
    mode: string;
}

export type AccessMode = "PREVIEW" | "FULL";
export type BookSource = "INTERNAL" | "GOOGLE";

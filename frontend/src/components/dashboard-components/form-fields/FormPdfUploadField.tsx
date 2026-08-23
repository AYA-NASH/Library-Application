import React, { useEffect, useRef, useState } from "react";
import { FieldPath, FieldValues, useController, useFormContext } from "react-hook-form";
import { FileTextIcon, XIcon } from "lucide-react";

import {
    Attachment,
    AttachmentAction,
    AttachmentActions,
    AttachmentContent,
    AttachmentDescription,
    AttachmentMedia,
    AttachmentTitle,
} from "@/components/ui/attachment";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";

interface FormPdfUploadFieldProps<TFieldValues extends FieldValues> {
    name: FieldPath<TFieldValues>;
    removeName?: FieldPath<TFieldValues>;
    label?: string;
    initialPdfFilename?: string | null;
}

export function FormPdfUploadField<TFieldValues extends FieldValues>({
    name,
    removeName,
    label = "PDF Document",
    initialPdfFilename,
}: FormPdfUploadFieldProps<TFieldValues>) {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const { control, setValue, setError, clearErrors } =
        useFormContext<TFieldValues>();

    const PDFSizeMB = 10;
    const MAX_PDF_SIZE = PDFSizeMB * 1024 * 1024;


    const {
        field: { onChange, value },
        fieldState: { invalid, error },
    } = useController({ name, control });

    const [displayName, setDisplayName] = useState<string | null>(
        initialPdfFilename || null
    );

    useEffect(() => {
        if (initialPdfFilename && !(value)) {
            setDisplayName(initialPdfFilename);
        }
    }, [initialPdfFilename, value]);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = e.target.files?.[0] || null;

        if (!selectedFile) {
            onChange(null);
            setDisplayName(initialPdfFilename || null);
            return;
        }

        if (selectedFile.size > MAX_PDF_SIZE) {
            setError(name, {
                type: "validate",
                message: `PDF file is too large. The maximum allowed size is ${PDFSizeMB} MB.`,
            });

            onChange(null);
            setDisplayName(initialPdfFilename || null);

            if (fileInputRef.current) {
                fileInputRef.current.value = "";
            }

            return;
        }

        clearErrors(name);
        onChange(selectedFile);
        setDisplayName(selectedFile.name);

        if (removeName) {
            setValue(removeName, false as any);
        }
    };

    const handleClear = () => {
        onChange(null);
        setDisplayName(null);

        if (removeName) {
            setValue(removeName, true as any);
        }

        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    };

    return (
        <div className="mt-3 flex flex-1">
            <Field
                data-invalid={invalid}
                className="flex h-full flex-col"
            >
                {label && <FieldLabel>{label}</FieldLabel>}

                <Input
                    ref={fileInputRef}
                    type="file"
                    accept="application/pdf"
                    className="hidden"
                    onChange={handleFileChange}
                />

                {invalid && error && <FieldError errors={[error]} />}

                {displayName || value ? (
                    <Attachment>
                        <AttachmentMedia variant="icon" className="h-12 w-12 bg-primary/10 text-primary">
                            <FileTextIcon className="h-6 w-6" />
                        </AttachmentMedia>

                        <AttachmentContent>
                            <AttachmentTitle>
                                {value ? value.name : displayName || "Current PDF"}
                            </AttachmentTitle>
                            <AttachmentDescription>
                                {value
                                    ? `${(value.size / (1024 * 1024)).toFixed(2)} MB`
                                    : "Existing PDF"}
                            </AttachmentDescription>
                        </AttachmentContent>

                        <AttachmentActions>
                            <AttachmentAction
                                aria-label="Remove PDF"
                                onClick={handleClear}
                                className="rounded-full"
                            >
                                <XIcon className="h-4 w-4" />
                            </AttachmentAction>
                        </AttachmentActions>
                    </Attachment>
                ) : (
                    <div
                        onClick={() => fileInputRef.current?.click()}
                        className="
                            flex
                            min-h-45
                            flex-col
                            w-full
                            items-center
                            justify-center
                            rounded-2xl
                            border-2
                            border-dashed
                            transition-colors
                            hover:bg-muted/30
                            cursor-pointer
                            "
                    >
                        <FileTextIcon className="mb-2 h-8 w-8 opacity-40" />

                        <span className="font-medium text-sm">
                            Upload Book PDF
                        </span>

                        <span className="text-xs text-muted-foreground">
                            PDF files only (Max 50MB)
                        </span>
                    </div>
                )}
            </Field>
        </div>

    );
}
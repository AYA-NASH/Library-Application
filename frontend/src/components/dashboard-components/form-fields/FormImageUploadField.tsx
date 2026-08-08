import { Attachment, AttachmentAction, AttachmentActions, AttachmentContent, AttachmentDescription, AttachmentMedia, AttachmentTitle } from "@/components/ui/attachment";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { ImageIcon, XIcon } from "lucide-react";
import React, { useEffect, useState } from "react";
import { FieldPath, FieldValues, useController, useFormContext } from "react-hook-form";

interface FormImageUploadFieldProps<TFieldValues extends FieldValues> {
    isEdit?: boolean;
    name: FieldPath<TFieldValues>;
    label?: string;
    initialImageUrl?: string;
    initialImageName?: string;
    removeImage?: FieldPath<TFieldValues>;
}

export function FormImageUploadField<TFieldValues extends FieldValues>({
    isEdit,
    name,
    label = "Cover Image",
    initialImageUrl,
    initialImageName,
    removeImage,
}: FormImageUploadFieldProps<TFieldValues>) {
    const { control, setValue } = useFormContext<TFieldValues>();

    const {
        field: { onChange, value },
        fieldState: { invalid, error },
    } = useController({ name, control });

    const [previewUrl, setPreviewUrl] = useState<string | null>(initialImageUrl || null);
    const fileInputRef = React.useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (!value) {
            setPreviewUrl(initialImageUrl || null);
        }
    }, [initialImageUrl, value]);

    useEffect(() => {
        return () => {
            if (previewUrl && previewUrl.startsWith("blob:")) {
                URL.revokeObjectURL(previewUrl);
            }
        };
    }, [previewUrl]);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = e.target.files?.[0] || null;
        onChange(selectedFile);

        if (selectedFile) {
            const objectUrl = URL.createObjectURL(selectedFile);
            setPreviewUrl(objectUrl);

            if (removeImage) setValue(removeImage, false as any)
        } else {
            setPreviewUrl(initialImageUrl || null);
        }
    }

    const handleClear = () => {
        onChange(null);
        setPreviewUrl(null);
        if (removeImage) setValue(removeImage, true as any)
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    }
    return (
        <div className="mt-3 flex flex-1">
            <Field data-invalid={invalid}
                className="flex h-full flex-col"
            >
                {label && <FieldLabel>{label}</FieldLabel>}

                <Input
                    ref={fileInputRef}
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    className="hidden"

                    onChange={handleFileChange}
                />

                {invalid && error && <FieldError errors={[error]} />}

                {previewUrl ? (
                    <Attachment>
                        <AttachmentMedia variant="image" className="h-24 w-24">
                            <img src={previewUrl} alt="Cover Preview"
                                className="h-full w-full object-cover" />
                        </AttachmentMedia>
                        <AttachmentContent>
                            <AttachmentTitle>
                                {value ? value.name : initialImageName ?? "Current Cover"}
                            </AttachmentTitle>
                            <AttachmentDescription>
                                {value
                                    ? `${(value.size / (1024 * 1024)).toFixed(2)} MB`
                                    : "Existing Cover"}
                            </AttachmentDescription>
                        </AttachmentContent>

                        <AttachmentActions className="absolute top-3 right-3">
                            <AttachmentAction
                                aria-label="Remove image"
                                onClick={handleClear}
                                className="rounded-full"
                            >
                                <XIcon className="h-4 w-4" />
                            </AttachmentAction>
                        </AttachmentActions>
                    </Attachment>
                ) : (
                    <div onClick={() => fileInputRef.current?.click()}
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
                        <ImageIcon className="mb-3 h-10 w-10 opacity-40" />

                        <span className="font-medium">
                            Upload Cover Image
                        </span>

                        <div>
                            <span className="text-xs">
                                PNG, JPG or WebP
                            </span>
                        </div>
                    </div>
                )}
            </Field>
        </div>


    );
}


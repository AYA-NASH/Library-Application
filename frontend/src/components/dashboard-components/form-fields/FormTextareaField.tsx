import { FieldPath, FieldValues, useFormContext, useController } from "react-hook-form";
import { Field, FieldLabel, FieldError } from "@/components/ui/field";
import { Textarea } from "@/components/ui/textarea";

interface FormTextareaFieldProps<TFieldValues extends FieldValues>
    extends React.ComponentProps<typeof Textarea> {
    name: FieldPath<TFieldValues>;
    label?: string;
    required?: boolean;
}

export function FormTextareaField<TFieldValues extends FieldValues>({
    name,
    label,
    required,
    id,
    className = "",
    ...textareaProps
}: FormTextareaFieldProps<TFieldValues>) {
    const { control } = useFormContext<TFieldValues>();

    const {
        field,
        fieldState: { invalid, error },
    } = useController({ name, control });

    const textareaId = id || name;
    return (
        <Field data-invalid={invalid}>
            {label && (
                <FieldLabel htmlFor={textareaId}>
                    {label} {required && <span className="text-destructive">*</span>}
                </FieldLabel>
            )}
            <Textarea
                {...field}
                {...textareaProps}
                id={textareaId}
                aria-invalid={invalid}
                className={`min-h-30 ${className}`}
            />
            {invalid && <FieldError errors={[error]} />}
        </Field>

    );
}
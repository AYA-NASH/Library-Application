import { FieldPath, FieldValues, useController, useFormContext } from "react-hook-form"
import { Input } from "@/components/ui/input";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";

interface FormInputFieldProps<TFieldValues extends FieldValues>
    extends React.ComponentProps<typeof Input> {
    name: FieldPath<TFieldValues>;
    label?: string;
    required?: boolean;
}

export function FormInputField<TFieldValues extends FieldValues>({
    name,
    label,
    required,
    id,
    ...inputProps
}: FormInputFieldProps<TFieldValues>) {
    const { control } = useFormContext<TFieldValues>();

    const {
        field,
        fieldState: { invalid, error },
    } = useController({ name, control });
    const inputId = id || name;

    return (

        <Field data-invalid={invalid}>
            <FieldLabel htmlFor={inputId}>
                {label} {required && <span className="text-destructive">*</span>}
            </FieldLabel>
            <Input
                {...field}
                {...inputProps}
                id={inputId}
                aria-invalid={invalid}
            />
            {invalid && (
                <FieldError errors={[error]} />
            )}
        </Field>
    )
}



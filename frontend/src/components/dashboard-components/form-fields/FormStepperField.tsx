import { FieldPath, FieldValues, useFormContext, useController } from "react-hook-form";
import { Field, FieldLabel, FieldError } from "@/components/ui/field";
import { Input } from "@/components/ui/input";

interface FormStepperFieldProps<TFieldValues extends FieldValues> {
    name: FieldPath<TFieldValues>;
    label: string;
    required?: boolean;
    min?: number;
    max?: number;
}

export function FormStepperField<TFieldValues extends FieldValues>({
    name,
    label,
    required,
    min = 0,
    max,
}: FormStepperFieldProps<TFieldValues>) {
    const { control } = useFormContext<TFieldValues>();

    const {
        field,
        fieldState: { invalid, error },
    } = useController({ name, control });

    return (
        <Field data-invalid={invalid}>
            <FieldLabel htmlFor={name}>
                {label} {required && <span className="text-destructive">*</span>}
            </FieldLabel>

            <Input
                {...field}
                id={name}
                type="number"
                min={min}
                max={max}
                value={field.value ?? min}
                onChange={(e) => field.onChange(e.target.valueAsNumber || 0)}
                className="h-8  text-center"
            />

            {invalid && error && <FieldError errors={[error]} />}
        </Field>
    );
}
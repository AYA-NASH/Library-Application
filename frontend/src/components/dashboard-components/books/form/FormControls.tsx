import { Button } from "@/components/ui/button";
import { Field } from "@/components/ui/field";
import { Loader2, Save } from "lucide-react";

interface FormControlsProps {
    isEdit?: boolean;
    onCancel?: () => void;
    isSubmitting?: boolean;
}
export function FormControls({
    isEdit,
    onCancel,
    isSubmitting = false
}: FormControlsProps) {
    return (
        <Field
            orientation="horizontal"
            className="mt-6 justify-end border-t pt-6"
        >
            {onCancel && (
                <Button type="button"
                    variant="outline"
                    className="hover:bg-secondary-foreground hover:text-accent cursor-pointer"
                    onClick={onCancel}>
                    Cancel
                </Button>
            )}
            <Button type="submit"
                disabled={isSubmitting}
                className="hover:bg-accent-foreground hover:text-accent cursor-pointer"
            >
                {isSubmitting
                    ? (
                        <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Saving...
                        </>
                    ) : (
                        <>
                            <Save className="mr-2 h-4 w-4" />
                            {isEdit ? "Update Book" : "Save Book"}
                        </>
                    )}
            </Button>
        </Field>
    )
}
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FieldGroup } from "@/components/ui/field";
import { CategoryReference } from "@/models/CategoryModel";
import { FormInputField } from "@/components/dashboard-components/form-fields/FormInputField";
import { FormStepperField } from "@/components/dashboard-components/form-fields/FormStepperField";
import { FormMultiSelectField } from "@/components/dashboard-components/form-fields/FormMultiSelectField";
import { Separator } from "@base-ui/react";
import { FileText } from "react-bootstrap-icons";
import { FormTextareaField } from "../../form-fields/FormTextareaField";

interface InformationSectionProps {
    categories: CategoryReference[],
    isCategoriesLoading?: boolean,
}

export function InformationSection({ categories, isCategoriesLoading }: InformationSectionProps) {
    return (
        <div className="flex flex-col gap-6">
            <Card>
                <CardContent className="space-y-4 pt-4">
                    <FieldGroup>
                        <FormInputField
                            name="title"
                            label="Title"
                            placeholder="Enter book title"
                            required
                        />

                        <FieldGroup className="grid grid-cols-2">
                            <FormInputField
                                name="author"
                                label="Author"
                                placeholder="Enter author name"
                                required
                            />

                            <FormStepperField
                                name="initialCopies"
                                label="Initial Copies"
                                required
                            />
                        </FieldGroup>

                        <FormMultiSelectField
                            name="categoryIds"
                            label="Categories"
                            placeholder="Search or select categories"
                            required
                            options={categories ?? []}
                            valueKey="id"
                            labelKey="name"
                            isLoading={isCategoriesLoading}
                        />
                    </FieldGroup>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle><FileText className="inline" /> Description</CardTitle>
                    <CardDescription>
                        Provide a short summary or description of the book.
                    </CardDescription>
                </CardHeader>
                <Separator />
                <CardContent>
                    <FormTextareaField
                        name="description"
                        placeholder="Write book description..."
                    />
                </CardContent>
            </Card>
        </div>

    );
}
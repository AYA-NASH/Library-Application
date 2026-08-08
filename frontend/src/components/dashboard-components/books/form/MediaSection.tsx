import { Card } from "@/components/ui/card";
import { FormImageUploadField } from "../../form-fields/FormImageUploadField";
import { Separator } from "@/components/ui/separator";
import { FormPdfUploadField } from "../../form-fields/FormPdfUploadField";

interface MediaSectionProps {
    isEdit?: boolean;
    dataSource?: string;
    hasImage?: boolean;
    imageUrl?: string;
    imageFilename?: string;
    hasPdf?: boolean;
    pdfFilename?: string;
}

export function MediaSection({
    isEdit = false,
    dataSource,
    hasImage,
    imageUrl,
    imageFilename,
    hasPdf,
    pdfFilename,
}: MediaSectionProps) {
    const showPdfSection = !(isEdit && dataSource && dataSource !== "INTERNAL");
    return (
        <Card className="flex h-full flex-col p-6">
            <div className="flex flex-1 flex-col">
                <FormImageUploadField
                    name="imageFile"
                    label="Book Cover Image"
                    removeImage="removeImage"
                    initialImageUrl={(isEdit && hasImage) ? imageUrl : undefined}
                    initialImageName={
                        isEdit && hasImage
                            ? imageFilename
                            : undefined
                    }
                />
            </div>


            {showPdfSection && (
                <>
                    <Separator />
                    <div className="flex flex-1 flex-col">
                        <FormPdfUploadField
                            name="pdfFile"
                            removeName="removePdf"
                            label="Book Digital PDF"
                            initialPdfFilename={(isEdit && hasPdf ? pdfFilename : undefined)}
                        />
                    </div>
                </>
            )}
        </Card>
    )
}
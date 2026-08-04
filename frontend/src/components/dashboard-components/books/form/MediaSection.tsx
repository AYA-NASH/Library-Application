import { Card } from "@/components/ui/card";
import { FormImageUploadField } from "../../form-fields/FormImageUploadField";
import { Separator } from "@/components/ui/separator";
import { FormPdfUploadField } from "../../form-fields/FormPdfUploadField";

interface MediaSectionProps {
    pdfFileName?: string;
    imageName?: string;
}
export function MediaSection({ pdfFileName, imageName }: MediaSectionProps) {
    return (
        <Card className="flex h-full flex-col p-6">
            <div className="flex flex-1 flex-col">
                <FormImageUploadField
                    name="imageFile"
                    label="Book Cover Image"
                    removeImage="removeImage"
                    initialImageUrl={imageName}
                />
            </div>
            <Separator />
            <div className="flex flex-1 flex-col">
                <FormPdfUploadField
                    name="pdfFile"
                    removeName="removePdf"
                    label="Book Digital PDF"
                    initialPdfFilename={pdfFileName}
                />
            </div>
        </Card>
    )
}
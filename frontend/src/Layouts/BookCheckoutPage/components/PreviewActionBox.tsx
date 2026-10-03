import { Button } from "@/components/ui/button";
import { Eye } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface PreviewActionProps {
    bookId: number;
    bookTitle: string;
}

export function PreviewActionBox({ bookId, bookTitle }: PreviewActionProps) {
    const navigate = useNavigate();

    const handlePreview = () => {
        navigate(`/reader/${bookId}/preview`, {
            state: { bookTitle }, 
        });
    };

    return (
        <div className="flex flex-col items-center w-full">
            <Button
                variant="outline"
                onClick={handlePreview}
                className="w-full mb-2 cursor-pointer"
            >
                <Eye className="mr-2 h-4 w-4" />
                Read Preview
            </Button>
            
            <span className="text-sm text-muted-foreground text-center">
                Free sample — first 10 pages
            </span>
        </div>
    );
}
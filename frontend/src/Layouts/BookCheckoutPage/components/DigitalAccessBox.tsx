import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger
} from "@/components/ui/collapsible";

import {
    TabletSmartphone,
    ChevronDown,
    ChevronUp,
    Zap,
    Cloud,
    Search,
    BookOpen,
    Unlock
} from "lucide-react";

import { useAuthStore } from "@/store/useAuthStore";


interface DigitalAccessProps {
    bookId: number;
    bookTitle: string;
    isDigitalUnlocked: boolean;
}

export function DigitalAccessBox({ bookId, bookTitle, isDigitalUnlocked }: DigitalAccessProps) {
    const [isOpen, setIsOpen] = useState(false);
    const navigate = useNavigate();
    const isAuthenticated = useAuthStore((state) => !!state.token);

    const handleAccessBook = () => {
        navigate(`/reader/${bookId}`, {
            state: { bookTitle },
        });
    };

    const renderDigitalAction = () => {

        if (isDigitalUnlocked) {
            return (
                <Button onClick={handleAccessBook} size="lg" className="w-full mt-4">
                    <BookOpen className="mr-2 h-4 w-4" />
                    Read Full Book
                </Button>
            );
        }

        return (
            <Button size="lg" className="w-full mt-4">
                <Unlock className="mr-2 h-4 w-4" />
                Unlock Digital — $14.99
            </Button>
        );
    };

    return (
        <Collapsible
            open={isOpen}
            onOpenChange={setIsOpen}
            className="w-full"
        >
            <CollapsibleTrigger >
                <div
                    className="flex justify-between items-center p-2 -mx-2 rounded-md cursor-pointer hover:bg-muted/50 transition-colors"
                >
                    <span className="font-semibold flex items-center">
                        <TabletSmartphone className="mr-2 h-4 w-4" />
                        Digital Version
                    </span>
                    {isOpen ? (
                        <ChevronUp className="h-4 w-4 text-muted-foreground" />
                    ) : (
                        <ChevronDown className="h-4 w-4 text-muted-foreground" />
                    )}
                </div>
            </CollapsibleTrigger>

            <CollapsibleContent className="pt-3 pb-1">
                <div className="space-y-2 text-sm text-muted-foreground">
                    <p className="flex items-center">
                        <Zap className="mr-2 h-4 w-4 text-amber-500" />
                        Instant access — start reading immediately.
                    </p>
                    <p className="flex items-center">
                        <Cloud className="mr-2 h-4 w-4" />
                        Permanent access across all devices.
                    </p>
                    <p className="flex items-center">
                        <Search className="mr-2 h-4 w-4" />
                        Searchable text & adjustable font size.
                    </p>
                </div>

                {isAuthenticated && renderDigitalAction()}
            </CollapsibleContent>
        </Collapsible>
    );
}
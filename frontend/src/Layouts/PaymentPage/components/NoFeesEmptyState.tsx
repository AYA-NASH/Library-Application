import { Link } from "react-router-dom";
import { PartyPopper } from "lucide-react";
import { Button } from "@/components/ui/button";
import { EmptyState } from "../../Utils/EmptyState";

export const NoFeesEmptyState = () => (
    <div className="flex flex-col items-center justify-center min-h-[60vh] w-full">
        <EmptyState
            icon={PartyPopper}
            title="No fees yet!"
            description="Your account is in good standing. Keep returning those books on time!"
            action={
                <Button variant="default" className="px-8">
                    <Link to="/search">Explore Library</Link>
                </Button>
            }
        />
    </div>
);
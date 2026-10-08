import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loans } from "./components/Loans";
import { HistoryPage } from "./components/HistoryPage";

export function ShelfPage() {
    return (
        <div className="w-full max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
            <Tabs defaultValue="loans" className="w-full">
                <TabsList
                    variant="line"
                    className="w-full justify-start overflow-x-auto overflow-y-hidden scrollbar-none [&::-webkit-scrollbar]:hidden"
                >
                    <TabsTrigger value="loans">Current Loans</TabsTrigger>
                    <TabsTrigger value="history">Your History</TabsTrigger>
                </TabsList>

                <TabsContent value="loans" className="mt-6">
                    <Loans />
                </TabsContent>

                <TabsContent value="history" className="mt-6">
                    <HistoryPage />
                </TabsContent>
            </Tabs>
        </div>
    );
}
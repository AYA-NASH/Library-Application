import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loans } from "./components/Loans";
import { HistoryPage } from "./components/HistoryPage";

export function ShelfPage() {
    return (
        <Tabs defaultValue="loans" className="w-full m-10">
            <TabsList variant="line">
                <TabsTrigger value="loans">Current Loans</TabsTrigger>
                <TabsTrigger value="history">Your History</TabsTrigger>
            </TabsList>

            <TabsContent value="loans">
                <Loans />
            </TabsContent>

            <TabsContent value="history">
                <HistoryPage />
            </TabsContent>
        </Tabs>
    );
}
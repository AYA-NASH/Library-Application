import { PostNewMessage } from "./components/PostNewMessage";
import { Messages } from "./components/Messages";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";

export const MessagesPage = () => {
    return (
        <div className="w-full max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
            <h2 className="font-bold text-foreground text-lg">Support Center</h2>
            <Separator className="m-6" />
            <Tabs defaultValue="post" className="w-full">
                <TabsList variant="line"
                    className="w-full justify-start overflow-x-auto overflow-y-hidden scrollbar-none [&::-webkit-scrollbar]:hidden"
                >
                    <TabsTrigger value="post"> New Ticket </TabsTrigger>
                    <TabsTrigger value="view"> My History</TabsTrigger>
                </TabsList>

                <TabsContent value="post" className="mt-6">
                    <PostNewMessage />
                </TabsContent>

                <TabsContent value="view" className="mt-6">
                    <Messages />
                </TabsContent>
            </Tabs>

        </div>
    );
};
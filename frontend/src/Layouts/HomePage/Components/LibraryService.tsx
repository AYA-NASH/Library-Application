import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { MessageSquareText } from "lucide-react";

import lostImage from "@/Images/PublicImages/image-3.jpg";
import { useAuthStore } from "@/store/useAuthStore";

export const LibraryService = () => {
    const isAuthenticated = useAuthStore((state) => !!state.token);

    return (
        <section className="mx-auto max-w-6xl px-6 py-14">
            <Card className="overflow-hidden">
                <CardContent className="flex flex-col p-0 lg:flex-row">

                    <div className="relative shrink-0 lg:w-2/5">
                        <img
                            src={lostImage}
                            alt="Person browsing library shelves"
                            className="h-72 w-full object-cover object-center lg:h-full"
                        />
                        <div className="pointer-events-none absolute inset-y-0 right-0 hidden w-16 bg-linear-to-l from-card to-transparent lg:block" />
                    </div>

                    <div className="flex flex-1 flex-col justify-center gap-6 p-8 lg:p-12">
                        <div className="space-y-3">
                            <h2 className="text-3xl font-bold tracking-tight text-foreground md:text-4xl">
                                Can't find what you're looking for?
                            </h2>
                            <p className="text-base leading-relaxed text-muted-foreground">
                                If you can't find what you're looking for, send our
                                library admin a personal message — we'll help you
                                track down exactly what you need.
                            </p>
                        </div>

                        <div>
                            {!isAuthenticated ? (
                                <Button size="lg" className="gap-2 rounded-full px-8">
                                    <Link to="/login">Sign Up</Link>
                                </Button>
                            ) : (
                                <Button size="lg" className="gap-2 rounded-full px-8">
                                    <MessageSquareText className="size-4" />
                                    <Link to="/messages">Contact Library</Link>
                                </Button>
                            )}
                        </div>
                    </div>

                </CardContent>
            </Card>
        </section>
    );
};
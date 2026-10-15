import React from "react";
import { Link } from "react-router-dom";
import { BookX, Home, Search, HelpCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export const NotFoundPage: React.FC = () => {
    return (
        <div className="flex min-h-[calc(100vh-14rem)] w-full items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
            <div className="relative w-full max-w-lg text-center">
                {/* Background decorative big typography */}
                <div 
                    aria-hidden="true" 
                    className="pointer-events-none select-none text-[8rem] font-extrabold tracking-widest text-muted/40 sm:text-[11rem] leading-none"
                >
                    404
                </div>

                {/* Overlapping Content Card */}
                <Card className="relative -mt-16 sm:-mt-20 border-border/60 bg-card/90 shadow-xl backdrop-blur-md">
                    <CardContent className="flex flex-col items-center p-6 sm:p-10 text-center">
                        <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary shadow-inner">
                            <BookX className="h-7 w-7" />
                        </div>

                        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
                            Page Not Found
                        </h1>

                        <p className="mt-3 text-sm sm:text-base leading-relaxed text-muted-foreground">
                            The book or page you are looking for might have been archived, borrowed, or moved to another section of the catalog.
                        </p>

                        {/* Action buttons */}
                        <div className="mt-8 flex w-full flex-col gap-3 sm:flex-row sm:justify-center">
                            <Button
                                size="lg"
                                className="w-full sm:w-auto font-semibold shadow-sm"
                                nativeButton={false}
                                render={
                                    <Link to="/" className="flex items-center justify-center gap-2">
                                        <Home className="h-4 w-4" />
                                        Back to Homepage
                                    </Link>
                                }
                            />
                            <Button
                                variant="outline"
                                size="lg"
                                className="w-full sm:w-auto font-medium"
                                nativeButton={false}
                                render={
                                    <Link to="/search" className="flex items-center justify-center gap-2">
                                        <Search className="h-4 w-4" />
                                        Search Catalog
                                    </Link>
                                }
                            />
                        </div>

                        {/* Helpful footer link */}
                        <div className="mt-8 border-t border-border/60 pt-4 w-full">
                            <p className="text-xs text-muted-foreground flex items-center justify-center gap-1.5">
                                <HelpCircle className="h-3.5 w-3.5" />
                                <span>Need assistance?</span>
                                <Link 
                                    to="/messages" 
                                    className="font-medium text-primary hover:underline hover:text-primary/80 transition-colors"
                                >
                                    Ask a Librarian
                                </Link>
                            </p>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

import { ReturnBook } from "./ReturnBook";
import { Link } from "react-router-dom";

import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { Button } from "@/components/ui/button";
import { useBooks } from "@/api/hooks/BookHooks/useBooks";
import { ApiErrorDisplay } from "@/Layouts/Utils/ApiErrorDisplay";
import { SpinnerLoading } from "@/Layouts/Utils/SpinnerLoading";

export const HomeCarousel = () => {
    const { data, isLoading, isError, error, refetch } = useBooks(1, 9);

    if (isLoading) {
        return <SpinnerLoading />;
    }

    if (isError) {
        return <ApiErrorDisplay error={error} title="Failed to load carousel" onRetry={() => refetch()} />;
    }

    const books = data?.content ?? [];

    return (
        <div className="flex flex-col items-center justify-center gap-8 py-12">
            <div className="w-full text-center">
                <p className="text-3xl font-bold tracking-tight text-foreground">Find your next read</p>
            </div>

            <Carousel
                opts={{ align: "start" }}
                className="w-full max-w-sm md:max-w-3xl lg:max-w-5xl"
            >
                <CarouselContent className="-ml-4">
                    {books.map((book) => (
                        <CarouselItem key={book.id} className="pl-4 md:basis-1/2 lg:basis-1/3">
                            <div className="h-full p-1">
                                <ReturnBook book={book} />
                            </div>
                        </CarouselItem>
                    ))}
                </CarouselContent>

                <CarouselPrevious className="hidden md:flex" />
                <CarouselNext className="hidden md:flex" />
            </Carousel>

            <Button variant="outline" size="lg" className="w-full max-w-70"
             render={
                <Link to={'search'}>View More</Link>
            }
            
            />
        </div>
    );
};
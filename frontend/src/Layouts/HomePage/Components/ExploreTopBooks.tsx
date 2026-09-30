import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, BookOpen } from "lucide-react";
import image from "@/Images/PublicImages/image-2.jpg";

export const ExploreTopBooks = () => {
    return (
        <section
            className="relative flex min-h-112 items-center justify-center overflow-hidden"
            style={{
                backgroundImage: `linear-gradient(rgba(0,0,0,0.55), rgba(0,0,0,0.65)), url(${image})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                backgroundRepeat: "no-repeat",
            }}
        >
            <div className="pointer-events-none absolute inset-0 bg-linear-to-t from-black/40 via-transparent to-transparent" />

            <div className="relative z-10 mx-auto max-w-2xl px-6 py-16 text-center text-white">
                <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-sm font-medium backdrop-blur-sm">
                    <BookOpen className="size-4" />
                    Curated Collection
                </div>

                <h2 className="mb-4 text-4xl font-bold leading-tight tracking-tight md:text-5xl">
                    Find your next adventure
                </h2>

                <p className="mb-8 text-lg text-white/80 md:text-xl">
                    Discover thousands of titles handpicked for every reader.
                    Where would you like to go next?
                </p>

                <Button
                    render={
                        <Link to="search">
                            Explore Top Books
                            <ArrowRight className="size-4 transition-transform duration-200 group-hover/button:translate-x-0.5" />
                        </Link>
                    }
                    size="lg"
                    className="gap-2 rounded-full bg-primary px-8 text-primary-foreground shadow-lg shadow-primary/30 hover:bg-primary/90 hover:shadow-primary/50 transition-all duration-200"
                />

            </div>
        </section>
    );
};
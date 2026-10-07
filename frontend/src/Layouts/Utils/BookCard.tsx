import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { BookModel } from "@/models/BookModel";
import { ArrowRight, Feather } from "lucide-react";
import { Link } from "react-router-dom";
import { StarRating } from "./StarRating";

interface cardProps {
    book: BookModel,
    showRate?: boolean;
    stars?: number | null;
}
export function BookCard({ book, showRate, stars }: cardProps) {
    return (
        <Card className="my-2">
            <CardContent className="flex flex-col gap-6 p-6 md:flex-row">
                <img
                    src={book.img}
                    alt={`Cover of ${book.title}`}
                    className="aspect-2/3 w-44 shrink-0 self-center rounded-lg object-cover shadow-sm sm:w-52 md:w-56 md:self-start"
                />
                <div className="flex flex-1 flex-col justify-between">
                    <div>
                        <div className="flex flex-wrap items-center gap-3">
                            <h3 className="text-2xl font-bold tracking-tight text-foreground">
                                {book.title}
                            </h3>
                            {book.categories?.map((cat) => (
                                <Badge
                                    key={cat.id}
                                    variant="outline"
                                    className="bg-gold-50 text-sky-700 dark:bg-sky-950 dark:text-sky-300 p-4"
                                >
                                    {cat.name}
                                </Badge>
                            ))}
                        </div>

                        <div className="mt-2 flex items-center text-sm font-medium text-muted-foreground">
                            <Feather className="mr-2 h-4 w-4 opacity-70" />
                            {book.author}
                        </div>
                        <div className="mt-6 rounded-lg bg-card/50 p-5 shadow-inner border border-border/50">
                            <h4 className="mb-3 text-xs font-bold uppercase tracking-widest text-muted-foreground/80">
                                Synopsis
                            </h4>
                            <p className="line-clamp-4 text-sm leading-relaxed text-foreground/90">
                                {book.description}
                            </p>
                        </div>
                    </div>

                    {showRate ? (
                        <div className="mt-6 flex items-center gap-3">
                            <StarRating rating={stars} />
                            <span className="text-sm text-muted-foreground">
                                {stars != null ? `${stars.toFixed(1)} / 5` : "No ratings yet"}
                            </span>
                        </div>
                    ) : (
                        <div className="mt-6 flex md:justify-end">
                            <Button
                                size="lg"
                                className="w-full font-bold md:w-auto"
                                nativeButton={false}
                                render={
                                    <Link to={`/checkout/${book.id}`} className="flex items-center gap-2">
                                        View Details
                                        <ArrowRight className="h-4 w-4" />
                                    </Link>
                                }
                            />
                        </div>
                    )}
                </div>
            </CardContent>
        </Card>
    );
}
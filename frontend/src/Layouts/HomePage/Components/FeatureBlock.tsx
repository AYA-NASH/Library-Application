import { ReactNode } from "react";

interface FeatureBlockProps {
    title: string;
    description: string;
    image: string;
    imagePosition?: "left" | "right";
    actionButton?: ReactNode;
}

export const FeatureBlock = ({
    title,
    description,
    image,
    imagePosition = "left",
    actionButton,
}: FeatureBlockProps) => {
    return (
        <div className="flex w-full flex-col lg:flex-row">
            <div
                className={`min-h-100 w-full bg-cover bg-center lg:w-1/2 ${imagePosition === "right" ? "order-first lg:order-last" : "order-first"
                    }`}
                style={{ backgroundImage: `url(${image})` }}
                aria-hidden="true"
            />

            <div
                className={`flex w-full items-center justify-center p-8 lg:w-1/2 lg:p-16 ${imagePosition === "right" ? "lg:order-first" : "lg:order-last"
                    }`}
            >
                <div className="max-w-lg space-y-6">
                    <h2 className="text-3xl font-bold tracking-tight text-foreground md:text-4xl lg:text-5xl">
                        {title}
                    </h2>

                    <p className="text-lg text-muted-foreground">
                        {description}
                    </p>

                    {actionButton && (
                        <div>
                            {actionButton}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

import imageLeft from "@/Images/PublicImages/image-4.jpg";
import imageRight from "@/Images/PublicImages/image-1.jpg";
import { FeatureBlock } from "./FeatureBlock";
import { useAuthStore } from "@/store/useAuthStore";

export const Heros = () => {
    const isAuthenticated = useAuthStore((state) => !!state.token);

    return (
        <div className="flex flex-col">
            <FeatureBlock
                title="What have you been reading?"
                description="The library team would love to know what you have been reading. Whether it is to learn a new skill or grow within one, we will be able to provide the top content for you."
                image={imageLeft}
                imagePosition="left"
                actionButton={
                    <Button size="lg" className="px-8 text-base" render={
                        !isAuthenticated ? (
                            <Link to="/login">Sign up</Link>
                        ) : (
                            <Link to="/search">Explore Top Books</Link>
                        )
                    } />
                }
            />

            <FeatureBlock
                title="Our Collection is always Changing!"
                description="Try to check in daily as our collection is always changing! We work nonstop to provide the most accurate book selection possible for our students! We are diligent about our book selection and our books are always our top priority."
                image={imageRight}
                imagePosition="right"
            />
        </div>
    );
};
import { HomeCarousel } from "./Components/Carousel";
import { ExploreTopBooks } from "./Components/ExploreTopBooks";
import { Heros } from "./Components/Heros";
import { LibraryService } from "./Components/LibraryService";

export const HomePage = () => {
    return (
        <>
            <ExploreTopBooks />
            <HomeCarousel />
            <Heros />
            <LibraryService />
        </>
    );
};

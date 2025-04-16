import { ExploreTopBooks } from "./Components/Explore/ExploreTopBooks";
import { Heros } from "./Components/HerosComponent/Heros";
import { Carousel } from "./Components/HomePageCarousel/Carousel";
import { LibraryService } from "./Components/LibraryServicesComponent/LibraryService";

export const HomePage = () => {
    return (
        <>
            <ExploreTopBooks />
            <Carousel />
            <Heros />
            <LibraryService />
        </>
    );
};

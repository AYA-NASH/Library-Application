import { useEffect, useState } from "react";
import ReviewRequestModel from "../../../models/ReviewRequestModel";
import { ReviewModel } from "../../../models/ReviewModel";
import { SpinnerLoading } from "../../Utils/SpinnerLoading";
import { Pagination } from "../../Utils/Pagination";
import { Review } from "../../Utils/Review";

const baseUrl = import.meta.env.VITE_API_BASE_URL;

export const ReviewListPage = ()=>{
    
    const [reviews, setReviews] = useState<ReviewRequestModel[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [httpError, setHttpError] = useState(null);

    // Pagination
    const [currentPage, setCurrentPage] = useState(1);
    const [reviewsPerPage] = useState(5);
    const [totalPages, setTotalPages] = useState(0);
    const [totalAmountOfReviews, setTotalAmountOfReviews] = useState(0);

    const bookId = (window.location.pathname).split('/')[2];

    useEffect(() => {
            const fetchBookReviews = async () => {
                const url: string = baseUrl + `/api/reviews/search/findByBookId?bookId=${bookId}&page=${currentPage - 1}&size=${reviewsPerPage}`;
                const response = await fetch(url);
                if (!response.ok) {
                    throw new Error("Something went wrong!");
                }
                const responseJson = await response.json();
                const responseData = responseJson._embedded.reviews;
                
                setTotalAmountOfReviews(responseJson.page.totalElements);
                setTotalPages(responseJson.page.totalPages);
                
                const loadedReviews: ReviewModel[] = [];
    
                for (const key in responseData) {
                    loadedReviews.push({
                        id: responseData[key].id,
                        userEmail: responseData[key].userEmail,
                        date: responseData[key].date,
                        rating: responseData[key].rating,
                        rate: responseData[key].rate,
                        bookId: responseData[key].bookId,
                        reviewDescription: responseData[key].reviewDescription,
                    });
                }
    
                setReviews(loadedReviews);
                setIsLoading(false);
            };
            fetchBookReviews().catch((error: any) => {
                setIsLoading(false);
                setHttpError(error.message);
            });
        }, [currentPage]);
    
    if(isLoading){
        return(
            <SpinnerLoading />
        )
    }

    if(httpError){
        return(
            <div className="container m-5">
                <p>{httpError}</p>
            </div>
        )
    }

    const indexOfLastReview: number = currentPage * reviewsPerPage;
    const indexOfFirstReview: number = indexOfLastReview - reviewsPerPage;
    let lastItem =
        currentPage * reviewsPerPage <= totalAmountOfReviews
            ? currentPage * reviewsPerPage
            : totalAmountOfReviews;

    const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

    return(
        <div className="container m-5">
            <div>
                <h3>Comments: ({reviews.length})</h3>
            </div>
            <p>
                {indexOfFirstReview + 1} to {lastItem} of {totalAmountOfReviews} items:
            </p>
            <div className="row">
                {reviews.map(review =>(
                    <Review review={review} key={review.id}/>
                ))}
            </div>
            {totalPages > 1 && (
                <Pagination
                    currentPage={currentPage}
                    paginate={paginate}
                    totalPages={totalPages}
                />
            )}
       </div>
    );
}
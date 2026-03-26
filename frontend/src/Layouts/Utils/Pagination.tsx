import { FC } from "react";

export const Pagination: FC<{
    currentPage: number;
    totalPages: number;
    paginate: (page: number) => void;
}> = (props) => {
    const { currentPage, totalPages, paginate } = props;

    const pageNumbers = [];

    for (let i = Math.max(1, currentPage - 2); i <= Math.min(totalPages, currentPage + 2); i++) {
        pageNumbers.push(i);
    }

    if (totalPages <= 1) return null;

    return (
        <nav aria-label="Page navigation" className="mt-4">
            <ul className="pagination pagination-sm justify-content-center border-0">
                <li className={`page-item mx-1 ${currentPage === 1 ? "disabled" : ""}`}>
                    <button
                        className="page-link rounded-pill border-0 px-3 shadow-sm"
                        onClick={() => paginate(1)}
                        disabled={currentPage === 1}
                    >
                        &laquo; <span className="d-none d-sm-inline">First</span>
                    </button>
                </li>

                {pageNumbers.map((number) => (
                    <li
                        key={number}
                        className={`page-item mx-1 ${currentPage === number ? "active" : ""}`}
                    >
                        <button
                            onClick={() => paginate(number)}
                            className={`page-link rounded-circle border-0 d-flex align-items-center justify-content-center shadow-sm ${currentPage === number ? "bg-dark text-white" : "bg-light text-dark"
                                }`}
                            style={{ width: "36px", height: "36px" }}
                        >
                            {number}
                        </button>
                    </li>
                ))}

                <li className={`page-item mx-1 ${currentPage === totalPages ? "disabled" : ""}`}>
                    <button
                        className="page-link rounded-pill border-0 px-3 shadow-sm"
                        onClick={() => paginate(totalPages)}
                        disabled={currentPage === totalPages}
                    >
                        <span className="d-none d-sm-inline">Last</span> &raquo;
                    </button>
                </li>
            </ul>

            <div className="text-center mt-2">
                <small className="text-muted">
                    Page <strong>{currentPage}</strong> of {totalPages}
                </small>
            </div>
        </nav>
    );
};
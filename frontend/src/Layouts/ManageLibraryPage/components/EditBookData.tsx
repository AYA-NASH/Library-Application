import { BookModel } from "../../../models/BookModel";
import defaultBookImg from '../../../Images/BooksImages/book_cover_default_dark.png';

export const EditBookData: React.FC<{ book: BookModel}> = (props) => {
    return (
        <div className="p-3 position-relative">

            <button className="btn btn-light btn-sm position-absolute top-0 end-0 m-2 rounded-circle shadow-sm border" 
                title="Edit Book Details">
                <span style={{ color: '#6c757d' }}>✎</span>
            </button>

            <div className="row g-0">
               
                <div className="col-md-3">
                    <img
                        src={props.book.img ? props.book.img : defaultBookImg}
                        width="123"
                        height="196"
                        alt="book"
                        className="rounded shadow-sm"
                    />
                </div>

                <div className="col-md-9 d-flex flex-column justify-content-center">
                    <p className="text-primary mb-1 fw-bold">{props.book.author}</p>
                    <h3 className="card-title mb-2">{props.book.title}</h3>
                    
                    <div className="mt-2">

                        <p className="rounded-pill bg-info text-dark px-3 py-1 d-inline-block" >
                            Category: {props.book.category}
                        </p>
                    </div>
                </div>
            </div>
            
            <div className="row mt-3">
                <div className="col-12">
                    <p className="card-text text-secondary" style={{ fontSize: '0.95rem', lineHeight: '1.6' }}>
                        {props.book.description}
                    </p>
                </div>
            </div>


        </div>
    );
}


import { BookModel } from "../../../models/BookModel";
import { EditBookData } from "./EditBookData";
import { EditBookStatus } from "./EditBookStatus";

export const EditBook: React.FC<{book:BookModel, deleteBook: () => void, updateBook: () => void}> = (props) => {
    return (
        <div className="card mt-3 shadow p-3 mb-3 bg-body rounded">
            <div className="row g-0">
                <div className="col-md-8">
                    <EditBookData book={props.book} updateBook={props.updateBook}/>
                </div>

                <div className="col-md-4 border-start">
                    <EditBookStatus book={props.book} deleteBook={props.deleteBook} updateBook={props.updateBook}/>
                </div>
            </div>
        </div>
    );
}
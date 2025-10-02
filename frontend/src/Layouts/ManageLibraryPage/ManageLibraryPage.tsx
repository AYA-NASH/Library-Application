import { useState } from "react";
import { useAuth } from "../../Auth/AuthContext";
import { useNavigate } from "react-router-dom";
import { AdminMessages } from "./components/AdminMessages";

export const ManageLibraryPage = ()=>{
    
    const {user} = useAuth();

    const [changeQuantityOfBooksClick, setChangeQuantityOfBooksClick] = useState(false);
    const [messageClick, setMessageClick] = useState(false);
    
    function addBookClickFunction(){
        setChangeQuantityOfBooksClick(false);
        setMessageClick(false);
    }

    function changeQuantityOfBooksClickFunction(){
        setChangeQuantityOfBooksClick(true);
        setMessageClick(false);
    }

    function messagesClickFunction(){
        setChangeQuantityOfBooksClick(false);
        setMessageClick(true);
    }

    const navigate = useNavigate();

    if (user.role !== "ADMIN"){
        navigate("/"); 
    }

    return (
        <div className="container">
            <div className="mt-5">
                <h3>Manage Library</h3>
                <nav>
                    <div className="nav nav-tabs" id="nav-tab" role="tablist">
                        <button onClick={addBookClickFunction}
                            className="nav-link active"
                            id="nav-add-book-tab"
                            data-bs-toggle="tab"
                            data-bs-target = "#nav-add-book"
                            type="button"
                            role="tab"
                            aria-controls="nav-add-book"
                            aria-selected="false"
                        >
                            Add new Book
                        </button>

                        <button onClick={changeQuantityOfBooksClickFunction}
                            className="nav-link"
                            id="nav-quantity-tab"
                            data-bs-toggle="tab"
                            data-bs-target = "#nav-quantity"
                            type="button"
                            role="tab"
                            aria-controls="nav-quantity"
                            aria-selected="true"
                        >
                            Change quantity
                        </button>

                        <button onClick={messagesClickFunction}
                            className="nav-link"
                            id="nav-messgaes-tab"
                            data-bs-toggle="tab"
                            data-bs-target = "#nav-messgaes"
                            type="button"
                            role="tab"
                            aria-controls="nav-messgaes"
                            aria-selected="true"
                        >
                            Messages
                        </button>
                    </div>
                </nav>
                <div className="tab-content" id="nav-tabContent">
                    <div className="tab-pane fade show active"
                        id="nav-add-book"
                        role="tabpanel"
                        aria-labelledby="nav-add-book-tab"
                    >
                        Add new book
                    </div>

                    <div className="tab-pane fade"
                        id="nav-quantity"
                        role="tabpanel"
                        aria-labelledby="nav-quantity-tab"
                    >
                        {changeQuantityOfBooksClick ? <> Change quantity </> : <></>}
                    </div>

                    <div className="tab-pane fade"
                        id="nav-messgaes"
                        role="tabpanel"
                        aria-labelledby="nav-messages-tab"
                    >
                        {messageClick ? <AdminMessages/> : <></>}
                    </div>
                </div>
            </div>
        </div>
    );
}
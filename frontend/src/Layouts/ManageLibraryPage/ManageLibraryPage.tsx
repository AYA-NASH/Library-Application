import { useState } from "react";
import { useAuth } from "../../Auth/AuthContext";
import { useNavigate } from "react-router-dom";
import { AdminMessages } from "./components/AdminMessages";
import { AddNewBook } from "./components/AddNewBook";
import { AdminEditBooks } from "./components/AdminEditBooks";

export const ManageLibraryPage = ()=>{
    
    const {user} = useAuth();

    const [editBooksClick, setEditBooksClick] = useState(false);
    const [messageClick, setMessageClick] = useState(false);
    
    function addBookClickFunction(){
        setEditBooksClick(false);
        setMessageClick(false);
    }

    function editBooksClickFunction(){
        setEditBooksClick(true);
        setMessageClick(false);
    }

    function messagesClickFunction(){
        setEditBooksClick(false);
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

                        <button onClick={editBooksClickFunction}
                            className="nav-link"
                            id="nav-edit-tab"
                            data-bs-toggle="tab"
                            data-bs-target = "#nav-edit"
                            type="button"
                            role="tab"
                            aria-controls="nav-edit"
                            aria-selected="true"
                        >
                            Edit Books
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
                        <AddNewBook />
                    </div>

                    <div className="tab-pane fade"
                        id="nav-edit"
                        role="tabpanel"
                        aria-labelledby="nav-edit-tab"
                    >
                        {editBooksClick ? <AdminEditBooks /> : <></>}
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
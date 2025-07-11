import { Link } from "react-router-dom";
import { useAuth } from "../../../../Auth/AuthContext";
import "./LibraryService";

export const LibraryService = () => {
    const { user } = useAuth();
    
    return (
        <div className="container my-5">
            <div className="row p-4 align-items-center border shadow-lg">
                <div className="col-lg-7 p-3">
                    <h1 className="display-4 fw-bold">
                        Can't you find what you are looking for?
                    </h1>
                    <p className="lead">
                        If you cannot find what you are looking for, send or
                        library admin's a personal message!
                    </p>
                    <div className="d-grid gap-2 justify-content-md-start mb-4 mb-lg-3">
                        {!user ? 
                            <Link className="btn btn-dark btn-lg text-white" to="/login">
                                Sign up
                            </Link>
                            :
                            <Link className="btn btn-dark btn-lg text-white" to="#">
                                Library Services
                            </Link>
                        }
                        
                    </div>
                </div>
                <div className="col-lg-4 offset-lg-1 shadow-lg lost-image"></div>
            </div>
        </div>
    );
};

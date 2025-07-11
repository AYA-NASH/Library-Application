import { Link } from "react-router-dom";
import { useAuth } from "../../../../Auth/AuthContext";
import "./Heros.css";

export const Heros = () => {
    const { user } = useAuth();
    return (
        <div>
            <div className="d-none d-lg-block">
                <div className="row g-0 mt-5">
                    <div className="col-sm-6 col-md-6">
                        <div className="col-image-left"></div>
                    </div>

                    <div className="col-4 col-md-4 container d-flex justify-conent-center align-items-center">
                        <div className="ml-2">
                            <h1>What you have been reading?</h1>
                            <p className="lead">
                                The library team would love to know what you
                                have been reading. whether it is to learn a new
                                skill or grow within one, we will be able to
                                provide the top content for you.
                            </p>
                            {!user ? 
                                <Link
                                    className="btn btn-dark btn-lg text-white"
                                    to="/login"
                                > 
                                    Sign up
                                </Link>
                            :
                                <Link
                                className="btn btn-dark btn-lg text-white"
                                to="/search"
                                > 
                                    Explore Top Books
                                </Link>
                            }
                            
                        </div>
                    </div>
                </div>

                <div className="row g-0">
                    <div className="col-4 col-md-4 container d-flex justify-conent-center align-items-center">
                        <div className="ml-2">
                            <h1>Our Collection is always Changing!</h1>
                            <p className="lead">
                                Try to check in daily as our collection is
                                always changing! We work nonstop to provide the
                                most accurate book selection possible for our
                                Luv 2 Read students! We are dilligent about our
                                book selection and our books are always our top
                                priority.
                            </p>
                        </div>
                    </div>
                    <div className="col-sm-6 col-md-6">
                        <div className="col-image-right"></div>
                    </div>
                </div>
            </div>

            {/* Mobile View */}

            <div className="d-lg-none">
                <div className="container">
                    <div className="m-2">
                        <div className="col-image-left"></div>
                        <div className="mt-2">
                            <h1>What you have been reading?</h1>
                            <p className="lead">
                                The library team would love to know what you
                                have been reading. whether it is to learn a new
                                skill or grow within one, we will be able to
                                provide the top content for you.
                            </p>
                            {!user ?
                                <Link
                                    className="btn btn-dark btn-lg text-white"
                                    to="/login"
                                >
                                    Sign up
                                </Link>
                                :
                                <Link
                                    className="btn btn-dark btn-lg text-white"
                                    to="/search"
                                >
                                    Explore Top Books
                                </Link>}
                        </div>
                    </div>

                    <div className="m-2">
                        <div className="col-image-right"></div>
                        <div className="mt-2">
                            <h1>Our Collection is always Changing!</h1>
                            <p className="lead">
                                Try to check in daily as our collection is
                                always changing! We work nonstop to provide the
                                most accurate book selection possible for our
                                Luv 2 Read students! We are dilligent about our
                                book selection and our books are always our top
                                priority.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

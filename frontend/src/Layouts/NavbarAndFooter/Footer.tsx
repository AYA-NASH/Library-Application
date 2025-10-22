import { Link } from "react-router-dom";

const mainColor = {
    backgroundColor: "#0f0f0f",
};
export const Footer = () => {
    return (
        <div style={mainColor}>
            <footer
                className="container d-flex flex-wrap justify-content-between align-items-center py-5"
                style={mainColor}
            >
                <p className="col-md-4 mb-0 text-white">
                    @ Eample Library App, Inc
                </p>
                <ul className="nav navbar-dark col-md-4 jsutify-content-end">
                    <li className="nav-item">
                        <Link to={'/'} className="nav-link px-2 text-white">
                            Home
                        </Link>
                    </li>
                    <li className="nav-item">
                        <Link to="search" className="nav-link px-2 text-white">
                            Search Books
                        </Link>
                    </li>
                </ul>
            </footer>
        </div>
    );
};

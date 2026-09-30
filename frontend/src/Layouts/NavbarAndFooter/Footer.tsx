import { Link } from "react-router-dom";

export const Footer = () => {
    return (
        <div className="bg-neutral-950 text-neutral-300 mt-auto">
            <footer className="mx-auto flex flex-col items-center justify-between gap-4 px-4 py-8 md:flex-row md:px-8">
                <p className="text-sm">
                    &copy; {new Date().getFullYear()} BookVerse, Inc.
                </p>
                <ul className="flex items-center gap-6">
                    <li>
                        <Link 
                            to="/" 
                            className="text-sm font-medium transition-colors hover:text-primary focus:text-primary focus:outline-none"
                        >
                            Home
                        </Link>
                    </li>
                    <li>
                        <Link 
                            to="/search" 
                            className="text-sm font-medium transition-colors hover:text-primary focus:text-primary focus:outline-none"
                        >
                            Search Books
                        </Link>
                    </li>
                </ul>
            </footer>
        </div>
    );
};
import { useState } from "react";

type BookFilterBarProps = {
    categories: string[];
    initialCategory?: string;
    initialText?: string;
    onSearch: (params: { text?: string; category?: string }) => void;
};

export const BookFilterBar: React.FC<BookFilterBarProps> = ({
    categories,
    initialCategory = "All",
    initialText = "",
    onSearch,
}) => {
    const [searchText, setSearchText] = useState(initialText);
    const [selectedCategory, setSelectedCategory] = useState(initialCategory);

    const handleSearchClick = () => {
        onSearch({
            text: searchText || undefined,
            category: selectedCategory !== "All" ? selectedCategory : undefined,
        });
    };

    const handleCategorySelect = (category: string) => {
        setSelectedCategory(category);
        // Optional: immediately trigger search on category change
        onSearch({
            text: searchText || undefined,
            category: category !== "All" ? category : undefined,
        });
    };

    return (
        <div className="row mb-3">
            <div className="col-6">
                <div className="d-flex">
                    <input
                        type="search"
                        className="form-control me-2"
                        placeholder="Search"
                        value={searchText}
                        onChange={(e) => setSearchText(e.target.value)}
                    />
                    <button
                        className="btn btn-outline-success"
                        onClick={handleSearchClick}
                    >
                        Search
                    </button>
                </div>
            </div>

            <div className="col-4">
                <div className="dropdown">
                    <button
                        className="btn btn-secondary dropdown-toggle"
                        type="button"
                        data-bs-toggle="dropdown"
                        aria-expanded="false"
                    >
                        {selectedCategory}
                    </button>
                    <ul className="dropdown-menu">
                        {categories.map((category, idx) => (
                            <li key={idx}>
                                <a
                                    href="#"
                                    className="dropdown-item"
                                    onClick={() => handleCategorySelect(category)}
                                >
                                    {category}
                                </a>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    );
};

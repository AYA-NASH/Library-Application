import { useEffect, useState } from "react";
import Select from "react-select";

type CategoryOption = {
    value: number;
    label: string;
};

type BookFilterBarProps = {
    categories: CategoryOption[];
    initialCategoryId?: number;
    initialText?: string;
    onSearch: (params: { text?: string; categoryId?: number }) => void;
};

export const BookFilterBar: React.FC<BookFilterBarProps> = ({
    categories,
    initialCategoryId,
    initialText = "",
    onSearch,
}) => {
    const [searchText, setSearchText] = useState(initialText);
    const [selectedCategory, setSelectedCategory] = useState<CategoryOption | null>(null);

    useEffect(() => {
        setSearchText(initialText);
    }, [initialText]);

    useEffect(() => {
        const found = categories.find((cat) => cat.value === initialCategoryId);
        setSelectedCategory(found || null);
    }, [initialCategoryId, categories]);

    const triggerSearch = (text: string, category: CategoryOption | null) => {
        onSearch({
            text: text.trim() || undefined,
            categoryId: category?.value,
        });
    };

    const handleSearchClick = () => {
        triggerSearch(searchText, selectedCategory);
    };

    const handleCategoryChange = (selectedOption: CategoryOption | null) => {
        setSelectedCategory(selectedOption);
        triggerSearch(searchText, selectedOption);
    };

    return (
        <div className="row mb-3 align-items-end g-3">
            <div className="col-md-6">
                <div className="d-flex">
                    <input
                        type="search"
                        className="form-control me-2"
                        placeholder="Search for a book..."
                        value={searchText}
                        onChange={(e) => setSearchText(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === "Enter") {
                                handleSearchClick();
                            }
                        }}
                    />
                    <button
                        className="btn btn-outline-success"
                        onClick={handleSearchClick}
                    >
                        Search
                    </button>
                </div>
            </div>

            <div className="col-md-4">
                <Select
                    options={categories}
                    value={selectedCategory}
                    onChange={(selectedOption) =>
                        handleCategoryChange(selectedOption as CategoryOption | null)
                    }
                    isClearable
                    placeholder="Search by category..."
                    classNamePrefix="react-select"
                />
            </div>
        </div>
    );
};

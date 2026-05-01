import { useEffect, useState } from "react";
import Select from "react-select";
import { CategoryReference } from "../../models/CategoryModel";



type BookFilterBarProps = {
    categories: CategoryReference[];
    initialCategoryId?: number;
    initialText?: string;
    onSearch: (params: { text?: string; categoryId?: number }) => void;
    isLoading?: boolean;
};

export const BookFilterBar: React.FC<BookFilterBarProps> = ({
    categories,
    initialCategoryId,
    initialText = "",
    onSearch,
    isLoading = false,
}) => {
    const [searchText, setSearchText] = useState(initialText);
    const [selectedCategory, setSelectedCategory] = useState<CategoryReference | null>(null);

    useEffect(() => {
        setSearchText(initialText);
    }, [initialText]);

    useEffect(() => {
        const found = categories.find((cat) => cat.id === initialCategoryId);
        setSelectedCategory(found || null);
    }, [initialCategoryId, categories]);

    const triggerSearch = (text: string, category: CategoryReference | null) => {
        onSearch({
            text: text.trim() || undefined,
            categoryId: category?.id,
        });
    };

    const handleSearchClick = () => {
        triggerSearch(searchText, selectedCategory);
    };

    const handleCategoryChange = (selectedOption: CategoryReference | null) => {
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
                    getOptionLabel={(option: CategoryReference) => option.name}
                    getOptionValue={(option: CategoryReference) => option.id.toString()}
                    value={selectedCategory}
                    onChange={(selectedOption) =>
                        handleCategoryChange(selectedOption as CategoryReference | null)
                    }
                    isClearable
                    placeholder="Search by category..."
                    classNamePrefix="react-select"
                    isLoading={isLoading}
                />
            </div>
        </div>
    );
};

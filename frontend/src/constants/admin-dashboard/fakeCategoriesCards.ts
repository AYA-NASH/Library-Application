import { CategoryDetails } from "@/models/CategoryModel";
import { SummaryCardItem } from "@/models/dashboard/SummaryCard";

export const categoriesCards: SummaryCardItem[] = [
    {
        title: "Total Categories",
        value: 8,
    },
    {
        title: "Largest Category",
        value: "Computer Science",
    },
    {
        title: "Average Books",
        value: 14,
    },
    {
        title: "Empty Categories",
        value: 0,
    },
];

export const fakeCategories: CategoryDetails[] = [
    {
        id: 1,
        name: "Computer Science",
        booksCount: 24,
    },
    {
        id: 2,
        name: "Fiction",
        booksCount: 18,
    },
    {
        id: 3,
        name: "History",
        booksCount: 12,
    },
    {
        id: 4,
        name: "Science",
        booksCount: 16,
    },
    {
        id: 5,
        name: "Biography",
        booksCount: 9,
    },
    {
        id: 6,
        name: "Philosophy",
        booksCount: 7,
    },
    {
        id: 7,
        name: "Business",
        booksCount: 14,
    },
    {
        id: 8,
        name: "Psychology",
        booksCount: 11,
    },
];

export const categorySortOptions = [
    {
        value: "name-asc",
        label: "Name (A-Z)",
    },
    {
        value: "name-desc",
        label: "Name (Z-A)",
    },
    {
        value: "books-asc",
        label: "Books Count (Low to High)",
    },
    {
        value: "books-desc",
        label: "Books Count (High to Low)",
    },
];
import { TableFilterConfig } from "../TableFilterConfig";

export const booksFiltersData: TableFilterConfig[] = [
    {
        id: "status",
        title: "Status",
        type: "checkbox",
        options: [
            { value: "available", label: "Available", count: 3 },    // Clean Code, Pragmatic, Brief History
            { value: "out_of_stock", label: "Out of Stock", count: 2 }, // Atomic Habits, Ancient World
            { value: "low_stock", label: "Low Stock", count: 2 },       // Dune, Thinking Fast/Slow
            { value: "archived", label: "Archived", count: 1 },        // Old Library Manual
        ],
    },
    {
        id: "category",
        title: "Categories",
        type: "checkbox",
        options: [
            { value: "computer_science", label: "Computer Science", count: 2 },
            { value: "fiction", label: "Fiction", count: 1 },
            { value: "history", label: "History", count: 2 },
            { value: "biography", label: "Biography", count: 2 }, // Atomic Habits, Thinking Fast/Slow
            { value: "science", label: "Science", count: 2 },     // Brief History, Thinking Fast/Slow
        ],
    },
    {
        id: "format",
        title: "Format",
        type: "radio",
        options: [
            { value: "digital", label: "Digital Only", count: 2 }, // Atomic Habits, Brief History
            { value: "physical", label: "Physical Only", count: 3 }, // Dune, Ancient World, Manual
            { value: "both", label: "Both Formats", count: 3 },    // Clean Code, Pragmatic, Thinking
        ],
    },
];
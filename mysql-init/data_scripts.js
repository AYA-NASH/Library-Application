import fetch from "node-fetch";
import mysql from "mysql2/promise";
import bcrypt from "bcrypt";
import { faker } from "@faker-js/faker";

// -----------------------------
// 1. DB CONNECTION (Modular & UTF8 safe)
// -----------------------------
export async function connectDB() {
    return await mysql.createConnection({
        host: process.env.DB_HOST || "mysql",
        port: process.env.DB_PORT || 3306,
        user: process.env.DB_USER || "library",
        password: process.env.DB_PASSWORD || "library",
        database: process.env.DB_NAME || "books_library",
        charset: "utf8mb4"
    });
}

// -----------------------------
// 2. BOOKS SEEDING
// -----------------------------
const categories = ["backend", "frontend", "Data", "DevOps"];
const MAX_RESULTS = 20;


async function fetchBooksByCategory(category) {
    const url = `https://www.googleapis.com/books/v1/volumes?q=intitle:${category}&maxResults=${MAX_RESULTS}`;

    const res = await fetch(url);
    if (!res.ok) {
        console.error("Google API error:", res.status);
        return [];
    }

    const data = await res.json();
    return (data.items || []).filter(item => {
        const info = item.volumeInfo;
        const access = item.accessInfo;

        return info.imageLinks?.thumbnail &&
            access.pdf?.isAvailable &&
            access.viewability && access.viewability !== "NONE";
    });
}

function sanitizeText(text, maxLength = 500) {
    if (!text) return null;
    return text.substring(0, maxLength);
}

async function insertBook(db, book, category) {
    const info = book.volumeInfo;
    const title = sanitizeText(info.title, 255) || "Unknown";
    const author = sanitizeText(info.authors?.[0], 255) || "Unknown";
    const description = sanitizeText(info.description, 500);
    const copies = 5;
    const copies_available = 5;
    const thumbnail = info.imageLinks.thumbnail;

    await db.execute(
        "INSERT INTO book (title, author, description, copies, copies_available, category, img_url) VALUES (?, ?, ?, ?, ?, ?, ?)",
        [title, author, description, copies, copies_available, category, thumbnail]
    );
}

async function seedBooks(db) {
    console.log("Fetching and inserting books...");
    for (const category of categories) {
        const books = await fetchBooksByCategory(category);
        for (const book of books) {
            await insertBook(db, book, category);
        }
        console.log(`Inserted ${books.length} books for category ${category}`);
    }
}

// -----------------------------
// 3. USERS SEEDING
// -----------------------------
async function hashPassword(raw) {
    return await bcrypt.hash(raw, 12);
}

async function insertUser(db, username, email, rawPassword, role) {
    const hashed = rawPassword ? await hashPassword(rawPassword) : null;
    await db.execute(
        "INSERT INTO users (username, email, password, role) VALUES (?, ?, ?, ?)",
        [username, email, hashed, role]
    );
}

async function seedUsers(db) {
    console.log("Creating admin, demo user, and fake users...");

    await insertUser(db, "App Admin", "admin@example.com", "admin123", "ADMIN");
    await insertUser(db, "Demo User", "demo@example.com", "demo123", "USER");

    for (let i = 0; i < 20; i++) {
        const name = faker.person.fullName();
        const email = faker.internet.email({ firstName: name.split(" ")[0] });
        await insertUser(db, name, email, "password123", "USER");
    }

    console.log("Users inserted successfully.");
}

// -----------------------------
// 4. REVIEWS SEEDING
// -----------------------------
async function insertReviews(db, books, users) {
    console.log("Inserting reviews...");
    for (const book of books) {
        const reviewCount = faker.number.int({ min: 1, max: 5 });
        for (let i = 0; i < reviewCount; i++) {
            const user = faker.helpers.arrayElement(users);
            const rating = faker.number.int({ min: 1, max: 5 });
            const reviewText = sanitizeText(faker.lorem.paragraphs(faker.number.int({ min: 1, max: 2 })), 255);
            const reviewRate = faker.number.int({ min: 0, max: 5 });

            await db.execute(
                "INSERT INTO review (user_email, date, rating, book_id, review_description, rate) VALUES (?, NOW(), ?, ?, ?, ?)",
                [user.email, rating, book.id, reviewText, reviewRate]
            );
        }
    }
    console.log("Reviews inserted!");
}

// -----------------------------
// 5. CHECKOUT & HISTORY SEEDING
// -----------------------------
async function insertCheckoutsAndHistory(db, books, users) {
    console.log("Inserting checkouts and history...");
    for (const book of books) {
        const user = faker.helpers.arrayElement(users);
        if (!user) continue;

        const checkoutDate = faker.date.past(1);
        const returnDate = new Date(checkoutDate);
        returnDate.setDate(checkoutDate.getDate() + 7);

        const returned = faker.datatype.boolean();

        if (returned) {
            const actualReturnDate = new Date(returnDate);
            actualReturnDate.setDate(returnDate.getDate() + faker.number.int({ min: 0, max: 7 }));

            await db.execute(
                "INSERT INTO history (user_email, checkout_date, returned_date, title, author, description, img_url) VALUES (?, ?, ?, ?, ?, ?, ?)",
                [
                    user.email,
                    checkoutDate.toISOString().split("T")[0],
                    actualReturnDate.toISOString().split("T")[0],
                    book.title,
                    book.author,
                    book.description,
                    book.img_url
                ]
            );
        } else {
            await db.execute(
                "INSERT INTO checkout (user_email, checkout_date, return_date, book_id) VALUES (?, ?, ?, ?)",
                [
                    user.email,
                    checkoutDate.toISOString().split("T")[0],
                    returnDate.toISOString().split("T")[0],
                    book.id
                ]
            );
        }
    }
}

// -----------------------------
// 6. MESSAGES SEEDING
// -----------------------------
async function insertMessages(db, users, admins, count = 10) {
    if (admins.length === 0) {
        console.warn("No admin users found. Cannot insert messages.");
        return;
    }

    console.log("Inserting messages...");
    for (let i = 0; i < count; i++) {
        const user = faker.helpers.arrayElement(users);
        const admin = faker.helpers.arrayElement(admins);
        const title = faker.lorem.words(3);
        const question = faker.lorem.sentences(faker.number.int({ min: 1, max: 3 }));
        const closed = faker.datatype.boolean();
        const response = closed ? faker.lorem.sentences(faker.number.int({ min: 1, max: 2 })) : null;

        await db.execute(
            "INSERT INTO messages (user_email, title, question, admin_email, response, closed) VALUES (?, ?, ?, ?, ?, ?)",
            [user.email, title, question, admin.email, response, closed ? 1 : 0]
        );
    }
    console.log("Messages inserted!");
}

// -----------------------------
// 7. PAYMENTS SEEDING
// -----------------------------
async function insertPayments(db, users) {
    console.log("Inserting payments...");
    for (const user of users) {
        const amount = user.role === "USER" ? 0 : faker.number.int({ min: 0, max: 50 });
        await db.execute(
            "INSERT INTO payment (user_email, amount) VALUES (?, ?)",
            [user.email, amount]
        );
    }
    console.log("Payments inserted!");
}

// -----------------------------
// 8. MAIN SEED FUNCTION
// -----------------------------
async function main() {
    const db = await connectDB();

    await seedBooks(db);
    await seedUsers(db);

    const [users] = await db.execute("SELECT id, email, role FROM users");
    const admins = users.filter(u => u.role === "ADMIN");
    const normalUsers = users.filter(u => u.role === "USER");
    const [books] = await db.execute("SELECT id, title, author, description, img_url FROM book");

    await insertReviews(db, books, normalUsers);
    await insertCheckoutsAndHistory(db, books, normalUsers);
    await insertMessages(db, normalUsers, admins, 15);
    await insertPayments(db, users);

    console.log("All seeding done!");
    await db.end();
}

main();

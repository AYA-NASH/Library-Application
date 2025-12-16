import { useEffect, useRef, useState } from "react";
import { useAuth } from "../../../Auth/AuthContext";
import { useImageUpload } from "../../Hooks/useUploadImage";

const baseUrl = import.meta.env.VITE_API_BASE_URL;

export const AddNewBook = () => {
    const { user, token } = useAuth();

    // New Book
    const [title, setTitle] = useState("");
    const [author, setAuthor] = useState("");
    const [decscription, setDescription] = useState("");
    const [copies, setCopies] = useState(0);
    const [category, setCategory] = useState("Category");

    const fileInputRef = useRef<HTMLInputElement | null>(null);

    const {
        file: selectedImage,
        preview: imagePreview,
        error: imageError,
        selectFile,
        clearFile,
    } = useImageUpload({
        maxSizeMB: 5,
    });


    // Displays
    const [displayWarning, setDisplayWarning] = useState(false);
    const [displaySuccess, setDisplaySuccess] = useState(false);

    function categoryField(value: string) {
        setCategory(value);
    }

    async function submitNewBook() {
        const url = `${baseUrl}/admin/secure/add/book`;
        if (
            user &&
            title !== "" &&
            author != "" &&
            category !== "Category" &&
            decscription !== "" &&
            copies >= 0
        ) {
            const formData = new FormData();

            formData.append("title", title);
            formData.append("author", author);
            formData.append("description", decscription);
            formData.append("copies", copies.toString());
            formData.append("category", category);
            if (selectedImage) {
                formData.append("image", selectedImage);
            }

            const requestOptions = {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                body: formData,
            };

            const submitNewBookResponse = await fetch(url, requestOptions);

            if (!submitNewBookResponse.ok) {
                throw new Error("something went wrong");
            }

            setTitle("");
            setAuthor("");
            setDescription("");
            setCopies(0);
            setCategory("Category");

            clearFile();

            setDisplayWarning(false);
            setDisplaySuccess(true);
        } else {
            setDisplayWarning(true);
            setDisplaySuccess(false);
        }
    }

    useEffect(() => {
        return () => {
            if (imagePreview) {
                URL.revokeObjectURL(imagePreview);
            }
        };
    }, [imagePreview]);

    return (
        <div className="container mt-5 mb-3">
            {displayWarning && (
                <div className="alert alert-danger" role="alert">
                    All fields must be filled out.
                </div>
            )}

            {displaySuccess && (
                <div className="alert alert-success" role="alert">
                    Book added successfully.
                </div>
            )}

            <div className="card">
                <div className="card-header">Add a new book</div>

                <div className="card-body">
                    <form method="POST">
                        <div className="row">
                            <div className="col-md-6 mb-3">
                                <label className="form-label">Title</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    name="title"
                                    required
                                    onChange={(e) => setTitle(e.target.value)}
                                    value={title}
                                />
                            </div>

                            <div className="col-md-3 mb-3">
                                <label className="form-label">Author</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    name="author"
                                    required
                                    onChange={(e) => setAuthor(e.target.value)}
                                    value={author}
                                />
                            </div>

                            <div className="col-md-3 mb-3">
                                <label className="form-label">Category</label>
                                <button
                                    className="form-control btn btn-dark dropdown-toggle"
                                    type="button"
                                    id="dropdownMenuButton1"
                                    data-bs-toggle="dropdown"
                                    aria-expanded="false"
                                >
                                    {category}
                                </button>
                                <ul
                                    id="addNewBookId"
                                    className="dropdown-menu"
                                    aria-labelledby="dropdownMenuButton1"
                                >
                                    <li>
                                        <a
                                            onClick={() => categoryField("FE")}
                                            className="dropdown-item"
                                        >
                                            Front End
                                        </a>
                                    </li>
                                    <li>
                                        <a
                                            onClick={() => categoryField("BE")}
                                            className="dropdown-item"
                                        >
                                            Back End
                                        </a>
                                    </li>
                                    <li>
                                        <a
                                            onClick={() =>
                                                categoryField("Data")
                                            }
                                            className="dropdown-item"
                                        >
                                            Data
                                        </a>
                                    </li>
                                    <li>
                                        <a
                                            onClick={() =>
                                                categoryField("DevOps")
                                            }
                                            className="dropdown-item"
                                        >
                                            DevOps
                                        </a>
                                    </li>
                                </ul>
                            </div>

                            <div className="col-md-12 mb-3">
                                <label className="form-label">
                                    {" "}
                                    Description{" "}
                                </label>
                                <textarea
                                    className="form-control"
                                    id="exampleFormControlTextarea1"
                                    rows={3}
                                    onChange={(e) =>
                                        setDescription(e.target.value)
                                    }
                                    value={decscription}
                                ></textarea>
                            </div>

                            <div className="col-md-3 mb-3">
                                <label className="form-label">Copies</label>
                                <input
                                    type="number"
                                    className="form-control"
                                    name="Copies"
                                    required
                                    onChange={(e) =>
                                        setCopies(Number(e.target.value))
                                    }
                                    value={copies}
                                />
                            </div>
                            
                        <div className="mb-3">
                            <label className="form-label">Book Image</label>

                            <div className="d-flex align-items-center">
                                <input
                                    type="file"
                                    accept="image/*"
                                    ref={fileInputRef}
                                    id="book-image-upload"
                                    onChange={(e) => {
                                        if (e.target.files && e.target.files.length > 0) {
                                            selectFile(e.target.files[0]);
                                        }
                                    }}
                                    style={{ display: "none" }}
                                />

                                <label htmlFor="book-image-upload" className="btn btn-outline-dark me-2 mb-0">
                                    Choose Image
                                </label>

                                {selectedImage && (
                                    <span className="text-truncate" style={{ maxWidth: "200px" }}>
                                        {selectedImage.name}
                                    </span>
                                )}
                            </div>

                            {imageError && (
                                <div className="alert alert-danger mt-2 py-1" role="alert">
                                    {imageError}
                                </div>
                            )}

                            {imagePreview && (
                                <div
                                    className="position-relative mt-3 d-inline-block"
                                    style={{ borderRadius: "0.5rem", overflow: "hidden", border: "1px solid #ddd" }}
                                >
                                    <img
                                        src={imagePreview}
                                        alt="Book preview"
                                        className="img-fluid"
                                        style={{ maxWidth: "200px", maxHeight: "300px", objectFit: "cover" }}
                                    />

                                    <button
                                        type="button"
                                        className="btn btn-danger btn-sm position-absolute top-0 end-0 m-1 p-0 d-flex justify-content-center align-items-center"
                                        style={{
                                            width: "25px",
                                            height: "25px",
                                            borderRadius: "50%",
                                            fontWeight: "bold",
                                            lineHeight: "1",
                                        }}
                                        onClick={()=>{
                                            clearFile();
                                            if (fileInputRef.current) {
                                                fileInputRef.current.value = "";
                                            }
                                        }}
                                    >
                                        ×
                                    </button>
                                </div>
                            )}
                        </div>


                            <div>
                                <button
                                    type="button"
                                    className="btn btn-primary mt-3"
                                    onClick={submitNewBook}
                                >
                                    Add Book
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

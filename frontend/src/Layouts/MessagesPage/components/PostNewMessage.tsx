import { useState } from "react";
import { useAddUserMessage } from "../../../api/hooks/LibraryServiceHooks/useMessage";

export const PostNewMessage = () => {
    const [title, setTitle] = useState("");
    const [question, setQuestion] = useState("");
    const [displayWarning, setDisplayWarning] = useState(false);

    const { mutate: addMessage, isPending } = useAddUserMessage();

    function submitNewQuestion() {
        if (title.trim() !== "" && question.trim() !== "") {
            addMessage({ title, question }, {
                onSuccess: () => {
                    setTitle("");
                    setQuestion("");
                    setDisplayWarning(false);
                }
            });
        } else {
            setDisplayWarning(true);
        }
    }

    return (
        <div className="card border-0 shadow-sm rounded-4 overflow-hidden">
            <div className="card-header bg-white border-bottom py-3">
                <h5 className="mb-0 fw-semibold text-primary">Submit a New Inquiry</h5>
                <small className="text-muted">Our admin team typically responds within 24 hours.</small>
            </div>
            <div className="card-body p-4">
                <form>
                    <div className="mb-4">
                        <label className="form-label fw-bold text-secondary small text-uppercase">Subject</label>
                        <input
                            type="text"
                            className="form-control form-control-lg border-2"
                            placeholder="What can we help you with?"
                            onChange={(e) => setTitle(e.target.value)}
                            value={title}
                        />
                    </div>
                    <div className="mb-4">
                        <label className="form-label fw-bold text-secondary small text-uppercase">Detailed Description</label>
                        <textarea
                            className="form-control border-2"
                            rows={5}
                            placeholder="Please provide as much detail as possible..."
                            onChange={(e) => setQuestion(e.target.value)}
                            value={question}
                        />
                    </div>
                    <button
                        type="button"
                        className="btn btn-primary btn-lg px-5 rounded-pill shadow-sm"
                        onClick={submitNewQuestion}
                        disabled={isPending}
                    >
                        {isPending ? "Sending Ticket..." : "Post Message"}
                    </button>
                </form>
            </div>
        </div>
    );
};
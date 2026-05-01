import { useState } from "react";
import { AdminMessageView } from "../../../models/MessageModel";
import { useAdminReply } from "../../../api/hooks/LibraryServiceHooks/useMessage";

export const AdminMessage: React.FC<{ message: AdminMessageView }> = ({ message }) => {
    const [response, setResponse] = useState('');
    const [displayingWarning, setDisplayWarning] = useState(false);

    const { mutate: sendReply, isPending } = useAdminReply();

    function submitBtn() {
        if (message.id && response.trim() !== '') {
            sendReply({ messageId: message.id, response });
            setDisplayWarning(false);
            setResponse('');
        } else {
            setDisplayWarning(true);
        }
    }

    return (
        <div className="card border-0 shadow-sm rounded-4 mb-4 overflow-hidden border-start border-4 border-warning">
            <div className="card-body p-4">
                <div className="d-flex justify-content-between align-items-center mb-3">
                    <h5 className="fw-bold mb-0 text-dark">
                        <span className="text-secondary fw-light me-2">Case #{message.id}</span>
                        {message.title}
                    </h5>
                    <span className="badge bg-warning-subtle text-warning rounded-pill px-3">Pending Action</span>
                </div>

                <div className="bg-light p-3 rounded-3 mb-4">
                    <div className="d-flex align-items-center mb-2">
                        <i className="bi bi-person-circle text-secondary me-2"></i>
                        <span className="fw-semibold small text-muted">{message.userEmail}</span>
                    </div>
                    <p className="mb-0 text-dark">{message.question}</p>
                </div>

                <hr className="opacity-10" />

                <div className="mt-4">
                    <h6 className="fw-bold text-primary mb-3">
                        <i className="bi bi-reply-all-fill me-2"></i>Draft Response
                    </h6>
                    <form>
                        {displayingWarning && (
                            <div className="alert alert-danger d-flex align-items-center rounded-3" role="alert">
                                <i className="bi bi-exclamation-triangle-fill me-2"></i>
                                <div>Please enter a response before submitting.</div>
                            </div>
                        )}
                        <div className="mb-3">
                            <textarea
                                className="form-control border-2 shadow-none"
                                rows={4}
                                placeholder="Type your official response here..."
                                onChange={e => setResponse(e.target.value)}
                                value={response}
                                disabled={isPending}
                                style={{ borderRadius: '12px' }}
                            ></textarea>
                        </div>
                        <div className="d-flex justify-content-end">
                            <button
                                type="button"
                                className="btn btn-primary px-4 py-2 rounded-pill fw-bold shadow-sm"
                                onClick={submitBtn}
                                disabled={isPending}
                            >
                                {isPending ? (
                                    <>
                                        <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                                        Sending...
                                    </>
                                ) : "Send Official Response"}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};
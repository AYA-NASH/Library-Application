import { useState } from "react";
import { PostNewMessage } from "./components/PostNewMessage";
import { Messages } from "./components/Messages";

export const MessagesPage = () => {
    const [activeTab, setActiveTab] = useState<'post' | 'view'>('post');

    return (
        <div className="container py-5">
            <div className="row justify-content-center">
                <div className="col-lg-10">
                    <div className="d-flex justify-content-between align-items-center mb-4">
                        <h2 className="fw-bold text-dark">Support Center</h2>
                        <nav className="nav nav-pills bg-light p-1 rounded-pill shadow-sm">
                            <button
                                onClick={() => setActiveTab('post')}
                                className={`nav-link rounded-pill px-4 ${activeTab === 'post' ? 'active shadow-sm' : 'text-secondary'}`}
                            >
                                <i className="bi bi-plus-circle me-2"></i>New Ticket
                            </button>
                            <button
                                onClick={() => setActiveTab('view')}
                                className={`nav-link rounded-pill px-4 ${activeTab === 'view' ? 'active shadow-sm' : 'text-secondary'}`}
                            >
                                <i className="bi bi-chat-left-text me-2"></i>My History
                            </button>
                        </nav>
                    </div>

                    <div className="animate__animated animate__fadeIn">
                        {activeTab === 'post' ? <PostNewMessage /> : <Messages />}
                    </div>
                </div>
            </div>
        </div>
    );
};
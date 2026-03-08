import { useEffect, useState } from "react";
import { useAuth } from "../../Auth/AuthContext";
import { useNavigate, useSearchParams } from "react-router-dom";
import { AdminMessages } from "./components/AdminMessages";
import { AddNewBook } from "./components/AddNewBook";
import { AdminEditBooks } from "./components/AdminEditBooks";

type AdminTab = "add" | "edit" | "messages";

const TAB_PARAM = "tab";
const VALID_TABS: AdminTab[] = ["add", "edit", "messages"];

function tabFromSearchParams(searchParams: URLSearchParams): AdminTab {
  const t = searchParams.get(TAB_PARAM);
  if (t && VALID_TABS.includes(t as AdminTab)) return t as AdminTab;
  return "add";
}

export const ManageLibraryPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [activeTab, setActiveTab] = useState<AdminTab>(() => tabFromSearchParams(searchParams));

  useEffect(() => {
    setActiveTab(tabFromSearchParams(searchParams));
  }, [searchParams]);

  const setTab = (tab: AdminTab) => {
    setActiveTab(tab);
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      next.set(TAB_PARAM, tab);
      if (tab === "edit" && !next.has("page")) next.set("page", "1");
      return next;
    });
  };

  if (user.role !== "ADMIN") {
    navigate("/");
  }

  const isAdd = activeTab === "add";
  const isEdit = activeTab === "edit";
  const isMessages = activeTab === "messages";

  return (
    <div className="container">
      <div className="mt-5">
        <h3>Manage Library</h3>
        <nav>
          <div className="nav nav-tabs" id="nav-tab" role="tablist">
            <button
              onClick={() => setTab("add")}
              className={`nav-link ${isAdd ? "active" : ""}`}
              id="nav-add-book-tab"
              data-bs-toggle="tab"
              data-bs-target="#nav-add-book"
              type="button"
              role="tab"
              aria-controls="nav-add-book"
              aria-selected={isAdd}
            >
              Add new Book
            </button>

            <button
              onClick={() => setTab("edit")}
              className={`nav-link ${isEdit ? "active" : ""}`}
              id="nav-edit-tab"
              data-bs-toggle="tab"
              data-bs-target="#nav-edit"
              type="button"
              role="tab"
              aria-controls="nav-edit"
              aria-selected={isEdit}
            >
              Edit Books
            </button>

            <button
              onClick={() => setTab("messages")}
              className={`nav-link ${isMessages ? "active" : ""}`}
              id="nav-messgaes-tab"
              data-bs-toggle="tab"
              data-bs-target="#nav-messgaes"
              type="button"
              role="tab"
              aria-controls="nav-messgaes"
              aria-selected={isMessages}
            >
              Messages
            </button>
          </div>
        </nav>
        <div className="tab-content" id="nav-tabContent">
          <div
            className={`tab-pane fade ${isAdd ? "show active" : ""}`}
            id="nav-add-book"
            role="tabpanel"
            aria-labelledby="nav-add-book-tab"
          >
            <AddNewBook />
          </div>

          <div
            className={`tab-pane fade ${isEdit ? "show active" : ""}`}
            id="nav-edit"
            role="tabpanel"
            aria-labelledby="nav-edit-tab"
          >
            {isEdit ? <AdminEditBooks /> : null}
          </div>

          <div
            className={`tab-pane fade ${isMessages ? "show active" : ""}`}
            id="nav-messgaes"
            role="tabpanel"
            aria-labelledby="nav-messages-tab"
          >
            {isMessages ? <AdminMessages /> : null}
          </div>
        </div>
      </div>
    </div>
  );
};

import { useReader } from "./ReaderContext";

export const ReaderToolbar = () => {
    const {
        currentPage, totalPages, maxAllowedPage,
        goToPage, nextPage, prevPage,
        scrollMode, setScrollMode
    } = useReader();

    return (
        <div className="d-flex justify-content-between align-items-center mb-3 p-2 bg-white rounded shadow-sm border border-light">
            <div className="d-flex align-items-center gap-3">
                {/* Scroll Toggle */}
                <div className="form-check form-switch mb-0">
                    <input
                        className="form-check-input"
                        type="checkbox"
                        role="switch"
                        id="scrollModeSwitch"
                        checked={scrollMode}
                        onChange={(e) => setScrollMode(e.target.checked)}
                    />
                    <label className="form-check-label small text-muted" htmlFor="scrollModeSwitch">
                        Continuous Scroll
                    </label>
                </div>

                {/* Jump to Page (Only if not scrolling) */}
                {!scrollMode && (
                    <div className="d-flex align-items-center gap-2 border-start ps-3">
                        <span className="small text-muted">Go to:</span>
                        <input
                            type="number"
                            className="form-control form-control-sm"
                            style={{ width: 60 }}
                            value={currentPage}
                            onChange={(e) => goToPage(Number(e.target.value))}
                        />
                    </div>
                )}
            </div>

            {/* Navigation Arrows */}
            {!scrollMode && (
                <div className="d-flex align-items-center gap-1">
                    <button className="btn btn-sm btn-link" onClick={prevPage} disabled={currentPage <= 1}>&larr;</button>
                    <span className="text-muted small fw-medium">
                        {currentPage} / {maxAllowedPage || totalPages}
                    </span>
                    <button className="btn btn-sm btn-link" onClick={nextPage} disabled={currentPage >= maxAllowedPage}>&rarr;</button>
                </div>
            )}
        </div>
    );
}
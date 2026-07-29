import { memo, useCallback, useEffect, useMemo } from "react";

const STATUS_STYLES = {
  Active: "bg-emerald-50 text-emerald-700",
  Inactive: "bg-slate-100 text-slate-500",
  Prospect: "bg-amber-50 text-amber-700",
};

const DEFAULT_STYLE = "bg-amber-50 text-amber-700";

function OutletDetails({ outlet, closeDetails }) {
  const statusStyles = useMemo(
    () => STATUS_STYLES[outlet.status] ?? DEFAULT_STYLE,
    [outlet.status]
  );

  const handleOverlayClick = useCallback(
    (e) => {
      if (e.target === e.currentTarget) closeDetails();
    },
    [closeDetails]
  );

  // Escape key se bhi modal close ho — accessibility ke liye
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") closeDetails();
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [closeDetails]);

  return (
    // Overlay — covers full screen, centers the modal
    <div
      onClick={handleOverlayClick}
      role="dialog"
      aria-modal="true"
      aria-labelledby="outlet-details-title"
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 p-4"
    >
      {/* Modal box */}
      <div className="w-full max-w-md max-h-[90vh] overflow-y-auto bg-white p-6 rounded-lg shadow-lg">
        <div className="flex items-start justify-between mb-4">
          <h2 id="outlet-details-title" className="text-2xl font-bold">
            Outlet Details
          </h2>

          <span
            className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold uppercase tracking-wide ${statusStyles}`}
          >
            <span className="h-1.5 w-1.5 rounded-full bg-current" />
            {outlet.status}
          </span>
        </div>

        <div className="space-y-2">
          <p>
            <strong>Outlet Name:</strong> {outlet.outletName}
          </p>

          <p>
            <strong>Owner Name:</strong> {outlet.ownerName}
          </p>

          <p>
            <strong>Contact Number:</strong> {outlet.contactNumber}
          </p>

          <p>
            <strong>Address:</strong> {outlet.address}
          </p>

          <p>
            <strong>Latitude:</strong> {outlet.latitude}
          </p>

          <p>
            <strong>Longitude:</strong> {outlet.longitude}
          </p>

          <p>
            <strong>Last Visit Date:</strong> {outlet.lastVisitDate}
          </p>
          
           <p>
            <strong>Last Visit Date:</strong> {outlet.location}
          </p>
        </div>

        <button
          onClick={closeDetails}
          className="mt-5 bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700 transition"
        >
          Close
        </button>
      </div>
    </div>
  );
}

export default memo(OutletDetails);
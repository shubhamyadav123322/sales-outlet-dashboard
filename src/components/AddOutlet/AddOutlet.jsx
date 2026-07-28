import { useCallback, useEffect } from "react";
import OutletForm from "../OutletForm/OutletForm";

function AddOutlet({ addOutlet, closeForm }) {
  const handleAddOutlet = useCallback(
    (data) => {
      const newOutlet = {
        id: Date.now(),
        ...data,
      };

      addOutlet(newOutlet);
      closeForm();
    },
    [addOutlet, closeForm]
  );

  const handleOverlayClick = useCallback(
    (e) => {
      if (e.target === e.currentTarget) closeForm();
    },
    [closeForm]
  );

  // Escape key se bhi modal close ho — accessibility ke liye
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") closeForm();
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [closeForm]);

  return (
    // Overlay — dark background covering the full screen
    <div
      onClick={handleOverlayClick}
      role="dialog"
      aria-modal="true"
      aria-labelledby="add-outlet-title"
      className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/50 p-4"
    >
      {/* Modal box */}
      <div className="w-full max-w-md max-h-[90vh] overflow-y-auto bg-white p-6 rounded-lg shadow-lg">
        <h2 id="add-outlet-title" className="text-2xl font-bold mb-5">
          Add New Outlet
        </h2>

        <OutletForm onSubmit={handleAddOutlet} onCancel={closeForm} />
      </div>
    </div>
  );
}

export default AddOutlet;
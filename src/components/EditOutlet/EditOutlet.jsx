import { useCallback, useEffect } from "react";
import OutletForm from "../OutletForm/OutletForm";

function EditOutlet({ outlet, updateOutlet, closeForm }) {
  const handleEditOutlet = useCallback(
    (data) => {
      const updatedOutlet = {
        ...outlet,
        ...data,
      };

      updateOutlet(updatedOutlet);
      closeForm();
    },
    [outlet, updateOutlet, closeForm]
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
    // Overlay — covers full screen, centers the modal
    <div
      onClick={handleOverlayClick}
      role="dialog"
      aria-modal="true"
      aria-labelledby="edit-outlet-title"
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 p-4"
    >
      {/* Modal box */}
      <div className="w-full max-w-md max-h-[90vh] overflow-y-auto bg-white p-6 rounded-lg shadow-lg">
        <h2 id="edit-outlet-title" className="text-2xl font-bold mb-5">
          Edit Outlet
        </h2>

        <OutletForm initialData={outlet} onSubmit={handleEditOutlet} onCancel={closeForm} />
      </div>
    </div>
  );
}

export default EditOutlet;
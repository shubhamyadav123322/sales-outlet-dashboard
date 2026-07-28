import { memo, useCallback, useState } from "react";

const EMPTY_FORM = {
  outletName: "",
  ownerName: "",
  contactNumber: "",
  address: "",
  latitude: "",
  longitude: "",
  status: "Active",
  lastVisitDate: "",
};

// Static classes ko component ke bahar rakha — har render pe naya string nahi banega
const INPUT_CLASS =
  "w-full rounded-md border border-slate-300 px-3 py-2 text-sm text-slate-800 placeholder:text-slate-400 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100";
const LABEL_CLASS = "mb-1.5 block text-sm font-medium text-slate-700";
const ERROR_INPUT_CLASS = "border-red-400 focus:border-red-500 focus:ring-red-100";
const ERROR_TEXT_CLASS = "mt-1 text-xs text-red-500";

function OutletForm({ onSubmit, onCancel, initialData }) {
  const [formData, setFormData] = useState(initialData || EMPTY_FORM);
  const [errors, setErrors] = useState({});

  const handleChange = useCallback((e) => {
    const { name, value } = e.target;

    // Contact number field mein sirf digits allow karo
    if (name === "contactNumber" && value !== "" && !/^\d*$/.test(value)) {
      return;
    }

    setFormData((prev) => ({ ...prev, [name]: value }));
    // Field type karte hi uska error clear kar do
    setErrors((prev) => (prev[name] ? { ...prev, [name]: undefined } : prev));
  }, []);

  const validate = useCallback((data) => {
    const newErrors = {};

    if (!data.outletName.trim()) newErrors.outletName = "Outlet Name is required";
    if (!data.ownerName.trim()) newErrors.ownerName = "Owner Name is required";

    if (!data.contactNumber) {
      newErrors.contactNumber = "Contact Number is required";
    } else if (data.contactNumber.length !== 10) {
      newErrors.contactNumber = "Enter a valid 10 digit contact number";
    }

    return newErrors;
  }, []);

  const handleSubmit = useCallback(
    (e) => {
      e.preventDefault();

      const validationErrors = validate(formData);
      if (Object.keys(validationErrors).length > 0) {
        setErrors(validationErrors);
        return;
      }

      setErrors({});
      onSubmit(formData);
      setFormData(EMPTY_FORM);
    },
    [formData, validate, onSubmit]
  );

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-4">
      <div>
        <label className={LABEL_CLASS}>Outlet Name</label>
        <input
          name="outletName"
          value={formData.outletName}
          onChange={handleChange}
          placeholder="e.g. Sharma General Store"
          className={`${INPUT_CLASS} ${errors.outletName ? ERROR_INPUT_CLASS : ""}`}
        />
        {errors.outletName && <p className={ERROR_TEXT_CLASS}>{errors.outletName}</p>}
      </div>

      <div>
        <label className={LABEL_CLASS}>Owner Name</label>
        <input
          name="ownerName"
          value={formData.ownerName}
          onChange={handleChange}
          placeholder="e.g. Rajesh Sharma"
          className={`${INPUT_CLASS} ${errors.ownerName ? ERROR_INPUT_CLASS : ""}`}
        />
        {errors.ownerName && <p className={ERROR_TEXT_CLASS}>{errors.ownerName}</p>}
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label className={LABEL_CLASS}>Contact Number</label>
          <input
            name="contactNumber"
            inputMode="numeric"
            value={formData.contactNumber}
            onChange={handleChange}
            placeholder="10 digit number"
            maxLength={10}
            className={`${INPUT_CLASS} ${errors.contactNumber ? ERROR_INPUT_CLASS : ""}`}
          />
          {errors.contactNumber && <p className={ERROR_TEXT_CLASS}>{errors.contactNumber}</p>}
        </div>

        <div>
          <label className={LABEL_CLASS}>Status</label>
          <select
            name="status"
            value={formData.status}
            onChange={handleChange}
            className={INPUT_CLASS}
          >
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
            <option value="Prospect">Prospect</option>
          </select>
        </div>
      </div>

      <div>
        <label className={LABEL_CLASS}>Address</label>
        <input
          name="address"
          value={formData.address}
          onChange={handleChange}
          placeholder="Street, area, city"
          className={INPUT_CLASS}
        />
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label className={LABEL_CLASS}>Latitude</label>
          <input
            name="latitude"
            value={formData.latitude}
            onChange={handleChange}
            placeholder="e.g. 22.7533"
            className={`${INPUT_CLASS} font-mono`}
          />
        </div>

        <div>
          <label className={LABEL_CLASS}>Longitude</label>
          <input
            name="longitude"
            value={formData.longitude}
            onChange={handleChange}
            placeholder="e.g. 75.8937"
            className={`${INPUT_CLASS} font-mono`}
          />
        </div>
      </div>

      <div>
        <label className={LABEL_CLASS}>Last Visit Date</label>
        <input
          type="date"
          name="lastVisitDate"
          value={formData.lastVisitDate}
          onChange={handleChange}
          className={INPUT_CLASS}
        />
      </div>

      <div className="flex justify-between gap-6 pt-2">
        <button
          type="submit"
          className="rounded-md bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700 active:bg-blue-800"
        >
          Save Outlet
        </button>

        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="rounded-md bg-slate-500 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-600 active:bg-slate-700"
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}

export default memo(OutletForm);
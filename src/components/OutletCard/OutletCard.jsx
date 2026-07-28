import { memo, useCallback, useMemo } from "react";

const STATUS_STYLES = {
  Active: {
    badge: "bg-emerald-50 text-emerald-700",
    border: "border-l-emerald-500",
  },
  Inactive: {
    badge: "bg-slate-100 text-slate-500",
    border: "border-l-slate-400",
  },
  Prospect: {
    badge: "bg-amber-50 text-amber-700",
    border: "border-l-amber-500",
  },
};

const DEFAULT_STYLE = { badge: "bg-amber-50 text-amber-700", border: "border-l-amber-500" };

function OutletCard({ outlet, onEdit, onDelete, onViewDetails }) {
  const { badge: statusStyles, border: borderAccent } = useMemo(
    () => STATUS_STYLES[outlet.status] ?? DEFAULT_STYLE,
    [outlet.status]
  );

  const handleViewDetails = useCallback(() => onViewDetails(outlet), [onViewDetails, outlet]);
  const handleEdit = useCallback(() => onEdit(outlet), [onEdit, outlet]);
  const handleDelete = useCallback(() => onDelete(outlet.id), [onDelete, outlet.id]);

  return (
    <div
      className={`flex flex-col gap-3 rounded-xl border border-slate-200 ${borderAccent} border-l-2 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md`}
    >
      {/* Title + status */}
      <div className="flex items-start justify-between gap-2">
        <h2 className="text-lg font-bold leading-snug text-slate-900 truncate">
          {outlet.outletName}
        </h2>

        <span
          className={`inline-flex shrink-0 items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold uppercase tracking-wide ${statusStyles}`}
        >
          <span className="h-1.5 w-1.5 rounded-full bg-current" />
          {outlet.status}
        </span>
      </div>

      {/* Details */}
      <div className="flex flex-col gap-1 text-sm text-slate-500">
        <p>
          Owner: <span className="font-medium text-slate-800">{outlet.ownerName}</span>
        </p>
        <p>
          Contact: <span className="font-medium text-slate-800">{outlet.contactNumber}</span>
        </p>
        <p className="text-slate-500">{outlet.address}</p>
      </div>

      {/* Coordinates */}
      <div className="flex items-center justify-between rounded-md border border-dashed border-slate-200 bg-slate-50 px-3 py-1.5 font-mono text-xs text-slate-600">
        <span>
          {outlet.latitude}, {outlet.longitude}
        </span>
        <span className="text-slate-400">lat, lng</span>
      </div>

      {/* Last visit */}
      <div className="flex items-center justify-between text-xs text-slate-500">
        <span>Last visit</span>
        <span className="font-semibold text-amber-600">{outlet.lastVisitDate}</span>
      </div>

      {/* Buttons */}
      <div className="mt-2 flex gap-2">
        <button
          onClick={handleViewDetails}
          className="flex-1 whitespace-nowrap rounded-lg bg-blue-600 px-2 py-3 text-xs font-semibold text-white transition hover:bg-blue-700 active:bg-blue-800"
        >
          View Details
        </button>

        <button
          onClick={handleEdit}
          className="flex-1 whitespace-nowrap rounded-lg bg-amber-500 px-2 py-3 text-xs font-semibold text-white transition hover:bg-amber-600 active:bg-amber-700"
        >
          Edit
        </button>

        <button
          onClick={handleDelete}
          className="flex-1 whitespace-nowrap rounded-lg bg-red-50 px-2 py-3 text-xs font-semibold text-red-600 transition hover:bg-red-100 active:bg-red-200"
        >
          Delete
        </button>
      </div>
    </div>
  );
}

export default memo(OutletCard);
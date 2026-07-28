import { useState, useEffect, useMemo, useCallback } from "react";

import outletsData from "../../data/outlets.json";

import OutletCard from "../../components/OutletCard/OutletCard";
import AddOutlet from "../../components/AddOutlet/AddOutlet";
import EditOutlet from "../../components/EditOutlet/EditOutlet";
import OutletDetails from "../../components/OutletDetails/OutletDetails";
import OutletMap from "../../components/OutletMap/OutletMap";

const CARDS_PER_PAGE = 3;

function Dashboard() {
  const [outlets, setOutlets] = useState(outletsData);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [sortBy, setSortBy] = useState("");

  const [showAdd, setShowAdd] = useState(false);
  const [editOutlet, setEditOutlet] = useState(null);
  const [selectedOutlet, setSelectedOutlet] = useState(null);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);

  // Dark mode
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", darkMode);
  }, [darkMode]);

  // Reset to page 1 whenever search/filter/sort changes
  useEffect(() => {
    setCurrentPage(1);
  }, [search, statusFilter, sortBy]);

  // --- Stable handlers (useCallback so memoized children don't re-render needlessly) ---

  const addOutlet = useCallback((newOutlet) => {
    setOutlets((prev) => [...prev, newOutlet]);
  }, []);

  const deleteOutlet = useCallback((id) => {
    setOutlets((prev) => prev.filter((outlet) => outlet.id !== id));
  }, []);

  const updateOutlet = useCallback((updatedOutlet) => {
    setOutlets((prev) =>
      prev.map((outlet) => (outlet.id === updatedOutlet.id ? updatedOutlet : outlet))
    );
  }, []);

  const toggleDarkMode = useCallback(() => setDarkMode((prev) => !prev), []);
  const openAdd = useCallback(() => setShowAdd(true), []);
  const closeAdd = useCallback(() => setShowAdd(false), []);
  const closeEdit = useCallback(() => setEditOutlet(null), []);
  const closeDetails = useCallback(() => setSelectedOutlet(null), []);

  // --- Derived data (memoized so they only recompute when their real inputs change) ---

  // Search + Filter (lowercase the query once, not once per outlet per field)
  const filteredOutlets = useMemo(() => {
    const query = search.trim().toLowerCase();
    return outlets.filter((outlet) => {
      const matchesSearch =
        !query ||
        outlet.outletName.toLowerCase().includes(query) ||
        outlet.ownerName.toLowerCase().includes(query);

      const matchesStatus = statusFilter === "All" || outlet.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [outlets, search, statusFilter]);

  // Sorting
  const sortedOutlets = useMemo(() => {
    if (!sortBy) return filteredOutlets;

    const sorted = [...filteredOutlets];
    if (sortBy === "name") {
      sorted.sort((a, b) => a.outletName.localeCompare(b.outletName));
    } else if (sortBy === "latest") {
      sorted.sort((a, b) => new Date(b.lastVisitDate) - new Date(a.lastVisitDate));
    } else if (sortBy === "oldest") {
      sorted.sort((a, b) => new Date(a.lastVisitDate) - new Date(b.lastVisitDate));
    }
    return sorted;
  }, [filteredOutlets, sortBy]);

  // Status counts: single pass instead of 3 separate .filter() scans
  const { activeCount, inactiveCount, prospectCount } = useMemo(() => {
    let active = 0;
    let inactive = 0;
    let prospect = 0;
    for (const o of outlets) {
      if (o.status === "Active") active++;
      else if (o.status === "Inactive") inactive++;
      else if (o.status === "Prospect") prospect++;
    }
    return { activeCount: active, inactiveCount: inactive, prospectCount: prospect };
  }, [outlets]);

  // Pagination slice
  const totalPages = Math.ceil(sortedOutlets.length / CARDS_PER_PAGE) || 1;

  const paginatedOutlets = useMemo(() => {
    const start = (currentPage - 1) * CARDS_PER_PAGE;
    return sortedOutlets.slice(start, start + CARDS_PER_PAGE);
  }, [sortedOutlets, currentPage]);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 transition-colors">
      {/* Header */}
      <header className="sticky top-0 z-30 border-b border-slate-200 dark:border-slate-700 bg-white/90 dark:bg-slate-900/90 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:py-4 sm:px-6">
          <div>
            <h1 className="text-lg font-bold tracking-tight text-slate-900 dark:text-slate-100 sm:text-2xl md:text-3xl">
              Sales Outlet Dashboard
            </h1>
            <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400 sm:text-sm">
              {outlets.length} outlets tracked across your route
            </p>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            {/* Mobile: single icon button */}
            <button
              onClick={toggleDarkMode}
              aria-label="Toggle dark mode"
              className="flex h-8 w-8 items-center justify-center rounded-full border border-slate-200 dark:border-slate-600 bg-slate-100 dark:bg-slate-700 text-sm sm:hidden"
            >
              {darkMode ? "☀️" : "🌙"}
            </button>

            {/* Desktop: sliding switch */}
            <button
              onClick={toggleDarkMode}
              aria-label="Toggle dark mode"
              className="relative hidden h-7 w-14 items-center rounded-full bg-slate-200 dark:bg-slate-700 transition-colors sm:flex"
            >
              <span
                className={`inline-block h-5 w-5 transform rounded-full bg-white shadow transition-transform ${
                  darkMode ? "translate-x-8" : "translate-x-1"
                }`}
              />
            </button>

            <button
              onClick={openAdd}
              className="inline-flex shrink-0 items-center gap-1.5 rounded-lg bg-blue-600 px-3 py-2 text-xs font-semibold text-white shadow-sm transition hover:bg-blue-700 active:bg-blue-800 sm:gap-2 sm:px-4 sm:py-2.5 sm:text-sm"
            >
              <span className="text-sm leading-none sm:text-base">+</span> Add Outlet
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6">
        {/* Quick stats */}
        <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
          <StatCard label="Total Outlets" value={outlets.length} color="text-slate-900 dark:text-slate-100" />
          <StatCard label="Active" value={activeCount} color="text-emerald-600 dark:text-emerald-400" />
          <StatCard label="Inactive" value={inactiveCount} color="text-slate-500 dark:text-slate-400" />
          <StatCard label="Prospect" value={prospectCount} color="text-amber-600 dark:text-amber-400" />
        </div>

        {/* Map */}
        <div className="mb-6 overflow-hidden rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 shadow-sm">
          <OutletMap outlets={sortedOutlets} />
        </div>

        {/* Filters + Cards side by side */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[260px_1fr]">
          {/* Sidebar filters */}
          <aside className="h-fit rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-4 shadow-sm lg:sticky lg:top-20">
            <div className="relative mb-4">
              <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">
                🔍
              </span>
              <input
                type="text"
                placeholder="Search by outlet name or owner name..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full rounded-lg border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 py-2.5 pl-9 pr-3 text-xs text-slate-800 dark:text-slate-100 placeholder:text-slate-400 focus:border-blue-500 focus:bg-white dark:focus:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-900 sm:text-sm"
              />
            </div>

            <div className="mb-4">
              <label className="mb-1.5 block text-[10px] font-semibold uppercase tracking-wide text-slate-400 dark:text-slate-500 sm:text-xs">
                Status
              </label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full rounded-lg border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 px-3 py-2.5 text-xs text-slate-700 dark:text-slate-100 focus:border-blue-500 focus:bg-white dark:focus:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-900 sm:text-sm"
              >
                <option value="All">All Status</option>
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
                <option value="Prospect">Prospect</option>
              </select>
            </div>

            <div>
              <label className="mb-1.5 block text-[10px] font-semibold uppercase tracking-wide text-slate-400 dark:text-slate-500 sm:text-xs">
                Sort By
              </label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full rounded-lg border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 px-3 py-2.5 text-xs text-slate-700 dark:text-slate-100 focus:border-blue-500 focus:bg-white dark:focus:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-900 sm:text-sm"
              >
                <option value="">Sort By</option>
                <option value="name">Outlet Name (A-Z)</option>
                <option value="latest">Latest Visit</option>
                <option value="oldest">Oldest Visit</option>
              </select>
            </div>
          </aside>

          {/* Outlet grid */}
          {sortedOutlets.length > 0 ? (
            <div>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
                {paginatedOutlets.map((outlet) => (
                  <OutletCard
                    key={outlet.id}
                    outlet={outlet}
                    onEdit={setEditOutlet}
                    onDelete={deleteOutlet}
                    onViewDetails={setSelectedOutlet}
                  />
                ))}
              </div>

              {/* Pagination controls */}
              {totalPages > 1 && (
                <div className="mt-6 flex items-center justify-between">
                  <p className="text-xs text-slate-500 dark:text-slate-400 sm:text-sm">
                    Page {currentPage} of {totalPages}
                  </p>

                  <div className="flex items-center gap-1.5 sm:gap-2">
                    <button
                      onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                      disabled={currentPage === 1}
                      className="rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-800 px-2 py-1.5 text-xs font-semibold text-slate-700 dark:text-slate-200 transition hover:bg-slate-100 dark:hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-40 sm:px-3 sm:py-2 sm:text-sm"
                    >
                      Previous
                    </button>

                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                      <button
                        key={page}
                        onClick={() => setCurrentPage(page)}
                        className={`h-7 w-7 rounded-lg text-xs font-semibold transition sm:h-9 sm:w-9 sm:text-sm ${
                          currentPage === page
                            ? "bg-blue-600 text-white"
                            : "border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700"
                        }`}
                      >
                        {page}
                      </button>
                    ))}

                    <button
                      onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
                      disabled={currentPage === totalPages}
                      className="rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-800 px-2 py-1.5 text-xs font-semibold text-slate-700 dark:text-slate-200 transition hover:bg-slate-100 dark:hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-40 sm:px-3 sm:py-2 sm:text-sm"
                    >
                      Next
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="rounded-xl border border-dashed border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 py-16 text-center">
              <p className="text-xs font-medium text-slate-600 dark:text-slate-300 sm:text-sm">No outlets match your search.</p>
              <p className="mt-1 text-xs text-slate-400 dark:text-slate-500 sm:text-sm">Try a different name or clear the status filter.</p>
            </div>
          )}
        </div>
      </main>

      {/* Add Outlet */}
      {showAdd && <AddOutlet addOutlet={addOutlet} closeForm={closeAdd} />}

      {/* Edit Outlet */}
      {editOutlet && (
        <EditOutlet outlet={editOutlet} updateOutlet={updateOutlet} closeForm={closeEdit} />
      )}

      {/* Outlet Details */}
      {selectedOutlet && <OutletDetails outlet={selectedOutlet} closeDetails={closeDetails} />}
    </div>
  );
}

function StatCard({ label, value, color }) {
  return (
    <div className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-3 shadow-sm sm:p-4">
      <p className={`font-mono text-lg font-bold sm:text-2xl ${color}`}>
        {String(value).padStart(2, "0")}
      </p>
      <p className="mt-1 text-[10px] font-semibold uppercase tracking-wide text-slate-400 dark:text-slate-500 sm:text-xs">
        {label}
      </p>
    </div>
  );
}

export default Dashboard;
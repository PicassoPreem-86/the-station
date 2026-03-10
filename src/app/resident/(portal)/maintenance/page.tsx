import { getResidentMaintenanceRequests, submitMaintenanceRequest } from "@/actions/resident";
import { formatDate, MAINTENANCE_STATUS_LABELS, MAINTENANCE_PRIORITY_LABELS, MAINTENANCE_CATEGORIES } from "@/lib/constants";
import { redirect } from "next/navigation";

const statusColors: Record<string, string> = {
  submitted: "bg-blue-100 text-blue-800",
  in_progress: "bg-amber-100 text-amber-800",
  scheduled: "bg-purple-100 text-purple-800",
  completed: "bg-emerald-100 text-emerald-800",
  closed: "bg-zinc-100 text-zinc-800",
};

const priorityColors: Record<string, string> = {
  emergency: "bg-red-100 text-red-800",
  high: "bg-orange-100 text-orange-800",
  medium: "bg-amber-100 text-amber-800",
  low: "bg-zinc-100 text-zinc-800",
};

export default async function ResidentMaintenancePage({
  searchParams,
}: {
  searchParams: Promise<{ new?: string; error?: string }>;
}) {
  const params = await searchParams;
  const showForm = params.new === "true";
  const { requests } = await getResidentMaintenanceRequests();

  const openCount = requests.filter(
    (r) => r.status === "submitted" || r.status === "in_progress" || r.status === "scheduled",
  ).length;

  async function handleSubmit(formData: FormData) {
    "use server";
    const result = await submitMaintenanceRequest(formData);
    if (result?.error) {
      redirect(`/resident/maintenance?new=true&error=${encodeURIComponent(result.error)}`);
    }
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Maintenance</h1>
          <p className="mt-1 text-sm text-zinc-500">
            {openCount} open request{openCount !== 1 ? "s" : ""}
          </p>
        </div>
        {!showForm && (
          <a
            href="/resident/maintenance?new=true"
            className="inline-flex h-9 items-center gap-2 rounded-lg bg-zinc-900 px-4 text-sm font-medium text-white transition-colors hover:bg-zinc-800 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-200"
          >
            + New Request
          </a>
        )}
      </div>

      {/* New Request Form */}
      {showForm && (
        <div className="rounded-xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
          <h2 className="mb-4 text-lg font-semibold">Submit a Request</h2>
          {params.error && (
            <div className="mb-4 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700 dark:bg-red-900/20 dark:text-red-400">
              {params.error}
            </div>
          )}
          <form action={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="category" className="text-sm font-medium">
                Category
              </label>
              <select
                id="category"
                name="category"
                required
                className="flex h-10 w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-400 dark:border-zinc-700 dark:bg-zinc-900"
              >
                <option value="">Select a category...</option>
                {MAINTENANCE_CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <label htmlFor="description" className="text-sm font-medium">
                Description
              </label>
              <textarea
                id="description"
                name="description"
                required
                rows={4}
                placeholder="Describe the issue..."
                className="flex w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-400 dark:border-zinc-700 dark:bg-zinc-900"
              />
            </div>
            <div className="flex gap-3">
              <button
                type="submit"
                className="inline-flex h-10 items-center justify-center rounded-lg bg-zinc-900 px-4 text-sm font-medium text-white transition-colors hover:bg-zinc-800 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-200"
              >
                Submit Request
              </button>
              <a
                href="/resident/maintenance"
                className="inline-flex h-10 items-center justify-center rounded-lg border border-zinc-300 px-4 text-sm font-medium transition-colors hover:bg-zinc-100 dark:border-zinc-700 dark:hover:bg-zinc-800"
              >
                Cancel
              </a>
            </div>
          </form>
        </div>
      )}

      {/* Requests List */}
      <div className="rounded-xl border border-zinc-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-zinc-200 dark:border-zinc-800">
                <th className="px-6 py-3 text-left font-medium text-zinc-500">Category</th>
                <th className="px-6 py-3 text-left font-medium text-zinc-500">Description</th>
                <th className="px-6 py-3 text-left font-medium text-zinc-500">Priority</th>
                <th className="px-6 py-3 text-left font-medium text-zinc-500">Status</th>
                <th className="px-6 py-3 text-left font-medium text-zinc-500">Submitted</th>
              </tr>
            </thead>
            <tbody>
              {requests.map((req) => (
                <tr
                  key={req.id}
                  className="border-b border-zinc-100 transition-colors hover:bg-zinc-50 dark:border-zinc-800/50 dark:hover:bg-zinc-900/50"
                >
                  <td className="px-6 py-4 font-medium">{req.category}</td>
                  <td className="max-w-xs px-6 py-4 text-zinc-500 truncate">{req.description}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${priorityColors[req.priority] ?? ""}`}>
                      {MAINTENANCE_PRIORITY_LABELS[req.priority] ?? req.priority}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${statusColors[req.status] ?? ""}`}>
                      {MAINTENANCE_STATUS_LABELS[req.status] ?? req.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-zinc-500">{formatDate(req.created_at)}</td>
                </tr>
              ))}
              {requests.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-zinc-400">
                    No maintenance requests yet
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

import { getResidentAnnouncements } from "@/actions/resident";
import { formatDate } from "@/lib/constants";

export default async function ResidentAnnouncementsPage() {
  const announcements = await getResidentAnnouncements();

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Announcements</h1>
        <p className="mt-1 text-sm text-zinc-500">Building updates and notices</p>
      </div>

      {announcements.length === 0 ? (
        <div className="rounded-xl border border-zinc-200 bg-white p-12 text-center shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
          <p className="text-zinc-400">No announcements yet</p>
        </div>
      ) : (
        <div className="space-y-4">
          {announcements.map((a) => (
            <div
              key={a.id}
              className="rounded-xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-950"
            >
              <div className="flex items-start justify-between gap-4">
                <h2 className="text-lg font-semibold">{a.title}</h2>
                <span className="shrink-0 text-xs text-zinc-400">
                  {formatDate(a.published_at)}
                </span>
              </div>
              <p className="mt-3 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400 whitespace-pre-wrap">
                {a.body}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

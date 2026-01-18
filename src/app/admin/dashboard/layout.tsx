export default function AdminLayout({
  sidebar,
  overview,
}: {
  sidebar: React.ReactNode;
  overview: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-slate-50 dark:bg-black">
      {/* SLOT: LEFT SIDEBAR */}
      {sidebar}

      {/* SLOT: RIGHT CONTENT */}
      <main className="flex-1 p-4 md:p-8 space-y-8 overflow-y-auto">
        {overview}
      </main>
    </div>
  );
}
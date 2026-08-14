export default function Loading() {
  return (
    <main className="min-h-screen bg-slate-50 p-6 dark:bg-slate-950" dir="rtl" aria-label="جاري التحميل">
      <div className="mx-auto max-w-7xl animate-pulse space-y-6">
        <div className="h-16 rounded-2xl bg-slate-200/80 dark:bg-slate-800" />
        <div className="grid gap-6 lg:grid-cols-[16rem_1fr]">
          <div className="hidden space-y-3 rounded-2xl bg-white p-5 shadow-sm dark:bg-slate-900 lg:block">
            <div className="h-8 w-32 rounded-lg bg-slate-200 dark:bg-slate-800" />
            {[1, 2, 3, 4, 5, 6].map((item) => <div key={item} className="h-10 rounded-xl bg-slate-100 dark:bg-slate-800" />)}
          </div>
          <div className="space-y-6">
            <div className="h-52 rounded-3xl bg-gradient-to-l from-purple-900/70 to-slate-800" />
            <div className="grid gap-4 md:grid-cols-3">
              {[1, 2, 3].map((item) => <div key={item} className="h-52 rounded-2xl bg-white shadow-sm dark:bg-slate-900" />)}
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}

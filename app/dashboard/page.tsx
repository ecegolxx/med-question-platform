export default function DashboardPage() {
  return (
    <main className="min-h-screen bg-slate-50 px-6 py-10 text-slate-900">
      <div className="mx-auto max-w-6xl">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="mt-2 text-slate-600">
          Burası öğrencinin ilerleme ekranı olacak.
        </p>

        <div className="mt-8 grid gap-6 md:grid-cols-3">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-semibold">Bugünkü Hedef</h2>
            <p className="mt-2 text-slate-600">20 soru çöz</p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-semibold">Yanlışlarım</h2>
            <p className="mt-2 text-slate-600">
              En çok hata yapılan konular burada görünecek.
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-semibold">Son Performans</h2>
            <p className="mt-2 text-slate-600">
              Doğru / yanlış oranları burada olacak.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
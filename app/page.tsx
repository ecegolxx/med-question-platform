import Link from "next/link";
import { siteConfig } from "../config/site";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-white text-slate-900">
      <section className="mx-auto flex min-h-screen max-w-6xl flex-col justify-center px-6 py-16">
        <div className="max-w-3xl">
          <p className="mb-4 text-sm font-medium uppercase tracking-widest text-slate-500">
            {siteConfig.name}
          </p>

          <h1 className="text-4xl font-bold leading-tight md:text-6xl">
            Tıp öğrencileri için akıllı soru çözme ve tekrar platformu
          </h1>

          <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-600">
            {siteConfig.description}
          </p>

          <div className="mt-8 flex flex-wrap gap-4">
            <Link
              href="/dashboard"
              className="rounded-xl bg-slate-900 px-5 py-3 text-white transition hover:opacity-90"
            >
              Dashboard’a Git
            </Link>

            <a
              href="#features"
              className="rounded-xl border border-slate-300 px-5 py-3 transition hover:bg-slate-50"
            >
              Özellikleri Gör
            </a>
          </div>
        </div>

        <div id="features" className="mt-16 grid gap-6 md:grid-cols-3">
          <div className="rounded-2xl border border-slate-200 p-6 shadow-sm">
            <h2 className="text-xl font-semibold">Soru Havuzu</h2>
            <p className="mt-2 text-slate-600">
              Ders, konu ve zorluk seviyesine göre filtrelenebilir soru sistemi.
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 p-6 shadow-sm">
            <h2 className="text-xl font-semibold">Yanlış Analizi</h2>
            <p className="mt-2 text-slate-600">
              Öğrencinin en çok zorlandığı konuları görünür hale getiren takip
              sistemi.
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 p-6 shadow-sm">
            <h2 className="text-xl font-semibold">Kişiselleştirilmiş Tekrar</h2>
            <p className="mt-2 text-slate-600">
              İleride yapay zekâ destekli mini testler ve tekrar akışı kurulacak.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
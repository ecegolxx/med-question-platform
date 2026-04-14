"use client";

import { useState } from "react";
import { createClient } from "../../lib/supabase/client";

export default function LoginForm() {
  const supabase = createClient();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setMessage("");

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setMessage(error.message);
      return;
    }

    window.location.href = "/admin/questions";
  }

  return (
    <main className="min-h-screen bg-slate-50 px-6 py-10 text-slate-900">
      <div className="mx-auto max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h1 className="text-3xl font-bold">Admin Girişi</h1>
        <p className="mt-2 text-slate-600">
          Admin paneline erişmek için giriş yap.
        </p>

        <form onSubmit={handleLogin} className="mt-6 space-y-4">
          <div>
            <label className="mb-2 block text-sm font-medium">E-posta</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-xl border border-slate-300 px-4 py-3"
              required
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium">Şifre</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-xl border border-slate-300 px-4 py-3"
              required
            />
          </div>

          {message && (
            <p className="rounded-xl bg-red-50 p-3 text-sm text-red-700">
              {message}
            </p>
          )}

          <button
            type="submit"
            className="w-full rounded-xl bg-slate-900 px-5 py-3 text-white transition hover:opacity-90"
          >
            Giriş Yap
          </button>
        </form>
      </div>
    </main>
  );
}
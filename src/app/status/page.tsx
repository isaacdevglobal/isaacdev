export const dynamic = "force-dynamic";

export default async function StatusPage() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  let message = "Not checked";

  if (!url || !key) {
    message = "Missing Supabase environment variables";
  } else {
    try {
      const res = await fetch(`${url}/auth/v1/health`, {
        headers: { apikey: key },
      });
      message = res.ok
        ? "Supabase connected"
        : `Supabase responded with status ${res.status}`;
    } catch {
      message = "Could not reach Supabase";
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-bg text-white">
      <p className="text-lg">{message}</p>
    </main>
  );
}
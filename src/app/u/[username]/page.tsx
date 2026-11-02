import { notFound } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";

export default async function PublicProfilePage({
  params,
}: {
  params: Promise<{ username: string }>;
}) {
  const { username } = await params;
  const supabase = await createClient();

  const { data: profile } = await supabase
    .from("profiles")
    .select("username, full_name, bio, created_at")
    .eq("username", username.toLowerCase())
    .maybeSingle();

  if (!profile) {
    notFound();
  }

  const joined = new Date(profile.created_at).toLocaleDateString("en-GB", {
    month: "long",
    year: "numeric",
  });

  return (
    <main className="min-h-screen bg-bg text-white">
      <header className="mx-auto max-w-3xl px-6 py-6">
        <Link href="/" className="text-2xl font-bold">
          <span className="text-ash">Isaac</span>
          <span className="text-mint">Dev</span>
        </Link>
      </header>

      <section className="mx-auto max-w-3xl px-6 py-10">
        <h1 className="text-4xl font-bold">
          {profile.full_name || profile.username}
        </h1>
        <p className="mt-1 text-white/60">@{profile.username}</p>
        {profile.bio && <p className="mt-6 text-lg text-white/80">{profile.bio}</p>}
        <p className="mt-8 text-sm text-white/40">Joined {joined}</p>
      </section>
    </main>
  );
}
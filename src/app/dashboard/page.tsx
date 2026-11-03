import { redirect } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import ProfileForm from "./ProfileForm";
import SignOutButton from "./SignOutButton";

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("username, full_name, bio")
    .eq("id", user.id)
    .maybeSingle();

  const { data: roles } = await supabase
    .from("user_roles")
    .select("role")
    .eq("user_id", user.id);
  const roleList = (roles ?? []).map((r) => r.role);

  const quick =
    "rounded-xl bg-white/5 px-5 py-3 text-sm transition hover:bg-white/10";

  return (
    <main className="min-h-screen bg-bg text-white">
      <header className="mx-auto flex max-w-3xl items-center justify-between px-6 py-6">
        <Link href="/" className="text-2xl font-bold">
          <span className="text-ash">Isaac</span>
          <span className="text-mint">Dev</span>
        </Link>
        <SignOutButton />
      </header>

      <section className="mx-auto max-w-3xl px-6 pb-16">
        <h1 className="text-3xl font-bold">
          Welcome{profile?.full_name ? `, ${profile.full_name}` : ""}
        </h1>
        <p className="mt-2 text-white/60">{user.email}</p>

        <div className="mt-4 flex flex-wrap gap-2">
          {roleList.map((r) => (
            <span
              key={r}
              className="rounded-full border border-mint px-3 py-1 text-xs text-mint"
            >
              {r}
            </span>
          ))}
        </div>

        <div className="mt-8 flex flex-wrap gap-3">
          <Link href="/courses" className={quick}>
            📚 Courses
          </Link>
          <Link href="/certificates" className={quick}>
            🎓 My certificates
          </Link>
          {roleList.includes("instructor") && (
            <Link href="/instructor" className={quick}>
              🧑‍🏫 Teach
            </Link>
          )}
          {(roleList.includes("instructor") || roleList.includes("admin")) && (
            <Link href="/review" className={quick}>
              📝 Project reviews
            </Link>
          )}
          {roleList.includes("admin") && (
            <Link href="/admin/courses" className={quick}>
              🛠 Admin
            </Link>
          )}
        </div>

        {profile?.username && (
          <p className="mt-6 text-sm">
            Your public profile:{" "}
            <Link
              href={`/u/${profile.username}`}
              className="text-mint hover:underline"
            >
              /u/{profile.username}
            </Link>
          </p>
        )}

        <div className="mt-10 rounded-2xl bg-white/5 p-8">
          <h2 className="mb-6 text-xl font-semibold">Your profile</h2>
          <ProfileForm
            userId={user.id}
            initialFullName={profile?.full_name ?? ""}
            initialUsername={profile?.username ?? ""}
            initialBio={profile?.bio ?? ""}
          />
        </div>
      </section>
    </main>
  );
}
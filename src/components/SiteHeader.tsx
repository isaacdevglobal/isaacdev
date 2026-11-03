import Link from "next/link";
import { createClient } from "@/lib/supabase/server";

export default async function SiteHeader() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  let roles: string[] = [];
  if (user) {
    const { data } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", user.id);
    roles = (data ?? []).map((r) => r.role);
  }

  const isInstructor = roles.includes("instructor");
  const isAdmin = roles.includes("admin");

  return (
    <header className="mx-auto flex max-w-6xl items-center justify-between px-6 py-6">
      <Link href="/" className="text-2xl font-bold">
        <span className="text-ash">Isaac</span>
        <span className="text-mint">Dev</span>
      </Link>

      <nav className="flex flex-wrap items-center justify-end gap-4 text-sm text-white/70 sm:gap-6">
        <Link href="/#products" className="hover:text-white">
          Products
        </Link>
        <Link href="/courses" className="hover:text-white">
          Courses
        </Link>
        {isInstructor && (
          <Link href="/instructor" className="hover:text-white">
            Teach
          </Link>
        )}
        {(isInstructor || isAdmin) && (
          <Link href="/review" className="hover:text-white">
            Reviews
          </Link>
        )}
        {isAdmin && (
          <Link href="/admin/courses" className="hover:text-white">
            Admin
          </Link>
        )}
        {user ? (
          <Link
            href="/dashboard"
            className="rounded-lg bg-mint px-4 py-2 font-semibold text-bg"
          >
            Dashboard
          </Link>
        ) : (
          <>
            <Link href="/login" className="hover:text-white">
              Log in
            </Link>
            <Link
              href="/signup"
              className="rounded-lg bg-mint px-4 py-2 font-semibold text-bg"
            >
              Sign up
            </Link>
          </>
        )}
      </nav>
    </header>
  );
}
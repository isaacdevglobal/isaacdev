import Link from "next/link";
import { createClient } from "@/lib/supabase/server";

export default async function SiteHeader() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <header className="mx-auto flex max-w-6xl items-center justify-between px-6 py-6">
      <Link href="/" className="text-2xl font-bold">
        <span className="text-ash">Isaac</span>
        <span className="text-mint">Dev</span>
      </Link>

      <nav className="flex items-center gap-6 text-sm text-white/70">
        <Link href="/#products" className="hover:text-white">
          Products
        </Link>
        <Link href="/courses" className="hover:text-white">
          Courses
        </Link>
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
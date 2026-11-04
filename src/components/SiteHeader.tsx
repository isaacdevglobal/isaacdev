import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import HeaderMenus from "./HeaderMenus";

export default async function SiteHeader() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  let isAdmin = false;
  if (user) {
    const { data } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", user.id)
      .eq("role", "admin");
    isAdmin = (data ?? []).length > 0;
  }

  return (
    <header className="sticky top-0 z-40 border-b border-white/5 bg-bg/80 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link href="/" className="text-2xl font-bold">
          <span className="text-ash">Isaac</span>
          <span className="text-mint">Dev</span>
        </Link>
        <HeaderMenus loggedIn={!!user} isAdmin={isAdmin} />
      </div>
    </header>
  );
}
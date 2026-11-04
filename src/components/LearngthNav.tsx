import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import ProductMark from "./ProductMark";

export default async function LearngthNav() {
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
  const link = "text-sm text-white/70 hover:text-white";

  return (
    <div className="border-b border-white/5 bg-white/[0.02]">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-x-6 gap-y-2 px-6 py-3">
        <Link href="/learngth" className="flex items-center gap-2 font-bold">
          <ProductMark slug="learngth" size={20} />
          <span>
            <span className="text-ash">Learn</span>
            <span style={{ color: "#4da3ff" }}>gth</span>
          </span>
        </Link>
        <Link href="/courses" className={link}>
          Courses
        </Link>
        {user && (
          <Link href="/certificates" className={link}>
            My certificates
          </Link>
        )}
        {isInstructor && (
          <Link href="/instructor" className={link}>
            Teach
          </Link>
        )}
        {(isInstructor || isAdmin) && (
          <Link href="/review" className={link}>
            Project reviews
          </Link>
        )}
        {isAdmin && (
          <Link href="/admin/courses" className={link}>
            Approve courses
          </Link>
        )}
      </div>
    </div>
  );
}
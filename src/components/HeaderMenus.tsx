"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { products, statusLabel } from "@/lib/products";
import ProductMark from "./ProductMark";
import { createClient } from "@/lib/supabase/client";

type Menu = null | "products" | "account" | "mobile";

export default function HeaderMenus({
  loggedIn,
  isAdmin,
}: {
  loggedIn: boolean;
  isAdmin: boolean;
}) {
  const router = useRouter();
  const [open, setOpen] = useState<Menu>(null);

  const close = () => setOpen(null);
  const toggle = (name: Exclude<Menu, null>) =>
    setOpen((prev) => (prev === name ? null : name));

  async function signOut() {
    const supabase = createClient();
    await supabase.auth.signOut();
    close();
    router.push("/");
    router.refresh();
  }

  const item =
    "block rounded-lg px-4 py-2 text-sm text-white/80 hover:bg-white/10 hover:text-white";

  return (
    <>
      {open && (
        <button
          aria-label="Close menu"
          className="fixed inset-0 z-40 cursor-default"
          onClick={close}
        />
      )}

      <nav className="relative z-50 hidden items-center gap-2 md:flex">
        <div className="relative">
          <button
            onClick={() => toggle("products")}
            className="rounded-lg px-4 py-2 text-sm text-white/80 hover:bg-white/10 hover:text-white"
          >
            Products ▾
          </button>
          {open === "products" && (
            <div className="absolute left-0 top-full mt-2 w-[26rem] rounded-2xl border border-white/10 bg-[#2a2627] p-3 shadow-2xl shadow-black/50">
              {products.map((p) => (
                <Link
                  key={p.slug}
                  href={p.href}
                  onClick={close}
                  className="flex items-center gap-4 rounded-xl p-3 hover:bg-white/10"
                >
                  <div
                    className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl"
                    style={{ background: `${p.hex}22` }}
                  >
                    <ProductMark slug={p.slug} size={24} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="font-semibold">
                      <span className="text-ash">{p.grey}</span>
                      <span style={{ color: p.hex }}>{p.accent}</span>
                    </p>
                    <p className="truncate text-xs text-white/50">{p.tagline}</p>
                  </div>
                  <span className="shrink-0 rounded-full border border-white/15 px-2 py-0.5 text-[10px] text-white/60">
                    {statusLabel[p.status]}
                  </span>
                </Link>
              ))}
            </div>
          )}
        </div>

        {loggedIn ? (
          <div className="relative">
            <button
              onClick={() => toggle("account")}
              className="rounded-lg bg-mint px-4 py-2 text-sm font-semibold text-bg"
            >
              Account ▾
            </button>
            {open === "account" && (
              <div className="absolute right-0 top-full mt-2 w-56 rounded-2xl border border-white/10 bg-[#2a2627] p-2 shadow-2xl shadow-black/50">
                <Link href="/dashboard" onClick={close} className={item}>
                  Dashboard
                </Link>
                <Link href="/certificates" onClick={close} className={item}>
                  My certificates
                </Link>
                {isAdmin && (
                  <Link href="/admin/courses" onClick={close} className={item}>
                    Admin
                  </Link>
                )}
                <button onClick={signOut} className={`${item} w-full text-left`}>
                  Sign out
                </button>
              </div>
            )}
          </div>
        ) : (
          <>
            <Link
              href="/login"
              className="rounded-lg px-4 py-2 text-sm text-white/80 hover:bg-white/10 hover:text-white"
            >
              Log in
            </Link>
            <Link
              href="/signup"
              className="rounded-lg bg-mint px-4 py-2 text-sm font-semibold text-bg"
            >
              Sign up
            </Link>
          </>
        )}
      </nav>

      <div className="relative z-50 md:hidden">
        <button
          onClick={() => toggle("mobile")}
          aria-label="Menu"
          className="rounded-lg border border-white/20 px-3 py-2 text-lg"
        >
          {open === "mobile" ? "✕" : "☰"}
        </button>
        {open === "mobile" && (
          <div className="absolute right-0 top-full mt-2 w-64 rounded-2xl border border-white/10 bg-[#2a2627] p-2 shadow-2xl shadow-black/50">
            {products.map((p) => (
              <Link key={p.slug} href={p.href} onClick={close} className={item}>
                <span className="text-ash">{p.grey}</span>
                <span style={{ color: p.hex }}>{p.accent}</span>
              </Link>
            ))}
            <div className="my-2 border-t border-white/10" />
            {loggedIn ? (
              <>
                <Link href="/dashboard" onClick={close} className={item}>
                  Dashboard
                </Link>
                <Link href="/certificates" onClick={close} className={item}>
                  My certificates
                </Link>
                {isAdmin && (
                  <Link href="/admin/courses" onClick={close} className={item}>
                    Admin
                  </Link>
                )}
                <button onClick={signOut} className={`${item} w-full text-left`}>
                  Sign out
                </button>
              </>
            ) : (
              <>
                <Link href="/login" onClick={close} className={item}>
                  Log in
                </Link>
                <Link href="/signup" onClick={close} className={item}>
                  Sign up
                </Link>
              </>
            )}
          </div>
        )}
      </div>
    </>
  );
}
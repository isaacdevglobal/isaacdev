import Link from "next/link";
import { products } from "@/lib/products";
import { SITE } from "@/lib/site";

export default function SiteFooter() {
  const list = "space-y-3 text-sm text-white/60";
  const head = "mb-4 text-sm font-semibold text-white";
  const link = "hover:text-white";

  return (
    <footer className="border-t border-white/10 bg-black/20">
      <div className="mx-auto grid max-w-6xl grid-cols-2 gap-x-6 gap-y-10 px-6 py-14 lg:grid-cols-6">
        <div className="col-span-2">
          <p className="text-2xl font-bold">
            <span className="text-ash">Isaac</span>
            <span className="text-mint">Dev</span>
          </p>
          <p className="mt-3 max-w-xs text-sm text-white/50">
            Learn. Build. Connect. Earn. An ecosystem for Africa&apos;s next
            generation of developers and digital creators.
          </p>
        </div>

        <div>
          <p className={head}>Products</p>
          <ul className={list}>
            {products.map((p) => (
              <li key={p.slug}>
                <Link href={p.href} className={link}>
                  <span>{p.grey}</span>
                  <span style={{ color: p.hex }}>{p.accent}</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className={head}>Learngth</p>
          <ul className={list}>
            <li>
              <Link href="/courses" className={link}>
                Browse courses
              </Link>
            </li>
            <li>
              <Link href="/verify" className={link}>
                Verify a certificate
              </Link>
            </li>
            <li>
              <Link href="/certificates" className={link}>
                My certificates
              </Link>
            </li>
            <li>
              <Link href="/instructor" className={link}>
                Teach on Learngth
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <p className={head}>Company</p>
          <ul className={list}>
            <li>
              <Link href="/about" className={link}>
                About IsaacDev
              </Link>
            </li>
            <li>
              <Link href="/contact" className={link}>
                Contact
              </Link>
            </li>
            <li>
              <Link href="/login" className={link}>
                Log in
              </Link>
            </li>
            <li>
              <Link href="/signup" className={link}>
                Create an account
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <p className={head}>Legal</p>
          <ul className={list}>
            <li>
              <Link href="/privacy" className={link}>
                Privacy Policy
              </Link>
            </li>
            <li>
              <Link href="/terms" className={link}>
                Terms of Use
              </Link>
            </li>
            <li>
              <Link href="/certificate-policy" className={link}>
                Certificate Policy
              </Link>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-white/5">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-2 px-6 py-6 text-xs text-white/40 sm:flex-row">
          <p>© 2026 {SITE.name}. A {SITE.company} company.</p>
          <p>Made for Africa&apos;s next generation of creators.</p>
        </div>
      </div>
    </footer>
  );
}
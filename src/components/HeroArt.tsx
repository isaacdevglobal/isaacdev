import VerifiedStar from "./VerifiedStar";
import ProductMark from "./ProductMark";

const glass =
  "rounded-2xl border border-white/10 bg-white/[0.07] shadow-2xl shadow-black/40 backdrop-blur-md";

export default function HeroArt() {
  return (
    <div className="relative mx-auto h-[460px] w-full max-w-lg" aria-hidden>
      <div
        className="absolute left-1/2 top-1/2 h-80 w-80 -translate-x-1/2 -translate-y-1/2 rounded-full blur-3xl"
        style={{
          background:
            "radial-gradient(circle, rgba(85,204,147,0.35), transparent 70%)",
        }}
      />

      {/* Certificate */}
      <div
        className="absolute left-0 top-4 z-20 w-72"
        style={{ transform: "rotate(-4deg)" }}
      >
        <div className={`${glass} animate-float p-5`}>
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wide text-mint">
              ✓ Valid certificate
            </span>
            <VerifiedStar size={28} />
          </div>
          <p className="mt-4 text-xs text-white/50">This certifies that</p>
          <p className="text-xl font-bold">Amina Okafor</p>
          <p className="mt-2 text-sm text-white/70">Web Development Foundations</p>
          <div className="mt-4 flex items-center justify-between text-xs text-white/50">
            <span>Project score 92%</span>
            <span className="font-mono">IDV-2026-8K2M4Q7XPA</span>
          </div>
          <p className="mt-3 text-[10px] uppercase tracking-widest text-white/30">
            Sample
          </p>
        </div>
      </div>

      {/* Course progress */}
      <div
        className="absolute right-0 top-32 z-10 w-64"
        style={{ transform: "rotate(5deg)" }}
      >
        <div
          className={`${glass} animate-float p-5`}
          style={{ animationDelay: "1.2s" }}
        >
          <div className="flex items-center gap-2">
            <ProductMark slug="learngth" size={20} />
            <span className="text-sm font-semibold" style={{ color: "#4da3ff" }}>
              Learngth
            </span>
          </div>
          <p className="mt-3 text-sm font-medium">AI Foundations</p>
          <div className="mt-3 h-2 overflow-hidden rounded-full bg-white/10">
            <div
              className="h-full rounded-full"
              style={{ width: "67%", background: "#4da3ff" }}
            />
          </div>
          <p className="mt-2 text-xs text-white/50">67% complete</p>
        </div>
      </div>

      {/* Review comment */}
      <div
        className="absolute bottom-16 left-6 z-30 w-60"
        style={{ transform: "rotate(3deg)" }}
      >
        <div
          className={`${glass} animate-float p-4`}
          style={{ animationDelay: "2.4s" }}
        >
          <div className="flex items-center gap-2">
            <ProductMark slug="hangin" size={20} />
            <span className="text-sm font-semibold" style={{ color: "#8b7cff" }}>
              HangIn
            </span>
          </div>
          <p className="mt-3 text-sm text-white/80">
            “Can we move this button up a little?”
          </p>
          <p className="mt-2 text-xs text-white/40">Private feedback</p>
        </div>
      </div>

      {/* Job match */}
      <div
        className="absolute bottom-2 right-4 z-20 w-56"
        style={{ transform: "rotate(-3deg)" }}
      >
        <div
          className={`${glass} animate-float p-4`}
          style={{ animationDelay: "0.6s" }}
        >
          <div className="flex items-center gap-2">
            <ProductMark slug="livjob" size={20} />
            <span className="text-sm font-semibold" style={{ color: "#f2b544" }}>
              LivJob
            </span>
          </div>
          <p className="mt-3 text-sm font-medium">Frontend developer needed</p>
          <p className="mt-1 text-xs text-white/50">New match for you</p>
        </div>
      </div>
    </div>
  );
}
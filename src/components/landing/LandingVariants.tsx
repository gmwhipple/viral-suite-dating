import Link from "next/link";
import { APP_NAME, PRICING, SUPPORT_EMAIL } from "@/lib/constants";
import { cn } from "@/lib/utils";

interface LandingProps {
  onCtaClick: () => void;
}

export function LandingVariantA({ onCtaClick }: LandingProps) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-rose-50 via-white to-orange-50">
      <header className="mx-auto flex max-w-6xl items-center justify-between px-6 py-6">
        <span className="text-xl font-bold tracking-tight text-rose-600">{APP_NAME}</span>
        <div className="flex items-center gap-4">
          <Link href="/login" className="text-sm font-medium text-gray-600 hover:text-gray-900">
            Sign in
          </Link>
          <Link
            href="/login?mode=signup"
            onClick={onCtaClick}
            className="rounded-full bg-rose-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-rose-200 transition hover:bg-rose-700"
          >
            Get Started
          </Link>
        </div>
      </header>

      <main>
        <section className="mx-auto max-w-6xl px-6 pb-20 pt-12 text-center">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-rose-100 px-4 py-1.5 text-sm font-medium text-rose-700">
            <span className="h-2 w-2 animate-pulse rounded-full bg-rose-500" />
            AI-powered dating profile photos
          </div>
          <h1 className="mx-auto max-w-4xl text-5xl font-extrabold leading-tight tracking-tight text-gray-900 md:text-6xl">
            Get 10x more matches with{" "}
            <span className="bg-gradient-to-r from-rose-600 to-orange-500 bg-clip-text text-transparent">
              AI dating photos
            </span>{" "}
            that look like you
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-gray-600">
            Upload your selfies. Our AI trains on your face using Higgsfield Soul 2.0, then generates
            100 professional dating profile shots in styles proven to convert.
          </p>
          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link
              href="/login?mode=signup"
              onClick={onCtaClick}
              className="w-full rounded-full bg-rose-600 px-8 py-4 text-lg font-bold text-white shadow-xl shadow-rose-200 transition hover:scale-105 hover:bg-rose-700 sm:w-auto"
            >
              Transform My Profile — ${PRICING.price}
            </Link>
            <p className="text-sm text-gray-500">100 photos · No subscription · Money-back guarantee</p>
          </div>

          <div className="mx-auto mt-16 grid max-w-4xl grid-cols-3 gap-8 text-center">
            {[
              { stat: "3.2x", label: "avg. match rate increase" },
              { stat: "100", label: "AI photos included" },
              { stat: "24hr", label: "typical turnaround" },
            ].map((item) => (
              <div key={item.label}>
                <div className="text-3xl font-bold text-rose-600">{item.stat}</div>
                <div className="mt-1 text-sm text-gray-500">{item.label}</div>
              </div>
            ))}
          </div>
        </section>

        <FeaturesSection />
        <PricingSection onCtaClick={onCtaClick} accent="rose" />
        <FAQSection />
      </main>

      <Footer />
    </div>
  );
}

export function LandingVariantB({ onCtaClick }: LandingProps) {
  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <header className="mx-auto flex max-w-6xl items-center justify-between px-6 py-6">
        <span className="text-xl font-bold text-violet-400">{APP_NAME}</span>
        <Link
          href="/login?mode=signup"
          onClick={onCtaClick}
          className="rounded-lg bg-violet-600 px-5 py-2.5 text-sm font-bold text-white transition hover:bg-violet-500"
        >
          Start Free →
        </Link>
      </header>

      <main className="mx-auto max-w-6xl px-6 pb-20 pt-8">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <div>
            <p className="mb-4 text-sm font-semibold uppercase tracking-widest text-violet-400">
              Stop getting ignored
            </p>
            <h1 className="text-4xl font-black leading-tight md:text-5xl">
              Your dating photos are costing you matches.
            </h1>
            <p className="mt-6 text-lg text-gray-400">
              Bad lighting. Weird angles. Group shots as your main photo. We fix all of it with AI
              that learns your face and generates swipe-worthy profile pictures.
            </p>
            <ul className="mt-8 space-y-3">
              {PRICING.features.slice(0, 4).map((f) => (
                <li key={f} className="flex items-center gap-3 text-gray-300">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-violet-600 text-xs">✓</span>
                  {f}
                </li>
              ))}
            </ul>
            <Link
              href="/login?mode=signup"
              onClick={onCtaClick}
              className="mt-10 inline-block rounded-lg bg-gradient-to-r from-violet-600 to-fuchsia-600 px-8 py-4 text-lg font-bold shadow-2xl transition hover:scale-105"
            >
              Fix My Photos — ${PRICING.price} one-time
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {["Before", "After AI"].map((label, i) => (
              <div
                key={label}
                className={cn(
                  "aspect-[3/4] rounded-2xl bg-gradient-to-br p-1",
                  i === 0 ? "from-gray-700 to-gray-800" : "from-violet-600 to-fuchsia-600"
                )}
              >
                <div className="flex h-full flex-col items-center justify-center rounded-xl bg-gray-900">
                  <span className="text-4xl">{i === 0 ? "😕" : "🔥"}</span>
                  <span className="mt-2 text-sm font-medium text-gray-400">{label}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-20">
          <PricingSection onCtaClick={onCtaClick} accent="violet" dark />
        </div>
      </main>

      <div className="border-t border-gray-800">
        <Footer dark />
      </div>
    </div>
  );
}

function FeaturesSection() {
  const features = [
    { title: "Upload up to 100 photos", desc: "Train the AI on every angle of your face for maximum accuracy." },
    { title: "100 style references", desc: "Coffee shop casual, outdoor adventure, smart casual — pick your vibe." },
    { title: "AI edits included", desc: "Change your shirt, remove background clutter, refine any shot." },
    { title: "Watermark-free downloads", desc: "Clean, professional photos ready for Tinder, Hinge, and Bumble." },
  ];

  return (
    <section className="bg-white py-20">
      <div className="mx-auto max-w-6xl px-6">
        <h2 className="text-center text-3xl font-bold text-gray-900">Everything you need to stand out</h2>
        <div className="mt-12 grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {features.map((f) => (
            <div key={f.title} className="rounded-2xl border border-gray-100 bg-gray-50 p-6">
              <h3 className="font-semibold text-gray-900">{f.title}</h3>
              <p className="mt-2 text-sm text-gray-600">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function PricingSection({
  onCtaClick,
  accent,
  dark,
}: LandingProps & { accent: "rose" | "violet"; dark?: boolean }) {
  const btnClass =
    accent === "rose"
      ? "bg-rose-600 hover:bg-rose-700 shadow-rose-200"
      : "bg-violet-600 hover:bg-violet-500";

  return (
    <section className={cn("py-20", dark ? "" : "bg-gray-50")}>
      <div className="mx-auto max-w-lg px-6 text-center">
        <h2 className={cn("text-3xl font-bold", dark ? "text-white" : "text-gray-900")}>
          Simple, one-time pricing
        </h2>
        <div
          className={cn(
            "mt-8 rounded-3xl border p-8 shadow-xl",
            dark ? "border-gray-800 bg-gray-900" : "border-rose-100 bg-white"
          )}
        >
          <div className="text-5xl font-black text-rose-600">${PRICING.price}</div>
          <p className={cn("mt-2", dark ? "text-gray-400" : "text-gray-600")}>{PRICING.description}</p>
          <ul className="mt-6 space-y-2 text-left text-sm">
            {PRICING.features.map((f) => (
              <li key={f} className={cn("flex gap-2", dark ? "text-gray-300" : "text-gray-700")}>
                <span className="text-green-500">✓</span> {f}
              </li>
            ))}
          </ul>
          <Link
            href="/login?mode=signup"
            onClick={onCtaClick}
            className={cn(
              "mt-8 block w-full rounded-full py-4 font-bold text-white shadow-lg transition",
              btnClass
            )}
          >
            Get {PRICING.features[1]}
          </Link>
        </div>
      </div>
    </section>
  );
}

function FAQSection() {
  const faqs = [
    { q: "How many photos can I upload?", a: "Up to 100 training photos. We recommend at least 10 clear face shots." },
    { q: "How long does it take?", a: "Character training takes 1-2 hours. Each generation completes in minutes." },
    { q: "Can I edit the results?", a: "Yes! Change outfits, remove objects, or refine any photo with AI edits." },
    { q: "Is there a generation limit?", a: "Paid users get 100 AI photo generations included." },
  ];

  return (
    <section className="py-20">
      <div className="mx-auto max-w-2xl px-6">
        <h2 className="text-center text-3xl font-bold text-gray-900">FAQ</h2>
        <div className="mt-10 space-y-6">
          {faqs.map((f) => (
            <div key={f.q} className="border-b border-gray-200 pb-6">
              <h3 className="font-semibold text-gray-900">{f.q}</h3>
              <p className="mt-2 text-gray-600">{f.a}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Footer({ dark }: { dark?: boolean }) {
  return (
    <footer className={cn("py-10 text-center text-sm", dark ? "text-gray-500" : "text-gray-500")}>
      <p>
        Questions?{" "}
        <a href={`mailto:${SUPPORT_EMAIL}`} className="underline hover:text-rose-600">
          {SUPPORT_EMAIL}
        </a>
      </p>
      <p className="mt-2">© {new Date().getFullYear()} {APP_NAME}. All rights reserved.</p>
    </footer>
  );
}

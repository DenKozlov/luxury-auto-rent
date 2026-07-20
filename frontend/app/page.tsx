import TopRated from "@/components/top-rated";
import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <main role="main">
      <section className="relative w-full min-h-[85vh] bg-neutral-950 flex items-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image
            src="/porsche.webp"
            alt="Zenith Fleet Performance Car"
            fill
            priority
            fetchPriority="high"
            sizes="100vw"
            className="object-cover object-center select-none pointer-events-none"
          />
          <div className="absolute inset-0 bg-linear-to-r from-neutral-950 via-neutral-950/80 to-neutral-950/10 z-10" />
          <div className="absolute inset-0 bg-linear-to-t from-neutral-950 via-transparent to-transparent opacity-60 z-10" />
        </div>
        <div className="relative max-w-7xl w-full mx-auto px-6 z-10 py-20">
          <div className="max-w-2xl text-white font-sans">
            <div className="flex items-center gap-3 mb-6 opacity-80">
              <span className="w-6 h-px bg-white block" />
              <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-neutral-300">
                Luxury & performance car rental
              </p>
            </div>

            <h1 className="text-4xl sm:text-6xl font-black uppercase tracking-tight leading-[0.95] mb-8">
              <span className="text-neutral-400 block text-xl sm:text-2xl font-medium tracking-[0.15em] mb-3">
                A private key to
              </span>
              The Zenith <br />
              <span className="text-transparent bg-clip-text bg-linear-to-r from-white via-neutral-200 to-neutral-400">
                Collection.
              </span>
            </h1>

            <p className="text-xs sm:text-sm text-neutral-400 uppercase tracking-[0.18em] leading-relaxed max-w-lg mb-10 font-light">
              Select your vehicle, and let your absolute peace of mind be
              secured by our proprietary member protection protocol.
            </p>

            <Link
              href="/cars"
              className="inline-flex items-center justify-center px-8 h-12 bg-white text-neutral-950 text-xs font-bold uppercase tracking-[0.2em] border border-white hover:bg-transparent hover:text-white transition-all duration-300"
            >
              Explore Fleet
            </Link>
          </div>
        </div>
      </section>
      <TopRated />
    </main>
  );
}

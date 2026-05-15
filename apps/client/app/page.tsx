"use client";

import Link from "next/link";
import { useState } from "react";
import {
  ArrowRight,
  Sparkles,
  MousePointer2,
  Palette,
  Link2,
  Github,
  Music2,
  MapPin,
  Quote,
  Camera,
  Check,
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function LandingPage() {
  return (
    <main className='min-h-screen bg-[#fdfbf7] text-neutral-900 selection:bg-emerald-200/70 selection:text-emerald-950'>
      <Navbar />
      <Hero />
      <BentoShowcase />
      <Features />
      <HowItWorks />
      <FinalCTA />
      <Footer />
    </main>
  );
}

/* ----------------------------- NAVBAR ----------------------------- */
function Navbar() {
  return (
    <header className='sticky top-0 z-40 w-full border-b border-neutral-900/5 bg-[#fdfbf7]/80 backdrop-blur-md'>
      <nav className='mx-auto flex h-16 max-w-7xl items-center justify-between px-6'>
        <Link
          href='/'
          className='flex items-center gap-2'>
          <Logo />
          <span className='text-lg font-semibold tracking-tight'>folikro</span>
        </Link>

        <div className='hidden items-center gap-8 text-sm text-neutral-600 md:flex'>
          <a
            href='#showcase'
            className='hover:text-neutral-900 transition-colors'>
            Showcase
          </a>
          <a
            href='#features'
            className='hover:text-neutral-900 transition-colors'>
            Features
          </a>
          <a
            href='#how-it-works'
            className='hover:text-neutral-900 transition-colors'>
            How it works
          </a>
        </div>

        <div className='flex items-center gap-2'>
          <Link
            href='/auth/login'
            className='hidden rounded-full px-4 py-2 text-sm font-medium text-neutral-700 hover:bg-neutral-900/5 sm:inline-flex'>
            Log in
          </Link>
          <Link
            href='/auth/register'
            className='inline-flex items-center gap-1.5 rounded-full bg-neutral-900 px-4 py-2 text-sm font-medium text-white shadow-sm transition-all hover:bg-neutral-800 hover:shadow-md active:scale-95'>
            Get started
            <ArrowRight className='size-3.5' />
          </Link>
        </div>
      </nav>
    </header>
  );
}

function Logo() {
  return (
    <div className='grid size-8 grid-cols-2 grid-rows-2 gap-0.5 rounded-lg bg-neutral-900 p-1.5'>
      <span className='rounded-[2px] bg-rose-300' />
      <span className='rounded-[2px] bg-amber-300' />
      <span className='rounded-[2px] bg-sky-300' />
      <span className='rounded-[2px] bg-emerald-300' />
    </div>
  );
}

/* ------------------------------ HERO ------------------------------ */
function Hero() {
  const [username, setUsername] = useState("");

  return (
    <section className='relative overflow-hidden'>
      {/* Soft gradient blobs */}
      <div className='pointer-events-none absolute -top-40 -left-40 size-112 rounded-full bg-rose-200/50 blur-3xl' />
      <div className='pointer-events-none absolute -top-20 right-0 size-128 rounded-full bg-emerald-200/40 blur-3xl' />
      <div className='pointer-events-none absolute top-80 left-1/3 size-104 rounded-full bg-amber-200/40 blur-3xl' />

      <div className='relative mx-auto grid max-w-7xl grid-cols-1 items-center gap-16 px-6 pt-20 pb-24 lg:grid-cols-2 lg:pt-28 lg:pb-32'>
        {/* Left - copy */}
        <div className='relative z-10'>
          <div className='inline-flex items-center gap-2 rounded-full border border-neutral-900/10 bg-white/60 px-3 py-1 text-xs font-medium text-neutral-700 backdrop-blur-sm'>
            <Sparkles className='size-3.5 text-amber-500' />
            New · Live preview as you build
          </div>

          <h1 className='mt-6 text-5xl font-semibold leading-[1.05] tracking-tight text-neutral-900 sm:text-6xl lg:text-7xl'>
            Your story,
            <br />
            <span className='relative inline-block'>
              <span className='relative z-10'>beautifully tiled.</span>
              <svg
                aria-hidden
                viewBox='0 0 300 12'
                className='absolute -bottom-2 left-0 h-3 w-full text-emerald-400/70'
                preserveAspectRatio='none'>
                <path
                  d='M2 8 C 80 2, 220 2, 298 8'
                  stroke='currentColor'
                  strokeWidth='4'
                  strokeLinecap='round'
                  fill='none'
                />
              </svg>
            </span>
          </h1>

          <p className='mt-6 max-w-xl text-lg leading-relaxed text-neutral-600'>
            Build a one-page bento portfolio that drags, drops, and dazzles.
            Drop in your links, projects, photos and vibes - share a single
            beautiful URL.
          </p>

          {/* Username claim */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              window.location.href = `/auth/register${
                username ? `?u=${encodeURIComponent(username)}` : ""
              }`;
            }}
            className='mt-8 flex max-w-md items-center gap-2 rounded-full border border-neutral-900/10 bg-white p-1.5 shadow-sm focus-within:ring-2 focus-within:ring-emerald-400/40'>
            <div className='flex flex-1 items-center pl-3 text-sm text-neutral-500'>
              <span className='hidden sm:inline'>folikro.com/</span>
              <input
                value={username}
                onChange={(e) =>
                  setUsername(
                    e.target.value
                      .toLowerCase()
                      .replace(/[^a-z0-9_-]/g, "")
                      .slice(0, 24),
                  )
                }
                placeholder='yourname'
                className='w-full bg-transparent px-1 py-1.5 text-base text-neutral-900 placeholder:text-neutral-400 focus:outline-none'
              />
            </div>
            <button
              type='submit'
              className='inline-flex shrink-0 items-center gap-1.5 rounded-full bg-neutral-900 px-4 py-2 text-sm font-medium text-white transition-all hover:bg-neutral-800 active:scale-95'>
              Claim it
              <ArrowRight className='size-3.5' />
            </button>
          </form>

          <div className='mt-5 flex items-center gap-4 text-xs text-neutral-500'>
            <span className='inline-flex items-center gap-1.5'>
              <Check className='size-3.5 text-emerald-500' /> Free forever plan
            </span>
            <span className='inline-flex items-center gap-1.5'>
              <Check className='size-3.5 text-emerald-500' /> No credit card
            </span>
          </div>
        </div>

        {/* Right - floating bento mock */}
        <div className='relative z-10 mx-auto w-full max-w-lg'>
          <div className='relative aspect-4/5 w-full'>
            {/* Browser chrome */}
            <div className='absolute inset-0 rounded-3xl border border-neutral-900/10 bg-white shadow-2xl shadow-neutral-900/10'>
              <div className='flex items-center gap-1.5 border-b border-neutral-900/5 px-4 py-3'>
                <span className='size-2.5 rounded-full bg-rose-300' />
                <span className='size-2.5 rounded-full bg-amber-300' />
                <span className='size-2.5 rounded-full bg-emerald-300' />
                <div className='ml-3 flex-1 truncate rounded-md bg-neutral-100 px-3 py-1 text-xs text-neutral-500'>
                  folikro.com/aria
                </div>
              </div>
              <MiniBento />
            </div>

            {/* Floating badges */}
            <div className='absolute -top-4 -left-6 hidden -rotate-6 rounded-2xl border border-neutral-900/10 bg-white px-3 py-2 text-xs font-medium shadow-lg sm:flex sm:items-center sm:gap-2'>
              <MousePointer2 className='size-3.5 text-emerald-600' />
              Drag to resize
            </div>
            <div className='absolute -right-4 bottom-16 hidden rotate-[5deg] rounded-2xl border border-neutral-900/10 bg-white px-3 py-2 text-xs font-medium shadow-lg sm:flex sm:items-center sm:gap-2'>
              <Palette className='size-3.5 text-rose-500' />
              Pick any vibe
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function MiniBento() {
  return (
    <div className='grid grid-cols-4 grid-rows-5 gap-2.5 p-4'>
      {/* avatar/name */}
      <div className='col-span-2 row-span-2 rounded-2xl bg-linear-to-br from-amber-200 to-rose-200 p-4 ring-1 ring-neutral-900/5'>
        <div className='size-10 rounded-full bg-white shadow-sm' />
        <div className='mt-3 text-sm font-semibold text-neutral-900'>
          Aria Lin
        </div>
        <div className='text-[11px] text-neutral-700'>designer · builder</div>
      </div>

      {/* photo */}
      <div className='col-span-2 row-span-2 overflow-hidden rounded-2xl bg-neutral-900 ring-1 ring-neutral-900/5'>
        <div className='flex h-full items-end justify-between bg-[radial-gradient(ellipse_at_top_right,#34d399_0%,transparent_55%),radial-gradient(ellipse_at_bottom_left,#f472b6_0%,transparent_55%)] p-3'>
          <Camera className='size-4 text-white/80' />
          <span className='text-[10px] text-white/70'>cover</span>
        </div>
      </div>

      {/* link */}
      <div className='col-span-2 row-span-1 flex items-center gap-2 rounded-2xl bg-white p-3 ring-1 ring-neutral-900/10'>
        <div className='grid size-7 place-items-center rounded-lg bg-emerald-100'>
          <Link2 className='size-3.5 text-emerald-700' />
        </div>
        <div>
          <div className='text-[11px] font-medium'>Latest project</div>
          <div className='text-[10px] text-neutral-500'>aria.studio</div>
        </div>
      </div>

      {/* music */}
      <div className='col-span-2 row-span-1 flex items-center gap-2 rounded-2xl bg-neutral-900 p-3 text-white ring-1 ring-neutral-900/10'>
        <div className='grid size-7 place-items-center rounded-lg bg-white/10'>
          <Music2 className='size-3.5' />
        </div>
        <div>
          <div className='text-[11px] font-medium'>Now playing</div>
          <div className='text-[10px] text-white/60'>Phoebe - Funny</div>
        </div>
      </div>

      {/* github */}
      <div className='col-span-1 row-span-1 grid place-items-center rounded-2xl bg-white ring-1 ring-neutral-900/10'>
        <Github className='size-4 text-neutral-700' />
      </div>

      {/* location */}
      <div className='col-span-1 row-span-1 flex items-center gap-1.5 rounded-2xl bg-sky-100 p-2 ring-1 ring-neutral-900/5'>
        <MapPin className='size-3.5 text-sky-700' />
        <span className='text-[10px] font-medium text-sky-900'>Lisbon</span>
      </div>

      {/* quote */}
      <div className='col-span-2 row-span-1 rounded-2xl bg-emerald-100 p-3 ring-1 ring-neutral-900/5'>
        <Quote className='size-3.5 text-emerald-700' />
        <p className='mt-1 text-[10px] leading-tight text-emerald-900'>
          “Make it small, make it sing.”
        </p>
      </div>
    </div>
  );
}

/* --------------------------- BENTO SHOW --------------------------- */
function BentoShowcase() {
  return (
    <section
      id='showcase'
      className='relative border-t border-neutral-900/5 bg-white'>
      <div className='mx-auto max-w-7xl px-6 py-24'>
        <div className='mx-auto max-w-2xl text-center'>
          <div className='inline-flex items-center gap-2 rounded-full border border-neutral-900/10 bg-neutral-50 px-3 py-1 text-xs font-medium text-neutral-700'>
            Endless layouts
          </div>
          <h2 className='mt-4 text-4xl font-semibold tracking-tight sm:text-5xl'>
            One page. Infinite expressions.
          </h2>
          <p className='mt-4 text-lg text-neutral-600'>
            Mix and match widgets like puzzle pieces. Resize anything. Style
            everything. Your folikro feels like *you* - not a template.
          </p>
        </div>

        <div className='mt-16 grid grid-cols-12 gap-3 sm:gap-4'>
          <ShowcaseTile
            className='col-span-12 sm:col-span-6 lg:col-span-4 row-span-2 bg-linear-to-br from-rose-200 via-amber-100 to-emerald-100'
            kicker='Hero block'
            title='Big, bold introductions'
            body='Lead with a name, a tagline, an avatar - set the tone in one tile.'
          />
          <ShowcaseTile
            className='col-span-6 sm:col-span-3 lg:col-span-4 bg-neutral-900 text-white'
            kicker='Links'
            title='All the places you live online'
            dark
          />
          <ShowcaseTile
            className='col-span-6 sm:col-span-3 lg:col-span-4 bg-emerald-100'
            kicker='Projects'
            title='Show the work that matters'
          />
          <ShowcaseTile
            className='col-span-6 sm:col-span-6 lg:col-span-4 bg-sky-100'
            kicker='Photos'
            title='Galleries with one click'
          />
          <ShowcaseTile
            className='col-span-6 sm:col-span-3 lg:col-span-2 bg-amber-100'
            kicker='Now'
            title='What you’re into today'
          />
          <ShowcaseTile
            className='col-span-12 sm:col-span-3 lg:col-span-2 bg-rose-100'
            kicker='Contact'
            title='Say hi'
          />
        </div>
      </div>
    </section>
  );
}

function ShowcaseTile({
  className,
  kicker,
  title,
  body,
  dark,
}: {
  className?: string;
  kicker: string;
  title: string;
  body?: string;
  dark?: boolean;
}) {
  return (
    <div
      className={cn(
        "group relative overflow-hidden rounded-2xl p-5 ring-1 ring-neutral-900/5 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg min-h-32",
        className,
      )}>
      <div
        className={cn(
          "text-[11px] font-medium uppercase tracking-wider",
          dark ? "text-white/60" : "text-neutral-600",
        )}>
        {kicker}
      </div>
      <div className='mt-2 text-base font-semibold leading-snug sm:text-lg'>
        {title}
      </div>
      {body && (
        <p
          className={cn(
            "mt-2 text-sm leading-relaxed",
            dark ? "text-white/70" : "text-neutral-700",
          )}>
          {body}
        </p>
      )}
      <ArrowRight
        className={cn(
          "absolute right-4 bottom-4 size-4 translate-x-1 opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100",
          dark ? "text-white" : "text-neutral-900",
        )}
      />
    </div>
  );
}

/* ----------------------------- FEATURES ----------------------------- */
function Features() {
  const items = [
    {
      icon: MousePointer2,
      title: "Drag, drop, done",
      body: "A real grid that snaps where you want it. Resize widgets like sticky notes. No fiddling, no code.",
      tone: "bg-emerald-50 text-emerald-700 ring-emerald-200",
    },
    {
      icon: Palette,
      title: "Style without limits",
      body: "Backgrounds, gradients, patterns, blurs and shadows. Tweak every tile until it feels like yours.",
      tone: "bg-rose-50 text-rose-700 ring-rose-200",
    },
    {
      icon: Link2,
      title: "One link, everywhere",
      body: "Share folikro.com/yourname in your bio. Update once - it’s live everywhere instantly.",
      tone: "bg-amber-50 text-amber-700 ring-amber-200",
    },
  ];

  return (
    <section
      id='features'
      className='border-t border-neutral-900/5 bg-[#fdfbf7]'>
      <div className='mx-auto max-w-7xl px-6 py-24'>
        <div className='grid gap-3 sm:grid-cols-2 lg:grid-cols-3'>
          {items.map((it) => (
            <div
              key={it.title}
              className='group rounded-3xl border border-neutral-900/5 bg-white p-7 transition-all hover:-translate-y-1 hover:shadow-xl hover:shadow-neutral-900/5'>
              <div
                className={cn(
                  "inline-grid size-11 place-items-center rounded-2xl ring-1",
                  it.tone,
                )}>
                <it.icon className='size-5' />
              </div>
              <h3 className='mt-5 text-xl font-semibold tracking-tight'>
                {it.title}
              </h3>
              <p className='mt-2 text-neutral-600 leading-relaxed'>{it.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* --------------------------- HOW IT WORKS --------------------------- */
function HowItWorks() {
  const steps = [
    {
      n: "01",
      title: "Claim your handle",
      body: "Pick a username. Get folikro.com/yourname instantly - yours forever.",
    },
    {
      n: "02",
      title: "Drop in your widgets",
      body: "Add links, photos, projects, music, quotes. Drag them around till it sings.",
    },
    {
      n: "03",
      title: "Share your one URL",
      body: "Put it in your bio, your email, your business card. Update anytime.",
    },
  ];

  return (
    <section
      id='how-it-works'
      className='border-t border-neutral-900/5 bg-white'>
      <div className='mx-auto max-w-7xl px-6 py-24'>
        <div className='mx-auto max-w-2xl text-center'>
          <div className='inline-flex items-center gap-2 rounded-full border border-neutral-900/10 bg-neutral-50 px-3 py-1 text-xs font-medium text-neutral-700'>
            How it works
          </div>
          <h2 className='mt-4 text-4xl font-semibold tracking-tight sm:text-5xl'>
            Live in three steps.
          </h2>
        </div>

        <div className='mt-16 grid gap-6 md:grid-cols-3'>
          {steps.map((s, i) => (
            <div
              key={s.n}
              className='relative rounded-3xl border border-neutral-900/5 bg-[#fdfbf7] p-7'>
              <div className='flex items-center gap-3'>
                <span className='font-mono text-sm text-neutral-400'>
                  {s.n}
                </span>
                <span className='h-px flex-1 bg-neutral-200' />
              </div>
              <h3 className='mt-5 text-2xl font-semibold tracking-tight'>
                {s.title}
              </h3>
              <p className='mt-2 text-neutral-600 leading-relaxed'>{s.body}</p>
              {i < steps.length - 1 && (
                <ArrowRight className='absolute -right-3 top-1/2 hidden size-5 -translate-y-1/2 text-neutral-300 md:block' />
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ----------------------------- FINAL CTA ----------------------------- */
function FinalCTA() {
  return (
    <section className='border-t border-neutral-900/5 bg-[#fdfbf7]'>
      <div className='mx-auto max-w-7xl px-6 py-24'>
        <div className='relative overflow-hidden rounded-[2rem] bg-neutral-900 p-12 text-white sm:p-16'>
          {/* decorative tiles */}
          <div className='pointer-events-none absolute inset-0 opacity-30'>
            <div className='absolute -top-10 -right-10 size-40 rotate-12 rounded-3xl bg-emerald-300/40 blur-2xl' />
            <div className='absolute -bottom-12 -left-10 size-48 -rotate-6 rounded-3xl bg-rose-300/40 blur-2xl' />
          </div>

          <div className='relative max-w-2xl'>
            <h2 className='text-4xl font-semibold tracking-tight sm:text-5xl'>
              Ready to make it yours?
            </h2>
            <p className='mt-4 text-lg text-white/70'>
              A page that looks designed, in less time than it takes to pick a
              coffee. Free to start, simple to share.
            </p>

            <div className='mt-8 flex flex-wrap items-center gap-3'>
              <Link
                href='/auth/register'
                className='inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-semibold text-neutral-900 shadow-lg transition-all hover:bg-neutral-100 active:scale-95'>
                Build my folikro
                <ArrowRight className='size-4' />
              </Link>
              <Link
                href='/auth/login'
                className='inline-flex items-center gap-2 rounded-full border border-white/20 px-6 py-3 text-sm font-semibold text-white transition-all hover:bg-white/10'>
                I already have one
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------ FOOTER ------------------------------ */
function Footer() {
  return (
    <footer className='border-t border-neutral-900/5 bg-[#fdfbf7]'>
      <div className='mx-auto flex max-w-7xl flex-col items-center justify-between gap-6 px-6 py-10 sm:flex-row'>
        <div className='flex items-center gap-2'>
          <Logo />
          <span className='text-sm font-semibold tracking-tight'>folikro</span>
          <span className='ml-3 text-xs text-neutral-500'>
            © {new Date().getFullYear()} - your story, beautifully tiled.
          </span>
        </div>
        <div className='flex items-center gap-6 text-sm text-neutral-600'>
          <a
            href='#features'
            className='hover:text-neutral-900'>
            Features
          </a>
          <a
            href='#how-it-works'
            className='hover:text-neutral-900'>
            How it works
          </a>
          <Link
            href='/auth/login'
            className='hover:text-neutral-900'>
            Log in
          </Link>
        </div>
      </div>
    </footer>
  );
}

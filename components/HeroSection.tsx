'use client';

import { Fragment, useState, useRef } from 'react';
import Image from 'next/image';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { Cormorant_Garamond } from 'next/font/google';

const cormorant = Cormorant_Garamond({
  weight: ['300'],
  subsets: ['latin', 'cyrillic'],
  display: 'swap',
});

type Lang = 'ru' | 'he';

const navLinks: Record<Lang, string[]> = {
  ru: ['Обо мне', 'Услуги', 'Подход', 'Отзывы', 'Вопросы', 'Контакты'],
  he: ['אודות', 'שירותים', 'גישה', 'המלצות', 'שאלות', 'צרו קשר'],
};

const copy: Record<Lang, { headline: string; subheadline: string; cta: string; alt: string }> = {
  ru: {
    headline: 'Отношения с ребёнком, которые вы хотели с самого начала',
    subheadline:
      'Наталья Сиголович — консультант по детско-родительским отношениям в подходе эмоционального интеллекта',
    cta: 'Начать бесплатно',
    alt: 'Мать и дочь держатся за руки на золотом закате',
  },
  he: {
    headline: 'היחסים עם הילד שרצית מההתחלה',
    subheadline: 'נטליה סיגולוביץ׳ — ייעוץ להורים בגישת האינטליגנציה הרגשית',
    cta: 'להתחיל בחינם',
    alt: 'אמא ובת אוחזות ידיים בשקיעה זהובה',
  },
};

const SYS = 'system-ui, -apple-system, sans-serif';

export default function HeroSection() {
  const [lang, setLang] = useState<Lang>('ru');
  const isRTL = lang === 'he';
  const t = copy[lang];
  const links = navLinks[lang];

  const sectionRef = useRef<HTMLElement>(null);
  const navRef = useRef<HTMLElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const subRef = useRef<HTMLParagraphElement>(null);

  useGSAP(
    () => {
      const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

      if (prefersReduced) {
        gsap.set([navRef.current, headlineRef.current, subRef.current], { opacity: 1, y: 0 });
        return;
      }

      gsap.set(navRef.current, { opacity: 0, y: -12 });
      gsap.set(headlineRef.current, { opacity: 0, y: 24 });
      gsap.set(subRef.current, { opacity: 0, y: 16 });

      const tl = gsap.timeline();
      tl.to(navRef.current, { opacity: 1, y: 0, duration: 0.7, ease: 'power2.out' }, 0.1)
        .to(headlineRef.current, { opacity: 1, y: 0, duration: 1, ease: 'power3.out' }, 0.35)
        .to(subRef.current, { opacity: 1, y: 0, duration: 0.7, ease: 'power3.out' }, 0.55);
    },
    { scope: sectionRef, dependencies: [] },
  );

  return (
    <section
      ref={sectionRef}
      dir={isRTL ? 'rtl' : 'ltr'}
      className="relative overflow-hidden"
      style={{ height: '100svh' }}
    >
      {/* Fullscreen background */}
      <Image
        src="/images/hero.png"
        alt={t.alt}
        fill
        priority
        className="object-cover"
        style={{ objectPosition: 'center 30%' }}
        sizes="100vw"
      />

      {/* Base overlay — keeps photo readable through the full image */}
      <div
        aria-hidden="true"
        className="absolute inset-0"
        style={{ background: 'rgba(20,17,12,0.38)' }}
      />

      {/* ── ZONE 1: Top navigation ───────────────────────────────────────── */}
      <nav
        ref={navRef}
        aria-label="Main navigation"
        className="absolute top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-5 md:px-12 md:py-7"
      >
        {/* Brand name — stays "Наталья Сиголович" in both languages */}
        <span
          style={{
            fontFamily: SYS,
            fontSize: '0.95rem',
            fontWeight: 400,
            color: '#F5F0E8',
            letterSpacing: '0.1em',
          }}
        >
          Наталья Сиголович
        </span>

        {/* Center nav links — desktop only */}
        <div className="hidden md:flex items-center" style={{ gap: '36px' }}>
          {links.map((label) => (
            <a
              key={label}
              href="#"
              style={{
                fontFamily: SYS,
                fontSize: '0.82rem',
                fontWeight: 400,
                color: '#F5F0E8',
                opacity: 0.8,
                letterSpacing: '0.06em',
                textDecoration: 'none',
                transition: 'opacity 0.2s ease',
              }}
              onMouseEnter={(e) => { e.currentTarget.style.opacity = '1'; }}
              onMouseLeave={(e) => { e.currentTarget.style.opacity = '0.8'; }}
            >
              {label}
            </a>
          ))}
        </div>

        {/* Right cluster: ghost CTA + language switcher */}
        <div className="flex items-center" style={{ gap: '24px' }}>
          {/* Ghost CTA — desktop only */}
          <a
            href="#contact"
            className="hidden md:inline-block focus:outline-none focus-visible:ring-2 focus-visible:ring-[#C4856A] focus-visible:ring-offset-1"
            style={{
              fontFamily: SYS,
              fontSize: '0.8rem',
              letterSpacing: '0.07em',
              fontWeight: 400,
              color: '#F5F0E8',
              border: '1px solid rgba(245,240,232,0.55)',
              borderRadius: '2px',
              padding: '10px 22px',
              background: 'transparent',
              textDecoration: 'none',
              transition: 'background 0.2s ease',
            }}
            onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(245,240,232,0.1)'; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}
          >
            {t.cta}
          </a>

          {/* Language switcher */}
          <div className="flex items-center" style={{ gap: '5px' }}>
            {(['ru', 'he'] as Lang[]).map((l, i) => (
              <Fragment key={l}>
                {i === 1 && (
                  <span
                    aria-hidden="true"
                    style={{
                      fontFamily: SYS,
                      fontSize: '0.78rem',
                      color: '#F5F0E8',
                      opacity: 0.3,
                      userSelect: 'none',
                    }}
                  >
                    /
                  </span>
                )}
                <button
                  onClick={() => setLang(l)}
                  aria-pressed={lang === l}
                  aria-label={`Switch to ${l === 'ru' ? 'Russian' : 'Hebrew'}`}
                  className="relative rounded-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-[#C4856A]"
                  style={{
                    fontFamily: SYS,
                    fontSize: '0.78rem',
                    letterSpacing: '0.1em',
                    fontWeight: lang === l ? 500 : 400,
                    color: '#F5F0E8',
                    opacity: lang === l ? 1 : 0.45,
                    background: 'none',
                    border: 'none',
                    padding: '2px 3px',
                    cursor: 'pointer',
                    transition: 'opacity 0.2s ease',
                  }}
                >
                  {l.toUpperCase()}
                  {lang === l && (
                    <span
                      aria-hidden="true"
                      className="absolute -bottom-0.5 left-0 right-0 block"
                      style={{ height: '2px', backgroundColor: '#C4856A' }}
                    />
                  )}
                </button>
              </Fragment>
            ))}
          </div>
        </div>
      </nav>

      {/* ── ZONE 2: Bottom text block ─────────────────────────────────────── */}
      <div
        aria-hidden="false"
        className="absolute bottom-0 left-0 right-0 z-20 flex flex-col justify-end text-center pb-11 md:pb-16 px-6 md:px-12"
        style={{
          height: '58%',
          background:
            'linear-gradient(to bottom, transparent 0%, rgba(18,15,10,0.88) 45%, rgba(18,15,10,0.96) 100%)',
        }}
      >
        <h1
          ref={headlineRef}
          className={cormorant.className}
          style={{
            fontSize: 'clamp(2.4rem, 5vw, 4.8rem)',
            fontWeight: 300,
            lineHeight: 1.08,
            letterSpacing: '-0.01em',
            color: '#F5F0E8',
            maxWidth: '800px',
            margin: '0 auto',
          }}
        >
          {t.headline}
        </h1>

        <p
          ref={subRef}
          style={{
            fontFamily: SYS,
            fontSize: 'clamp(0.85rem, 1.5vw, 1rem)',
            fontWeight: 400,
            color: '#F5F0E8',
            opacity: 0.7,
            maxWidth: '500px',
            margin: '14px auto 0',
            letterSpacing: '0.01em',
          }}
        >
          {t.subheadline}
        </p>
      </div>
    </section>
  );
}

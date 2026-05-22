'use client';

import { useRef, useState, useEffect, useLayoutEffect, useCallback } from 'react';
import Image from 'next/image';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';

const HELVETICA = '"Helvetica Neue", Helvetica, Arial, sans-serif';

type Lang = 'ru' | 'he';

const navLinks: Record<Lang, string[]> = {
  ru: ['Обо мне', 'Услуги', 'Подход', 'Отзывы', 'Вопросы', 'Контакты'],
  he: ['אודות', 'שירותים', 'גישה', 'המלצות', 'שאלות', 'צרו קשר'],
};

const copy: Record<
  Lang,
  {
    headline: string;
    subheadline: string;
    navCta: string;
    heroCta: string;
    alt: string;
    skipLink: string;
    navLabel: string;
    logo: string;
    hamburgerLabel: string;
    closeLabel: string;
    firstFree: string;
    overlayCta: string;
  }
> = {
  ru: {
    headline: 'Консультации для родителей',
    subheadline:
      'Помогаю родителям детей от 2 до 9 лет сохранять спокойствие и управлять своими реакциями в сложных ситуациях с ребёнком. Консультант в подходе эмоционального интеллекта.',
    navCta: 'Записаться на консультацию',
    heroCta: 'Записаться на консультацию',
    alt: 'Мать и дочь держатся за руки на золотом закате',
    skipLink: 'Перейти к содержимому',
    navLabel: 'Основная навигация',
    logo: 'Наталья Сиголович',
    hamburgerLabel: 'Открыть меню',
    closeLabel: 'Закрыть меню',
    firstFree: 'Первая консультация бесплатно',
    overlayCta: 'Записаться',
  },
  he: {
    headline: 'ייעוץ להורים',
    subheadline:
      'אני עוזרת להורים לילדים בגילאי 2 עד 9 לשמור על רוגע ולנהל את התגובות שלהם במצבים מורכבים. מומחית בגישת האינטליגנציה הרגשית.',
    navCta: 'לקביעת פגישה',
    heroCta: 'לקביעת פגישה',
    alt: 'אמא ובת אוחזות ידיים בשקיעה זהובה',
    skipLink: 'דלג לתוכן',
    navLabel: 'ניווט ראשי',
    logo: 'נטליה סיגולוביץ׳',
    hamburgerLabel: 'פתח תפריט',
    closeLabel: 'סגור תפריט',
    firstFree: 'הפגישה הראשונה חינם',
    overlayCta: 'לקביעת פגישה',
  },
};



export default function HeroSection() {
  const [lang, setLang] = useState<Lang>('ru');
  // overlayOpen drives display:flex/none via React — no GSAP fighting React for display
  const [overlayOpen, setOverlayOpen] = useState(false);
  const isRTL = lang === 'he';
  const t = copy[lang];
  const links = navLinks[lang];

  const sectionRef = useRef<HTMLElement>(null);
  const navRef = useRef<HTMLElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const subRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLAnchorElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const overlayLinksRef = useRef<HTMLDivElement>(null);

  // ── Hero entrance animation — mount only ──────────────────────────────────
  useGSAP(
    () => {
      const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

      if (prefersReduced) {
        gsap.set([navRef.current, headlineRef.current, subRef.current, ctaRef.current], {
          opacity: 1,
          y: 0,
        });
        return;
      }

      gsap.set(navRef.current, { opacity: 0, y: -12 });
      gsap.set(headlineRef.current, { opacity: 0, y: 24 });
      gsap.set(subRef.current, { opacity: 0, y: 16 });
      gsap.set(ctaRef.current, { opacity: 0, y: 20 });

      const tl = gsap.timeline();
      tl.to(navRef.current, { opacity: 1, y: 0, duration: 0.7, ease: 'power2.out' }, 0.1)
        .to(headlineRef.current, { opacity: 1, y: 0, duration: 1.0, ease: 'power3.out' }, 0.35)
        .to(subRef.current, { opacity: 1, y: 0, duration: 0.7, ease: 'power3.out' }, 0.55)
        .to(ctaRef.current, { opacity: 1, y: 0, duration: 0.65, ease: 'power3.out' }, 0.65);
    },
    { scope: sectionRef, dependencies: [] },
  );

  // ── Overlay: set opacity:0 before browser paints so there's no flash ──────
  // Runs synchronously after DOM update, before paint
  useLayoutEffect(() => {
    if (!overlayOpen) return;
    const overlay = overlayRef.current;
    const container = overlayLinksRef.current;
    if (!overlay) return;
    gsap.set(overlay, { opacity: 0 });
    if (container) gsap.set(Array.from(container.children), { opacity: 0, y: 20 });
  }, [overlayOpen]);

  // ── Overlay: fade-in animation after overlay is visible ───────────────────
  useEffect(() => {
    if (!overlayOpen) return;
    const overlay = overlayRef.current;
    const container = overlayLinksRef.current;
    if (!overlay) return;

    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (prefersReduced) {
      gsap.set(overlay, { opacity: 1 });
      if (container) gsap.set(Array.from(container.children), { opacity: 1, y: 0 });
      return;
    }

    const tl = gsap.timeline();
    tl.to(overlay, { opacity: 1, duration: 0.3, ease: 'power2.out' });
    if (container && container.children.length > 0) {
      tl.to(
        Array.from(container.children),
        { opacity: 1, y: 0, duration: 0.4, ease: 'power3.out', stagger: 0.05 },
        0.1,
      );
    }
    return () => { tl.kill(); };
  }, [overlayOpen]);

  // ── Close menu: fade out, then hide via direct DOM + state sync ──────────
  const closeMenu = useCallback(() => {
    const overlay = overlayRef.current;
    if (!overlay) return;
    document.body.style.overflow = '';

    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!prefersReduced) {
      gsap.to(overlay, {
        opacity: 0,
        duration: 0.2,
        ease: 'power2.in',
        onComplete: () => {
          overlay.style.display = 'none'; // direct DOM — React batching won't delay this
          setOverlayOpen(false);          // sync React state for future renders
        },
      });
    } else {
      overlay.style.display = 'none';
      setOverlayOpen(false);
    }
  }, []);

  // ── Open menu ─────────────────────────────────────────────────────────────
  const openMenu = useCallback(() => {
    document.body.style.overflow = 'hidden';
    setOverlayOpen(true);
  }, []);

  // ── Escape key ────────────────────────────────────────────────────────────
  useEffect(() => {
    if (!overlayOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeMenu();
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [overlayOpen, closeMenu]);

  // ── Language switcher — plain text, no pill or border ────────────────────
  const langSwitcher = (displayClass: string, isMobile = false) => (
    <div
      role="group"
      aria-label="Language selection"
      className={`items-center ${displayClass}`}
      style={{ gap: isMobile ? '4px' : '6px', display: 'flex' }}
    >
      <button
        onClick={() => setLang('ru')}
        aria-pressed={lang === 'ru'}
        aria-label="Switch to Russian"
        className="focus-ring"
        style={{
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          padding: '2px 4px',
          fontFamily: HELVETICA,
          fontSize: isMobile ? '0.85rem' : '0.9rem',
          fontWeight: lang === 'ru' ? 600 : 500,
          color: '#FFFFFF',
          opacity: lang === 'ru' ? 1 : 0.6,
          transition: 'all 0.2s ease',
        }}
        onMouseEnter={(e) => { if (lang !== 'ru') e.currentTarget.style.opacity = '0.85'; }}
        onMouseLeave={(e) => { if (lang !== 'ru') e.currentTarget.style.opacity = '0.6'; }}
      >
        РУ
      </button>
      <span
        aria-hidden="true"
        style={{
          color: '#FFFFFF',
          opacity: 0.4,
          userSelect: 'none',
          fontFamily: HELVETICA,
          fontSize: isMobile ? '0.85rem' : '0.9rem',
        }}
      >
        |
      </span>
      <button
        onClick={() => setLang('he')}
        aria-pressed={lang === 'he'}
        aria-label="Switch to Hebrew"
        className="focus-ring"
        style={{
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          padding: '2px 4px',
          fontFamily: HELVETICA,
          fontSize: isMobile ? '1.05rem' : '1.15rem',
          lineHeight: '1',
          opacity: lang === 'he' ? 1 : 0.6,
          transition: 'all 0.2s ease',
        }}
        onMouseEnter={(e) => { if (lang !== 'he') e.currentTarget.style.opacity = '0.85'; }}
        onMouseLeave={(e) => { if (lang !== 'he') e.currentTarget.style.opacity = '0.6'; }}
      >
        🇮🇱
      </button>
    </div>
  );

  return (
    <>
      {/* Skip to main content */}
      <a
        href="#hero-content"
        className="absolute left-0 top-0 z-[200] -translate-y-full bg-[#F5F0E8] px-4 py-2 text-sm text-[#1A1612] transition-transform focus:translate-y-0 focus:outline-none"
        style={{ fontFamily: HELVETICA }}
      >
        {t.skipLink}
      </a>

      {/* ── MOBILE FULLSCREEN MENU OVERLAY ──────────────────────────────────── */}
      {/* display is driven by React state — GSAP only handles opacity          */}
      <div
        ref={overlayRef}
        role="dialog"
        aria-modal="true"
        aria-label={t.navLabel}
        dir={isRTL ? 'rtl' : 'ltr'}
        style={{
          display: overlayOpen ? 'flex' : 'none',
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: 100,
          background: 'rgba(17, 17, 17, 0.82)',
          backdropFilter: 'blur(24px)',
          WebkitBackdropFilter: 'blur(24px)',
          flexDirection: 'column',
        }}
      >
        {/* Header: logo + close */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '20px 24px',
          }}
        >
          <span
            style={{
              fontFamily: HELVETICA,
              fontSize: 'var(--text-nav)',
              fontWeight: 400,
              color: '#F5F0E8',
              letterSpacing: '0.05em',
              lineHeight: 'var(--leading-nav)',
            }}
          >
            {t.logo}
          </span>
          <button
            onClick={closeMenu}
            aria-label={t.closeLabel}
            className="focus-ring"
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: '8px',
              position: 'relative',
              width: '38px',
              height: '38px',
            }}
          >
            <span
              aria-hidden="true"
              style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                width: '22px',
                height: '2px',
                background: '#F5F0E8',
                borderRadius: '2px',
                transform: 'translate(-50%, -50%) rotate(45deg)',
              }}
            />
            <span
              aria-hidden="true"
              style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                width: '22px',
                height: '2px',
                background: '#F5F0E8',
                borderRadius: '2px',
                transform: 'translate(-50%, -50%) rotate(-45deg)',
              }}
            />
          </button>
        </div>

        {/* Center: staggered nav links */}
        <div
          ref={overlayLinksRef}
          style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '24px',
          }}
        >
          {links.map((label) => (
            <a
              key={label}
              href="#"
              onClick={closeMenu}
              className="focus-ring"
              style={{
                fontFamily: HELVETICA,
                fontSize: '1.45rem',
                fontWeight: 400,
                color: '#F5F0E8',
                lineHeight: 1.2,
                letterSpacing: '-0.01em',
                textDecoration: 'none',
                transition: 'opacity 0.2s ease',
              }}
              onMouseEnter={(e) => { e.currentTarget.style.opacity = '0.65'; }}
              onMouseLeave={(e) => { e.currentTarget.style.opacity = '1'; }}
            >
              {label}
            </a>
          ))}
        </div>

        {/* Footer: footnote + CTA */}
        <div
          style={{
            borderTop: '1px solid rgba(245,240,232,0.12)',
            padding: '24px 24px 36px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '14px',
          }}
        >
          <span
            style={{
              fontFamily: HELVETICA,
              fontSize: '0.8rem',
              color: '#F5F0E8',
              opacity: 0.45,
              textAlign: 'center',
            }}
          >
            {t.firstFree}
          </span>
          <a
            href="#contact"
            onClick={closeMenu}
            className="focus-ring text-cta leading-cta tracking-cta"
            style={{
              fontFamily: HELVETICA,
              fontWeight: 500,
              color: '#140F0A',
              background: '#F5F0E8',
              borderRadius: '9999px',
              padding: '14px 28px',
              textDecoration: 'none',
              boxShadow: '0 2px 20px rgba(0,0,0,0.25)',
              width: '100%',
              maxWidth: '320px',
              textAlign: 'center',
            }}
          >
            {t.overlayCta}
          </a>
        </div>
      </div>

      {/* ── HERO SECTION ────────────────────────────────────────────────────── */}
      <section
        ref={sectionRef}
        lang={lang}
        dir={isRTL ? 'rtl' : 'ltr'}
        className="relative overflow-hidden"
        style={{ height: '100svh' }}
      >
        {/* Background photo */}
        <Image
          role="img"
          src="/images/hero.png"
          alt={t.alt}
          fill
          priority
          className="object-cover"
          style={{ objectPosition: 'center 30%' }}
          sizes="100vw"
        />

        {/* Bottom depth gradient — warm dark brown */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0"
          style={{
            zIndex: 1,
            background: `linear-gradient(
              to bottom,
              transparent 0%,
              rgba(20, 13, 8, 0.18) 30%,
              rgba(20, 13, 8, 0.74) 52%,
              rgba(20, 13, 8, 0.97) 68%,
              rgba(20, 13, 8, 1) 100%
            )`,
          }}
        />

        {/* Top scrim — keeps nav text legible over bright photo areas */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute left-0 right-0 top-0"
          style={{
            height: '140px',
            zIndex: 5,
            background: 'linear-gradient(to bottom, rgba(0,0,0,0.42) 0%, rgba(0,0,0,0) 100%)',
          }}
        />

        {/* ── ZONE 1: Navigation ─────────────────────────────────────────────── */}
        <nav
          ref={navRef}
          aria-label={t.navLabel}
          className="absolute left-0 right-0 top-0 flex items-center justify-between px-6 py-5 md:px-[52px] md:py-[30px]"
          style={{ zIndex: 50 }}
        >
          {/* Logo */}
          <span
            style={{
              fontFamily: HELVETICA,
              fontSize: 'var(--text-nav)',
              fontWeight: 400,
              color: '#F5F0E8',
              letterSpacing: '0.05em',
              lineHeight: 'var(--leading-nav)',
              whiteSpace: 'nowrap',
            }}
          >
            {t.logo}
          </span>

          {/* CENTER: desktop nav links only */}
          <div className="hidden md:flex items-center" style={{ gap: '48px' }}>
            {links.map((label) => (
              <a
                key={label}
                href="#"
                className="focus-ring text-nav leading-nav tracking-nav"
                style={{
                  fontFamily: HELVETICA,
                  fontWeight: 400,
                  color: '#FFFFFF',
                  opacity: 0.88,
                  textDecoration: 'none',
                  transition: 'all 0.2s ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.opacity = '1';
                  e.currentTarget.style.textDecoration = 'underline';
                  e.currentTarget.style.textDecorationColor = 'rgba(245,240,232,0.5)';
                  e.currentTarget.style.textUnderlineOffset = '4px';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.opacity = '0.88';
                  e.currentTarget.style.textDecoration = 'none';
                }}
              >
                {label}
              </a>
            ))}
          </div>

          {/* RIGHT: lang switcher + desktop ghost CTA + mobile hamburger */}
          <div className="flex items-center gap-4 md:gap-5">
            {/* Unified Lang Switcher (visible on both mobile and desktop) */}
            {langSwitcher('inline-flex', false)}

            {/* Ghost outline CTA — desktop only */}
            <a
              href="#contact"
              className="focus-ring hidden md:inline-block text-cta leading-cta tracking-cta"
              style={{
                fontFamily: HELVETICA,
                fontWeight: 500,
                color: '#FFFFFF',
                border: '1.5px solid rgba(255, 255, 255, 0.8)',
                borderRadius: '9999px',
                padding: '9px 24px',
                background: 'rgba(255, 255, 255, 0.08)',
                textDecoration: 'none',
                transition: 'background 0.2s ease, border-color 0.2s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.18)';
                e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 1)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.08)';
                e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.8)';
              }}
            >
              {t.navCta}
            </a>

            {/* 2-line hamburger — mobile only */}
            <button
              aria-label={t.hamburgerLabel}
              aria-expanded={overlayOpen}
              onClick={openMenu}
              className="focus-ring flex flex-col md:hidden"
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                padding: '8px',
                gap: '7px',
              }}
            >
              {[0, 1].map((i) => (
                <span
                  key={i}
                  aria-hidden="true"
                  style={{
                    display: 'block',
                    width: '28px',
                    height: '2px',
                    backgroundColor: '#F5F0E8',
                    borderRadius: '2px',
                  }}
                />
              ))}
            </button>
          </div>
        </nav>

        {/* ── ZONE 2: Bottom text block ──────────────────────────────────────── */}
        <div
          id="hero-content"
          className="absolute bottom-0 left-0 right-0 flex flex-col items-center text-center px-6 pb-[52px] md:px-12 md:pb-[72px]"
          style={{ zIndex: 20 }}
        >
          <h1
            ref={headlineRef}
            className="text-hero leading-hero tracking-hero"
            style={{
              fontFamily: HELVETICA,
              fontWeight: 400,
              color: '#FFFFFF',
              maxWidth: '720px',
              margin: '0 auto',
            }}
          >
            {t.headline}
          </h1>

          <p
            ref={subRef}
            className="text-paragraph leading-paragraph tracking-paragraph"
            style={{
              fontFamily: HELVETICA,
              fontWeight: 400,
              color: '#999999',
              maxWidth: '920px',
              margin: '24px auto 0',
            }}
          >
            {t.subheadline}
          </p>

          {/* Primary filled CTA — highest visual weight on the page */}
          <a
            ref={ctaRef}
            href="#contact"
            className="focus-ring block w-[calc(100%-48px)] max-w-[320px] mx-auto mt-8 py-[14px] px-7 md:inline-block md:w-auto md:max-w-none md:mt-10 md:py-[18px] md:px-[44px] text-cta leading-cta tracking-cta"
            style={{
              fontFamily: HELVETICA,
              fontWeight: 500,
              color: '#000000',
              background: '#F5F0E8',
              border: 'none',
              borderRadius: '9999px',
              textDecoration: 'none',
              textAlign: 'center',
              boxShadow: '0 2px 24px rgba(0,0,0,0.28)',
              transition: 'background-color 0.2s ease, transform 0.2s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#ede7da';
              e.currentTarget.style.transform = 'translateY(-1px)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = '#F5F0E8';
              e.currentTarget.style.transform = 'translateY(0)';
            }}
            onMouseDown={(e) => { e.currentTarget.style.transform = 'translateY(0)'; }}
            onMouseUp={(e) => { e.currentTarget.style.transform = 'translateY(-1px)'; }}
          >
            {t.heroCta}
          </a>
        </div>
      </section>
    </>
  );
}

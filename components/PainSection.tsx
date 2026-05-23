'use client';

import { useEffect, useRef, useState } from 'react';

// ─────────────────────────────────────────────────────────────────────────────
// PainSection — "С чем приходят родители"
// Only this file is modified. Hero, globals.css, and all other files untouched.
// ─────────────────────────────────────────────────────────────────────────────

const HELVETICA = '"Helvetica Neue", Helvetica, Arial, sans-serif';

const cards = [
  {
    id: 1,
    title: 'Истерики и сопротивление',
    description: 'Ребёнок не слышит, закатывает истерики, отказывается выполнять просьбы.',
    image: '/images/pain/card1.png',
    objectPosition: 'center top',
  },
  {
    id: 2,
    title: 'Чувство вины',
    description: 'Ощущение «плохого родителя», постоянное сомнение в своих решениях.',
    image: '/images/pain/pain2.png',
    objectPosition: 'center center',
  },
  {
    id: 3,
    title: 'Срывы на крик',
    description: 'Потеря контроля в моменты кризиса, сложности с саморегуляцией.',
    image: '/images/4.png',
    objectPosition: 'center center',
  },
  {
    id: 4,
    title: 'Границы и правила',
    description: 'Как выстроить спокойную среду в семье, чтобы ребёнок слышал и соблюдал договорённости.',
    image: '/images/3.png',
    objectPosition: 'center top',
  },
];

// Entrance animation delays per card (seconds)
const CARD_DELAYS = [0.25, 0.35, 0.45, 0.55];

export default function PainSection() {
  const headingRef = useRef<HTMLHeadingElement>(null);
  const subheadingRef = useRef<HTMLParagraphElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);

  // Active dot index for mobile pagination
  const [activeDot, setActiveDot] = useState(0);

  // ── Entrance animation via IntersectionObserver ──────────────────────────
  useEffect(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (prefersReduced) {
      [headingRef.current, subheadingRef.current, ...cardRefs.current].forEach((el) => {
        if (el) { el.style.opacity = '1'; el.style.transform = 'translateY(0)'; }
      });
      return;
    }

    [headingRef.current, subheadingRef.current, ...cardRefs.current].forEach((el) => {
      if (el) {
        el.style.opacity = '0';
        el.style.transform = 'translateY(24px)';
        el.style.willChange = 'opacity, transform';
      }
    });

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;

          // Heading
          const h = headingRef.current;
          if (h) {
            h.style.transition = 'opacity 0.8s cubic-bezier(0.25,0.46,0.45,0.94) 0s, transform 0.8s cubic-bezier(0.25,0.46,0.45,0.94) 0s';
            h.style.opacity = '1'; h.style.transform = 'translateY(0)';
          }

          // Subheading
          const s = subheadingRef.current;
          if (s) {
            s.style.transition = 'opacity 0.8s cubic-bezier(0.25,0.46,0.45,0.94) 0.15s, transform 0.8s cubic-bezier(0.25,0.46,0.45,0.94) 0.15s';
            s.style.opacity = '1'; s.style.transform = 'translateY(0)';
          }

          // Cards — staggered
          cardRefs.current.forEach((card, i) => {
            if (!card) return;
            const d = CARD_DELAYS[i];
            card.style.transition = `opacity 0.7s cubic-bezier(0.25,0.46,0.45,0.94) ${d}s, transform 0.7s cubic-bezier(0.25,0.46,0.45,0.94) ${d}s`;
            card.style.opacity = '1'; card.style.transform = 'translateY(0)';
          });

          observer.disconnect();
        });
      },
      { threshold: 0.1 },
    );

    if (headingRef.current) observer.observe(headingRef.current);
    return () => observer.disconnect();
  }, []);

  // ── Mobile pagination dots via IntersectionObserver ──────────────────────
  useEffect(() => {
    const isMobile = () => window.innerWidth < 768;
    if (!isMobile()) return;

    const dotObservers: IntersectionObserver[] = [];

    cardRefs.current.forEach((card, i) => {
      if (!card) return;
      const obs = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) setActiveDot(i);
          });
        },
        { threshold: 0.6 },
      );
      obs.observe(card);
      dotObservers.push(obs);
    });

    return () => dotObservers.forEach((o) => o.disconnect());
  }, []);

  return (
    <>
      {/* ── CSS: hover, scrollbar, responsive overrides ── */}
      <style>{`
        .pain-card:hover .pain-card-img {
          transform: scale(1.07);
        }
        .pain-card:hover .pain-card-strip {
          background: rgba(255,255,255,1);
        }
        .pain-cards-row::-webkit-scrollbar {
          display: none;
        }

        /* ── Desktop ── */
        @media (min-width: 768px) {
          .pain-cards-row {
            overflow-x: visible !important;
            padding: 0 4vw !important;
            justify-content: center;
            gap: 28px !important;
            flex-wrap: nowrap;
          }
          .pain-card {
            flex: 1 !important;
            max-width: 320px !important;
            width: auto !important;
            height: 520px !important;
          }
          .pain-subheading {
            white-space: nowrap;
            max-width: none !important;
            margin: 0.8rem 0 0 !important;
          }
          .pain-dots {
            display: none !important;
          }
        }

        /* ── Mobile ── */
        @media (max-width: 767px) {
          .pain-subheading {
            white-space: normal;
            text-align: center;
            max-width: 280px;
            margin: 0.8rem auto 0 !important;
          }
          .pain-dots {
            display: flex !important;
          }
        }
      `}</style>

      <section
        aria-label="С чем приходят родители"
        style={{
          background: '#1C1510',
          width: '100%',
          padding: '10vh 0 10vh 0',
          overflow: 'hidden',
        }}
      >
        {/* ── Heading block ── */}
        <div style={{ textAlign: 'center', padding: '0 24px' }}>
          <h2
            ref={headingRef}
            style={{
              fontFamily: HELVETICA,
              fontSize: 'clamp(2rem, 4vw, 3.2rem)',
              fontWeight: 300,
              color: '#F5F0E8',
              letterSpacing: '-0.02em',
              lineHeight: 1.1,
              margin: 0,
            }}
          >
            С чем приходят родители
          </h2>

          <p
            ref={subheadingRef}
            className="pain-subheading"
            style={{
              fontFamily: HELVETICA,
              fontSize: 'clamp(1rem, 1.4vw, 1.2rem)',
              color: 'rgba(245,240,232,0.85)',
              fontWeight: 300,
              letterSpacing: '0.01em',
              lineHeight: 1.5,
              marginTop: '0.8rem',
              marginBottom: 0,
            }}
          >
            Помогаю разобраться в том, что происходит и найти выход
          </p>
        </div>

        {/* ── 5vh spacer ── */}
        <div style={{ height: '5vh' }} />

        {/* ── Cards row ── */}
        <div
          className="pain-cards-row"
          style={{
            display: 'flex',
            flexDirection: 'row',
            gap: '16px',
            overflowX: 'auto',
            scrollBehavior: 'smooth',
            scrollSnapType: 'x mandatory',
            WebkitOverflowScrolling: 'touch',
            scrollbarWidth: 'none',
            /* Mobile default padding — desktop overridden by media query */
            padding: '0 24px',
          }}
        >
          {cards.map((card, i) => (
            <div
              key={card.id}
              ref={(el) => { cardRefs.current[i] = el; }}
              className="pain-card"
              style={{
                /* Mobile: one full card visible at a time */
                flexShrink: 0,
                width: 'calc(100vw - 48px)',
                height: '480px',
                borderRadius: '18px',
                overflow: 'hidden',
                position: 'relative',
                scrollSnapAlign: 'center',
                cursor: 'default',
                background: '#1a1612',
              }}
            >
              {/* Card image */}
              <img
                className="pain-card-img"
                src={card.image}
                alt={card.title}
                style={{
                  position: 'absolute',
                  inset: 0,
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  objectPosition: card.objectPosition,
                  display: 'block',
                  transition: 'transform 0.65s cubic-bezier(0.25,0.46,0.45,0.94)',
                }}
              />

              {/* White frosted text strip — ~35% height */}
              <div
                className="pain-card-strip"
                style={{
                  position: 'absolute',
                  bottom: 0,
                  left: 0,
                  right: 0,
                  height: '165px',
                  background: 'rgba(255,255,255,0.93)',
                  backdropFilter: 'blur(10px)',
                  WebkitBackdropFilter: 'blur(10px)',
                  padding: '20px 20px 22px 20px',
                  borderRadius: '0 0 18px 18px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'flex-start',
                  transition: 'background 0.4s ease',
                }}
              >
                {/* Title */}
                <p
                  style={{
                    fontFamily: HELVETICA,
                    fontSize: '1.1rem',
                    fontWeight: 600,
                    color: '#0D0A07',
                    lineHeight: 1.25,
                    margin: '0 0 10px 0',
                  }}
                >
                  {card.title}
                </p>

                {/* Description */}
                <p
                  style={{
                    fontFamily: HELVETICA,
                    fontSize: '0.95rem',
                    color: 'rgba(0,0,0,0.72)',
                    lineHeight: 1.6,
                    fontWeight: 400,
                    margin: 0,
                  }}
                >
                  {card.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* ── Pagination dots — mobile only ── */}
        <div
          className="pain-dots"
          style={{
            display: 'none', /* shown via media query on mobile */
            justifyContent: 'center',
            alignItems: 'center',
            gap: '8px',
            marginTop: '20px',
          }}
        >
          {cards.map((card, i) => (
            <span
              key={card.id}
              style={{
                display: 'block',
                height: '6px',
                width: activeDot === i ? '20px' : '6px',
                borderRadius: activeDot === i ? '3px' : '50%',
                background: activeDot === i ? '#F5F0E8' : 'rgba(245,240,232,0.3)',
                transition: 'width 0.3s ease, border-radius 0.3s ease, background 0.3s ease',
              }}
            />
          ))}
        </div>
      </section>
    </>
  );
}

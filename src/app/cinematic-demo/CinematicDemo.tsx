'use client';

import Image from 'next/image';
import { type CSSProperties, useLayoutEffect, useRef } from 'react';
import Navigation from '@/components/Navigation';
import styles from './cinematic-demo.module.css';

const fixtures = [
  { time: '03:00', home: '墨西哥', away: '南非', group: 'A', venue: 'Mexico City', call: '主胜' },
  { time: '10:00', home: '韩国', away: '捷克', group: 'A', venue: 'Guadalajara', call: '主胜' },
  { time: '22:00', home: '捷克', away: '南非', group: 'A', venue: 'Atlanta', call: '主胜' },
];

const contenders = [
  { rank: '01', team: '西班牙', code: 'ESP', odds: '5.50' },
  { rank: '02', team: '法国', code: 'FRA', odds: '6.00' },
  { rank: '03', team: '英格兰', code: 'ENG', odds: '7.50' },
];

export default function CinematicDemo() {
  const rootRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    let frame = 0;
    const updateScrollProgress = () => {
      frame = 0;
      const hero = root.querySelector<HTMLElement>('[data-demo-hero]');
      if (!hero) return;

      const progress = Math.min(1, Math.max(0, -hero.getBoundingClientRect().top / hero.offsetHeight));
      root.style.setProperty('--scroll-progress', progress.toFixed(3));
    };
    const onScroll = () => {
      if (!frame) frame = window.requestAnimationFrame(updateScrollProgress);
    };

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.setAttribute('data-visible', 'true');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.18 },
    );

    root.querySelectorAll<HTMLElement>('[data-reveal]').forEach((element) => observer.observe(element));
    updateScrollProgress();
    window.addEventListener('scroll', onScroll, { passive: true });

    return () => {
      if (frame) window.cancelAnimationFrame(frame);
      window.removeEventListener('scroll', onScroll);
      observer.disconnect();
    };
  }, []);

  return (
    <div ref={rootRef} className={styles.demo}>
      <Navigation currentPage="home" />

      <section className={styles.hero} data-demo-hero aria-label="七名球星电影海报动态演示">
        <div className={styles.poster}>
          <Image
            src="/ragnarok-hero.png"
            alt="七名世界级球星与北美地标组成的世界杯电影海报"
            fill
            priority
            sizes="100vw"
          />
        </div>
        <div className={styles.lightSweep} aria-hidden="true" />
        <div className={styles.embers} aria-hidden="true">
          {Array.from({ length: 10 }, (_, index) => <span key={index} />)}
        </div>
        <div className={styles.vignette} aria-hidden="true" />
        <div className={styles.scrollShade} aria-hidden="true" />
        <div className={styles.bottomFade} aria-hidden="true" />
      </section>

      <main className={styles.editorial}>
        <section className={styles.feature} data-reveal>
          <header className={styles.sectionHeader}>
            <div>
              <p>01 / MATCHDAY COVER</p>
              <h1>焦点比赛</h1>
            </div>
            <span>OPENING NIGHT · 2026.06.12</span>
          </header>

          <div className={styles.featureGrid}>
            <div className={styles.featureMeta}>
              <span>GROUP A</span>
              <strong>03:00</strong>
              <p>Mexico City Stadium</p>
            </div>
            <div className={styles.versus}>
              <div>
                <span className={styles.teamCode}>MEX</span>
                <strong>墨西哥</strong>
              </div>
              <span className={styles.score}>— : —</span>
              <div>
                <span className={styles.teamCode}>RSA</span>
                <strong>南非</strong>
              </div>
            </div>
            <div className={styles.editorialNote}>
              <span>EDITORIAL READ</span>
              <p>主场气势与阵容稳定性，将决定揭幕战最初的比赛节奏。</p>
            </div>
          </div>
        </section>

        <div className={styles.dataColumns}>
          <section data-reveal style={{ '--reveal-delay': '90ms' } as CSSProperties}>
            <header className={styles.columnHeader}>
              <span>02 / TODAY&apos;S FIXTURES</span>
              <small>ASIA / SHANGHAI</small>
            </header>
            <div className={styles.rows}>
              {fixtures.map((fixture, index) => (
                <article
                  key={`${fixture.time}-${fixture.home}`}
                  data-reveal
                  style={{ '--reveal-delay': `${150 + index * 80}ms` } as CSSProperties}
                >
                  <time>{fixture.time}</time>
                  <div>
                    <strong>{fixture.home} <i>vs</i> {fixture.away}</strong>
                    <span>GROUP {fixture.group} · {fixture.venue}</span>
                  </div>
                  <b>{fixture.call}</b>
                </article>
              ))}
            </div>
          </section>

          <section data-reveal style={{ '--reveal-delay': '180ms' } as CSSProperties}>
            <header className={styles.columnHeader}>
              <span>03 / POWER INDEX</span>
              <small>LOWER ODDS / HIGHER HEAT</small>
            </header>
            <div className={styles.rows}>
              {contenders.map((contender, index) => (
                <article
                  key={contender.code}
                  data-reveal
                  style={{ '--reveal-delay': `${230 + index * 80}ms` } as CSSProperties}
                >
                  <time>{contender.rank}</time>
                  <div>
                    <strong>{contender.team}</strong>
                    <span>{contender.code}</span>
                  </div>
                  <b>{contender.odds}</b>
                </article>
              ))}
            </div>
          </section>
        </div>
      </main>

      <div className={styles.grain} aria-hidden="true" />
    </div>
  );
}

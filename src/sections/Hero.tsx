import { useEffect, useRef, useState } from 'react';
import { ArrowRight, Play } from 'lucide-react';
import { heroConfig } from '../config';

function useCountUp(target: number, duration = 2000, start = false) {
  const [count, setCount] = useState(0);
  const hasRun = useRef(false);

  useEffect(() => {
    if (!start || hasRun.current) return;
    hasRun.current = true;

    const startTime = performance.now();
    const step = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(eased * target));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [start, target, duration]);

  return count;
}

export function Hero({ isReady }: { isReady: boolean }) {
  // Null check: if config is empty, render nothing
  if (!heroConfig.mainTitle) return null;

  const [phase, setPhase] = useState(0);
  // phase 0: hidden, 1: bg visible, 2: title, 3: cta, 4: stats counting

  // Build count-up hooks from stats config
  const stat0 = heroConfig.stats[0];
  const stat1 = heroConfig.stats[1];
  const stat2 = heroConfig.stats[2];
  const stat3 = heroConfig.stats[3];
  const count0 = useCountUp(stat0?.value ?? 0, 2000, phase >= 4);
  const count1 = useCountUp(stat1?.value ?? 0, 2200, phase >= 4);
  const count2 = useCountUp(stat2?.value ?? 0, 1800, phase >= 4);
  const count3 = useCountUp(stat3?.value ?? 0, 2400, phase >= 4);
  const counts = [count0, count1, count2, count3];

  useEffect(() => {
    if (!isReady) return;
    // Stagger: bg -> title -> cta -> stats
    const t1 = setTimeout(() => setPhase(1), 100);   // bg reveal
    const t2 = setTimeout(() => setPhase(2), 800);   // title
    const t3 = setTimeout(() => setPhase(3), 1400);  // cta
    const t4 = setTimeout(() => setPhase(4), 2000);  // stats
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); clearTimeout(t4); };
  }, [isReady]);

  const scrollToSection = (href: string) => {
    const element = document.querySelector(href);
    if (element) element.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section
      id="hero"
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
    >
      {/* Background with subtle Ken Burns */}
      <div className={`absolute inset-0 transition-opacity duration-[1.5s] ease-out ${phase >= 1 ? 'opacity-100' : 'opacity-0'}`}>
        <div className="absolute inset-0 hero-kenburns">
          <img
            src={heroConfig.backgroundImage}
            alt={heroConfig.mainTitle}
            className="w-full h-full object-cover scale-105"
          />
        </div>
        {/* Gradient overlay - darker for text readability */}
        <div className="absolute inset-0 bg-gradient-to-b from-emerald-900/60 via-emerald-800/40 to-emerald-900/80" />
      </div>

      {/* Content */}
      <div className="relative z-10 container-custom text-center py-32 lg:py-40">
        {/* Script accent */}
        <div className={`transition-all duration-1000 ease-out ${phase >= 2 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
          <span className="font-arabic text-4xl md:text-5xl lg:text-6xl text-amber-300">
            {heroConfig.scriptText}
          </span>
        </div>

        {/* Divider line */}
        <div className={`mx-auto my-6 h-0.5 bg-gradient-to-r from-transparent via-amber-400 to-transparent transition-all duration-1000 ease-out ${phase >= 2 ? 'w-32 opacity-100' : 'w-0 opacity-0'}`} style={{ transitionDelay: '0.2s' }} />

        {/* Main Title */}
        <h1 className={`font-serif text-4xl md:text-5xl lg:text-6xl xl:text-7xl text-white leading-tight tracking-wide transition-all duration-1000 ease-out whitespace-pre-line ${phase >= 2 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`} style={{ transitionDelay: '0.3s' }}>
          {heroConfig.mainTitle}
        </h1>

        {/* Subtitle */}
        {heroConfig.subtitle && (
          <p className={`mt-6 max-w-2xl mx-auto text-lg md:text-xl text-white/90 leading-relaxed transition-all duration-1000 ease-out ${phase >= 2 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`} style={{ transitionDelay: '0.4s' }}>
            {heroConfig.subtitle}
          </p>
        )}

        {/* CTA Buttons */}
        <div className={`mt-10 flex flex-col sm:flex-row items-center justify-center gap-4 transition-all duration-700 ease-out ${phase >= 3 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
          {heroConfig.ctaButtonText && (
            <button
              onClick={() => scrollToSection(heroConfig.ctaTarget || '#contact')}
              className="btn-gold rounded-lg inline-flex items-center gap-2 group text-base px-8 py-4"
              aria-label={heroConfig.ctaButtonText}
            >
              {heroConfig.ctaButtonText}
              <ArrowRight className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" />
            </button>
          )}
          {heroConfig.secondaryCtaText && (
            <button
              onClick={() => scrollToSection(heroConfig.secondaryCtaTarget || '#courses')}
              className="btn-white rounded-lg inline-flex items-center gap-2 group text-base px-8 py-4"
              aria-label={heroConfig.secondaryCtaText}
            >
              <Play className="w-5 h-5" />
              {heroConfig.secondaryCtaText}
            </button>
          )}
        </div>
      </div>

      {/* Stats with count-up */}
      {heroConfig.stats.length > 0 && (
        <div className={`absolute bottom-0 left-0 right-0 z-10 transition-all duration-1000 ease-out ${phase >= 4 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
          <div className="container-custom pb-8">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 md:p-8 border border-white/20">
              <div className="grid gap-4 md:gap-8" style={{ gridTemplateColumns: `repeat(${Math.min(heroConfig.stats.length, 4)}, minmax(0, 1fr))` }}>
                {heroConfig.stats.map((stat, index) => (
                  <div key={index} className={`text-center ${index > 0 ? 'md:border-l md:border-white/20' : ''}`}>
                    <div className="font-serif text-2xl md:text-4xl text-amber-400 mb-1 tabular-nums font-semibold">
                      {counts[index]}{stat.suffix}
                    </div>
                    <div className="text-xs md:text-sm text-white/80 uppercase tracking-wider">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Side decorative */}
      {heroConfig.decorativeText && (
        <div className={`absolute left-4 md:left-8 top-1/2 -translate-y-1/2 hidden lg:flex flex-col items-center gap-4 transition-opacity duration-1000 ${phase >= 3 ? 'opacity-100' : 'opacity-0'}`}>
          <div className="w-px h-16 bg-gradient-to-b from-transparent via-amber-400/50 to-transparent" />
          <span className="text-amber-300 text-xs tracking-[0.3em] uppercase" style={{ writingMode: 'vertical-lr' }}>{heroConfig.decorativeText}</span>
          <div className="w-px h-16 bg-gradient-to-b from-transparent via-amber-400/50 to-transparent" />
        </div>
      )}
    </section>
  );
}

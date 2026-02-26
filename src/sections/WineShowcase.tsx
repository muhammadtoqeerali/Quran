import { useState, useEffect, useRef } from 'react';
import { Sparkles, Clock, User, Gift, ArrowRight, ChevronLeft, ChevronRight, BookOpen } from 'lucide-react';
import { wineShowcaseConfig } from '../config';

// Icon lookup map for dynamic icon resolution from config strings
const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  BookOpen, Sparkles, Clock, User, Gift,
};

export function WineShowcase() {
  // Null check: if config is empty, render nothing
  if (!wineShowcaseConfig.mainTitle || wineShowcaseConfig.wines.length === 0) return null;

  const [activeWine, setActiveWine] = useState(0);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
          }
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -10% 0px' }
    );

    const elements = sectionRef.current?.querySelectorAll('.fade-up, .slide-in-left, .slide-in-right');
    elements?.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  const wines = wineShowcaseConfig.wines;
  const features = wineShowcaseConfig.features;
  const quote = wineShowcaseConfig.quote;
  const wine = wines[activeWine];

  const nextWine = () => setActiveWine((prev) => (prev + 1) % wines.length);
  const prevWine = () => setActiveWine((prev) => (prev - 1 + wines.length) % wines.length);

  const scrollToContact = () => {
    const element = document.querySelector('#contact');
    if (element) element.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section
      id="courses"
      ref={sectionRef}
      className="section-padding relative overflow-hidden bg-gradient-to-b from-emerald-50/30 to-white"
    >
      {/* Subtle Pattern */}
      <div className="absolute inset-0 opacity-[0.03]">
        <div className="absolute inset-0 islamic-pattern" />
      </div>

      <div className="container-custom relative">
        {/* Section Title */}
        <div className="fade-up text-center mb-16">
          <span className="font-script text-3xl text-amber-500 block mb-2">{wineShowcaseConfig.scriptText}</span>
          <span className="text-emerald-600 text-sm uppercase tracking-[0.2em] font-semibold mb-4 block">
            {wineShowcaseConfig.subtitle}
          </span>
          <h2 className="font-serif text-4xl md:text-5xl text-gray-800">{wineShowcaseConfig.mainTitle}</h2>
        </div>

        {/* Course Tabs */}
        <div className="fade-up flex flex-wrap justify-center gap-2 mb-12" style={{ transitionDelay: '0.1s' }}>
          {wines.map((w, i) => (
            <button
              key={w.id}
              onClick={() => setActiveWine(i)}
              className={`px-5 py-3 rounded-lg text-sm font-medium transition-all duration-300 ${
                i === activeWine
                  ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-200'
                  : 'bg-white text-gray-600 hover:bg-emerald-50 border border-gray-200'
              }`}
            >
              {w.name}
            </button>
          ))}
        </div>

        {/* Main Content */}
        <div className="grid lg:grid-cols-5 gap-8 lg:gap-12 items-center">
          {/* Left: Course Info */}
          <div className="slide-in-left lg:col-span-2 order-2 lg:order-1">
            {/* Age Group + Name */}
            <div className="mb-6">
              <span className="inline-block px-3 py-1 bg-amber-100 text-amber-700 text-xs font-semibold rounded-full mb-3">
                {wine.year}
              </span>
              <h2 className="font-serif text-3xl md:text-4xl text-gray-800 leading-tight mb-2">{wine.name}</h2>
              <span className="font-script text-xl text-emerald-500">{wine.subtitle}</span>
              <div className="w-16 h-1 bg-gradient-to-r from-emerald-500 to-amber-400 mt-4 rounded-full" />
            </div>

            {/* Description */}
            <p className="text-gray-600 leading-relaxed mb-4">{wine.description}</p>
            <p className="text-emerald-600 text-sm font-medium mb-6">{wine.tastingNotes}</p>

            {/* Course Details */}
            <div className="flex gap-6 mb-8 p-4 bg-gray-50 rounded-xl">
              <div className="text-center">
                <div className="font-serif text-xl text-emerald-600 font-semibold">{wine.alcohol}</div>
                <div className="text-[11px] text-gray-500 uppercase tracking-wider mt-1">Level</div>
              </div>
              <div className="w-px bg-gray-200" />
              <div className="text-center">
                <div className="font-serif text-xl text-emerald-600 font-semibold">{wine.temperature}</div>
                <div className="text-[11px] text-gray-500 uppercase tracking-wider mt-1">Duration</div>
              </div>
              <div className="w-px bg-gray-200" />
              <div className="text-center">
                <div className="font-serif text-xl text-emerald-600 font-semibold">{wine.aging}</div>
                <div className="text-[11px] text-gray-500 uppercase tracking-wider mt-1">Duration</div>
              </div>
            </div>

            {/* CTA */}
            <button
              onClick={scrollToContact}
              className="btn-primary rounded-lg flex items-center gap-2 group"
              aria-label={`Enroll in ${wine.name}`}
            >
              Enroll Now
              <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
            </button>
          </div>

          {/* Center: Course Image */}
          <div className="lg:col-span-1 order-1 lg:order-2 flex justify-center">
            <div className="relative" style={{ width: '280px', height: '380px' }}>
              {/* Glow */}
              <div className={`absolute inset-0 flex items-center justify-center pointer-events-none`}>
                <div className={`w-40 h-40 ${wine.glowColor} rounded-full blur-3xl transition-colors duration-700`} />
              </div>

              {/* Images */}
              {wines.map((w, i) => (
                <div
                  key={w.id}
                  className={`absolute inset-0 rounded-2xl overflow-hidden shadow-2xl transition-all duration-700 ${
                    i === activeWine
                      ? 'opacity-100 scale-100 translate-y-0'
                      : i < activeWine
                        ? 'opacity-0 scale-90 -translate-y-6 pointer-events-none'
                        : 'opacity-0 scale-90 translate-y-6 pointer-events-none'
                  }`}
                >
                  <img
                    src={w.image}
                    alt={`${w.name} - ${w.subtitle}`}
                    loading={i === 0 ? undefined : 'lazy'}
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}

              {/* Switcher Arrows */}
              <div className="absolute -bottom-12 left-1/2 -translate-x-1/2 flex items-center gap-4 z-20">
                <button
                  onClick={prevWine}
                  className="w-10 h-10 rounded-full bg-white border border-gray-200 flex items-center justify-center text-gray-600 hover:bg-emerald-600 hover:text-white hover:border-emerald-600 transition-all duration-300 shadow-lg"
                  aria-label="Previous course"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <span className="text-sm text-gray-500 font-serif tabular-nums whitespace-nowrap">
                  {activeWine + 1} / {wines.length}
                </span>
                <button
                  onClick={nextWine}
                  className="w-10 h-10 rounded-full bg-white border border-gray-200 flex items-center justify-center text-gray-600 hover:bg-emerald-600 hover:text-white hover:border-emerald-600 transition-all duration-300 shadow-lg"
                  aria-label="Next course"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>

          {/* Right: Features + Quote */}
          <div className="slide-in-right lg:col-span-2 order-3">
            <div className="space-y-5">
              {features.map((feature) => {
                const IconComponent = iconMap[feature.icon] || BookOpen;
                return (
                  <div
                    key={feature.title}
                    className="flex items-start gap-4 group p-4 rounded-xl hover:bg-gray-50 transition-colors"
                  >
                    <div className="w-12 h-12 rounded-xl bg-emerald-100 flex items-center justify-center flex-shrink-0 group-hover:bg-emerald-600 transition-colors">
                      <IconComponent className="w-5 h-5 text-emerald-600 group-hover:text-white transition-colors" />
                    </div>
                    <div>
                      <h3 className="font-serif text-lg text-gray-800 mb-1">{feature.title}</h3>
                      <p className="text-sm text-gray-600 leading-relaxed">{feature.description}</p>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Quote */}
            {quote.text && (
              <div className="mt-8 p-6 bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl border-l-4 border-amber-400">
                {quote.prefix && <p className="font-script text-2xl text-amber-500 mb-2">{quote.prefix}</p>}
                <p className="text-gray-700 text-sm italic leading-relaxed">
                  "{quote.text}"
                </p>
                {quote.attribution && <p className="text-emerald-600 text-xs mt-3 font-medium">— {quote.attribution}</p>}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

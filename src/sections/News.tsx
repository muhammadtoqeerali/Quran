import { useEffect, useRef } from 'react';
import { ArrowRight, Calendar, Star, Quote } from 'lucide-react';
import { newsConfig } from '../config';

export function News() {
  // Null check: if config is empty, render nothing
  if (!newsConfig.mainTitle) return null;

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

    const elements = sectionRef.current?.querySelectorAll('.fade-up, .slide-in-left, .slide-in-right, .scale-in');
    elements?.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  return (
    <section
      id="blog"
      ref={sectionRef}
      className="section-padding relative overflow-hidden bg-gradient-to-b from-emerald-50/30 to-white"
    >
      {/* Decorative Elements */}
      <div className="absolute left-0 top-1/4 w-64 h-64 bg-emerald-200/20 rounded-full blur-3xl" />
      <div className="absolute right-0 bottom-1/4 w-48 h-48 bg-amber-200/20 rounded-full blur-3xl" />

      <div className="container-custom relative">
        {/* Section Header */}
        <div className="fade-up flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-12">
          <div>
            <span className="font-script text-3xl text-amber-500 block mb-2">{newsConfig.scriptText}</span>
            <span className="text-emerald-600 text-sm uppercase tracking-[0.2em] font-semibold mb-4 block">
              {newsConfig.subtitle}
            </span>
            <h2 className="font-serif text-4xl md:text-5xl text-gray-800">
              {newsConfig.mainTitle}
            </h2>
          </div>
          {newsConfig.viewAllText && (
            <button className="btn-outline rounded-lg flex items-center gap-2 group w-fit" aria-label={newsConfig.viewAllText}>
              {newsConfig.viewAllText}
              <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
            </button>
          )}
        </div>

        {/* News Grid */}
        {newsConfig.articles.length > 0 && (
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
            {newsConfig.articles.map((item, index) => (
              <article
                key={item.id}
                className="fade-up group cursor-pointer"
                style={{ transitionDelay: `${0.1 + index * 0.1}s` }}
              >
                {/* Image */}
                <div className="relative aspect-[3/2] rounded-xl overflow-hidden mb-5 shadow-lg">
                  <img
                    src={item.image}
                    alt={`${item.title} - ${item.category}`}
                    loading="lazy"
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                  {/* Category Badge */}
                  <div className="absolute top-4 left-4">
                    <span className="px-3 py-1 bg-emerald-600 text-white text-xs font-medium rounded-full">
                      {item.category}
                    </span>
                  </div>

                  {/* Hover Overlay */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="w-12 h-12 rounded-full bg-white/90 flex items-center justify-center shadow-lg">
                      <ArrowRight className="w-5 h-5 text-emerald-600" />
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div>
                  {/* Date */}
                  <div className="flex items-center gap-2 text-gray-500 text-sm mb-3">
                    <Calendar className="w-4 h-4" />
                    <span>{item.date}</span>
                  </div>

                  {/* Title */}
                  <h3 className="font-serif text-lg text-gray-800 mb-3 group-hover:text-emerald-600 transition-colors">
                    {item.title}
                  </h3>

                  {/* Excerpt */}
                  <p className="text-gray-600 text-sm leading-relaxed mb-4 line-clamp-3">
                    {item.excerpt}
                  </p>

                  {/* Read More Link */}
                  {newsConfig.readMoreText && (
                    <span className="inline-flex items-center gap-2 text-emerald-600 text-sm font-medium group-hover:gap-3 transition-all duration-300">
                      {newsConfig.readMoreText}
                      <ArrowRight className="w-4 h-4" />
                    </span>
                  )}
                </div>
              </article>
            ))}
          </div>
        )}

        {/* Testimonials Section */}
        {newsConfig.testimonials.length > 0 && (
          <div className="mt-24">
            <div className="fade-up text-center mb-12">
              <span className="font-script text-3xl text-amber-500 block mb-2">{newsConfig.testimonialsScriptText}</span>
              <span className="text-emerald-600 text-sm uppercase tracking-[0.2em] font-semibold mb-4 block">
                {newsConfig.testimonialsSubtitle}
              </span>
              <h2 className="font-serif text-4xl md:text-5xl text-gray-800">
                {newsConfig.testimonialsMainTitle}
              </h2>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {newsConfig.testimonials.map((t, index) => (
                <div
                  key={t.name}
                  className="scale-in p-8 bg-white rounded-xl border border-gray-100 shadow-lg shadow-gray-100 relative"
                  style={{ transitionDelay: `${0.1 + index * 0.1}s` }}
                >
                  <Quote className="w-8 h-8 text-emerald-200 absolute top-6 right-6" />
                  {/* Stars */}
                  <div className="flex gap-1 mb-4">
                    {Array.from({ length: t.rating }).map((_, i) => (
                      <Star key={i} className="w-4 h-4 text-amber-400 fill-amber-400" />
                    ))}
                  </div>
                  <p className="text-gray-600 leading-relaxed mb-6 italic">
                    "{t.text}"
                  </p>
                  <div>
                    <p className="text-gray-800 font-medium text-sm">{t.name}</p>
                    <p className="text-gray-500 text-xs">{t.role}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Story Section */}
        {newsConfig.storyTitle && (
          <div id="story" className="fade-up mt-24 pt-20 border-t border-gray-100" style={{ transitionDelay: '0.1s' }}>
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              {/* Content */}
              <div className="slide-in-left">
                <span className="font-script text-3xl text-amber-500 block mb-2">{newsConfig.storyScriptText}</span>
                <span className="text-emerald-600 text-sm uppercase tracking-[0.2em] font-semibold mb-4 block">
                  {newsConfig.storySubtitle}
                </span>
                <h2 className="font-serif text-4xl md:text-5xl text-gray-800 mb-6">
                  {newsConfig.storyTitle}
                </h2>
                <div className="space-y-4 text-gray-600 leading-relaxed">
                  {newsConfig.storyParagraphs.map((paragraph, index) => (
                    <p key={index}>{paragraph}</p>
                  ))}
                </div>

                {/* Timeline Highlights */}
                {newsConfig.storyTimeline.length > 0 && (
                  <div className="mt-8 grid grid-cols-4 gap-4">
                    {newsConfig.storyTimeline.map((item, index) => (
                      <div key={index} className="text-center p-4 bg-emerald-50 rounded-xl">
                        <div className="font-serif text-2xl text-emerald-600 font-bold mb-1">{item.value}</div>
                        <div className="text-xs text-gray-500">{item.label}</div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Image */}
              <div className="slide-in-right relative">
                <div className="relative aspect-[4/5] rounded-xl overflow-hidden shadow-xl">
                  {newsConfig.storyImage && (
                    <>
                      <img
                        src={newsConfig.storyImage}
                        alt={newsConfig.storyImageCaption}
                        loading="lazy"
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                    </>
                  )}
                </div>

                {/* Quote Overlay */}
                {newsConfig.storyQuote.text && (
                  <div className="absolute bottom-6 left-6 right-6 p-6 bg-white/95 backdrop-blur-sm rounded-xl shadow-lg">
                    {newsConfig.storyQuote.prefix && (
                      <p className="font-script text-2xl text-amber-500 mb-1">{newsConfig.storyQuote.prefix}</p>
                    )}
                    <p className="text-gray-700 italic text-sm leading-relaxed mb-2">
                      "{newsConfig.storyQuote.text}"
                    </p>
                    {newsConfig.storyQuote.attribution && (
                      <p className="text-emerald-600 text-xs font-medium">— {newsConfig.storyQuote.attribution}</p>
                    )}
                  </div>
                )}

                {/* Decorative Frame */}
                <div className="absolute -top-4 -right-4 w-full h-full border-2 border-emerald-200 rounded-xl -z-10" />
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

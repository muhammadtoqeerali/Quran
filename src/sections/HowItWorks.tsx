import { useEffect, useRef } from 'react';
import { howItWorksConfig } from '../config';

export function HowItWorks() {
  if (!howItWorksConfig.mainTitle) return null;

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

    const elements = sectionRef.current?.querySelectorAll('.fade-up');
    elements?.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="section-padding bg-gradient-to-b from-emerald-50/30 to-white relative overflow-hidden"
    >
      {/* Decorative elements */}
      <div className="absolute top-1/2 left-0 w-px h-32 bg-gradient-to-b from-transparent via-emerald-200 to-transparent" />
      <div className="absolute top-1/2 right-0 w-px h-32 bg-gradient-to-b from-transparent via-emerald-200 to-transparent" />
      
      <div className="container-custom relative">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="font-script text-3xl text-amber-500 block mb-2 fade-up">
            {howItWorksConfig.scriptText}
          </span>
          <span className="text-emerald-600 text-sm uppercase tracking-[0.2em] font-semibold mb-4 block fade-up">
            {howItWorksConfig.subtitle}
          </span>
          <h2 className="font-serif text-4xl md:text-5xl text-gray-800 fade-up">
            {howItWorksConfig.mainTitle}
          </h2>
        </div>

        {/* Steps */}
        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {howItWorksConfig.steps.map((step, index) => (
            <div
              key={index}
              className="fade-up relative text-center"
              style={{ transitionDelay: `${index * 0.15}s` }}
            >
              {/* Connector line */}
              {index < howItWorksConfig.steps.length - 1 && (
                <div className="hidden md:block absolute top-12 left-[60%] w-[80%] h-0.5 bg-gradient-to-r from-emerald-200 to-emerald-100" />
              )}
              
              {/* Step Number */}
              <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center shadow-lg shadow-emerald-200">
                <span className="font-serif text-3xl text-white font-bold">{step.number}</span>
              </div>
              
              {/* Step Content */}
              <h3 className="font-serif text-xl text-gray-800 mb-3">
                {step.title}
              </h3>
              <p className="text-gray-600 leading-relaxed">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

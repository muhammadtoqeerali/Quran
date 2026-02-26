import { useEffect, useRef } from 'react';
import { Check, Star } from 'lucide-react';
import { pricingConfig } from '../config';

export function Pricing() {
  if (!pricingConfig.mainTitle) return null;

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

  const scrollToContact = () => {
    const element = document.querySelector('#contact');
    if (element) element.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section
      id="pricing"
      ref={sectionRef}
      className="section-padding bg-white relative overflow-hidden"
    >
      {/* Decorative elements */}
      <div className="absolute top-0 left-0 w-64 h-64 bg-emerald-100/50 rounded-full -translate-x-1/2 -translate-y-1/2" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-amber-100/30 rounded-full translate-x-1/3 translate-y-1/3" />
      
      <div className="container-custom relative">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="font-script text-3xl text-amber-500 block mb-2 fade-up">
            {pricingConfig.scriptText}
          </span>
          <span className="text-emerald-600 text-sm uppercase tracking-[0.2em] font-semibold mb-4 block fade-up">
            {pricingConfig.subtitle}
          </span>
          <h2 className="font-serif text-4xl md:text-5xl text-gray-800 mb-4 fade-up">
            {pricingConfig.mainTitle}
          </h2>
          <p className="text-gray-600 text-lg fade-up">
            {pricingConfig.description}
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {pricingConfig.plans.map((plan, index) => (
            <div
              key={plan.id}
              className={`fade-up relative rounded-2xl p-8 ${
                plan.popular
                  ? 'bg-gradient-to-br from-emerald-600 to-emerald-700 text-white shadow-xl shadow-emerald-200 scale-105 z-10'
                  : 'bg-white text-gray-800 border border-gray-200 shadow-lg shadow-gray-100'
              }`}
              style={{ transitionDelay: `${index * 0.1}s` }}
            >
              {/* Popular Badge */}
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                  <div className="bg-amber-500 text-white text-xs font-semibold px-4 py-1.5 rounded-full flex items-center gap-1">
                    <Star className="w-3 h-3 fill-current" />
                    Most Popular
                  </div>
                </div>
              )}

              {/* Plan Header */}
              <div className="text-center mb-8">
                <h3 className={`font-serif text-2xl mb-2 ${plan.popular ? 'text-white' : 'text-gray-800'}`}>
                  {plan.name}
                </h3>
                <p className={`text-sm mb-4 ${plan.popular ? 'text-emerald-100' : 'text-gray-500'}`}>
                  {plan.description}
                </p>
                <div className="flex items-baseline justify-center gap-1">
                  <span className={`font-serif text-5xl font-bold ${plan.popular ? 'text-white' : 'text-gray-800'}`}>
                    {plan.price}
                  </span>
                  <span className={plan.popular ? 'text-emerald-100' : 'text-gray-500'}>
                    {plan.period}
                  </span>
                </div>
              </div>

              {/* Features List */}
              <ul className="space-y-4 mb-8">
                {plan.features.map((feature, featureIndex) => (
                  <li key={featureIndex} className="flex items-start gap-3">
                    <div className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 ${
                      plan.popular ? 'bg-emerald-500' : 'bg-emerald-100'
                    }`}>
                      <Check className={`w-3 h-3 ${plan.popular ? 'text-white' : 'text-emerald-600'}`} />
                    </div>
                    <span className={plan.popular ? 'text-emerald-50' : 'text-gray-600'}>
                      {feature}
                    </span>
                  </li>
                ))}
              </ul>

              {/* CTA Button */}
              <button
                onClick={scrollToContact}
                className={`w-full py-3.5 rounded-lg font-semibold transition-all duration-300 ${
                  plan.popular
                    ? 'bg-white text-emerald-700 hover:bg-emerald-50'
                    : 'bg-emerald-600 text-white hover:bg-emerald-700'
                }`}
              >
                {plan.ctaText}
              </button>
            </div>
          ))}
        </div>

        {/* Note & Family Discount */}
        <div className="text-center mt-12 max-w-2xl mx-auto">
          <p className="text-gray-500 text-sm mb-3 fade-up">
            {pricingConfig.note}
          </p>
          <div className="inline-flex items-center gap-2 bg-amber-50 text-amber-700 px-4 py-2 rounded-full text-sm font-medium fade-up">
            <Star className="w-4 h-4 fill-amber-500" />
            {pricingConfig.familyDiscount}
          </div>
        </div>
      </div>
    </section>
  );
}

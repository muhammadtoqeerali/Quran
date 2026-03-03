import { useState, useEffect, useRef } from 'react';
import { Send, CheckCircle, AlertCircle, MapPin, Phone, Mail, Clock, MessageCircle } from 'lucide-react';
import { contactFormConfig } from '../config';

// Icon lookup map for dynamic icon resolution from config strings
const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  MapPin, Phone, Mail, Clock,
};

export function ContactForm() {
  // Null check: if config is empty, render nothing
  if (!contactFormConfig.mainTitle) return null;

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    course: '',
    ageGroup: '',
    message: ''
  });
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [isSubmitting, setIsSubmitting] = useState(false);
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setStatus('idle');

    try {
      // Direct background submission via Formspree
      const response = await fetch(contactFormConfig.formEndpoint, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          course: formData.course,
          ageGroup: formData.ageGroup,
          message: formData.message,
          _subject: `New Quran Academy Registration from ${formData.name}`,
          _replyto: formData.email,
        }),
      });

      const data = await response.json();

      if (response.ok && data.ok) {
        setStatus('success');
        setFormData({ name: '', email: '', phone: '', course: '', ageGroup: '', message: '' });
      } else {
        throw new Error('Submission failed');
      }
    } catch (err) {
      console.error('Form submission error:', err);
      setStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  // WhatsApp logic integrated from the new form version
  const sendViaWhatsApp = () => {
    const phoneNumber = contactFormConfig.contactInfo.find(info => info.icon === 'Phone')?.value.replace(/\+/g, '').replace(/\s/g, '') || '393756173106';
    
    const message = encodeURIComponent(
      `*New Quran Academy Registration*\n\n` +
      `*Name:* ${formData.name}\n` +
      `*Email:* ${formData.email}\n` +
      `*Phone:* ${formData.phone}\n` +
      `*Course:* ${formData.course}\n` +
      `*Age Group:* ${formData.ageGroup || 'Not specified'}\n` +
      `*Message:* ${formData.message || 'No additional message'}\n\n` +
      `_Submitted from Quran Academy Website_`
    );
    
    window.open(`https://wa.me/${phoneNumber}?text=${message}`, '_blank');
    setStatus('success');
    setFormData({ name: '', email: '', phone: '', course: '', ageGroup: '', message: '' });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const form = contactFormConfig.form;

  return (
    <section id="contact" ref={sectionRef} className="section-padding relative overflow-hidden bg-gradient-to-b from-white to-emerald-50/30">
      <div className="absolute inset-0 opacity-[0.03]">
        <div className="absolute inset-0 islamic-pattern" />
      </div>

      <div className="container-custom relative">
        <div className="fade-up text-center mb-16">
          <span className="font-script text-3xl text-amber-500 block mb-2">{contactFormConfig.scriptText}</span>
          <span className="text-emerald-600 text-sm uppercase tracking-[0.2em] font-semibold mb-4 block">
            {contactFormConfig.subtitle}
          </span>
          <h2 className="font-serif text-4xl md:text-5xl text-gray-800 mb-4">
            {contactFormConfig.mainTitle}
          </h2>
          {contactFormConfig.introText && (
            <p className="text-gray-600 max-w-2xl mx-auto">
              {contactFormConfig.introText}
            </p>
          )}
        </div>

        <div className="grid lg:grid-cols-5 gap-12 lg:gap-16">
          <div className="lg:col-span-2 space-y-6">
            <div className="slide-in-left">
              {contactFormConfig.contactInfoTitle && (
                <h3 className="font-serif text-2xl text-gray-800 mb-6">{contactFormConfig.contactInfoTitle}</h3>
              )}
              <div className="space-y-4">
                {contactFormConfig.contactInfo.map((item) => {
                  const IconComponent = iconMap[item.icon];
                  return (
                    <div key={item.label} className="flex items-start gap-4 p-4 bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md hover:border-emerald-200 transition-all">
                      <div className="w-12 h-12 rounded-xl bg-emerald-100 flex items-center justify-center flex-shrink-0">
                        {IconComponent && <IconComponent className="w-5 h-5 text-emerald-600" />}
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">{item.label}</p>
                        <p className="text-gray-800 font-medium">{item.value}</p>
                        <p className="text-sm text-gray-500">{item.subtext}</p>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* WhatsApp Quick Contact Card */}
              <div className="mt-8 p-6 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-2xl text-white">
                <div className="flex items-center gap-3 mb-3">
                  <MessageCircle className="w-6 h-6" />
                  <h4 className="font-semibold text-lg">Prefer WhatsApp?</h4>
                </div>
                <p className="text-emerald-100 text-sm mb-4">Message us directly for quick responses!</p>
                <a
                  href={`https://wa.me/${contactFormConfig.contactInfo.find(info => info.icon === 'Phone')?.value.replace(/\+/g, '').replace(/\s/g, '') || '393756173106'}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 bg-white text-emerald-600 rounded-lg font-medium hover:bg-emerald-50 transition-colors"
                >
                  <Phone className="w-4 h-4" />
                  Chat on WhatsApp
                </a>
              </div>
            </div>
          </div>

          <div className="lg:col-span-3">
            <div className="slide-in-right bg-white rounded-2xl border border-gray-100 shadow-lg shadow-gray-100 p-8">
              {status === 'success' ? (
                <div className="text-center py-12">
                  <CheckCircle className="w-16 h-16 text-emerald-500 mx-auto mb-4" />
                  <h3 className="font-serif text-2xl text-gray-800 mb-2">{form.successMessage}</h3>
                  <button onClick={() => setStatus('idle')} className="mt-6 btn-outline rounded-lg">Submit Another</button>
                </div>
              ) : status === 'error' ? (
                <div className="text-center py-12">
                  <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
                  <h3 className="font-serif text-2xl text-gray-800 mb-2">{form.errorMessage}</h3>
                  <button onClick={() => setStatus('idle')} className="mt-6 btn-outline rounded-lg">Try Again</button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="contact-name" className="block text-sm text-gray-700 font-medium mb-2">{form.nameLabel}</label>
                      <input id="contact-name" type="text" name="name" value={formData.name} onChange={handleChange} required placeholder={form.namePlaceholder} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-emerald-500" />
                    </div>
                    <div>
                      <label htmlFor="contact-phone" className="block text-sm text-gray-700 font-medium mb-2">{form.phoneLabel}</label>
                      <input id="contact-phone" type="tel" name="phone" value={formData.phone} onChange={handleChange} required placeholder={form.phonePlaceholder} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-emerald-500" />
                    </div>
                    <div>
                      <label htmlFor="contact-email" className="block text-sm text-gray-700 font-medium mb-2">{form.emailLabel}</label>
                      <input id="contact-email" type="email" name="email" value={formData.email} onChange={handleChange} required placeholder={form.emailPlaceholder} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-emerald-500" />
                    </div>
                    <div>
                      <label htmlFor="contact-course" className="block text-sm text-gray-700 font-medium mb-2">{form.courseLabel}</label>
                      <select id="contact-course" name="course" value={formData.course} onChange={handleChange} required className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-emerald-500">
                        <option value="">Select a course</option>
                        {form.courseOptions.map((opt) => (<option key={opt} value={opt}>{opt}</option>))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label htmlFor="contact-age" className="block text-sm text-gray-700 font-medium mb-2">{form.ageGroupLabel}</label>
                    <select id="contact-age" name="ageGroup" value={formData.ageGroup} onChange={handleChange} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-emerald-500">
                      <option value="">Select age group</option>
                      {form.ageGroupOptions.map((opt) => (<option key={opt} value={opt}>{opt}</option>))}
                    </select>
                  </div>

                  <div>
                    <label htmlFor="contact-message" className="block text-sm text-gray-700 font-medium mb-2">{form.messageLabel}</label>
                    <textarea id="contact-message" name="message" value={formData.message} onChange={handleChange} rows={4} placeholder={form.messagePlaceholder} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg resize-none focus:outline-none focus:border-emerald-500" />
                  </div>

                  <div className="space-y-3">
                    <button type="submit" disabled={isSubmitting} className="w-full btn-primary rounded-lg flex items-center justify-center gap-2 disabled:opacity-50">
                      {isSubmitting ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <><Send className="w-4 h-4" /> {form.submitText}</>}
                    </button>

                    <button
                      type="button"
                      onClick={sendViaWhatsApp}
                      disabled={!formData.name || !formData.phone || !formData.course}
                      className="w-full py-3 px-6 rounded-lg border-2 border-emerald-500 text-emerald-600 font-medium hover:bg-emerald-50 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                      <MessageCircle className="w-4 h-4" />
                      Or Send via WhatsApp
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
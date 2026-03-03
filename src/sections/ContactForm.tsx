import { useState, useEffect, useRef } from 'react';
/* Added MessageCircle to imports */
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

      if (response.ok) {
        const data = await response.json();
        if (data.ok) {
          setStatus('success');
          setFormData({ name: '', email: '', phone: '', course: '', ageGroup: '', message: '' });
          setIsSubmitting(false);
          return;
        }
      }
      
      fallbackToMailto();
    } catch (err) {
      console.error('Form submission error:', err);
      fallbackToMailto();
    }
  };

  const fallbackToMailto = () => {
    const subject = encodeURIComponent(`New Quran Academy Registration from ${formData.name}`);
    const body = encodeURIComponent(
      `Assalamu Alaikum,\n\n` +
      `A new registration has been submitted:\n\n` +
      `Name: ${formData.name}\n` +
      `Email: ${formData.email}\n` +
      `Phone/WhatsApp: ${formData.phone}\n` +
      `Course: ${formData.course}\n` +
      `Age Group: ${formData.ageGroup || 'Not specified'}\n` +
      `Message: ${formData.message || 'No additional message'}\n\n` +
      `---\nSubmitted from Quran Academy Website\nDate: ${new Date().toLocaleString()}`
    );
    window.open(`mailto:${contactFormConfig.emailTo}?subject=${subject}&body=${body}`, '_blank');
    setStatus('success');
    setFormData({ name: '', email: '', phone: '', course: '', ageGroup: '', message: '' });
    setIsSubmitting(false);
  };

  /* NEW: WhatsApp redirect logic */
  const sendViaWhatsApp = () => {
    const phoneNumber = contactFormConfig.contactInfo.find(info => info.icon === 'Phone')?.value.replace(/\+/g, '').replace(/\s/g, '') || '';
    
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
          <span className="text-emerald-600 text-sm uppercase tracking-[0.2em] font-semibold mb-4 block">{contactFormConfig.subtitle}</span>
          <h2 className="font-serif text-4xl md:text-5xl text-gray-800 mb-4">{contactFormConfig.mainTitle}</h2>
          {contactFormConfig.introText && <p className="text-gray-600 max-w-2xl mx-auto">{contactFormConfig.introText}</p>}
        </div>

        <div className="grid lg:grid-cols-5 gap-12 lg:gap-16">
          <div className="lg:col-span-2 space-y-6">
            <div className="slide-in-left" style={{ transitionDelay: '0.1s' }}>
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

              {/* NEW: WhatsApp Quick Contact Card */}
              <div className="mt-8 p-6 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-2xl text-white shadow-lg shadow-emerald-200">
                <div className="flex items-center gap-3 mb-3">
                  <MessageCircle className="w-6 h-6" />
                  <h4 className="font-semibold text-lg">Prefer WhatsApp?</h4>
                </div>
                <p className="text-emerald-100 text-sm mb-4">Message us directly on WhatsApp for quick responses!</p>
                <a
                  href={`https://wa.me/${contactFormConfig.contactInfo.find(info => info.icon === 'Phone')?.value.replace(/\+/g, '').replace(/\s/g, '')}`}
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
                  <p className="text-gray-500 text-sm mt-2">Registration details have been sent successfully.</p>
                  <button onClick={() => setStatus('idle')} className="mt-6 btn-outline rounded-lg">Submit Another</button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6" noValidate>
                  <div className="grid md:grid-cols-2 gap-6">
                    {/* Form Fields (Name, Phone, Email, Course) */}
                    <div>
                      <label className="block text-sm text-gray-700 font-medium mb-2">{form.nameLabel} <span className="text-emerald-600">*</span></label>
                      <input type="text" name="name" value={formData.name} onChange={handleChange} required placeholder={form.namePlaceholder} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 transition-all" />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-700 font-medium mb-2">{form.phoneLabel} <span className="text-emerald-600">*</span></label>
                      <input type="tel" name="phone" value={formData.phone} onChange={handleChange} required placeholder={form.phonePlaceholder} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 transition-all" />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-700 font-medium mb-2">{form.emailLabel} <span className="text-emerald-600">*</span></label>
                      <input type="email" name="email" value={formData.email} onChange={handleChange} required placeholder={form.emailPlaceholder} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 transition-all" />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-700 font-medium mb-2">{form.courseLabel} <span className="text-emerald-600">*</span></label>
                      <select name="course" value={formData.course} onChange={handleChange} required className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 transition-all">
                        <option value="">Select a course</option>
                        {form.courseOptions.map((option) => (<option key={option} value={option}>{option}</option>))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm text-gray-700 font-medium mb-2">{form.ageGroupLabel}</label>
                    <select name="ageGroup" value={formData.ageGroup} onChange={handleChange} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 transition-all">
                      <option value="">Select age group</option>
                      {form.ageGroupOptions.map((option) => (<option key={option} value={option}>{option}</option>))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm text-gray-700 font-medium mb-2">{form.messageLabel}</label>
                    <textarea name="message" value={formData.message} onChange={handleChange} rows={4} placeholder={form.messagePlaceholder} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg resize-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 transition-all" />
                  </div>

                  {/* Buttons Section */}
                  <div className="space-y-3">
                    <button type="submit" disabled={isSubmitting} className="w-full btn-primary rounded-lg flex items-center justify-center gap-2">
                      {isSubmitting ? (
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      ) : (
                        <><Send className="w-4 h-4" /> {form.submitText}</>
                      )}
                    </button>

                    {/* NEW: Secondary WhatsApp Submit Button */}
                    <button
                      type="button"
                      onClick={sendViaWhatsApp}
                      disabled={!formData.name || !formData.phone || !formData.course}
                      className="w-full py-3 px-6 rounded-lg border-2 border-emerald-500 text-emerald-600 font-medium hover:bg-emerald-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                      <MessageCircle className="w-4 h-4" />
                      Or Send via WhatsApp
                    </button>
                  </div>

                  <p className="text-xs text-gray-400 text-center">Your privacy is important to us. Information is only used for enrollment.</p>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
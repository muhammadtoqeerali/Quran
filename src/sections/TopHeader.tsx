import { Instagram, Youtube, Facebook } from 'lucide-react';
import { topHeaderConfig } from '../config';

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Instagram, Youtube, Facebook,
};

export function TopHeader() {
  if (!topHeaderConfig.countries.length) return null;

  return (
    <div className="bg-emerald-900 text-white py-2.5 px-4 hidden md:block border-b border-emerald-800">
      <div className="container-custom flex items-center justify-between">
        {/* Country Contacts with Flag Images */}
        <div className="flex items-center gap-6">
          <span className="text-xs text-emerald-300 uppercase tracking-wider font-semibold">
            Contact Us:
          </span>
          <div className="flex items-center gap-5">
            {topHeaderConfig.countries.map((country) => (
              <a
                key={country.country}
                href={`https://wa.me/${country.whatsapp.replace(/\+/g, '')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2.5 text-sm hover:text-amber-400 transition-all duration-300 group"
                title={`WhatsApp ${country.country}`}
              >
                <div className="w-7 h-5 rounded overflow-hidden shadow-sm border border-white/20 group-hover:border-amber-400/50 transition-colors">
                  <img 
                    src={country.flagImage} 
                    alt={`${country.country} flag`}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                </div>
                <span className="font-medium tracking-wide">{country.whatsapp}</span>
              </a>
            ))}
          </div>
        </div>

        {/* Social Links */}
        <div className="flex items-center gap-4">
          <span className="text-xs text-emerald-300 uppercase tracking-wider font-semibold">
            Follow Us:
          </span>
          <div className="flex items-center gap-2">
            {topHeaderConfig.socialLinks.map((social) => {
              const IconComponent = iconMap[social.icon];
              return (
                <a
                  key={social.name}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-8 h-8 rounded-full bg-emerald-800 flex items-center justify-center hover:bg-amber-500 transition-all duration-300 hover:scale-110"
                  title={social.name}
                  aria-label={social.name}
                >
                  {IconComponent && <IconComponent className="w-4 h-4" />}
                </a>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

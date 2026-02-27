import { Instagram, Youtube, Facebook } from 'lucide-react';
import { topHeaderConfig } from '../config';

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Instagram, Youtube, Facebook,
};

export function TopHeader() {
  if (!topHeaderConfig.countries.length) return null;

  return (
    <div className="bg-emerald-900 text-white py-2 px-4">
      <div className="container-custom flex items-center justify-between">
        {/* Country Contacts */}
        <div className="flex flex-wrap items-center gap-2 md:gap-3">
          <span className="text-xs text-emerald-300 uppercase tracking-wider font-medium">
            Contact Us:
          </span>
          {topHeaderConfig.countries.map((country) => (
            <a
              key={country.country}
              href={`https://wa.me/${country.whatsapp.replace(/\+/g, '')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 rounded-full border border-emerald-700 bg-emerald-800/80 px-3 py-1 text-sm hover:border-amber-400 hover:text-amber-300 transition-colors"
              title={`WhatsApp ${country.country}`}
            >
              <span className="text-base" aria-hidden="true">{country.flag}</span>
              <span className="text-xs text-emerald-200 hidden lg:inline">{country.country}</span>
              <span className="font-medium whitespace-nowrap">{country.whatsapp}</span>
            </a>
          ))}
        </div>

        {/* Social Links */}
        <div className="flex items-center gap-4">
          <span className="text-xs text-emerald-300 uppercase tracking-wider font-medium">
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
                  className="w-8 h-8 rounded-full bg-emerald-800 flex items-center justify-center hover:bg-amber-500 transition-colors"
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

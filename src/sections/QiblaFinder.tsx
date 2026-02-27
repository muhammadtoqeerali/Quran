import { useState, useEffect, useRef } from 'react';
import { Compass, MapPin, Navigation, RotateCw, Check } from 'lucide-react';
import { qiblaFinderConfig } from '../config';

// Calculate Qibla direction using the spherical law of cosines
function calculateQiblaDirection(lat: number, lng: number): number {
  const kaabaLat = qiblaFinderConfig.kaabaCoords.lat;
  const kaabaLng = qiblaFinderConfig.kaabaCoords.lng;
  
  const latRad = (lat * Math.PI) / 180;
  const lngRad = (lng * Math.PI) / 180;
  const kaabaLatRad = (kaabaLat * Math.PI) / 180;
  const kaabaLngRad = (kaabaLng * Math.PI) / 180;
  
  const y = Math.sin(kaabaLngRad - lngRad);
  const x = Math.cos(latRad) * Math.tan(kaabaLatRad) - Math.sin(latRad) * Math.cos(kaabaLngRad - lngRad);
  
  let qiblaAngle = Math.atan2(y, x) * (180 / Math.PI);
  qiblaAngle = (qiblaAngle + 360) % 360;
  
  return Math.round(qiblaAngle);
}

// Calculate distance to Kaaba in km
function calculateDistance(lat: number, lng: number): number {
  const kaabaLat = qiblaFinderConfig.kaabaCoords.lat;
  const kaabaLng = qiblaFinderConfig.kaabaCoords.lng;
  const R = 6371; // Earth's radius in km
  
  const latRad = (lat * Math.PI) / 180;
  const kaabaLatRad = (kaabaLat * Math.PI) / 180;
  const deltaLat = ((kaabaLat - lat) * Math.PI) / 180;
  const deltaLng = ((kaabaLng - lng) * Math.PI) / 180;
  
  const a = Math.sin(deltaLat / 2) * Math.sin(deltaLat / 2) +
            Math.cos(latRad) * Math.cos(kaabaLatRad) *
            Math.sin(deltaLng / 2) * Math.sin(deltaLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  
  return Math.round(R * c);
}

export function QiblaFinder() {
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [qiblaAngle, setQiblaAngle] = useState<number | null>(null);
  const [distance, setDistance] = useState<number | null>(null);
  const [locationName, setLocationName] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');
  const [manualCity, setManualCity] = useState('');
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

  const getLocation = () => {
    setLoading(true);
    setError('');
    
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser');
      setLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setLocation({ lat: latitude, lng: longitude });
        setQiblaAngle(calculateQiblaDirection(latitude, longitude));
        setDistance(calculateDistance(latitude, longitude));
        setLocationName('Your Location');
        setLoading(false);
      },
      () => {
        setError('Unable to retrieve your location. Please enter your city manually.');
        setLoading(false);
      }
    );
  };

  const searchCity = async () => {
    if (!manualCity.trim()) return;
    
    setLoading(true);
    setError('');
    
    try {
      const response = await fetch(`https://api.opencagedata.com/geocode/v1/json?q=${encodeURIComponent(manualCity)}&key=YOUR_API_KEY`);
      const data = await response.json();
      
      if (data.results && data.results.length > 0) {
        const result = data.results[0];
        const { lat, lng } = result.geometry;
        setLocation({ lat, lng });
        setQiblaAngle(calculateQiblaDirection(lat, lng));
        setDistance(calculateDistance(lat, lng));
        setLocationName(result.formatted);
      } else {
        setError('City not found. Please try again.');
      }
    } catch {
      // Fallback to demo mode if API fails
      const demoLocations: Record<string, { lat: number; lng: number }> = {
        'london': { lat: 51.5074, lng: -0.1278 },
        'new york': { lat: 40.7128, lng: -74.0060 },
        'dubai': { lat: 25.2048, lng: 55.2708 },
        'karachi': { lat: 24.8607, lng: 67.0011 },
        'rome': { lat: 41.9028, lng: 12.4964 },
        'paris': { lat: 48.8566, lng: 2.3522 },
        'istanbul': { lat: 41.0082, lng: 28.9784 },
        'cairo': { lat: 30.0444, lng: 31.2357 },
        'makkah': { lat: 21.3891, lng: 39.8579 },
        'madinah': { lat: 24.5247, lng: 39.5692 },
      };
      
      const cityLower = manualCity.toLowerCase();
      if (demoLocations[cityLower]) {
        const { lat, lng } = demoLocations[cityLower];
        setLocation({ lat, lng });
        setQiblaAngle(calculateQiblaDirection(lat, lng));
        setDistance(calculateDistance(lat, lng));
        setLocationName(manualCity);
      } else {
        setError('City not found. Try: London, New York, Dubai, Karachi, Rome, Paris, Istanbul, Cairo, Makkah, Madinah');
      }
    }
    
    setLoading(false);
  };

  return (
    <section
      id="tools"
      ref={sectionRef}
      className="section-padding bg-gradient-to-b from-emerald-50/30 to-white relative overflow-hidden"
    >
      {/* Decorative elements */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-100/30 rounded-full -translate-x-1/2 -translate-y-1/2" />
      <div className="absolute bottom-0 left-0 w-48 h-48 bg-amber-100/20 rounded-full translate-x-1/3 translate-y-1/3" />
      
      <div className="container-custom relative">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <span className="font-script text-3xl text-amber-500 block mb-2 fade-up">
            {qiblaFinderConfig.scriptText}
          </span>
          <span className="text-emerald-600 text-sm uppercase tracking-[0.2em] font-semibold mb-4 block fade-up">
            {qiblaFinderConfig.subtitle}
          </span>
          <h2 className="font-serif text-4xl md:text-5xl text-gray-800 mb-4 fade-up">
            {qiblaFinderConfig.mainTitle}
          </h2>
          <p className="text-gray-600 text-lg fade-up">
            {qiblaFinderConfig.description}
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 items-center max-w-5xl mx-auto">
          {/* Compass Display */}
          <div className="fade-up flex justify-center" style={{ transitionDelay: '0.1s' }}>
            <div className="relative w-72 h-72 md:w-80 md:h-80">
              {/* Outer ring */}
              <div className="absolute inset-0 rounded-full border-8 border-emerald-100 bg-white shadow-xl" />
              
              {/* Degree markings */}
              {[0, 45, 90, 135, 180, 225, 270, 315].map((deg) => (
                <div
                  key={deg}
                  className="absolute w-full h-full"
                  style={{ transform: `rotate(${deg}deg)` }}
                >
                  <div className="absolute top-2 left-1/2 -translate-x-1/2 text-xs font-bold text-gray-400">
                    {deg === 0 ? 'N' : deg === 90 ? 'E' : deg === 180 ? 'S' : deg === 270 ? 'W' : deg}
                  </div>
                </div>
              ))}
              
              {/* Inner circle */}
              <div className="absolute inset-8 rounded-full border-2 border-emerald-50" />
              
              {/* Qibla Arrow */}
              {qiblaAngle !== null && (
                <div
                  className="absolute inset-0 flex items-center justify-center transition-transform duration-1000"
                  style={{ transform: `rotate(${qiblaAngle}deg)` }}
                >
                  <div className="relative w-full h-full">
                    <div className="absolute top-4 left-1/2 -translate-x-1/2">
                      <Navigation className="w-12 h-12 text-amber-500 fill-amber-500" />
                    </div>
                  </div>
                </div>
              )}
              
              {/* Center point */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-4 h-4 rounded-full bg-emerald-600" />
              </div>
              
              {/* Kaaba icon at center */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center">
                  <MapPin className="w-5 h-5 text-emerald-600" />
                </div>
              </div>
              
              {/* Angle display */}
              {qiblaAngle !== null && (
                <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 bg-emerald-600 text-white px-4 py-2 rounded-full text-sm font-semibold">
                  {qiblaAngle}° from North
                </div>
              )}
            </div>
          </div>

          {/* Controls and Info */}
          <div className="fade-up space-y-6" style={{ transitionDelay: '0.2s' }}>
            {/* Location Input */}
            <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
              <h3 className="font-serif text-xl text-gray-800 mb-4 flex items-center gap-2">
                <Compass className="w-5 h-5 text-emerald-600" />
                Find Your Location
              </h3>
              
              <div className="space-y-4">
                <button
                  onClick={getLocation}
                  disabled={loading}
                  className="w-full btn-primary rounded-lg flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <RotateCw className="w-5 h-5 animate-spin" />
                  ) : (
                    <MapPin className="w-5 h-5" />
                  )}
                  {loading ? 'Detecting...' : 'Use My Location'}
                </button>
                
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-200" />
                  </div>
                  <div className="relative flex justify-center">
                    <span className="bg-white px-2 text-sm text-gray-500">or</span>
                  </div>
                </div>
                
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={manualCity}
                    onChange={(e) => setManualCity(e.target.value)}
                    placeholder="Enter city name (e.g., London, Dubai)"
                    className="flex-1 px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-gray-800 placeholder-gray-400 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                    onKeyPress={(e) => e.key === 'Enter' && searchCity()}
                  />
                  <button
                    onClick={searchCity}
                    disabled={loading || !manualCity.trim()}
                    className="px-4 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors disabled:opacity-50"
                  >
                    Search
                  </button>
                </div>
              </div>
              
              {error && (
                <p className="mt-4 text-red-500 text-sm">{error}</p>
              )}
            </div>

            {/* Results */}
            {location && qiblaAngle !== null && (
              <div className="bg-emerald-50 rounded-xl p-6 border border-emerald-100">
                <div className="flex items-center gap-2 mb-4">
                  <Check className="w-5 h-5 text-emerald-600" />
                  <span className="font-medium text-emerald-800">Location Found</span>
                </div>
                
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Location:</span>
                    <span className="font-medium text-gray-800">{locationName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Coordinates:</span>
                    <span className="font-medium text-gray-800">
                      {location.lat.toFixed(4)}, {location.lng.toFixed(4)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Qibla Direction:</span>
                    <span className="font-medium text-emerald-600">{qiblaAngle}°</span>
                  </div>
                  {distance !== null && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Distance to Kaaba:</span>
                      <span className="font-medium text-gray-800">{distance.toLocaleString()} km</span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Instructions */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <h4 className="font-medium text-gray-800 mb-3">How to use:</h4>
              <ol className="space-y-2">
                {qiblaFinderConfig.instructions.map((instruction, index) => (
                  <li key={index} className="flex items-start gap-3 text-sm text-gray-600">
                    <span className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center text-xs font-semibold flex-shrink-0">
                      {index + 1}
                    </span>
                    {instruction}
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

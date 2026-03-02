import { useState, useEffect, useRef } from 'react';
import { Compass, Navigation, MapPin, RotateCw, Info } from 'lucide-react';
import { qiblaFinderConfig } from '../config';

// Calculate Qibla direction
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

// Calculate distance to Kaaba
function calculateDistance(lat: number, lng: number): number {
  const kaabaLat = qiblaFinderConfig.kaabaCoords.lat;
  const kaabaLng = qiblaFinderConfig.kaabaCoords.lng;
  const R = 6371;
  
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
  const [qiblaAngle, setQiblaAngle] = useState<number | null>(null);
  const [distance, setDistance] = useState<number | null>(null);
  const [deviceHeading, setDeviceHeading] = useState<number>(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');
  const [hasLocation, setHasLocation] = useState(false);
  
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

  // Get device orientation for compass
  useEffect(() => {
    const handleOrientation = (event: DeviceOrientationEvent) => {
      let heading = event.alpha || 0;
      
      // iOS webkitCompassHeading
      if ((event as any).webkitCompassHeading) {
        heading = (event as any).webkitCompassHeading;
      } else if (event.alpha !== null) {
        // Android: convert alpha to compass heading
        heading = 360 - event.alpha;
      }
      
      setDeviceHeading(Math.round(heading));
    };

    // Request permission for iOS 13+
    const requestPermission = async () => {
      if (typeof (DeviceOrientationEvent as any).requestPermission === 'function') {
        try {
          const permission = await (DeviceOrientationEvent as any).requestPermission();
          if (permission === 'granted') {
            window.addEventListener('deviceorientation', handleOrientation, true);
          }
        } catch (err) {
          console.error('Device orientation permission denied:', err);
        }
      } else {
        window.addEventListener('deviceorientation', handleOrientation, true);
      }
    };

    requestPermission();

    return () => {
      window.removeEventListener('deviceorientation', handleOrientation, true);
    };
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
        const calculatedAngle = calculateQiblaDirection(latitude, longitude);
        const calculatedDistance = calculateDistance(latitude, longitude);
        
        setQiblaAngle(calculatedAngle);
        setDistance(calculatedDistance);
        setHasLocation(true);
        setLoading(false);
      },
      (err) => {
        console.error('Geolocation error:', err);
        setError('Unable to get location. Please enable location services.');
        setLoading(false);
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 0 }
    );
  };

  // Calculate compass rotation (counter-rotate so North stays at top)
  const compassRotation = -deviceHeading;
  
  // Calculate Qibla arrow rotation relative to compass
  const qiblaArrowRotation = qiblaAngle !== null ? qiblaAngle : 0;
  
  // Check if facing Qibla (within 15 degrees)
  const isFacingQibla = () => {
    if (qiblaAngle === null) return false;
    const diff = Math.abs(deviceHeading - qiblaAngle);
    const normalizedDiff = diff > 180 ? 360 - diff : diff;
    return normalizedDiff <= 15;
  };

  // Get direction name
  const getDirectionName = (angle: number) => {
    const directions = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
    const index = Math.round(angle / 45) % 8;
    return directions[index];
  };

  return (
    <section
      id="tools"
      ref={sectionRef}
      className="section-padding bg-gradient-to-b from-emerald-50/30 to-white relative overflow-hidden"
    >
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

        {/* Main Qibla Finder */}
        <div className="fade-up max-w-md mx-auto" style={{ transitionDelay: '0.1s' }}>
          {!hasLocation ? (
            // Get Location Button
            <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8 text-center">
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center mx-auto mb-6">
                <Compass className="w-10 h-10 text-white" />
              </div>
              <h3 className="font-serif text-2xl text-gray-800 mb-3">Find Your Qibla</h3>
              <p className="text-gray-600 mb-6">
                Allow location access to calculate the exact Qibla direction from where you are.
              </p>
              <button
                onClick={getLocation}
                disabled={loading}
                className="btn-primary rounded-lg flex items-center justify-center gap-2 mx-auto"
              >
                {loading ? (
                  <>
                    <RotateCw className="w-5 h-5 animate-spin" />
                    Getting Location...
                  </>
                ) : (
                  <>
                    <MapPin className="w-5 h-5" />
                    Find Qibla Direction
                  </>
                )}
              </button>
              {error && (
                <p className="mt-4 text-red-500 text-sm">{error}</p>
              )}
            </div>
          ) : (
            // Compass Display
            <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6">
              {/* Info Bar */}
              <div className="flex justify-between items-center mb-6">
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wider">Qibla Direction</p>
                  <p className="text-2xl font-bold text-emerald-600">{qiblaAngle}° {getDirectionName(qiblaAngle || 0)}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-gray-500 uppercase tracking-wider">Distance</p>
                  <p className="text-lg font-semibold text-gray-800">{distance?.toLocaleString()} km</p>
                </div>
              </div>

              {/* Compass */}
              <div className="relative w-72 h-72 mx-auto mb-6">
                {/* Outer Ring */}
                <div className="absolute inset-0 rounded-full border-4 border-gray-200 bg-gradient-to-b from-gray-50 to-white shadow-inner" />
                
                {/* Degree Markings - Rotating with device */}
                <div 
                  className="absolute inset-0"
                  style={{ transform: `rotate(${compassRotation}deg)` }}
                >
                  {/* Cardinal Directions */}
                  <div className="absolute top-2 left-1/2 -translate-x-1/2 text-red-500 font-bold text-lg">N</div>
                  <div className="absolute bottom-2 left-1/2 -translate-x-1/2 text-gray-400 font-bold text-lg">S</div>
                  <div className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-400 font-bold text-lg">W</div>
                  <div className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 font-bold text-lg">E</div>
                  
                  {/* Degree Ticks */}
                  {[...Array(36)].map((_, i) => (
                    <div
                      key={i}
                      className="absolute left-1/2 top-0 origin-bottom"
                      style={{ 
                        transform: `rotate(${i * 10}deg)`,
                        height: '50%',
                        transformOrigin: '50% 100%'
                      }}
                    >
                      <div 
                        className={`w-0.5 ${i % 9 === 0 ? 'h-4 bg-gray-400' : i % 3 === 0 ? 'h-3 bg-gray-300' : 'h-2 bg-gray-200'}`}
                        style={{ marginLeft: '-1px' }}
                      />
                    </div>
                  ))}
                </div>

                {/* Center Point */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-4 h-4 rounded-full bg-gray-800 z-10" />
                </div>

                {/* Qibla Arrow - Points to Qibla direction (fixed, doesn't rotate with compass) */}
                <div 
                  className="absolute inset-0 flex items-center justify-center pointer-events-none"
                  style={{ 
                    transform: `rotate(${qiblaArrowRotation}deg)`,
                    transition: 'transform 0.1s ease-out'
                  }}
                >
                  <div className="relative w-full h-full">
                    {/* Arrow pointing UP (toward Qibla) */}
                    <div className="absolute top-4 left-1/2 -translate-x-1/2">
                      <Navigation 
                        className={`w-16 h-16 transition-all duration-300 ${
                          isFacingQibla() 
                            ? 'text-emerald-500 fill-emerald-500' 
                            : 'text-amber-500 fill-amber-500'
                        }`}
                        style={{
                          filter: isFacingQibla() 
                            ? 'drop-shadow(0 0 15px rgba(16, 185, 129, 0.8))' 
                            : 'drop-shadow(0 0 10px rgba(245, 158, 11, 0.6))'
                        }}
                      />
                    </div>
                    
                    {/* Qibla Label */}
                    <div 
                      className="absolute top-20 left-1/2 -translate-x-1/2 whitespace-nowrap"
                      style={{ transform: `rotate(${-qiblaArrowRotation}deg) translateX(-50%)` }}
                    >
                      <span className={`text-xs font-bold px-2 py-1 rounded-full ${
                        isFacingQibla() 
                          ? 'bg-emerald-500 text-white' 
                          : 'bg-amber-500 text-white'
                      }`}>
                        QIBLA
                      </span>
                    </div>
                  </div>
                </div>

                {/* Current Heading Indicator (fixed at top) */}
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <div className="w-0 h-0 border-l-[8px] border-r-[8px] border-t-[12px] border-l-transparent border-r-transparent border-t-red-500" />
                </div>
              </div>

              {/* Status */}
              <div className={`text-center p-4 rounded-xl mb-4 ${
                isFacingQibla() 
                  ? 'bg-emerald-100 border-2 border-emerald-300' 
                  : 'bg-amber-50 border-2 border-amber-200'
              }`}>
                <p className={`text-lg font-bold ${
                  isFacingQibla() ? 'text-emerald-700' : 'text-amber-700'
                }`}>
                  {isFacingQibla() 
                    ? '✓ You are facing the Qibla!' 
                    : `Turn ${deviceHeading > (qiblaAngle || 0) ? 'left' : 'right'} to face Qibla`
                  }
                </p>
                <p className="text-sm text-gray-600 mt-1">
                  Your heading: {deviceHeading}° {getDirectionName(deviceHeading)}
                </p>
              </div>

              {/* Reset Button */}
              <button
                onClick={() => {
                  setHasLocation(false);
                  setQiblaAngle(null);
                  setDistance(null);
                }}
                className="w-full py-3 text-gray-500 hover:text-emerald-600 transition-colors text-sm"
              >
                <RotateCw className="w-4 h-4 inline mr-2" />
                Recalculate
              </button>
            </div>
          )}
        </div>

        {/* Instructions */}
        <div className="fade-up max-w-xl mx-auto mt-8" style={{ transitionDelay: '0.2s' }}>
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <h4 className="font-medium text-gray-800 mb-4 flex items-center gap-2">
              <Info className="w-5 h-5 text-emerald-600" />
              How to use:
            </h4>
            <ol className="space-y-3">
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
    </section>
  );
}

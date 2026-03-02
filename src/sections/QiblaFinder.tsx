import { useState, useEffect, useRef } from 'react';
import { Compass, RotateCw, Camera, AlertCircle, X, Info } from 'lucide-react';
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

// Kaaba SVG Component
function KaabaIcon({ className, style }: { className?: string; style?: React.CSSProperties }) {
  return (
    <svg viewBox="0 0 100 100" className={className} style={style} fill="currentColor">
      <path d="M20 40 L50 30 L80 40 L80 75 L50 85 L20 75 Z" fill="#1a1a2e" />
      <path d="M20 40 L50 30 L80 40 L50 50 Z" fill="#16213e" />
      <path d="M20 55 L80 55 L80 60 L20 60 Z" fill="#d4af37" />
      <path d="M42 55 L58 55 L58 75 L42 75 Z" fill="#0f0f1a" />
      <path d="M40 55 L60 55 L60 77 L40 77 Z" fill="none" stroke="#d4af37" strokeWidth="2" />
    </svg>
  );
}

export function QiblaFinder() {
  const [qiblaAngle, setQiblaAngle] = useState<number | null>(null);
  const [distance, setDistance] = useState<number | null>(null);
  const [deviceHeading, setDeviceHeading] = useState<number>(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');
  const [cameraActive, setCameraActive] = useState(false);
  const [permissionDenied, setPermissionDenied] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(true);
  const [hasLocation, setHasLocation] = useState(false);
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
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
      
      if ((event as any).webkitCompassHeading) {
        heading = (event as any).webkitCompassHeading;
      }
      
      setDeviceHeading(heading);
    };

    if (window.DeviceOrientationEvent) {
      window.addEventListener('deviceorientation', handleOrientation, true);
    }

    return () => {
      window.removeEventListener('deviceorientation', handleOrientation, true);
    };
  }, []);

  // Stop camera when component unmounts
  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' },
        audio: false
      });
      
      streamRef.current = stream;
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }
      
      setCameraActive(true);
      setPermissionDenied(false);
    } catch (err) {
      console.error('Camera access denied:', err);
      setPermissionDenied(true);
      setCameraActive(false);
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setCameraActive(false);
  };

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
        setShowOnboarding(false);
        
        // Start camera after getting location
        startCamera();
      },
      (err) => {
        console.error('Geolocation error:', err);
        setError('Unable to retrieve your location. Please enable location services and try again.');
        setLoading(false);
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 0 }
    );
  };

  // Calculate the rotation for the Qibla arrow
  const getArrowRotation = () => {
    if (qiblaAngle === null) return 0;
    return (qiblaAngle - deviceHeading + 360) % 360;
  };

  // Check if facing Qibla (within 10 degrees)
  const isFacingQibla = () => {
    const rotation = getArrowRotation();
    return rotation <= 10 || rotation >= 350;
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

        {/* Main Qibla Finder Container */}
        <div className="fade-up max-w-md mx-auto" style={{ transitionDelay: '0.1s' }}>
          {showOnboarding ? (
            // Onboarding Screen
            <div className="relative bg-gradient-to-b from-purple-600 via-purple-700 to-indigo-900 rounded-3xl overflow-hidden shadow-2xl">
              <div className="absolute inset-0 opacity-10">
                <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                  <pattern id="islamic-pattern" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
                    <circle cx="10" cy="10" r="8" fill="none" stroke="white" strokeWidth="0.5"/>
                    <path d="M10 2 L18 10 L10 18 L2 10 Z" fill="none" stroke="white" strokeWidth="0.5"/>
                  </pattern>
                  <rect width="100" height="100" fill="url(#islamic-pattern)"/>
                </svg>
              </div>
              
              <div className="relative z-10 p-8 text-center min-h-[500px] flex flex-col items-center justify-center">
                <div className="mb-8 relative">
                  <div className="w-32 h-32 rounded-full bg-white/10 flex items-center justify-center backdrop-blur-sm">
                    <KaabaIcon className="w-20 h-20 text-white" />
                  </div>
                  <div className="absolute inset-0 w-32 h-32 rounded-full bg-amber-400/30 blur-xl -z-10" />
                </div>
                
                <h3 className="font-serif text-3xl text-white mb-3">Qibla Finder</h3>
                <p className="text-white/80 text-sm mb-8 max-w-xs">
                  Locate the Qibla, wherever you are. Allow camera and location access for the best experience.
                </p>
                
                <button
                  onClick={getLocation}
                  disabled={loading}
                  className="bg-white text-purple-700 px-8 py-3 rounded-full font-semibold hover:bg-amber-400 hover:text-white transition-all duration-300 shadow-lg flex items-center gap-2 disabled:opacity-70"
                >
                  {loading ? (
                    <>
                      <RotateCw className="w-5 h-5 animate-spin" />
                      Getting Location...
                    </>
                  ) : (
                    <>
                      <Compass className="w-5 h-5" />
                      Let's Go
                    </>
                  )}
                </button>
                
                {error && (
                  <div className="mt-6 p-4 bg-red-500/20 rounded-xl flex items-start gap-3 max-w-xs">
                    <AlertCircle className="w-5 h-5 text-red-300 flex-shrink-0 mt-0.5" />
                    <p className="text-red-200 text-sm">{error}</p>
                  </div>
                )}
              </div>
            </div>
          ) : (
            // AR Mode - Camera View with Qibla Overlay
            <div className="relative rounded-3xl overflow-hidden shadow-2xl bg-gray-900">
              {/* Camera Feed */}
              <div className="relative aspect-[3/4] bg-black">
                {cameraActive ? (
                  <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    muted
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                ) : permissionDenied ? (
                  <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-b from-purple-600 to-indigo-900">
                    <div className="text-center p-6">
                      <Camera className="w-16 h-16 text-white/50 mx-auto mb-4" />
                      <p className="text-white mb-4">Camera access denied</p>
                      <button
                        onClick={startCamera}
                        className="bg-white/20 text-white px-6 py-2 rounded-full hover:bg-white/30 transition-colors"
                      >
                        Try Again
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-b from-purple-600 to-indigo-900">
                    <RotateCw className="w-10 h-10 text-white/50 animate-spin" />
                  </div>
                )}

                {/* AR Overlay - 3D Kaaba */}
                {hasLocation && qiblaAngle !== null && (
                  <div 
                    className="absolute inset-0 flex items-center justify-center pointer-events-none"
                    style={{ 
                      transform: `rotate(${getArrowRotation()}deg)`,
                      transition: 'transform 0.3s ease-out'
                    }}
                  >
                    <div className="relative">
                      <div className={`relative transition-all duration-500 ${isFacingQibla() ? 'scale-125' : 'scale-100'}`}>
                        <KaabaIcon 
                          className={`w-40 h-40 drop-shadow-2xl transition-all duration-300 ${
                            isFacingQibla() ? 'text-amber-400' : 'text-white'
                          }`}
                          style={{ 
                            filter: isFacingQibla() 
                              ? 'drop-shadow(0 0 30px rgba(251, 191, 36, 0.8))' 
                              : 'drop-shadow(0 0 20px rgba(255, 255, 255, 0.5))'
                          }} 
                        />
                        
                        {isFacingQibla() && (
                          <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 whitespace-nowrap">
                            <span className="bg-amber-500 text-white px-4 py-1 rounded-full text-sm font-bold animate-pulse">
                              Facing Qibla!
                            </span>
                          </div>
                        )}
                      </div>
                      
                      <div 
                        className="absolute -bottom-16 left-1/2 -translate-x-1/2 bg-black/70 backdrop-blur-sm text-white px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap"
                        style={{ transform: `rotate(${-getArrowRotation()}deg) translateX(-50%)` }}
                      >
                        {distance?.toLocaleString()} km to Kaaba
                      </div>
                    </div>
                  </div>
                )}

                {/* Top Info Bar */}
                <div className="absolute top-4 left-4 right-4 flex justify-between items-start">
                  <div className="bg-black/60 backdrop-blur-md rounded-xl px-4 py-2">
                    <p className="text-white/60 text-[10px] uppercase tracking-wider">Qibla Direction</p>
                    <p className="text-amber-400 text-2xl font-bold">{qiblaAngle}°</p>
                  </div>
                  <button
                    onClick={() => {
                      stopCamera();
                      setShowOnboarding(true);
                      setHasLocation(false);
                      setQiblaAngle(null);
                    }}
                    className="w-10 h-10 rounded-full bg-black/60 backdrop-blur-md flex items-center justify-center text-white hover:bg-black/80 transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Bottom Info Bar */}
                <div className="absolute bottom-4 left-4 right-4">
                  <div className="bg-black/70 backdrop-blur-md rounded-xl p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-white/60 text-xs">Your Heading</p>
                        <p className="text-emerald-400 text-xl font-bold">{Math.round(deviceHeading)}°</p>
                      </div>
                      <div className="text-right">
                        <p className="text-white/60 text-xs">Accuracy</p>
                        <p className={`text-sm font-medium ${isFacingQibla() ? 'text-amber-400' : 'text-white'}`}>
                          {isFacingQibla() ? 'Perfect!' : `${Math.round(getArrowRotation())}° off`}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {!isFacingQibla() && (
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none">
                    <div className="text-white/30 text-sm font-medium bg-black/30 px-4 py-2 rounded-full backdrop-blur-sm">
                      Turn to face the Kaaba
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {showOnboarding && (
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
        )}
      </div>
    </section>
  );
}

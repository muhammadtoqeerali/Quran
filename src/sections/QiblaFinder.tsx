import { useState, useEffect, useRef, useCallback } from 'react';
import { Compass, MapPin, Navigation, RotateCw, Camera, AlertCircle } from 'lucide-react';
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

export function QiblaFinder() {
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [qiblaAngle, setQiblaAngle] = useState<number | null>(null);
  const [distance, setDistance] = useState<number | null>(null);
  const [deviceHeading, setDeviceHeading] = useState<number>(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');
  const [cameraActive, setCameraActive] = useState(false);
  const [permissionDenied, setPermissionDenied] = useState(false);
  
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
      
      // iOS webkitCompassHeading
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

  const startCamera = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' },
        audio: false
      });
      
      streamRef.current = stream;
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }
      
      setCameraActive(true);
      setPermissionDenied(false);
    } catch (err) {
      console.error('Camera access denied:', err);
      setPermissionDenied(true);
      setCameraActive(false);
    }
  }, []);

  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setCameraActive(false);
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
        setLoading(false);
        
        // Auto-start camera after getting location
        startCamera();
      },
      () => {
        setError('Unable to retrieve your location. Please enable location services.');
        setLoading(false);
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  };

  // Calculate the rotation for the Qibla arrow overlay
  const getArrowRotation = () => {
    if (qiblaAngle === null) return 0;
    // The arrow needs to point to Qibla relative to device heading
    return (qiblaAngle - deviceHeading + 360) % 360;
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

        {/* AR Camera View */}
        <div className="fade-up max-w-2xl mx-auto" style={{ transitionDelay: '0.1s' }}>
          {!location ? (
            // Initial State - Get Location
            <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8 text-center">
              <div className="w-20 h-20 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-6">
                <Compass className="w-10 h-10 text-emerald-600" />
              </div>
              <h3 className="font-serif text-2xl text-gray-800 mb-3">Find Your Qibla Direction</h3>
              <p className="text-gray-600 mb-6 max-w-md mx-auto">
                Allow location access and camera permission to see the Qibla direction overlaid on your camera view.
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
                <div className="mt-4 p-4 bg-red-50 rounded-lg flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                  <p className="text-red-600 text-sm">{error}</p>
                </div>
              )}
            </div>
          ) : (
            // AR Camera View
            <div className="relative rounded-2xl overflow-hidden shadow-2xl bg-gray-900">
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
                  <div className="absolute inset-0 flex items-center justify-center bg-gray-800">
                    <div className="text-center p-6">
                      <Camera className="w-16 h-16 text-gray-500 mx-auto mb-4" />
                      <p className="text-gray-400 mb-4">Camera access denied</p>
                      <button
                        onClick={startCamera}
                        className="btn-outline rounded-lg text-sm"
                      >
                        Try Again
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center bg-gray-800">
                    <RotateCw className="w-10 h-10 text-gray-500 animate-spin" />
                  </div>
                )}

                {/* AR Overlay - Qibla Arrow */}
                {cameraActive && qiblaAngle !== null && (
                  <div 
                    className="absolute inset-0 flex items-center justify-center pointer-events-none"
                    style={{ transform: `rotate(${getArrowRotation()}deg)` }}
                  >
                    <div className="relative">
                      {/* Main Arrow */}
                      <Navigation 
                        className="w-32 h-32 text-amber-400 drop-shadow-lg" 
                        style={{ 
                          filter: 'drop-shadow(0 0 20px rgba(251, 191, 36, 0.6))',
                        }} 
                      />
                      {/* Distance Label */}
                      <div 
                        className="absolute -bottom-16 left-1/2 -translate-x-1/2 bg-emerald-600 text-white px-4 py-2 rounded-full text-sm font-semibold whitespace-nowrap"
                        style={{ transform: `rotate(${-getArrowRotation()}deg) translateX(-50%)` }}
                      >
                        {distance?.toLocaleString()} km to Kaaba
                      </div>
                    </div>
                  </div>
                )}

                {/* Info Overlay */}
                <div className="absolute top-4 left-4 right-4 flex justify-between items-start">
                  <div className="bg-black/60 backdrop-blur-sm rounded-lg px-4 py-2">
                    <p className="text-white text-xs uppercase tracking-wider">Qibla Direction</p>
                    <p className="text-amber-400 text-2xl font-bold">{qiblaAngle}°</p>
                  </div>
                  <div className="bg-black/60 backdrop-blur-sm rounded-lg px-4 py-2 text-right">
                    <p className="text-white text-xs uppercase tracking-wider">Your Heading</p>
                    <p className="text-emerald-400 text-2xl font-bold">{Math.round(deviceHeading)}°</p>
                  </div>
                </div>

                {/* Instructions */}
                <div className="absolute bottom-4 left-4 right-4">
                  <div className="bg-black/70 backdrop-blur-sm rounded-xl p-4">
                    <p className="text-white text-sm text-center">
                      <span className="text-amber-400 font-semibold">Point the arrow toward the Kaaba</span>
                      <br />
                      <span className="text-gray-300 text-xs">Turn your device until the yellow arrow points forward</span>
                    </p>
                  </div>
                </div>
              </div>

              {/* Controls */}
              <div className="bg-gray-900 p-4 flex items-center justify-between">
                <button
                  onClick={() => {
                    stopCamera();
                    setLocation(null);
                    setQiblaAngle(null);
                  }}
                  className="text-gray-400 hover:text-white text-sm flex items-center gap-2 transition-colors"
                >
                  <RotateCw className="w-4 h-4" />
                  Reset
                </button>
                <div className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${cameraActive ? 'bg-green-500' : 'bg-red-500'}`} />
                  <span className="text-gray-400 text-xs">
                    {cameraActive ? 'Camera Active' : 'Camera Off'}
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Instructions */}
        {!location && (
          <div className="fade-up max-w-xl mx-auto mt-8" style={{ transitionDelay: '0.2s' }}>
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <h4 className="font-medium text-gray-800 mb-4 flex items-center gap-2">
                <Compass className="w-5 h-5 text-emerald-600" />
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

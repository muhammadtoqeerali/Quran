import { useState, useEffect, useRef } from 'react';
import { Compass, Navigation, LocateFixed, RotateCw, Camera, CameraOff, Check } from 'lucide-react';
import { qiblaFinderConfig } from '../config';

function calculateQiblaDirection(lat: number, lng: number): number {
  const kaabaLat = qiblaFinderConfig.kaabaCoords.lat;
  const kaabaLng = qiblaFinderConfig.kaabaCoords.lng;

  const latRad = (lat * Math.PI) / 180;
  const lngRad = (lng * Math.PI) / 180;
  const kaabaLatRad = (kaabaLat * Math.PI) / 180;
  const kaabaLngRad = (kaabaLng * Math.PI) / 180;

  const y = Math.sin(kaabaLngRad - lngRad);
  const x = Math.cos(latRad) * Math.tan(kaabaLatRad) - Math.sin(latRad) * Math.cos(kaabaLngRad - lngRad);

  const angle = Math.atan2(y, x) * (180 / Math.PI);
  return Math.round((angle + 360) % 360);
}

function calculateDistance(lat: number, lng: number): number {
  const kaabaLat = qiblaFinderConfig.kaabaCoords.lat;
  const kaabaLng = qiblaFinderConfig.kaabaCoords.lng;
  const earthRadiusKm = 6371;

  const latRad = (lat * Math.PI) / 180;
  const kaabaLatRad = (kaabaLat * Math.PI) / 180;
  const deltaLat = ((kaabaLat - lat) * Math.PI) / 180;
  const deltaLng = ((kaabaLng - lng) * Math.PI) / 180;

  const a =
    Math.sin(deltaLat / 2) * Math.sin(deltaLat / 2) +
    Math.cos(latRad) * Math.cos(kaabaLatRad) * Math.sin(deltaLng / 2) * Math.sin(deltaLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return Math.round(earthRadiusKm * c);
}

function normalizeDegrees(value: number): number {
  return ((value % 360) + 360) % 360;
}

type DeviceOrientationWithPermission = typeof DeviceOrientationEvent & {
  requestPermission?: () => Promise<'granted' | 'denied'>;
};

export function QiblaFinder() {
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [qiblaAngle, setQiblaAngle] = useState<number | null>(null);
  const [distance, setDistance] = useState<number | null>(null);
  const [heading, setHeading] = useState<number | null>(null);
  const [relativeAngle, setRelativeAngle] = useState<number>(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [cameraError, setCameraError] = useState('');
  const [cameraActive, setCameraActive] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

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

  useEffect(() => {
    const onOrientation = (event: DeviceOrientationEvent) => {
      let nextHeading: number | null = null;
      const safariHeading = (event as DeviceOrientationEvent & { webkitCompassHeading?: number }).webkitCompassHeading;

      if (typeof safariHeading === 'number' && !Number.isNaN(safariHeading)) {
        nextHeading = safariHeading;
      } else if (typeof event.alpha === 'number' && !Number.isNaN(event.alpha)) {
        nextHeading = 360 - event.alpha;
      }

      if (nextHeading === null) {
        return;
      }

      const normalizedHeading = normalizeDegrees(nextHeading);
      setHeading(Math.round(normalizedHeading));

      if (qiblaAngle !== null) {
        setRelativeAngle(normalizeDegrees(qiblaAngle - normalizedHeading));
      }
    };

    window.addEventListener('deviceorientation', onOrientation, true);
    return () => window.removeEventListener('deviceorientation', onOrientation, true);
  }, [qiblaAngle]);

  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  const startCamera = async () => {
    setCameraError('');

    if (!navigator.mediaDevices?.getUserMedia) {
      setCameraError('Camera is not supported on this browser.');
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: { ideal: 'environment' } },
        audio: false,
      });

      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      setCameraActive(true);
    } catch {
      setCameraError('Unable to access camera. Please allow camera permission and try again.');
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    setCameraActive(false);
  };

  const requestOrientationPermission = async () => {
    const OrientationEvent = DeviceOrientationEvent as DeviceOrientationWithPermission;
    if (typeof OrientationEvent.requestPermission === 'function') {
      const permission = await OrientationEvent.requestPermission();
      if (permission !== 'granted') {
        throw new Error('Motion permission denied');
      }
    }
  };

  const startQiblaCamera = async () => {
    setLoading(true);
    setError('');

    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser.');
      setLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        const nextQiblaAngle = calculateQiblaDirection(latitude, longitude);

        setLocation({ lat: latitude, lng: longitude });
        setQiblaAngle(nextQiblaAngle);
        setDistance(calculateDistance(latitude, longitude));

        try {
          await requestOrientationPermission();
        } catch {
          setError('Motion sensor permission is needed for live Qibla alignment.');
        }

        await startCamera();
        setLoading(false);
      },
      () => {
        setError('Unable to retrieve your location. Please enable location permissions.');
        setLoading(false);
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
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
        <div className="text-center max-w-3xl mx-auto mb-12">
          <span className="font-script text-3xl text-amber-500 block mb-2 fade-up">{qiblaFinderConfig.scriptText}</span>
          <span className="text-emerald-600 text-sm uppercase tracking-[0.2em] font-semibold mb-4 block fade-up">
            {qiblaFinderConfig.subtitle}
          </span>
          <h2 className="font-serif text-4xl md:text-5xl text-gray-800 mb-4 fade-up">{qiblaFinderConfig.mainTitle}</h2>
          <p className="text-gray-600 text-lg fade-up">{qiblaFinderConfig.description}</p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 items-start max-w-5xl mx-auto">
          <div className="fade-up" style={{ transitionDelay: '0.1s' }}>
            <div className="rounded-2xl overflow-hidden border border-emerald-100 bg-gray-900 shadow-2xl aspect-[4/3] relative">
              {cameraActive ? (
                <>
                  <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover" />
                  <div className="absolute inset-0 pointer-events-none">
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                    <div className="absolute top-4 left-4 bg-black/45 text-white rounded-full px-3 py-1 text-xs">
                      Live Camera
                    </div>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-44 h-44 rounded-full border-2 border-white/70 relative">
                        <div
                          className="absolute inset-0 flex items-start justify-center transition-transform duration-300"
                          style={{ transform: `rotate(${relativeAngle}deg)` }}
                        >
                          <Navigation className="w-10 h-10 text-amber-400 fill-amber-400 -translate-y-5 drop-shadow-lg" />
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                <div className="w-full h-full flex items-center justify-center text-center text-gray-300 p-8">
                  <div>
                    <Camera className="w-10 h-10 mx-auto mb-3 text-emerald-300" />
                    <p className="font-medium">Camera preview will appear here</p>
                    <p className="text-sm text-gray-400 mt-2">Start Qibla camera mode to view live direction overlay.</p>
                  </div>
                </div>
              )}
            </div>
            {cameraError && <p className="mt-3 text-sm text-red-500">{cameraError}</p>}
          </div>

          <div className="fade-up space-y-6" style={{ transitionDelay: '0.2s' }}>
            <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
              <h3 className="font-serif text-xl text-gray-800 mb-4 flex items-center gap-2">
                <Compass className="w-5 h-5 text-emerald-600" />
                AR Qibla Finder
              </h3>

              <div className="space-y-3">
                <button
                  onClick={startQiblaCamera}
                  disabled={loading}
                  className="w-full btn-primary rounded-lg flex items-center justify-center gap-2"
                >
                  {loading ? <RotateCw className="w-5 h-5 animate-spin" /> : <LocateFixed className="w-5 h-5" />}
                  {loading ? 'Starting...' : 'Start Camera Qibla View'}
                </button>

                {cameraActive && (
                  <button
                    onClick={stopCamera}
                    className="w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-700 hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
                  >
                    <CameraOff className="w-5 h-5" />
                    Stop Camera
                  </button>
                )}
              </div>

              {error && <p className="mt-4 text-red-500 text-sm">{error}</p>}
            </div>

            {location && qiblaAngle !== null && (
              <div className="bg-emerald-50 rounded-xl p-6 border border-emerald-100">
                <div className="flex items-center gap-2 mb-4">
                  <Check className="w-5 h-5 text-emerald-600" />
                  <span className="font-medium text-emerald-800">Qibla Ready</span>
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between gap-4">
                    <span className="text-gray-600">Coordinates:</span>
                    <span className="font-medium text-gray-800 text-right">
                      {location.lat.toFixed(4)}, {location.lng.toFixed(4)}
                    </span>
                  </div>
                  <div className="flex justify-between gap-4">
                    <span className="text-gray-600">Qibla bearing:</span>
                    <span className="font-medium text-emerald-600">{qiblaAngle}°</span>
                  </div>
                  <div className="flex justify-between gap-4">
                    <span className="text-gray-600">Current heading:</span>
                    <span className="font-medium text-gray-800">{heading !== null ? `${heading}°` : 'Waiting for sensor...'}</span>
                  </div>
                  {distance !== null && (
                    <div className="flex justify-between gap-4">
                      <span className="text-gray-600">Distance to Kaaba:</span>
                      <span className="font-medium text-gray-800">{distance.toLocaleString()} km</span>
                    </div>
                  )}
                </div>
              </div>
            )}

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

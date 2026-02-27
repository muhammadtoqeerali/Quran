import { useState, useEffect, useRef } from 'react';
import { Navigation } from 'lucide-react';
import { qiblaFinderConfig } from '../config';

// Calculate Qibla direction using the spherical law of cosines:contentReference[oaicite:0]{index=0}
function calculateQiblaDirection(lat: number, lng: number): number {
  const kaabaLat = qiblaFinderConfig.kaabaCoords.lat;
  const kaabaLng = qiblaFinderConfig.kaabaCoords.lng;

  const latRad = (lat * Math.PI) / 180;
  const lngRad = (lng * Math.PI) / 180;
  const kaabaLatRad = (kaabaLat * Math.PI) / 180;
  const kaabaLngRad = (kaabaLng * Math.PI) / 180;

  const y = Math.sin(kaabaLngRad - lngRad);
  const x =
    Math.cos(latRad) * Math.tan(kaabaLatRad) -
    Math.sin(latRad) * Math.cos(kaabaLngRad - lngRad);

  let qiblaAngle = Math.atan2(y, x) * (180 / Math.PI);
  qiblaAngle = (qiblaAngle + 360) % 360;

  return Math.round(qiblaAngle);
}

export function QiblaFinder() {
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [qiblaAngle, setQiblaAngle] = useState<number | null>(null);
  const [heading, setHeading] = useState<number | null>(null);
  const [error, setError] = useState<string>('');
  const [stream, setStream] = useState<MediaStream | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const sectionRef = useRef<HTMLDivElement>(null);

  // Intersection observer for fade-up animations:contentReference[oaicite:1]{index=1}
  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
          }
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -10% 0px' },
    );
    const elements = sectionRef.current?.querySelectorAll('.fade-up');
    elements?.forEach(el => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  // Fetch geolocation and start the camera on mount
  useEffect(() => {
    const getLocationAndCamera = async () => {
      if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser');
      return;
    }
    navigator.geolocation.getCurrentPosition(
      position => {
        const { latitude, longitude } = position.coords;
        setLocation({ lat: latitude, lng: longitude });
        setQiblaAngle(calculateQiblaDirection(latitude, longitude));
      },
      () => setError('Unable to retrieve your location'),
    );
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: { ideal: 'environment' } },
      });
      setStream(mediaStream);
      if (videoRef.current) {
        // Assign stream to srcObject (TypeScript doesn’t know about it)
        (videoRef.current as any).srcObject = mediaStream;
      }
    } catch {
      setError('Unable to access the camera');
    }
  };
  getLocationAndCamera();
  return () => {
    stream?.getTracks().forEach(track => track.stop());
  };
}, []);

  // Listen for device orientation events to compute the heading
  useEffect(() => {
    const handleOrientation = (event: DeviceOrientationEvent) => {
      if (event.alpha !== null) {
        // 0° = North; invert alpha to get compass heading
        const headingDeg = (360 - event.alpha) % 360;
        setHeading(headingDeg);
      }
    };
    window.addEventListener('deviceorientationabsolute', handleOrientation, true);
    window.addEventListener('deviceorientation', handleOrientation, true);
    return () => {
      window.removeEventListener('deviceorientationabsolute', handleOrientation, true);
      window.removeEventListener('deviceorientation', handleOrientation, true);
    };
  }, []);

  // Compute the rotation difference for the arrow
  const rotation =
    heading !== null && qiblaAngle !== null
      ? ((qiblaAngle - heading + 360) % 360)
      : null;

  return (
    <section
      id="tools"
      ref={sectionRef}
      className="section-padding bg-gradient-to-b from-emerald-50/30 to-white relative overflow-hidden"
    >
      {/* Decorative circles */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-100/30 rounded-full -translate-x-1/2 -translate-y-1/2" />
      <div className="absolute bottom-0 left-0 w-48 h-48 bg-amber-100/20 rounded-full translate-x-1/3 translate-y-1/3" />

      <div className="container-custom relative">
        {/* Section header */}
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
          <p className="text-gray-600 text-lg fade-up">{qiblaFinderConfig.description}</p>
        </div>

        {/* Camera feed with Qibla overlay */}
        <div className="fade-up flex justify-center">
          <div className="relative w-full h-96 overflow-hidden rounded-lg shadow-lg">
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="w-full h-full object-cover"
            />
            {rotation !== null && (
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <Navigation
                  size={80}
                  className="text-amber-400 transition-transform duration-150"
                  style={{ transform: `rotate(${rotation}deg)` }}
                />
              </div>
            )}
          </div>
        </div>

        {/* Display errors, if any */}
        {error && <p className="text-red-500 mt-4 text-center">{error}</p>}
      </div>
    </section>
  );
}

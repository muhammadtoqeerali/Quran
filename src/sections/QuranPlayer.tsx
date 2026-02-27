import { useState, useEffect, useRef } from 'react';
import { Play, Pause, SkipBack, SkipForward, BookOpen, Globe, Headphones } from 'lucide-react';
import { quranPlayerConfig } from '../config';

interface Surah {
  number: number;
  name: string;
  englishName: string;
  englishNameTranslation: string;
  numberOfAyahs: number;
  revelationType: string;
}

interface Ayah {
  number: number;
  text: string;
  translation?: string;
  audio: string;
}

export function QuranPlayer() {
  const [surahs, setSurahs] = useState<Surah[]>([]);
  const [selectedSurah, setSelectedSurah] = useState<number>(1);
  const [selectedReciter, setSelectedReciter] = useState<string>(quranPlayerConfig.reciters[0].id);
  const [selectedTranslation] = useState<string>(quranPlayerConfig.translations[0]);
  const [ayahs, setAyahs] = useState<Ayah[]>([]);
  const [currentAyah, setCurrentAyah] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showTranslation, setShowTranslation] = useState(true);
  const audioRef = useRef<HTMLAudioElement>(null);
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

  // Fetch surahs list
  useEffect(() => {
    fetch(`${quranPlayerConfig.apiBaseUrl}/surah`)
      .then(res => res.json())
      .then(data => {
        if (data.code === 200) {
          setSurahs(data.data);
        }
      })
      .catch(console.error);
  }, []);

  // Fetch ayahs when surah changes
  useEffect(() => {
    if (!selectedSurah) return;
    
    setLoading(true);
    
    // Fetch Arabic text with audio
    const arabicPromise = fetch(`${quranPlayerConfig.apiBaseUrl}/surah/${selectedSurah}/${selectedReciter}`)
      .then(res => res.json());
    
    // Fetch translation
    const translationPromise = fetch(`${quranPlayerConfig.apiBaseUrl}/surah/${selectedSurah}/${selectedTranslation}`)
      .then(res => res.json());
    
    Promise.all([arabicPromise, translationPromise])
      .then(([arabicData, translationData]) => {
        if (arabicData.code === 200 && translationData.code === 200) {
          const combinedAyahs = arabicData.data.ayahs.map((ayah: any, index: number) => ({
            number: ayah.numberInSurah,
            text: ayah.text,
            translation: translationData.data.ayahs[index]?.text,
            audio: ayah.audio,
          }));
          setAyahs(combinedAyahs);
          setCurrentAyah(0);
          setIsPlaying(false);
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [selectedSurah, selectedReciter, selectedTranslation]);

  const handlePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleNext = () => {
    if (currentAyah < ayahs.length - 1) {
      setCurrentAyah(prev => prev + 1);
      setIsPlaying(true);
    }
  };

  const handlePrev = () => {
    if (currentAyah > 0) {
      setCurrentAyah(prev => prev - 1);
      setIsPlaying(true);
    }
  };

  const handleAyahEnd = () => {
    if (currentAyah < ayahs.length - 1) {
      setCurrentAyah(prev => prev + 1);
    } else {
      setIsPlaying(false);
    }
  };

  const currentSurah = surahs.find(s => s.number === selectedSurah);

  return (
    <section
      ref={sectionRef}
      className="section-padding bg-white relative overflow-hidden"
    >
      {/* Decorative elements */}
      <div className="absolute top-0 left-0 w-64 h-64 bg-amber-100/20 rounded-full -translate-x-1/2 -translate-y-1/2" />
      <div className="absolute bottom-0 right-0 w-48 h-48 bg-emerald-100/20 rounded-full translate-x-1/3 translate-y-1/3" />
      
      <div className="container-custom relative">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <span className="font-script text-3xl text-amber-500 block mb-2 fade-up">
            {quranPlayerConfig.scriptText}
          </span>
          <span className="text-emerald-600 text-sm uppercase tracking-[0.2em] font-semibold mb-4 block fade-up">
            {quranPlayerConfig.subtitle}
          </span>
          <h2 className="font-serif text-4xl md:text-5xl text-gray-800 mb-4 fade-up">
            {quranPlayerConfig.mainTitle}
          </h2>
          <p className="text-gray-600 text-lg fade-up">
            {quranPlayerConfig.description}
          </p>
        </div>

        <div className="max-w-4xl mx-auto fade-up" style={{ transitionDelay: '0.1s' }}>
          {/* Controls Bar */}
          <div className="bg-emerald-900 rounded-t-2xl p-4 flex flex-wrap items-center justify-between gap-4">
            {/* Surah Selector */}
            <div className="flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-emerald-400" />
              <select
                value={selectedSurah}
                onChange={(e) => setSelectedSurah(Number(e.target.value))}
                className="bg-emerald-800 text-white px-3 py-2 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                {surahs.map((surah) => (
                  <option key={surah.number} value={surah.number}>
                    {surah.number}. {surah.englishName} ({surah.name})
                  </option>
                ))}
              </select>
            </div>

            {/* Reciter Selector */}
            <div className="flex items-center gap-2">
              <Headphones className="w-5 h-5 text-emerald-400" />
              <select
                value={selectedReciter}
                onChange={(e) => setSelectedReciter(e.target.value)}
                className="bg-emerald-800 text-white px-3 py-2 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                {quranPlayerConfig.reciters.map((reciter) => (
                  <option key={reciter.id} value={reciter.id}>
                    {reciter.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Translation Toggle */}
            <button
              onClick={() => setShowTranslation(!showTranslation)}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors ${
                showTranslation ? 'bg-emerald-600 text-white' : 'bg-emerald-800 text-emerald-300'
              }`}
            >
              <Globe className="w-4 h-4" />
              Translation
            </button>
          </div>

          {/* Main Player Area */}
          <div className="bg-white rounded-b-2xl shadow-xl border border-gray-100 overflow-hidden">
            {/* Surah Info */}
            {currentSurah && (
              <div className="bg-emerald-50 px-6 py-4 border-b border-emerald-100">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-serif text-2xl text-emerald-800">{currentSurah.name}</h3>
                    <p className="text-emerald-600 text-sm">
                      {currentSurah.englishName} - {currentSurah.englishNameTranslation}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-emerald-600 text-sm">{currentSurah.numberOfAyahs} Verses</p>
                    <p className="text-emerald-500 text-xs">{currentSurah.revelationType}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Ayah Display */}
            <div className="p-6 min-h-[300px] max-h-[400px] overflow-y-auto">
              {loading ? (
                <div className="flex items-center justify-center h-full">
                  <div className="w-8 h-8 border-4 border-emerald-200 border-t-emerald-600 rounded-full animate-spin" />
                </div>
              ) : ayahs.length > 0 ? (
                <div className="space-y-6">
                  {ayahs.map((ayah, index) => (
                    <div
                      key={ayah.number}
                      className={`p-4 rounded-xl transition-all ${
                        index === currentAyah
                          ? 'bg-emerald-50 border-2 border-emerald-200'
                          : 'bg-gray-50 border border-gray-100'
                      }`}
                      onClick={() => {
                        setCurrentAyah(index);
                        setIsPlaying(true);
                      }}
                    >
                      <div className="flex items-start gap-4">
                        <span className="w-8 h-8 rounded-full bg-emerald-600 text-white flex items-center justify-center text-sm font-semibold flex-shrink-0">
                          {ayah.number}
                        </span>
                        <div className="flex-1">
                          <p className="font-arabic text-2xl text-right text-gray-800 leading-relaxed mb-2">
                            {ayah.text}
                          </p>
                          {showTranslation && ayah.translation && (
                            <p className="text-gray-600 text-sm leading-relaxed">
                              {ayah.translation}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex items-center justify-center h-full text-gray-400">
                  Select a Surah to begin
                </div>
              )}
            </div>

            {/* Audio Player Controls */}
            {ayahs.length > 0 && (
              <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
                {/* Progress */}
                <div className="mb-4">
                  <div className="flex items-center justify-between text-sm text-gray-500 mb-2">
                    <span>Ayah {currentAyah + 1} of {ayahs.length}</span>
                    <span>{Math.round(((currentAyah + 1) / ayahs.length) * 100)}%</span>
                  </div>
                  <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-emerald-600 transition-all duration-300"
                      style={{ width: `${((currentAyah + 1) / ayahs.length) * 100}%` }}
                    />
                  </div>
                </div>

                {/* Controls */}
                <div className="flex items-center justify-center gap-4">
                  <button
                    onClick={handlePrev}
                    disabled={currentAyah === 0}
                    className="w-12 h-12 rounded-full bg-white border border-gray-200 flex items-center justify-center text-gray-600 hover:bg-emerald-50 hover:border-emerald-300 hover:text-emerald-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <SkipBack className="w-5 h-5" />
                  </button>

                  <button
                    onClick={handlePlay}
                    className="w-16 h-16 rounded-full bg-emerald-600 flex items-center justify-center text-white hover:bg-emerald-700 transition-colors shadow-lg shadow-emerald-200"
                  >
                    {isPlaying ? (
                      <Pause className="w-7 h-7" />
                    ) : (
                      <Play className="w-7 h-7 ml-1" />
                    )}
                  </button>

                  <button
                    onClick={handleNext}
                    disabled={currentAyah === ayahs.length - 1}
                    className="w-12 h-12 rounded-full bg-white border border-gray-200 flex items-center justify-center text-gray-600 hover:bg-emerald-50 hover:border-emerald-300 hover:text-emerald-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <SkipForward className="w-5 h-5" />
                  </button>
                </div>

                {/* Hidden Audio Element */}
                {ayahs[currentAyah]?.audio && (
                  <audio
                    ref={audioRef}
                    src={ayahs[currentAyah].audio}
                    onEnded={handleAyahEnd}
                    onPlay={() => setIsPlaying(true)}
                    onPause={() => setIsPlaying(false)}
                    autoPlay={isPlaying}
                  />
                )}
              </div>
            )}
          </div>

          {/* Note */}
          <p className="text-center text-gray-500 text-sm mt-4">
            Audio powered by Al Quran Cloud API. Click on any ayah to play it.
          </p>
        </div>
      </div>
    </section>
  );
}

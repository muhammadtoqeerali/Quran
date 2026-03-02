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

interface TranslationOption {
  id: string;
  name: string;
  language: string;
  hasAudio: boolean;
}

const translationOptions: TranslationOption[] = [
  { id: "en.sahih", name: "English - Sahih International", language: "English", hasAudio: false },
  { id: "ur.jalandhry", name: "Urdu - Jalandhry", language: "Urdu", hasAudio: false },
  { id: "ur.ahmedali", name: "Urdu - Ahmed Ali", language: "Urdu", hasAudio: false },
];



export function QuranPlayer() {
  const [surahs, setSurahs] = useState<Surah[]>([]);
  const [selectedSurah, setSelectedSurah] = useState<number>(1);
  const [selectedReciter, setSelectedReciter] = useState<string>(quranPlayerConfig.reciters[0].id);
  const [selectedTranslation, setSelectedTranslation] = useState<string>(translationOptions[0].id);
  const [ayahs, setAyahs] = useState<Ayah[]>([]);
  const [currentAyah, setCurrentAyah] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showTranslation, setShowTranslation] = useState(true);
  
  const arabicAudioRef = useRef<HTMLAudioElement>(null);
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

  // Fetch ayahs when surah or reciter changes
  useEffect(() => {
    if (!selectedSurah) return;
    
    setLoading(true);
    
    // Fetch Arabic text with audio
    const arabicPromise = fetch(`${quranPlayerConfig.apiBaseUrl}/surah/${selectedSurah}/${selectedReciter}`)
      .then(res => res.json());
    
    // Fetch written translation
    const translationPromise = fetch(`${quranPlayerConfig.apiBaseUrl}/surah/${selectedSurah}/${selectedTranslation}`)
      .then(res => res.json());
    
    Promise.all([arabicPromise, translationPromise])
      .then(([arabicData, translationData]) => {
        if (arabicData.code === 200) {
          const combinedAyahs = arabicData.data.ayahs.map((ayah: any, index: number) => ({
            number: ayah.numberInSurah,
            text: ayah.text,
            translation: translationData.data?.ayahs[index]?.text,
            audio: ayah.audio,
          }));
          setAyahs(combinedAyahs);
        }
        setCurrentAyah(0);
        setIsPlaying(false);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [selectedSurah, selectedReciter, selectedTranslation]);

  const handlePlay = () => {
    if (arabicAudioRef.current) {
      if (isPlaying) {
        arabicAudioRef.current.pause();
      } else {
        arabicAudioRef.current.play();
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

  // Get current translation name
  const currentTranslation = translationOptions.find(t => t.id === selectedTranslation);

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

        <div className="max-w-5xl mx-auto fade-up" style={{ transitionDelay: '0.1s' }}>
          {/* Controls Bar */}
          <div className="bg-emerald-900 rounded-t-2xl p-4 flex flex-wrap items-center justify-between gap-4">
            {/* Surah Selector */}
            <div className="flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-emerald-400" />
              <select
                value={selectedSurah}
                onChange={(e) => setSelectedSurah(Number(e.target.value))}
                className="bg-emerald-800 text-white px-3 py-2 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 max-w-[200px]"
              >
                {surahs.map((surah) => (
                  <option key={surah.number} value={surah.number}>
                    {surah.number}. {surah.englishName}
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
                className="bg-emerald-800 text-white px-3 py-2 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 max-w-[200px]"
              >
                {quranPlayerConfig.reciters.map((reciter) => (
                  <option key={reciter.id} value={reciter.id}>
                    {reciter.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Translation Selector */}
            <div className="flex items-center gap-2">
              <Globe className="w-5 h-5 text-emerald-400" />
              <select
                value={selectedTranslation}
                onChange={(e) => setSelectedTranslation(e.target.value)}
                className="bg-emerald-800 text-white px-3 py-2 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 max-w-[180px]"
              >
                {translationOptions.map((trans) => (
                  <option key={trans.id} value={trans.id}>
                    {trans.language}
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
              Text
            </button>
          </div>

          {/* Main Player Area */}
          <div className="bg-white rounded-b-2xl shadow-xl border border-gray-100 overflow-hidden">
            {/* Surah Info */}
            {currentSurah && (
              <div className="bg-emerald-50 px-6 py-4 border-b border-emerald-100">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <div>
                    <h3 className="font-serif text-2xl text-emerald-800">{currentSurah.name}</h3>
                    <p className="text-emerald-600 text-sm">
                      {currentSurah.englishName} - {currentSurah.englishNameTranslation}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-emerald-600 text-sm">{currentSurah.numberOfAyahs} Verses</p>
                    <p className="text-emerald-500 text-xs">{currentSurah.revelationType}</p>
                    {showTranslation && currentTranslation && (
                      <p className="text-amber-600 text-xs mt-1">
                        Translation: {currentTranslation.name}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Ayah Display */}
            <div className="p-6 min-h-[300px] max-h-[450px] overflow-y-auto">
              {loading ? (
                <div className="flex items-center justify-center h-full">
                  <div className="w-8 h-8 border-4 border-emerald-200 border-t-emerald-600 rounded-full animate-spin" />
                </div>
              ) : ayahs.length > 0 ? (
                <div className="space-y-6">
                  {ayahs.map((ayah, index) => (
                    <div
                      key={ayah.number}
                      className={`p-4 rounded-xl transition-all cursor-pointer ${
                        index === currentAyah
                          ? 'bg-emerald-50 border-2 border-emerald-200'
                          : 'bg-gray-50 border border-gray-100 hover:bg-emerald-50/50'
                      }`}
                      onClick={() => {
                        setCurrentAyah(index);
                        setIsPlaying(true);
                      }}
                    >
                      <div className="flex items-start gap-4">
                        <span className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold flex-shrink-0 ${
                          index === currentAyah ? 'bg-emerald-600 text-white' : 'bg-emerald-100 text-emerald-600'
                        }`}>
                          {ayah.number}
                        </span>
                        <div className="flex-1">
                          <p className="font-arabic text-2xl text-right text-gray-800 leading-relaxed mb-3">
                            {ayah.text}
                          </p>
                          {showTranslation && ayah.translation && (
                            <div className="border-t border-gray-200 pt-3 mt-3">
                              <p className={`text-sm leading-relaxed ${
                                currentTranslation?.language === 'Urdu' ? 'font-arabic text-right' : ''
                              }`} style={{ direction: currentTranslation?.language === 'Urdu' ? 'rtl' : 'ltr' }}>
                                <span className="text-amber-600 font-medium">
                                  {currentTranslation?.language === 'English' ? 'Translation: ' : 'ترجمہ: '}
                                </span>
                                <span className="text-gray-600">{ayah.translation}</span>
                              </p>
                            </div>
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

                {/* Hidden Audio Elements */}
                {ayahs[currentAyah]?.audio && (
                  <audio
                    ref={arabicAudioRef}
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
          <p className="text-center text-gray-400 text-xs mt-1">
            English and Urdu translations available. Audio translations coming soon.
          </p>
        </div>
      </div>
    </section>
  );
}

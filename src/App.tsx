import { useState, useCallback } from 'react';
import { Navigation } from './sections/Navigation';
import { Hero } from './sections/Hero';
import { Features } from './sections/Features';
import { WineShowcase } from './sections/WineShowcase';
import { HowItWorks } from './sections/HowItWorks';
import { WineryCarousel } from './sections/WineryCarousel';
import { Pricing } from './sections/Pricing';
import { Museum } from './sections/Museum';
import { News } from './sections/News';
import { ContactForm } from './sections/ContactForm';
import { Footer } from './sections/Footer';
import { Preloader } from './components/Preloader';
import { ScrollToTop } from './components/ScrollToTop';

function App() {
  const [isLoading, setIsLoading] = useState(true);

  const handlePreloaderComplete = useCallback(() => {
    setIsLoading(false);
  }, []);

  return (
    <>
      {isLoading && <Preloader onComplete={handlePreloaderComplete} />}

      <div className={`min-h-screen bg-white ${isLoading ? 'overflow-hidden max-h-screen' : ''}`}>
        <Navigation />

        <main>
          <Hero isReady={!isLoading} />
          <Features />
          <WineShowcase />
          <HowItWorks />
          <WineryCarousel />
          <Pricing />
          <Museum />
          <News />
          <ContactForm />
        </main>

        <Footer />
        <ScrollToTop />
      </div>
    </>
  );
}

export default App;

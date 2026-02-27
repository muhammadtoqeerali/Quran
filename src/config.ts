// =============================================================================
// Quran Academy Configuration - Enhanced Version
// =============================================================================

// -----------------------------------------------------------------------------
// Site Config
// -----------------------------------------------------------------------------
export interface SiteConfig {
  title: string;
  description: string;
  language: string;
  keywords: string;
  ogImage: string;
  canonical: string;
}

export const siteConfig: SiteConfig = {
  title: "Quran Academy - Online Quran Classes for Kids & Adults",
  description: "Learn Quran online with expert tutors. One-to-one online Quran classes for kids and adults with Tajweed, memorization, and Islamic studies. 3 free trial classes!",
  language: "en",
  keywords: "online quran classes, learn quran online, quran tutor, quran academy, quran classes for kids, online quran learning, tajweed classes, quran memorization, hifz program",
  ogImage: "/images/hero-banner.jpg",
  canonical: "https://quranacademy.com",
};

// -----------------------------------------------------------------------------
// Top Header Config (Country Contacts & Social Media)
// -----------------------------------------------------------------------------
export interface CountryContact {
  country: string;
  flag: string;
  code: string;
  whatsapp: string;
}

export interface SocialLink {
  name: string;
  icon: string;
  url: string;
}

export interface TopHeaderConfig {
  countries: CountryContact[];
  socialLinks: SocialLink[];
}

export const topHeaderConfig: TopHeaderConfig = {
  countries: [
    {
      country: "Pakistan",
      flag: "ðŸ‡µðŸ‡°",
      code: "+92",
      whatsapp: "+923428650577",
    },
    {
      country: "Italy",
      flag: "ðŸ‡®ðŸ‡¹",
      code: "+39",
      whatsapp: "+393756173106",
    },
    {
      country: "Dubai",
      flag: "ðŸ‡¦ðŸ‡ª",
      code: "+971",
      whatsapp: "+971581628306",
    },
  ],
  socialLinks: [
    {
      name: "Instagram",
      icon: "Instagram",
      url: "https://instagram.com/quranacademy",
    },
    {
      name: "YouTube",
      icon: "Youtube",
      url: "https://youtube.com/quranacademy",
    },
    {
      name: "Facebook",
      icon: "Facebook",
      url: "https://facebook.com/quranacademy",
    },
  ],
};

// -----------------------------------------------------------------------------
// Navigation Config
// -----------------------------------------------------------------------------
export interface NavDropdownItem {
  name: string;
  href: string;
}

export interface NavLink {
  name: string;
  href: string;
  icon: string;
  dropdown?: NavDropdownItem[];
}

export interface NavigationConfig {
  brandName: string;
  brandSubname: string;
  tagline: string;
  logo: string;
  navLinks: NavLink[];
  ctaButtonText: string;
}

export const navigationConfig: NavigationConfig = {
  brandName: "Quran",
  brandSubname: "Academy",
  tagline: "Learn Quran Online",
  logo: "/images/logo.png",
  navLinks: [
    { name: "Home", href: "#home", icon: "Home" },
    { name: "About", href: "#about", icon: "BookOpen" },
    { 
      name: "Courses", 
      href: "#courses", 
      icon: "Book",
      dropdown: [
        { name: "Quran for Kids", href: "#courses" },
        { name: "Quran Reading", href: "#courses" },
        { name: "Quran Memorization", href: "#courses" },
        { name: "Tajweed Rules", href: "#courses" },
        { name: "Islamic Studies", href: "#courses" },
        { name: "Ladies Classes", href: "#courses" },
      ]
    },
    { name: "Pricing", href: "#pricing", icon: "Tag" },
    { name: "Tools", href: "#tools", icon: "Compass" },
    { name: "Blog", href: "#blog", icon: "Newspaper" },
    { name: "Contact", href: "#contact", icon: "Mail" },
  ],
  ctaButtonText: "Start Free Trial",
};

// -----------------------------------------------------------------------------
// Preloader Config
// -----------------------------------------------------------------------------
export interface PreloaderConfig {
  brandName: string;
  brandSubname: string;
  yearText: string;
  logo: string;
}

export const preloaderConfig: PreloaderConfig = {
  brandName: "Quran",
  brandSubname: "Academy",
  yearText: "Since 2015",
  logo: "/images/logo.png",
};

// -----------------------------------------------------------------------------
// Hero Config
// -----------------------------------------------------------------------------
export interface HeroStat {
  value: number;
  suffix: string;
  label: string;
}

export interface HeroConfig {
  scriptText: string;
  mainTitle: string;
  subtitle: string;
  ctaButtonText: string;
  ctaTarget: string;
  secondaryCtaText: string;
  secondaryCtaTarget: string;
  stats: HeroStat[];
  decorativeText: string;
  backgroundImage: string;
}

export const heroConfig: HeroConfig = {
  scriptText: "Ø¨ÙØ³Ù’Ù…Ù Ø§Ù„Ù„Ù‡Ù Ø§Ù„Ø±ÙŽÙ‘Ø­Ù’Ù…Ù°Ù†Ù Ø§Ù„Ø±ÙŽÙ‘Ø­ÙÙŠÙ’Ù…Ù",
  mainTitle: "Learn Quran Online\nWith Expert Tutors",
  subtitle: "One-to-one online Quran classes for kids and adults. Start your spiritual journey today with our certified teachers from Al-Azhar University.",
  ctaButtonText: "Start Free Trial",
  ctaTarget: "#contact",
  secondaryCtaText: "View Courses",
  secondaryCtaTarget: "#courses",
  stats: [
    { value: 50, suffix: "+", label: "Expert Tutors" },
    { value: 500, suffix: "+", label: "Happy Students" },
    { value: 30, suffix: "+", label: "Countries" },
    { value: 9, suffix: "+", label: "Years Experience" },
  ],
  decorativeText: "Learn â€¢ Grow â€¢ Connect",
  backgroundImage: "/images/hero-banner.jpg",
};

// -----------------------------------------------------------------------------
// Features Config (Why Choose Us)
// -----------------------------------------------------------------------------
export interface Feature {
  icon: string;
  title: string;
  description: string;
}

export interface FeaturesConfig {
  scriptText: string;
  subtitle: string;
  mainTitle: string;
  features: Feature[];
}

export const featuresConfig: FeaturesConfig = {
  scriptText: "Why Choose Us",
  subtitle: "OUR ADVANTAGES",
  mainTitle: "What Makes Us Special",
  features: [
    {
      icon: "Users",
      title: "Certified Tutors",
      description: "Our teachers are graduates from Al-Azhar University and other prestigious Islamic institutions with years of teaching experience.",
    },
    {
      icon: "Clock",
      title: "Flexible Schedule",
      description: "Choose class times that work best for you. We offer 24/7 availability to accommodate students from all time zones.",
    },
    {
      icon: "User",
      title: "One-on-One Classes",
      description: "Personalized attention with individual online sessions ensures maximum learning progress for every student.",
    },
    {
      icon: "Gift",
      title: "3 Free Trial Classes",
      description: "Experience our teaching methodology with no commitment. Try before you enroll with our complimentary trial classes.",
    },
    {
      icon: "Award",
      title: "Certification",
      description: "Receive recognized certificates upon course completion. Our Ijazah program connects you to the chain of narration.",
    },
    {
      icon: "Monitor",
      title: "Interactive Learning",
      description: "Digital whiteboards, screen sharing, and recorded sessions create an engaging virtual classroom experience.",
    },
  ],
};

// -----------------------------------------------------------------------------
// Wine Showcase Config (Courses Display)
// -----------------------------------------------------------------------------
export interface Wine {
  id: string;
  name: string;
  subtitle: string;
  year: string;
  image: string;
  filter: string;
  glowColor: string;
  description: string;
  tastingNotes: string;
  alcohol: string;
  temperature: string;
  aging: string;
}

export interface WineFeature {
  icon: string;
  title: string;
  description: string;
}

export interface WineQuote {
  text: string;
  attribution: string;
  prefix: string;
}

export interface WineShowcaseConfig {
  scriptText: string;
  subtitle: string;
  mainTitle: string;
  wines: Wine[];
  features: WineFeature[];
  quote: WineQuote;
}

export const wineShowcaseConfig: WineShowcaseConfig = {
  scriptText: "Our Programs",
  subtitle: "COMPREHENSIVE QURAN EDUCATION",
  mainTitle: "Explore Our Courses",
  wines: [
    {
      id: "kids",
      name: "Quran for Kids",
      subtitle: "Foundation Course",
      year: "Ages 5-12",
      image: "/images/course-kids.jpg",
      filter: "",
      glowColor: "bg-emerald-500/20",
      description: "Specially designed for young learners with interactive lessons, colorful materials, and patient teachers who make Quran learning fun and engaging.",
      tastingNotes: "Noorani Qaida, Basic Tajweed, Short Surahs",
      alcohol: "Beginner",
      temperature: "25-30 min",
      aging: "3-6 months",
    },
    {
      id: "reading",
      name: "Quran Reading",
      subtitle: "Tajweed Mastery",
      year: "All Ages",
      image: "/images/course-reading.jpg",
      filter: "brightness(1.1) sepia(0.1)",
      glowColor: "bg-amber-500/20",
      description: "Master the art of Quran recitation with proper Tajweed rules. Learn to read fluently with correct pronunciation and rhythm.",
      tastingNotes: "Tajweed Rules, Makharij, Fluency",
      alcohol: "All Levels",
      temperature: "30-45 min",
      aging: "6-12 months",
    },
    {
      id: "memorization",
      name: "Hifz Program",
      subtitle: "Memorization",
      year: "Intensive",
      image: "/images/course-memorization.jpg",
      filter: "brightness(0.95) sepia(0.15)",
      glowColor: "bg-teal-600/20",
      description: "Structured memorization program with revision schedules, personalized plans, and experienced Hafiz tutors to guide you through the journey.",
      tastingNotes: "Full Hifz, Revision, Muraja'ah",
      alcohol: "Intermediate+",
      temperature: "45-60 min",
      aging: "2-4 years",
    },
    {
      id: "females",
      name: "Ladies Classes",
      subtitle: "Sisters Only",
      year: "All Ages",
      image: "/images/course-females.jpg",
      filter: "brightness(1.05) sepia(0.05)",
      glowColor: "bg-rose-400/20",
      description: "Dedicated classes for sisters with female teachers. Learn in a comfortable environment with personalized attention and flexible scheduling.",
      tastingNotes: "Quran Reading, Tafseer, Islamic Studies",
      alcohol: "All Levels",
      temperature: "30-45 min",
      aging: "Flexible",
    },
    {
      id: "islamic",
      name: "Islamic Studies",
      subtitle: "Comprehensive",
      year: "All Ages",
      image: "/images/course-islamic.jpg",
      filter: "brightness(1.08) sepia(0.12)",
      glowColor: "bg-amber-600/20",
      description: "Beyond Quran - learn about Islamic beliefs, practices, history, and values. Build a strong foundation in your faith and understanding.",
      tastingNotes: "Aqeedah, Fiqh, Seerah, Dua",
      alcohol: "All Levels",
      temperature: "30-45 min",
      aging: "Ongoing",
    },
  ],
  features: [
    {
      icon: "Sparkles",
      title: "Expert Tutors",
      description: "Certified teachers with years of experience in Quranic education",
    },
    {
      icon: "Thermometer",
      title: "Flexible Schedule",
      description: "Choose class times that work best for you and your family",
    },
    {
      icon: "Clock",
      title: "One-on-One",
      description: "Personalized attention with individual online sessions",
    },
    {
      icon: "Wine",
      title: "Free Trial",
      description: "Start with 3 free trial classes before committing",
    },
  ],
  quote: {
    text: "The best among you are those who learn the Quran and teach it.",
    attribution: "Prophet Muhammad (PBUH)",
    prefix: "Hadith",
  },
};

// -----------------------------------------------------------------------------
// How It Works Config
// -----------------------------------------------------------------------------
export interface Step {
  number: string;
  title: string;
  description: string;
}

export interface HowItWorksConfig {
  scriptText: string;
  subtitle: string;
  mainTitle: string;
  steps: Step[];
}

export const howItWorksConfig: HowItWorksConfig = {
  scriptText: "How It Works",
  subtitle: "SIMPLE PROCESS",
  mainTitle: "Start Learning in 3 Easy Steps",
  steps: [
    {
      number: "01",
      title: "Register for Free Trial",
      description: "Fill out the registration form and schedule your 3 free trial classes. No credit card required!",
    },
    {
      number: "02",
      title: "Meet Your Teacher",
      description: "Get matched with a qualified tutor based on your goals, schedule, and learning preferences.",
    },
    {
      number: "03",
      title: "Start Your Journey",
      description: "Begin your Quran learning journey with personalized one-on-one classes at your convenience.",
    },
  ],
};

// -----------------------------------------------------------------------------
// Carousel Config (How We Teach)
// -----------------------------------------------------------------------------
export interface CarouselSlide {
  image: string;
  title: string;
  subtitle: string;
  stat: string;
  statLabel: string;
  description: string;
}

export interface CarouselConfig {
  scriptText: string;
  subtitle: string;
  mainTitle: string;
  slides: CarouselSlide[];
}

export const carouselConfig: CarouselConfig = {
  scriptText: "Our Approach",
  subtitle: "MODERN LEARNING MEETS TRADITION",
  mainTitle: "How We Teach",
  slides: [
    {
      image: "/images/slider01.jpg",
      title: "Interactive Learning",
      subtitle: "Engaging Online Platform",
      stat: "One-on-One",
      statLabel: "Personal Sessions",
      description: "Our state-of-the-art virtual classroom provides an immersive learning experience with screen sharing, digital whiteboards, and interactive Quran tools.",
    },
    {
      image: "/images/slider02.jpg",
      title: "Learn From Home",
      subtitle: "Comfort & Convenience",
      stat: "24/7",
      statLabel: "Flexible Hours",
      description: "No commuting required. Learn the Quran from the comfort of your home at times that suit your family's busy schedule.",
    },
    {
      image: "/images/slider03.jpg",
      title: "Global Community",
      subtitle: "Students Worldwide",
      stat: "500+",
      statLabel: "Happy Students",
      description: "Join a diverse community of learners from across the globe. Connect with fellow students and build lasting friendships.",
    },
  ],
};

// -----------------------------------------------------------------------------
// Pricing Config
// -----------------------------------------------------------------------------
export interface PricingPlan {
  id: string;
  name: string;
  description: string;
  price: string;
  period: string;
  popular: boolean;
  features: string[];
  ctaText: string;
}

export interface PricingConfig {
  scriptText: string;
  subtitle: string;
  mainTitle: string;
  description: string;
  plans: PricingPlan[];
  note: string;
  familyDiscount: string;
}

export const pricingConfig: PricingConfig = {
  scriptText: "Pricing Plans",
  subtitle: "AFFORDABLE LEARNING",
  mainTitle: "Choose Your Plan",
  description: "We offer flexible pricing plans to suit every budget. All plans include one-on-one classes with certified tutors.",
  plans: [
    {
      id: "starter",
      name: "Starter",
      description: "Perfect for beginners",
      price: "$35",
      period: "/month",
      popular: false,
      features: [
        "12 classes per month",
        "30 minutes per class",
        "3 classes per week",
        "One-on-one sessions",
        "Free trial classes",
        "Progress reports",
        "Email support",
      ],
      ctaText: "Get Started",
    },
    {
      id: "standard",
      name: "Standard",
      description: "Most popular choice",
      price: "$50",
      period: "/month",
      popular: true,
      features: [
        "20 classes per month",
        "30 minutes per class",
        "5 classes per week",
        "One-on-one sessions",
        "3 free trial classes",
        "Monthly progress reports",
        "24/7 WhatsApp support",
        "Recorded sessions",
        "Certificate included",
      ],
      ctaText: "Get Started",
    },
    {
      id: "premium",
      name: "Premium",
      description: "Intensive learning",
      price: "$75",
      period: "/month",
      popular: false,
      features: [
        "20 classes per month",
        "45 minutes per class",
        "5 classes per week",
        "One-on-one sessions",
        "3 free trial classes",
        "Weekly progress reports",
        "24/7 priority support",
        "Recorded sessions",
        "Certificate included",
        "Customized curriculum",
      ],
      ctaText: "Get Started",
    },
  ],
  note: "All prices are in USD. We accept payments via PayPal, Credit Card, and Bank Transfer.",
  familyDiscount: "Family Discount: 10% off for 2nd child, 15% off for 3rd child!",
};

// -----------------------------------------------------------------------------
// Museum Config (Why Choose Us - Detailed)
// -----------------------------------------------------------------------------
export interface TimelineEvent {
  year: string;
  event: string;
}

export interface MuseumTabContent {
  title: string;
  description: string;
  highlight: string;
}

export interface MuseumTab {
  id: string;
  name: string;
  icon: string;
  image: string;
  content: MuseumTabContent;
}

export interface MuseumQuote {
  prefix: string;
  text: string;
  attribution: string;
}

export interface MuseumConfig {
  scriptText: string;
  subtitle: string;
  mainTitle: string;
  introText: string;
  timeline: TimelineEvent[];
  tabs: MuseumTab[];
  openingHours: string;
  openingHoursLabel: string;
  ctaButtonText: string;
  yearBadge: string;
  yearBadgeLabel: string;
  quote: MuseumQuote;
  founderPhotoAlt: string;
  founderPhoto: string;
}

export const museumConfig: MuseumConfig = {
  scriptText: "Our Methodology",
  subtitle: "TRUSTED TEACHING APPROACH",
  mainTitle: "Excellence in Education",
  introText: "We combine traditional Islamic teaching methods with modern technology to provide the best online Quran learning experience for students of all ages.",
  timeline: [
    { year: "2015", event: "Academy Founded" },
    { year: "2017", event: "500+ Students" },
    { year: "2019", event: "Global Reach" },
    { year: "2023", event: "Award Winning" },
  ],
  tabs: [
    {
      id: "evaluation",
      name: "Evaluation",
      icon: "Award",
      image: "/images/teacher-male.jpg",
      content: {
        title: "Regular Progress Tracking",
        description: "We conduct weekly and monthly assessments to ensure students are progressing. Detailed reports are shared with parents to keep them informed about their child's improvement.",
        highlight: "Monthly Progress Reports",
      },
    },
    {
      id: "teachers",
      name: "Teachers",
      icon: "BookOpen",
      image: "/images/teacher-female.jpg",
      content: {
        title: "Qualified Tutors",
        description: "Our teachers are certified Hafiz and Qaris with years of teaching experience. They undergo regular training to maintain our high standards of Quranic education.",
        highlight: "Al-Azhar Certified",
      },
    },
    {
      id: "materials",
      name: "Resources",
      icon: "History",
      image: "/images/story-image.jpg",
      content: {
        title: "Learning Materials",
        description: "Students get access to our student portal with lesson recordings, practice materials, and supplementary resources to support their learning journey.",
        highlight: "24/7 Portal Access",
      },
    },
  ],
  openingHours: "24/7 Online Access",
  openingHoursLabel: "Student Portal",
  ctaButtonText: "Learn More",
  yearBadge: "9+",
  yearBadgeLabel: "Years",
  quote: {
    prefix: "Our Promise",
    text: "We are committed to providing quality Quran education that nurtures both the mind and soul of every student.",
    attribution: "Quran Academy Team",
  },
  founderPhotoAlt: "Quran Academy Learning Journey",
  founderPhoto: "/images/story-image.jpg",
};

// -----------------------------------------------------------------------------
// News Config (Blog & Testimonials)
// -----------------------------------------------------------------------------
export interface NewsArticle {
  id: number;
  image: string;
  title: string;
  excerpt: string;
  date: string;
  category: string;
}

export interface Testimonial {
  name: string;
  role: string;
  text: string;
  rating: number;
}

export interface StoryQuote {
  prefix: string;
  text: string;
  attribution: string;
}

export interface StoryTimelineItem {
  value: string;
  label: string;
}

export interface NewsConfig {
  scriptText: string;
  subtitle: string;
  mainTitle: string;
  viewAllText: string;
  readMoreText: string;
  articles: NewsArticle[];
  testimonialsScriptText: string;
  testimonialsSubtitle: string;
  testimonialsMainTitle: string;
  testimonials: Testimonial[];
  storyScriptText: string;
  storySubtitle: string;
  storyTitle: string;
  storyParagraphs: string[];
  storyTimeline: StoryTimelineItem[];
  storyQuote: StoryQuote;
  storyImage: string;
  storyImageCaption: string;
}

export const newsConfig: NewsConfig = {
  scriptText: "Latest Updates",
  subtitle: "NEWS & ARTICLES",
  mainTitle: "From Our Blog",
  viewAllText: "View All Articles",
  readMoreText: "Read More",
  articles: [
    {
      id: 1,
      image: "/images/blog01.jpg",
      title: "Benefits of Online Quran Learning for Kids",
      excerpt: "Discover how online Quran classes can help your children develop a strong connection with the Quran from an early age in a fun and engaging way.",
      date: "February 20, 2026",
      category: "Education",
    },
    {
      id: 2,
      image: "/images/blog02.jpg",
      title: "Tips for Parents: Supporting Your Child's Quran Journey",
      excerpt: "Learn how parents can create a supportive environment at home to enhance their child's Quran learning experience and spiritual growth.",
      date: "February 15, 2026",
      category: "Parenting",
    },
    {
      id: 3,
      image: "/images/blog03.jpg",
      title: "How to Choose the Right Online Quran Tutor",
      excerpt: "Key factors to consider when selecting a Quran teacher for yourself or your children to ensure the best learning experience.",
      date: "February 10, 2026",
      category: "Guidance",
    },
    {
      id: 4,
      image: "/images/blog04.jpg",
      title: "The Importance of Tajweed in Quran Recitation",
      excerpt: "Understanding why proper pronunciation and recitation rules are essential for every Muslim who reads the Holy Quran.",
      date: "February 5, 2026",
      category: "Learning",
    },
  ],
  testimonialsScriptText: "Testimonials",
  testimonialsSubtitle: "WHAT PARENTS SAY",
  testimonialsMainTitle: "Happy Families",
  testimonials: [
    {
      name: "Mohammed Ali",
      role: "London, UK",
      text: "I have found Quran Academy to be incredibly accommodating with scheduling. The course is well-designed, and the knowledgeable teacher has made all the difference in my learning experience. I highly recommend them!",
      rating: 5,
    },
    {
      name: "Nuryn Rahman",
      role: "Manchester, UK",
      text: "My 7-year-old daughter has established a solid foundation in Quran reading thanks to her friendly and professional tutor. The progress she's made in just 3 months is truly remarkable. JazakAllah Khair!",
      rating: 5,
    },
    {
      name: "Amelia Ahmed",
      role: "Birmingham, UK",
      text: "Both of my children have made amazing progress. In just 8 months, one son has completed the Quran while my daughter reached the 18th Parah. Living in an area with no nearby mosque, this is a true blessing!",
      rating: 5,
    },
  ],
  storyScriptText: "Our Journey",
  storySubtitle: "OUR STORY",
  storyTitle: "A Decade of Excellence",
  storyParagraphs: [
    "Founded in 2015, Quran Academy began with a simple mission: to make quality Quran education accessible to Muslims worldwide. What started as a small local initiative has grown into a global academy serving students across 30+ countries.",
    "Our commitment to excellence, personalized attention, and flexible learning has made us one of the most trusted online Quran academies. We continue to innovate and improve our methods while staying true to traditional Islamic teaching principles.",
  ],
  storyTimeline: [
    { value: "50+", label: "Expert Tutors" },
    { value: "500+", label: "Students" },
    { value: "30+", label: "Countries" },
    { value: "9+", label: "Years" },
  ],
  storyQuote: {
    prefix: "Our Vision",
    text: "To make Quran education accessible to every Muslim home, nurturing a generation that lives by the Quran.",
    attribution: "Quran Academy Mission",
  },
  storyImage: "/images/slider01.jpg",
  storyImageCaption: "Our Learning Community",
};

// -----------------------------------------------------------------------------
// Qibla Finder Config
// -----------------------------------------------------------------------------
export interface QiblaFinderConfig {
  scriptText: string;
  subtitle: string;
  mainTitle: string;
  description: string;
  kaabaCoords: { lat: number; lng: number };
  instructions: string[];
}

export const qiblaFinderConfig: QiblaFinderConfig = {
  scriptText: "Qibla Direction",
  subtitle: "FIND YOUR PRAYER DIRECTION",
  mainTitle: "Qibla Finder",
  description: "Open the live camera and get an on-screen Qibla direction overlay based on your current location and device heading.",
  kaabaCoords: { lat: 21.4224779, lng: 39.8251832 },
  instructions: [
    "Tap Start Camera Qibla View and allow location, camera, and motion permissions",
    "Hold your phone upright and slowly rotate until the arrow points straight ahead",
    "When aligned, the direction in front of you is Qibla",
    "Use the live heading and bearing details for extra accuracy",
  ],
};
// -----------------------------------------------------------------------------  instructions: string[];
}

export const qiblaFinderConfig: QiblaFinderConfig = {
  scriptText: "Qibla Direction",
  subtitle: "FIND YOUR PRAYER DIRECTION",
  mainTitle: "Qibla Finder",
  description: "Open the live camera and get an on-screen Qibla direction overlay based on your current location and device heading.",
  kaabaCoords: { lat: 21.4224779, lng: 39.8251832 },
  instructions: [
    "Tap Start Camera Qibla View and allow location, camera, and motion permissions",
    "Hold your phone upright and slowly rotate until the arrow points straight ahead",
    "When aligned, the direction in front of you is Qibla",
    "Use the live heading and bearing details for extra accuracy",
  ],
};
// -----------------------------------------------------------------------------  instructions: string[];
}

export const qiblaFinderConfig: QiblaFinderConfig = {
  scriptText: "Qibla Direction",
  subtitle: "FIND YOUR PRAYER DIRECTION",
  mainTitle: "Qibla Finder",
  description: "Use our Qibla finder to determine the exact direction of the Kaaba from your current location. Simply allow location access or enter your coordinates manually.",
  kaabaCoords: { lat: 21.4224779, lng: 39.8251832 },
  instructions: [
    "Allow location access or enter your city name",
    "The compass will show the Qibla direction",
    "Turn to face the direction indicated by the arrow",
    "The angle shown is measured from True North clockwise",
  ],
};

// -----------------------------------------------------------------------------
// Quran Player Config
// -----------------------------------------------------------------------------
export interface Reciter {
  id: string;
  name: string;
  language: string;
}

export interface QuranPlayerConfig {
  scriptText: string;
  subtitle: string;
  mainTitle: string;
  description: string;
  reciters: Reciter[];
  translations: string[];
  apiBaseUrl: string;
}

export const quranPlayerConfig: QuranPlayerConfig = {
  scriptText: "Listen to Quran",
  subtitle: "QURAN AUDIO WITH TRANSLATION",
  mainTitle: "Quran Player",
  description: "Listen to the Holy Quran with beautiful recitations and translations in multiple languages. Select a Surah and reciter to begin.",
  reciters: [
    { id: "ar.alafasy", name: "Mishary Rashid Al-Afasy", language: "Arabic" },
    { id: "ar.abdurrahmaansudais", name: "Abdul Rahman Al-Sudais", language: "Arabic" },
    { id: "ar.shaatree", name: "Abu Bakr Al-Shatri", language: "Arabic" },
    { id: "ar.husary", name: "Mahmoud Khalil Al-Husary", language: "Arabic" },
    { id: "ar.minshawi", name: "Mohamed Siddiq El-Minshawi", language: "Arabic" },
  ],
  translations: ["en.sahih", "ur.jalandhry", "fr.hamidullah", "es.cortes"],
  apiBaseUrl: "https://api.alquran.cloud/v1",
};

// -----------------------------------------------------------------------------
// Contact Form Config
// -----------------------------------------------------------------------------
export interface ContactInfoItem {
  icon: string;
  label: string;
  value: string;
  subtext: string;
}

export interface ContactFormFields {
  nameLabel: string;
  namePlaceholder: string;
  emailLabel: string;
  emailPlaceholder: string;
  phoneLabel: string;
  phonePlaceholder: string;
  courseLabel: string;
  courseOptions: string[];
  ageGroupLabel: string;
  ageGroupOptions: string[];
  messageLabel: string;
  messagePlaceholder: string;
  submitText: string;
  submittingText: string;
  successMessage: string;
  errorMessage: string;
}

export interface ContactFormConfig {
  scriptText: string;
  subtitle: string;
  mainTitle: string;
  introText: string;
  contactInfoTitle: string;
  contactInfo: ContactInfoItem[];
  form: ContactFormFields;
  privacyNotice: string;
  formEndpoint: string;
  emailTo: string;
}

export const contactFormConfig: ContactFormConfig = {
  scriptText: "Get Started",
  subtitle: "CONTACT US",
  mainTitle: "Start Your Free Trial",
  introText: "Register today and take your first 3 free trial classes. No commitment required. Experience our teaching methodology firsthand and see the difference!",
  contactInfoTitle: "Get in Touch",
  contactInfo: [
    {
      icon: "Phone",
      label: "WhatsApp",
      value: "+39 375 617 3106",
      subtext: "Available 24/7",
    },
    {
      icon: "Mail",
      label: "Email",
      value: "touqeermalik6677@gmail.com",
      subtext: "We reply within 24 hours",
    },
    {
      icon: "Clock",
      label: "Class Hours",
      value: "Flexible Scheduling",
      subtext: "Choose your preferred time",
    },
    {
      icon: "MapPin",
      label: "Location",
      value: "Online Worldwide",
      subtext: "Learn from anywhere",
    },
  ],
  form: {
    nameLabel: "Your Name",
    namePlaceholder: "Enter your full name",
    emailLabel: "Email Address",
    emailPlaceholder: "your@email.com",
    phoneLabel: "Phone / WhatsApp",
    phonePlaceholder: "+XXX XXX XXX XXXX",
    courseLabel: "Select Course",
    courseOptions: [
      "Quran for Kids",
      "Quran Reading",
      "Quran Memorization",
      "Tajweed Rules",
      "Islamic Studies",
      "Ladies Classes",
      "Arabic Language",
    ],
    ageGroupLabel: "Student Age Group",
    ageGroupOptions: ["Child (5-12)", "Teen (13-17)", "Adult (18+)"],
    messageLabel: "Message (Optional)",
    messagePlaceholder: "Tell us about your Quran learning goals or any questions...",
    submitText: "Schedule Free Trial",
    submittingText: "Sending...",
    successMessage: "Thank you! We'll contact you within 24 hours to schedule your free trial classes.",
    errorMessage: "Something went wrong. Please try again or contact us directly via WhatsApp.",
  },
  privacyNotice: "By submitting this form, you agree to our privacy policy. Your information is secure and will never be shared with third parties.",
  formEndpoint: "https://formspree.io/f/xnqevjgw",
  emailTo: "touqeermalik6677@gmail.com",
};

// -----------------------------------------------------------------------------
// Footer Config
// -----------------------------------------------------------------------------
export interface FooterSocialLink {
  icon: string;
  label: string;
  href: string;
}

export interface FooterLink {
  name: string;
  href: string;
}

export interface FooterLinkGroup {
  title: string;
  links: FooterLink[];
}

export interface FooterContactItem {
  icon: string;
  text: string;
}

export interface FooterConfig {
  brandName: string;
  tagline: string;
  description: string;
  logo: string;
  socialLinks: FooterSocialLink[];
  linkGroups: FooterLinkGroup[];
  contactItems: FooterContactItem[];
  newsletterLabel: string;
  newsletterPlaceholder: string;
  newsletterButtonText: string;
  newsletterSuccessText: string;
  newsletterErrorText: string;
  newsletterEndpoint: string;
  copyrightText: string;
  legalLinks: string[];
  icpText: string;
  backToTopText: string;
  ageVerificationText: string;
}

export const footerConfig: FooterConfig = {
  brandName: "Quran Academy",
  tagline: "Learn Quran Online",
  description: "Providing quality online Quran education to Muslims worldwide since 2015. One-to-one classes with expert Al-Azhar certified tutors.",
  logo: "/images/logo.png",
  socialLinks: [
    { icon: "Facebook", label: "Facebook", href: "https://facebook.com/quranacademy" },
    { icon: "Instagram", label: "Instagram", href: "https://instagram.com/quranacademy" },
    { icon: "Twitter", label: "Twitter", href: "https://twitter.com/quranacademy" },
    { icon: "Youtube", label: "YouTube", href: "https://youtube.com/quranacademy" },
  ],
  linkGroups: [
    {
      title: "Quick Links",
      links: [
        { name: "Home", href: "#home" },
        { name: "About Us", href: "#about" },
        { name: "Courses", href: "#courses" },
        { name: "Pricing", href: "#pricing" },
        { name: "Tools", href: "#tools" },
        { name: "Blog", href: "#blog" },
        { name: "Contact", href: "#contact" },
      ],
    },
    {
      title: "Our Courses",
      links: [
        { name: "Quran for Kids", href: "#courses" },
        { name: "Quran Reading", href: "#courses" },
        { name: "Quran Memorization", href: "#courses" },
        { name: "Tajweed Rules", href: "#courses" },
        { name: "Islamic Studies", href: "#courses" },
        { name: "Ladies Classes", href: "#courses" },
      ],
    },
  ],
  contactItems: [
    { icon: "Phone", text: "+39 375 617 3106" },
    { icon: "Mail", text: "touqeermalik6677@gmail.com" },
    { icon: "MapPin", text: "Online - Worldwide" },
  ],
  newsletterLabel: "Subscribe to our newsletter for Islamic tips and updates",
  newsletterPlaceholder: "Your email address",
  newsletterButtonText: "Subscribe",
  newsletterSuccessText: "Thank you for subscribing!",
  newsletterErrorText: "Please try again.",
  newsletterEndpoint: "https://formspree.io/f/YOUR_NEWSLETTER_ID",
  copyrightText: "Â© 2026 Quran Academy. All Rights Reserved.",
  legalLinks: ["Privacy Policy", "Terms of Service", "Refund Policy"],
  icpText: "",
  backToTopText: "Back to Top",
  ageVerificationText: "",
};

// -----------------------------------------------------------------------------
// Scroll To Top Config
// -----------------------------------------------------------------------------
export interface ScrollToTopConfig {
  ariaLabel: string;
}

export const scrollToTopConfig: ScrollToTopConfig = {
  ariaLabel: "Back to top",
};



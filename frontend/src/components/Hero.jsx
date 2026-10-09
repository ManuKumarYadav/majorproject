import React, { useState, useEffect } from 'react';
import heroImg1 from '../assets/hero1.jpg';
import heroImg2 from '../assets/hero2.jpg';
import heroImg3 from '../assets/hero3.jpg';
import heroImg4 from '../assets/hero4.jpg';
import heroImg5 from '../assets/hero5.jpg';
import { ChevronLeft, ChevronRight, Check, Copy } from 'lucide-react';

const HERO_SLIDES = [
  {
    image: heroImg1,
    title: "Handcrafted Luxury Villas",
    subtitle: "STAYAIRA SIGNATURE POOL ESTATES",
    badge: "🏷️ CODE: STAYAIRA50 · FLAT 50% OFF 2ND NIGHT",
    hasCoupon: true,
    location: "Goa · Lonavala · Alibaug"
  },
  {
    image: heroImg2,
    title: "Bespoke Oceanfront Escapes",
    subtitle: "BEACHFRONT HAVENS & PRIVATE CHEFS",
    badge: "✨ ALL-INCLUSIVE RETREATS · 24x7 CONCIERGE",
    hasCoupon: false,
    location: "Alibaug · Candolim · Anjuna"
  },
  {
    image: heroImg3,
    title: "Private Mountain Sanctuaries",
    subtitle: "HILLSIDE CHALETS & MISTY RETREATS",
    badge: "🏔️ PANORAMIC VALLEY VIEWS · HEATED POOLS",
    hasCoupon: false,
    location: "Shimla · Manali · Kasauli"
  },
  {
    image: heroImg4,
    title: "Sun-Drenched Heritage Palaces",
    subtitle: "ROYAL COURTYARDS & EXQUISITE CUISINE",
    badge: "👑 EXPERIENCE TIMELESS REGAL LIVING",
    hasCoupon: false,
    location: "Udaipur · Jaipur · Jodhpur"
  },
  {
    image: heroImg5,
    title: "Wilderness Jungle Retreats",
    subtitle: "ECO-LUXURY TREETOP VILLAS",
    badge: "🌿 IMMERSE IN NATURE · INFINITY POOL",
    hasCoupon: false,
    location: "Coorg · Wayanad · Kabini"
  }
];


export default function Hero() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [copiedCoupon, setCopiedCoupon] = useState(false);

  // Preload all 5 Ultra-HD images for instantaneous zero-lag transitions
  useEffect(() => {
    HERO_SLIDES.forEach(slide => {
      const img = new Image();
      img.src = slide.image;
    });
  }, []);

  // Automatic slideshow rotating every 5 seconds (5000ms) with clean reset on interaction
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide(prev => (prev + 1) % HERO_SLIDES.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [currentSlide]);

  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);
  const minSwipeDistance = 45;

  const onTouchStart = (e) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    if (distance > minSwipeDistance) {
      // Swiped Left -> Next slide
      setCurrentSlide(prev => (prev + 1) % HERO_SLIDES.length);
    } else if (distance < -minSwipeDistance) {
      // Swiped Right -> Prev slide
      setCurrentSlide(prev => (prev - 1 + HERO_SLIDES.length) % HERO_SLIDES.length);
    }
  };

  const handleCopyCoupon = (e) => {
    e.stopPropagation();
    navigator.clipboard.writeText('STAYAIRA50');
    setCopiedCoupon(true);
    setTimeout(() => setCopiedCoupon(false), 2200);
  };

  const prevSlide = (e) => {
    if (e) e.stopPropagation();
    setCurrentSlide(prev => (prev - 1 + HERO_SLIDES.length) % HERO_SLIDES.length);
  };

  const nextSlide = (e) => {
    if (e) e.stopPropagation();
    setCurrentSlide(prev => (prev + 1) % HERO_SLIDES.length);
  };

  const activeSlide = HERO_SLIDES[currentSlide];

  return (
    <div className="hero-section">
      {/* Hero Banner Slideshow (Full View, Ultra-HD, 5s Animation, Touch-Swipeable) */}
      <div 
        className="hero-image-container"
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
      >
        {HERO_SLIDES.map((slide, idx) => (
          <div
            key={idx}
            className={`hero-slide-item ${idx === currentSlide ? 'active' : ''}`}
            aria-hidden={idx !== currentSlide}
          >
            <img 
              src={slide.image} 
              alt={slide.title} 
              className="hero-image"
              loading={idx === 0 ? "eager" : "lazy"}
            />
          </div>
        ))}

        {/* Crystal-Clear Subtle Luxury Vignette Overlay */}
        <div className="hero-overlay"></div>
        
        {/* Navigation Arrows */}
        <button 
          type="button" 
          className="hero-nav-arrow hero-nav-prev" 
          onClick={prevSlide}
          aria-label="Previous slide"
        >
          <ChevronLeft size={24} />
        </button>
        <button 
          type="button" 
          className="hero-nav-arrow hero-nav-next" 
          onClick={nextSlide}
          aria-label="Next slide"
        >
          <ChevronRight size={24} />
        </button>

        {/* Dynamic Hero Content with Animated Entrance */}
        <div className="hero-content" key={currentSlide}>
          <p className="hero-subtitle">{activeSlide.subtitle}</p>
          <h1 className="hero-title">{activeSlide.title}</h1>
          <div 
            className={`hero-badge ${activeSlide.hasCoupon ? 'hero-coupon-clickable' : ''}`}
            onClick={activeSlide.hasCoupon ? handleCopyCoupon : undefined}
            title={activeSlide.hasCoupon ? "Click to copy promo code STAYAIRA50" : undefined}
          >
            <span>{activeSlide.badge}</span>
            {activeSlide.hasCoupon && (
              <span className="hero-badge-copy-tag">
                {copiedCoupon ? (
                  <>
                    <Check size={12} color="#10B981" /> COPIED!
                  </>
                ) : (
                  <>
                    <Copy size={12} /> TAP TO COPY
                  </>
                )}
              </span>
            )}
          </div>
        </div>

        {/* Slideshow Progress / Indicator Dots */}
        <div className="hero-indicators">
          {HERO_SLIDES.map((_, idx) => (
            <button
              key={idx}
              type="button"
              className={`hero-indicator-dot ${idx === currentSlide ? 'active' : ''}`}
              onClick={() => setCurrentSlide(idx)}
              aria-label={`Go to slide ${idx + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

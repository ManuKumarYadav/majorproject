import React, { useRef, useState } from 'react';
import { ChevronLeft, ChevronRight, MapPin } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const destinations = [
  {
    name: 'Goa',
    tagline: 'Sun, Sea & Luxury',
    image: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=800&q=80',
    tag: 'Trending 🔥',
    villas: 48,
  },
  {
    name: 'Lonavala',
    tagline: 'Misty Hills & Waterfalls',
    image: 'https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=800&q=80',
    tag: 'Popular',
    villas: 32,
  },
  {
    name: 'Alibaug',
    tagline: 'Seaside Serenity',
    image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80',
    tag: 'Weekend Getaway',
    villas: 24,
  },
  {
    name: 'Manali',
    tagline: 'Snow-capped Peaks',
    image: 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&w=800&q=80',
    tag: 'Top Rated ⭐',
    villas: 19,
  },
  {
    name: 'Shimla',
    tagline: 'Colonial Charm & Pines',
    image: 'https://images.unsplash.com/photo-1597074866923-dc0589150358?auto=format&fit=crop&w=800&q=80',
    tag: 'Heritage',
    villas: 15,
  },
  {
    name: 'Coorg',
    tagline: 'Coffee & Wilderness',
    image: 'https://images.unsplash.com/photo-1596401057633-54a8fe8ef647?auto=format&fit=crop&w=800&q=80',
    tag: 'Hidden Gem 💎',
    villas: 21,
  },
  {
    name: 'Udaipur',
    tagline: 'City of Lakes & Palaces',
    image: 'https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=800&q=80',
    tag: 'Royal',
    villas: 17,
  },
  {
    name: 'Mussoorie',
    tagline: 'Queen of Hills',
    image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80',
    tag: 'Romantic',
    villas: 12,
  },
  {
    name: 'Karjat',
    tagline: 'Riverside Green Retreats',
    image: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=800&q=80',
    tag: 'Adventure',
    villas: 14,
  },
  {
    name: 'Ooty',
    tagline: 'Nilgiris Tea Gardens',
    image: 'https://images.unsplash.com/photo-1534430480872-3498386e7856?auto=format&fit=crop&w=800&q=80',
    tag: 'Nature 🌿',
    villas: 11,
  },
  {
    name: 'Kasauli',
    tagline: 'Pine Forest Escapes',
    image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=800&q=80',
    tag: 'Peaceful',
    villas: 8,
  },
  {
    name: 'Nainital',
    tagline: 'Scenic Lake District',
    image: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=800&q=80',
    tag: 'Family Favorite',
    villas: 10,
  },
];

export default function Destinations() {
  const navigate = useNavigate();
  const scrollRef = useRef(null);
  const [hoveredIdx, setHoveredIdx] = useState(null);

  const scroll = (dir) => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: dir * 340, behavior: 'smooth' });
    }
  };

  const handleDestClick = (name) => {
    navigate(`/?search=${encodeURIComponent(name)}`);
  };

  return (
    <section className="dest-section">
      <div className="stayaira-container">

        {/* Header */}
        <div className="dest-header">
          <div>
            <h2 className="dest-title">Pick a Destination</h2>
            <p className="dest-subtitle">India's most coveted luxury retreats, curated for you</p>
          </div>
          <div className="dest-nav-btns">
            <button className="dest-nav-btn" onClick={() => scroll(-1)} aria-label="Previous">
              <ChevronLeft size={20} />
            </button>
            <button className="dest-nav-btn" onClick={() => scroll(1)} aria-label="Next">
              <ChevronRight size={20} />
            </button>
          </div>
        </div>

        {/* Scrollable Cards */}
        <div className="dest-scroll-row" ref={scrollRef}>
          {destinations.map((dest, i) => (
            <button
              key={dest.name}
              className={`dest-card ${hoveredIdx === i ? 'dest-card--hovered' : ''}`}
              onClick={() => handleDestClick(dest.name)}
              onMouseEnter={() => setHoveredIdx(i)}
              onMouseLeave={() => setHoveredIdx(null)}
              aria-label={`Explore ${dest.name}`}
            >
              {/* Photo */}
              <div className="dest-card-img-wrap">
                <img
                  src={dest.image}
                  alt={dest.name}
                  className="dest-card-img"
                  loading="lazy"
                />
                {/* Tag pill */}
                <span className="dest-tag-pill">{dest.tag}</span>
                {/* Dark gradient overlay */}
                <div className="dest-card-overlay" />
              </div>

              {/* Info */}
              <div className="dest-card-info">
                <div className="dest-card-name-row">
                  <span className="dest-card-name">{dest.name}</span>
                  <span className="dest-card-villas">{dest.villas} villas</span>
                </div>
                <div className="dest-card-tagline">
                  <MapPin size={12} style={{ flexShrink: 0 }} />
                  {dest.tagline}
                </div>
              </div>
            </button>
          ))}
        </div>

      </div>
    </section>
  );
}

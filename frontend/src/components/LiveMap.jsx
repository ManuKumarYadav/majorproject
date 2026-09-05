import React, { useState, useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import { Link } from 'react-router-dom';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Navigation, Layers, Compass, MapPin, ExternalLink, Star, X, List, ChevronRight } from 'lucide-react';

// Common city coordinates dictionary for instant 0ms fallback
const CITY_COORDINATES = {
  'goa': [15.2993, 74.1240],
  'north goa': [15.5898, 73.7433],
  'south goa': [15.2000, 73.9667],
  'candolim': [15.5178, 73.7667],
  'anjuna': [15.5873, 73.7424],
  'calangute': [15.5439, 73.7554],
  'baga': [15.5524, 73.7517],
  'lonavala': [18.7557, 73.4091],
  'alibaug': [18.6414, 72.8722],
  'karjat': [18.9100, 73.3233],
  'mahabaleshwar': [17.9237, 73.6586],
  'panchgani': [17.9244, 73.8009],
  'manali': [32.2432, 77.1892],
  'shimla': [31.1048, 77.1734],
  'kasauli': [30.9013, 76.9649],
  'mussoorie': [30.4598, 78.0644],
  'nainital': [29.3919, 79.4542],
  'rishikesh': [30.0869, 78.2676],
  'dharamshala': [32.2190, 76.3234],
  'udaipur': [24.5854, 73.7125],
  'jaipur': [26.9124, 75.7873],
  'jodhpur': [26.2389, 73.0243],
  'pushkar': [26.4897, 74.5511],
  'ooty': [11.4102, 76.6950],
  'coorg': [12.3375, 75.8069],
  'wayanad': [11.6854, 76.1320],
  'munnar': [10.0889, 77.0595],
  'chikmagalur': [13.3161, 75.7720],
  'kabini': [11.9538, 76.2941],
  'mumbai': [19.0760, 72.8777],
  'delhi': [28.6139, 77.2090],
  'bangalore': [12.9716, 77.5946],
  'patna': [25.5941, 85.1376],
  'motihari': [26.6469, 84.9189],
  'bihar': [25.0961, 85.3131],
  'maldives': [3.2028, 73.2207],
  'bali': [-8.4095, 115.1889],
  'dubai': [25.2048, 55.2708],
  'united arab emirates': [25.2048, 55.2708],
  'tokyo': [35.6762, 139.6503],
  'japan': [36.2048, 138.2529],
  'costa rica': [9.7489, -83.7534],
  'san jose': [9.9281, -84.0907],
};

// Helper function to resolve coordinates for a listing
export const resolveCoordinates = (item) => {
  if (item?.coordinates && item.coordinates.lat && item.coordinates.lng) {
    return [Number(item.coordinates.lat), Number(item.coordinates.lng)];
  }
  const locLower = `${item?.location || ''} ${item?.country || ''} ${item?.title || ''}`.toLowerCase();
  const matched = Object.keys(CITY_COORDINATES).find(city => locLower.includes(city));
  if (matched) {
    // Add small deterministic jitter so overlapping pins in same city don't completely cover each other
    const hash = (item?._id || item?.title || '').split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const jitterLat = ((hash % 20) - 10) * 0.004;
    const jitterLng = (((hash * 7) % 20) - 10) * 0.004;
    const base = CITY_COORDINATES[matched];
    return [base[0] + jitterLat, base[1] + jitterLng];
  }
  return [15.2993, 74.1240]; // Default Goa
};

// Create branded custom map pin icon
const createCustomIcon = (price, isSelected = false) => {
  const priceText = price ? `₹${Number(price).toLocaleString('en-IN')}` : 'StayAira';
  return L.divIcon({
    className: 'custom-leaflet-pin',
    html: `
      <div class="stayaira-map-marker ${isSelected ? 'marker-selected' : ''}">
        <div class="marker-pulse"></div>
        <div class="marker-badge" style="${isSelected ? 'background: #E11D48; transform: scale(1.15); box-shadow: 0 8px 24px rgba(225,29,72,0.6);' : ''}">
          <span class="marker-dot"></span>
          <span class="marker-price">${priceText}</span>
        </div>
      </div>
    `,
    iconSize: [84, 40],
    iconAnchor: [42, 20],
    popupAnchor: [0, -22]
  });
};

// Map controller to guarantee resize invalidation and view synchronization
function MapController({ center, zoom, bounds, targetCoords }) {
  const map = useMap();
  useEffect(() => {
    const timer = setTimeout(() => {
      try {
        map.invalidateSize();
        if (targetCoords && targetCoords[0] && targetCoords[1]) {
          map.flyTo(targetCoords, 14, { duration: 1.2 });
        } else if (bounds && bounds.isValid && bounds.isValid()) {
          map.fitBounds(bounds, { padding: [50, 50], maxZoom: 12 });
        } else if (center && center[0] && center[1]) {
          map.setView(center, zoom);
        }
      } catch (err) {
        console.warn('Map controller notice:', err);
      }
    }, 150);

    const onResize = () => {
      try { map.invalidateSize(); } catch { }
    };
    window.addEventListener('resize', onResize);

    return () => {
      clearTimeout(timer);
      window.removeEventListener('resize', onResize);
    };
  }, [center, zoom, bounds, targetCoords, map]);

  return null;
}

const TILE_LAYERS = [
  {
    name: 'OpenStreetMap (Clean Global)',
    url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
  },
  {
    name: 'Esri World Street (Luxury Clean)',
    url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}',
    attribution: '&copy; Esri &mdash; National Geographic, DeLorme, NAVTEQ'
  },
  {
    name: 'Esri Satellite (HD Aerial View)',
    url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
    attribution: '&copy; Esri, Maxar, Earthstar Geographics'
  },
  {
    name: 'OpenTopoMap (Topographic Terrain)',
    url: 'https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png',
    attribution: '&copy; OpenTopoMap (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)'
  }
];

export default function LiveMap({
  location = '',
  country = '',
  coordinates = null,
  title = 'Luxury Stay',
  price = 0,
  imageUrl = '',
  listings = null, // When provided, multi-pin mode is activated
  height = '420px',
  isModal = false,
  onClose = null
}) {
  const isMultiMode = Array.isArray(listings) && listings.length > 0;
  const [coords, setCoords] = useState([20.5937, 78.9629]); // Center of India
  const [bounds, setBounds] = useState(null);
  const [selectedLayerIndex, setSelectedLayerIndex] = useState(0);
  const [activeListingId, setActiveListingId] = useState(null);
  const [targetFlyCoords, setTargetFlyCoords] = useState(null);
  const markerRefs = useRef({});

  // Prevent background scroll when modal is active
  useEffect(() => {
    if (isModal) {
      document.body.style.overflow = 'hidden';
      const handleKeyDown = (e) => {
        if (e.key === 'Escape' && onClose) {
          onClose();
        }
      };
      window.addEventListener('keydown', handleKeyDown);
      return () => {
        document.body.style.overflow = '';
        window.removeEventListener('keydown', handleKeyDown);
      };
    }
  }, [isModal, onClose]);

  // Calculate coordinates & bounds
  useEffect(() => {
    if (isMultiMode) {
      const validPoints = [];
      listings.forEach(item => {
        const point = resolveCoordinates(item);
        if (point && point[0] && point[1]) {
          validPoints.push(point);
        }
      });

      if (validPoints.length > 0) {
        const b = L.latLngBounds(validPoints);
        setBounds(b);
        setCoords(validPoints[0]);
      }
      return;
    }

    // Single listing mode
    if (coordinates && coordinates.lat && coordinates.lng) {
      setCoords([Number(coordinates.lat), Number(coordinates.lng)]);
      return;
    }

    const locLower = `${location} ${country}`.toLowerCase();
    const matchedCity = Object.keys(CITY_COORDINATES).find(city => locLower.includes(city));
    if (matchedCity) {
      setCoords(CITY_COORDINATES[matchedCity]);
      return;
    }

    // Geocode fallback
    const searchQuery = `${location}, ${country}`.trim().replace(/^,\s*/, '');
    if (searchQuery) {
      fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchQuery)}&limit=1`)
        .then(res => res.json())
        .then(data => {
          if (data && data.length > 0) {
            setCoords([parseFloat(data[0].lat), parseFloat(data[0].lon)]);
          }
        })
        .catch(err => console.warn('Geocoding notice:', err));
    }
  }, [location, country, coordinates, listings, isMultiMode]);

  const handleSelectListing = (item) => {
    setActiveListingId(item._id);
    const itemCoords = resolveCoordinates(item);
    setTargetFlyCoords(itemCoords);
    // Open popup for this marker if available
    if (markerRefs.current[item._id]) {
      markerRefs.current[item._id].openPopup();
    }
  };

  const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${title} ${location} ${country}`)}`;
  const currentLayer = TILE_LAYERS[selectedLayerIndex];

  const mapContent = (
    <div
      className={`live-map-wrapper ${isModal ? 'live-map-modal-view' : ''}`}
      style={{
        position: isModal ? 'fixed' : 'relative',
        inset: isModal ? 0 : 'auto',
        width: '100%',
        height: isModal ? '100vh' : height,
        borderRadius: isModal ? '0' : '20px',
        overflow: 'hidden',
        border: isModal ? 'none' : '1.5px solid var(--border-color)',
        boxShadow: isModal ? 'none' : 'var(--shadow-sm)',
        zIndex: isModal ? 99999 : 1,
        isolation: isModal ? 'auto' : 'isolate',
        display: 'flex',
        flexDirection: 'column',
        background: 'var(--bg-main, #ffffff)'
      }}
    >
      {/* Modal Top Nav Bar */}
      {isModal && (
        <div style={{
          height: '62px',
          background: 'var(--card-bg, #ffffff)',
          borderBottom: '1px solid var(--border-color)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 1.25rem',
          zIndex: 1001,
          flexShrink: 0
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{
              width: '34px',
              height: '34px',
              borderRadius: '10px',
              background: 'var(--primary-gradient)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#fff'
            }}>
              <Compass size={18} />
            </div>
            <div>
              <span style={{ fontSize: '1.1rem', fontWeight: '900', color: 'var(--primary)' }}>StayAira</span>
              <span style={{ fontSize: '0.85rem', fontWeight: '700', color: 'var(--text-main)', marginLeft: '6px' }}>Live Map</span>
            </div>
            <span style={{
              background: 'rgba(225,29,72,0.08)',
              color: 'var(--primary)',
              fontSize: '0.75rem',
              fontWeight: '700',
              padding: '3px 10px',
              borderRadius: '9999px'
            }}>
              {isMultiMode ? `${listings.length} Luxury Stays` : location}
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            {/* Style switcher */}
            <button
              type="button"
              onClick={() => setSelectedLayerIndex((selectedLayerIndex + 1) % TILE_LAYERS.length)}
              className="btn-outline-stayaira"
              style={{ padding: '0.4rem 0.8rem', fontSize: '0.78rem', display: 'flex', alignItems: 'center', gap: '5px' }}
              title="Change Map Appearance"
            >
              <Layers size={14} color="#E11D48" />
              <span>Map Style</span>
            </button>

            {/* Close / Show List View Button */}
            {onClose && (
              <button
                type="button"
                onClick={onClose}
                className="btn-primary-stayaira"
                style={{
                  padding: '0.45rem 1rem',
                  fontSize: '0.82rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  borderRadius: '9999px'
                }}
              >
                <List size={15} />
                <span>Show List View</span>
                <X size={14} style={{ marginLeft: '2px', opacity: 0.8 }} />
              </button>
            )}
          </div>
        </div>
      )}

      {/* Embedded Controls (non-modal) */}
      {!isModal && (
        <div style={{
          position: 'absolute',
          top: '12px',
          left: '12px',
          right: '12px',
          zIndex: 1000,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          pointerEvents: 'none'
        }}>
          {/* Location Badge */}
          <div style={{
            background: 'rgba(255, 255, 255, 0.96)',
            backdropFilter: 'blur(8px)',
            border: '1px solid var(--border-color)',
            borderRadius: '9999px',
            padding: '6px 14px',
            fontSize: '0.82rem',
            fontWeight: '700',
            color: '#0F172A',
            boxShadow: '0 4px 14px rgba(0,0,0,0.1)',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            pointerEvents: 'all'
          }}>
            <MapPin size={14} color="#E11D48" />
            <span>{isMultiMode ? `${listings.length} Stays on Live Map` : (location || 'Destination') + (country ? `, ${country}` : '')}</span>
          </div>

          {/* Action Buttons */}
          <div style={{ display: 'flex', gap: '8px', pointerEvents: 'all' }}>
            <button
              type="button"
              onClick={() => setSelectedLayerIndex((selectedLayerIndex + 1) % TILE_LAYERS.length)}
              title={`Switch Style (${currentLayer.name})`}
              style={{
                background: 'rgba(255, 255, 255, 0.96)',
                backdropFilter: 'blur(8px)',
                border: '1px solid var(--border-color)',
                borderRadius: '9999px',
                padding: '6px 12px',
                fontSize: '0.78rem',
                fontWeight: '700',
                color: '#0F172A',
                cursor: 'pointer',
                boxShadow: '0 4px 14px rgba(0,0,0,0.1)',
                display: 'flex',
                alignItems: 'center',
                gap: '5px'
              }}
            >
              <Layers size={13} color="#E11D48" />
              <span>Map Style</span>
            </button>

            {!isMultiMode && (
              <a
                href={googleMapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                title="Get Live Directions on Google Maps"
                style={{
                  background: '#0F172A',
                  color: '#FFFFFF',
                  borderRadius: '9999px',
                  padding: '6px 14px',
                  fontSize: '0.78rem',
                  fontWeight: '700',
                  textDecoration: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '5px',
                  boxShadow: '0 4px 14px rgba(0,0,0,0.2)'
                }}
              >
                <Navigation size={13} />
                <span>Get Directions</span>
              </a>
            )}
          </div>
        </div>
      )}

      {/* Leaflet Map Area */}
      <div style={{ flex: 1, position: 'relative', width: '100%', height: isModal ? 'calc(100vh - 62px)' : '100%' }}>
        <MapContainer
          center={coords}
          zoom={isMultiMode ? 5 : 13}
          scrollWheelZoom={true}
          style={{ height: '100%', width: '100%' }}
        >
          <MapController
            center={coords}
            zoom={isMultiMode ? 5 : 13}
            bounds={bounds}
            targetCoords={targetFlyCoords}
          />

          <TileLayer
            attribution={currentLayer.attribution}
            url={currentLayer.url}
          />

          {/* MULTI-LISTING MODE */}
          {isMultiMode ? (
            listings.map(item => {
              const itemCoords = resolveCoordinates(item);
              const isSelected = activeListingId === item._id;
              return (
                <Marker
                  key={item._id}
                  ref={el => { if (el) markerRefs.current[item._id] = el; }}
                  position={itemCoords}
                  icon={createCustomIcon(item.price, isSelected)}
                  eventHandlers={{
                    click: () => setActiveListingId(item._id)
                  }}
                >
                  <Popup className="stayaira-custom-popup">
                    <div style={{ padding: '4px', textAlign: 'left', minWidth: '190px' }}>
                      {item.image?.url && (
                        <img
                          src={item.image.url}
                          alt={item.title}
                          style={{ width: '100%', height: '100px', objectFit: 'cover', borderRadius: '10px', marginBottom: '8px' }}
                        />
                      )}
                      <p style={{ margin: '0 0 3px', fontWeight: '800', fontSize: '0.92rem', color: '#0F172A', lineHeight: '1.3' }}>{item.title}</p>
                      <p style={{ margin: '0 0 6px', fontSize: '0.78rem', color: '#64748B' }}>{item.location}, {item.country}</p>
                      <p style={{ margin: '0 0 8px', fontWeight: '800', fontSize: '0.92rem', color: '#E11D48' }}>
                        ₹{Number(item.price || 0).toLocaleString('en-IN')} <span style={{ fontSize: '0.75rem', fontWeight: '500', color: '#64748B' }}>/ night</span>
                      </p>
                      <Link
                        to={`/listings/${item._id}`}
                        className="btn-primary-stayaira"
                        style={{
                          display: 'inline-flex', padding: '0.45rem 0.8rem', fontSize: '0.78rem',
                          borderRadius: '8px', textDecoration: 'none', width: '100%', justifyContent: 'center'
                        }}
                      >
                        View Villa Details
                      </Link>
                    </div>
                  </Popup>
                </Marker>
              );
            })
          ) : (
            /* SINGLE LISTING MODE */
            <Marker position={coords} icon={createCustomIcon(price)}>
              <Popup className="stayaira-custom-popup">
                <div style={{ padding: '4px', textAlign: 'left', minWidth: '180px' }}>
                  {imageUrl && (
                    <img
                      src={imageUrl}
                      alt={title}
                      style={{ width: '100%', height: '95px', objectFit: 'cover', borderRadius: '10px', marginBottom: '8px' }}
                    />
                  )}
                  <p style={{ margin: '0 0 4px', fontWeight: '800', fontSize: '0.95rem', color: '#0F172A', lineHeight: '1.3' }}>{title}</p>
                  <p style={{ margin: '0 0 8px', fontSize: '0.8rem', color: '#64748B' }}>{location}, {country}</p>
                  {price > 0 && (
                    <p style={{ margin: '0 0 8px', fontWeight: '800', fontSize: '0.9rem', color: '#E11D48' }}>
                      ₹{Number(price).toLocaleString('en-IN')} <span style={{ fontSize: '0.75rem', fontWeight: '500', color: '#64748B' }}>/ night</span>
                    </p>
                  )}
                  <a
                    href={googleMapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      display: 'inline-flex', alignItems: 'center', gap: '4px',
                      fontSize: '0.78rem', fontWeight: '700', color: '#E11D48', textDecoration: 'none'
                    }}
                  >
                    Open Google Maps <ExternalLink size={11} />
                  </a>
                </div>
              </Popup>
            </Marker>
          )}
        </MapContainer>

        {/* Modal Bottom Listings Carousel */}
        {isModal && isMultiMode && (
          <div style={{
            position: 'absolute',
            bottom: '20px',
            left: 0,
            right: 0,
            zIndex: 1000,
            display: 'flex',
            justifyContent: 'center',
            pointerEvents: 'none',
            padding: '0 1rem'
          }}>
            <div style={{
              display: 'flex',
              gap: '12px',
              overflowX: 'auto',
              maxWidth: '920px',
              padding: '8px 6px',
              pointerEvents: 'all',
              scrollbarWidth: 'none',
              msOverflowStyle: 'none'
            }}>
              {listings.map(item => {
                const isSelected = activeListingId === item._id;
                return (
                  <div
                    key={item._id}
                    onClick={() => handleSelectListing(item)}
                    style={{
                      minWidth: '240px',
                      maxWidth: '240px',
                      background: 'var(--card-bg, #ffffff)',
                      borderRadius: '16px',
                      padding: '10px',
                      boxShadow: isSelected ? '0 12px 30px rgba(225,29,72,0.35)' : '0 8px 24px rgba(0,0,0,0.18)',
                      border: isSelected ? '2px solid #E11D48' : '1px solid var(--border-color)',
                      cursor: 'pointer',
                      display: 'flex',
                      gap: '10px',
                      alignItems: 'center',
                      transition: 'all 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
                      transform: isSelected ? 'scale(1.03)' : 'scale(1)'
                    }}
                  >
                    {item.image?.url && (
                      <img
                        src={item.image.url}
                        alt={item.title}
                        style={{ width: '64px', height: '64px', borderRadius: '10px', objectFit: 'cover', flexShrink: 0 }}
                      />
                    )}
                    <div style={{ overflow: 'hidden', flex: 1 }}>
                      <p style={{ margin: 0, fontSize: '0.82rem', fontWeight: '800', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', color: 'var(--text-main)' }}>
                        {item.title}
                      </p>
                      <p style={{ margin: '2px 0 4px', fontSize: '0.72rem', color: 'var(--text-muted)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {item.location}, {item.country}
                      </p>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <span style={{ fontSize: '0.82rem', fontWeight: '800', color: 'var(--primary)' }}>
                          ₹{Number(item.price || 0).toLocaleString('en-IN')}
                        </span>
                        <Link
                          to={`/listings/${item._id}`}
                          onClick={(e) => e.stopPropagation()}
                          style={{ fontSize: '0.72rem', fontWeight: '700', color: 'var(--text-main)', display: 'inline-flex', alignItems: 'center', textDecoration: 'none' }}
                        >
                          View <ChevronRight size={12} />
                        </Link>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Free Map Badge */}
        <div style={{
          position: 'absolute',
          bottom: isModal ? '90px' : '8px',
          left: '12px',
          zIndex: 1000,
          background: 'rgba(255, 255, 255, 0.92)',
          backdropFilter: 'blur(6px)',
          padding: '3px 8px',
          borderRadius: '6px',
          fontSize: '0.7rem',
          fontWeight: '600',
          color: '#64748B',
          pointerEvents: 'none',
          display: 'flex',
          alignItems: 'center',
          gap: '4px'
        }}>
          <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: '#10B981', display: 'inline-block' }}></span>
          Live Map (OpenStreetMap &amp; Esri)
        </div>
      </div>
    </div>
  );

  return mapContent;
}

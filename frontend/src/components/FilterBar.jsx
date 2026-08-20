import React from 'react';
import { 
  Flame, Building2, Mountain, Castle, Waves, Tent, Snowflake, 
  Palmtree, Sparkles, Umbrella, TreePine, Hotel 
} from 'lucide-react';

const CATEGORIES = [
  { id: 'All', label: 'All Stays', icon: Sparkles },
  { id: 'Trending', label: 'Trending', icon: Flame },
  { id: 'Iconic Cities', label: 'Iconic Cities', icon: Building2 },
  { id: 'Mountains', label: 'Mountains', icon: Mountain },
  { id: 'Castles', label: 'Castles', icon: Castle },
  { id: 'Amazing Pools', label: 'Amazing Pools', icon: Waves },
  { id: 'Camping', label: 'Camping', icon: Tent },
  { id: 'Arctic', label: 'Arctic', icon: Snowflake },
  { id: 'Beachfront', label: 'Beachfront', icon: Palmtree },
  { id: 'Luxury Villas', label: 'Luxury Villas', icon: Hotel },
  { id: 'Countryside', label: 'Countryside', icon: TreePine },
  { id: 'Tropical', label: 'Tropical', icon: Umbrella },
];

export default function FilterBar({ selectedCategory, onSelectCategory, displayTax, onToggleTax }) {
  return (
    <div style={{ borderBottom: '1px solid var(--border-color)', background: 'var(--card-bg)', position: 'sticky', top: '80px', zIndex: 40 }}>
      <div className="stayaira-container filter-bar-container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1.5rem', padding: '0.75rem 1.5rem' }}>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', overflowX: 'auto', scrollbarWidth: 'none', padding: '0.25rem 0', flex: 1, minWidth: 0 }}>
          {CATEGORIES.map(cat => {
            const Icon = cat.icon;
            const active = (selectedCategory === cat.id) || (!selectedCategory && cat.id === 'All');
            return (
              <button
                key={cat.id}
                onClick={() => onSelectCategory(cat.id === 'All' ? '' : cat.id)}
                style={{
                  display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.4rem',
                  background: 'none', border: 'none', cursor: 'pointer',
                  padding: '0.4rem 0.2rem', minWidth: '68px',
                  color: active ? 'var(--primary)' : 'var(--text-muted)',
                  borderBottom: active ? '2.5px solid var(--primary)' : '2.5px solid transparent',
                  transition: 'all 0.2s ease', flexShrink: 0
                }}
              >
                <Icon size={22} />
                <span style={{ fontSize: '0.75rem', fontWeight: active ? '700' : '500', whiteSpace: 'nowrap' }}>
                  {cat.label}
                </span>
              </button>
            );
          })}
        </div>

        <div className="filter-tax-toggle" style={{
          display: 'flex', alignItems: 'center', gap: '0.75rem',
          padding: '0.6rem 1.1rem', borderRadius: '14px',
          border: '1.5px solid var(--border-color)', background: 'var(--light-bg)',
          whiteSpace: 'nowrap', flexShrink: 0
        }}>
          <span style={{ fontSize: '0.85rem', fontWeight: '600' }}>Display total before taxes</span>
          <label style={{ position: 'relative', display: 'inline-block', width: '42px', height: '24px', cursor: 'pointer' }}>
            <input 
              type="checkbox" 
              checked={displayTax}
              onChange={(e) => onToggleTax(e.target.checked)}
              style={{ opacity: 0, width: 0, height: 0 }}
            />
            <span style={{
              position: 'absolute', inset: 0, borderRadius: '9999px',
              background: displayTax ? 'var(--primary)' : '#CBD5E1',
              transition: 'all 0.25s ease'
            }}>
              <span style={{
                position: 'absolute', height: '18px', width: '18px', left: displayTax ? '21px' : '3px', bottom: '3px',
                background: '#FFFFFF', borderRadius: '50%', transition: 'all 0.25s ease'
              }}></span>
            </span>
          </label>
        </div>

      </div>
    </div>
  );
}

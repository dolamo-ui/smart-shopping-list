import React, { useState, useMemo, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { removeItem } from '../store/shoppingListSlice';
import type { RootState } from '../store/store';
import ItemCard from '../components/ItemCard';
import { Category } from '../../types';
import {
  Search,
  SlidersHorizontal,
  Plus,
  PackageOpen,
  Sparkles,
  TrendingUp,
  LayoutGrid,
  Leaf,
  Beef,
  Milk,
  Croissant,
  ShoppingBasket,
  ShoppingCart,
} from 'lucide-react';
import { Link } from 'react-router-dom';

// ── Category metadata (label + Lucide icon) ───────────────────────────────────
const CATEGORY_META: Record<string, { label: string; icon: React.ReactNode }> = {
  'All':            { label: 'All',            icon: <LayoutGrid     size={13} /> },
  'Fresh Produce':  { label: 'Fresh Produce',  icon: <Leaf           size={13} /> },
  'Meat & Protein': { label: 'Meat & Protein', icon: <Beef           size={13} /> },
  'Dairy':          { label: 'Dairy',          icon: <Milk           size={13} /> },
  'Bakery':         { label: 'Bakery',         icon: <Croissant      size={13} /> },
  'Pantry':         { label: 'Pantry',         icon: <ShoppingBasket size={13} /> },
};

// ── Floating particle for hero background ─────────────────────────────────────
const Particle: React.FC<{ style: React.CSSProperties }> = ({ style }) => (
  <div
    style={{
      position: 'absolute',
      borderRadius: '50%',
      background: 'rgba(255,255,255,0.15)',
      animation: 'floatUp 8s ease-in-out infinite',
      ...style,
    }}
  />
);

// ── Shop Now Button ───────────────────────────────────────────────────────────
const ShopNowButton: React.FC<{ to: string }> = ({ to }) => (
  <Link
    to={to}
    style={{
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '5px',
      width: '180px',
      height: '40px',
      backgroundImage: 'linear-gradient(rgb(214, 202, 254), rgb(158, 129, 254))',
      border: 'none',
      borderRadius: '50px',
      color: '#fff',
      fontWeight: 600,
      fontSize: '0.92rem',
      textDecoration: 'none',
      boxShadow: '1px 3px 0px rgb(139, 113, 255)',
      transition: 'all 0.3s',
      cursor: 'pointer',
      fontFamily: 'inherit',
    }}
    onMouseDown={e => {
      (e.currentTarget as HTMLAnchorElement).style.transform = 'translate(2px, 0px)';
      (e.currentTarget as HTMLAnchorElement).style.boxShadow = '0px 1px 0px rgb(139, 113, 255)';
    }}
    onMouseUp={e => {
      (e.currentTarget as HTMLAnchorElement).style.transform = 'translate(0, 0)';
      (e.currentTarget as HTMLAnchorElement).style.boxShadow = '1px 3px 0px rgb(139, 113, 255)';
    }}
  >
    Shop now
    <svg style={{ width: '14px', height: 'fit-content' }} viewBox="0 0 576 512">
      <path fill="white" d="M0 24C0 10.7 10.7 0 24 0H69.5c22 0 41.5 12.8 50.6 32h411c26.3 0 45.5 25 38.6 50.4l-41 152.3c-8.5 31.4-37 53.3-69.5 53.3H170.7l5.4 28.5c2.2 11.3 12.1 19.5 23.6 19.5H488c13.3 0 24 10.7 24 24s-10.7 24-24 24H199.7c-34.6 0-64.3-24.6-70.7-58.5L77.4 54.5c-.7-3.8-4-6.5-7.9-6.5H24C10.7 48 0 37.3 0 24zM128 464a48 48 0 1 1 96 0 48 48 0 1 1 -96 0zm336-48a48 48 0 1 1 0 96 48 48 0 1 1 0-96z" />
    </svg>
  </Link>
);

// ── Dashboard ─────────────────────────────────────────────────────────────────
const Dashboard: React.FC = () => {
  const dispatch = useDispatch();
  const { items } = useSelector((state: RootState) => state.shoppingList);
  const { user }  = useSelector((state: RootState) => state.login);

  const [search,         setSearch]         = useState('');
  const [filterCategory, setFilterCategory] = useState<Category | 'All'>('All');
  const [mounted,        setMounted]        = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 50);
    return () => clearTimeout(t);
  }, []);

  const handleDeleteItem = (id: string) => dispatch(removeItem(id));

  const filteredItems = useMemo(() =>
    items.filter(item => {
      const matchesSearch =
        item.name.toLowerCase().includes(search.toLowerCase()) ||
        item.notes?.toLowerCase().includes(search.toLowerCase());
      const matchesCategory = filterCategory === 'All' || item.category === filterCategory;
      return matchesSearch && matchesCategory;
    }),
    [items, search, filterCategory],
  );

  const particles = useMemo(() =>
    Array.from({ length: 18 }, () => ({
      width:             `${Math.random() * 18 + 6}px`,
      height:            `${Math.random() * 18 + 6}px`,
      left:              `${Math.random() * 100}%`,
      top:               `${Math.random() * 100}%`,
      animationDelay:    `${Math.random() * 6}s`,
      animationDuration: `${Math.random() * 6 + 6}s`,
      opacity:            Math.random() * 0.4 + 0.1,
    })),
    [],
  );

  return (
    <div style={{ minHeight: '100vh', fontFamily: "'DM Sans', 'Segoe UI', sans-serif" }}>

      {/* ── Keyframes ──────────────────────────────────────────────────────── */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,wght@0,300;0,400;0,500;0,600;0,700;1,400&family=Playfair+Display:wght@700;800&display=swap');

        @keyframes floatUp {
          0%, 100% { transform: translateY(0px) scale(1);   opacity: 0.15; }
          50%       { transform: translateY(-30px) scale(1.1); opacity: 0.3; }
        }
        @keyframes fadeSlideDown {
          from { opacity: 0; transform: translateY(-24px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeSlideUp {
          from { opacity: 0; transform: translateY(28px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes pulse-ring {
          0%   { box-shadow: 1px 3px 0px rgb(139,113,255), 0 0 0 0   rgba(158,129,254,0.5); }
          70%  { box-shadow: 1px 3px 0px rgb(139,113,255), 0 0 0 12px rgba(158,129,254,0);   }
          100% { box-shadow: 1px 3px 0px rgb(139,113,255), 0 0 0 0   rgba(158,129,254,0);   }
        }
        @keyframes badgePop {
          0%   { transform: scale(0.7); opacity: 0; }
          70%  { transform: scale(1.15); }
          100% { transform: scale(1);   opacity: 1; }
        }

        .stat-card { transition: transform 0.25s ease, box-shadow 0.25s ease; }
        .stat-card:hover {
          transform: translateY(-4px) scale(1.02);
          box-shadow: 0 20px 40px rgba(0,0,0,0.18) !important;
        }

        .search-bar:focus-within {
          box-shadow: 0 0 0 3px rgba(158,129,254,0.35);
          border-color: #9e81fe !important;
        }

        .add-btn { transition: transform 0.2s ease, box-shadow 0.2s ease; }
        .add-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0px 1px 0px rgb(139, 113, 255) !important;
        }
        .add-btn:active {
          transform: translate(2px, 0px);
          box-shadow: 0px 1px 0px rgb(139, 113, 255) !important;
          padding-bottom: 1px;
        }

        .filter-pill { transition: all 0.18s ease; cursor: pointer; }
        .filter-pill.active {
          background: linear-gradient(135deg, rgb(214,202,254), rgb(158,129,254)) !important;
          color: #fff !important;
          box-shadow: 0 4px 12px rgba(158,129,254,0.4);
          border-color: transparent !important;
        }
        .filter-pill:hover:not(.active) { background: rgba(255,255,255,0.9) !important; }

        .grid-item { animation: fadeSlideUp 0.4s ease both; }
      `}</style>

      {/* ── Hero header ────────────────────────────────────────────────────── */}
      <div
        style={{
          position: 'relative',
          overflow: 'hidden',
          borderRadius: '0 0 40px 40px',
          marginBottom: '2rem',
          minHeight: '320px',
        }}
      >
        {/* Background image */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            backgroundImage: `url('/src/assets/growtika-zk2sfqaJgdU-unsplash.jpg')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center 40%',
            filter: 'brightness(0.38) saturate(1.2)',
            transform: 'scale(1.04)',
            transition: 'transform 8s ease',
          }}
        />

        {/* Gradient overlay — purple theme */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background:
              'linear-gradient(135deg, rgba(15,12,41,0.85) 0%, rgba(67,52,130,0.75) 50%, rgba(36,36,62,0.88) 100%)',
          }}
        />

        {/* Purple accent glow */}
        <div
          style={{
            position: 'absolute',
            bottom: '-80px',
            right: '-80px',
            width: '360px',
            height: '360px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(158,129,254,0.28) 0%, transparent 70%)',
            pointerEvents: 'none',
          }}
        />

        {/* Floating particles */}
        {particles.map((p, i) => (
          <Particle key={i} style={p} />
        ))}

        {/* Hero content */}
        <div
          style={{
            position: 'relative',
            zIndex: 10,
            padding: '3rem 2.5rem 2.5rem',
            maxWidth: '1100px',
            margin: '0 auto',
          }}
        >
          {/* Greeting row */}
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              alignItems: 'flex-end',
              justifyContent: 'space-between',
              gap: '1.5rem',
              animation: mounted ? 'fadeSlideDown 0.6s ease both' : 'none',
            }}
          >
            <div>
              {/* Eyebrow label */}
              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  background: 'rgba(158,129,254,0.18)',
                  border: '1px solid rgba(158,129,254,0.35)',
                  borderRadius: '100px',
                  padding: '4px 14px',
                  color: '#d6cafe',
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                  marginBottom: '0.75rem',
                }}
              >
                <Sparkles size={12} />
                Your Shopping Hub
              </div>

              <h1
                style={{
                  fontFamily: "'Playfair Display', serif",
                  fontSize: 'clamp(2rem, 4vw, 3rem)',
                  fontWeight: 800,
                  color: '#fff',
                  lineHeight: 1.15,
                  margin: 0,
                }}
              >
                Hey, {user?.name || 'Shopper'}! 👋
              </h1>

              <p
                style={{
                  color: 'rgba(255,255,255,0.6)',
                  marginTop: '0.5rem',
                  fontSize: '1rem',
                  fontWeight: 400,
                }}
              >
                You have{' '}
                <span
                  style={{
                    color: '#c4b5fd',
                    fontWeight: 700,
                    animation: 'badgePop 0.5s 0.4s ease both',
                    display: 'inline-block',
                  }}
                >
                  {items.length}
                </span>{' '}
                {items.length === 1 ? 'item' : 'items'} in your list
              </p>
            </div>

            {/* Shop Now Button */}
            <Link
              to="/add"
              className="add-btn"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '5px',
                width: '180px',
                height: '44px',
                backgroundImage: 'linear-gradient(rgb(214, 202, 254), rgb(158, 129, 254))',
                border: 'none',
                borderRadius: '50px',
                color: '#fff',
                fontWeight: 600,
                fontSize: '0.95rem',
                textDecoration: 'none',
                boxShadow: '1px 3px 0px rgb(139, 113, 255)',
                animation: 'pulse-ring 2.5s 1s infinite',
                whiteSpace: 'nowrap',
                fontFamily: 'inherit',
              }}
            >
              +Add item
              <svg style={{ width: '14px', height: 'fit-content' }} viewBox="0 0 576 512">
                <path fill="white" d="M0 24C0 10.7 10.7 0 24 0H69.5c22 0 41.5 12.8 50.6 32h411c26.3 0 45.5 25 38.6 50.4l-41 152.3c-8.5 31.4-37 53.3-69.5 53.3H170.7l5.4 28.5c2.2 11.3 12.1 19.5 23.6 19.5H488c13.3 0 24 10.7 24 24s-10.7 24-24 24H199.7c-34.6 0-64.3-24.6-70.7-58.5L77.4 54.5c-.7-3.8-4-6.5-7.9-6.5H24C10.7 48 0 37.3 0 24zM128 464a48 48 0 1 1 96 0 48 48 0 1 1 -96 0zm336-48a48 48 0 1 1 0 96 48 48 0 1 1 0-96z" />
              </svg>
            </Link>
          </div>

          {/* ── Stat pills ─────────────────────────────────────────────────── */}
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: '1rem',
              marginTop: '2rem',
              animation: mounted ? 'fadeSlideUp 0.6s 0.2s ease both' : 'none',
              opacity: mounted ? 1 : 0,
            }}
          >
            {[
              { label: 'Total Items',  value: items.length,                                icon: <TrendingUp       size={16} /> },
              { label: 'Categories',   value: new Set(items.map(i => i.category)).size,    icon: <SlidersHorizontal size={16} /> },
              { label: 'Total Qty',    value: items.reduce((s, i) => s + i.quantity, 0),   icon: <Sparkles          size={16} /> },
            ].map((stat, idx) => (
              <div
                key={idx}
                className="stat-card"
                style={{
                  background: 'rgba(255,255,255,0.09)',
                  backdropFilter: 'blur(12px)',
                  border: '1px solid rgba(255,255,255,0.15)',
                  borderRadius: '16px',
                  padding: '0.85rem 1.4rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  color: '#fff',
                  minWidth: '130px',
                  animationDelay: `${idx * 0.1}s`,
                }}
              >
                <span style={{ color: '#c4b5fd' }}>{stat.icon}</span>
                <div>
                  <div style={{ fontSize: '1.4rem', fontWeight: 700, lineHeight: 1 }}>
                    {stat.value}
                  </div>
                  <div style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.5)', marginTop: 2 }}>
                    {stat.label}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Main content ───────────────────────────────────────────────────── */}
      <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '0 1.5rem 3rem' }}>

        {/* Search + filter row */}
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '1rem',
            marginBottom: '1.75rem',
            animation: mounted ? 'fadeSlideUp 0.5s 0.35s ease both' : 'none',
            opacity: mounted ? 1 : 0,
          }}
        >
          {/* Search input */}
          <div
            className="search-bar"
            style={{
              flex: '1 1 260px',
              position: 'relative',
              background: '#fff',
              borderRadius: '16px',
              border: '1.5px solid #e2e8f0',
              display: 'flex',
              alignItems: 'center',
              transition: 'border-color 0.2s, box-shadow 0.2s',
              overflow: 'hidden',
            }}
          >
            <Search
              size={18}
              style={{ position: 'absolute', left: '1rem', color: '#94a3b8', pointerEvents: 'none' }}
            />
            <input
              type="text"
              placeholder="Search items or notes…"
              value={search}
              onChange={e => setSearch(e.target.value)}
              style={{
                width: '100%',
                padding: '0.85rem 1rem 0.85rem 2.75rem',
                border: 'none',
                outline: 'none',
                fontSize: '0.92rem',
                background: 'transparent',
                color: '#1e293b',
                fontFamily: 'inherit',
              }}
            />
          </div>

          {/* Category filter pills */}
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: '0.5rem',
              alignItems: 'center',
            }}
          >
            {(['All', ...Object.values(Category).filter(c => c !== 'All')] as string[]).map(cat => {
              const { label, icon } = CATEGORY_META[cat] ?? { label: cat, icon: null };
              return (
                <button
                  key={cat}
                  onClick={() => setFilterCategory(cat)}
                  className={`filter-pill${filterCategory === cat ? ' active' : ''}`}
                  style={{
                    padding: '0.5rem 1.1rem',
                    borderRadius: '100px',
                    border: '1.5px solid rgba(0,0,0,0.1)',
                    background: 'rgba(255,255,255,0.85)',
                    color: '#475569',
                    fontWeight: 600,
                    fontSize: '0.8rem',
                    fontFamily: 'inherit',
                    whiteSpace: 'nowrap',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '5px',
                    cursor: 'pointer',
                  }}
                >
                  {icon}
                  {label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Items grid or empty state */}
        {filteredItems.length > 0 ? (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
              gap: '1.5rem',
            }}
          >
            {filteredItems.map((item, idx) => (
              <div
                key={item.id}
                className="grid-item"
                style={{ animationDelay: `${idx * 0.06}s` }}
              >
                <ItemCard item={item} onDelete={handleDeleteItem} />
              </div>
            ))}
          </div>
        ) : (
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '5rem 2rem',
              textAlign: 'center',
              background: '#fff',
              borderRadius: '28px',
              border: '2px dashed #e2e8f0',
              animation: mounted ? 'fadeSlideUp 0.5s 0.3s ease both' : 'none',
              opacity: mounted ? 1 : 0,
            }}
          >
            <div
              style={{
                width: '80px',
                height: '80px',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #f5f3ff, #ede9fe)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '1.5rem',
                boxShadow: '0 8px 24px rgba(158,129,254,0.2)',
              }}
            >
              <PackageOpen size={38} style={{ color: '#7c3aed' }} />
            </div>

            <h3
              style={{
                fontSize: '1.5rem',
                fontWeight: 700,
                color: '#1e293b',
                marginBottom: '0.5rem',
                fontFamily: "'Playfair Display', serif",
              }}
            >
              No items found
            </h3>

            <p style={{ color: '#64748b', maxWidth: '380px', marginBottom: '1.5rem', lineHeight: 1.6 }}>
              {search || filterCategory !== 'All'
                ? 'Nothing matches your search. Try adjusting the filters.'
                : 'Your shopping list is empty. Start by adding your first item!'}
            </p>

            {search || filterCategory !== 'All' ? (
              <button
                onClick={() => { setSearch(''); setFilterCategory('All'); }}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '5px',
                  width: '180px',
                  height: '40px',
                  backgroundImage: 'linear-gradient(rgb(214,202,254), rgb(158,129,254))',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '50px',
                  fontWeight: 600,
                  fontSize: '0.9rem',
                  cursor: 'pointer',
                  fontFamily: 'inherit',
                  boxShadow: '1px 3px 0px rgb(139,113,255)',
                }}
              >
                Clear filters
              </button>
            ) : (
              <ShopNowButton to="/add" />
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
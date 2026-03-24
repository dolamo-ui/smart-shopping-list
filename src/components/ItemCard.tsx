import React from 'react';
import type { ShoppingItem } from '../../types';
import { CATEGORY_CONFIG, FALLBACK_CATEGORY_CONFIG } from '../../constants';
import { Edit2, Trash2, StickyNote, Paperclip, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';

interface ItemCardProps {
  item: ShoppingItem;
  onDelete: (id: string) => void;
}

const ItemCard: React.FC<ItemCardProps> = ({ item, onDelete }) => {
  const config = CATEGORY_CONFIG[item.category] ?? FALLBACK_CATEGORY_CONFIG;

  return (
    <div
      style={{
        background: '#fff',
        borderRadius: '20px',
        border: '1.5px solid #e2e8f0',
        boxShadow: '0 2px 12px rgba(0,0,0,0.05)',
        padding: '1.25rem',
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        fontFamily: "'DM Sans', 'Segoe UI', sans-serif",
        transition: 'box-shadow 0.2s, transform 0.2s',
      }}
      onMouseEnter={e => {
        (e.currentTarget as HTMLDivElement).style.boxShadow = '0 8px 28px rgba(124,58,237,0.12)';
        (e.currentTarget as HTMLDivElement).style.transform = 'translateY(-2px)';
      }}
      onMouseLeave={e => {
        (e.currentTarget as HTMLDivElement).style.boxShadow = '0 2px 12px rgba(0,0,0,0.05)';
        (e.currentTarget as HTMLDivElement).style.transform = 'translateY(0)';
      }}
    >
      {/* Top row */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '5px',
            background: config.bg,
            color: config.text,
            padding: '4px 10px',
            borderRadius: '100px',
            fontSize: '0.72rem',
            fontWeight: 700,
            letterSpacing: '0.02em',
          }}
        >
          {config.icon}
          {item.category}
        </div>

        <div style={{ display: 'flex', gap: '4px' }}>
          <Link
            to={`/edit/${item.id}`}
            style={{
              padding: '6px',
              borderRadius: '8px',
              color: '#94a3b8',
              display: 'flex',
              alignItems: 'center',
              textDecoration: 'none',
              transition: 'background 0.15s, color 0.15s',
            }}
            onMouseEnter={e => {
              (e.currentTarget as HTMLAnchorElement).style.background = '#f5f3ff';
              (e.currentTarget as HTMLAnchorElement).style.color = '#7c3aed';
            }}
            onMouseLeave={e => {
              (e.currentTarget as HTMLAnchorElement).style.background = 'transparent';
              (e.currentTarget as HTMLAnchorElement).style.color = '#94a3b8';
            }}
          >
            <Edit2 size={15} />
          </Link>
          <button
            onClick={() => onDelete(item.id)}
            style={{
              padding: '6px',
              borderRadius: '8px',
              border: 'none',
              background: 'transparent',
              color: '#94a3b8',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              transition: 'background 0.15s, color 0.15s',
            }}
            onMouseEnter={e => {
              (e.currentTarget as HTMLButtonElement).style.background = '#fef2f2';
              (e.currentTarget as HTMLButtonElement).style.color = '#ef4444';
            }}
            onMouseLeave={e => {
              (e.currentTarget as HTMLButtonElement).style.background = 'transparent';
              (e.currentTarget as HTMLButtonElement).style.color = '#94a3b8';
            }}
          >
            <Trash2 size={15} />
          </button>
        </div>
      </div>

      {/* Item name + quantity */}
      <div style={{ flex: 1 }}>
        <h3
          style={{
            fontSize: '1.05rem',
            fontWeight: 700,
            color: '#1e293b',
            marginBottom: '4px',
            lineHeight: 1.3,
            textTransform: 'capitalize',
          }}
        >
          {item.name}
        </h3>

        <p style={{ fontSize: '0.82rem', color: '#94a3b8', marginBottom: '0.75rem', fontWeight: 500 }}>
          Qty:{' '}
          <span style={{ color: '#7c3aed', fontWeight: 700 }}>{item.quantity}</span>
        </p>

        {item.notes && (
          <div
            style={{
              display: 'flex',
              alignItems: 'flex-start',
              gap: '8px',
              padding: '0.6rem 0.75rem',
              background: '#f8fafc',
              borderRadius: '10px',
              marginBottom: '0.75rem',
            }}
          >
            <StickyNote size={13} style={{ color: '#94a3b8', marginTop: '2px', flexShrink: 0 }} />
            <p
              style={{
                fontSize: '0.82rem',
                color: '#64748b',
                fontStyle: 'italic',
                lineHeight: 1.5,
                margin: 0,
                display: '-webkit-box',
                WebkitLineClamp: 3,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden',
              }}
            >
              {item.notes}
            </p>
          </div>
        )}
      </div>

      {/* Attachment */}
      {item.attachmentUrl && (
        <div style={{ marginTop: 'auto', paddingTop: '0.75rem', borderTop: '1px solid #f1f5f9' }}>
          <a
            href={item.attachmentUrl}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              fontSize: '0.78rem',
              fontWeight: 600,
              color: '#7c3aed',
              textDecoration: 'none',
            }}
          >
            <Paperclip size={13} />
            <span style={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {item.attachmentName || 'Attachment'}
            </span>
            <ExternalLink size={11} />
          </a>

          {item.attachmentUrl.startsWith('data:image/') && (
            <div style={{ marginTop: '8px', borderRadius: '10px', overflow: 'hidden', height: '96px', background: '#f1f5f9' }}>
              <img src={item.attachmentUrl} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>
          )}
        </div>
      )}

      {/* Date */}
      <div style={{ marginTop: '0.75rem', fontSize: '0.7rem', color: '#cbd5e1', fontWeight: 500 }}>
        Added {new Date(item.createdAt).toLocaleDateString()}
      </div>
    </div>
  );
};

export default ItemCard;
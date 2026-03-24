import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { addItem, editItem } from '../store/shoppingListSlice';
import type { RootState } from '../store/store';
import { Category } from '../../types';
import {
  ArrowLeft, Package, Hash, Tag, FileText, Upload, Trash2,
  LayoutGrid, Leaf, Beef, Milk, Croissant, ShoppingBasket,
} from 'lucide-react';

const CATEGORY_ICONS: Record<string, React.ReactNode> = {
  'All':            <LayoutGrid     size={15} />,
  'Fresh Produce':  <Leaf           size={15} />,
  'Meat & Protein': <Beef           size={15} />,
  'Dairy':          <Milk           size={15} />,
  'Bakery':         <Croissant      size={15} />,
  'Pantry':         <ShoppingBasket size={15} />,
};

const ITEM_CATEGORIES = Object.values(Category).filter(c => c !== 'All');

const AddItem: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const items = useSelector((state: RootState) => state.shoppingList.items);
  const { user } = useSelector((state: RootState) => state.login);
  const isEditing = !!id;

  const [formData, setFormData] = useState<{
    name: string;
    quantity: string;
    category: string;
    notes: string;
    image: string;
  }>({
    name: '',
    quantity: '1',
    category: 'Fresh Produce',
    notes: '',
    image: '',
  });

  const [error, setError] = useState('');

  useEffect(() => {
    if (isEditing && id) {
      const item = items.find(i => i.id === id);
      if (item) {
        setFormData({
          name:     item.name,
          quantity: String(item.quantity),
          category: item.category,
          notes:    item.notes || '',
          image:    item.attachmentUrl || '',
        });
      } else {
        navigate('/dashboard');
      }
    }
  }, [id, isEditing, items, navigate]);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) {
      setError('File size too large. Please choose a file smaller than 2MB.');
      return;
    }
    const reader = new FileReader();
    reader.onloadend = () => {
      setFormData(prev => ({ ...prev, image: reader.result as string }));
      setError('');
    };
    reader.readAsDataURL(file);
  };

  const removeFile = () => setFormData(prev => ({ ...prev, image: '' }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) { setError('Item name is required'); return; }
    const qty = parseInt(formData.quantity);
    if (isNaN(qty) || qty < 1) { setError('Quantity must be at least 1'); return; }

    if (isEditing && id) {
      dispatch(editItem({
        id,
        updatedData: {
          name:           formData.name,
          quantity:       qty,
          category:       formData.category,
          notes:          formData.notes,
          attachmentUrl:  formData.image,
          attachmentName: formData.image ? 'Image' : undefined,
          userId:         user?.id || '',
        },
      }));
    } else {
      dispatch(addItem({
        id:             Date.now().toString(),
        name:           formData.name,
        quantity:       qty,
        category:       formData.category,
        notes:          formData.notes,
        attachmentUrl:  formData.image,
        attachmentName: formData.image ? 'Image' : undefined,
        userId:         user?.id || '',
        createdAt:      Date.now(),
      }));
    }
    navigate('/dashboard');
  };

  return (
    <div
      style={{
        maxWidth: '680px',
        margin: '0 auto',
        padding: '2rem 1.5rem 4rem',
        fontFamily: "'DM Sans', 'Segoe UI', sans-serif",
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Playfair+Display:wght@700;800&display=swap');

        @keyframes fadeSlideUp {
          from { opacity: 0; transform: translateY(20px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .add-card { animation: fadeSlideUp 0.45s ease both; }

        .field-input {
          width: 100%;
          padding: 0.8rem 1rem;
          background: #f8fafc;
          border: 1.5px solid #e2e8f0;
          border-radius: 12px;
          font-size: 0.93rem;
          font-family: inherit;
          color: #1e293b;
          outline: none;
          transition: border-color 0.2s, box-shadow 0.2s;
          box-sizing: border-box;
        }
        .field-input:focus {
          border-color: #9e81fe;
          box-shadow: 0 0 0 3px rgba(158,129,254,0.2);
        }

        .cat-option {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 0.65rem 1rem;
          border-radius: 10px;
          border: 1.5px solid #e2e8f0;
          background: #f8fafc;
          cursor: pointer;
          font-size: 0.87rem;
          font-weight: 600;
          color: #475569;
          transition: all 0.15s ease;
          font-family: inherit;
          white-space: nowrap;
        }
        .cat-option:hover        { border-color: #9e81fe; background: #f5f3ff; color: #6d28d9; }
        .cat-option.selected     {
          border-color: #7c3aed;
          background: linear-gradient(135deg,#f5f3ff,#ede9fe);
          color: #6d28d9;
          box-shadow: 0 2px 8px rgba(124,58,237,0.2);
        }

        .submit-btn {
          flex: 2;
          padding: 0.85rem;
          backgroundImage: linear-gradient(rgb(214,202,254), rgb(158,129,254));
          background: linear-gradient(rgb(214,202,254), rgb(158,129,254));
          color: #fff;
          font-weight: 700;
          font-size: 0.95rem;
          border: none;
          border-radius: 50px;
          cursor: pointer;
          font-family: inherit;
          box-shadow: 1px 3px 0px rgb(139,113,255);
          transition: transform 0.2s, box-shadow 0.2s;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
        }
        .submit-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0px 6px 20px rgba(139,113,255,0.4);
        }
        .submit-btn:active {
          transform: translate(2px, 0px);
          box-shadow: 0px 1px 0px rgb(139, 113, 255);
        }
        .cancel-btn {
          flex: 1;
          padding: 0.85rem;
          background: #f1f5f9;
          color: #64748b;
          font-weight: 600;
          font-size: 0.95rem;
          border: none;
          border-radius: 50px;
          cursor: pointer;
          font-family: inherit;
          transition: background 0.15s;
        }
        .cancel-btn:hover { background: #e2e8f0; }

        .upload-zone {
          border: 2px dashed #e2e8f0;
          border-radius: 18px;
          padding: 2.5rem 1rem;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 8px;
          cursor: pointer;
          transition: border-color 0.2s, background 0.2s;
          position: relative;
        }
        .upload-zone:hover { border-color: #9e81fe; background: #f5f3ff; }
      `}</style>

      {/* Back button */}
      <button
        onClick={() => navigate(-1)}
        style={{
          display: 'inline-flex', alignItems: 'center', gap: '6px',
          background: 'none', border: 'none', color: '#64748b',
          fontWeight: 600, fontSize: '0.9rem', cursor: 'pointer',
          fontFamily: 'inherit', marginBottom: '1.5rem', padding: 0,
        }}
      >
        <ArrowLeft size={18} />
        Back
      </button>

      {/* Card */}
      <div
        className="add-card"
        style={{
          background: '#fff',
          borderRadius: '28px',
          border: '1px solid #e2e8f0',
          boxShadow: '0 8px 40px rgba(0,0,0,0.07)',
          overflow: 'hidden',
        }}
      >
        {/* Hero header — purple theme */}
        <div
          style={{
            position: 'relative',
            padding: '2.5rem 2rem',
            background: 'linear-gradient(135deg, #0f0c29 0%, #302b63 55%, #24243e 100%)',
            overflow: 'hidden',
          }}
        >
          <div style={{
            position: 'absolute', bottom: '-60px', right: '-60px',
            width: '220px', height: '220px', borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(158,129,254,0.3) 0%, transparent 70%)',
            pointerEvents: 'none',
          }} />
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: '6px',
            background: 'rgba(158,129,254,0.18)',
            border: '1px solid rgba(158,129,254,0.35)',
            borderRadius: '100px', padding: '3px 12px',
            color: '#d6cafe', fontSize: '0.72rem', fontWeight: 600,
            letterSpacing: '0.08em', textTransform: 'uppercase',
            marginBottom: '0.75rem',
          }}>
            <Package size={11} />
            {isEditing ? 'Edit Item' : 'New Item'}
          </div>
          <h1 style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: '1.9rem', fontWeight: 800,
            color: '#fff', margin: 0, lineHeight: 1.2,
          }}>
            {isEditing ? 'Update your item' : 'Add to your list'}
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.5)', marginTop: '0.4rem', fontSize: '0.9rem' }}>
            {isEditing ? 'Change the details below and save.' : 'Fill in the details to add a new shopping item.'}
          </p>
        </div>

        {/* Form body */}
        <form onSubmit={handleSubmit} style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>

          {error && (
            <div style={{
              padding: '0.85rem 1rem',
              background: '#fef2f2', border: '1.5px solid #fecaca',
              borderRadius: '12px', color: '#dc2626',
              fontSize: '0.87rem', fontWeight: 500,
            }}>
              {error}
            </div>
          )}

          {/* Item name */}
          <div>
            <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.82rem', fontWeight: 700, color: '#475569', marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              <Package size={14} style={{ color: '#7c3aed' }} />
              Item Name <span style={{ color: '#7c3aed' }}>*</span>
            </label>
            <input
              type="text"
              className="field-input"
              value={formData.name}
              onChange={e => { setFormData({ ...formData, name: e.target.value }); setError(''); }}
              placeholder="e.g. Organic Almond Milk"
              required
            />
          </div>

          {/* Quantity */}
          <div>
            <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.82rem', fontWeight: 700, color: '#475569', marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              <Hash size={14} style={{ color: '#7c3aed' }} />
              Quantity <span style={{ color: '#7c3aed' }}>*</span>
            </label>
            <input
              type="number"
              min="1"
              className="field-input"
              style={{ maxWidth: '160px' }}
              value={formData.quantity}
              onChange={e => { setFormData({ ...formData, quantity: e.target.value }); setError(''); }}
              required
            />
          </div>

          {/* Category */}
          <div>
            <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.82rem', fontWeight: 700, color: '#475569', marginBottom: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              <Tag size={14} style={{ color: '#7c3aed' }} />
              Category <span style={{ color: '#7c3aed' }}>*</span>
            </label>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
              {ITEM_CATEGORIES.map(cat => (
                <button
                  key={cat}
                  type="button"
                  className={`cat-option${formData.category === cat ? ' selected' : ''}`}
                  onClick={() => setFormData({ ...formData, category: cat })}
                >
                  {CATEGORY_ICONS[cat] ?? <ShoppingBasket size={15} />}
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Notes */}
          <div>
            <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.82rem', fontWeight: 700, color: '#475569', marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              <FileText size={14} style={{ color: '#7c3aed' }} />
              Notes <span style={{ color: '#94a3b8', fontWeight: 400, textTransform: 'none', letterSpacing: 0 }}>(optional)</span>
            </label>
            <textarea
              rows={3}
              className="field-input"
              style={{ resize: 'none' }}
              value={formData.notes}
              onChange={e => setFormData({ ...formData, notes: e.target.value })}
              placeholder="Add any specific details or preferences…"
            />
          </div>

          {/* Image upload */}
          <div>
            <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.82rem', fontWeight: 700, color: '#475569', marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              <Upload size={14} style={{ color: '#7c3aed' }} />
              Attachment <span style={{ color: '#94a3b8', fontWeight: 400, textTransform: 'none', letterSpacing: 0 }}>(optional · max 2 MB)</span>
            </label>

            {!formData.image ? (
              <div className="upload-zone">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  style={{ position: 'absolute', inset: 0, opacity: 0, cursor: 'pointer', width: '100%', height: '100%' }}
                />
                <Upload size={28} style={{ color: '#cbd5e1' }} />
                <span style={{ fontSize: '0.88rem', fontWeight: 600, color: '#64748b' }}>Click or drag to upload</span>
                <span style={{ fontSize: '0.78rem', color: '#94a3b8' }}>PNG, JPG, WEBP up to 2 MB</span>
              </div>
            ) : (
              <div style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                padding: '0.85rem 1rem',
                background: '#f5f3ff', border: '1.5px solid #ddd6fe', borderRadius: '14px',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', overflow: 'hidden' }}>
                  <div style={{ width: '48px', height: '48px', borderRadius: '10px', overflow: 'hidden', flexShrink: 0, border: '2px solid #c4b5fd' }}>
                    <img src={formData.image} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </div>
                  <span style={{ fontSize: '0.87rem', fontWeight: 600, color: '#5b21b6' }}>Image uploaded successfully</span>
                </div>
                <button
                  type="button"
                  onClick={removeFile}
                  style={{ padding: '6px', background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', borderRadius: '8px', display: 'flex', alignItems: 'center' }}
                >
                  <Trash2 size={18} />
                </button>
              </div>
            )}
          </div>

          {/* Actions */}
          <div style={{ display: 'flex', gap: '0.75rem', paddingTop: '0.5rem' }}>
            <button type="button" className="cancel-btn" onClick={() => navigate('/dashboard')}>
              Cancel
            </button>
            <button type="submit" className="submit-btn">
              {isEditing ? 'Save Changes' : 'Shop now'}
              <svg style={{ width: '14px', height: 'fit-content' }} viewBox="0 0 576 512">
                <path fill="white" d="M0 24C0 10.7 10.7 0 24 0H69.5c22 0 41.5 12.8 50.6 32h411c26.3 0 45.5 25 38.6 50.4l-41 152.3c-8.5 31.4-37 53.3-69.5 53.3H170.7l5.4 28.5c2.2 11.3 12.1 19.5 23.6 19.5H488c13.3 0 24 10.7 24 24s-10.7 24-24 24H199.7c-34.6 0-64.3-24.6-70.7-58.5L77.4 54.5c-.7-3.8-4-6.5-7.9-6.5H24C10.7 48 0 37.3 0 24zM128 464a48 48 0 1 1 96 0 48 48 0 1 1 -96 0zm336-48a48 48 0 1 1 0 96 48 48 0 1 1 0-96z" />
              </svg>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddItem;
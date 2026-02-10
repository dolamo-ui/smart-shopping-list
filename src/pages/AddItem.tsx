import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { addItem, editItem } from '../store/shoppingListSlice';
import type { RootState } from '../store/store';
import { Category } from '../../types';
import { ArrowLeft, Package, Hash, Tag, FileText, Upload, Trash2 } from 'lucide-react';

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
    category: Category;
    notes: string;
    image: string;
  }>({
    name: '',
    quantity: '1',
    category: 'Groceries',
    notes: '',
    image: ''
  });

  const [error, setError] = useState('');

  useEffect(() => {
    if (isEditing && id) {
      const item = items.find(i => i.id === id);
      if (item) {
        setFormData({
          name: item.name,
          quantity: String(item.quantity),
          category: item.category as Category,
          notes: item.notes || '',
          image: item.attachmentUrl || ''
        });
      } else {
        navigate('/dashboard');
      }
    }
  }, [id, isEditing, items, navigate]);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        setError('File size too large. Please choose a file smaller than 2MB.');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({
          ...prev,
          image: reader.result as string
        }));
        setError('');
      };
      reader.readAsDataURL(file);
    }
  };

  const removeFile = () => {
    setFormData(prev => ({ ...prev, image: '' }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim()) {
      setError('Item name is required');
      return;
    }
    
    const qty = parseInt(formData.quantity);
    if (isNaN(qty) || qty < 1) {
      setError('Quantity must be at least 1');
      return;
    }

    if (isEditing && id) {
      dispatch(editItem({
        id,
        updatedData: {
          name: formData.name,
          quantity: qty,
          category: formData.category,
          notes: formData.notes,
          attachmentUrl: formData.image,
          attachmentName: formData.image ? 'Image' : undefined,
          userId: user?.id || ''
        }
      }));
    } else {
      dispatch(addItem({
        id: Date.now().toString(),
        name: formData.name,
        quantity: qty,
        category: formData.category,
        notes: formData.notes,
        attachmentUrl: formData.image,
        attachmentName: formData.image ? 'Image' : undefined,
        userId: user?.id || '',
        createdAt: Date.now()
      }));
    }
    
    navigate('/dashboard');
  };

  return (
    <div className="max-w-2xl mx-auto">
      {/* Back Button */}
      <button 
        onClick={() => navigate(-1)}
        className="flex items-center space-x-2 text-slate-600 hover:text-blue-600 mb-6 transition-colors font-medium"
      >
        <ArrowLeft size={18} />
        <span>Back</span>
      </button>

      {/* Main Card */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-8 py-10 text-white">
          <h1 className="text-3xl font-bold mb-2">{isEditing ? 'Edit Item' : 'Add New Item'}</h1>
          <p className="text-blue-100">
            {isEditing ? 'Update the details of your shopping item' : 'Complete the form to add an item to your list'}
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          {error && (
            <div className="p-4 bg-red-50 text-red-600 text-sm font-medium rounded-xl border border-red-200">
              {error}
            </div>
          )}

          <div className="space-y-5">
            {/* Item Name */}
            <div>
              <label className="flex items-center space-x-2 text-sm font-semibold text-slate-700 mb-2">
                <Package size={16} className="text-blue-600" />
                <span>Item Name *</span>
              </label>
              <input 
                type="text"
                value={formData.name}
                onChange={(e) => {
                  setFormData({ ...formData, name: e.target.value });
                  setError('');
                }}
                placeholder="e.g. Organic Almond Milk"
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                required
              />
            </div>

            {/* Quantity and Category */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="flex items-center space-x-2 text-sm font-semibold text-slate-700 mb-2">
                  <Hash size={16} className="text-blue-600" />
                  <span>Quantity *</span>
                </label>
                <input 
                  type="number"
                  min="1"
                  value={formData.quantity}
                  onChange={(e) => {
                    setFormData({ ...formData, quantity: e.target.value });
                    setError('');
                  }}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                  required
                />
              </div>
              <div>
                <label className="flex items-center space-x-2 text-sm font-semibold text-slate-700 mb-2">
                  <Tag size={16} className="text-blue-600" />
                  <span>Category *</span>
                </label>
                <select 
                  value={formData.category}
                  onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
                    setFormData({ ...formData, category: e.target.value as Category });
                  }}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all cursor-pointer"
                >
                  {Object.values(Category).map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Notes */}
            <div>
              <label className="flex items-center space-x-2 text-sm font-semibold text-slate-700 mb-2">
                <FileText size={16} className="text-blue-600" />
                <span>Optional Notes</span>
              </label>
              <textarea 
                rows={3}
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                placeholder="Add any specific details or preferences..."
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all resize-none"
              ></textarea>
            </div>

            {/* Image Upload */}
            <div>
              <label className="flex items-center space-x-2 text-sm font-semibold text-slate-700 mb-2">
                <Upload size={16} className="text-blue-600" />
                <span>Attachment (Image)</span>
              </label>
              
              {!formData.image ? (
                <div className="relative group">
                  <input 
                    type="file"
                    onChange={handleFileUpload}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                    accept="image/*"
                  />
                  <div className="border-2 border-dashed border-slate-300 rounded-2xl p-8 flex flex-col items-center justify-center space-y-2 group-hover:border-blue-400 group-hover:bg-blue-50/50 transition-all">
                    <Upload className="text-slate-400 group-hover:text-blue-500 transition-colors" size={28} />
                    <span className="text-sm text-slate-600 font-medium">Click or drag to upload</span>
                    <span className="text-xs text-slate-500">Max 2MB</span>
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-between p-4 bg-blue-50 border border-blue-200 rounded-2xl">
                  <div className="flex items-center space-x-3 overflow-hidden">
                    <div className="w-12 h-12 rounded-lg overflow-hidden bg-slate-100 shrink-0 ring-2 ring-blue-200">
                      <img src={formData.image} alt="Preview" className="w-full h-full object-cover" />
                    </div>
                    <span className="text-sm font-medium text-slate-700 truncate">
                      Image uploaded successfully
                    </span>
                  </div>
                  <button 
                    type="button"
                    onClick={removeFile}
                    className="p-2 text-red-500 hover:bg-red-100 rounded-lg transition-colors"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-3 pt-4">
            <button 
              type="button"
              onClick={() => navigate('/dashboard')}
              className="flex-1 py-3 bg-slate-100 text-slate-700 font-semibold rounded-xl hover:bg-slate-200 transition-colors"
            >
              Cancel
            </button>
            <button 
              type="submit"
              className="flex-[2] py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all"
            >
              {isEditing ? 'Save Changes' : 'Create Item'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddItem;
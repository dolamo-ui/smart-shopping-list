import React from 'react';
import type { ShoppingItem, Category } from '../../types';
import { CATEGORY_CONFIG } from '../../constants';
import { Edit2, Trash2, StickyNote, Paperclip, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';

interface ItemCardProps {
  item: ShoppingItem;
  onDelete: (id: string) => void;
}

const ItemCard: React.FC<ItemCardProps> = ({ item, onDelete }) => {
  // ✅ FIX: Type assertion to tell TypeScript that item.category is a valid Category
  const config = CATEGORY_CONFIG[item.category as Category];

  return (
    <div className="group bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-md transition-all duration-300 p-5 flex flex-col h-full">
      <div className="flex justify-between items-start mb-4">
        <div className={`flex items-center space-x-2 px-3 py-1 rounded-full text-xs font-medium ${config.bg}`}>
          {config.icon}
          <span>{item.category}</span>
        </div>
        <div className="flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <Link 
            to={`/edit/${item.id}`}
            className="p-1.5 text-slate-400 hover:text-primary-600 dark:hover:text-primary-400 hover:bg-primary-50 dark:hover:bg-slate-700 rounded-lg transition-colors"
          >
            <Edit2 size={16} />
          </Link>
          <button 
            onClick={() => onDelete(item.id)}
            className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>

      <div className="flex-1">
        <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-1 leading-tight capitalize">
          {item.name}
        </h3>
        <p className="text-sm font-medium text-slate-500 dark:text-slate-400 flex items-center mb-3">
          Quantity: <span className="ml-1 text-primary-600 dark:text-primary-400 font-bold">{item.quantity}</span>
        </p>

        {item.notes && (
          <div className="flex items-start space-x-2 p-3 bg-slate-50 dark:bg-slate-900/50 rounded-xl mb-3">
            <StickyNote size={14} className="text-slate-400 mt-1 shrink-0" />
            <p className="text-sm text-slate-600 dark:text-slate-400 italic line-clamp-3">
              {item.notes}
            </p>
          </div>
        )}
      </div>

      {item.attachmentUrl && (
        <div className="mt-auto pt-3 border-t border-slate-100 dark:border-slate-700">
          <a 
            href={item.attachmentUrl} 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex items-center space-x-2 text-xs font-medium text-primary-600 dark:text-primary-400 hover:underline"
          >
            <Paperclip size={14} />
            <span className="truncate flex-1">{item.attachmentName || 'Attachment'}</span>
            <ExternalLink size={12} />
          </a>
          {item.attachmentUrl.startsWith('data:image/') && (
            <div className="mt-2 rounded-lg overflow-hidden h-24 w-full bg-slate-100 dark:bg-slate-900">
              <img src={item.attachmentUrl} alt={item.name} className="w-full h-full object-cover" />
            </div>
          )}
        </div>
      )}
      
      <div className="mt-3 text-[10px] text-slate-400 dark:text-slate-500 font-medium">
        Added {new Date(item.createdAt).toLocaleDateString()}
      </div>
    </div>
  );
};

export default ItemCard;
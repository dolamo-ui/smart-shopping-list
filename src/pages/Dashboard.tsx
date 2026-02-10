import React, { useState, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { removeItem } from '../store/shoppingListSlice';
import type { RootState } from '../store/store';
import ItemCard from '../components/ItemCard';
import { Category } from '../../types';
import { Search, Filter, Plus, PackageOpen } from 'lucide-react';
import { Link } from 'react-router-dom';

const Dashboard: React.FC = () => {
  const dispatch = useDispatch();
  const { items } = useSelector((state: RootState) => state.shoppingList);
  const { user } = useSelector((state: RootState) => state.login);
  
  const [search, setSearch] = useState('');
  const [filterCategory, setFilterCategory] = useState<Category | 'All'>('All');

  const handleDeleteItem = (id: string) => {
    dispatch(removeItem(id));
  };

  const filteredItems = useMemo(() => {
    return items.filter(item => {
      const matchesSearch = item.name.toLowerCase().includes(search.toLowerCase()) || 
                            item.notes?.toLowerCase().includes(search.toLowerCase());
      const matchesCategory = filterCategory === 'All' || item.category === filterCategory;
      return matchesSearch && matchesCategory;
    });
  }, [items, search, filterCategory]);

  return (
    <div className="space-y-8">
      
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-4xl font-bold text-slate-800">
            Welcome, {user?.name || 'Guest'}! 👋
          </h1>
          <p className="text-slate-600 mt-1 text-lg">
            You have <span className="font-semibold text-blue-600">{items.length}</span> items in your list
          </p>
        </div>
        <Link 
          to="/add" 
          className="flex items-center justify-center space-x-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all"
        >
          <Plus size={20} />
          <span>Add New Item</span>
        </Link>
      </header>

     
      <section className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
          <input 
            type="text"
            placeholder="Search items or notes..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
          />
        </div>
        <div className="relative md:w-56">
          <Filter className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value as any)}
            className="appearance-none w-full pl-12 pr-10 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all cursor-pointer"
          >
            <option value="All">All Categories</option>
            {Object.values(Category).map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
          <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
            <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>
      </section>

      
      {filteredItems.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredItems.map(item => (
            <ItemCard key={item.id} item={item} onDelete={handleDeleteItem} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-20 text-center bg-white rounded-3xl border-2 border-dashed border-slate-300">
          <div className="w-20 h-20 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center mb-6">
            <PackageOpen size={40} className="text-blue-600" />
          </div>
          <h3 className="text-2xl font-bold text-slate-800 mb-2">No items found</h3>
          <p className="text-slate-600 max-w-md mx-auto mb-6">
            {search || filterCategory !== 'All' 
              ? "We couldn't find any items matching your search criteria. Try adjusting your filters." 
              : "Your shopping list is empty. Start by adding your first item!"}
          </p>
          {(search || filterCategory !== 'All') ? (
            <button 
              onClick={() => { setSearch(''); setFilterCategory('All'); }}
              className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-all"
            >
              Clear all filters
            </button>
          ) : (
            <Link 
              to="/add"
              className="px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold rounded-xl transition-all"
            >
              Add your first item
            </Link>
          )}
        </div>
      )}
    </div>
  );
};


export default Dashboard;

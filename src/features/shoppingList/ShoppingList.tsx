import React, { useState, useEffect } from 'react';
import type { ChangeEvent } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useLocation } from 'react-router-dom';
import type { RootState, AppDispatch } from '../../app/store';
import { addItem, removeItem, clearList } from './shoppingListSlice';
import { v4 as uuidv4 } from 'uuid';

import ItemForm from './components/ItemForm';
import ItemList from './components/ItemList';
import SearchSortBar from './components/SearchSortBar';

import styles from './ShoppingList.module.css';

interface ShoppingItem {
  id: string;
  name: string;
  quantity: string;
  notes: string;
  category: string;
  image: string;
  dateAdded: number; // ✅ number for timestamp
}

const ShoppingList: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const location = useLocation();
  const items = useSelector((state: RootState) => state.shoppingList.items);

  const [searchTerm, setSearchTerm] = useState('');
  const [sortOption, setSortOption] = useState('');

  // Sync URL query params
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    setSearchTerm(params.get('search') || '');
    setSortOption(params.get('sort') || '');
  }, [location.search]);

  useEffect(() => {
    const params = new URLSearchParams();
    if (searchTerm) params.set('search', searchTerm);
    if (sortOption) params.set('sort', sortOption);
    navigate({ search: params.toString() }, { replace: true });
  }, [searchTerm, sortOption, navigate]);

  // Add new item
  const handleAddItem = (
    name: string,
    quantity: string,
    notes: string,
    category: string,
    image: File | null
  ) => {
    const newItem: ShoppingItem = {
      id: uuidv4(),
      name,
      quantity,
      notes,
      category,
      image: image ? URL.createObjectURL(image) : '',
      dateAdded: Date.now(),
    };
    dispatch(addItem(newItem));
  };

  // Filter items
  const filteredItems = items.filter((item) =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Sort items
  const sortedItems = [...filteredItems].sort((a, b) => {
    switch (sortOption) {
      case 'name-asc':
        return a.name.localeCompare(b.name);
      case 'name-desc':
        return b.name.localeCompare(a.name);
      case 'category':
        return a.category.localeCompare(b.category);
      default:
        return 0;
    }
  });

  return (
    <div className={styles.shoppingApp}>
      <header className={styles.header}>
        <h1>🛒 Shopping List</h1>
        <SearchSortBar
          searchTerm={searchTerm}
          sortOption={sortOption}
          onSearchChange={(e: ChangeEvent<HTMLInputElement>) =>
            setSearchTerm(e.target.value)
          }
          onSortChange={(e: ChangeEvent<HTMLSelectElement>) =>
            setSortOption(e.target.value)
          }
        />
      </header>

      <ItemList
        items={sortedItems}
        onRemove={(id) => dispatch(removeItem(id))}
      />

      <ItemForm onAddItem={handleAddItem} />

      <button
        className={styles.clearButton}
        onClick={() => dispatch(clearList())}
      >
        Clear List
      </button>
    </div>
  );
};

export default ShoppingList;

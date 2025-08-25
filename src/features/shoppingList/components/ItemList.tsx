import React from 'react';
import styles from './ItemList.module.css';
import ItemCard from './ItemCard';

export interface Item {
  id: string;
  name: string;
  quantity: string;
  notes: string;
  category: string;
  image: string;
  dateAdded: number; // ✅ must match ShoppingItem
}

interface Props {
  items: Item[];
  onRemove: (id: string) => void;
}

const ItemList: React.FC<Props> = ({ items, onRemove }) => (
  <section className={styles.listSection}>
    <ul className={styles.list}>
      {items.length === 0 ? (
        <p className={styles.empty}>No items yet. Add something!</p>
      ) : (
        items.map((item) => (
          <ItemCard 
            key={item.id} 
            item={item} 
            onRemove={onRemove} 
          />
        ))
      )}
    </ul>
  </section>
);

export default ItemList;

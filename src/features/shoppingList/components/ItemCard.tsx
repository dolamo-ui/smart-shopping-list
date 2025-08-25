import React from 'react';
import styles from './ItemCard.module.css';

interface Item {
  id: string;
  name: string;
  quantity: string;
  notes: string;
  category: string;
  image: string;
  dateAdded: number; // ✅ change to number to match Redux
}

interface Props {
  item: Item;
  onRemove: (id: string) => void;
}

const ItemCard: React.FC<Props> = ({ item, onRemove }) => (
  <li className={styles.card}>
    <h3>{item.name} (x{item.quantity})</h3>
    {item.notes && <p>{item.notes}</p>}
    <p><strong>Category:</strong> {item.category}</p>
    {item.image && <img src={item.image} alt={item.name} className={styles.image} />}
    <p><em>Added: {new Date(item.dateAdded).toLocaleString()}</em></p> {/* optional display */}
    <button className={styles.removeBtn} onClick={() => onRemove(item.id)}>
      Remove
    </button>
  </li>
);

export default ItemCard;

import React from 'react';
import type { ChangeEvent } from 'react'; // ✅ type-only import
import styles from './SearchSortBar.module.css';


interface Props {
  searchTerm: string;
  sortOption: string;
  onSearchChange: (e: ChangeEvent<HTMLInputElement>) => void;
  onSortChange: (e: ChangeEvent<HTMLSelectElement>) => void;
}

const SearchSortBar: React.FC<Props> = ({
  searchTerm,
  sortOption,
  onSearchChange,
  onSortChange,
}) => (
  <div className={styles.bar}>
    <input
      className={styles.search}
      type="text"
      placeholder="Search items..."
      value={searchTerm}
      onChange={onSearchChange}
    />
    <select className={styles.select} value={sortOption} onChange={onSortChange}>
      <option value="">Sort By</option>
      <option value="name-asc">Name A-Z</option>
      <option value="name-desc">Name Z-A</option>
      <option value="category">Category</option>
      <option value="date-asc">Oldest</option>
      <option value="date-desc">Newest</option>
    </select>
  </div>
);

export default SearchSortBar;

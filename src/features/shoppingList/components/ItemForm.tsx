import React, { useState } from "react";
import type { FormEvent, ChangeEvent } from "react"; // type-only import
import styles from "./ItemForm.module.css";

interface Props {
  onAddItem: (
    name: string,
    quantity: string,
    notes: string,
    category: string,
    image: File | null
  ) => void;
}

const ItemForm: React.FC<Props> = ({ onAddItem }) => {
  const [name, setName] = useState("");
  const [quantity, setQuantity] = useState("");
  const [notes, setNotes] = useState("");
  const [category, setCategory] = useState("");
  const [image, setImage] = useState<File | null>(null);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!name || !quantity || !category) return;
    onAddItem(name, quantity, notes, category, image);
    setName("");
    setQuantity("");
    setNotes("");
    setCategory("");
    setImage(null);
  };

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <h2 className={styles.title}>Add New Item</h2>

      <input
        type="text"
        placeholder="Item name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
        className={styles.input}
      />

      <input
        type="text"
        placeholder="Quantity (e.g., 2 liters, 1 pack)"
        value={quantity}
        onChange={(e) => setQuantity(e.target.value)}
        required
        className={styles.input}
      />

      <textarea
        placeholder="Optional notes"
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
        className={styles.textarea}
      />

      <select
        value={category}
        onChange={(e) => setCategory(e.target.value)}
        required
        className={styles.select}
      >
        <option value="">Select Category</option>
        <option value="Dairy">Dairy</option>
        <option value="Fruits">Fruits</option>
        <option value="Vegetables">Vegetables</option>
        <option value="Meat">Meat</option>
        <option value="Snacks">Snacks</option>
        <option value="Beverages">Beverages</option>
        <option value="Other">Other</option>
      </select>

      <input
        type="file"
        accept="image/*"
        onChange={(e: ChangeEvent<HTMLInputElement>) =>
          e.target.files && setImage(e.target.files[0])
        }
        className={styles.fileInput}
      />

      {image && (
        <img
          src={URL.createObjectURL(image)}
          alt="Preview"
          className={styles.preview}
        />
      )}

      <button type="submit" className={styles.button}>
        Add Item
      </button>
    </form>
  );
};

export default ItemForm;

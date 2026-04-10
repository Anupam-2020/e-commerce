import { FormEvent, useEffect, useMemo, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import { createProduct, deleteProduct, fetchProducts, updateProduct } from '../features/products/productsSlice';
import type { Product } from '../types';

const emptyForm = {
  name: '',
  price: '',
  category: '',
  stock: '',
  description: ''
};

export const AdminPage = () => {
  const dispatch = useAppDispatch();
  const products = useAppSelector((state) => state.products.items);
  const submitting = useAppSelector((state) => state.products.submitting);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);

  const editingProduct = useMemo(
    () => products.find((item) => item._id === editingId),
    [products, editingId]
  );

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  const populateForm = (product: Product) => {
    setEditingId(product._id);
    setForm({
      name: product.name,
      price: String(product.price),
      category: product.category,
      stock: String(product.stock),
      description: product.description || ''
    });
  };

  const resetForm = () => {
    setEditingId(null);
    setForm(emptyForm);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const payload = {
      name: form.name,
      price: Number(form.price),
      category: form.category,
      stock: Number(form.stock),
      description: form.description
    };

    if (editingId) {
      await dispatch(updateProduct({ id: editingId, data: payload }));
    } else {
      await dispatch(createProduct(payload));
    }

    resetForm();
  };

  return (
    <section className="grid-2">
      <form className="card stack-sm" onSubmit={handleSubmit}>
        <div>
          <p className="eyebrow">Admin</p>
          <h1>{editingProduct ? 'Edit product' : 'Create product'}</h1>
        </div>
        <input className="input" placeholder="Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
        <input className="input" placeholder="Price" type="number" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} />
        <input className="input" placeholder="Category" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} />
        <input className="input" placeholder="Stock" type="number" value={form.stock} onChange={(e) => setForm({ ...form, stock: e.target.value })} />
        <textarea className="input textarea" placeholder="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
        <div className="product-actions">
          <button className="btn" disabled={submitting}>{editingProduct ? 'Update' : 'Create'}</button>
          {editingProduct && <button type="button" className="btn btn-secondary" onClick={resetForm}>Cancel</button>}
        </div>
      </form>

      <div className="stack-sm">
        {products.map((product) => (
          <article className="card admin-list-item" key={product._id}>
            <div>
              <h3>{product.name}</h3>
              <p className="muted">{product.category} · ₹{product.price} · stock {product.stock}</p>
            </div>
            <div className="product-actions">
              <button className="btn btn-secondary" onClick={() => populateForm(product)}>Edit</button>
              <button className="btn danger" onClick={() => dispatch(deleteProduct(product._id))}>Delete</button>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
};

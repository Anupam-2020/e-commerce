import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import { fetchProducts, setFilters } from '../features/products/productsSlice';
import { addToCart, fetchCart } from '../features/cart/cartSlice';
import { Loader } from '../components/Loader';
import { EmptyState } from '../components/EmptyState';
import { ProductCard } from '../components/ProductCard';

export const HomePage = () => {
  const dispatch = useAppDispatch();
  const { items, loading, filters } = useAppSelector((state) => state.products);
  const { token } = useAppSelector((state) => state.auth);

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch, filters]);

  const updateFilter = (name: string, value: string) => {
    dispatch(setFilters({ [name]: value, page: 1 }));
  };

  const handleAddToCart = async (productId: string) => {
      try {
        await dispatch(addToCart({ productId, quantity: 1 })).unwrap();
        await dispatch(fetchCart()).unwrap();
      } catch (error) {
        console.error('Add to cart failed:', error);
      }
  };

  return (
    <section className="stack-lg">
      <div className="hero card">
        <div>
          <p className="eyebrow">React + Redux Toolkit + Fetch API</p>
          <h1>Modern storefront e-commerce App</h1>
        </div>
      </div>

      <div className="card filters-grid">
        <input
          className="input"
          placeholder="Category"
          value={String(filters.category || '')}
          onChange={(e) => updateFilter('category', e.target.value)}
        />
        <input
          className="input"
          placeholder="Min price"
          type="number"
          value={String(filters.minPrice || '')}
          onChange={(e) => updateFilter('minPrice', e.target.value)}
        />
        <input
          className="input"
          placeholder="Max price"
          type="number"
          value={String(filters.maxPrice || '')}
          onChange={(e) => updateFilter('maxPrice', e.target.value)}
        />
        <select
          className="input"
          value={String(filters.limit || 8)}
          onChange={(e) => dispatch(setFilters({ limit: Number(e.target.value), page: 1 }))}
        >
          <option value="8">8 per page</option>
          <option value="12">12 per page</option>
          <option value="16">16 per page</option>
        </select>
      </div>

      {loading ? (
        <Loader text="Loading products..." />
      ) : items.length === 0 ? (
        <EmptyState title="No products found" description="Try changing the filter values or add products from the admin panel." />
      ) : (
        <div className="products-grid">
          {items.map((product) => (
            <ProductCard
              key={product._id}
              product={product}
              onAddToCart={handleAddToCart}
              isAuthenticated={Boolean(token)}
            />
          ))}
        </div>
      )}
    </section>
  );
};

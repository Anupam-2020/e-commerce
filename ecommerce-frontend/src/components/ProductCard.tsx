import { Link } from 'react-router-dom';
import type { Product } from '../types';

export const ProductCard = ({ product, onAddToCart, isAuthenticated }: {
  product: Product;
  onAddToCart: (id: string) => void;
  isAuthenticated: boolean;
}) => {

  const handleAddToCart = (productId: string) => {
    onAddToCart(productId)
  }

  return (
    <article className="card product-card">
      <div className="product-card__content">
        <div className="product-card__meta">
          <span className="chip">{product.category}</span>
          <span className={product.stock > 0 ? 'stock in' : 'stock out'}>
            {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
          </span>
        </div>
        <h3>{product.name}</h3>
        <p className="muted">{product.description || 'No description added yet.'}</p>
      </div>
      <div className="product-card__footer">
        <strong>₹{product.price}</strong>
        <div className="product-actions">
          <Link className="btn btn-secondary" to={`/products/${product._id}`}>View</Link>
          {isAuthenticated && (
            <button className="btn" onClick={() => handleAddToCart(product._id)} disabled={product.stock <= 0}>
              Add to Cart
            </button>
          )}
        </div>
      </div>
    </article>
  );
};

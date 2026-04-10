import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import { clearCart, fetchCart, removeCartItem, updateCart } from '../features/cart/cartSlice';
import { placeOrder } from '../features/orders/ordersSlice';
import { EmptyState } from '../components/EmptyState';
import { Loader } from '../components/Loader';

export const CartPage = () => {
  const dispatch = useAppDispatch();
  const { cart, loading, updating } = useAppSelector((state) => state.cart);
  const { processing } = useAppSelector((state) => state.orders);

  useEffect(() => {
    dispatch(fetchCart());
  }, [dispatch]);

  const total = cart?.items?.reduce((sum, item) => {
    const product = typeof item.product === 'string' ? null : item.product;
    return sum + (product?.price || 0) * item.quantity;
  }, 0) || 0;

  const handlePlaceOrder = async () => {
    try {
      await dispatch(placeOrder()).unwrap();
      await dispatch(fetchCart()).unwrap();
    } catch (error) {
      console.error('Place order failed:', error);
    }
  };

  const handleUpdateCart = async (productId: string, quantity: number) => {
      try {
        await dispatch(updateCart({ productId, quantity })).unwrap();
      } catch (error) {
        console.error('Update cart failed:', error);
      }
  };

  if (loading) return <Loader text="Loading cart..." />;
  if (!cart || cart.items.length === 0) {
    return <EmptyState title="Your cart is empty" description="Browse the product list and add a few items first." />;
  }

  return (
    <section className="grid-2">
      <div className="stack-md">
        {cart.items.map((item, index) => {
          const product = typeof item.product === 'string' ? null : item.product;
          return (
            <article className="card cart-row" key={`${product?._id || index}-${index}`}>
              <div>
                <h3>{product?.name || 'Product'}</h3>
                <p className="muted">₹{product?.price || 0} each</p>
              </div>
              <div className="cart-actions">
                <input
                  className="qty-input"
                  type="number"
                  min="0"
                  value={item.quantity}
                  onChange={(e) => handleUpdateCart(product?._id || String(item.product), Number(e.target.value))}
                />
                <button className="btn btn-secondary" onClick={() => dispatch(removeCartItem(product?._id || String(item.product)))}>
                  Remove
                </button>
              </div>
            </article>
          );
        })}
      </div>

      <aside className="card summary-card">
        <h2>Cart summary</h2>
        <div className="summary-row"><span>Items</span><strong>{cart.items.length}</strong></div>
        <div className="summary-row"><span>Total</span><strong>₹{total}</strong></div>
        <button className="btn" onClick={handlePlaceOrder} disabled={processing || updating}>Place Order</button>
        <button className="btn btn-secondary" onClick={() => dispatch(clearCart())} disabled={updating}>Clear Cart</button>
        <Link className="link-inline" to="/orders">Go to orders</Link>
      </aside>
    </section>
  );
};

import type { Order } from '../types';

export const OrderCard = ({ order, onPay, onCancel, onStatusChange, isAdmin, processing }: {
  order: Order;
  onPay: (id: string) => void;
  onCancel: (id: string) => void;
  onStatusChange?: (id: string, status: string) => void;
  isAdmin?: boolean;
  processing?: boolean;
}) => {
  return (
    <article className="card order-card">
      <div className="order-head">
        <div>
          <h3>Order #{order._id.slice(-6)}</h3>
          <p className="muted">{order.createdAt ? new Date(order.createdAt).toLocaleString() : 'Recently created'}</p>
        </div>
        <div className="order-statuses">
          <span className="chip">Status: {order.status}</span>
          <span className="chip">Payment: {order.paymentStatus || 'pending'}</span>
        </div>
      </div>

      <div className="order-items">
        {order.items.map((item, index) => {
          const product = typeof item.product === 'string' ? { name: item.product } : item.product;
          return (
            <div key={`${order._id}-${index}`} className="order-item-row">
              <span>{product.name}</span>
              <span>Qty: {item.quantity}</span>
            </div>
          );
        })}
      </div>

      <div className="order-footer">
        <strong>Total: ₹{order.totalAmount}</strong>
        <div className="product-actions">
          {order.paymentStatus !== 'success' && order.status !== 'cancelled' && (
            <button className="btn" onClick={() => onPay(order._id)} disabled={processing}>Pay Now</button>
          )}
          {order.status !== 'shipped' && order.status !== 'delivered' && order.status !== 'cancelled' && (
            <button className="btn btn-secondary" onClick={() => onCancel(order._id)} disabled={processing}>Cancel</button>
          )}
          {isAdmin && onStatusChange && (
            <select
              className="select-inline"
              value={order.status}
              onChange={(e) => onStatusChange(order._id, e.target.value)}
            >
              <option value="pending">pending</option>
              <option value="paid">paid</option>
              <option value="shipped">shipped</option>
              <option value="delivered">delivered</option>
              <option value="cancelled">cancelled</option>
            </select>
          )}
        </div>
      </div>
    </article>
  );
};

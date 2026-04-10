import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import { fetchOrders, processPayment, cancelOrder, updateOrderStatus } from '../features/orders/ordersSlice';
import { Loader } from '../components/Loader';
import { EmptyState } from '../components/EmptyState';
import { OrderCard } from '../components/OrderCard';

export const OrdersPage = () => {
  const dispatch = useAppDispatch();
  const { items, loading, processing } = useAppSelector((state) => state.orders);
  const isAdmin = useAppSelector((state) => state.auth.user?.role === 'admin');

  useEffect(() => {
    dispatch(fetchOrders());
  }, [dispatch]);

  if (loading) return <Loader text="Loading orders..." />;
  if (items.length === 0) {
    return <EmptyState title="No orders yet" description="Place an order from your cart and it will show here." />;
  }

  return (
    <section className="stack-md">
      <div>
        <p className="eyebrow">Orders</p>
        <h1>Your order history</h1>
      </div>
      {items.map((order) => (
        <OrderCard
          key={order._id}
          order={order}
          processing={processing}
          isAdmin={isAdmin}
          onPay={(id) => dispatch(processPayment(id))}
          onCancel={(id) => dispatch(cancelOrder(id))}
          onStatusChange={(id, status) => dispatch(updateOrderStatus({ id, status }))}
        />
      ))}
    </section>
  );
};

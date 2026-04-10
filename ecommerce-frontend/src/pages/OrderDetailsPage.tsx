import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import { fetchOrderById, processPayment, cancelOrder, updateOrderStatus, resetSelectedOrder } from '../features/orders/ordersSlice';
import { Loader } from '../components/Loader';
import { OrderCard } from '../components/OrderCard';

export const OrderDetailsPage = () => {
  const { id = '' } = useParams();
  const dispatch = useAppDispatch();
  const { selected, processing } = useAppSelector((state) => state.orders);
  const isAdmin = useAppSelector((state) => state.auth.user?.role === 'admin');

  useEffect(() => {
    dispatch(fetchOrderById(id));
    return () => {
      dispatch(resetSelectedOrder());
    };
  }, [dispatch, id]);

  if (!selected) return <Loader text="Loading order..." />;

  return (
    <section className="stack-md">
      <div>
        <p className="eyebrow">Order detail</p>
        <h1>Single order view</h1>
      </div>
      <OrderCard
        order={selected}
        processing={processing}
        isAdmin={isAdmin}
        onPay={(orderId) => dispatch(processPayment(orderId))}
        onCancel={(orderId) => dispatch(cancelOrder(orderId))}
        onStatusChange={(orderId, status) => dispatch(updateOrderStatus({ id: orderId, status }))}
      />
    </section>
  );
};

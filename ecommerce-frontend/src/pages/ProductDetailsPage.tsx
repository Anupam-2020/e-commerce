import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import { fetchProductById, resetSelectedProduct } from '../features/products/productsSlice';
import { addToCart, fetchCart } from '../features/cart/cartSlice';
import { Loader } from '../components/Loader';

export const ProductDetailsPage = () => {
  const { id = '' } = useParams();
  const dispatch = useAppDispatch();
  const { selected, loading } = useAppSelector((state) => state.products);
  const { token } = useAppSelector((state) => state.auth);

  useEffect(() => {
    dispatch(fetchProductById(id));
    return () => {
      dispatch(resetSelectedProduct());
    };
  }, [dispatch, id]);

  if (loading || !selected) {
    return <Loader text="Loading product..." />;
  }

  const handleAdd = async () => {
    await dispatch(addToCart({ productId: selected._id, quantity: 1 }));
    await dispatch(fetchCart());
  };

  return (
    <section className="card details-card">
      <div className="details-main">
        <p className="eyebrow">{selected.category}</p>
        <h1>{selected.name}</h1>
        <p className="muted">{selected.description || 'No description available.'}</p>
        <div className="details-stats">
          <span className="chip">Price: ₹{selected.price}</span>
          <span className="chip">Stock: {selected.stock}</span>
        </div>
      </div>
      {token && (
        <button className="btn" onClick={handleAdd} disabled={selected.stock <= 0}>Add to cart</button>
      )}
    </section>
  );
};

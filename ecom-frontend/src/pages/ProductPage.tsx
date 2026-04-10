import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchProducts } from "../features/products/productSlice";
import type { AppDispatch, RootState } from "../app/store";
import { addToCart } from "../features/cart/cartSlice";


export const ProductPage = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { items, loading } = useSelector((state: RootState) => state.products);

  useEffect(() => {
    dispatch(fetchProducts());
  }, []);

  if (loading) return <p>Loading...</p>;

  return (
    <div className="container">
      <h2>Products</h2>
      <div className="grid">
        {items.map((p: any) => (
          <div key={p._id} className="card">
            <h4>{p.name}</h4>
            <p>₹{p.price}</p>
            <button onClick={() => dispatch(addToCart(p._id))}>Add to Cart</button>
          </div>
        ))}
      </div>
    </div>
  );
};
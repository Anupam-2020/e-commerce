import { useDispatch, useSelector } from "react-redux"
import type { AppDispatch, RootState } from "../app/store";
import { useEffect } from "react";
import { fetchCart, removeCart, updateCart } from "../features/cart/cartSlice";

export const CartPage = () => {
    const dispatch = useDispatch<AppDispatch>();
    const { items } = useSelector((state: RootState) => state.cart);

    useEffect(() => {
        dispatch(fetchCart());
    }, []);

    return (
        <div className="container">
            <h2>Your Cart</h2>

          {items.length === 0 && <p>No items in cart</p>}

          {items.map((item: any) => (
            <div key={item._id} className="card">
                <h4>{item.name}</h4>
                <p>₹{item.price}</p>

                {/* 👇 HERE */}
                <input
                  type="number"
                  defaultValue={item.quantity}
                  value={item.quantity}
                  min={1}
                  onBlur={(e) =>
                    dispatch(
                      updateCart({
                        id: item._id,          // cart item id
                        quantity: Number(e.target.value)
                      })
                    )
                  }
                />

                <button onClick={() => dispatch(removeCart(item._id))}>
                  Remove
                </button>
              </div>
            ))}
      </div>
  );
};
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import { logout } from '../features/auth/authSlice';
import { resetCartState } from '../features/cart/cartSlice';

export const Navbar = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { user, token } = useAppSelector((state) => state.auth);
  const itemCount = useAppSelector((state) =>
    state.cart.cart?.items?.reduce((sum, item) => sum + item.quantity, 0) || 0
  );

  const handleLogout = () => {
    dispatch(logout());
    dispatch(resetCartState());
    navigate('/login');
  };

  return (
    <header className="navbar">
      <div className="container navbar-inner">
        <Link to="/" className="brand">ShopStack</Link>
        <nav className="nav-links">
          <NavLink to="/">Products</NavLink>
          {token && <NavLink to="/cart">Cart ({itemCount})</NavLink>}
          {token && <NavLink to="/orders">Orders</NavLink>}
          {user?.role === 'admin' && <NavLink to="/admin">Admin</NavLink>}
        </nav>
        <div className="nav-actions">
          {token ? (
            <>
              <span className="user-badge">{user?.email}</span>
              <button className="btn btn-secondary" onClick={handleLogout}>Logout</button>
            </>
          ) : (
            <>
              <Link className="btn btn-secondary" to="/login">Login</Link>
              <Link className="btn" to="/signup">Signup</Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

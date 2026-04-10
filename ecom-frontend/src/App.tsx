import './App.css'
import { ProductPage } from './pages/ProductPage';
import { CartPage } from './pages/CartPage';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';

function App() {
  return (
    <BrowserRouter>
      <nav style={{ padding: 10 }}>
        <Link to="/">Products</Link> |{" "}
        <Link to="/cart">Cart</Link>
      </nav>
      <Routes>
        <Route path='/' element={<ProductPage />}/>
        <Route path='/cart' element={<CartPage />}/>
      </Routes>
    </BrowserRouter>
  );
}

export default App;

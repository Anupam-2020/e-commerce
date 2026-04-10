import { FormEvent, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import { clearAuthError, signupUser } from '../features/auth/authSlice';

export const SignupPage = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { token, loading, error } = useAppSelector((state) => state.auth);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  useEffect(() => {
    if (token) navigate('/');
    return () => {
      dispatch(clearAuthError());
    };
  }, [token, navigate, dispatch]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    await dispatch(signupUser({ email, password }));
  };

  return (
    <div className="auth-wrapper">
      <form className="card auth-card" onSubmit={handleSubmit}>
        <h1>Create account</h1>
        <p className="muted">Simple signup connected to your existing backend auth endpoints.</p>
        {error && <p className="error-text">{error}</p>}
        <input className="input" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
        <input className="input" placeholder="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
        <button className="btn" disabled={loading}>{loading ? 'Creating...' : 'Signup'}</button>
        <p className="muted small">Already have an account? <Link to="/login">Login</Link></p>
      </form>
    </div>
  );
};

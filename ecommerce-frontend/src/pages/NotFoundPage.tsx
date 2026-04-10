import { Link } from 'react-router-dom';

export const NotFoundPage = () => {
  return (
    <div className="card empty-state">
      <h1>Page not found</h1>
      <p className="muted">The page you are looking for does not exist.</p>
      <Link className="btn" to="/">Go home</Link>
    </div>
  );
};

import { Link } from 'react-router-dom';

export default function AuthFooter({ dark = false }) {
  const linkClass = dark
    ? 'text-primary-200 hover:text-white'
    : 'text-gray-500 hover:text-primary-600';
  return (
    <div className="mt-8 text-center">
      <p className={dark ? 'text-primary-200 text-sm' : 'text-gray-400 text-sm'}>
        © {new Date().getFullYear()} PropEstate. All rights reserved.
      </p>
      <div className="flex justify-center flex-wrap gap-x-6 gap-y-1 mt-2 text-sm">
        <Link to="/about" className={linkClass}>About</Link>
        <Link to="/contact" className={linkClass}>Contact</Link>
        <Link to="/terms" className={linkClass}>Terms</Link>
        <Link to="/privacy" className={linkClass}>Privacy</Link>
      </div>
    </div>
  );
}

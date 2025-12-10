"use client";

import { usePathname, useRouter } from 'next/navigation';

export default function Header() {
  const pathname = usePathname();
  const router = useRouter();

  const getBasePath = () => {
    return process.env.NEXT_PUBLIC_BASE_PATH || '/netcdfaster';
  };

  const navigate = (path) => {
    const basePath = getBasePath();
    const fullPath = basePath ? `${basePath}${path}` : path;
    router.push(fullPath);
  };

  const isActive = (path) => {
    const basePath = getBasePath();
    const fullPath = basePath ? `${basePath}${path}` : path;

    // Handle home route
    if (path === '/') {
      return pathname === fullPath || pathname === basePath;
    }

    return pathname.startsWith(fullPath);
  };

  return (
    <header className="navbar bg-base-100 shadow-lg sticky top-0 z-50 border-b border-gray-200 dark:border-gray-700">
      <div className="navbar-start">
        {/* Logo/Brand */}
        <button
          onClick={() => navigate('/')}
          className="btn btn-ghost text-xl font-bold text-primary flex items-center gap-2"
        >
          NetCDFaster
        </button>
        <span className="badge badge-warning badge-sm">V0.5</span>
      </div>

      <div className="navbar-center hidden lg:flex">
        <ul className="menu menu-horizontal px-1 gap-2">
          <li>
            <button
              onClick={() => navigate('/')}
              className={`btn btn-ghost ${
                isActive('/') && !isActive('/file_meta') && !isActive('/about')
                  ? 'btn-active bg-primary/10 text-primary'
                  : ''
              }`}
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                />
              </svg>
              Home
            </button>
          </li>
          <li>
            <button
              onClick={() => navigate('/about')}
              className={`btn btn-ghost ${
                isActive('/about') ? 'btn-active bg-primary/10 text-primary' : ''
              }`}
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              About
            </button>
          </li>
          <li>
            <button
              onClick={() => navigate('/file_meta')}
              className={`btn btn-ghost ${
                isActive('/file_meta') ? 'btn-active bg-primary/10 text-primary' : ''
              }`}
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
              NC File Parse
            </button>
          </li>
        </ul>
      </div>

      {/* Mobile Menu */}
      <div className="navbar-end lg:hidden">
        <div className="dropdown dropdown-end">
          <label tabIndex={0} className="btn btn-ghost btn-circle">
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </label>
          <ul
            tabIndex={0}
            className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52 border border-gray-200 dark:border-gray-700"
          >
            <li>
              <button
                onClick={() => navigate('/')}
                className={isActive('/') && !isActive('/file_meta') && !isActive('/about') ? 'active' : ''}
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                  />
                </svg>
                Home
              </button>
            </li>
            <li>
              <button
                onClick={() => navigate('/about')}
                className={isActive('/about') ? 'active' : ''}
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                About
              </button>
            </li>
            <li>
              <button
                onClick={() => navigate('/file_meta')}
                className={isActive('/file_meta') ? 'active' : ''}
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
                NC File Parse
              </button>
            </li>
          </ul>
        </div>
      </div>

      <div className="navbar-end hidden lg:flex">
        {/* Optional: Add user menu or settings here */}
      </div>
    </header>
  );
}

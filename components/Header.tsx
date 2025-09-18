import {
  Header as HeaderType,
  NavLink,
} from '@/lib/types';

interface HeaderProps {
  header: HeaderType;
}

export function Header({ header }: HeaderProps) {
  const headerData = {
    brandName: header.brand_name,
    navigation: header.navigation?.nav_link || [],
  };

  return (
    <header className="bg-slate-800 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Name */}
          <div className="flex-shrink-0">
            <h1 className="text-white text-xl font-bold" {...(header?.$ && header?.$.brand_name)}>
              {headerData.brandName}
            </h1>
          </div>

          {/* Navigation */}
          <nav className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
              {headerData.navigation.map((navItem: NavLink, index: number) => (
                <a
                  key={index}
                  href={navItem.href}
                  className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors"
                  {...(navItem?.$ && navItem?.$.title)}
                >
                  {navItem.title}
                </a>
              ))}
            </div>
          </nav>

          {/* Search and Cart */}
          <div className="flex items-center space-x-4">
            <div className="relative">
              <input
                type="text"
                placeholder="Search"
                className="bg-slate-700 text-white placeholder-gray-400 rounded-lg px-4 py-2 w-64 focus:outline-none focus:ring-2 focus:ring-red-500"
              />
              <svg
                className="absolute right-3 top-2.5 h-4 w-4 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
            <button className="relative bg-red-600 hover:bg-red-700 text-white rounded-full p-2 transition-colors">
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13l2.5 5m0 0h10"
                />
              </svg>
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                0
              </span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
